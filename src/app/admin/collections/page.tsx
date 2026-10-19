"use client"
import { useEffect, useState } from "react"
import { getAdminCache, setAdminCache } from "../_lib/admin-cache"

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState("")
  const [handle, setHandle] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    const cached = getAdminCache<any[]>("admin_collections")
    if (cached && cached.length > 0) {
      setCollections(cached)
      setLoading(false)
    }
    fetchCollections()
  }, [])

  function fetchCollections() {
    fetch("/api/admin/collections")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        setCollections(list)
        setAdminCache("admin_collections", list)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!editingId) {
      setHandle(val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !handle.trim()) {
      alert("Title and handle are required")
      return
    }

    setFormLoading(true)
    const url = editingId ? `/api/admin/collections/${editingId}` : "/api/admin/collections"
    const method = editingId ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, handle }),
      })

      if (res.ok) {
        setTitle("")
        setHandle("")
        setEditingId(null)
        fetchCollections()
      } else {
        const data = await res.json()
        alert("Error: " + (data.error || "Failed to save collection"))
      }
    } catch {
      alert("Network error")
    } finally {
      setFormLoading(false)
    }
  }

  const [deletingCollection, setDeletingCollection] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  function startEdit(col: any) {
    setEditingId(col.id)
    setTitle(col.title)
    setHandle(col.handle)
  }

  function cancelEdit() {
    setEditingId(null)
    setTitle("")
    setHandle("")
  }

  async function handleConfirmDelete() {
    if (!deletingCollection) return
    setIsDeleting(true)
    setDeleteError(null)

    try {
      const res = await fetch(`/api/admin/collections/${encodeURIComponent(deletingCollection.id)}`, { method: "DELETE" })
      if (res.ok) {
        setCollections((prev) => {
          const next = prev.filter((c) => c.id !== deletingCollection.id)
          setAdminCache("admin_collections", next)
          return next
        })
        setDeletingCollection(null)
      } else {
        const d = await res.json().catch(() => null)
        setDeleteError(d?.error || "Failed to delete collection")
      }
    } catch {
      setDeleteError("Network error while deleting collection")
    } finally {
      setIsDeleting(false)
    }
  }

  const inputClass =
    "w-full rounded-[12px] border border-[#1f2937] bg-[#111827] px-4 py-3 text-[14px] text-white outline-none transition-all placeholder:text-slate-500 focus:border-[#374151]"
  const labelClass =
    "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.05em] text-[#e2e8f0]"

  return (
    <div className="text-slate-200 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-white">
            Product Collections
          </h1>
          <p className="mt-1 text-[14px] text-slate-400">
            {collections.length} collections total • Group products into collections for easier customer browsing
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        {/* Left Side: Create/Edit Form */}
        <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937] h-fit">
          <h2 className="text-[16px] font-extrabold text-white mb-4">
            {editingId ? "Edit Collection" : "Add New Collection"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Collection Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. New Arrivals"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Handle *</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="new-arrivals"
                className={inputClass}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={formLoading}
                className="flex-1 h-[44px] rounded-[10px] bg-[#e61e73] text-[13px] font-bold text-white transition-all hover:bg-[#ca155f] disabled:opacity-50"
              >
                {formLoading ? "Saving..." : editingId ? "Save" : "Create"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 h-[44px] rounded-[10px] border border-[#1f2937] text-[13px] font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Side: List Collections */}
        <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937] md:col-span-2">
          <div className="mb-4">
            <h2 className="text-[16px] font-extrabold text-white">
              Collections List
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading collections...</div>
          ) : collections.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No collections found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-[#1f2937] text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Handle</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f2937]">
                  {collections.map((col) => (
                    <tr key={col.id} className="text-white hover:bg-[#1f2937]/20">
                      <td className="py-3.5 font-bold">{col.title}</td>
                      <td className="py-3.5 text-slate-400 font-mono">/{col.handle}</td>
                      <td className="py-3.5 text-right space-x-2">
                        <button
                          onClick={() => startEdit(col)}
                          className="rounded-[8px] border border-[#1f2937] bg-[#1f2937]/50 px-2.5 py-1.5 text-[12px] font-semibold text-white hover:border-[#374151] transition-all"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError(null)
                            setDeletingCollection(col)
                          }}
                          className="rounded-[8px] border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-[12px] font-semibold text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all cursor-pointer"
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
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {deletingCollection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-[18px] border border-[#1f2937] bg-[#111827] p-6 shadow-2xl">
            <h3 className="text-[17px] font-extrabold text-white">Delete Collection</h3>
            <p className="mt-2 text-[13px] text-slate-300">
              Are you sure you want to delete <span className="text-white font-bold">&quot;{deletingCollection.title}&quot;</span>? This cannot be undone.
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
                  setDeletingCollection(null)
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
                <span>{isDeleting ? "Deleting..." : "Delete Collection"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
