"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAdminPath } from "@lib/hooks/use-admin-path"

export default function AdminCaseStudiesList() {
  const { prefixPath } = useAdminPath()
  const [studies, setStudies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/case-studies")
      .then((r) => r.json())
      .then((d) => {
        setStudies(Array.isArray(d) ? d : [])
        setLoading(false)
      })
  }, [])

  async function deleteStudy(id: string, name: string) {
    if (!confirm(`Delete case study "${name}"? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/case-studies/${id}`, { method: "DELETE" })
    if (res.ok) {
      setStudies(studies.filter((s) => s.id !== id))
    } else {
      alert("Failed to delete case study")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-white">
            Case Studies
          </h1>
          <p className="mt-1 text-[14px] text-slate-400">
            {studies.length} case studies total
          </p>
        </div>
        <Link
          href={prefixPath("/admin/case-studies/new")}
          className="rounded-[10px] bg-[#e61e73] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-[#ca155f] transition-all"
        >
          + New Case Study
        </Link>
      </div>

      {loading ? (
        <div className="mt-16 text-center text-slate-400">Loading case studies...</div>
      ) : studies.length === 0 ? (
        <div className="mt-16 text-center rounded-[18px] bg-[#111827] p-12 border border-[#1f2937]">
          <p className="text-slate-400">No case studies found.</p>
          <Link
            href={prefixPath("/admin/case-studies/new")}
            className="mt-4 inline-block rounded-[10px] bg-[#e61e73] px-5 py-2.5 text-[13px] font-bold text-white"
          >
            Create your first case study
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-[18px] border border-[#1f2937] bg-[#111827]">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#1f2937] text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
                <th className="p-4">Case Study</th>
                <th className="p-4">Category</th>
                <th className="p-4">Slug</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {studies.map((s) => (
                <tr key={s.id} className="hover:bg-[#1f2937]/30 transition-colors">
                  <td className="p-4 font-semibold text-white">
                    <div className="flex items-center gap-3">
                      {s.image ? (
                        <img
                          src={s.image}
                          alt={s.title}
                          className="h-10 w-16 rounded-md object-cover bg-slate-800"
                        />
                      ) : (
                        <div className="h-10 w-16 rounded-md bg-slate-800 flex items-center justify-center text-slate-500 font-bold">
                          💼
                        </div>
                      )}
                      <span>{s.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-400 font-semibold">
                    {s.category || "Uncategorized"}
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-[12px]">
                    /work/{s.slug}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link
                      href={prefixPath(`/admin/case-studies/${s.id}`)}
                      className="inline-block rounded-[8px] border border-[#1f2937] bg-[#1f2937]/50 px-3 py-1.5 text-[12px] font-semibold text-white hover:border-[#374151] transition-all"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/work/${s.slug}`}
                      target="_blank"
                      className="inline-block rounded-[8px] border border-[#1f2937] bg-[#1f2937]/50 px-3 py-1.5 text-[12px] font-semibold text-slate-400 hover:text-slate-300 transition-all"
                    >
                      View ↗
                    </Link>
                    <button
                      onClick={() => deleteStudy(s.id, s.title)}
                      className="rounded-[8px] border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[12px] font-semibold text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      Delete
                    </button>
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
