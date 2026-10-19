"use client"
import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { useAdminPath } from "@lib/hooks/use-admin-path"
import { HOME_FAQS } from "@lib/data/home-faqs"
import { AdminSearchBar, AdminEmptySearch } from "../_components/AdminSearchBar"
import { getAdminCache, setAdminCache } from "../_lib/admin-cache"
import SharedEntityEditor, { getActiveSchemaBadges } from "../_components/SharedEntityEditor"
export type FAQItem = {
  question: string
  answer: string
}

export type PageRecord = {
  page_key: string
  page_label?: string | null
  slug?: string | null
  canonical_url?: string | null
  meta_title?: string | null
  meta_description?: string | null
  primary_keyword?: string | null
  secondary_keywords?: string[] | string | null
  meta_keywords?: string | null
  robots_index?: boolean | null
  robots_follow?: boolean | null
  og_title?: string | null
  og_description?: string | null
  og_image?: string | null
  og_url?: string | null
  og_type?: string | null
  twitter_card?: string | null
  twitter_title?: string | null
  twitter_description?: string | null
  twitter_image?: string | null
  schema_json?: string | null
  faq_section?: FAQItem[] | null
}

const CORE_PAGES: PageRecord[] = [
  { page_key: "homepage", page_label: "Home Page", slug: "/" },
  { page_key: "about", page_label: "About Us", slug: "/about" },
  { page_key: "services", page_label: "Services Listing", slug: "/services" },
  { page_key: "work", page_label: "Case Studies & Work", slug: "/work" },
  { page_key: "blog", page_label: "Blog Listing", slug: "/blog" },
  { page_key: "contact", page_label: "Contact Us", slug: "/contact" },
  { page_key: "privacy-policy", page_label: "Privacy Policy", slug: "/privacy-policy" },
  { page_key: "terms-and-conditions", page_label: "Terms & Conditions", slug: "/terms-and-conditions" },
  { page_key: "editz", page_label: "Editz Video Services", slug: "/editz" },
  { page_key: "blog-ai", page_label: "AI Blog Hub", slug: "/blog-ai" },
]

function resolveSlug(page: PageRecord): string {
  if (page.slug && page.slug.startsWith("/")) return page.slug
  const key = (page.page_key || "").toLowerCase().trim()
  if (key === "home" || key === "homepage") return "/"
  if (key === "about") return "/about"
  if (key === "contact") return "/contact"
  if (key === "services") return "/services"
  if (key === "work" || key === "case-studies" || key === "case-study") return "/work"
  if (key === "blog") return "/blog"
  if (key === "terms-and-conditions") return "/terms-and-conditions"
  if (key === "privacy-policy") return "/privacy-policy"
  if (key === "editz") return "/editz"
  if (key === "blog-ai") return "/blog-ai"
  if (key.startsWith("service:")) return `/services/${key.replace("service:", "").trim().toLowerCase().replace(/\s+/g, "-")}`
  if (key.startsWith("services:")) return `/services/${key.replace("services:", "").trim().toLowerCase().replace(/\s+/g, "-")}`
  if (key.startsWith("work:")) return `/work/${key.replace("work:", "").trim().toLowerCase().replace(/\s+/g, "-")}`
  if (key.startsWith("case-study:")) return `/work/${key.replace("case-study:", "").trim().toLowerCase().replace(/\s+/g, "-")}`
  if (key.startsWith("case-studies:")) return `/work/${key.replace("case-studies:", "").trim().toLowerCase().replace(/\s+/g, "-")}`
  if (key.startsWith("blog:")) return `/blog/${key.replace("blog:", "").trim().toLowerCase().replace(/\s+/g, "-")}`
  if (page.slug) return `/${page.slug.replace(/^\/+/, "")}`
  return `/${key}`
}

