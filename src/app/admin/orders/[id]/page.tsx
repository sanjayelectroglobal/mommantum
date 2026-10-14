"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAdminPath } from "@lib/hooks/use-admin-path"

export default function AdminOrderInspectPage() {
  const router = useRouter()
  const { prefixPath } = useAdminPath()
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => {
        setOrder(data)
        setLoading(false)
      })
      .catch(() => {
        alert("Failed to load order details")
        router.push(prefixPath("/admin/orders"))
      })
  }, [id, router])

  async function handleStatusChange(status: string) {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setOrder({ ...order, status })
      } else {
        alert("Failed to update status")
      }
    } catch {
      alert("Network error")
    } finally {
      setUpdating(false)
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">
        Loading order details...
      </div>
    )
  }

  const sAddr = order.shipping_address || {}
  const bAddr = order.billing_address || {}

  return (
    <div className="mx-auto max-w-[900px] text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-[-0.04em] text-white">
            Order #{order.display_id || order.id.slice(6, 12).toUpperCase()}
          </h1>
          <p className="mt-1 text-[14px] text-slate-400">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(prefixPath("/admin/orders"))}
            className="rounded-[10px] border border-[#1f2937] bg-[#1f2937]/50 px-4 py-2 text-[13px] font-semibold text-slate-300 hover:border-[#374151] hover:text-white transition-all"
          >
            ← Back to Orders
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {/* Left 2 Cols: Items & Status */}
        <div className="space-y-6 md:col-span-2">
          {/* Status Controls */}
          <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937] flex items-center justify-between">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.05em] text-slate-400">
                Order Status
              </p>
              <span className="mt-1 inline-block rounded-[8px] bg-[#1f2937] px-3 py-1 text-[12px] font-bold text-white uppercase border border-[#374151]">
                {order.status || "pending"}
              </span>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
                Change Status
              </label>
              <select
                disabled={updating}
                value={order.status || "pending"}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="h-[38px] rounded-[8px] border border-[#1f2937] bg-[#111827] px-3 text-[12px] text-white outline-none focus:border-[#374151]"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937]">
            <h2 className="mb-4 text-[15px] font-extrabold text-white">Line Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-[#1f2937] text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
                    <th className="pb-3">Item</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Quantity</th>
                    <th className="pb-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f2937]">
                  {order.items?.map((item: any) => (
                    <tr key={item.id} className="text-white">
                      <td className="py-3 font-semibold">{item.title}</td>
                      <td className="py-3 text-slate-400">₹{(item.unit_price / 100).toFixed(2)}</td>
                      <td className="py-3 text-slate-400">{item.quantity}</td>
                      <td className="py-3 text-right font-bold text-white">
                        ₹{((item.unit_price * item.quantity) / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total summary */}
            <div className="mt-6 border-t border-[#1f2937] pt-4 flex justify-between items-center text-[15px]">
              <span className="font-semibold text-slate-400">Grand Total</span>
              <span className="font-extrabold text-white text-[20px]">
                ₹{(order.total / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Customer Details */}
        <div className="space-y-6 md:col-span-1">
          {/* Customer */}
          <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937]">
            <h2 className="mb-4 text-[15px] font-extrabold text-white">Customer</h2>
            <p className="text-[13px] font-semibold text-white truncate" title={order.email}>
              {order.email}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Contact Email</p>
          </div>

          {/* Shipping Address */}
          <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937]">
            <h2 className="mb-4 text-[15px] font-extrabold text-white">Shipping Address</h2>
            {order.shipping_address_id ? (
              <div className="text-[13px] text-slate-300 space-y-1">
                <p className="font-bold text-white">{sAddr.first_name} {sAddr.last_name}</p>
                <p>{sAddr.address_1}</p>
                {sAddr.address_2 && <p>{sAddr.address_2}</p>}
                <p>{sAddr.city}, {sAddr.province} {sAddr.postal_code}</p>
                <p className="uppercase">{sAddr.country_code}</p>
                {sAddr.phone && <p className="text-[11px] text-slate-400">📞 {sAddr.phone}</p>}
              </div>
            ) : (
              <p className="text-[12px] text-slate-500 italic">No shipping address linked.</p>
            )}
          </div>

          {/* Billing Address */}
          <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937]">
            <h2 className="mb-4 text-[15px] font-extrabold text-white">Billing Address</h2>
            {order.billing_address_id ? (
              <div className="text-[13px] text-slate-300 space-y-1">
                <p className="font-bold text-white">{bAddr.first_name} {bAddr.last_name}</p>
                <p>{bAddr.address_1}</p>
                {bAddr.address_2 && <p>{bAddr.address_2}</p>}
                <p>{bAddr.city}, {bAddr.province} {bAddr.postal_code}</p>
                <p className="uppercase">{bAddr.country_code}</p>
              </div>
            ) : (
              <p className="text-[12px] text-slate-500 italic">No billing address linked.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
