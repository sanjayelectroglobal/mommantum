/**
 * Case Studies Admin Management Page
 * 
 * Purpose:
 * Provides a responsive management interface for Mommantum's client case studies.
 * Supports searching by title/slug/category, inline instant filtering, modal-based
 * editing (via CaseStudyEditor), and deletion with safety confirmations.
 * 
 * Layout Architecture:
 * - Header bar: Title with count indicator, real-time search input, and "+ New Case Study" CTA.
 * - Responsive table: Uses `overflow-x-auto` to prevent horizontal clipping.
 * - Actions column: Employs `whitespace-nowrap` with `flex items-center justify-end gap-2`
 *   to ensure Edit, View, and Delete buttons stay on a single horizontal row across all screen sizes.
 * - Vertically centered cells (`align-middle`) ensure balanced alignment across varying row heights.
 */

"use client"
import { useEffect, useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { AdminSearchBar, AdminEmptySearch } from "../_components/AdminSearchBar"
import { getAdminCache, setAdminCache } from "../_lib/admin-cache"
import CaseStudyEditor from "./_components/CaseStudyEditor"

export default function AdminCaseStudiesList() {
  const [studies, setStudies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Modal state handlers: active study for edit/create or deletion confirmation
  const [editingStudy, setEditingStudy] = useState<any | null>(null)
  const [deletingStudy, setDeletingStudy] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const fetchStudies = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/case-studies")
      const d = await r.json()
      const list = Array.isArray(d) ? d : []
      setStudies(list)
      setAdminCache("admin_case_studies", list)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const cached = getAdminCache<any[]>("admin_case_studies")
    if (cached && cached.length > 0) {
      setStudies(cached)
      setLoading(false)
    }
    fetchStudies()
  }, [fetchStudies])

  const filteredStudies = useMemo(() => {
    if (!searchQuery.trim()) return studies
    const q = searchQuery.toLowerCase().trim()
    return studies.filter((s) => {
      const title = (s.title || "").toLowerCase()
      const slug = (s.slug || "").toLowerCase()
      const category = (s.category || "").toLowerCase()
      return title.includes(q) || slug.includes(q) || category.includes(q)
    })
  }, [studies, searchQuery])

  async function handleConfirmDelete() {
    if (!deletingStudy) return
    setIsDeleting(true)
    setDeleteError(null)

    try {
      const id = deletingStudy.id
      const res = await fetch(`/api/admin/case-studies/${encodeURIComponent(id)}`, { method: "DELETE" })
      if (res.ok) {
        setStudies((prev) => {
          const next = prev.filter((s) => s.id !== id)
          setAdminCache("admin_case_studies", next)
          return next
        })
        setDeletingStudy(null)
      } else {
        const d = await res.json().catch(() => null)
        setDeleteError(d?.error || "Failed to delete case study")
      }
    } catch {
      setDeleteError("Network error. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="pb-16">
      {/* ── Page Header (Consistent with Pages) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-white">
            Case Studies
          </h1>
          <p className="mt-1 text-[14px] text-slate-400" suppressHydrationWarning>
            {studies.length} case studies total • Click row or edit to modify details
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <AdminSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search case studies..."
          />
          <button
            type="button"
            onClick={() =>
              setEditingStudy({
                title: "",
                slug: "",
                category: "",
                tagline: "",
                about: "",
                challenge: "",
                overview: "",
                solution: "",
                insights: "",
                image: "",
                accent: "#e61e73",
              })
            }
            className="rounded-[10px] bg-[#e61e73] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-[#ca155f] transition-all shrink-0 h-[38px] flex items-center justify-center cursor-pointer"
          >
            + New Case Study
          </button>
        </div>
      </div>

      {/* ── Content Table (Matches Pages) ── */}
      {loading ? (
        <div className="mt-16 text-center text-slate-400">Loading case studies...</div>
      ) : studies.length === 0 ? (
        <div className="mt-16 text-center rounded-[18px] bg-[#111827] p-12 border border-[#1f2937]">
          <p className="text-slate-400">No case studies found.</p>
          <button
            type="button"
            onClick={() =>
              setEditingStudy({
                title: "",
                slug: "",
                category: "",
                tagline: "",
                about: "",
                challenge: "",
                overview: "",
                solution: "",
                insights: "",
                image: "",
                accent: "#e61e73",
              })
            }
            className="mt-4 inline-block rounded-[10px] bg-[#e61e73] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-[#ca155f] transition-all cursor-pointer"
          >
            Create your first case study
          </button>
        </div>
      ) : filteredStudies.length === 0 ? (
        <AdminEmptySearch
          query={searchQuery}
          onClear={() => setSearchQuery("")}
          label="case studies"
        />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-[18px] border border-[#1f2937] bg-[#111827] shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#1f2937] text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400 bg-[#0d131f]/50">
                <th className="p-4 min-w-[260px]">Case Study</th>
                <th className="p-4 min-w-[240px]">Category</th>
                <th className="p-4 min-w-[180px]">Slug</th>
                <th className="p-4 text-right w-[240px] whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {filteredStudies.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => setEditingStudy(s)}
                  className="hover:bg-[#1f2937]/40 transition-colors cursor-pointer group"
                >
                  <td className="p-4 align-middle font-semibold text-white">
                    <div className="flex items-center gap-3.5">
                      {s.image ? (
                        <img
                          src={s.image}
                          alt={s.title}
                          className="h-11 w-16 rounded-[8px] object-cover bg-slate-800 border border-[#1f2937] shrink-0 shadow-sm"
                        />
                      ) : (
                        <div className="h-11 w-16 rounded-[8px] bg-slate-800 border border-[#1f2937] flex items-center justify-center text-slate-400 shrink-0 text-sm">
                          💼
                        </div>
                      )}
                      <span className="text-[14px] text-white group-hover:text-[#e61e73] transition-colors font-semibold tracking-[-0.01em]">
                        {s.title}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(s.category || "Uncategorized")
                        .split(/[·,]/)
                        .map((cat: string, idx: number) => {
                          const trimmed = cat.trim()
                          if (!trimmed) return null
                          return (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded-[6px] bg-[#1f2937] px-2.5 py-1 text-[11px] font-medium text-slate-300 border border-slate-700/60 shadow-xs"
                            >
                              {trimmed}
                            </span>
                          )
                        })}
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <span className="inline-flex items-center rounded-[6px] bg-[#0d131f] border border-[#1f2937] px-2.5 py-1 text-slate-400 font-mono text-[12px]">
                      /work/{s.slug}
                    </span>
                  </td>
                  {/* ── Actions: Fixed single-row layout preventing wrapping on smaller viewports ── */}
                  <td className="p-4 align-middle whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingStudy(s)
                        }}
                        className="inline-flex items-center justify-center rounded-[8px] border border-[#1f2937] bg-[#1f2937]/60 px-3.5 py-1.5 text-[12px] font-semibold text-white hover:border-[#374151] hover:bg-[#1f2937] transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        Edit
                      </button>
                      <Link
                        href={`/work/${s.slug}`}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center rounded-[8px] border border-[#1f2937] bg-[#1f2937]/60 px-3.5 py-1.5 text-[12px] font-semibold text-slate-300 hover:text-white hover:border-[#374151] hover:bg-[#1f2937] transition-all shadow-sm active:scale-95"
                      >
                        View ↗
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteError(null)
                          setDeletingStudy(s)
                        }}
                        className="inline-flex items-center justify-center rounded-[8px] border border-red-500/20 bg-red-500/10 px-3.5 py-1.5 text-[12px] font-semibold text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Full Screen Edit Modal (Matches Pages SEO View Exactly) ── */}
      {editingStudy && (
        <CaseStudyEditor
          initialData={editingStudy}
          isEdit={Boolean(editingStudy.id)}
          onClose={() => setEditingStudy(null)}
          onSaveSuccess={fetchStudies}
        />
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deletingStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-[18px] border border-[#1f2937] bg-[#111827] p-6 shadow-2xl">
            <h3 className="text-[17px] font-extrabold text-white">Delete Case Study</h3>
            <p className="mt-2 text-[13px] text-slate-300">
              Are you sure you want to delete <span className="text-white font-bold">&quot;{deletingStudy.title || deletingStudy.slug}&quot;</span>? This cannot be undone.
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
                  setDeletingStudy(null)
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
                <span>{isDeleting ? "Deleting..." : "Delete Case Study"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
