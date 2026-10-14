"use client"
import { useEffect, useState } from "react"

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => {
        // Customers are users that are either 'seo' role or default storefront users
        setCustomers(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="text-slate-200">
      <div>
        <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-white">
          Users
        </h1>
        <p className="mt-1 text-[14px] text-slate-400">
          View user accounts and profiles registered on the storefront
        </p>
      </div>

      {loading ? (
        <div className="mt-16 text-center text-slate-400">Loading users...</div>
      ) : customers.length === 0 ? (
        <div className="mt-16 text-center rounded-[18px] bg-[#111827] p-12 border border-[#1f2937]">
          <p className="text-slate-400">No users found.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-[18px] border border-[#1f2937] bg-[#111827]">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#1f2937] text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
                <th className="p-4">User ID</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Assigned Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-[#1f2937]/30 transition-colors">
                  <td className="p-4 font-mono text-[12px] text-slate-400">
                    {c.id}
                  </td>
                  <td className="p-4 font-bold text-white">
                    {c.email}
                  </td>
                  <td className="p-4 text-slate-300 capitalize">
                    <span className="inline-block rounded-full bg-slate-800 px-3 py-1 text-[11px] font-medium border border-slate-700">
                      {c.role || "User"}
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
