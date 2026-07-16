import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import uploadImage from "@/data/Images/uploadImage.png";
import { useToast } from "../context/ToastContext";

export default function SubmitFind() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Form Inputs State
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Image Upload State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Request & Status State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    const userData = sessionStorage.getItem("user");
    if (token && userData) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(userData));
    } else {
      setIsAuthenticated(false);
      setShowAuthWarning(true);
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showToast("Please upload an image file only (JPEG, PNG, GIF, WebP, etc.).", "error");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !type || !description || !latitude || !longitude) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    setLoading(true);

    try {
      let fileId = null;

      // 1. Upload image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/files`, {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload image file.");
        }

        const uploadData = await uploadRes.json();
        fileId = uploadData.data.id;
      }

      // 2. Prepare submission details
      const finalIsAnonymous = isAnonymous || !isAuthenticated;
      const submitName = finalIsAnonymous ? "NULL" : (currentUser?.name || "NULL");
      const submitEmail = finalIsAnonymous ? "NULL" : (currentUser?.email || "NULL");
      const submitInstitution = finalIsAnonymous ? "NULL" : (currentUser?.institution || "NULL");

      const payload = {
        name,
        type,
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        author: submitName,
        email: submitEmail,
        status: "pending",
        institution: submitInstitution,
      };

      if (fileId) {
        payload.image = fileId;
      }

      // 3. Post to reported_finds
      const submitRes = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/items/reported_finds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!submitRes.ok) {
        const errorData = await submitRes.json().catch(() => ({}));
        const msg = errorData.errors?.[0]?.message || "Failed to submit discovery report.";
        throw new Error(msg);
      }

      // Reset form on success
      setType("");
      setDescription("");
      setLatitude("");
      setLongitude("");
      setImageFile(null);
      setImagePreview(null);
      showToast("Discovery reported successfully! Thank you for contributing to the Nautical Archive.", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen font-body flex flex-col text-[#222]">
      <TopNavBar />

      <main className="flex-1 pt-24 pb-24 px-4">
        <div className="w-full max-w-[700px] mx-auto">
          {/* Header */}
          <div className="text-center mb-12 mt-6">
            <h1 className="text-4xl md:text-5xl font-light text-[#1e3a5f] font-display tracking-wide mb-4">
              Report a New Discovery
            </h1>
            <p className="text-[#4b5563] font-light text-base tracking-wide max-w-lg mx-auto">
              Please provide detailed information about your maritime finding to add to the digital archive.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12">

            <form className="space-y-8" onSubmit={handleSubmit}>

              {/* Name Textarea */}
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Name</label>
                <textarea
                  required
                  rows="1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3.5 text-sm text-[#374151] focus:outline-none focus:border-gray-300 focus:bg-white transition-colors resize-none"
                  placeholder="Name of the discovery..."
                ></textarea>
              </div>

              {/* Type Input */}
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Type of Discovery</label>
                <select
                  required
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm py-3.5 pl-4 pr-10 text-sm text-[#374151] focus:outline-none focus:border-gray-300 focus:bg-white transition-colors appearance-none bg-no-repeat"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1rem 1rem'
                  }}
                >
                  <option value="" disabled>Select type of discovery...</option>
                  <option value="shipwreck">Shipwreck</option>
                  <option value="artillery">Artillery & Guns</option>
                  <option value="anchors">Anchor</option>
                  <option value="artifacts">Artifact</option>
                  <option value="forts">Fort</option>
                  <option value="harbor">Harbor Structure</option>
                  <option value="shipyard">Shipyard Structure</option>
                  <option value="structures">Other Structure</option>
                  <option value="iconography">Iconography</option>
                  <option value="astrolabes">Astrolabe</option>
                  <option value="pattern">Pattern</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Description Textarea */}
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Description</label>
                <textarea
                  required
                  rows="6"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3.5 text-sm text-[#374151] focus:outline-none focus:border-gray-300 focus:bg-white transition-colors resize-none"
                  placeholder="Describe the artifact, condition, and context..."
                ></textarea>
              </div>

              {/* Lat / Lng */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Latitude</label>
                  <input
                    required
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3.5 text-sm text-[#374151] focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
                    placeholder="e.g., 38.7223"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Longitude</label>
                  <input
                    required
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3.5 text-sm text-[#374151] focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
                    placeholder="e.g., -9.1393"
                  />
                </div>
              </div>

              {/* Upload Section */}
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-1">Photographs & Media</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="relative w-full h-56 overflow-hidden border border-gray-200 rounded-sm group cursor-pointer"
                >
                  {/* Background Image Preview */}
                  <img
                    src={imagePreview || uploadImage}
                    alt="Upload background"
                    className="w-full h-full object-cover grayscale-[30%] group-hover:scale-105 transition-transform duration-1000"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-[#1e3a5f]/60 group-hover:bg-[#1e3a5f]/50 transition-colors duration-500"></div>
                  {/* Button */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <button type="button" className="bg-white text-[#1e3a5f] px-8 py-3 rounded-sm font-medium tracking-wider text-xs uppercase hover:bg-gray-50 transition-colors mb-2">
                      {imageFile ? "Change Image" : "Upload Image"}
                    </button>
                    {imageFile && (
                      <span className="text-xs font-light text-gray-200">
                        Selected: {imageFile.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Anonymous Submission Option */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <input
                  type="checkbox"
                  id="anonymous-toggle"
                  checked={isAnonymous || !isAuthenticated}
                  disabled={!isAuthenticated}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 text-[#1e3a5f] border-gray-300 rounded focus:ring-[#1e3a5f] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label htmlFor="anonymous-toggle" className="text-xs text-gray-600 select-none cursor-pointer">
                  {!isAuthenticated ? (
                    <span className="font-medium text-amber-700">Submitting anonymously (not logged in)</span>
                  ) : (
                    <span>Submit anonymously (name and email will be "None")</span>
                  )}
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2f4050] hover:bg-[#5a677d] text-white py-4 rounded-sm font-medium tracking-wider uppercase text-sm transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting Report..." : "Submit Report"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>

      {/* Unauthenticated Dialog Modal */}
      {showAuthWarning && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-8 shadow-2xl border border-gray-100 text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-[#1e3a5f] font-display mb-2">Not Logged In</h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              You are not authenticated. You can sign in to associate the discovery with your profile, or submit it anonymously.
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-[#2f4050] hover:bg-[#1e3a5f] text-white py-3 rounded-sm font-medium tracking-wider uppercase text-xs transition-colors duration-300"
              >
                Sign In / Register
              </button>
              <button
                onClick={() => {
                  setIsAnonymous(true);
                  setShowAuthWarning(false);
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-sm font-medium tracking-wider uppercase text-xs transition-colors duration-300"
              >
                Submit Anonymously
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