function resolveLabel(page: PageRecord): string {
  if (page.page_label && page.page_label.trim()) return page.page_label
  const key = (page.page_key || "").toLowerCase().trim()
  if (key === "home" || key === "homepage") return "Home Page"
  if (key === "about") return "About Us"
  if (key === "contact") return "Contact Us"
  if (key === "services") return "Services Listing"
  if (key === "work" || key === "case-studies") return "Case Studies & Work"
  if (key === "blog") return "Blog Listing"
  if (key === "terms-and-conditions") return "Terms & Conditions"
  if (key === "privacy-policy") return "Privacy Policy"
  if (key === "editz") return "Editz Video Services"
  if (key === "blog-ai") return "AI Blog Hub"
  if (key.startsWith("blog:")) {
    const slug = key.replace("blog:", "").trim()
    return `BLOG: ${slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}`
  }
  if (key.startsWith("service:")) {
    const slug = key.replace("service:", "").trim()
    return `Service: ${slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}`
  }
  return page.page_key
}


export default function AdminPagesList() {
  const { prefixPath } = useAdminPath()
  const [pages, setPages] = useState<PageRecord[]>(CORE_PAGES)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPages = useMemo(() => {
    if (!searchQuery.trim()) return pages
    const q = searchQuery.toLowerCase().trim()
    return pages.filter((p) => {
      const label = resolveLabel(p).toLowerCase()
      const key = (p.page_key || "").toLowerCase()
      const slug = (resolveSlug(p) || "").toLowerCase()
      const title = (p.meta_title || "").toLowerCase()
      const kw = (p.primary_keyword || "").toLowerCase()
      return (
        label.includes(q) ||
        key.includes(q) ||
        slug.includes(q) ||
        title.includes(q) ||
        kw.includes(q)
      )
    })
  }, [pages, searchQuery])

  // Edit modal state
  const [editingPage, setEditingPage] = useState<PageRecord | null>(null)
  const [deletingPage, setDeletingPage] = useState<PageRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // New page modal
  const [showNewModal, setShowNewModal] = useState(false)
  const [creatingPage, setCreatingPage] = useState(false)
  const [newPage, setNewPage] = useState({
    title: "",
    slug: "",
    meta_title: "",
    meta_description: "",
    primary_keyword: "",
    robots_index: true,
    robots_follow: true,
  })

  async function loadPages() {
    try {
      const res = await fetch("/api/admin/seo")
      const data = await res.json()
      const dbSettings: PageRecord[] = Array.isArray(data?.settings) ? data.settings : []

      const map = new Map<string, PageRecord>()
      CORE_PAGES.forEach((cp) => {
        map.set(cp.page_key, { ...cp, robots_index: true, robots_follow: true })
      })

      dbSettings.forEach((dbItem) => {
        const existing = map.get(dbItem.page_key)
        if (existing) {
          map.set(dbItem.page_key, {
            ...existing,
            ...dbItem,
            slug: dbItem.slug || existing.slug,
            page_label: dbItem.page_label || existing.page_label,
          })
        } else {
          map.set(dbItem.page_key, {
            ...dbItem,
            page_label: resolveLabel(dbItem),
            slug: resolveSlug(dbItem),
          })
        }
      })

      const list = Array.from(map.values())
      const coreKeys = new Set(CORE_PAGES.map((c) => c.page_key))
      const core = list.filter((p) => coreKeys.has(p.page_key))
      const others = list
        .filter((p) => !coreKeys.has(p.page_key))
        .filter((p) => {
          const k = (p.page_key || "").toLowerCase().trim()
          const s = (p.slug || "").toLowerCase().trim()
          return !k.startsWith("blog:") && !s.startsWith("/blog/")
        })
        .sort((a, b) => resolveLabel(a).localeCompare(resolveLabel(b)))

      const finalList = [...core, ...others]
      setPages(finalList)
      setAdminCache("admin_pages", finalList)
    } catch (err) {
      console.error("Failed to load pages:", err)
      setPages(CORE_PAGES)
      setAdminCache("admin_pages", CORE_PAGES)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const cachedPages = getAdminCache<PageRecord[]>("admin_pages")
    if (cachedPages && cachedPages.length > 0) {
      setPages(cachedPages)
    }
    loadPages()
  }, [])

  function openEditModal(page: PageRecord) {
    const slug = resolveSlug(page)
    const label = resolveLabel(page)
    const pageKey = (page.page_key || "").toLowerCase()

    let initialFaqs = page.faq_section || []
    if ((!initialFaqs || initialFaqs.length === 0) && (pageKey === "homepage" || pageKey === "home")) {
      initialFaqs = HOME_FAQS.map((f) => ({ question: f.question, answer: f.answer }))
    }

    setEditingPage({
      ...page,
      slug,
      page_label: label,
      faq_section: initialFaqs,
    })
  }

  async function handleConfirmDelete() {
    if (!deletingPage) return
    setIsDeleting(true)
    setDeleteError(null)

    const isCore = CORE_PAGES.some((c) => c.page_key === deletingPage.page_key)

    try {
      const res = await fetch(`/api/admin/seo?page_key=${encodeURIComponent(deletingPage.page_key)}`, {
        method: "DELETE",
      })
      if (res.ok) {
        if (isCore) {
          await loadPages()
        } else {
          setPages((prev) => prev.filter((p) => p.page_key !== deletingPage.page_key))
        }
        setDeletingPage(null)
      } else {
        const d = await res.json().catch(() => null)
        setDeleteError(d?.error || "Failed to delete page")
      }
    } catch {
      setDeleteError("Network error while deleting page")
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleCreatePage(e: React.FormEvent) {
    e.preventDefault()
    if (!newPage.title.trim()) return

    const sanitized = (newPage.slug || newPage.title)
      .trim()
      .toLowerCase()
      .replace(/^[/\s]+|[/\s]+$/g, "")
      .replace(/[\s_]+/g, "-")

    setCreatingPage(true)
    try {
      const payload = {
        page_key: sanitized,
        page_label: newPage.title.trim(),
        slug: `/${sanitized}`,
        meta_title: newPage.meta_title.trim() || newPage.title.trim(),
        meta_description: newPage.meta_description.trim() || null,
        primary_keyword: newPage.primary_keyword.trim() || null,
        robots_index: newPage.robots_index,
        robots_follow: newPage.robots_follow,
      }

      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        await loadPages()
        setShowNewModal(false)
        setNewPage({
          title: "",
          slug: "",
          meta_title: "",
          meta_description: "",
          primary_keyword: "",
          robots_index: true,
          robots_follow: true,
        })
      } else {
        const d = await res.json().catch(() => null)
        alert(d?.error || "Failed to create page")
      }
    } catch {
      alert("Network error while creating page")
    } finally {
      setCreatingPage(false)
    }
  }

  const inputClass =
    "w-full rounded-[10px] border border-[#1f2937] bg-[#0b0f17] px-4 py-2.5 text-[13px] text-white outline-none transition-all placeholder:text-slate-500 focus:border-[#e61e73]"
  const labelClass =
    "mb-1 block text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400"

  const activeBadges = editingPage ? getActiveSchemaBadges(editingPage.page_key) : []

  return (
    <div className="pb-16">
      {/* ── Page Header (Identical to Services) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-white">Pages</h1>
          <p className="mt-1 text-[14px] text-slate-400">
            {pages.length} pages total • Click any page to edit all schemas & SEO
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <AdminSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search pages..."
          />
          <button
            onClick={() => setShowNewModal(true)}
            className="rounded-[10px] bg-[#e61e73] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-[#ca155f] transition-all shrink-0 h-[38px] flex items-center justify-center"
          >
            + New Page
          </button>
        </div>
      </div>

      {/* ── Content Table (Identical to Services) ── */}
      {loading ? (
        <div className="mt-16 text-center text-slate-400">Loading pages...</div>
      ) : pages.length === 0 ? (
        <div className="mt-16 text-center rounded-[18px] bg-[#111827] p-12 border border-[#1f2937]">
          <p className="text-slate-400">No pages found.</p>
          <button
            onClick={() => setShowNewModal(true)}
            className="mt-4 inline-block rounded-[10px] bg-[#e61e73] px-5 py-2.5 text-[13px] font-bold text-white"
          >
            Create your first page
          </button>
        </div>
      ) : filteredPages.length === 0 ? (
        <AdminEmptySearch
          query={searchQuery}
          onClear={() => setSearchQuery("")}
          label="pages"
        />
      ) : (
        <div className="mt-8 overflow-hidden rounded-[18px] border border-[#1f2937] bg-[#111827]">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#1f2937] text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
                <th className="p-4">Page Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {filteredPages.map((page) => {
                const label = resolveLabel(page)
                const slug = resolveSlug(page)
                const badges = getActiveSchemaBadges(page.page_key)
                return (
                  <tr
                    key={page.page_key}
                    onClick={() => openEditModal(page)}
                    className="hover:bg-[#1f2937]/40 transition-colors cursor-pointer group"
                  >
                    <td className="p-4 font-semibold text-white">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] text-white group-hover:text-[#e61e73] transition-colors">
                            {label}
                          </span>
                          {page.robots_index === false && (
                            <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/20">
                              noindex
                            </span>
                          )}
                          {page.schema_json && (
                            <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
                              custom schema
                            </span>
                          )}
                        </div>
                        {/* Schema tags summary */}
                        <div className="flex flex-wrap items-center gap-1">
                          {badges.slice(0, 4).map((b) => (
                            <span
                              key={b}
                              className="rounded bg-[#1f2937] px-1.5 py-0.5 text-[10px] font-medium text-slate-400 border border-slate-700/50"
                            >
                              {b}
                            </span>
                          ))}
                          {badges.length > 4 && (
                            <span className="text-[10px] text-slate-500 font-mono">
                              +{badges.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-[12px]">
                      {slug}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditModal(page)
                        }}
                        className="inline-block rounded-[8px] border border-[#1f2937] bg-[#1f2937]/50 px-3 py-1.5 text-[12px] font-semibold text-white hover:border-[#374151] hover:bg-[#1f2937] transition-all"
                      >
                        Edit
                      </button>
                      <a
                        href={slug}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-block rounded-[8px] border border-[#1f2937] bg-[#1f2937]/50 px-3 py-1.5 text-[12px] font-semibold text-slate-400 hover:text-slate-300 transition-all"
                      >
                        View ↗
                      </a>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteError(null)
                          setDeletingPage(page)
                        }}
                        className="rounded-[8px] border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[12px] font-semibold text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Complete Schema & SEO Edit Full Screen View ── */}
      {editingPage && (
        <SharedEntityEditor
          pageKey={editingPage.page_key}
          entityLabelSingular="Page"
          entityLabelPlural="Pages"
          title={editingPage.page_label || resolveLabel(editingPage)}
          slug={editingPage.slug || resolveSlug(editingPage)}
          initialSeoData={{
            canonical_url: editingPage.canonical_url || "",
            meta_title: editingPage.meta_title || "",
            meta_description: editingPage.meta_description || "",
            primary_keyword: editingPage.primary_keyword || "",
            secondary_keywords: Array.isArray(editingPage.secondary_keywords)
              ? editingPage.secondary_keywords.join(", ")
              : editingPage.secondary_keywords || "",
            robots_index: editingPage.robots_index !== false,
            robots_follow: editingPage.robots_follow !== false,
            og_title: editingPage.og_title || "",
            og_description: editingPage.og_description || "",
            og_image: editingPage.og_image || "",
            og_type: editingPage.og_type || "website",
            twitter_card: editingPage.twitter_card || "summary_large_image",
            twitter_title: editingPage.twitter_title || "",
            twitter_description: editingPage.twitter_description || "",
            schema_json: editingPage.schema_json || "",
          }}
          initialFaqs={editingPage.faq_section || []}
          hasContentTab={false}
          onClose={() => setEditingPage(null)}
          onSave={async ({ seoData, faqs }) => {
            const secondaryKeywordsArray =
              typeof seoData.secondary_keywords === "string"
                ? seoData.secondary_keywords
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : seoData.secondary_keywords || []

            const cleanFaqs = (faqs || []).filter(
              (f) => f.question?.trim() || f.answer?.trim()
            )

            const payload = {
              ...editingPage,
              page_label: editingPage.page_label || resolveLabel(editingPage),
              slug: editingPage.slug || resolveSlug(editingPage),
              canonical_url: seoData.canonical_url?.trim() || null,
              meta_title: seoData.meta_title?.trim() || null,
              meta_description: seoData.meta_description?.trim() || null,
              primary_keyword: seoData.primary_keyword?.trim() || null,
              secondary_keywords: secondaryKeywordsArray.length ? secondaryKeywordsArray : null,
              robots_index: seoData.robots_index,
              robots_follow: seoData.robots_follow,
              og_title: seoData.og_title?.trim() || null,
              og_description: seoData.og_description?.trim() || null,
              og_image: seoData.og_image?.trim() || null,
              og_type: seoData.og_type || "website",
              twitter_card: seoData.twitter_card || "summary_large_image",
              twitter_title: seoData.twitter_title?.trim() || null,
              twitter_description: seoData.twitter_description?.trim() || null,
              schema_json: seoData.schema_json?.trim() || null,
              faq_section: cleanFaqs.length ? cleanFaqs : null,
            }

            const res = await fetch("/api/admin/seo", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })

            if (res.ok) {
              await loadPages()
              return true
            } else {
              const d = await res.json().catch(() => null)
              throw new Error(d?.error || "Failed to save page")
            }
          }}
        />
      )}

      {/* ── New Page Modal ── */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-[18px] border border-[#1f2937] bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#1f2937]">
              <div>
                <h3 className="text-[17px] font-extrabold text-white">Create New Page</h3>
                <p className="text-[12px] text-slate-400 mt-0.5">
                  Add a page and configure its URL slug and metadata
                </p>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-white transition-colors text-[20px] font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePage} className="mt-4 space-y-3.5">
              <div>
                <label className={labelClass}>Page Title</label>
                <input
                  type="text"
                  value={newPage.title}
                  onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                  placeholder="e.g. Careers"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>URL Slug</label>
                <input
                  type="text"
                  value={newPage.slug}
                  onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                  placeholder="e.g. /careers or careers"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Meta Title</label>
                <input
                  type="text"
                  value={newPage.meta_title}
                  onChange={(e) => setNewPage({ ...newPage, meta_title: e.target.value })}
                  placeholder="e.g. Careers at Mommantum"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Meta Description</label>
                <textarea
                  rows={3}
                  value={newPage.meta_description}
                  onChange={(e) =>
                    setNewPage({ ...newPage, meta_description: e.target.value })
                  }
                  placeholder="Brief description for search engine snippets..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Primary Focus Keyword</label>
                <input
                  type="text"
                  value={newPage.primary_keyword}
                  onChange={(e) =>
                    setNewPage({ ...newPage, primary_keyword: e.target.value })
                  }
                  placeholder="e.g. digital marketing careers"
                  className={inputClass}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1f2937]">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="rounded-[8px] border border-[#1f2937] bg-[#1f2937]/50 px-4 py-2 text-[12px] font-semibold text-slate-300 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingPage}
                  className="rounded-[10px] bg-[#e61e73] px-5 py-2 text-[12px] font-bold text-white hover:bg-[#ca155f] transition-all disabled:opacity-50"
                >
                  {creatingPage ? "Creating..." : "Create Page"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deletingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-[18px] border border-[#1f2937] bg-[#111827] p-6 shadow-2xl">
            <h3 className="text-[17px] font-extrabold text-white">
              {CORE_PAGES.some((c) => c.page_key === deletingPage.page_key) ? "Reset SEO Overrides" : "Delete Page"}
            </h3>
            <p className="mt-2 text-[13px] text-slate-300">
              {CORE_PAGES.some((c) => c.page_key === deletingPage.page_key) ? (
                <>Reset SEO overrides for <span className="text-white font-bold">&quot;{resolveLabel(deletingPage)}&quot;</span>? This restores default page configuration.</>
              ) : (
                <>Are you sure you want to delete <span className="text-white font-bold">&quot;{resolveLabel(deletingPage)}&quot;</span>? This cannot be undone.</>
              )}
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
                  setDeletingPage(null)
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
                <span>
                  {isDeleting
                    ? "Processing..."
                    : CORE_PAGES.some((c) => c.page_key === deletingPage.page_key)
                    ? "Reset Overrides"
                    : "Delete Page"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
