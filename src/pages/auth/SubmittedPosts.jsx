import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";

const PAGE_SIZE = 25;

// Role priority order: admin=0, editor=1, viewer=2, none/null=3
const ROLE_ORDER = { admin: 0, editor: 1, viewer: 2 };

function getRolePriority(role) {
    if (!role || role.toLowerCase() === "none") return 3;
    return ROLE_ORDER[role.toLowerCase()] ?? 3;
}

export default function SubmittedPosts() {
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem("access_token");
                const storedUser = sessionStorage.getItem("user");

                if (!token || !storedUser) {
                    throw new Error("You must be logged in.");
                }

                // Read role from the user object saved in sessionStorage on login
                const currentUser = JSON.parse(storedUser);

                if (!currentUser || currentUser.role !== "admin") {
                    throw new Error("Access denied. Admin role required.");
                }

                // Fetch all blog_posts and filter client-side
                const postsRes = await fetch(
                    `${import.meta.env.VITE_DIRECTUS_URL}/items/blog_posts?limit=-1&sort=date_created`
                );

                let allPosts = [];
                if (postsRes.ok) {
                    const postsData = await postsRes.json();
                    const rawPosts = postsData.data || [];
                    // Filter for pending status on the client
                    allPosts = rawPosts.filter((p) => p.status === "pending");
                } else {
                    throw new Error("Failed to load submitted posts.");
                }

                // Build author_name→role map by querying each unique author name
                const uniqueAuthors = [
                    ...new Set(
                        allPosts
                            .map((p) => (p.author || "").trim())
                            .filter((a) => a && a.toLowerCase() !== "none")
                    ),
                ];

                const authorRoleMap = {};
                await Promise.all(
                    uniqueAuthors.map(async (authorName) => {
                        try {
                            const res = await fetch(
                                `${import.meta.env.VITE_DIRECTUS_URL}/items/users?filter[name][_eq]=${encodeURIComponent(authorName)}&fields=name,role&limit=1`
                            );
                            if (res.ok) {
                                const data = await res.json();
                                const found = data?.data?.[0];
                                if (found?.name) {
                                    authorRoleMap[found.name.trim().toLowerCase()] = found.role;
                                }
                            }
                        } catch {
                            // silently skip if lookup fails
                        }
                    })
                );

                // Enrich posts with the author's role
                const enriched = allPosts.map((post) => {
                    const authorName = (post.author || "").trim().toLowerCase();

                    let role = null;
                    if (authorName && authorName !== "none" && authorRoleMap[authorName]) {
                        role = authorRoleMap[authorName];
                    }

                    return { ...post, _authorRole: role };
                });

                // Sort: by role priority first, then by oldest first (date_created ASC)
                enriched.sort((a, b) => {
                    const pa = getRolePriority(a._authorRole);
                    const pb = getRolePriority(b._authorRole);
                    if (pa !== pb) return pa - pb;
                    // Within same group: oldest first
                    const da = new Date(a.date_created || 0).getTime();
                    const db = new Date(b.date_created || 0).getTime();
                    return da - db;
                });

                setPosts(enriched);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDate = (date) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("pt-PT", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const totalPages = Math.ceil(posts.length / PAGE_SIZE);
    const paginatedPosts = posts.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const getRoleBadge = (role) => {
        if (!role || role.toLowerCase() === "none") {
            return (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border border-gray-300 text-gray-500 bg-gray-50">
                    None
                </span>
            );
        }
        const colors = {
            admin: "border-purple-400 text-purple-700 bg-purple-50",
            editor: "border-blue-400 text-blue-700 bg-blue-50",
            viewer: "border-teal-400 text-teal-700 bg-teal-50",
        };
        const cls = colors[role.toLowerCase()] || "border-gray-300 text-gray-500 bg-gray-50";
        return (
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${cls}`}>
                {role}
            </span>
        );
    };

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
                                    Submitted Posts
                                </h1>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#705a44] mt-2">
                                    Pending Review — Nautical Archaeology Digital Library
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content */}
                <div className="w-[90%] max-w-[900px] mx-auto mt-10">
                    {loading && (
                        <div className="text-center py-10">
                            <p className="text-sm text-gray-500">Loading submitted posts...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4">
                            <p className="text-xs text-red-700">{error}</p>
                        </div>
                    )}

                    {!loading && !error && (
                        <>
                            {/* Count indicator */}
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-xs text-[#687990] uppercase tracking-widest">
                                    {posts.length} pending{" "}
                                    {posts.length === 1 ? "submission" : "submissions"}
                                </p>
                            </div>

                            {posts.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">
                                    No pending posts to review.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {paginatedPosts.map((post) => (
                                        <div
                                            key={post.id}
                                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center gap-4 transition-shadow duration-300 hover:shadow-md"
                                        >
                                            {/* Left: info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <h3 className="text-base font-medium text-gray-900 leading-snug capitalize truncate">
                                                        {post.title || "Untitled"}
                                                    </h3>
                                                    {getRoleBadge(post._authorRole)}
                                                </div>
                                                <p className="text-xs text-[#687990] mt-1 truncate">
                                                    By:{" "}
                                                    <span className="font-medium text-[#2f4050]">
                                                        {post.author || "Anonymous"}
                                                    </span>
                                                </p>
                                                <p className="text-xs text-[#687990] mt-0.5">
                                                    Submitted: {formatDate(post.date_created)}
                                                </p>
                                            </div>

                                            {/* Right: view button */}
                                            <div className="shrink-0">
                                                <button
                                                    onClick={() =>
                                                        navigate(`/post/${post.id}`)
                                                    }
                                                    className="px-4 py-2 bg-[#2f4050] hover:bg-[#1e3a5f] text-white text-xs font-medium uppercase tracking-wider rounded-sm transition-colors duration-200"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-10">
                                    {currentPage === 1 ? (
                                        <button
                                            onClick={() => setCurrentPage(1)}
                                            className="px-4 py-2 rounded-md bg-[#2f4050] text-white font-medium"
                                        >
                                            1
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setCurrentPage(1)}
                                            className="px-4 py-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50"
                                        >
                                            &lt;&lt;
                                        </button>
                                    )}

                                    {[2, 3, 4].map((page) => {
                                        if (page > totalPages) return null;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-4 py-2 rounded-md ${currentPage === page
                                                    ? "bg-[#2f4050] text-white font-medium"
                                                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        &gt;&gt;
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
