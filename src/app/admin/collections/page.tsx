"use client"
import { useEffect, useState } from "react"

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState("")
  const [handle, setHandle] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    fetchCollections()
  }, [])

  function fetchCollections() {
    setLoading(true)
    fetch("/api/admin/collections")
      .then((res) => res.json())
      .then((data) => {
        setCollections(Array.isArray(data) ? data : [])
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

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete collection "${name}"?`)) return
    const res = await fetch(`/api/admin/collections/${id}`, { method: "DELETE" })
    if (res.ok) {
      fetchCollections()
    } else {
      alert("Failed to delete collection")
    }
  }

  const inputClass =
    "w-full rounded-[12px] border border-[#1f2937] bg-[#111827] px-4 py-3 text-[14px] text-white outline-none transition-all placeholder:text-slate-500 focus:border-[#374151]"
  const labelClass =
    "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.05em] text-[#e2e8f0]"

  return (
    <div className="max-w-[1000px] text-slate-200">
      <div>
        <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-white">
          Product Collections
        </h1>
        <p className="mt-1 text-[14px] text-slate-400">
          Group products into collections for easier customer browsing
        </p>
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
          <h2 className="text-[16px] font-extrabold text-white mb-4">
            Collections List
          </h2>

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
                          onClick={() => handleDelete(col.id, col.title)}
                          className="rounded-[8px] border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-[12px] font-semibold text-red-400 hover:bg-red-500/20 transition-all"
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
    </div>
  )
}
