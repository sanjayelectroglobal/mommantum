"use client"
import { useEffect, useState } from "react"

export default function AdminSeoSettingsPage() {
  const [siteForm, setSiteForm] = useState({
    site_name: "",
    site_url: "",
    logo_url: "",
    favicon_url: "",
    brand_name: "",
    custom_admin_path: "",
  })

  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)
  const [orgProfileJson, setOrgProfileJson] = useState("")

  const [seoList, setSeoList] = useState<any[]>([])
  const [selectedSeo, setSelectedSeo] = useState<any>(null)
  const [savingSite, setSavingSite] = useState(false)
  const [savingSeo, setSavingSeo] = useState(false)
  const [loading, setLoading] = useState(true)

  const [keywords, setKeywords] = useState<any[]>([])
  const [newKeyword, setNewKeyword] = useState({ keyword: "", target_url: "", max_matches_per_page: 1 })
  const [savingKeyword, setSavingKeyword] = useState(false)
  const [runningAiJob, setRunningAiJob] = useState(false)
  const [aiJobResult, setAiJobResult] = useState<any>(null)

  async function runAiSeoJob(force = false) {
    setRunningAiJob(true)
    setAiJobResult(null)
    try {
      const res = await fetch("/api/admin/jobs/seo-auto-fill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force, limit: 100 }),
      })
      const data = await res.json()
      setAiJobResult(data)
      if (res.ok) {
        const updated = await fetch("/api/admin/seo").then((r) => r.json())
        if (updated?.settings) setSeoList(updated.settings)
      }
    } catch {
      setAiJobResult({ success: false, message: "Network request failed." })
    } finally {
      setRunningAiJob(false)
    }
  }

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/seo/site").then((r) => r.json()),
      fetch("/api/admin/seo").then((r) => r.json()),
      fetch("/api/admin/keywords").then((r) => r.json()).catch(() => null),
      fetch("/api/auth/me").then((r) => r.json()).catch(() => null),
    ])
      .then(([siteData, seoData, keywordsData, authData]) => {
        if (siteData?.setting) {
          setSiteForm({
            site_name: "",
            site_url: "",
            logo_url: "",
            favicon_url: "",
            brand_name: "",
            custom_admin_path: "",
            ...siteData.setting
          })
          if (siteData.setting.organization_profile) {
            try {
              const val = typeof siteData.setting.organization_profile === "string"
                ? JSON.parse(siteData.setting.organization_profile)
                : siteData.setting.organization_profile
              setOrgProfileJson(JSON.stringify(val, null, 2))
            } catch {
              setOrgProfileJson(String(siteData.setting.organization_profile))
            }
          }
        }
        if (seoData?.settings) setSeoList(seoData.settings)
        if (keywordsData?.keywords) setKeywords(keywordsData.keywords)
        if (authData?.role) setCurrentUserRole(authData.role)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  async function deleteKeyword(id: string) {
    if (!confirm("Are you sure you want to delete this keyword?")) return
    try {
      const res = await fetch(`/api/admin/keywords/${id}`, { method: "DELETE" })
      if (res.ok) {
        setKeywords(keywords.filter((k) => k.id !== id))
      } else {
        alert("Failed to delete keyword")
      }
    } catch {
      alert("Network error")
    }
  }

  async function addKeyword(e: React.FormEvent) {
    e.preventDefault()
    if (!newKeyword.keyword || !newKeyword.target_url) return
    setSavingKeyword(true)
    try {
      const res = await fetch("/api/admin/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newKeyword),
      })
      if (res.ok) {
        const data = await res.json()
        if (data?.keyword) {
          setKeywords([...keywords, data.keyword].sort((a, b) => a.keyword.localeCompare(b.keyword)))
          setNewKeyword({ keyword: "", target_url: "", max_matches_per_page: 1 })
        }
      } else {
        const data = await res.json()
        alert(data.error || "Failed to add keyword")
      }
    } catch {
      alert("Network error")
    } finally {
      setSavingKeyword(false)
    }
  }

  async function saveSiteSettings(e: React.FormEvent) {
    e.preventDefault()
    let parsedOrgProfile = null
    if (orgProfileJson.trim()) {
      try {
        parsedOrgProfile = JSON.parse(orgProfileJson.trim())
      } catch (err: any) {
        alert("Invalid JSON in Organization Profile: " + (err?.message || "Syntax error"))
        return
      }
    }

    setSavingSite(true)
    try {
      const res = await fetch("/api/admin/seo/site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...siteForm,
          organization_profile: parsedOrgProfile,
        }),
      })
      if (res.ok) {
        alert("Site settings saved successfully!")
      } else {
        const data = await res.json().catch(() => null)
        alert(data?.error || "Failed to save site settings")
      }
    } catch {
      alert("Network error")
    } finally {
      setSavingSite(false)
    }
  }

  async function saveSeoSetting(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSeo) return
    setSavingSeo(true)
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedSeo),
      })
      if (res.ok) {
        alert("SEO tags updated successfully!")
        // Refresh SEO settings list
        const updated = await fetch("/api/admin/seo").then((r) => r.json())
        if (updated?.settings) setSeoList(updated.settings)
      } else {
        const data = await res.json().catch(() => null)
        alert(data?.error || "Failed to save SEO tags")
      }
    } catch {
      alert("Network error")
    } finally {
      setSavingSeo(false)
    }
  }

  const inputClass =
    "w-full rounded-[12px] border border-[#1f2937] bg-[#111827] px-4 py-3 text-[14px] text-white outline-none transition-all placeholder:text-slate-500 focus:border-[#374151]"
  const labelClass =
    "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.05em] text-[#e2e8f0]"

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">
        Loading settings...
      </div>
    )
  }

  return (
    <div className="text-slate-200">
      <div>
        <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-white">
          SEO & Site Settings
        </h1>
        <p className="mt-1 text-[14px] text-slate-400">
          Configure site-wide metadata, titles, and automated AI SEO generation
        </p>
      </div>

      {/* AI SEO Generator Card */}
      <div className="mt-6 rounded-[18px] border border-[#e61e73]/30 bg-gradient-to-r from-[#111827] via-[#1a1024] to-[#111827] p-6 shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#e61e73]/20 px-3 py-1 text-[12px] font-bold text-[#ef6a99]">
              ✨ AI SEO Auto-Fill (GPT-4o-mini & Answer The Public)
            </div>
            <h2 className="mt-2 text-[18px] font-bold text-white">
              Automated AI SEO Metadata & FAQ Generator
            </h2>
            <p className="text-[13px] text-slate-400">
              Scans products, blogs, and categories. Generates meta titles (&lt; 60 chars), meta descriptions (150-160 chars), keywords, social tags, reading times, and search-intent FAQs.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 sm:flex-shrink-0">
            <button
              type="button"
              disabled={runningAiJob}
              onClick={() => runAiSeoJob(false)}
              className="rounded-[12px] bg-[#e61e73] px-5 py-3 text-[13px] font-extrabold text-white transition-all hover:bg-[#ca155f] disabled:opacity-50"
            >
              {runningAiJob ? "Running AI Generator..." : "✨ Run AI Auto-Fill"}
            </button>
            <button
              type="button"
              disabled={runningAiJob}
              onClick={() => runAiSeoJob(true)}
              className="rounded-[12px] border border-[#1f2937] bg-[#1f2937] px-4 py-3 text-[13px] font-bold text-slate-300 transition-all hover:bg-slate-800 disabled:opacity-50"
            >
              ⚡ Force Overwrite All
            </button>
          </div>
        </div>
        {aiJobResult && (
          <div className="mt-4 rounded-[12px] border border-[#1f2937] bg-[#0b0f17] p-4 text-[13px] text-slate-300">
            <p className="font-semibold text-emerald-400">Status: {aiJobResult.message}</p>
            {aiJobResult.data?.errors?.length > 0 && (
              <ul className="mt-2 space-y-1 text-[12px] text-rose-400">
                {aiJobResult.data.errors.map((err: string, i: number) => (
                  <li key={i}>• {err}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6 h-fit">
          {/* Site Settings */}
          <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937]">
            <h2 className="text-[16px] font-extrabold text-white mb-4">
              Site Settings
            </h2>
            <form onSubmit={saveSiteSettings} className="space-y-4">
              <div>
                <label className={labelClass}>Site Name</label>
                <input
                  type="text"
                  value={siteForm.site_name || ""}
                  onChange={(e) => setSiteForm({ ...siteForm, site_name: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Brand Name</label>
                <input
                  type="text"
                  value={siteForm.brand_name || ""}
                  onChange={(e) => setSiteForm({ ...siteForm, brand_name: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Site URL</label>
                <input
                  type="text"
                  value={siteForm.site_url || ""}
                  onChange={(e) => setSiteForm({ ...siteForm, site_url: e.target.value })}
                  className={inputClass}
                />
              </div>
              {currentUserRole === "admin" && (
                <div>
                  <label className={labelClass}>Custom Admin Path</label>
                  <input
                    type="text"
                    value={siteForm.custom_admin_path || ""}
                    onChange={(e) => setSiteForm({ ...siteForm, custom_admin_path: e.target.value })}
                    placeholder="e.g. secret-momentum (blank defaults to admin)"
                    className={inputClass}
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Warning: Changing this path changes the URL used to access the dashboard. Default is 'admin'.
                  </p>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Logo URL</label>
                  <input
                    type="text"
                    value={siteForm.logo_url || ""}
                    onChange={(e) => setSiteForm({ ...siteForm, logo_url: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Favicon URL</label>
                  <input
                    type="text"
                    value={siteForm.favicon_url || ""}
                    onChange={(e) => setSiteForm({ ...siteForm, favicon_url: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-[#1f2937]">
                <div className="flex items-center justify-between mb-1.5">
                  <label className={labelClass}>Organization Profile (JSON-LD Override)</label>
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        if (!orgProfileJson.trim()) return
                        const parsed = JSON.parse(orgProfileJson)
                        setOrgProfileJson(JSON.stringify(parsed, null, 2))
                      } catch (e: any) {
                        alert("Invalid JSON: " + (e?.message || "Syntax error"))
                      }
                    }}
                    className="text-[11px] text-[#e61e73] hover:text-[#ff3e8d] font-semibold"
                  >
                    Format JSON
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={orgProfileJson}
                  onChange={(e) => setOrgProfileJson(e.target.value)}
                  placeholder={`{\n  "legalName": "Mommantum",\n  "telephone": "+917742276031",\n  "email": "kuldeep@mommantum.in"\n}`}
                  className={`${inputClass} font-mono text-[12px] leading-relaxed`}
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Optional structured schema overrides (legalName, founders, address, social sameAs) applied site-wide.
                </p>
              </div>
              <button
                type="submit"
                disabled={savingSite}
                className="w-full h-[44px] rounded-[10px] bg-[#e61e73] text-[13px] font-bold text-white transition-all hover:bg-[#ca155f] disabled:opacity-50"
              >
                {savingSite ? "Saving..." : "Save Site Settings"}
              </button>
            </form>
          </div>

          {/* Keywords Manager */}
          <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937]">
            <h2 className="text-[16px] font-extrabold text-white mb-4">
              Internal Linking Keywords Manager
            </h2>
            
            {/* Inline Add Form */}
            <form onSubmit={addKeyword} className="space-y-4 mb-6 pb-6 border-b border-[#1f2937]">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Keyword</label>
                  <input
                    type="text"
                    placeholder="e.g. AI automation"
                    value={newKeyword.keyword}
                    onChange={(e) => setNewKeyword({ ...newKeyword, keyword: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Target URL</label>
                  <input
                    type="text"
                    placeholder="e.g. /services/ai-agentic-service"
                    value={newKeyword.target_url}
                    onChange={(e) => setNewKeyword({ ...newKeyword, target_url: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 items-end">
                <div>
                  <label className={labelClass}>Max Matches per Page</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={newKeyword.max_matches_per_page}
                    onChange={(e) => setNewKeyword({ ...newKeyword, max_matches_per_page: parseInt(e.target.value) || 1 })}
                    className={inputClass}
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingKeyword}
                  className="w-full h-[44px] rounded-[10px] bg-[#e61e73] text-[13px] font-bold text-white transition-all hover:bg-[#ca155f] disabled:opacity-50"
                >
                  {savingKeyword ? "Adding..." : "Add Keyword"}
                </button>
              </div>
            </form>

            {/* Keyword List */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              <h3 className={labelClass}>Active Keywords ({keywords.length})</h3>
              {keywords.length === 0 ? (
                <p className="text-[13px] text-slate-500 italic">No linking keywords added yet.</p>
              ) : (
                <div className="divide-y divide-[#1f2937]">
                  {keywords.map((kw) => (
                    <div key={kw.id} className="py-2.5 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-semibold text-white truncate">
                          {kw.keyword}
                        </div>
                        <div className="text-[12px] text-slate-400 truncate mt-0.5">
                          {kw.target_url} <span className="text-slate-500">• max: {kw.max_matches_per_page}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteKeyword(kw.id)}
                        className="text-slate-400 hover:text-red-500 text-[13px] transition-colors p-1"
                        title="Delete keyword"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Page-by-page SEO */}
        <div className="space-y-6">
          {/* List of Pages */}
          <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937]">
            <h2 className="text-[16px] font-extrabold text-white mb-4">
              Page Meta Settings (SEO)
            </h2>
            <div className="flex flex-wrap gap-2">
              {seoList.map((item) => (
                <button
                  key={item.page_key}
                  onClick={() => setSelectedSeo(item)}
                  className={`rounded-[8px] px-3 py-1.5 text-[12px] font-semibold transition-all border ${
                    selectedSeo?.page_key === item.page_key
                      ? "bg-[#e61e73] text-white border-transparent"
                      : "bg-[#1f2937] text-slate-300 border-[#374151] hover:text-white"
                  }`}
                >
                  {item.page_label || item.page_key}
                </button>
              ))}
            </div>
          </div>

          {/* Edit form for Selected Page */}
          {selectedSeo && (
            <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937]">
              <h3 className="text-[15px] font-bold text-white mb-4">
                Editing: {selectedSeo.page_label || selectedSeo.page_key}
              </h3>
              <form onSubmit={saveSeoSetting} className="space-y-4">
                <div>
                  <label className={labelClass}>Meta Title</label>
                  <input
                    type="text"
                    value={selectedSeo.meta_title || ""}
                    onChange={(e) => setSelectedSeo({ ...selectedSeo, meta_title: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Meta Description</label>
                  <textarea
                    value={selectedSeo.meta_description || ""}
                    onChange={(e) => setSelectedSeo({ ...selectedSeo, meta_description: e.target.value })}
                    rows={3}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Canonical Slug Override</label>
                  <input
                    type="text"
                    value={selectedSeo.slug || ""}
                    onChange={(e) => setSelectedSeo({ ...selectedSeo, slug: e.target.value })}
                    placeholder="e.g. /about (blank defaults to actual path)"
                    className={inputClass}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Robots Index</label>
                    <select
                      value={selectedSeo.robots_index === false ? "false" : "true"}
                      onChange={(e) => setSelectedSeo({ ...selectedSeo, robots_index: e.target.value === "true" })}
                      className={inputClass}
                    >
                      <option value="true">Index</option>
                      <option value="false">No-Index</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Robots Follow</label>
                    <select
                      value={selectedSeo.robots_follow === false ? "false" : "true"}
                      onChange={(e) => setSelectedSeo({ ...selectedSeo, robots_follow: e.target.value === "true" })}
                      className={inputClass}
                    >
                      <option value="true">Follow</option>
                      <option value="false">No-Follow</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={savingSeo}
                  className="w-full h-[44px] rounded-[10px] bg-[#e61e73] text-[13px] font-bold text-white transition-all hover:bg-[#ca155f] disabled:opacity-50"
                >
                  {savingSeo ? "Saving..." : "Save SEO Details"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
