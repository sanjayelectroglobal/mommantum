/**
 * Services Admin Management Page
 * 
 * Purpose:
 * Provides an administrative dashboard to manage Mommantum's agency services.
 * Supports real-time search by title or slug, modal editing via ServiceEditor,
 * live site service link previews, and deletion workflows with safety prompts.
 * 
 * Layout Architecture:
 * - Responsive table with `overflow-x-auto` to protect layout integrity on smaller viewports.
 * - Actions column: Employs `whitespace-nowrap` with `flex items-center justify-end gap-2`
 *   to ensure Edit, View, and Delete buttons are arranged in a clean, single horizontal line.
 * - Vertically centered row cells (`align-middle`) for clean vertical alignment.
 */

"use client"
import { useEffect, useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { AdminSearchBar, AdminEmptySearch } from "../_components/AdminSearchBar"
import { getAdminCache, setAdminCache } from "../_lib/admin-cache"
import ServiceEditor from "./_components/ServiceEditor"

export default function AdminServicesList() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Modal & operation states
  const [editingService, setEditingService] = useState<any | null>(null)
  const [deletingService, setDeletingService] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const fetchServices = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/services")
      const d = await r.json()
      const list = Array.isArray(d) ? d : []
      setServices(list)
      setAdminCache("admin_services", list)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const cached = getAdminCache<any[]>("admin_services")
    if (cached && cached.length > 0) {
      setServices(cached)
      setLoading(false)
    }
    fetchServices()
  }, [fetchServices])

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return services
    const q = searchQuery.toLowerCase().trim()
    return services.filter((s) => {
      const title = (s.title || "").toLowerCase()
      const slug = (s.slug || "").toLowerCase()
      const desc = (s.description || "").toLowerCase()
      return title.includes(q) || slug.includes(q) || desc.includes(q)
    })
  }, [services, searchQuery])

  async function handleConfirmDelete() {
    if (!deletingService) return
    setIsDeleting(true)
    setDeleteError(null)

    try {
      const slug = deletingService.slug
      const res = await fetch(`/api/admin/services/${encodeURIComponent(slug)}`, { method: "DELETE" })
      if (res.ok) {
        setServices((prev) => {
          const next = prev.filter((s) => s.slug !== slug)
          setAdminCache("admin_services", next)
          return next
        })
        setDeletingService(null)
      } else {
        const d = await res.json().catch(() => null)
        setDeleteError(d?.error || "Failed to delete service")
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
          <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-white">Services</h1>
          <p className="mt-1 text-[14px] text-slate-400" suppressHydrationWarning>
            {services.length} services total • Click row or edit to modify details
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <AdminSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search services..."
          />
          <button
            type="button"
            onClick={() =>
              setEditingService({
                title: "",
                slug: "",
                shortLabel: "",
                description: "",
                intro: "",
                image: "",
                points: [""],
                outcomes: [""],
                whyItMatters: [""],
              })
            }
            className="rounded-[10px] bg-[#e61e73] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-[#ca155f] transition-all shrink-0 h-[38px] flex items-center justify-center cursor-pointer"
          >
            + New Service
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-16 text-center text-slate-400">Loading services...</div>
      ) : services.length === 0 ? (
        <div className="mt-16 text-center rounded-[18px] bg-[#111827] p-12 border border-[#1f2937]">
          <p className="text-slate-400">No services created yet.</p>
          <button
            type="button"
            onClick={() =>
              setEditingService({
                title: "",
                slug: "",
                shortLabel: "",
                description: "",
                intro: "",
                image: "",
                points: [""],
                outcomes: [""],
                whyItMatters: [""],
              })
            }
            className="mt-4 inline-block rounded-[10px] bg-[#e61e73] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-[#ca155f] transition-all cursor-pointer"
          >
            Create your first service
          </button>
        </div>
      ) : filteredServices.length === 0 ? (
        <AdminEmptySearch
          query={searchQuery}
          onClear={() => setSearchQuery("")}
          label="services"
        />
      ) : (
        <div className="mt-8 overflow-hidden rounded-[18px] border border-[#1f2937] bg-[#111827]">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#1f2937] text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
                <th className="p-4">Service Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {filteredServices.map((service) => (
                <tr
                  key={service.slug}
                  onClick={() => setEditingService(service)}
                  className="hover:bg-[#1f2937]/40 transition-colors cursor-pointer group"
                >
                  <td className="p-4 font-semibold text-white">
                    <span className="text-[14px] text-white group-hover:text-[#e61e73] transition-colors font-semibold">
                      {service.title}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-[12px]">
                    /services/{service.slug}
                  </td>
                  <td className="p-4 align-middle whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingService(service)
                        }}
                        className="inline-flex items-center justify-center rounded-[8px] border border-[#1f2937] bg-[#1f2937]/60 px-3.5 py-1.5 text-[12px] font-semibold text-white hover:border-[#374151] hover:bg-[#1f2937] transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        Edit
                      </button>
                      <Link
                        href={`/services/${service.slug}`}
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
                          setDeletingService(service)
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
      {editingService && (
        <ServiceEditor
          initialData={editingService}
          isEdit={Boolean(editingService.slug)}
          onClose={() => setEditingService(null)}
          onSaveSuccess={fetchServices}
        />
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deletingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-[18px] border border-[#1f2937] bg-[#111827] p-6 shadow-2xl">
            <h3 className="text-[17px] font-extrabold text-white">Delete Service</h3>
            <p className="mt-2 text-[13px] text-slate-300">
              Are you sure you want to delete <span className="text-white font-bold">&quot;{deletingService.title || deletingService.slug}&quot;</span>? This cannot be undone.
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
                  setDeletingService(null)
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
                <span>{isDeleting ? "Deleting..." : "Delete Service"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}