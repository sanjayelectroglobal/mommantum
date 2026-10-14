"use client"
import { useEffect, useState } from "react"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState("")
  const [handle, setHandle] = useState("")
  const [description, setDescription] = useState("")
  const [rank, setRank] = useState("0")
  const [isActive, setIsActive] = useState(true)
  const [isInternal, setIsInternal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  function fetchCategories() {
    setLoading(true)
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }

  function handleNameChange(val: string) {
    setName(val)
    if (!editingId) {
      setHandle(val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !handle.trim()) {
      alert("Name and handle are required")
      return
    }

    setFormLoading(true)
    const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories"
    const method = editingId ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          handle,
          description,
          rank: parseInt(rank || "0"),
          is_active: isActive,
          is_internal: isInternal,
        }),
      })

      if (res.ok) {
        setName("")
        setHandle("")
        setDescription("")
        setRank("0")
        setIsActive(true)
        setIsInternal(false)
        setEditingId(null)
        fetchCategories()
      } else {
        const data = await res.json()
        alert("Error: " + (data.error || "Failed to save category"))
      }
    } catch {
      alert("Network error")
    } finally {
      setFormLoading(false)
    }
  }

  function startEdit(cat: any) {
    setEditingId(cat.id)
    setName(cat.name)
    setHandle(cat.handle)
    setDescription(cat.description || "")
    setRank((cat.rank ?? 0).toString())
    setIsActive(cat.is_active ?? true)
    setIsInternal(cat.is_internal ?? false)
  }

  function cancelEdit() {
    setEditingId(null)
    setName("")
    setHandle("")
    setDescription("")
    setRank("0")
    setIsActive(true)
    setIsInternal(false)
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete category "${name}"?`)) return
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" })
    if (res.ok) {
      fetchCategories()
    } else {
      alert("Failed to delete category")
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
          Product Categories
        </h1>
        <p className="mt-1 text-[14px] text-slate-400">
          Create hierarchy-based categories for products
        </p>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        {/* Left Side: Create/Edit Form */}
        <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937] h-fit">
          <h2 className="text-[16px] font-extrabold text-white mb-4">
            {editingId ? "Edit Category" : "Add New Category"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Category Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Shirts"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Handle *</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="shirts"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Category description..."
                rows={2}
                className={inputClass}
              />
            </div>

            <div className="grid gap-2 grid-cols-2">
              <div>
                <label className={labelClass}>Rank</label>
                <input
                  type="number"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  placeholder="0"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col justify-end pb-1 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-[12px]">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="accent-[#e61e73]"
                  />
                  Active
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[12px]">
                  <input
                    type="checkbox"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                    className="accent-[#e61e73]"
                  />
                  Internal
                </label>
              </div>
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

        {/* Right Side: List Categories */}
        <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937] md:col-span-2">
          <h2 className="text-[16px] font-extrabold text-white mb-4">
            Categories List
          </h2>

          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No categories found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-[#1f2937] text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Handle</th>
                    <th className="pb-3">Rank</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f2937]">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="text-white hover:bg-[#1f2937]/20">
                      <td className="py-3.5 font-bold">{cat.name}</td>
                      <td className="py-3.5 text-slate-400 font-mono">/{cat.handle}</td>
                      <td className="py-3.5 text-slate-400">{cat.rank ?? 0}</td>
                      <td className="py-3.5">
                        <span
                          className={`inline-block rounded-[6px] px-2 py-0.5 text-[11px] font-bold ${
                            cat.is_active
                              ? "bg-green-500/10 text-green-400"
                              : "bg-slate-500/10 text-slate-400"
                          }`}
                        >
                          {cat.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3.5 text-right space-x-2">
                        <button
                          onClick={() => startEdit(cat)}
                          className="rounded-[8px] border border-[#1f2937] bg-[#1f2937]/50 px-2.5 py-1.5 text-[12px] font-semibold text-white hover:border-[#374151] transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
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
