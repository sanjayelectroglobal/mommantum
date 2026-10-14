"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminPath } from "@lib/hooks/use-admin-path"

export default function NewProductPage() {
  const router = useRouter()
  const { prefixPath } = useAdminPath()
  const [saving, setSaving] = useState(false)
  const [collections, setCollections] = useState<any[]>([])

  const [form, setForm] = useState({
    title: "",
    handle: "",
    description: "",
    thumbnail: "",
    price: "",
    sku: "",
    inventory_quantity: "10",
    status: "draft",
    collection_id: "",
  })

  useEffect(() => {
    fetch("/api/admin/collections")
      .then((r) => r.json())
      .then((d) => setCollections(Array.isArray(d) ? d : []))
      .catch((err) => console.error(err))
  }, [])

  function updateForm(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (key === "title") {
      const generatedSlug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .slice(0, 80)
      setForm((prev) => ({ ...prev, title: value, handle: generatedSlug }))
    }
  }

  async function handleSave() {
    if (!form.title.trim() || !form.handle.trim()) {
      alert("Title and handle are required")
      return
    }

    setSaving(true)

    // Convert price to cents (rupees * 100)
    const priceInCents = Math.round(parseFloat(form.price || "0") * 100)

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: priceInCents,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push(prefixPath("/admin/products"))
      } else {
        alert("Error: " + (data.error || JSON.stringify(data)))
      }
    } catch {
      alert("Network error. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    "w-full rounded-[12px] border border-[#1f2937] bg-[#111827] px-4 py-3 text-[14px] text-white outline-none transition-all placeholder:text-slate-500 focus:border-[#374151] focus:ring-2 focus:ring-[#374151]/20"
  const labelClass =
    "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.05em] text-[#e2e8f0]"

  return (
    <div className="mx-auto max-w-[800px] text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-[-0.04em] text-white">
            New Product
          </h1>
          <p className="mt-1 text-[14px] text-slate-400">
            Create a new storefront product
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(prefixPath("/admin/products"))}
            className="rounded-[10px] border border-[#1f2937] bg-[#1f2937]/50 px-4 py-2 text-[13px] font-semibold text-slate-300 hover:border-[#374151] hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-[10px] bg-[#e61e73] px-5 py-2 text-[13px] font-bold text-white hover:bg-[#ca155f] disabled:opacity-50 transition-all"
          >
            {saving ? "Creating..." : "Create Product"}
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {/* General Info */}
        <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937]">
          <h2 className="mb-5 text-[15px] font-extrabold text-white">General Information</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Product Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
                placeholder="e.g. Premium Cotton Shirt"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Product Handle *</label>
              <input
                type="text"
                value={form.handle}
                onChange={(e) => updateForm("handle", e.target.value)}
                placeholder="premium-cotton-shirt"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
                placeholder="Write product description here..."
                rows={4}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937]">
          <h2 className="mb-5 text-[15px] font-extrabold text-white">Pricing & Stock</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Price (INR) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => updateForm("price", e.target.value)}
                placeholder="₹ 999.00"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>SKU</label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => updateForm("sku", e.target.value)}
                placeholder="SKU-XXXX"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Inventory Stock *</label>
              <input
                type="number"
                value={form.inventory_quantity}
                onChange={(e) => updateForm("inventory_quantity", e.target.value)}
                placeholder="10"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Media & Organization */}
        <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937]">
          <h2 className="mb-5 text-[15px] font-extrabold text-white">Media & Organization</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Thumbnail Image URL</label>
              <input
                type="text"
                value={form.thumbnail}
                onChange={(e) => updateForm("thumbnail", e.target.value)}
                placeholder="https://..."
                className={inputClass}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Collection</label>
                <select
                  value={form.collection_id}
                  onChange={(e) => updateForm("collection_id", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select Collection</option>
                  {collections.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => updateForm("status", e.target.value)}
                  className={inputClass}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
