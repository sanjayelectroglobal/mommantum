"use client"
import React, { useState } from "react"
import SharedEntityEditor, { FAQItem, SeoFormData } from "../../_components/SharedEntityEditor"
import { invalidateAdminCache } from "../../_lib/admin-cache"

type Props = {
  initialData?: any
  isEdit?: boolean
  onClose?: () => void
  onSaveSuccess?: () => void
}

export default function ServiceEditor({
  initialData,
  isEdit = false,
  onClose = () => {},
  onSaveSuccess,
}: Props) {
  // Service-specific form state
  const [form, setForm] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    shortLabel: initialData?.short_label || initialData?.shortLabel || "",
    description: initialData?.description || "",
    intro: initialData?.intro || "",
    image: initialData?.image || "",
  })

  const [points, setPoints] = useState<string[]>(
    initialData?.points?.length ? initialData.points : [""]
  )
  const [outcomes, setOutcomes] = useState<string[]>(
    initialData?.outcomes?.length ? initialData.outcomes : [""]
  )
  const [whyItMatters, setWhyItMatters] = useState<string[]>(
    initialData?.why_it_matters?.length
      ? initialData.why_it_matters
      : initialData?.whyItMatters?.length
      ? initialData.whyItMatters
      : [""]
  )

  const currentSlug = form.slug || initialData?.slug || ""
  const pageKey = currentSlug ? `service:${currentSlug}` : "service:new"

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
      alert("Service Title is required.")
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

    // 1. Save Service Record
    const servicePayload = {
      title: form.title.trim(),
      slug: cleanSlug,
      short_label: form.shortLabel.trim() || form.title.trim(),
      description: form.description.trim(),
      intro: form.intro.trim(),
      image: form.image.trim(),
      points: points.filter(Boolean),
      outcomes: outcomes.filter(Boolean),
      why_it_matters: whyItMatters.filter(Boolean),
      faqs: cleanFaqs,
    }

    const method = isEdit ? "PUT" : "POST"
    const url = isEdit ? `/api/admin/services/${initialData.slug}` : "/api/admin/services"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(servicePayload),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(err?.error || "Failed to save service content")
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
      page_key: `service:${cleanSlug}`,
      page_label: form.title.trim(),
      slug: `/services/${cleanSlug}`,
      canonical_url: seoData.canonical_url?.trim() || null,
      meta_title: seoData.meta_title?.trim() || form.title.trim(),
      meta_description: seoData.meta_description?.trim() || form.description.trim() || null,
      primary_keyword: seoData.primary_keyword?.trim() || null,
      secondary_keywords: secondaryKeywordsArray.length ? secondaryKeywordsArray : null,
      robots_index: seoData.robots_index,
      robots_follow: seoData.robots_follow,
      og_title: seoData.og_title?.trim() || form.title.trim(),
      og_description: seoData.og_description?.trim() || form.description.trim() || null,
      og_image: seoData.og_image?.trim() || form.image.trim() || null,
      og_type: seoData.og_type || "website",
      twitter_card: seoData.twitter_card || "summary_large_image",
      twitter_title: seoData.twitter_title?.trim() || form.title.trim(),
      twitter_description: seoData.twitter_description?.trim() || form.description.trim() || null,
      schema_json: seoData.schema_json?.trim() || null,
      faq_section: cleanFaqs.length ? cleanFaqs : null,
    }

    await fetch("/api/admin/seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(seoPayload),
    }).catch(() => {})

    invalidateAdminCache("admin_services")
    invalidateAdminCache("admin_pages")
    onSaveSuccess?.()
    return true
  }

  return (
    <SharedEntityEditor
      pageKey={pageKey}
      entityLabelSingular="Service"
      entityLabelPlural="Services"
      title={form.title || "New Service"}
      slug={currentSlug ? `/services/${currentSlug}` : ""}
      initialSeoData={{
        canonical_url: initialData?.canonical_url || "",
        meta_title: initialData?.meta_title || initialData?.title || "",
        meta_description: initialData?.meta_description || initialData?.description || "",
        primary_keyword: initialData?.primary_keyword || "",
        secondary_keywords: initialData?.secondary_keywords || "",
        robots_index: initialData?.robots_index ?? true,
        robots_follow: initialData?.robots_follow ?? true,
        og_title: initialData?.og_title || initialData?.title || "",
        og_description: initialData?.og_description || initialData?.description || "",
        og_image: initialData?.og_image || initialData?.image || "",
        og_type: initialData?.og_type || "website",
        twitter_card: initialData?.twitter_card || "summary_large_image",
        twitter_title: initialData?.twitter_title || initialData?.title || "",
        twitter_description: initialData?.twitter_description || initialData?.description || "",
        schema_json: initialData?.schema_json || "",
      }}
      initialFaqs={initialData?.faqs || []}
      hasContentTab={true}
      contentTabLabel="Service Details & Content"
      defaultTab="general"
      onClose={onClose}
      onSave={handleSave}
      renderContentTab={() => (
        <div className="space-y-6">
          {/* Basic Identification */}
          <div className="rounded-[16px] border border-[#1f2937] bg-[#111827] p-6 space-y-4">
            <h3 className="text-[15px] font-bold text-white border-b border-[#1f2937] pb-3">
              Basic Identification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Service Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Performance Marketing"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>URL Slug *</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. performance-marketing"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Short Nav Label</label>
                <input
                  type="text"
                  value={form.shortLabel}
                  onChange={(e) => setForm({ ...form, shortLabel: e.target.value })}
                  placeholder="e.g. Performance Ads"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Hero Intro Tagline</label>
              <input
                type="text"
                value={form.intro}
                onChange={(e) => setForm({ ...form, intro: e.target.value })}
                placeholder="Punchy one-sentence summary for hero section..."
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Cover Image URL</label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://... /service.webp"
                className={inputClass}
              />
              {form.image && (
                <div className="mt-2 h-28 w-48 rounded-[8px] overflow-hidden border border-[#1f2937] bg-slate-900">
                  <img
                    src={form.image}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLElement).style.display = "none"
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Comprehensive Description</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Detailed explanation of this service offering..."
                className={inputClass}
              />
            </div>
          </div>

          {/* Key Deliverables & Points */}
          <div className="rounded-[16px] border border-[#1f2937] bg-[#111827] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f2937] pb-3">
              <h3 className="text-[15px] font-bold text-white">Key Deliverables (What We Do)</h3>
              <button
                type="button"
                onClick={() => setPoints([...points, ""])}
                className="text-[12px] font-bold text-[#e61e73] hover:underline cursor-pointer"
              >
                + Add Point
              </button>
            </div>
            <div className="space-y-2">
              {points.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={p}
                    onChange={(e) => {
                      const copy = [...points]
                      copy[idx] = e.target.value
                      setPoints(copy)
                    }}
                    placeholder={`Deliverable #${idx + 1}`}
                    className={inputClass}
                  />
                  {points.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setPoints(points.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-rose-400 p-2 text-sm cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Expected Outcomes */}
          <div className="rounded-[16px] border border-[#1f2937] bg-[#111827] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f2937] pb-3">
              <h3 className="text-[15px] font-bold text-white">Expected Outcomes & ROI</h3>
              <button
                type="button"
                onClick={() => setOutcomes([...outcomes, ""])}
                className="text-[12px] font-bold text-[#e61e73] hover:underline cursor-pointer"
              >
                + Add Outcome
              </button>
            </div>
            <div className="space-y-2">
              {outcomes.map((o, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={o}
                    onChange={(e) => {
                      const copy = [...outcomes]
                      copy[idx] = e.target.value
                      setOutcomes(copy)
                    }}
                    placeholder={`Outcome #${idx + 1}`}
                    className={inputClass}
                  />
                  {outcomes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setOutcomes(outcomes.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-rose-400 p-2 text-sm cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Why It Matters */}
          <div className="rounded-[16px] border border-[#1f2937] bg-[#111827] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f2937] pb-3">
              <h3 className="text-[15px] font-bold text-white">Why It Matters (Value Proposition)</h3>
              <button
                type="button"
                onClick={() => setWhyItMatters([...whyItMatters, ""])}
                className="text-[12px] font-bold text-[#e61e73] hover:underline cursor-pointer"
              >
                + Add Reason
              </button>
            </div>
            <div className="space-y-2">
              {whyItMatters.map((w, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={w}
                    onChange={(e) => {
                      const copy = [...whyItMatters]
                      copy[idx] = e.target.value
                      setWhyItMatters(copy)
                    }}
                    placeholder={`Value point #${idx + 1}`}
                    className={inputClass}
                  />
                  {whyItMatters.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setWhyItMatters(whyItMatters.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-rose-400 p-2 text-sm cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    />
  )
}
