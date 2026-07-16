import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { PostCard } from "@/components/ui/PostCard";
import placeholder from "@/data/Images/news-placeholder.jpg";
import featuredholder from "@/data/Images/Headers/research_placeholder.jpg";

const POSTS_PER_PAGE = 6;

export default function Blog() {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {

    async function fetchPosts() {
      try {
        const response = await fetch(
          "/directus-api/items/blog_posts?limit=-1&sort[]=-date_published"
        );

        const result = await response.json();
        const publishedPosts = (result.data || []).filter(
          (post) => post.status === "published"
        );
        setPosts(publishedPosts);

      } catch (err) {
        console.error("Failed to fetch blog posts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);


  const featuredPost = useMemo(() => {

    if (!posts.length) return null;

    return posts[0];

  }, [posts]);


  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());

      const tagsArray = Array.isArray(post.tags)
        ? post.tags
        : typeof post.tags === "string"
          ? post.tags.split(",").map(tag => tag.trim())
          : [];

      const matchesTag =
        selectedTag === "All" ||
        tagsArray.includes(selectedTag);

      const matchesCategory =
        selectedCategory === "All" ||
        post.category === selectedCategory;

      return matchesSearch && matchesTag && matchesCategory;
    });
  }, [posts, searchTerm, selectedTag, selectedCategory]);


  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;

    return filteredPosts.slice(start, start + POSTS_PER_PAGE);

  }, [filteredPosts, currentPage]);


  const allTags = useMemo(() => {
    const tags = posts.flatMap((post) => {
      if (Array.isArray(post.tags)) return post.tags;

      if (typeof post.tags === "string") {
        return post.tags.split(",").map(tag => tag.trim());
      }

      return [];
    });

    return ["All", ...new Set(tags)];
  }, [posts]);


  const allCategories = useMemo(() => {
    const categories = posts.map((post) => post.category).filter(Boolean);
    return ["All", ...new Set(categories)];
  }, [posts]);


  const categoryCounts = useMemo(() => {
    const counts = {};
    posts.forEach((post) => {
      if (post.category) {
        counts[post.category] = (counts[post.category] || 0) + 1;
      }
    });
    return counts;
  }, [posts]);


  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen font-body flex flex-col">

      <TopNavBar />

      <main className="flex-1 mt-20 pb-20">

        {/* Header */}
        <section className="bg-[#f3f4f6] py-2 px-4 mt-8">

          <div className="w-[90%] max-w-[1200px] mx-auto">

            <div className="flex items-start gap-4 mb-2">
              <div className="w-[3px] h-16 bg-[#705a44] shrink-0"></div>
              <div>
                <h1 className="text-3xl md:text-4xl font-light text-[#2f4050] tracking-tight leading-tight font-display">
                  Blog
                </h1>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#705a44] mt-2">
                  News, research updates and articles on maritime archaeology and digital humanities.
                </p>
              </div>
            </div>

          </div>

        </section>

        <div className="w-[90%] max-w-[1200px] mx-auto mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 flex flex-col">

            {/* Featured Post */}
            {featuredPost && (

              <Link
                to={`/post/${featuredPost.id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden mb-10 border border-gray-100 flex flex-col"
              >
                <div className="w-full h-96 overflow-hidden bg-gray-100">

                  <img
                    src={
                      featuredPost.featured_image ||
                      featuredholder
                    }
                    alt={featuredPost.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />

                </div>

                <div className="p-6 flex flex-col">
                  <div className="text-xs font-bold text-[#4c5b71]/90 uppercase tracking-widest mb-2">
                    {featuredPost.category}
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                    {featuredPost.title}
                  </h2>

                  <p className="text-gray-600 mb-4 text-base line-clamp-3">
                    {featuredPost.excerpt}
                  </p>

                  <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                    <span className="font-medium text-gray-900">
                      {featuredPost.author}
                    </span>

                    <time>
                      {formatDate(featuredPost.date_published)}
                    </time>
                  </div>
                </div>
              </Link>

            )}

            {/* Recent Articles */}
            <h3 className="text-xl font-display font-bold text-[#2f4050] mt-10 mb-5 border-b border-gray-200 pb-2">
              Recent Articles
            </h3>

            {loading ? (

              <div className="py-24 text-center text-gray-500">
                Loading posts...
              </div>

            ) : (

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">

                {paginatedPosts.map((post) => (

                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                  >

                    <PostCard
                      title={post.title}
                      summary={post.excerpt}
                      category={post.category}
                      author={post.author}
                      date={formatDate(post.date_published)}
                      image={
                        post.featured_image
                          ? `https://directus-production-7b95.up.railway.app/assets/${post.featured_image}`
                          : placeholder
                      }
                    />

                  </Link>

                ))}

              </div>

            )}

          </div>

          {/* SIDEBAR */}
          <aside className="lg:col-span-1 flex flex-col gap-6">

            {/* Search */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">

              <h4 className="font-bold text-[#2f4050] text-sm uppercase tracking-wider mb-3">
                Search
              </h4>

              <div className="relative">

                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 pr-10 focus:outline-none focus:border-[#2f4050] transition-colors text-sm"
                />

                <span className="material-symbols-outlined absolute right-3 top-2 text-gray-400 text-xl">
                  search
                </span>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">

              <h4 className="font-bold text-[#2f4050] text-sm uppercase tracking-wider mb-3">
                Categories
              </h4>

              <div className="flex flex-col gap-2">

                {allCategories.map(category => {
                  const count = category === "All"
                    ? posts.length
                    : (categoryCounts[category] || 0);

                  return (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setCurrentPage(1);
                      }}
                      className={`flex justify-between items-center text-xs py-2 px-3 rounded-md border transition-colors w-full text-left ${selectedCategory === category
                        ? "bg-[#2f4050] text-white border-[#2f4050]"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:border-[#2f4050] hover:text-[#2f4050]"
                        }`}
                    >
                      <span className="font-medium">{category}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${selectedCategory === category
                        ? "bg-white/20 text-white"
                        : "bg-gray-200/80 text-gray-500"
                        }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}

              </div>
            </div>

            {/* Tags */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">

              <h4 className="font-bold text-[#2f4050] text-sm uppercase tracking-wider mb-3">
                Tags
              </h4>

              <div className="flex flex-wrap gap-2">

                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTag(tag);
                      setCurrentPage(1);
                    }}
                    className={`text-xs py-1 px-2.5 rounded-md border transition-colors ${selectedTag === tag
                      ? "bg-[#2f4050] text-white border-[#2f4050]"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:border-[#2f4050] hover:text-[#2f4050]"
                      }`}
                  >
                    {tag}
                  </button>
                ))}

              </div>
            </div>
          </aside>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="w-[90%] max-w-[1200px] mx-auto px-4 mt-12 flex justify-center gap-2">
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

      </main>

      <Footer />

    </div>
  );
}
