"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminPath } from "@lib/hooks/use-admin-path"

type Props = {
  initialData?: any
  isEdit?: boolean
}

export default function ServiceEditor({ initialData, isEdit = false }: Props) {
  const router = useRouter()
  const { prefixPath } = useAdminPath()
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState("")

  const [form, setForm] = useState({
    title: initialData?.title || "",
    shortLabel: initialData?.short_label || "",
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
    initialData?.why_it_matters?.length ? initialData.why_it_matters : [""]
  )

  function updateForm(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function updateList(
    list: string[],
    setList: (v: string[]) => void,
    index: number,
    value: string
  ) {
    setList(list.map((item, i) => (i === index ? value : item)))
  }

  function addToList(list: string[], setList: (v: string[]) => void) {
    setList([...list, ""])
  }

  function removeFromList(
    list: string[],
    setList: (v: string[]) => void,
    index: number
  ) {
    if (list.length === 1) return
    setList(list.filter((_, i) => i !== index))
  }

  async function handleSave() {
    if (!form.title.trim()) { alert("Title is required"); return }

    setSaving(true)
    const payload = {
      ...form,
      points: points.filter((p) => p.trim()),
      outcomes: outcomes.filter((o) => o.trim()),
      whyItMatters: whyItMatters.filter((item) => item.trim()),
    }

    const url = isEdit
      ? `/api/admin/services/${initialData.slug}`
      : "/api/admin/services"

    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    setSaving(false)

    if (res.ok) {
      setSavedMsg(isEdit ? "Saved!" : "Created!")
      setTimeout(() => setSavedMsg(""), 3000)
      if (!isEdit && data.slug) router.push(prefixPath(`/admin/services/${data.slug}`))
    } else {
      alert("Error: " + JSON.stringify(data.error))
    }
  }

  const inputClass = "w-full rounded-[12px] border border-slate-200 bg-[#f9f9fb] px-4 py-3 text-[14px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#99dcf8] focus:ring-2 focus:ring-[#99dcf8]/20"
  const labelClass = "mb-1.5 block text-[12px] font-bold uppercase tracking-[0.05em] text-[#0e2547]"

  return (
    <div className="mx-auto max-w-[900px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-[-0.04em] text-[#0e2547]">
            {isEdit ? "Edit Service" : "New Service"}
          </h1>
          {isEdit && <p className="mt-0.5 text-[12px] text-slate-400">/{initialData?.slug}</p>}
        </div>
        <div className="flex items-center gap-3">
          {savedMsg && <span className="text-[13px] font-semibold text-green-500">✓ {savedMsg}</span>}
          <button onClick={() => router.push(prefixPath("/admin/services"))}
            className="rounded-[10px] border border-slate-200 px-4 py-2 text-[13px] font-semiboldtext-slate-600 hover:border-slate-400"
          >← Back</button>
          <button onClick={handleSave} disabled={saving}
            className="rounded-[10px] bg-[#0e2547] px-5 py-2 text-[13px] font-bold text-white hover:opacity-90 disabled:opacity-50"
          >{saving ? "Saving..." : isEdit ? "Save Changes" : "Create Service"}</button>
        </div>
      </div>

      <div className="mt-8 space-y-6">

        {/* Basic info */}
        <div className="rounded-[18px] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
          <h2 className="mb-5 text-[15px] font-extrabold text-[#0e2547]">Basic Info</h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Title *</label>
                <input type="text" value={form.title} onChange={(e) => updateForm("title", e.target.value)} placeholder="e.g. Performance Marketing" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Short Label</label>
                <input type="text" value={form.shortLabel} onChange={(e) => updateForm("shortLabel", e.target.value)} placeholder="e.g. Marketing" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Description (card text)</label>
              <textarea value={form.description} onChange={(e) => updateForm("description", e.target.value)} placeholder="Short description for service cards..." rows={3} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Intro (detail page)</label>
              <textarea value={form.intro} onChange={(e) => updateForm("intro", e.target.value)} placeholder="Full intro for the service detail page..." rows={4} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Image Path</label>
              <input type="text" value={form.image} onChange={(e) => updateForm("image", e.target.value)} placeholder="/services/performance.webp" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Points */}
        <div className="rounded-[18px] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-extrabold text-[#0e2547]">What We Do (Points)</h2>
            <button onClick={() => addToList(points, setPoints)} className="rounded-[8px] border border-slate-200 px-3 py-1.5 text-[12px] font-semibold text-[#0e2547] hover:border-[#0e2547]">+ Add</button>
          </div>
          <div className="space-y-3">
            {points.map((point, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={point} onChange={(e) => updateList(points, setPoints, i, e.target.value)} placeholder={`Point ${i + 1}...`} className={inputClass} />
                {points.length > 1 && (
                  <button onClick={() => removeFromList(points, setPoints, i)} className="shrink-0 rounded-[10px] border border-red-100 px-3 text-[12px] text-red-400 hover:bg-red-50">✕</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Outcomes */}
        <div className="rounded-[18px] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-extrabold text-[#0e2547]">Outcomes</h2>
            <button onClick={() => addToList(outcomes, setOutcomes)} className="rounded-[8px] border border-slate-200 px-3 py-1.5 text-[12px] font-semibold text-[#0e2547] hover:border-[#0e2547]">+ Add</button>
          </div>
          <div className="space-y-3">
            {outcomes.map((outcome, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={outcome} onChange={(e) => updateList(outcomes, setOutcomes, i, e.target.value)} placeholder={`Outcome ${i + 1}...`} className={inputClass} />
                {outcomes.length > 1 && (
                  <button onClick={() => removeFromList(outcomes, setOutcomes, i)} className="shrink-0 rounded-[10px] border border-red-100 px-3 text-[12px] text-red-400 hover:bg-red-50">✕</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Why it matters */}
        <div className="rounded-[18px] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-extrabold text-[#0e2547]">Why It Matters</h2>
            <button onClick={() => addToList(whyItMatters, setWhyItMatters)} className="rounded-[8px] border border-slate-200 px-3 py-1.5 text-[12px] font-semibold text-[#0e2547] hover:border-[#0e2547]">+ Add</button>
          </div>
          <div className="space-y-3">
            {whyItMatters.map((item, i) => (
              <div key={i} className="flex gap-2">
                <textarea value={item} onChange={(e) => updateList(whyItMatters, setWhyItMatters, i, e.target.value)} placeholder={`Paragraph ${i + 1}...`} rows={3} className={inputClass} />
                {whyItMatters.length > 1 && (
                  <button onClick={() => removeFromList(whyItMatters, setWhyItMatters, i)} className="shrink-0 rounded-[10px] border border-red-100 px-3 text-[12px] text-red-400 hover:bg-red-50">âœ•</button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pb-8">
          <button onClick={() => router.push(prefixPath("/admin/services"))} className="rounded-[10px] border border-slate-200 px-5 py-2.5 text-[13px] font-semiboldtext-slate-600 hover:border-slate-400">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="rounded-[10px] bg-[#0e2547] px-7 py-2.5 text-[13px] font-bold text-white hover:opacity-90 disabled:opacity-50">
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Service"}
          </button>
        </div>

      </div>
    </div>
  )
}
