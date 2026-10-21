// Phase 3: Removed store dashboard stats (products, collections, categories, orders).
// Dashboard now shows only Mommantum marketing stats: blog posts and services.
"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAdminPath } from "@lib/hooks/use-admin-path"

export default function AdminDashboard() {
  const { prefixPath } = useAdminPath()
  const [counts, setCounts] = useState({
    blog: 0,
    services: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        setCounts({
          blog: data.blog || 0,
          services: data.services || 0,
        })
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const stats = [
    { label: "Services", count: counts.services, href: "/admin/services", color: "#10b981", icon: "⚡" },
    { label: "Blog Posts", count: counts.blog, href: "/admin/blog", color: "#e61e73", icon: "✍" },
  ]

  return (
    <div className="text-slate-200">
      <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-white">
        Dashboard
      </h1>
      <p className="mt-1 text-[14px] text-slate-400">
        Welcome back to Mommantum Admin. Here is your content overview.
      </p>

      {/* Stats Grid */}
      <div className="mt-8 grid gap-5 grid-cols-2 md:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={prefixPath(s.href)}
            className="rounded-[18px] bg-[#111827] border border-[#1f2937] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all hover:bg-[#1f2937]/50 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
                {s.label}
              </p>
              <span className="text-[18px]">{s.icon}</span>
            </div>
            <p
              className="mt-3 text-[36px] font-extrabold tracking-[-0.04em]"
              style={{ color: s.color }}
            >
              {loading ? "—" : s.count}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-10">
        <h2 className="mb-4 text-[16px] font-extrabold text-white">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href={prefixPath("/admin/blog/new")}
            className="rounded-[10px] bg-[#e61e73] px-5 py-2.5 text-[13px] font-bold text-white transition-all hover:bg-[#ca155f]"
          >
            + New Blog Post
          </Link>
          <Link
            href={prefixPath("/admin/services/new")}
            className="rounded-[10px] bg-[#1f2937] px-5 py-2.5 text-[13px] font-bold text-white transition-all border border-[#374151] hover:bg-[#374151]"
          >
            + New Service
          </Link>
        </div>
      </div>
    </div>
  )
}