"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [newStock, setNewStock] = useState<string>("")

  useEffect(() => {
    fetchProducts()
  }, [])

  function fetchProducts() {
    setLoading(true)
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => {
        setProducts(Array.isArray(d) ? d : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  async function handleUpdateStock(productId: string, variantId: string) {
    if (newStock === "") return
    const stockVal = parseInt(newStock)
    if (isNaN(stockVal)) {
      alert("Invalid stock number")
      return
    }

    setUpdatingId(variantId)
    try {
      // Fetch current details of product to update
      const resDetail = await fetch(`/api/admin/products/${productId}`)
      if (!resDetail.ok) throw new Error()
      const currentProd = await resDetail.json()

      // Send update
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: currentProd.title,
          handle: currentProd.handle,
          description: currentProd.description,
          thumbnail: currentProd.thumbnail,
          status: currentProd.status,
          collection_id: currentProd.collection_id,
          sku: currentProd.variants?.[0]?.sku || "",
          price: (currentProd.variants?.[0]?.prices?.[0]?.amount || 0),
          inventory_quantity: stockVal, // update stock
        }),
      })

      if (res.ok) {
        setNewStock("")
        setUpdatingId(null)
        fetchProducts()
      } else {
        alert("Failed to update stock")
      }
    } catch {
      alert("Error updating inventory")
    } finally {
      setUpdatingId(null)
    }
  }

  // Flatten variants
  const inventoryItems: any[] = []
  products.forEach((p) => {
    ;(p.variants || []).forEach((v: any) => {
      inventoryItems.push({
        productId: p.id,
        productTitle: p.title,
        handle: p.handle,
        thumbnail: p.thumbnail,
        variantId: v.id,
        variantTitle: v.title,
        sku: v.sku,
        inventory: v.inventory_quantity ?? 0,
      })
    })
  })

  return (
    <div className="pb-16 text-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-white">
            Inventory
          </h1>
          <p className="mt-1 text-[14px] text-slate-400">
            {inventoryItems.length} variants total • Manage variant inventory stock levels across all products
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mt-16 text-center text-slate-400">Loading inventory items...</div>
      ) : inventoryItems.length === 0 ? (
        <div className="mt-16 text-center rounded-[18px] bg-[#111827] p-12 border border-[#1f2937]">
          <p className="text-slate-400">No product inventory found.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-[18px] border border-[#1f2937] bg-[#111827]">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#1f2937] text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
                <th className="p-4">Product Variant</th>
                <th className="p-4">SKU</th>
                <th className="p-4">In Stock</th>
                <th className="p-4">Quick Edit Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {inventoryItems.map((item) => (
                <tr key={item.variantId} className="hover:bg-[#1f2937]/30 transition-colors">
                  <td className="p-4 font-semibold text-white">
                    <div className="flex items-center gap-3">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.productTitle}
                          className="h-9 w-9 rounded-md object-cover bg-slate-800"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-md bg-slate-800 flex items-center justify-center text-slate-500 font-bold">
                          📦
                        </div>
                      )}
                      <div>
                        <p>{item.productTitle}</p>
                        <p className="text-[11px] text-slate-500">{item.variantTitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-[12px]">
                    {item.sku || "—"}
                  </td>
                  <td className="p-4 font-bold text-white">
                    <span
                      className={`inline-block rounded-[6px] px-2 py-0.5 text-[11px] ${
                        item.inventory > 5
                          ? "bg-green-500/10 text-green-400"
                          : item.inventory > 0
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {item.inventory} available
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="New qty..."
                        onChange={(e) => setNewStock(e.target.value)}
                        className="w-24 rounded-[8px] border border-[#1f2937] bg-[#111827] px-2.5 py-1 text-[12px] text-white outline-none focus:border-[#374151]"
                      />
                      <button
                        onClick={() => handleUpdateStock(item.productId, item.variantId)}
                        disabled={updatingId === item.variantId}
                        className="rounded-[8px] bg-[#e61e73] px-3 py-1 text-[11px] font-bold text-white hover:bg-[#ca155f] disabled:opacity-50"
                      >
                        {updatingId === item.variantId ? "Updating..." : "Update"}
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/products/${item.productId}`}
                      className="inline-block rounded-[8px] border border-[#1f2937] bg-[#1f2937]/50 px-3 py-1.5 text-[12px] font-semibold text-white hover:border-[#374151] transition-all"
                    >
                      Edit Product
                    </Link>
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
