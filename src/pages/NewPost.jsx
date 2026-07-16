import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "../context/ToastContext";

export default function NewPost() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { id: editId } = useParams();
    const isEditMode = Boolean(editId);

    // Authentication State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showAuthWarning, setShowAuthWarning] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Form Inputs State
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("research");
    const [tags, setTags] = useState("");

    // Image Upload State
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    // Request & Status State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

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

    // Load existing post data when editing
    useEffect(() => {
        if (!isEditMode) return;

        const fetchPost = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/items/blog_posts/${editId}`);
                if (!response.ok) throw new Error("Failed to load post.");
                const result = await response.json();
                const post = result.data;

                setTitle(post.title || "");
                setExcerpt(post.excerpt || "");
                setContent(post.content || "");
                setCategory(post.category || "research");
                setTags(
                    Array.isArray(post.tags)
                        ? post.tags.join(", ")
                        : typeof post.tags === "string"
                            ? post.tags
                            : ""
                );
            } catch (err) {
                setError(err.message);
            }
        };

        fetchPost();
    }, [editId, isEditMode]);

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

    const handleSubmit = async (e, postStatus = "pending") => {
        e.preventDefault();

        if (!title || !excerpt || !content) {
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
            const submitAuthor = currentUser?.name || "None";
            const dateStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

            const payload = {
                title,
                excerpt,
                content,
                tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [],
                author: submitAuthor,
                status: postStatus,
                date_published: dateStr,
                category,
                date_created: new Date().toISOString()
            };

            if (fileId) {
                payload.cover_image = fileId;
                payload.featured_image = fileId;
            }

            // 3. Create or update blog_posts
            const url = isEditMode
                ? `/directus-api/items/blog_posts/${editId}`
                : "/directus-api/items/blog_posts";
            const method = isEditMode ? "PATCH" : "POST";

            // When editing, don't override author or date_created
            if (isEditMode) {
                delete payload.author;
                delete payload.date_created;
                payload.date_updated = new Date().toISOString();
            }

            const submitRes = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!submitRes.ok) {
                const errorData = await submitRes.json().catch(() => ({}));
                const msg = errorData.errors?.[0]?.message || (isEditMode ? "Failed to update post." : "Failed to submit post.");
                throw new Error(msg);
            }

            // Reset form on success (only for new posts)
            if (!isEditMode) {
                setTitle("");
                setExcerpt("");
                setContent("");
                setTags("");
                setImageFile(null);
                setImagePreview(null);
            }
            const successMsg = isEditMode
                ? "Post updated successfully!"
                : postStatus === "draft"
                    ? "Post saved as draft! You can edit and submit it later from My Publications."
                    : "Post submitted successfully! It is now pending administrator review.";
            showToast(successMsg, "success");
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
                            {isEditMode ? "Edit Post" : "Create a New Post"}
                        </h1>
                        <p className="text-[#4b5563] font-light text-base tracking-wide max-w-lg mx-auto">
                            {isEditMode
                                ? "Update your draft post. You can save changes as a draft or submit it for review."
                                : "Share your research, news, or updates. Your post will be sent for review and publish with pending status."
                            }
                        </p>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12">

                        <form className="space-y-8" onSubmit={handleSubmit}>

                            {/* Title Input */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Title</label>
                                <input
                                    required
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3.5 text-sm text-[#374151] focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
                                    placeholder="Enter post title..."
                                />
                            </div>

                            {/* Excerpt Input */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Excerpt</label>
                                <input
                                    required
                                    type="text"
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3.5 text-sm text-[#374151] focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
                                    placeholder="Provide a brief summary of the post..."
                                />
                            </div>

                            {/* Content Textarea */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Content</label>
                                <textarea
                                    required
                                    rows="10"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3.5 text-sm text-[#374151] focus:outline-none focus:border-gray-300 focus:bg-white transition-colors resize-none"
                                    placeholder="Write your article content here (HTML supported)..."
                                ></textarea>
                            </div>

                            {/* Category Input */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Category</label>
                                <select
                                    required
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3.5 text-sm text-[#374151] focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
                                >
                                    <option value="research">Research</option>
                                    <option value="announcement">Announcement</option>
                                    <option value="event">Event</option>
                                    <option value="investigation">Investigation</option>
                                    <option value="shipbuilding">Shipbuilding</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Tags Input */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Tags</label>
                                <input
                                    type="text"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3.5 text-sm text-[#374151] focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
                                    placeholder="e.g., Archaeology, Research, Wreck (comma separated)"
                                />
                            </div>

                            {/* Upload Section */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-1">Cover Image</label>
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
                                        src={imagePreview || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop"}
                                        alt="Upload background"
                                        className="w-full h-full object-cover grayscale-[30%] group-hover:scale-105 transition-transform duration-1000"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-[#1e3a5f]/60 group-hover:bg-[#1e3a5f]/50 transition-colors duration-500"></div>
                                    {/* Button */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                        <button type="button" className="bg-white text-[#1e3a5f] px-8 py-3 rounded-sm font-medium tracking-wider text-xs uppercase hover:bg-gray-50 transition-colors mb-2">
                                            {imageFile ? "Change Image" : "Upload Cover Image"}
                                        </button>
                                        {imageFile && (
                                            <span className="text-xs font-light text-gray-200">
                                                Selected: {imageFile.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="pt-6 flex flex-col sm:flex-row gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-[#2f4050] hover:bg-[#5a677d] text-white py-4 rounded-sm font-medium tracking-wider uppercase text-sm transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Submitting..." : "Submit Post"}
                                </button>
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={(e) => handleSubmit(e, "draft")}
                                    className="flex-1 border border-[#2f4050] text-[#2f4050] hover:bg-[#2f4050] hover:text-white py-4 rounded-sm font-medium tracking-wider uppercase text-sm transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Saving..." : "Save as Draft"}
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
                            You must be authenticated to create a publication. Please sign in to access this page.
                        </p>
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={() => navigate("/login")}
                                className="w-full bg-[#2f4050] hover:bg-[#1e3a5f] text-white py-3 rounded-sm font-medium tracking-wider uppercase text-xs transition-colors duration-300"
                            >
                                Sign In / Register
                            </button>
                            <button
                                onClick={() => navigate("/my-publications")}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-sm font-medium tracking-wider uppercase text-xs transition-colors duration-300"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
