import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "../../context/ToastContext";

export default function MyPublications() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [discoveries, setDiscoveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Delete confirmation & notification
    const [confirmDelete, setConfirmDelete] = useState(null); // { id, title } | null

    // Pagination states
    const [postsPage, setPostsPage] = useState(1);
    const [findsPage, setFindsPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem("access_token");

                if (!token) {
                    throw new Error("You must be logged in.");
                }

                // Fetch Profile from custom users collection
                const profileRes = await fetch(
                    `${import.meta.env.VITE_DIRECTUS_URL}/items/users/${token}?fields=id,name,email`
                );

                if (!profileRes.ok) {
                    throw new Error("Failed to load profile.");
                }

                const profileData = await profileRes.json();
                const currentUser = profileData.data;
                setUser(currentUser);

                // Fetch Blog Posts
                const postsRes = await fetch(
                    `${import.meta.env.VITE_DIRECTUS_URL}/items/blog_posts?limit=-1&sort[]=-date_published`
                );

                let allPosts = [];
                if (postsRes.ok) {
                    const postsData = await postsRes.json();
                    allPosts = postsData.data || [];
                }

                // Fetch Reported Finds
                const findsRes = await 
                    `${import.meta.env.VITE_DIRECTUS_URL}/items/reported_finds?limit=-1&sort[]=-created_at`
                );

                let allFinds = [];
                if (findsRes.ok) {
                    const findsData = await findsRes.json();
                    allFinds = findsData.data || [];
                }

                // Filter Posts by user author name
                const userName = (currentUser.name || "").trim().toLowerCase();
                
                const filteredPosts = allPosts.filter(post => {
                    if (!post.author) return false;
                    const authorLower = post.author.toLowerCase();
                    return authorLower.includes(userName) || userName.includes(authorLower);
                });

                // Filter Discoveries by user email
                const userEmail = (currentUser.email || "").trim().toLowerCase();
                const filteredFinds = allFinds.filter(find => {
                    if (!find.email) return false;
                    return find.email.trim().toLowerCase() === userEmail;
                });

                setPosts(filteredPosts);
                setDiscoveries(filteredFinds);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("pt-PT", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const handleDeletePost = async () => {
        if (!confirmDelete) return;
        const postId = confirmDelete.id;
        setConfirmDelete(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/items/blog_posts/${postId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const result = await response.json().catch(() => ({}));
                throw new Error(result.errors?.[0]?.message || "Failed to delete post.");
            }

            setPosts((prev) => prev.filter((p) => p.id !== postId));
            showToast("Post deleted successfully!", "success");
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    // Calculate paginated slices
    const totalPostsPages = Math.ceil(posts.length / ITEMS_PER_PAGE);
    const paginatedPosts = posts.slice(
        (postsPage - 1) * ITEMS_PER_PAGE,
        postsPage * ITEMS_PER_PAGE
    );

    const totalFindsPages = Math.ceil(discoveries.length / ITEMS_PER_PAGE);
    const paginatedFinds = discoveries.slice(
        (findsPage - 1) * ITEMS_PER_PAGE,
        findsPage * ITEMS_PER_PAGE
    );

    return (
        <div className="bg-[#f3f4f6] min-h-screen font-body flex flex-col text-[#222]">
            <TopNavBar />

            <main className="flex-1 mt-20 pb-20">
                {/* Header */}
                <section className="bg-[#f3f4f6] py-2 px-4 mt-8">
                    <div className="w-[90%] max-w-[900px] mx-auto">
                        <div className="flex items-start gap-4 mb-2">
                            <div className="w-[3px] h-16 bg-[#705a44] shrink-0"></div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-light text-[#2f4050] tracking-tight leading-tight font-display">
                                    My Publications
                                </h1>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#705a44] mt-2">
                                    Nautical Archaeology Digital Library
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content */}
                <div className="w-[90%] max-w-[900px] mx-auto mt-10 space-y-12">
                    {loading && (
                        <div className="text-center py-10">
                            <p className="text-sm text-gray-500">
                                Loading publications...
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4">
                            <p className="text-xs text-red-700">
                                {error}
                            </p>
                        </div>
                    )}

                    {!loading && !error && user && (
                        <>
                            {/* Section: Posts */}
                            <section>
                                <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-6">
                                    <h2 className="text-xl font-light text-[#2f4050] font-display">
                                        Posts
                                    </h2>
                                    <Link 
                                        to="/newpost" 
                                        className="bg-[#2f4050] hover:bg-[#1e3a5f] text-white px-4 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
                                    >
                                        + ADD
                                    </Link>
                                </div>
                                {posts.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic">No posts found.</p>
                                ) : (
                                    <>
                                        <div className="space-y-4">
                                            {paginatedPosts.map((post) => (
                                                <div 
                                                    key={post.id} 
                                                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center transition-shadow duration-300 hover:shadow-md"
                                                >
                                                    <div>
                                                        <h3 className="text-base font-medium text-gray-900 leading-snug">
                                                            {post.title}
                                                        </h3>
                                                        <p className="text-xs text-[#687990] mt-1">
                                                            {formatDate(post.date_published)}
                                                        </p>
                                                    </div>
                                                    <div className="ml-4 shrink-0 flex items-center gap-3">
                                                        {/* Edit button for draft posts */}
                                                        {post.status === "draft" && (
                                                            <button
                                                                onClick={() => navigate(`/newpost/${post.id}`)}
                                                                className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider border border-[#2f4050] text-[#2f4050] hover:bg-[#2f4050] hover:text-white rounded-sm transition-colors duration-200"
                                                            >
                                                                Edit
                                                            </button>
                                                        )}
                                                        {/* Delete button for draft and pending posts */}
                                                        {(post.status === "draft" || post.status === "pending") && (
                                                            <button
                                                                onClick={() => setConfirmDelete({ id: post.id, title: post.title })}
                                                                className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider border border-rose-500 text-rose-600 hover:bg-rose-50 rounded-sm transition-colors duration-200"
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                                                            post.status === "published"
                                                                ? "border-green-500 text-green-700 bg-green-50"
                                                                : post.status === "draft"
                                                                    ? "border-gray-400 text-gray-600 bg-gray-50"
                                                                    : "border-red-500 text-red-700 bg-red-50"
                                                        }`}>
                                                            {post.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Posts Pagination Controls */}
                                        {totalPostsPages > 1 && (
                                            <div className="flex items-center justify-center gap-2 mt-6">
                                                <button
                                                    onClick={() => setPostsPage((p) => Math.max(1, p - 1))}
                                                    disabled={postsPage === 1}
                                                    className="px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-sm border border-gray-200 text-[#687990] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    Previous
                                                </button>

                                                {Array.from({ length: totalPostsPages }, (_, i) => i + 1).map((page) => (
                                                    <button
                                                        key={page}
                                                        onClick={() => setPostsPage(page)}
                                                        className={`w-9 h-9 text-xs font-medium rounded-sm border transition-colors ${
                                                            page === postsPage
                                                                ? "bg-[#2f4050] text-white border-[#2f4050]"
                                                                : "border-gray-200 text-[#687990] hover:bg-gray-50"
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}

                                                <button
                                                    onClick={() => setPostsPage((p) => Math.min(totalPostsPages, p + 1))}
                                                    disabled={postsPage === totalPostsPages}
                                                    className="px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-sm border border-gray-200 text-[#687990] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </section>

                            {/* Section: Discoveries */}
                            <section>
                                <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-6">
                                    <h2 className="text-xl font-light text-[#2f4050] font-display">
                                        Discoveries
                                    </h2>
                                    <Link 
                                        to="/submitfind" 
                                        className="bg-[#2f4050] hover:bg-[#1e3a5f] text-white px-4 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
                                    >
                                        + ADD
                                    </Link>
                                </div>
                                {discoveries.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic">No discoveries found.</p>
                                ) : (
                                    <>
                                        <div className="space-y-4">
                                            {paginatedFinds.map((discovery) => (
                                                <div 
                                                    key={discovery.id} 
                                                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center transition-shadow duration-300 hover:shadow-md"
                                                >
                                                    <div>
                                                        <h3 className="text-base font-medium text-gray-900 leading-snug capitalize">
                                                            {discovery.type}
                                                        </h3>
                                                        <p className="text-xs text-[#687990] mt-1">
                                                            Coordinates: {discovery.latitude}, {discovery.longitude}
                                                        </p>
                                                    </div>
                                                    <div className="ml-4 shrink-0">
                                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                                                            discovery.status === "verified"
                                                                ? "border-green-500 text-green-700 bg-green-50"
                                                                : discovery.status === "denied"
                                                                ? "border-red-500 text-red-700 bg-red-50"
                                                                : "border-gray-400 text-gray-600 bg-gray-50"
                                                        }`}>
                                                            {discovery.status || "pending"}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Discoveries Pagination Controls */}
                                        {totalFindsPages > 1 && (
                                            <div className="flex items-center justify-center gap-2 mt-6">
                                                <button
                                                    onClick={() => setFindsPage((p) => Math.max(1, p - 1))}
                                                    disabled={findsPage === 1}
                                                    className="px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-sm border border-gray-200 text-[#687990] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    Previous
                                                </button>

                                                {Array.from({ length: totalFindsPages }, (_, i) => i + 1).map((page) => (
                                                    <button
                                                        key={page}
                                                        onClick={() => setFindsPage(page)}
                                                        className={`w-9 h-9 text-xs font-medium rounded-sm border transition-colors ${
                                                            page === findsPage
                                                                ? "bg-[#2f4050] text-white border-[#2f4050]"
                                                                : "border-gray-200 text-[#687990] hover:bg-gray-50"
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}

                                                <button
                                                    onClick={() => setFindsPage((p) => Math.min(totalFindsPages, p + 1))}
                                                    disabled={findsPage === totalFindsPages}
                                                    className="px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-sm border border-gray-200 text-[#687990] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </section>
                        </>
                    )}
                </div>
            </main>

            <Footer />

            {/* Delete Confirmation Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-8 shadow-2xl border border-gray-100 text-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-rose-50 text-rose-500">
                            <span className="material-symbols-outlined text-[32px]">
                                delete_forever
                            </span>
                        </div>
                        <h3 className="text-xl font-medium text-[#1e3a5f] font-display mb-2">
                            Delete Post
                        </h3>
                        <p className="text-sm text-gray-500 mb-2 leading-relaxed">
                            Are you sure you want to delete this post?
                        </p>
                        <p className="text-sm font-medium text-gray-700 mb-8">
                            "{confirmDelete.title}"
                        </p>
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={handleDeletePost}
                                className="w-full py-3 rounded-sm font-medium tracking-wider uppercase text-xs text-white transition-colors duration-300 bg-rose-600 hover:bg-rose-700"
                            >
                                Confirm Delete
                            </button>
                            <button
                                onClick={() => setConfirmDelete(null)}
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
