"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function AdminPriceListsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  // Flatten products into pricing rows
  const pricingItems: any[] = []
  products.forEach((p) => {
    ;(p.variants || []).forEach((v: any) => {
      const priceInCents = v.prices?.[0]?.amount || 0
      pricingItems.push({
        productId: p.id,
        productTitle: p.title,
        variantTitle: v.title,
        sku: v.sku,
        price: priceInCents / 100,
      })
    })
  })

  return (
    <div className="text-slate-200 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-white">
            Price Lists
          </h1>
          <p className="mt-1 text-[14px] text-slate-400">
            {pricingItems.length} price rules total • Manage product pricing catalogs, regional currencies, and rate sheets
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mt-16 text-center text-slate-400">Loading price list...</div>
      ) : pricingItems.length === 0 ? (
        <div className="mt-16 text-center rounded-[18px] bg-[#111827] p-12 border border-[#1f2937]">
          <p className="text-slate-400">No prices found.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-[18px] border border-[#1f2937] bg-[#111827]">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#1f2937] text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
                <th className="p-4">Product Variant</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Active Pricing</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {pricingItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#1f2937]/30 transition-colors">
                  <td className="p-4 font-bold text-white">
                    {item.productTitle} <span className="text-slate-500 font-semibold text-[11px] ml-1">({item.variantTitle})</span>
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-[12px]">
                    {item.sku || "—"}
                  </td>
                  <td className="p-4 font-extrabold text-green-400 text-[14px]">
                    ₹ {item.price.toFixed(2)}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/products/${item.productId}`}
                      className="inline-block rounded-[8px] border border-[#1f2937] bg-[#1f2937]/50 px-3 py-1.5 text-[12px] font-semibold text-white hover:border-[#374151] transition-all"
                    >
                      Update Price
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
