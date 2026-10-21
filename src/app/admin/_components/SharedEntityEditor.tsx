"use client"
import React, { useState, useEffect, useMemo, useCallback } from "react"

export type TabType = "general" | "content" | "faqs" | "social" | "schema_json" | "preview"

export type FAQItem = {
  question: string
  answer: string
}

export type SeoFormData = {
  canonical_url: string
  meta_title: string
  meta_description: string
  primary_keyword: string
  secondary_keywords: string
  robots_index: boolean
  robots_follow: boolean
  og_title: string
  og_description: string
  og_image: string
  og_type: string
  twitter_card: string
  twitter_title: string
  twitter_description: string
  twitter_image?: string
  schema_json: string
}

export interface SharedEntityEditorProps {
  pageKey: string
  entityLabelSingular: string
  entityLabelPlural: string
  title: string
  slug: string
  initialSeoData?: Partial<SeoFormData>
  initialFaqs?: FAQItem[]
  hasContentTab?: boolean
  contentTabLabel?: string
  defaultTab?: TabType
  renderContentTab?: (helpers: { activeTab: TabType }) => React.ReactNode
  onClose: () => void
  onSave: (payload: { seoData: SeoFormData; faqs: FAQItem[] }) => Promise<boolean | void>
  customBadges?: string[]
}

export function getActiveSchemaBadges(pageKey: string): string[] {
  const k = (pageKey || "").toLowerCase().trim()
  if (k === "homepage" || k === "home") {
    return ["WebSite", "Organization", "WebPage (nested FAQ)", "BreadcrumbList"]
  }
  if (k === "about") {
    return ["AboutPage", "BreadcrumbList"]
  }
  if (k === "contact") {
    return ["ContactPage", "BreadcrumbList"]
  }
  if (k === "blog") {
    return ["WebPage", "BreadcrumbList"]
  }
  if (k.startsWith("blog:")) {
    return ["BlogPosting", "WebPage", "BreadcrumbList"]
  }
  // Phase 3: Removed store, product, and category schema type hints.
  if (k.startsWith("service:") || k.startsWith("services:")) {
    return ["Service", "WebPage (nested FAQ)", "BreadcrumbList"]
  }
  if (k.startsWith("work:") || k.startsWith("case-study:") || k.startsWith("case-studies:")) {
    return ["CreativeWork", "CaseStudy", "WebPage (nested FAQ)", "BreadcrumbList"]
  }
  return ["WebPage (nested FAQ)", "BreadcrumbList"]
}

