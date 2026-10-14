"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAdminPath } from "@lib/hooks/use-admin-path"

export default function AdminOrdersList() {
  const { prefixPath } = useAdminPath()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => {
        setOrders(Array.isArray(d) ? d : [])
        setLoading(false)
      })
  }, [])

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div>
      <div>
        <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-white">
          Orders
        </h1>
        <p className="mt-1 text-[14px] text-slate-400">
          Manage and inspect storefront customer orders
        </p>
      </div>

      {loading ? (
        <div className="mt-16 text-center text-slate-400">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="mt-16 text-center rounded-[18px] bg-[#111827] p-12 border border-[#1f2937]">
          <p className="text-slate-400">No orders found yet.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-[18px] border border-[#1f2937] bg-[#111827]">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#1f2937] text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
                <th className="p-4">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Customer Email</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-[#1f2937]/30 transition-colors">
                  <td className="p-4 font-bold text-white">
                    #{o.display_id || o.id.slice(6, 12).toUpperCase()}
                  </td>
                  <td className="p-4 text-slate-400">
                    {formatDate(o.created_at)}
                  </td>
                  <td className="p-4 text-slate-300">
                    {o.email}
                  </td>
                  <td className="p-4 text-slate-400">
                    {o.items_count} item(s)
                  </td>
                  <td className="p-4 text-white font-semibold">
                    ₹{(o.total / 100).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block rounded-[8px] px-2.5 py-1 text-[11px] font-bold capitalize ${
                        o.status === "completed"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : o.status === "canceled"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {o.status || "pending"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={prefixPath(`/admin/orders/${o.id}`)}
                      className="inline-block rounded-[8px] border border-[#1f2937] bg-[#1f2937]/50 px-3 py-1.5 text-[12px] font-semibold text-white hover:border-[#374151] transition-all"
                    >
                      Inspect Details
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
