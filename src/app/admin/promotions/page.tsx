"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAdminPath } from "@lib/hooks/use-admin-path"

export default function AdminPromotionsPage() {
  const { prefixPath } = useAdminPath()
  const [collections, setCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/collections")
      .then((res) => res.json())
      .then((data) => {
        setCollections(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="text-slate-200">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-white">
            Promotions
          </h1>
          <p className="mt-1 text-[14px] text-slate-400">
            Create discount collections and marketing campaigns
          </p>
        </div>
        <Link
          href={prefixPath("/admin/collections")}
          className="rounded-[10px] bg-[#e61e73] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-[#ca155f]"
        >
          Manage Collections
        </Link>
      </div>

      {loading ? (
        <div className="mt-16 text-center text-slate-400">Loading promotions...</div>
      ) : collections.length === 0 ? (
        <div className="mt-16 text-center rounded-[18px] bg-[#111827] p-12 border border-[#1f2937]">
          <p className="text-slate-400">No active promotions found. Create collections to group discounted products.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-[18px] border border-[#1f2937] bg-[#111827]">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#1f2937] text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
                <th className="p-4">Promotion Name</th>
                <th className="p-4">Handle</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {collections.map((c) => (
                <tr key={c.id} className="hover:bg-[#1f2937]/30 transition-colors">
                  <td className="p-4 font-bold text-white">
                    {c.title}
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-[12px]">
                    /collections/{c.handle}
                  </td>
                  <td className="p-4 text-right">
                    <span className="inline-block rounded-[8px] bg-green-500/10 px-2.5 py-1 text-[11px] font-bold text-green-400 border border-green-500/20">
                      Active Campaign
                    </span>
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