export default function SharedEntityEditor({
  pageKey,
  entityLabelSingular,
  entityLabelPlural,
  title,
  slug,
  initialSeoData,
  initialFaqs = [],
  hasContentTab = false,
  contentTabLabel = "Details & Content",
  defaultTab = "general",
  renderContentTab,
  onClose,
  onSave,
  customBadges,
}: SharedEntityEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab)
  const [saving, setSaving] = useState(false)
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null)

  // SEO form state
  const [seoData, setSeoData] = useState<SeoFormData>({
    canonical_url: initialSeoData?.canonical_url || "",
    meta_title: initialSeoData?.meta_title || title || "",
    meta_description: initialSeoData?.meta_description || "",
    primary_keyword: initialSeoData?.primary_keyword || "",
    secondary_keywords: initialSeoData?.secondary_keywords || "",
    robots_index: initialSeoData?.robots_index ?? true,
    robots_follow: initialSeoData?.robots_follow ?? true,
    og_title: initialSeoData?.og_title || initialSeoData?.meta_title || title || "",
    og_description: initialSeoData?.og_description || initialSeoData?.meta_description || "",
    og_image: initialSeoData?.og_image || "",
    og_type: initialSeoData?.og_type || "website",
    twitter_card: initialSeoData?.twitter_card || "summary_large_image",
    twitter_title: initialSeoData?.twitter_title || initialSeoData?.meta_title || title || "",
    twitter_description: initialSeoData?.twitter_description || initialSeoData?.meta_description || "",
    twitter_image: initialSeoData?.twitter_image || initialSeoData?.og_image || "",
    schema_json: initialSeoData?.schema_json || "",
  })

  // FAQs state
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFaqs)

  // Schema live inspector state
  const [previewGraph, setPreviewGraph] = useState<any>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [copiedJson, setCopiedJson] = useState(false)
  const [jsonValidationError, setJsonValidationError] = useState<string | null>(null)

  // Fetch existing SEO settings on mount if pageKey provided
  useEffect(() => {
    if (!pageKey) return
    let isMounted = true

    fetch("/api/admin/seo")
      .then((r) => r.json())
      .then((d) => {
        if (!isMounted) return
        const settings = Array.isArray(d?.settings) ? d.settings : []
        const match = settings.find(
          (s: any) =>
            s.page_key?.toLowerCase() === pageKey.toLowerCase() ||
            (slug && s.slug?.toLowerCase() === slug.toLowerCase())
        )
        if (match) {
          setSeoData((prev) => ({
            ...prev,
            canonical_url: match.canonical_url || prev.canonical_url,
            meta_title: match.meta_title || prev.meta_title,
            meta_description: match.meta_description || prev.meta_description,
            primary_keyword: match.primary_keyword || prev.primary_keyword,
            secondary_keywords:
              typeof match.secondary_keywords === "string"
                ? match.secondary_keywords
                : Array.isArray(match.secondary_keywords)
                ? match.secondary_keywords.join(", ")
                : prev.secondary_keywords,
            robots_index: match.robots_index ?? prev.robots_index,
            robots_follow: match.robots_follow ?? prev.robots_follow,
            og_title: match.og_title || prev.og_title,
            og_description: match.og_description || prev.og_description,
            og_image: match.og_image || prev.og_image,
            og_type: match.og_type || prev.og_type,
            twitter_card: match.twitter_card || prev.twitter_card,
            twitter_title: match.twitter_title || prev.twitter_title,
            twitter_description: match.twitter_description || prev.twitter_description,
            twitter_image: match.twitter_image || prev.twitter_image,
            schema_json: match.schema_json || prev.schema_json,
          }))

          if (Array.isArray(match.faq_section) && match.faq_section.length > 0 && faqs.length === 0) {
            setFaqs(match.faq_section)
          }
        }
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [pageKey, slug])

  // Fetch or update schema preview
  const fetchSchemaPreview = useCallback(async () => {
    if (!pageKey) return
    setPreviewLoading(true)
    try {
      const res = await fetch("/api/admin/seo/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_key: pageKey,
          meta_title: seoData.meta_title,
          meta_description: seoData.meta_description,
          primary_keyword: seoData.primary_keyword,
          faq_section: faqs,
          schema_json: seoData.schema_json,
          og_image: seoData.og_image,
        }),
      })
      const data = await res.json()
      if (data?.graph) {
        setPreviewGraph(data.graph)
      }
    } catch {
      // ignore
    } finally {
      setPreviewLoading(false)
    }
  }, [pageKey, seoData, faqs])

  useEffect(() => {
    if (activeTab === "preview" || activeTab === "schema_json") {
      fetchSchemaPreview()
    }
  }, [activeTab, fetchSchemaPreview])

  // Custom JSON-LD handling
  function handleSchemaJsonChange(val: string) {
    setSeoData((prev) => ({ ...prev, schema_json: val }))
    if (!val.trim()) {
      setJsonValidationError(null)
      return
    }
    try {
      JSON.parse(val)
      setJsonValidationError(null)
    } catch (e: any) {
      setJsonValidationError(e.message || "Invalid JSON syntax")
    }
  }

  function handlePrettifyJson() {
    if (!seoData.schema_json.trim()) return
    try {
      const parsed = JSON.parse(seoData.schema_json)
      const formatted = JSON.stringify(parsed, null, 2)
      setSeoData((prev) => ({ ...prev, schema_json: formatted }))
      setJsonValidationError(null)
    } catch (e: any) {
      setJsonValidationError("Cannot format invalid JSON: " + (e.message || ""))
    }
  }

  async function handleLoadActiveSchemaToEditor() {
    if (
      seoData.schema_json.trim() &&
      !confirm("Overwrite existing custom JSON-LD code with generated schema?")
    ) {
      return
    }
    try {
      const res = await fetch("/api/admin/seo/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_key: pageKey,
          meta_title: seoData.meta_title,
          meta_description: seoData.meta_description,
          primary_keyword: seoData.primary_keyword,
          faq_section: faqs,
        }),
      })
      const data = await res.json()
      if (data?.graph) {
        setSeoData((prev) => ({
          ...prev,
          schema_json: JSON.stringify(data.graph, null, 2),
        }))
        setJsonValidationError(null)
      }
    } catch {
      alert("Failed to load schema.")
    }
  }

  function handleCopyJson() {
    const textToCopy = seoData.schema_json.trim()
      ? seoData.schema_json
      : previewGraph
      ? JSON.stringify(previewGraph, null, 2)
      : ""
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
      setCopiedJson(true)
      setTimeout(() => setCopiedJson(false), 2000)
    }
  }

  // FAQ Helpers
  function handleAddFaq() {
    setFaqs((prev) => [...prev, { question: "", answer: "" }])
  }

  function handleUpdateFaq(index: number, field: "question" | "answer", value: string) {
    setFaqs((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: value }
      return copy
    })
  }

  function handleRemoveFaq(index: number) {
    setFaqs((prev) => {
      const copy = [...prev]
      copy.splice(index, 1)
      return copy
    })
  }

  // Master Save Handler
  async function handleSaveSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (seoData.schema_json?.trim()) {
      try {
        JSON.parse(seoData.schema_json)
      } catch (err: any) {
        if (!confirm("Your Custom Schema JSON contains a syntax error (" + err.message + "). Save anyway?")) {
          setActiveTab("schema_json")
          return
        }
      }
    }

    setSaving(true)
    try {
      const res = await onSave({ seoData, faqs })
      if (res !== false) {
        setSaveSuccessMsg("Saved successfully! Schema updated.")
        setTimeout(() => {
          onClose()
        }, 800)
      }
    } catch (err: any) {
      alert(err.message || "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const activeBadges = customBadges || getActiveSchemaBadges(pageKey)

  const inputClass =
    "w-full rounded-[10px] border border-[#1f2937] bg-[#0b0f17] px-4 py-2.5 text-[13px] text-white outline-none transition-all placeholder:text-slate-500 focus:border-[#e61e73]"
  const labelClass =
    "mb-1 block text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400"

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0b0f17] text-white overflow-hidden w-full h-full">
      {/* ── Top Bar Header (Sticky) ── */}
      <div className="flex items-center justify-between px-6 sm:px-8 py-3.5 border-b border-[#1f2937] bg-[#111827] shrink-0">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#1f2937] bg-[#1f2937]/50 px-3 py-1.5 text-[12px] font-semibold text-slate-300 hover:text-white hover:bg-[#1f2937] transition-all cursor-pointer"
          >
            <span>←</span>
            <span>Back to {entityLabelPlural}</span>
          </button>
          <div className="h-5 w-px bg-[#1f2937]" />
          <div className="space-y-0.5">
            <div className="flex items-center gap-2.5">
              <h2 className="text-[18px] font-extrabold text-white">
                Edit {entityLabelSingular}: {title || pageKey}
              </h2>
              <span className="rounded-[6px] bg-[#e61e73]/15 px-2 py-0.5 text-[11px] font-bold text-[#e61e73] border border-[#e61e73]/30">
                {pageKey}
              </span>
            </div>
            {/* Active Schema Badges */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] font-medium text-slate-400">Active Schemas:</span>
              {activeBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded bg-[#1f2937] px-2 py-0.5 text-[11px] font-semibold text-sky-400 border border-sky-500/20"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          type="button"
          className="text-slate-400 hover:text-white transition-colors text-[20px] font-bold p-1.5 rounded-lg hover:bg-[#1f2937] cursor-pointer"
          title="Close Full Screen Editor"
        >
          ✕
        </button>
      </div>

      {/* ── Sub-tabs Navigation (Sticky) ── */}
      <div className="flex items-center border-b border-[#1f2937] bg-[#0e1626] px-6 sm:px-8 text-[12px] font-bold shrink-0 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`py-3.5 px-4 border-b-2 transition-all flex items-center whitespace-nowrap cursor-pointer ${
            activeTab === "general"
              ? "border-[#e61e73] text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>General & Meta SEO</span>
        </button>

        {hasContentTab && (
          <button
            type="button"
            onClick={() => setActiveTab("content")}
            className={`py-3.5 px-4 border-b-2 transition-all flex items-center whitespace-nowrap cursor-pointer ${
              activeTab === "content"
                ? "border-[#e61e73] text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>{contentTabLabel}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab("faqs")}
          className={`py-3.5 px-4 border-b-2 transition-all flex items-center whitespace-nowrap gap-1.5 cursor-pointer ${
            activeTab === "faqs"
              ? "border-[#e61e73] text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>FAQ Schema</span>
          {faqs.length > 0 && (
            <span className="rounded-full bg-[#1f2937] px-1.5 py-0.2 text-[10px] text-amber-400 border border-amber-500/30">
              {faqs.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("social")}
          className={`py-3.5 px-4 border-b-2 transition-all flex items-center whitespace-nowrap cursor-pointer ${
            activeTab === "social"
              ? "border-[#e61e73] text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>Social & Open Graph</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("schema_json")}
          className={`py-3.5 px-4 border-b-2 transition-all flex items-center whitespace-nowrap gap-1.5 cursor-pointer ${
            activeTab === "schema_json"
              ? "border-[#e61e73] text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>Custom JSON-LD</span>
          {seoData.schema_json && (
            <span className="ml-1 h-2 w-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`py-3.5 px-4 border-b-2 transition-all flex items-center whitespace-nowrap cursor-pointer ${
            activeTab === "preview"
              ? "border-[#e61e73] text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>Live Schema Inspector</span>
        </button>
      </div>

      {/* ── Scrollable Tab Content Container (Centered with max-w-6xl mx-auto) ── */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <form id="shared-entity-form" onSubmit={handleSaveSubmit} className="max-w-6xl mx-auto space-y-6">

          {/* ════ TAB 1: General & Meta SEO ════ */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="rounded-[16px] border border-[#1f2937] bg-[#111827] p-6 space-y-5">
                <h3 className="text-[15px] font-bold text-white border-b border-[#1f2937] pb-3">
                  Canonical & Core Meta
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Canonical URL</label>
                    <input
                      type="text"
                      value={seoData.canonical_url}
                      onChange={(e) => setSeoData({ ...seoData, canonical_url: e.target.value })}
                      placeholder="e.g. https://www.mommantum.com/services/..."
                      className={inputClass}
                    />
                    <p className="mt-1 text-[11px] text-slate-500">
                      Leave empty to auto-derive from base URL + slug.
                    </p>
                  </div>
                  <div>
                    <label className={labelClass}>Primary Focus Keyword</label>
                    <input
                      type="text"
                      value={seoData.primary_keyword}
                      onChange={(e) => setSeoData({ ...seoData, primary_keyword: e.target.value })}
                      placeholder="e.g. digital marketing agency jaipur"
                      className={inputClass}
                    />
                    <p className="mt-1 text-[11px] text-slate-500">
                      Injected as about / primary entity keyword in Schema.
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className={labelClass}>Meta Title</label>
                    <span
                      className={`text-[11px] font-mono ${
                        seoData.meta_title.length > 60
                          ? "text-rose-400 font-bold"
                          : seoData.meta_title.length >= 50
                          ? "text-emerald-400 font-semibold"
                          : "text-slate-400"
                      }`}
                    >
                      {seoData.meta_title.length}/60 chars (Recommended: 50-60)
                    </span>
                  </div>
                  <input
                    type="text"
                    value={seoData.meta_title}
                    onChange={(e) => setSeoData({ ...seoData, meta_title: e.target.value })}
                    placeholder="Page Title | Mommantum"
                    className={inputClass}
                  />
                  <div className="mt-1.5 h-1 w-full bg-[#1f2937] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        seoData.meta_title.length > 60
                          ? "bg-rose-500"
                          : seoData.meta_title.length >= 50
                          ? "bg-emerald-500"
                          : "bg-sky-500"
                      }`}
                      style={{
                        width: `${Math.min(100, (seoData.meta_title.length / 60) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className={labelClass}>Meta Description</label>
                    <span
                      className={`text-[11px] font-mono ${
                        seoData.meta_description.length > 160
                          ? "text-rose-400 font-bold"
                          : seoData.meta_description.length >= 120
                          ? "text-emerald-400 font-semibold"
                          : "text-slate-400"
                      }`}
                    >
                      {seoData.meta_description.length}/160 chars (Recommended: 120-160)
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={seoData.meta_description}
                    onChange={(e) => setSeoData({ ...seoData, meta_description: e.target.value })}
                    placeholder="Brief description for search engine snippets..."
                    className={inputClass}
                  />
                  <div className="mt-1.5 h-1 w-full bg-[#1f2937] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        seoData.meta_description.length > 160
                          ? "bg-rose-500"
                          : seoData.meta_description.length >= 120
                          ? "bg-emerald-500"
                          : "bg-sky-500"
                      }`}
                      style={{
                        width: `${Math.min(100, (seoData.meta_description.length / 160) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Secondary Keywords (Comma-separated)</label>
                  <input
                    type="text"
                    value={seoData.secondary_keywords}
                    onChange={(e) => setSeoData({ ...seoData, secondary_keywords: e.target.value })}
                    placeholder="e.g. performance marketing, meta ads, lead generation"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Robots Directives */}
              <div className="rounded-[16px] border border-[#1f2937] bg-[#111827] p-6 space-y-4">
                <h3 className="text-[15px] font-bold text-white border-b border-[#1f2937] pb-3">
                  Robots & Indexing Directives
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-3.5 rounded-[12px] bg-[#0b0f17] border border-[#1f2937] cursor-pointer hover:border-[#374151] transition-all">
                    <input
                      type="checkbox"
                      checked={seoData.robots_index}
                      onChange={(e) => setSeoData({ ...seoData, robots_index: e.target.checked })}
                      className="h-4 w-4 rounded accent-[#e61e73]"
                    />
                    <div>
                      <div className="text-[13px] font-bold text-white">Index Page (robots: index)</div>
                      <div className="text-[11px] text-slate-400">
                        Allow search engines to show this page in search results.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 rounded-[12px] bg-[#0b0f17] border border-[#1f2937] cursor-pointer hover:border-[#374151] transition-all">
                    <input
                      type="checkbox"
                      checked={seoData.robots_follow}
                      onChange={(e) => setSeoData({ ...seoData, robots_follow: e.target.checked })}
                      className="h-4 w-4 rounded accent-[#e61e73]"
                    />
                    <div>
                      <div className="text-[13px] font-bold text-white">Follow Links (robots: follow)</div>
                      <div className="text-[11px] text-slate-400">
                        Allow search engines to crawl links on this page.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ════ TAB 2: Custom Content Tab ════ */}
          {hasContentTab && activeTab === "content" && renderContentTab && (
            <div className="space-y-6">
              {renderContentTab({ activeTab })}
            </div>
          )}

          {/* ════ TAB 3: FAQ Schema ════ */}
          {activeTab === "faqs" && (
            <div className="space-y-6">
              <div className="rounded-[16px] border border-[#1f2937] bg-[#111827] p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#1f2937] pb-4">
                  <div>
                    <h3 className="text-[15px] font-bold text-white">
                      Structured FAQ Schema ({faqs.length} items)
                    </h3>
                    <p className="text-[12px] text-slate-400 mt-0.5">
                      Rendered into valid schema.org/FAQPage and Google rich result snippets.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#e61e73] px-3.5 py-2 text-[12px] font-bold text-white hover:bg-[#ca155f] transition-all cursor-pointer self-start sm:self-auto"
                  >
                    <span>+ Add FAQ Item</span>
                  </button>
                </div>

                {faqs.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-[#1f2937] rounded-[12px]">
                    <p className="text-slate-400 text-[13px]">No FAQs configured for this page.</p>
                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="mt-3 text-[12px] font-bold text-[#e61e73] hover:underline cursor-pointer"
                    >
                      + Add your first FAQ
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="rounded-[12px] border border-[#1f2937] bg-[#0b0f17] p-4 space-y-3 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            FAQ #{index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFaq(index)}
                            className="text-slate-500 hover:text-rose-400 text-[12px] font-bold px-2 py-0.5 rounded hover:bg-[#1f2937] transition-all cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                        <div>
                          <label className={labelClass}>Question</label>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => handleUpdateFaq(index, "question", e.target.value)}
                            placeholder="e.g. How do you measure performance?"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Answer</label>
                          <textarea
                            rows={3}
                            value={faq.answer}
                            onChange={(e) => handleUpdateFaq(index, "answer", e.target.value)}
                            placeholder="Detailed plain-text answer..."
                            className={inputClass}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ════ TAB 4: Social & Open Graph ════ */}
          {activeTab === "social" && (
            <div className="space-y-6">
              <div className="rounded-[16px] border border-[#1f2937] bg-[#111827] p-6 space-y-5">
                <h3 className="text-[15px] font-bold text-white border-b border-[#1f2937] pb-3">
                  Open Graph (Facebook, LinkedIn, Slack)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>OG Title</label>
                    <input
                      type="text"
                      value={seoData.og_title}
                      onChange={(e) => setSeoData({ ...seoData, og_title: e.target.value })}
                      placeholder="Title for social cards..."
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>OG Type</label>
                    <select
                      value={seoData.og_type}
                      onChange={(e) => setSeoData({ ...seoData, og_type: e.target.value })}
                      className={inputClass}
                    >
                      <option value="website">website</option>
                      <option value="article">article</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>OG Description</label>
                  <textarea
                    rows={2}
                    value={seoData.og_description}
                    onChange={(e) => setSeoData({ ...seoData, og_description: e.target.value })}
                    placeholder="Short description for social sharing..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>OG Image URL</label>
                  <input
                    type="text"
                    value={seoData.og_image}
                    onChange={(e) => setSeoData({ ...seoData, og_image: e.target.value })}
                    placeholder="https://... /og-image.jpg"
                    className={inputClass}
                  />
                  {seoData.og_image && (
                    <div className="mt-2 h-28 w-48 rounded-[8px] overflow-hidden border border-[#1f2937] bg-slate-900">
                      <img
                        src={seoData.og_image}
                        alt="OG Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLElement).style.display = "none"
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Twitter Card */}
              <div className="rounded-[16px] border border-[#1f2937] bg-[#111827] p-6 space-y-5">
                <h3 className="text-[15px] font-bold text-white border-b border-[#1f2937] pb-3">
                  X / Twitter Card
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Card Type</label>
                    <select
                      value={seoData.twitter_card}
                      onChange={(e) => setSeoData({ ...seoData, twitter_card: e.target.value })}
                      className={inputClass}
                    >
                      <option value="summary_large_image">summary_large_image</option>
                      <option value="summary">summary</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Twitter Title</label>
                    <input
                      type="text"
                      value={seoData.twitter_title}
                      onChange={(e) => setSeoData({ ...seoData, twitter_title: e.target.value })}
                      placeholder="Title for X card..."
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Twitter Description</label>
                  <textarea
                    rows={2}
                    value={seoData.twitter_description}
                    onChange={(e) => setSeoData({ ...seoData, twitter_description: e.target.value })}
                    placeholder="Brief description for X..."
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ════ TAB 5: Custom JSON-LD ════ */}
          {activeTab === "schema_json" && (
            <div className="space-y-6">
              <div className="rounded-[16px] border border-[#1f2937] bg-[#111827] p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#1f2937] pb-4">
                  <div>
                    <h3 className="text-[15px] font-bold text-white">Custom JSON-LD Schema Override</h3>
                    <p className="text-[12px] text-slate-400 mt-0.5">
                      Any JSON-LD code added here overrides or appends to the automatically generated schema graph.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleLoadActiveSchemaToEditor}
                      className="rounded-[8px] border border-[#1f2937] bg-[#1f2937]/50 px-3 py-1.5 text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-[#1f2937] transition-all cursor-pointer"
                    >
                      Load Active Schema into Editor
                    </button>
                    <button
                      type="button"
                      onClick={handlePrettifyJson}
                      className="rounded-[8px] border border-[#1f2937] bg-[#1f2937]/50 px-3 py-1.5 text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-[#1f2937] transition-all cursor-pointer"
                    >
                      Format / Prettify
                    </button>
                  </div>
                </div>

                {jsonValidationError && (
                  <div className="rounded-[10px] bg-rose-500/10 border border-rose-500/30 p-3 text-[12px] text-rose-300 font-mono">
                    ⚠️ Syntax error: {jsonValidationError}
                  </div>
                )}

                <div>
                  <textarea
                    rows={16}
                    value={seoData.schema_json}
                    onChange={(e) => handleSchemaJsonChange(e.target.value)}
                    placeholder='{\n  "@context": "https://schema.org",\n  "@graph": [...]\n}'
                    className="w-full rounded-[10px] border border-[#1f2937] bg-[#0b0f17] p-4 text-[12px] text-emerald-400 font-mono outline-none focus:border-[#e61e73] transition-all"
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ════ TAB 6: Live Schema Inspector ════ */}
          {activeTab === "preview" && (
            <div className="space-y-6">
              {/* Header & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-[16px] border border-[#1f2937] bg-[#111827] p-4">
                <div>
                  <h3 className="text-[14px] font-bold text-white">Raw Graph JSON</h3>
                  <p className="text-[12px] text-slate-400">
                    Live generated Schema.org JSON-LD graph for this {entityLabelSingular.toLowerCase()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="rounded-[8px] border border-[#1f2937] bg-[#1f2937]/50 px-3.5 py-1.5 text-[12px] font-semibold text-slate-300 hover:text-white hover:bg-[#1f2937] transition-all cursor-pointer"
                  >
                    {copiedJson ? "✓ Copied" : "Copy JSON-LD"}
                  </button>
                </div>
              </div>

              {previewLoading ? (
                <div className="py-16 text-center text-slate-400">Loading live schema preview...</div>
              ) : (
                <div className="rounded-[16px] border border-[#1f2937] bg-[#111827] p-6">
                  <pre className="text-[12px] text-emerald-400 font-mono overflow-x-auto p-4 bg-[#0b0f17] rounded-[10px] max-h-[600px] border border-[#1f2937]">
                    {previewGraph ? JSON.stringify(previewGraph, null, 2) : "// No schema graph generated yet"}
                  </pre>
                </div>
              )}
            </div>
          )}

        </form>
      </div>

      {/* ── Sticky Bottom Action Footer ── */}
      <div className="flex items-center justify-between border-t border-[#1f2937] bg-[#111827] px-6 sm:px-8 py-3.5 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[10px] border border-[#1f2937] bg-[#1f2937]/50 px-4 py-2 text-[13px] font-semibold text-slate-300 hover:text-white hover:bg-[#1f2937] transition-all cursor-pointer"
          >
            Cancel
          </button>
          {saveSuccessMsg && (
            <span className="text-[12px] font-bold text-emerald-400 flex items-center gap-1.5 animate-fade-in">
              <span>✓</span> {saveSuccessMsg}
            </span>
          )}
        </div>

        <button
          type="submit"
          form="shared-entity-form"
          disabled={saving}
          className="rounded-[10px] bg-[#e61e73] px-6 py-2 text-[13px] font-bold text-white hover:bg-[#ca155f] transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
        >
          {saving && (
            <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          )}
          <span>{saving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>
    </div>
  )
}
