"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAdminPath } from "@lib/hooks/use-admin-path"
import { getAdminCache, setAdminCache } from "../_lib/admin-cache"

export default function AdminProductsList() {
  const { prefixPath } = useAdminPath()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [deletingProduct, setDeletingProduct] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    const cached = getAdminCache<any[]>("admin_products")
    if (cached && cached.length > 0) {
      setProducts(cached)
      setLoading(false)
    }

    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d) ? d : []
        setProducts(list)
        setAdminCache("admin_products", list)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function handleConfirmDelete() {
    if (!deletingProduct) return
    setIsDeleting(true)
    setDeleteError(null)

    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(deletingProduct.id)}`, { method: "DELETE" })
      if (res.ok) {
        setProducts((prev) => {
          const next = prev.filter((p) => p.id !== deletingProduct.id)
          setAdminCache("admin_products", next)
          return next
        })
        setDeletingProduct(null)
      } else {
        const d = await res.json().catch(() => null)
        setDeleteError(d?.error || "Failed to delete product")
      }
    } catch {
      setDeleteError("Network error while deleting product")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-white">
            Products
          </h1>
          <p className="mt-1 text-[14px] text-slate-400">
            {products.length} products total
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={prefixPath("/admin/products/new")}
            className="rounded-[10px] bg-[#e61e73] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-[#ca155f] transition-all shrink-0 h-[38px] flex items-center justify-center"
          >
            + New Product
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="mt-16 text-center text-slate-400">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="mt-16 text-center rounded-[18px] bg-[#111827] p-12 border border-[#1f2937]">
          <p className="text-slate-400">No products found.</p>
          <Link
            href={prefixPath("/admin/products/new")}
            className="mt-4 inline-block rounded-[10px] bg-[#e61e73] px-5 py-2.5 text-[13px] font-bold text-white"
          >
            Create your first product
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-[18px] border border-[#1f2937] bg-[#111827]">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#1f2937] text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
                <th className="p-4">Product</th>
                <th className="p-4">Handle</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Price (INR)</th>
                <th className="p-4">Inventory</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {products.map((p) => {
                const defaultVariant = p.variants?.[0] || {}
                const price = defaultVariant.prices?.[0]?.amount || 0
                return (
                  <tr key={p.id} className="hover:bg-[#1f2937]/30 transition-colors">
                    <td className="p-4 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        {p.thumbnail ? (
                          <img
                            src={p.thumbnail}
                            alt={p.title}
                            className="h-10 w-10 rounded-md object-cover bg-slate-800"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-slate-800 flex items-center justify-center text-slate-500 font-bold">
                            📦
                          </div>
                        )}
                        <span>{p.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-[12px]">
                      /{p.handle}
                    </td>
                    <td className="p-4 text-slate-400 font-mono">
                      {defaultVariant.sku || "—"}
                    </td>
                    <td className="p-4 text-white font-semibold">
                      ₹{(price / 100).toFixed(2)}
                    </td>
                    <td className="p-4 text-slate-400">
                      {defaultVariant.inventory_quantity ?? "—"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block rounded-[8px] px-2.5 py-1 text-[11px] font-bold ${
                          p.status === "published"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                        }`}
                      >
                        {p.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={prefixPath(`/admin/products/${p.id}`)}
                        className="inline-block rounded-[8px] border border-[#1f2937] bg-[#1f2937]/50 px-3 py-1.5 text-[12px] font-semibold text-white hover:border-[#374151] transition-all"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/products/${p.handle}`}
                        target="_blank"
                        className="inline-block rounded-[8px] border border-[#1f2937] bg-[#1f2937]/50 px-3 py-1.5 text-[12px] font-semibold text-slate-400 hover:text-slate-300 transition-all"
                      >
                        View ↗
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteError(null)
                          setDeletingProduct(p)
                        }}
                        className="rounded-[8px] border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[12px] font-semibold text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-[18px] border border-[#1f2937] bg-[#111827] p-6 shadow-2xl">
            <h3 className="text-[17px] font-extrabold text-white">Delete Product</h3>
            <p className="mt-2 text-[13px] text-slate-300">
              Are you sure you want to delete <span className="text-white font-bold">&quot;{deletingProduct.title}&quot;</span>? This cannot be undone.
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
                  setDeletingProduct(null)
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
                <span>{isDeleting ? "Deleting..." : "Delete Product"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
