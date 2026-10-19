"use client"
import React, { useState } from "react"
import SharedEntityEditor, { FAQItem, SeoFormData } from "../../_components/SharedEntityEditor"
import { invalidateAdminCache } from "../../_lib/admin-cache"

type Metric = { label: string; before: string; after: string }

type Props = {
  initialData?: any
  isEdit?: boolean
  onClose?: () => void
  onSaveSuccess?: () => void
}

export default function CaseStudyEditor({
  initialData,
  isEdit = false,
  onClose = () => {},
  onSaveSuccess,
}: Props) {
  // Case Study specific fields
  const [form, setForm] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "",
    tagline: initialData?.tagline || "",
    about: initialData?.about || "",
    challenge: initialData?.challenge || "",
    overview: initialData?.overview || "",
    solution: initialData?.solution || "",
    insights: initialData?.insights || "",
    image: initialData?.image || "",
    accent: initialData?.accent || "#e61e73",
  })

  const [whatWeDid, setWhatWeDid] = useState<string[]>(initialData?.what_we_did || [])
  const [newWhat, setNewWhat] = useState("")

  const [results, setResults] = useState<string[]>(initialData?.results || [])
  const [newResult, setNewResult] = useState("")

  const [metrics, setMetrics] = useState<Metric[]>(initialData?.metrics || [])
  const [newMetric, setNewMetric] = useState<Metric>({ label: "", before: "", after: "" })

  const currentSlug = form.slug || initialData?.slug || ""
  const pageKey = currentSlug ? `work:${currentSlug}` : "work:new"

  const inputClass =
    "w-full rounded-[10px] border border-[#1f2937] bg-[#0b0f17] px-4 py-2.5 text-[13px] text-white outline-none transition-all placeholder:text-slate-500 focus:border-[#e61e73]"
  const labelClass =
    "mb-1 block text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400"

  const handleSave = async ({
    seoData,
    faqs,
  }: {
    seoData: SeoFormData
    faqs: FAQItem[]
  }) => {
    if (!form.title.trim()) {
      alert("Case Study Title is required.")
      return false
    }

    const cleanSlug = (form.slug || form.title)
      .toLowerCase()
      .trim()
      .replace(/^[/\s]+|[/\s]+$/g, "")
      .replace(/[\s_]+/g, "-")

    const cleanFaqs = (faqs || []).filter(
      (f) => f.question?.trim() || f.answer?.trim()
    )

    // 1. Save Case Study record
    const payload = {
      title: form.title.trim(),
      slug: cleanSlug,
      category: form.category.trim(),
      tagline: form.tagline.trim(),
      about: form.about.trim(),
      challenge: form.challenge.trim(),
      overview: form.overview.trim(),
      solution: form.solution.trim(),
      insights: form.insights.trim(),
      image: form.image.trim(),
      accent: form.accent.trim() || "#e61e73",
      what_we_did: whatWeDid,
      results: results,
      metrics: metrics,
      faqs: cleanFaqs,
    }

    const method = isEdit ? "PUT" : "POST"
    const url = isEdit ? `/api/admin/case-studies/${initialData.id}` : "/api/admin/case-studies"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(err?.error || "Failed to save case study")
    }

    // 2. Save SEO Record
    const secondaryKeywordsArray =
      typeof seoData.secondary_keywords === "string"
        ? seoData.secondary_keywords
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : seoData.secondary_keywords || []

    const seoPayload = {
      page_key: `work:${cleanSlug}`,
      page_label: form.title.trim(),
      slug: `/work/${cleanSlug}`,
      canonical_url: seoData.canonical_url?.trim() || null,
      meta_title: seoData.meta_title?.trim() || form.title.trim(),
      meta_description: seoData.meta_description?.trim() || form.tagline.trim() || null,
      primary_keyword: seoData.primary_keyword?.trim() || null,
      secondary_keywords: secondaryKeywordsArray.length ? secondaryKeywordsArray : null,
      robots_index: seoData.robots_index,
      robots_follow: seoData.robots_follow,
      og_title: seoData.og_title?.trim() || form.title.trim(),
      og_description: seoData.og_description?.trim() || form.tagline.trim() || null,
      og_image: seoData.og_image?.trim() || form.image.trim() || null,
      og_type: seoData.og_type || "website",
      twitter_card: seoData.twitter_card || "summary_large_image",
      twitter_title: seoData.twitter_title?.trim() || form.title.trim(),
      twitter_description: seoData.twitter_description?.trim() || form.tagline.trim() || null,
      schema_json: seoData.schema_json?.trim() || null,
      faq_section: cleanFaqs.length ? cleanFaqs : null,
    }

    await fetch("/api/admin/seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(seoPayload),
    }).catch(() => {})

    invalidateAdminCache("admin_case_studies")
    invalidateAdminCache("admin_pages")
    onSaveSuccess?.()
    return true
  }

  return (
    <SharedEntityEditor
      pageKey={pageKey}
      entityLabelSingular="Case Study"
      entityLabelPlural="Case Studies"
      title={form.title || "New Case Study"}
      slug={currentSlug ? `/work/${currentSlug}` : ""}
      initialSeoData={{
        canonical_url: initialData?.canonical_url || "",
        meta_title: initialData?.meta_title || initialData?.title || "",
        meta_description: initialData?.meta_description || initialData?.tagline || "",
        primary_keyword: initialData?.primary_keyword || "",
        secondary_keywords: initialData?.secondary_keywords || "",
        robots_index: initialData?.robots_index ?? true,
        robots_follow: initialData?.robots_follow ?? true,
        og_title: initialData?.og_title || initialData?.title || "",
        og_description: initialData?.og_description || initialData?.tagline || "",
        og_image: initialData?.og_image || initialData?.image || "",
        og_type: initialData?.og_type || "website",
        twitter_card: initialData?.twitter_card || "summary_large_image",
        twitter_title: initialData?.twitter_title || initialData?.title || "",
        twitter_description: initialData?.twitter_description || initialData?.tagline || "",
        schema_json: initialData?.schema_json || "",
      }}
      initialFaqs={initialData?.faqs || []}
      hasContentTab={true}
      contentTabLabel="Case Study Details & Narrative"
      defaultTab="general"
      onClose={onClose}
      onSave={handleSave}
      renderContentTab={() => (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="rounded-[16px] border border-[#1f2937] bg-[#111827] p-6 space-y-4">
            <h3 className="text-[15px] font-bold text-white border-b border-[#1f2937] pb-3">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Brand / Client Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Bare Anatomy"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Slug *</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. bare-anatomy"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Industry / Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. D2C Beauty & Personal Care"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Tagline / Headline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                placeholder="e.g. Scaling revenue 4.2x with creator video systems"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Hero Cover Image URL</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://... /cover.webp"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Brand Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.accent}
                    onChange={(e) => setForm({ ...form, accent: e.target.value })}
                    className="h-10 w-14 rounded-[8px] border border-[#1f2937] bg-[#0b0f17] cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.accent}
                    onChange={(e) => setForm({ ...form, accent: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Before & After Metrics */}
          <div className="rounded-[16px] border border-[#1f2937] bg-[#111827] p-6 space-y-4">
            <h3 className="text-[15px] font-bold text-white border-b border-[#1f2937] pb-3">
              Performance Metrics (Before & After)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Metric Label (e.g. ROAS)"
                value={newMetric.label}
                onChange={(e) => setNewMetric({ ...newMetric, label: e.target.value })}
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Before (e.g. 1.8x)"
                value={newMetric.before}
                onChange={(e) => setNewMetric({ ...newMetric, before: e.target.value })}
                className={inputClass}
              />
              <input
                type="text"
                placeholder="After (e.g. 4.2x)"
                value={newMetric.after}
                onChange={(e) => setNewMetric({ ...newMetric, after: e.target.value })}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => {
                  if (!newMetric.label || !newMetric.after) return
                  setMetrics([...metrics, newMetric])
                  setNewMetric({ label: "", before: "", after: "" })
                }}
                className="rounded-[10px] bg-[#e61e73] px-4 py-2 text-[12px] font-bold text-white hover:bg-[#ca155f] transition-all cursor-pointer"
              >
                + Add Metric
              </button>
            </div>

            {metrics.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="rounded-[10px] bg-[#0b0f17] border border-[#1f2937] p-3 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400">{m.label}</div>
                      <div className="text-[14px] font-bold text-white flex items-center gap-1.5">
                        <span className="text-slate-500 line-through text-[12px]">{m.before}</span>
                        <span className="text-emerald-400">→ {m.after}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMetrics(metrics.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-rose-400 p-1 text-sm cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Narrative & Case Details */}
          <div className="rounded-[16px] border border-[#1f2937] bg-[#111827] p-6 space-y-4">
            <h3 className="text-[15px] font-bold text-white border-b border-[#1f2937] pb-3">
              Case Narrative
            </h3>
            <div>
              <label className={labelClass}>About The Client</label>
              <textarea
                rows={3}
                value={form.about}
                onChange={(e) => setForm({ ...form, about: e.target.value })}
                placeholder="Who is the client and what was their positioning?"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>The Core Challenge</label>
              <textarea
                rows={3}
                value={form.challenge}
                onChange={(e) => setForm({ ...form, challenge: e.target.value })}
                placeholder="What bottlenecks were they facing?"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Our Strategic Solution</label>
              <textarea
                rows={4}
                value={form.solution}
                onChange={(e) => setForm({ ...form, solution: e.target.value })}
                placeholder="How did Mommantum resolve this challenge?"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Key Growth Insights</label>
              <textarea
                rows={3}
                value={form.insights}
                onChange={(e) => setForm({ ...form, insights: e.target.value })}
                placeholder="Key takeaways and lessons learned..."
                className={inputClass}
              />
            </div>
          </div>

          {/* What We Did & Results List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-[16px] border border-[#1f2937] bg-[#111827] p-6 space-y-3">
              <h4 className="text-[14px] font-bold text-white">What We Did (Execution Items)</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Scripted 25 TikTok Hooks"
                  value={newWhat}
                  onChange={(e) => setNewWhat(e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newWhat.trim()) return
                    setWhatWeDid([...whatWeDid, newWhat.trim()])
                    setNewWhat("")
                  }}
                  className="rounded-[10px] bg-[#1f2937] px-3 py-2 text-[12px] font-bold text-white hover:bg-[#2d3a4f] shrink-0 cursor-pointer"
                >
                  + Add
                </button>
              </div>
              <ul className="space-y-1.5 pt-2">
                {whatWeDid.map((w, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between p-2 rounded-[8px] bg-[#0b0f17] border border-[#1f2937] text-[12px]"
                  >
                    <span>{w}</span>
                    <button
                      type="button"
                      onClick={() => setWhatWeDid(whatWeDid.filter((_, idx) => idx !== i))}
                      className="text-slate-500 hover:text-rose-400 text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[16px] border border-[#1f2937] bg-[#111827] p-6 space-y-3">
              <h4 className="text-[14px] font-bold text-white">Verified Outcomes (Results)</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. +310% Net New Customers"
                  value={newResult}
                  onChange={(e) => setNewResult(e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newResult.trim()) return
                    setResults([...results, newResult.trim()])
                    setNewResult("")
                  }}
                  className="rounded-[10px] bg-[#1f2937] px-3 py-2 text-[12px] font-bold text-white hover:bg-[#2d3a4f] shrink-0 cursor-pointer"
                >
                  + Add
                </button>
              </div>
              <ul className="space-y-1.5 pt-2">
                {results.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between p-2 rounded-[8px] bg-[#0b0f17] border border-[#1f2937] text-[12px]"
                  >
                    <span className="text-emerald-400 font-medium">✓ {r}</span>
                    <button
                      type="button"
                      onClick={() => setResults(results.filter((_, idx) => idx !== i))}
                      className="text-slate-500 hover:text-rose-400 text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    />
  )
}
