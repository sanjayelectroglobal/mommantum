"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAdminPath } from "@lib/hooks/use-admin-path"

export default function AdminBlogList() {
  const { prefixPath } = useAdminPath()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then((d) => {
        setPosts(Array.isArray(d) ? d : [])
        setLoading(false)
      })
  }, [])

  async function deletePost(slug: string) {
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/blog/${slug}`, { method: "DELETE" })
    if (res.ok) setPosts(posts.filter((p) => p.slug !== slug))
    else alert("Failed to delete post")
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
      setPosts(posts.map((p) =>
        p.slug === post.slug ? { ...p, status: nextStatus } : p
      ))
    } else {
      alert("Failed to update status")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-white">
            Blog Posts
          </h1>
          <p className="mt-1 text-[14px] text-slate-400">
            {posts.length} total posts
          </p>
        </div>
        <Link
          href={prefixPath("/admin/blog/new")}
          prefetch={true}
          className="rounded-[10px] bg-[#e61e73] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-[#ca155f] transition-all"
        >
          + New Post
        </Link>
      </div>

      {loading ? (
        <div className="mt-16 text-center text-slate-400">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="mt-16 text-center rounded-[18px] bg-[#111827] p-12 border border-[#1f2937]">
          <p className="text-slate-400">No blog posts yet.</p>
          <Link
            href={prefixPath("/admin/blog/new")}
            prefetch={true}
            className="mt-4 inline-block rounded-[10px] bg-[#e61e73] px-5 py-2.5 text-[13px] font-bold text-white"
          >
            Create your first post
          </Link>
        </div>
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
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-[#1f2937]/30 transition-colors">
                  <td className="p-4 font-semibold text-white max-w-[320px] truncate">
                    {post.title}
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
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => togglePublish(post)}
                      className="rounded-[8px] border border-[#1f2937] bg-[#1f2937]/50 px-3 py-1.5 text-[12px] font-semibold text-slate-300 hover:border-[#374151] hover:text-white transition-all"
                    >
                      {post.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                    <Link
                      href={prefixPath(`/admin/blog/${post.slug}`)}
                      prefetch={true}
                      className="inline-block rounded-[8px] border border-[#1f2937] bg-[#1f2937]/50 px-3 py-1.5 text-[12px] font-semibold text-white hover:border-[#374151] transition-all"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="inline-block rounded-[8px] border border-[#1f2937] bg-[#1f2937]/50 px-3 py-1.5 text-[12px] font-semibold text-slate-400 hover:text-slate-300 transition-all"
                    >
                      View ↗
                    </Link>
                    <button
                      onClick={() => deletePost(post.slug)}
                      className="rounded-[8px] border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[12px] font-semibold text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}