import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import Header from "@/data/Images/Headers/PostHeader.jpg";
import { useToast } from "../context/ToastContext";

export default function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorDetails, setAuthorDetails] = useState(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);

  // Editing States
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editCategory, setEditCategory] = useState("research");
  const [saving, setSaving] = useState(false);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [editImageCaption, setEditImageCaption] = useState("");
  const fileInputRef = React.useRef(null);

  // Confirmation / Notification States
  const [confirmAction, setConfirmAction] = useState(null); // 'archive' | 'delete' | null

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/items/blog_posts/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }

        const result = await response.json();
        setPost(result.data);

        if (result.data && result.data.author) {
          try {
            const authorRes = await fetch(
              `${import.meta.env.VITE_DIRECTUS_URL}/items/users?filter[name][_eq]=${encodeURIComponent(
                result.data.author
              )}`
            );
            if (authorRes.ok) {
              const authorData = await authorRes.json();
              if (authorData.data && authorData.data.length > 0) {
                setAuthorDetails(authorData.data[0]);
              } else {
                setAuthorDetails(null);
              }
            }
          } catch (err) {
            console.error("Error fetching author details:", err);
          }
        } else {
          setAuthorDetails(null);
        }

        if (result.data) {
          setEditTitle(result.data.title || "");
          setEditExcerpt(result.data.excerpt || "");
          setEditContent(result.data.content || "");
          setEditTags(
            Array.isArray(result.data.tags)
              ? result.data.tags.join(", ")
              : typeof result.data.tags === "string"
                ? result.data.tags
                : ""
          );
          setEditCategory(result.data.category || "research");
          setEditImageCaption(result.data.featured_image_caption || "");
          setEditImagePreview(result.data.featured_image ? `/directus-api/assets/${result.data.featured_image}` : null);
        }

        // Fetch related posts
        const relatedResponse = await fetch(
          `${import.meta.env.VITE_DIRECTUS_URL}/items/blog_posts?limit=3&sort[]=-date_published`
        );

        if (relatedResponse.ok) {
          const relatedResult = await relatedResponse.json();

          const filtered = (relatedResult.data || []).filter(
            (p) => String(p.id) !== String(id)
          );

          setRelatedPosts(filtered.slice(0, 3));
        }
      } catch (error) {
        console.error("Error loading post:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showToast("Please upload an image file only (JPEG, PNG, GIF, WebP, etc.).", "error");
        return;
      }
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle || !editExcerpt || !editContent) {
      showToast("Please fill in all required fields.", "error");
      return;
    }
    setSaving(true);
    try {
      let fileId = post.featured_image;

      if (editImageFile) {
        const formData = new FormData();
        formData.append("file", editImageFile);

        const uploadRes = await fetch("${import.meta.env.VITE_DIRECTUS_URL}/files", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload image file.");
        }

        const uploadData = await uploadRes.json();
        fileId = uploadData.data.id;
      }

      const parsedTags = editTags ? editTags.split(",").map(t => t.trim()).filter(Boolean) : [];
      const payload = {
        title: editTitle,
        excerpt: editExcerpt,
        content: editContent,
        tags: parsedTags,
        category: editCategory,
        featured_image: fileId,
        featured_image_caption: editImageCaption,
        date_updated: new Date().toISOString()
      };

      if (fileId) {
        payload.cover_image = fileId;
      }

      const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/items/blog_posts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.errors?.[0]?.message || "Failed to save changes.");
      }

      setPost(result.data);
      setEditImagePreview(result.data.featured_image ? `/directus-api/assets/${result.data.featured_image}` : null);
      setEditImageFile(null);
      setIsEditing(false);
      showToast("Article updated successfully!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    setConfirmAction(null);
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/items/blog_posts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "archived" }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.errors?.[0]?.message || "Failed to archive article.");
      }

      setPost(result.data);
      showToast("Article archived successfully!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    setConfirmAction(null);
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_DIRECTUS_URL}/items/blog_posts/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "published",
            date_published: new Date().toISOString(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.errors?.[0]?.message ||
          "Failed to publish article."
        );
      }

      setPost(result.data);

      showToast("Article published successfully!", "success");

    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setConfirmAction(null);
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/items/blog_posts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.errors?.[0]?.message || "Failed to delete article.");
      }

      showToast("Article deleted successfully! Redirecting...", "success");
      setTimeout(() => {
        navigate("/blog");
      }, 2000);
    } catch (err) {
      showToast(err.message, "error");
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";

    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#2f4050]/20 border-t-[#2f4050] rounded-full animate-spin"></div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#2f4050]/70">
            Loading Article...
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
        <p className="text-[#2f4050] text-lg">
          Article not found.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#f3f4f6] min-h-screen font-body flex flex-col text-[#222]">
      <TopNavBar />

      <main className="flex-1 pt-20">

        {/* Hero Section */}
        <section className="relative w-full h-[45vh] overflow-hidden">
          {/* Cover Image */}
          <div className="absolute inset-0">
            <img
              src={
                Header
              }
              alt={post.title}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/55"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 w-full h-full flex items-center">
            <div className="w-full max-w-[1200px] mx-auto px-6">
              <div className="max-w-4xl">

                <span className="inline-block text-xs uppercase tracking-[0.25em] bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 mb-6">
                  {post.category}
                </span>

                <h1 className="text-white text-4xl md:text-6xl font-light leading-tight font-display mb-8">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">
                      person
                    </span>
                    {post.author || "Unknown Author"}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">
                      calendar_month
                    </span>
                    {formatDate(post.date_published)}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="w-full max-w-[1200px] mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

            {/* Article Content / Edit Form */}
            <article className="lg:col-span-8">
              {isEditing ? (
                <form onSubmit={handleSaveEdit} className="bg-white border border-gray-200 p-8 rounded-lg space-y-6">
                  <h2 className="text-2xl font-light text-[#1e3a5f] font-display mb-4">Edit Article</h2>

                  {/* Title */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Title</label>
                    <input
                      required
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3.5 text-sm text-[#374151] focus:outline-none focus:border-gray-300"
                    />
                  </div>

                  {/* Excerpt */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Excerpt</label>
                    <input
                      required
                      type="text"
                      value={editExcerpt}
                      onChange={(e) => setEditExcerpt(e.target.value)}
                      className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3.5 text-sm text-[#374151] focus:outline-none focus:border-gray-300"
                    />
                  </div>

                  {/* Category */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Category</label>
                    <select
                      required
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3.5 text-sm text-[#374151] focus:outline-none focus:border-gray-300"
                    >
                      <option value="research">Research</option>
                      <option value="announcement">Announcement</option>
                      <option value="event">Event</option>
                      <option value="investigation">Investigation</option>
                      <option value="shipbuilding">Shipbuilding</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Content</label>
                    <textarea
                      required
                      rows="12"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3.5 text-sm text-[#374151] focus:outline-none focus:border-gray-300 resize-none"
                    ></textarea>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                      className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3.5 text-sm text-[#374151] focus:outline-none focus:border-gray-300"
                      placeholder="e.g. Tag1, Tag2"
                    />
                  </div>

                  {/* Featured Image */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Featured Image</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current.click()}
                      className="relative w-full h-48 overflow-hidden border border-gray-200 rounded-sm group cursor-pointer"
                    >
                      {editImagePreview ? (
                        <img
                          src={editImagePreview}
                          alt="Featured preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs uppercase tracking-wider">
                          Click to upload image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs uppercase tracking-wider">
                        Change Image
                      </div>
                    </div>
                  </div>

                  {/* Image Caption */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Featured Image Caption</label>
                    <input
                      type="text"
                      value={editImageCaption}
                      onChange={(e) => setEditImageCaption(e.target.value)}
                      className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3.5 text-sm text-[#374151] focus:outline-none focus:border-gray-300"
                      placeholder="Enter image caption..."
                    />
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-[#2f4050] hover:bg-[#1e3a5f] disabled:opacity-50 text-white py-3 px-8 rounded-sm font-medium tracking-wider uppercase text-xs transition-colors duration-300"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-8 rounded-sm font-medium tracking-wider uppercase text-xs transition-colors duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  {/* Excerpt */}
                  {post.excerpt && (
                    <div className="border-l-4 border-[#705a44] pl-6 mb-12">
                      <p className="text-2xl leading-relaxed text-[#2f4050] font-light">
                        {post.excerpt}
                      </p>
                    </div>
                  )}

                  {/* Body */}
                  <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-[#4b5563] prose-p:text-[#4b5563] prose-p:leading-relaxed prose-p:mb-8 [&_p]:mb-8 prose-strong:text-[#1f2937]">
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          post.content ||
                          "<p>No article content available.</p>",
                      }}
                    />
                  </div>

                  {/* Featured Image */}
                  {post.featured_image && (
                    <div className="my-10">
                      <img
                        src={`/directus-api/assets/${post.featured_image}`}
                        alt={post.featured_image_caption || post.title}
                        className="w-auto max-h-[600px] object-cover rounded-sm shadow-sm mx-auto block"
                      />
                      {post.featured_image_caption && (
                        <p className="text-xs text-gray-500 italic mt-3 text-center">
                          {post.featured_image_caption}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  <div className="mt-16 pt-8 border-t border-gray-200">
                    <h3 className="text-sm uppercase tracking-[0.2em] text-[#2f4050]/70 mb-4">
                      Tags
                    </h3>

                    <div className="flex flex-wrap gap-3">
                      {(Array.isArray(post.tags)
                        ? post.tags
                        : typeof post.tags === "string"
                          ? post.tags.split(",").map(tag => tag.trim())
                          : ["Research"]
                      ).map((tag) => (
                        <span
                          key={tag}
                          className="bg-white border border-gray-200 px-4 py-2 text-xs uppercase tracking-widest text-[#4b5563]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4 flex flex-col gap-8">

              {/* Author Card */}
              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-lg font-display text-[#1e3a5f] mb-6">
                  Author
                </h3>

                <div className="flex items-center gap-4 mb-4">
                  {authorDetails?.avatar ? (
                    <img
                      src={`/directus-api/assets/${authorDetails.avatar}`}
                      alt={authorDetails.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-[56px] text-gray-400" style={{ lineHeight: 1 }}>
                      account_circle
                    </span>
                  )}

                  <div>
                    <p className="font-medium text-[#1f2937]">
                      {authorDetails?.name || post.author || "Unknown Author"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {authorDetails?.title || "Maritime Researcher"}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-[#4b5563] leading-relaxed">
                  {authorDetails?.description || "Research contributor focused on maritime archaeology, submerged heritage and digital documentation."}
                </p>
              </div>

              {/* Related Posts */}
              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-lg font-display text-[#1e3a5f] mb-6">
                  Related Articles
                </h3>

                <div className="flex flex-col gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.id}`}
                      className="group border-b border-gray-100 pb-5 last:border-b-0"
                    >
                      <h4 className="text-[#1f2937] group-hover:text-[#2f4050] transition-colors leading-snug mb-2">
                        {relatedPost.title}
                      </h4>

                      <p className="text-xs uppercase tracking-widest text-gray-500">
                        {formatDate(relatedPost.date_published)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Action Buttons (Edit, Archive, Delete) */}
              {currentUser && (
                <div className="flex flex-col gap-3">
                  {/* EDIT ARTICLE: editor or admin, or status is draft */}
                  {(currentUser.role === "admin" || currentUser.role === "editor" || post.status === "draft") && post.status !== "pending" && (
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="border border-[#2f4050] text-[#2f4050] px-6 py-4 text-sm uppercase tracking-[0.2em] hover:bg-[#2f4050] hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        edit
                      </span>
                      {isEditing ? "Cancel Edit" : "Edit Article"}
                    </button>
                  )}

                  {/* ACCEPT ARTICLE: admin only */}
                  {currentUser.role === "admin" && post.status === "pending" && (
                    <button
                      onClick={() => handleAccept()}
                      className="border border-[#43a047] text-[#43a047] px-6 py-4 text-sm uppercase tracking-[0.2em] hover:bg-[#43a047] hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        check
                      </span>
                      Accept Article
                    </button>
                  )}

                  {/* ARCHIVE ARTICLE: admin only */}
                  {currentUser.role === "admin" && post.status !== "archived" && post.status !== "pending" && (
                    <button
                      onClick={() => setConfirmAction("archive")}
                      className="border border-[#4527a0] text-[#4527a0] px-6 py-4 text-sm uppercase tracking-[0.2em] hover:bg-[#4527a0] hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        archive
                      </span>
                      Archive Article
                    </button>
                  )}

                  {/* DELETE ARTICLE: admin only */}
                  {currentUser.role === "admin" && (
                    <button
                      onClick={() => setConfirmAction("delete")}
                      className="border border-[#c62828] text-[#c62828] px-6 py-4 text-sm uppercase tracking-[0.2em] hover:bg-[#c62828] hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        delete
                      </span>
                      Delete Article
                    </button>
                  )}
                </div>
              )}

              {/* Back Button */}
              <Link
                to="/blog"
                className="border border-[#2f4050] text-[#2f4050] px-6 py-4 text-sm uppercase tracking-[0.2em] hover:bg-[#2f4050] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">
                  arrow_back
                </span>

                Back to Blog
              </Link>

            </aside>

          </div>
        </section>

      </main>

      <Footer />

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-8 shadow-2xl border border-gray-100 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${confirmAction === 'delete' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'
              }`}>
              <span className="material-symbols-outlined text-[32px]">
                {confirmAction === 'delete' ? 'delete_forever' : 'archive'}
              </span>
            </div>
            <h3 className="text-xl font-medium text-[#1e3a5f] font-display mb-2">
              {confirmAction === 'delete' ? 'Delete Article' : 'Archive Article'}
            </h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Are you sure you want to {confirmAction} this article? This action requires confirmation.
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={confirmAction === 'delete' ? handleDelete : handleArchive}
                className={`w-full py-3 rounded-sm font-medium tracking-wider uppercase text-xs text-white transition-colors duration-300 ${confirmAction === 'delete' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-600 hover:bg-amber-700'
                  }`}
              >
                Confirm {confirmAction === 'delete' ? 'Delete' : 'Archive'}
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
