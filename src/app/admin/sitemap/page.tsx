"use client"
import { useState } from "react"

const BASE_URL = "https://www.mommantum.com"

interface SitemapLink {
  label: string
  url: string
  description: string
  priority: string
  category: string
}

const SITEMAP_LINKS: SitemapLink[] = [
  // Index
  {
    label: "Sitemap Index",
    url: `${BASE_URL}/sitemap.xml`,
    description: "Master sitemap index — lists all sub-sitemaps",
    priority: "—",
    category: "Index",
  },
  // Pages
  {
    label: "Static Pages",
    url: `${BASE_URL}/sitemap/pages.xml`,
    description: "Homepage, Services, Work, Blog, About, Contact, Store, Legal",
    priority: "0.5 – 1.0",
    category: "Sub-Sitemaps",
  },
  {
    label: "Services",
    url: `${BASE_URL}/sitemap/services.xml`,
    description: "All dynamic service pages",
    priority: "0.8",
    category: "Sub-Sitemaps",
  },
  {
    label: "Blog Posts",
    url: `${BASE_URL}/sitemap/blogs.xml`,
    description: "All published blog posts",
    priority: "0.8",
    category: "Sub-Sitemaps",
  },
  {
    label: "Work / Case Studies",
    url: `${BASE_URL}/sitemap/work.xml`,
    description: "All case study & portfolio pages",
    priority: "0.8",
    category: "Sub-Sitemaps",
  },
  {
    label: "Products",
    url: `${BASE_URL}/sitemap/products.xml`,
    description: "All store product pages",
    priority: "0.9",
    category: "Sub-Sitemaps",
  },
  {
    label: "Collections",
    url: `${BASE_URL}/sitemap/collections.xml`,
    description: "All product collection pages",
    priority: "0.8",
    category: "Sub-Sitemaps",
  },
  {
    label: "Categories",
    url: `${BASE_URL}/sitemap/categories.xml`,
    description: "All product category pages",
    priority: "0.8",
    category: "Sub-Sitemaps",
  },
]

const ROBOTS_LINK = `${BASE_URL}/robots.txt`

const PRIORITY_GUIDE = [
  { priority: "1.0", page: "Homepage", color: "text-rose-400" },
  { priority: "0.9", page: "Core Hubs (Services, Store, Products)", color: "text-orange-400" },
  { priority: "0.8", page: "Main Pages (Blog, Work, About, Contact, Individual posts)", color: "text-yellow-400" },
  { priority: "0.5", page: "Legal Pages (Privacy Policy, Terms)", color: "text-slate-400" },
]

export default function AdminSitemapPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  const categories = Array.from(new Set(SITEMAP_LINKS.map((l) => l.category)))

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1e2638] pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-[10px] bg-[#0f9b63]/10 border border-[#0f9b63]/20">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#34d399"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Sitemap Manager</h1>
            <p className="text-xs text-slate-400 mt-0.5">Live sitemap links for Mommantum — submit these to Google Search Console</p>
          </div>
        </div>
        <a
          href={`${BASE_URL}/sitemap.xml`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-[8px] text-sm font-medium text-white bg-[#e61e73] hover:bg-[#c91760] transition-all"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          View Sitemap Index
        </a>
      </div>

      {/* Google Search Console Tip */}
      <div className="flex items-start gap-3 p-4 rounded-[10px] bg-[#3b5bdb]/10 border border-[#3b5bdb]/20">
        <svg className="flex-shrink-0 mt-0.5" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#6d8df7"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <div>
          <p className="text-sm font-medium text-[#93b4ff]">Submit to Google Search Console</p>
          <p className="text-xs text-slate-400 mt-1">
            Go to{" "}
            <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-[#93b4ff] hover:underline">
              Google Search Console
            </a>
            {" "}→ Sitemaps → paste{" "}
            <code className="text-slate-300 bg-[#1a2336] px-1 py-0.5 rounded text-[11px]">{BASE_URL}/sitemap.xml</code>
            {" "}and hit Submit.
          </p>
        </div>
      </div>

      {/* Sitemap Links */}
      {categories.map((cat) => {
        const links = SITEMAP_LINKS.filter((l) => l.category === cat)
        return (
          <div key={cat} className="flex flex-col gap-2">
            <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500 px-1">{cat}</div>
            <div className="rounded-[12px] border border-[#1e2638] overflow-hidden divide-y divide-[#1a2336]">
              {links.map((link) => (
                <div key={link.url} className="flex items-center justify-between p-4 hover:bg-[#0f1624] transition-colors group gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-200">{link.label}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1a2336] text-slate-400 border border-[#263550] font-mono">
                        priority {link.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{link.description}</p>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#93b4ff] hover:underline font-mono mt-1 inline-block truncate max-w-full"
                    >
                      {link.url}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => copyToClipboard(link.url)}
                      title="Copy URL"
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-[6px] text-[11px] font-medium text-slate-400 border border-[#263550] hover:border-[#3b5bdb] hover:text-white transition-all"
                    >
                      {copied === link.url ? (
                        <>
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          Copy URL
                        </>
                      )}
                    </button>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-[6px] text-[11px] font-medium text-slate-400 border border-[#263550] hover:border-emerald-500/40 hover:text-emerald-400 transition-all"
                    >
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      Open
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* robots.txt */}
      <div className="flex flex-col gap-2">
        <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500 px-1">Robots & Crawl Access</div>
        <div className="rounded-[12px] border border-[#1e2638] overflow-hidden">
          <div className="flex items-center justify-between p-4 hover:bg-[#0f1624] transition-colors gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-200">robots.txt</p>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  AI Crawlers: Allowed
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Controls search engine and AI crawler access — currently grants all AI bots full access</p>
              <a
                href={ROBOTS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#93b4ff] hover:underline font-mono mt-1 inline-block"
              >
                {ROBOTS_LINK}
              </a>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => copyToClipboard(ROBOTS_LINK)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-[6px] text-[11px] font-medium text-slate-400 border border-[#263550] hover:border-[#3b5bdb] hover:text-white transition-all"
              >
                {copied === ROBOTS_LINK ? "✓ Copied!" : "Copy URL"}
              </button>
              <a
                href={ROBOTS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-[6px] text-[11px] font-medium text-slate-400 border border-[#263550] hover:border-emerald-500/40 hover:text-emerald-400 transition-all"
              >
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                Open
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Guide */}
      <div className="flex flex-col gap-2">
        <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500 px-1">Priority Reference</div>
        <div className="rounded-[12px] border border-[#1e2638] overflow-hidden divide-y divide-[#1a2336]">
          {PRIORITY_GUIDE.map((g) => (
            <div key={g.priority} className="flex items-center gap-4 p-3.5 hover:bg-[#0f1624] transition-colors">
              <span className={`font-mono text-sm font-bold w-8 ${g.color}`}>{g.priority}</span>
              <span className="text-sm text-slate-400">{g.page}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
