/**
 * Blog Admin Management Page
 * 
 * Purpose:
 * Provides an administrative dashboard to manage Mommantum's blog posts.
 * Includes search/filtering, quick publishing status toggle, full post editing
 * via BlogEditor modal, and deletion workflows with safety prompts.
 * 
 * Layout Architecture:
 * - Responsive table with `overflow-x-auto` to protect layout integrity on smaller viewports.
 * - Actions column: Uses `whitespace-nowrap` and `flex items-center justify-end gap-2`
 *   to keep the 4 action controls (Publish/Unpublish, Edit, View, Delete) arranged in a
 *   single, neat horizontal row.
 * - Vertically centered row cells (`align-middle`) for balanced visual harmony.
 */

"use client"
import { useEffect, useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { AdminSearchBar, AdminEmptySearch } from "../_components/AdminSearchBar"
import { getAdminCache, setAdminCache } from "../_lib/admin-cache"
import BlogEditor from "./_components/BlogEditor"

export default function AdminBlogList() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Modal & operation states
  const [editingPost, setEditingPost] = useState<any | null>(null)
  const [deletingPost, setDeletingPost] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/blog")
      const d = await r.json()
      const list = Array.isArray(d) ? d : []
      setPosts(list)
      setAdminCache("admin_blog_posts", list)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const cached = getAdminCache<any[]>("admin_blog_posts")
    if (cached && cached.length > 0) {
      setPosts(cached)
      setLoading(false)
    }
    fetchPosts()
  }, [fetchPosts])

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts
    const q = searchQuery.toLowerCase().trim()
    return posts.filter((p) => {
      const title = (p.title || "").toLowerCase()
      const slug = (p.slug || "").toLowerCase()
      const category = (p.category_id || "").toLowerCase()
      const author = (p.author_name || "").toLowerCase()
      const status = (p.status || "").toLowerCase()
      return (
        title.includes(q) ||
        slug.includes(q) ||
        category.includes(q) ||
        author.includes(q) ||
        status.includes(q)
      )
    })
  }, [posts, searchQuery])

  async function handleConfirmDelete() {
    if (!deletingPost) return
    setIsDeleting(true)
    setDeleteError(null)

    try {
      const identifier = encodeURIComponent(deletingPost.slug || deletingPost.id)
      const res = await fetch(`/api/admin/blog/${identifier}`, { method: "DELETE" })
      if (res.ok) {
        setPosts((prev) => {
          const next = prev.filter(
            (p) => p.id !== deletingPost.id && p.slug !== deletingPost.slug
          )
          setAdminCache("admin_blog_posts", next)
          return next
        })
        setDeletingPost(null)
      } else {
        const d = await res.json().catch(() => null)
        setDeleteError(d?.error || "Failed to delete post")
      }
    } catch {
      setDeleteError("Network error. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  async function togglePublish(post: any) {
    const nextStatus = post.status === "published" ? "draft" : "published"
    const res = await fetch(`/api/admin/blog/${post.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...post,
        status: nextStatus,
      }),
    })
    if (res.ok) {
      const nextPosts = posts.map((p) =>
        p.slug === post.slug ? { ...p, status: nextStatus } : p
      )
      setPosts(nextPosts)
      setAdminCache("admin_blog_posts", nextPosts)
    } else {
      alert("Failed to update status")
    }
  }

  return (
    <div className="pb-16">
      {/* ── Page Header (Consistent with Pages & Services) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-white">
            Blog Posts
          </h1>
          <p className="mt-1 text-[14px] text-slate-400" suppressHydrationWarning>
            {posts.length} total posts • Click row or edit to modify details
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <AdminSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search blog posts..."
          />
          <button
            type="button"
            onClick={() =>
              setEditingPost({
                title: "",
                slug: "",
                category_id: "",
                featured_image: "",
                excerpt: "",
                content: "",
                author_name: "Mommantum Team",
                meta_title: "",
                meta_description: "",
                status: "draft",
                image_urls: ["", "", ""],
                faqs: [],
              })
            }
            className="rounded-[10px] bg-[#e61e73] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-[#ca155f] transition-all shrink-0 h-[38px] flex items-center justify-center cursor-pointer"
          >
            + New Post
          </button>
        </div>
      </div>

      {/* ── Content Table (Matches Pages) ── */}
      {loading ? (
        <div className="mt-16 text-center text-slate-400">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="mt-16 text-center rounded-[18px] bg-[#111827] p-12 border border-[#1f2937]">
          <p className="text-slate-400">No blog posts yet.</p>
          <button
            type="button"
            onClick={() =>
              setEditingPost({
                title: "",
                slug: "",
                category_id: "",
                featured_image: "",
                excerpt: "",
                content: "",
                author_name: "Mommantum Team",
                meta_title: "",
                meta_description: "",
                status: "draft",
                image_urls: ["", "", ""],
                faqs: [],
              })
            }
            className="mt-4 inline-block rounded-[10px] bg-[#e61e73] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-[#ca155f] transition-all cursor-pointer"
          >
            Create your first post
          </button>
        </div>
      ) : filteredPosts.length === 0 ? (
        <AdminEmptySearch
          query={searchQuery}
          onClear={() => setSearchQuery("")}
          label="blog posts"
        />
      ) : (
        <div className="mt-8 overflow-hidden rounded-[18px] border border-[#1f2937] bg-[#111827]">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#1f2937] text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {filteredPosts.map((post) => (
                <tr
                  key={post.id || post.slug}
                  onClick={() => setEditingPost(post)}
                  className="hover:bg-[#1f2937]/40 transition-colors cursor-pointer group"
                >
                  <td className="p-4 font-semibold text-white max-w-[320px] truncate">
                    <span className="text-[14px] text-white group-hover:text-[#e61e73] transition-colors font-semibold">
                      {post.title}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">
                    {post.category_id || "Uncategorized"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block rounded-[8px] px-2.5 py-1 text-[11px] font-bold ${
                        post.status === "published"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                      }`}
                    >
                      {post.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-4 align-middle whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          togglePublish(post)
                        }}
                        className="inline-flex items-center justify-center rounded-[8px] border border-[#1f2937] bg-[#1f2937]/60 px-3 py-1.5 text-[12px] font-semibold text-slate-300 hover:border-[#374151] hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        {post.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingPost(post)
                        }}
                        className="inline-flex items-center justify-center rounded-[8px] border border-[#1f2937] bg-[#1f2937]/60 px-3 py-1.5 text-[12px] font-semibold text-white hover:border-[#374151] hover:bg-[#1f2937] transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        Edit
                      </button>
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center rounded-[8px] border border-[#1f2937] bg-[#1f2937]/60 px-3 py-1.5 text-[12px] font-semibold text-slate-300 hover:text-white hover:border-[#374151] transition-all shadow-sm active:scale-95"
                      >
                        View ↗
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteError(null)
                          setDeletingPost(post)
                        }}
                        className="inline-flex items-center justify-center rounded-[8px] border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[12px] font-semibold text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Full Screen Edit Modal (Matches Pages SEO View Exactly) ── */}
      {editingPost && (
        <BlogEditor
          initialData={editingPost}
          isEdit={Boolean(editingPost.slug && editingPost.id)}
          onClose={() => setEditingPost(null)}
          onSaveSuccess={fetchPosts}
        />
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deletingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-[18px] border border-[#1f2937] bg-[#111827] p-6 shadow-2xl">
            <h3 className="text-[17px] font-extrabold text-white">Delete Blog Post</h3>
            <p className="mt-2 text-[13px] text-slate-300">
              Are you sure you want to delete <span className="text-white font-bold">&quot;{deletingPost.title || deletingPost.slug}&quot;</span>? This cannot be undone.
            </p>

            {deleteError && (
              <div className="mt-3 rounded-[8px] bg-red-500/10 border border-red-500/30 p-2.5 text-[12px] text-red-400">
                {deleteError}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeletingPost(null)
                  setDeleteError(null)
                }}
                disabled={isDeleting}
                className="rounded-[8px] border border-[#1f2937] bg-[#1f2937]/50 px-4 py-2 text-[12px] font-semibold text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="rounded-[8px] bg-red-600 hover:bg-red-700 px-4 py-2 text-[12px] font-bold text-white transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting && (
                  <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                <span>{isDeleting ? "Deleting..." : "Delete Post"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}