import React, { useRef, useState, useMemo, useCallback, useEffect } from "react";
import Globe from "react-globe.gl";

/**
 * Proximity-based marker suppression: iterates through markers and only
 * accepts those that are not within a minimum distance of an already-accepted
 * marker.  Uses a spatial hash for fast neighbour lookups so the algorithm
 * stays close to O(n) even with thousands of markers.
 *
 * Isolated markers are ALWAYS visible — only dense clusters are thinned out.
 */
function decimateByProximity(markers, altitude) {
  if (!markers || markers.length === 0) return [];

  // Show every marker once close enough
  if (altitude < 0.01) return markers;

  // Minimum separation in degrees — scales with altitude.
  // altitude 2.5 → ~5°   (heavily clustered areas collapse)
  // altitude 1.0 → ~2°
  // altitude 0.5 → ~1°
  const minDist = altitude;
  const minDistSq = minDist * minDist;
  const cellSize = minDist * 0.75; // spatial-hash cell matches the radius

  const grid = new Map(); // spatial hash: "cellX_cellY" → [accepted markers]
  const accepted = [];

  for (const marker of markers) {
    if (marker.lat == null || marker.lng == null) continue;

    const cx = Math.floor(marker.lng / cellSize);
    const cy = Math.floor(marker.lat / cellSize);

    // Check the 3×3 neighbourhood for an already-accepted marker that is
    // too close — if one is found, skip this marker.
    let tooClose = false;
    for (let dx = -1; dx <= 1 && !tooClose; dx++) {
      for (let dy = -1; dy <= 1 && !tooClose; dy++) {
        const neighbours = grid.get(`${cx + dx}_${cy + dy}`);
        if (!neighbours) continue;
        for (const n of neighbours) {
          const dlat = marker.lat - n.lat;
          const dlng = marker.lng - n.lng;
          if (dlat * dlat + dlng * dlng < minDistSq) {
            tooClose = true;
            break;
          }
        }
      }
    }

    if (!tooClose) {
      accepted.push(marker);
      const key = `${cx}_${cy}`;
      if (!grid.has(key)) grid.set(key, []);
      grid.get(key).push(marker);
    }
  }

  return accepted;
}

const getGlobeTileEngineUrl = (x, y, l) =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${l}/${y}/${x}`;

export function GlobeVisualization({ markers, onMarkerClick, onMarkerHover }) {
  const globeEl = useRef();
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [altitude, setAltitude] = useState(2.5);
  const [hoveredId, setHoveredId] = useState(null);
  const debounceRef = useRef(null);
  const elementCache = useRef(new Map());

  const onMarkerClickRef = useRef(onMarkerClick);
  const onMarkerHoverRef = useRef(onMarkerHover);

  // Keep references to event callbacks fresh without triggering re-renders
  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
    onMarkerHoverRef.current = onMarkerHover;
  }, [onMarkerClick, onMarkerHover]);

  // Measure container dimensions
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Debounced altitude tracker — avoids re-rendering on every frame
  const onControlsChange = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (globeEl.current) {
        const pov = globeEl.current.pointOfView();
        setAltitude(pov.altitude);
      }
    }, 120);
  }, []);

  const initializedRef = useRef(false);

  useEffect(() => {
    if (globeEl.current && !initializedRef.current) {
      initializedRef.current = true;
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      globeEl.current.pointOfView({ altitude: 2.5 });

      // Stop rotating when user interacts (drags)
      controls.addEventListener("start", () => {
        controls.autoRotate = false;
      });
    }
  }, [dimensions.width, dimensions.height]);

  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.addEventListener("change", onControlsChange);

      return () => {
        controls.removeEventListener("change", onControlsChange);
        if (debounceRef.current) clearTimeout(debounceRef.current);
      };
    }
  }, [onControlsChange, dimensions.width, dimensions.height]);

  // Compute the visible subset of markers based on current altitude
  // Moving the hovered marker to the end of the array guarantees it gets rendered last in the DOM and remains on top.
  const visibleMarkers = useMemo(() => {
    const list = decimateByProximity(markers, altitude);
    if (!hoveredId) return list;
    const index = list.findIndex((m) => m.id === hoveredId);
    if (index > -1) {
      const copy = [...list];
      const [item] = copy.splice(index, 1);
      copy.push(item);
      return copy;
    }
    return list;
  }, [markers, altitude, hoveredId]);

  // Memoized HTML marker generator utilizing DOM element caching
  const htmlElement = useCallback((d) => {
    if (elementCache.current.has(d.id)) {
      return elementCache.current.get(d.id);
    }

    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.pointerEvents = "auto";
    container.style.cursor = "pointer";

    const circle = document.createElement("div");
    circle.style.width = "10px";
    circle.style.height = "10px";
    circle.style.borderRadius = "50%";
    circle.style.backgroundColor = d.color;
    circle.style.border = "1px solid white";
    circle.style.boxShadow = "0 2px 4px rgba(0,0,0,0.5)";
    circle.style.position = "absolute";
    circle.style.transform = "translate(-50%, -50%)";

    const label = document.createElement("div");
    label.innerText = d.name;
    label.style.position = "absolute";
    label.style.bottom = "12px";
    label.style.left = "50%";
    label.style.transform = "translateX(-50%)";
    label.style.backgroundColor = "rgba(10, 10, 10, 0.9)";
    label.style.color = "white";
    label.style.padding = "4px 8px";
    label.style.borderRadius = "4px";
    label.style.fontSize = "12px";
    label.style.fontWeight = "bold";
    label.style.fontFamily = "Inter, sans-serif";
    label.style.whiteSpace = "nowrap";
    label.style.boxShadow = "0 4px 6px rgba(10,10,10,0.3)";
    label.style.pointerEvents = "none";
    label.style.opacity = "0";
    label.style.transition = "opacity 0.2s ease, bottom 0.2s ease";
    label.style.textTransform = "uppercase";
    label.style.letterSpacing = "0.05em";
    label.style.zIndex = "10";

    container.appendChild(circle);
    container.appendChild(label);

    container.onclick = () => {
      if (onMarkerClickRef.current) onMarkerClickRef.current(d);
    };
    container.onmouseenter = () => {
      label.style.opacity = "1";
      label.style.bottom = "16px";
      container.style.zIndex = "9999";
      if (container.parentElement) {
        container.parentElement.style.zIndex = "9999";
      }
      setHoveredId(d.id);
      if (onMarkerHoverRef.current) onMarkerHoverRef.current(d);
    };
    container.onmouseleave = () => {
      label.style.opacity = "0";
      label.style.bottom = "12px";
      container.style.zIndex = "";
      if (container.parentElement) {
        container.parentElement.style.zIndex = "";
      }
      setHoveredId(null);
      if (onMarkerHoverRef.current) onMarkerHoverRef.current(null);
    };

    elementCache.current.set(d.id, container);
    return container;
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing">
      {dimensions.width > 0 && dimensions.height > 0 && (
        <Globe
          ref={globeEl}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          globeTileEngineUrl={getGlobeTileEngineUrl}
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          backgroundColor="#000000"
          showAtmosphere={true}
          atmosphereColor="#3a228a"
          atmosphereAltitude={0.15}

          // Use HTML elements so they don't scale with zoom
          htmlElementsData={visibleMarkers}
          htmlElement={htmlElement}
        />
      )}
    </div>
  );
}
