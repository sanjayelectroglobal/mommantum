"use client"
import { useEffect, useState, useMemo } from "react"
import { AdminSearchBar, AdminEmptySearch } from "../_components/AdminSearchBar"
import { getAdminCache, setAdminCache } from "../_lib/admin-cache"

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const cached = getAdminCache<any[]>("admin_users_customers")
    if (cached && cached.length > 0) {
      setCustomers(cached)
      setLoading(false)
    }

    fetch("/api/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        setCustomers(list)
        setAdminCache("admin_users_customers", list)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers
    const q = searchQuery.toLowerCase().trim()
    return customers.filter((c) => {
      const id = (c.id || "").toLowerCase()
      const email = (c.email || "").toLowerCase()
      const role = (c.role || "").toLowerCase()
      return id.includes(q) || email.includes(q) || role.includes(q)
    })
  }, [customers, searchQuery])

  return (
    <div className="pb-16 text-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-white">
            Users
          </h1>
          <p className="mt-1 text-[14px] text-slate-400" suppressHydrationWarning>
            {customers.length} users total • View user accounts and profiles registered on the storefront
          </p>
        </div>
        <div className="shrink-0">
          <AdminSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search users..."
          />
        </div>
      </div>

      {loading ? (
        <div className="mt-16 text-center text-slate-400">Loading users...</div>
      ) : customers.length === 0 ? (
        <div className="mt-16 text-center rounded-[18px] bg-[#111827] p-12 border border-[#1f2937]">
          <p className="text-slate-400">No users found.</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <AdminEmptySearch
          query={searchQuery}
          onClear={() => setSearchQuery("")}
          label="users"
        />
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
              {filteredCustomers.map((c) => (
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
