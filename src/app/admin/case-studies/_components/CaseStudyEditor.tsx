"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminPath } from "@lib/hooks/use-admin-path"

type Metric = { label: string; before: string; after: string }

type Props = {
  initialData?: any
  isEdit?: boolean
}

export default function CaseStudyEditor({ initialData, isEdit = false }: Props) {
  const router = useRouter()
  const { prefixPath } = useAdminPath()
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState("")

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

  function updateForm(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (key === "title" && !isEdit) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .slice(0, 80)
      setForm((prev) => ({ ...prev, title: value, slug: generatedSlug }))
    }
  }

  function addWhat() {
    if (!newWhat.trim()) return
    setWhatWeDid([...whatWeDid, newWhat.trim()])
    setNewWhat("")
  }

  function addResult() {
    if (!newResult.trim()) return
    setResults([...results, newResult.trim()])
    setNewResult("")
  }

  function addMetric() {
    if (!newMetric.label.trim()) return
    setMetrics([...metrics, newMetric])
    setNewMetric({ label: "", before: "", after: "" })
  }

  async function handleSave() {
    if (!form.title.trim() || !form.slug.trim()) {
      alert("Title and slug are required")
      return
    }

    setSaving(true)
    setSavedMsg("")

    const payload = {
      ...form,
      what_we_did: whatWeDid,
      results,
      metrics,
    }

    const url = isEdit
      ? `/api/admin/case-studies/${initialData.id}`
      : "/api/admin/case-studies"
    const method = isEdit ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        setSavedMsg(isEdit ? "Changes saved!" : "Case study created!")
        setTimeout(() => setSavedMsg(""), 3000)
        if (!isEdit) {
          router.push(prefixPath("/admin/case-studies"))
        }
      } else {
        alert("Error: " + (data.error || JSON.stringify(data)))
      }
    } catch {
      alert("Network error. Try again.")
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    "w-full rounded-[12px] border border-[#1f2937] bg-[#111827] px-4 py-3 text-[14px] text-white outline-none transition-all placeholder:text-slate-500 focus:border-[#374151]"
  const labelClass =
    "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.05em] text-[#e2e8f0]"

  return (
    <div className="mx-auto max-w-[900px] text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-[-0.04em] text-white">
            {isEdit ? "Edit Case Study" : "New Case Study"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {savedMsg && (
            <span className="text-[13px] font-semibold text-green-400">
              ✓ {savedMsg}
            </span>
          )}
          <button
            onClick={() => router.push(prefixPath("/admin/case-studies"))}
            className="rounded-[10px] border border-[#1f2937] bg-[#1f2937]/50 px-4 py-2 text-[13px] font-semibold text-slate-300 hover:border-[#374151] hover:text-white transition-all"
          >
            ← Back
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-[10px] bg-[#e61e73] px-5 py-2 text-[13px] font-bold text-white hover:bg-[#ca155f] disabled:opacity-50 transition-all"
          >
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {/* Info */}
        <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937] space-y-4">
          <h2 className="text-[15px] font-extrabold text-white">General Info</h2>
          <div>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateForm("title", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => updateForm("slug", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => updateForm("category", e.target.value)}
                placeholder="e.g. Paid Ads, SEO"
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className={labelClass}>Cover Image URL</label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => updateForm("image", e.target.value)}
                placeholder="https://..."
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Accent Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={form.accent}
                  onChange={(e) => updateForm("accent", e.target.value)}
                  className="h-11 w-12 rounded-[10px] border border-[#1f2937] bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={form.accent}
                  onChange={(e) => updateForm("accent", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
          <div>
            <label className={labelClass}>Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => updateForm("tagline", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Challenge, Strategy, Insight */}
        <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937] space-y-4">
          <h2 className="text-[15px] font-extrabold text-white">The Narrative</h2>
          <div>
            <label className={labelClass}>About the Client</label>
            <textarea
              value={form.about}
              onChange={(e) => updateForm("about", e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>The Challenge</label>
            <textarea
              value={form.challenge}
              onChange={(e) => updateForm("challenge", e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Strategy / Overview</label>
            <textarea
              value={form.overview}
              onChange={(e) => updateForm("overview", e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Solution / Execution</label>
            <textarea
              value={form.solution}
              onChange={(e) => updateForm("solution", e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Key Insight</label>
            <textarea
              value={form.insights}
              onChange={(e) => updateForm("insights", e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>
        </div>

        {/* Arrays: What We Did & Results */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* What We Did */}
          <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937] h-fit">
            <h3 className={labelClass}>What We Did</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newWhat}
                onChange={(e) => setNewWhat(e.target.value)}
                placeholder="Add task item..."
                className={inputClass}
              />
              <button
                type="button"
                onClick={addWhat}
                className="rounded-[10px] bg-[#1f2937] px-4 text-white border border-[#374151]"
              >
                Add
              </button>
            </div>
            <ul className="space-y-2">
              {whatWeDid.map((w, idx) => (
                <li key={idx} className="flex justify-between items-center rounded-[10px] bg-[#1f2937] p-3 text-[13px] border border-[#374151]">
                  <span>{w}</span>
                  <button
                    type="button"
                    onClick={() => setWhatWeDid(whatWeDid.filter((_, i) => i !== idx))}
                    className="text-red-400 text-[12px]"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Results */}
          <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937] h-fit">
            <h3 className={labelClass}>Key Results Highlights</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newResult}
                onChange={(e) => setNewResult(e.target.value)}
                placeholder="Add result highlight..."
                className={inputClass}
              />
              <button
                type="button"
                onClick={addResult}
                className="rounded-[10px] bg-[#1f2937] px-4 text-white border border-[#374151]"
              >
                Add
              </button>
            </div>
            <ul className="space-y-2">
              {results.map((r, idx) => (
                <li key={idx} className="flex justify-between items-center rounded-[10px] bg-[#1f2937] p-3 text-[13px] border border-[#374151]">
                  <span>{r}</span>
                  <button
                    type="button"
                    onClick={() => setResults(results.filter((_, i) => i !== idx))}
                    className="text-red-400 text-[12px]"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937]">
          <h3 className="mb-4 text-[15px] font-extrabold text-white">Before vs After Metrics</h3>
          <div className="grid gap-2 sm:grid-cols-4 mb-4">
            <input
              type="text"
              value={newMetric.label}
              onChange={(e) => setNewMetric({ ...newMetric, label: e.target.value })}
              placeholder="Metric name (e.g. ROAS)..."
              className="sm:col-span-2 rounded-[12px] border border-[#1f2937] bg-[#111827] px-3 py-2 text-[13px] text-white outline-none focus:border-[#374151]"
            />
            <input
              type="text"
              value={newMetric.before}
              onChange={(e) => setNewMetric({ ...newMetric, before: e.target.value })}
              placeholder="Before..."
              className="rounded-[12px] border border-[#1f2937] bg-[#111827] px-3 py-2 text-[13px] text-white outline-none focus:border-[#374151]"
            />
            <input
              type="text"
              value={newMetric.after}
              onChange={(e) => setNewMetric({ ...newMetric, after: e.target.value })}
              placeholder="After..."
              className="rounded-[12px] border border-[#1f2937] bg-[#111827] px-3 py-2 text-[13px] text-white outline-none focus:border-[#374151]"
            />
          </div>
          <button
            type="button"
            onClick={addMetric}
            className="rounded-[10px] bg-[#1f2937] px-4 py-2 text-[13px] font-bold text-white border border-[#374151]"
          >
            + Add Metric Row
          </button>

          {metrics.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-[#1f2937] text-[11px] font-bold text-slate-400">
                    <th className="pb-2">Metric</th>
                    <th className="pb-2">Before</th>
                    <th className="pb-2">After</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((m, idx) => (
                    <tr key={idx} className="border-b border-[#1f2937]/50">
                      <td className="py-2 text-white font-semibold">{m.label}</td>
                      <td className="py-2 text-slate-400 line-through">{m.before}</td>
                      <td className="py-2 text-green-400 font-bold">{m.after}</td>
                      <td className="py-2 text-right">
                        <button
                          type="button"
                          onClick={() => setMetrics(metrics.filter((_, i) => i !== idx))}
                          className="text-red-400 text-[12px]"
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
      </div>
    </div>
  )
}
