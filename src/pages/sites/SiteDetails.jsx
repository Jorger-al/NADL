import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "../../context/ToastContext";

export default function SiteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [backupSite, setBackupSite] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmAction, setConfirmAction] = useState(null); // 'delete' | null

  useEffect(() => {
    async function fetchSite() {
      try {
        const response = await fetch(`/directus-api/items/sites/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch site");
        }

        const result = await response.json();
        setSite(result.data);
      } catch (err) {
        showToast(err.message, "error");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSite();
  }, [id]);

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const canEdit = currentUser && (currentUser.role === "admin" || currentUser.role === "editor");

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const payload = { ...site };

      const numberFields = [
        "depth",
        "radius",
        "weight",
        "tpq",
        "taq",
        "cns",
        "ca",
        "date_found",
        "date_recovered",
        "lat",
        "lng"
      ];

      numberFields.forEach(field => {
        if (payload[field] === "" || payload[field] === undefined || payload[field] === null) {
          payload[field] = null;
        } else {
          const parsed = parseFloat(payload[field]);
          payload[field] = isNaN(parsed) ? null : parsed;
        }
      });

      const response = await fetch(`/directus-api/items/sites/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.errors?.[0]?.message || "Failed to update site details."
        );
      }

      setSite(result.data);
      setBackupSite(result.data);
      showToast("Site details updated successfully!", "success");
      setIsEditing(false);
    } catch (err) {
      showToast(err.message, "error");
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setConfirmAction(null);
    setLoading(true);
    try {
      const response = await fetch(`/directus-api/items/sites/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.errors?.[0]?.message || "Failed to delete site.");
      }

      setLoading(false);
      showToast("Site deleted successfully! Redirecting...", "success");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      showToast(err.message, "error");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading site...
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Site not found.
      </div>
    );
  }

  const heroImage =
    site.hero_image ||
    "https://images.unsplash.com/photo-1498623116890-37e912163d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";

  const RenderTableRow = ({ label, fieldName, type = "text" }) => {
    const value = site[fieldName];

    const handleChange = (val) => {
      setSite(prev => ({ ...prev, [fieldName]: val }));
    };

    return (
      <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
        <td className="py-3.5 px-4 font-semibold text-gray-500 w-1/3 text-xs uppercase tracking-wider">
          {label}
        </td>
        <td className="py-3.5 px-4 text-gray-800 text-sm">
          {isEditing ? (
            type === "textarea" ? (
              <textarea
                value={value || ""}
                onChange={(e) => handleChange(e.target.value)}
                className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm p-2 text-sm text-[#374151] focus:outline-none focus:border-[#1e3a5f]/40"
                rows={3}
              />
            ) : type === "boolean" ? (
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(e) => handleChange(e.target.checked)}
                className="w-4 h-4 text-[#1e3a5f] border-gray-300 rounded focus:ring-[#1e3a5f] cursor-pointer"
              />
            ) : (
              <input
                type={type === "number" ? "number" : "text"}
                step={type === "number" ? "any" : undefined}
                value={value === null || value === undefined ? "" : value}
                onChange={(e) => {
                  const val = e.target.value;
                  handleChange(type === "number" ? (val === "" ? null : parseFloat(val)) : val);
                }}
                className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-3 py-1.5 text-sm text-[#374151] focus:outline-none focus:border-[#1e3a5f]/40"
              />
            )
          ) : (
            type === "boolean" ? (
              value ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Yes (Verified)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  No (Pending Review)
                </span>
              )
            ) : value === null || value === undefined || value === "" ? (
              <span className="text-gray-400">—</span>
            ) : (
              String(value)
            )
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen font-body flex flex-col text-[#222]">
      <TopNavBar />

      {/* ACTION BAR (only for admin/editor) */}
      {canEdit && (
        <div className="sticky top-20 z-30 bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center shadow-sm">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {isEditing ? "Editing Site Details" : "Site Management"}
            </span>
          </div>
          <div className="flex gap-3">
            {!isEditing ? (
              <>
                <button
                  onClick={() => {
                    setBackupSite({ ...site });
                    setIsEditing(true);
                    setError("");
                  }}
                  className="bg-[#2f4050] hover:bg-[#1e3a5f] text-white py-2 px-6 font-medium tracking-wider uppercase text-xs transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  EDIT SITE
                </button>
                {currentUser?.role === "admin" && (
                  <button
                    onClick={() => setConfirmAction("delete")}
                    className="border border-[#c62828] text-[#c62828] py-2 px-6 font-medium tracking-wider uppercase text-xs hover:bg-[#c62828] hover:text-white transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    DELETE SITE
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#1e3a5f] hover:bg-[#2f4050] disabled:opacity-50 text-white py-2 px-6 font-medium tracking-wider uppercase text-xs transition-colors duration-300 flex items-center gap-2"
                >
                  {saving ? "Saving..." : "SAVE CHANGES"}
                </button>
                <button
                  onClick={() => {
                    setSite(backupSite);
                    setIsEditing(false);
                    setError("");
                  }}
                  disabled={saving}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-6 font-medium tracking-wider uppercase text-xs transition-colors duration-300"
                >
                  CANCEL
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="w-full max-w-[1200px] mx-auto px-6 mt-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-xs text-red-700">{error}</p>
          </div>
        </div>
      )}

      <main className="flex-1 pt-16">

        {/* HERO */}
        <section className="relative w-full h-[55vh] flex items-center justify-center overflow-hidden">

          <div className="absolute inset-0 z-0">
            <img
              src={heroImage}
              alt={site.name}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          <div className="relative z-10 text-center px-4 w-full max-w-[1200px] mx-auto flex flex-col items-center">
            {isEditing ? (
              <input
                type="text"
                value={site.name || ""}
                onChange={(e) => setSite({ ...site, name: e.target.value })}
                className="bg-white/10 text-white text-3xl md:text-5xl font-extralight tracking-wide mb-6 font-display border border-white/20 px-4 py-2 w-full max-w-xl text-center focus:outline-none focus:border-white/60"
              />
            ) : (
              <h1 className="text-white text-5xl md:text-7xl font-extralight tracking-wide mb-6 font-display">
                {site.name}
              </h1>
            )}

            {isEditing ? (
              <textarea
                value={site.description || ""}
                onChange={(e) => setSite({ ...site, description: e.target.value })}
                className="bg-white/10 text-white text-base font-light max-w-3xl mb-10 w-full text-center border border-white/20 px-4 py-2 focus:outline-none focus:border-white/60"
                rows={3}
              />
            ) : (
              <p className="text-gray-200 text-lg md:text-xl font-light max-w-3xl mb-10">
                {site.description || "No description available."}
              </p>
            )}

            {isEditing ? (
              <div className="flex gap-4 flex-wrap justify-center my-4 bg-black/35 p-4 rounded-sm border border-white/10">
                <div className="flex flex-col items-center">
                  <label className="text-[9px] text-gray-300 uppercase tracking-widest mb-1">Country</label>
                  <input
                    type="text"
                    value={site.country || ""}
                    onChange={(e) => setSite({ ...site, country: e.target.value })}
                    className="bg-white/10 border border-white/20 px-3 py-1 text-white uppercase tracking-widest text-xs text-center focus:outline-none focus:border-white/50 w-36"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="text-[9px] text-gray-300 uppercase tracking-widest mb-1">Status</label>
                  <input
                    type="text"
                    value={site.status || ""}
                    onChange={(e) => setSite({ ...site, status: e.target.value })}
                    className="bg-white/10 border border-white/20 px-3 py-1 text-white uppercase tracking-widest text-xs text-center focus:outline-none focus:border-white/50 w-36"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="text-[9px] text-gray-300 uppercase tracking-widest mb-1">Category</label>
                  <input
                    type="text"
                    value={site.layer_category || ""}
                    onChange={(e) => setSite({ ...site, layer_category: e.target.value })}
                    className="bg-white/10 border border-white/20 px-3 py-1 text-white uppercase tracking-widest text-xs text-center focus:outline-none focus:border-white/50 w-36"
                  />
                </div>
              </div>
            ) : (
              <div className="flex gap-4 flex-wrap justify-center">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2 text-white uppercase tracking-widest text-xs">
                  {site.country || "Unknown Country"}
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2 text-white uppercase tracking-widest text-xs">
                  {site.status || "Unknown Status"}
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2 text-white uppercase tracking-widest text-xs">
                  {site.layer_category || "Other"}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CONTENT */}
        <section className="w-full max-w-[1200px] mx-auto px-6 py-24 space-y-20">

          {/* DESCRIPTION */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">

            <div className="w-full md:w-1/2">
              <div className="aspect-square overflow-hidden border border-gray-200 bg-white p-2">
                <img
                  src={
                    site.site_image ||
                    "https://images.unsplash.com/photo-1505118380757-91f5f5632de0"
                  }
                  alt={site.name}
                  className="w-full h-full object-cover grayscale-[20%]"
                />
              </div>
              {isEditing && (
                <div className="mt-4">
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Secondary Image URL</label>
                  <input
                    type="text"
                    value={site.site_image || ""}
                    onChange={(e) => setSite({ ...site, site_image: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-sm px-3 py-1.5 text-xs text-[#374151] focus:outline-none focus:border-[#1e3a5f]/40"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-light text-[#1e3a5f] mb-8 font-display tracking-wide">
                Site Description
              </h2>

              {isEditing ? (
                <textarea
                  value={site.description || ""}
                  onChange={(e) => setSite({ ...site, description: e.target.value })}
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm p-4 text-sm text-[#374151] focus:outline-none focus:border-[#1e3a5f]/40"
                  rows={8}
                />
              ) : (
                <p className="text-[#4b5563] text-lg leading-relaxed mb-8 font-light">
                  {site.description || "No description available."}
                </p>
              )}
            </div>
          </div>

          {/* METADATA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="bg-white border border-gray-200 p-8">
              <h3 className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-4 font-semibold">
                Coordinates
              </h3>

              {isEditing ? (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={site.lat === null || site.lat === undefined ? "" : site.lat}
                      onChange={(e) => setSite({ ...site, lat: e.target.value === "" ? null : parseFloat(e.target.value) })}
                      className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-3 py-1.5 text-sm text-[#374151] focus:outline-none focus:border-[#1e3a5f]/40"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={site.lng === null || site.lng === undefined ? "" : site.lng}
                      onChange={(e) => setSite({ ...site, lng: e.target.value === "" ? null : parseFloat(e.target.value) })}
                      className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-3 py-1.5 text-sm text-[#374151] focus:outline-none focus:border-[#1e3a5f]/40"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-2xl font-light text-[#1e3a5f]">
                  {site.lat}, {site.lng}
                </p>
              )}
            </div>

            <div className="bg-white border border-gray-200 p-8">
              <h3 className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-4 font-semibold">
                Region
              </h3>

              {isEditing ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest">Concelho</label>
                    <input
                      type="text"
                      value={site.concelho || ""}
                      onChange={(e) => setSite({ ...site, concelho: e.target.value })}
                      className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-3 py-1.5 text-sm text-[#374151] focus:outline-none focus:border-[#1e3a5f]/40"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest">Distrito</label>
                    <input
                      type="text"
                      value={site.distrito || ""}
                      onChange={(e) => setSite({ ...site, distrito: e.target.value })}
                      className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-3 py-1.5 text-sm text-[#374151] focus:outline-none focus:border-[#1e3a5f]/40"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-2xl font-light text-[#1e3a5f]">
                  {[
                    site.concelho,
                    site.distrito,
                    site.country
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
            </div>

          </div>

          {/* ADDITIONAL INFO TABLE */}
          <div className="bg-white border border-gray-200 p-8">
            <h3 className="text-sm uppercase tracking-[0.2em] text-[#1e3a5f] font-semibold mb-6">
              Additional Information
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <tbody>
                  <RenderTableRow label="Reference / Código" fieldName="ref" />
                  <RenderTableRow label="Typology" fieldName="typology" />
                  <RenderTableRow label="Period" fieldName="period" />
                  <RenderTableRow label="Depth (m)" fieldName="depth" type="number" />
                  <RenderTableRow label="Radius (m)" fieldName="radius" type="number" />
                  <RenderTableRow label="Dimensions" fieldName="dimensions" />
                  <RenderTableRow label="Weight (kg)" fieldName="weight" type="number" />
                  <RenderTableRow label="Flag" fieldName="flag" />
                  <RenderTableRow label="Place of Origin" fieldName="place_of_origin" />
                  <RenderTableRow label="Place of Destiny" fieldName="place_of_destiny" />
                  <RenderTableRow label="Terminus Post Quem (TPQ)" fieldName="tpq" type="number" />
                  <RenderTableRow label="Terminus Ante Quem (TAQ)" fieldName="taq" type="number" />
                  <RenderTableRow label="CNS" fieldName="cns" type="number" />
                  <RenderTableRow label="Endovélico Designation" fieldName="endovelico_designation" />
                  <RenderTableRow label="CA" fieldName="ca" type="number" />
                  <RenderTableRow label="Capitania" fieldName="capitania" />
                  <RenderTableRow label="Detailed Location" fieldName="location" />
                  <RenderTableRow label="Collection" fieldName="collection" />
                  <RenderTableRow label="Layer" fieldName="layer" />
                  <RenderTableRow label="CNANS Process Number" fieldName="cnans_process_number" />
                  <RenderTableRow label="CNANS Process Title" fieldName="cnans_process_title" />
                  <RenderTableRow label="Other References" fieldName="other_refs" />
                  <RenderTableRow label="Source" fieldName="source" type="textarea" />
                  <RenderTableRow label="Date Found" fieldName="date_found" type="number" />
                  <RenderTableRow label="Date Recovered" fieldName="date_recovered" type="number" />
                </tbody>
              </table>
            </div>
          </div>

        </section>
      </main>

      <Footer />

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-[#222]">
          <div className="bg-white rounded-xl max-w-md w-full p-8 shadow-2xl border border-gray-100 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-rose-50 text-rose-500`}>
              <span className="material-symbols-outlined text-[32px]">
                delete_forever
              </span>
            </div>
            <h3 className="text-xl font-medium text-[#1e3a5f] font-display mb-2">
              Delete Site
            </h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Are you sure you want to delete this site? This action requires confirmation.
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleDelete}
                className="w-full py-3 rounded-sm font-medium tracking-wider uppercase text-xs text-white bg-rose-600 hover:bg-rose-700 transition-colors duration-300"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setConfirmAction(null)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-sm font-medium tracking-wider uppercase text-xs transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
