/**
 * Dedicated FAQ Page Interactive Client Component
 * 
 * Purpose:
 * Renders the complete, categorized FAQ knowledge base for Mommantum.
 * Includes real-time search, category pill filtering, expand/collapse all controls,
 * and accessible accordion items for all ~60 authentic questions in the codebase.
 * 
 * Features:
 * - Live search with instant feedback and empty search fallback.
 * - Category filter chips with active count indicators.
 * - Single-click "Expand All / Collapse All" toggle for power users.
 * - Clean responsive cards matching Mommantum's brand styling (Epilogue/Outfit fonts, #0e2547, #e61e73).
 * - "Still have questions?" conversion card linking to /contact.
 */

"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Epilogue, Outfit } from "next/font/google"
import { ALL_FAQ_CATEGORIES, FAQItem } from "@lib/data/all-faqs"

// Font loaders configured for Latin subset
const epilogue = Epilogue({ subsets: ["latin"], weight: ["700", "800"] })
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500"] })

export default function FaqPageClient() {
  // Selected category filter ("all" or category id)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  
  // Real-time keyword search query
  const [searchQuery, setSearchQuery] = useState<string>("")
  
  // Set of currently expanded FAQ item IDs for flexible multi-accordion support
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["gen-1", "perf-1"]))

  // Toggle expansion state for an individual question
  const toggleItem = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Filter categories and FAQs based on active category and search keyword
  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()

    return ALL_FAQ_CATEGORIES.map(category => {
      // If a specific category is selected, skip others
      if (selectedCategory !== "all" && category.id !== selectedCategory) {
        return null
      }

      // Filter FAQs by search query against question, answer, and category name
      const matchingFaqs = category.faqs.filter(faq => {
        if (!q) return true
        return (
          faq.question.toLowerCase().includes(q) ||
          faq.answer.toLowerCase().includes(q) ||
          faq.category.toLowerCase().includes(q)
        )
      })

      if (matchingFaqs.length === 0) return null

      return {
        ...category,
        faqs: matchingFaqs,
      }
    }).filter(Boolean) as typeof ALL_FAQ_CATEGORIES
  }, [selectedCategory, searchQuery])

  // Compute total questions visible under current filter
  const totalVisibleCount = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.faqs.length, 0)
  }, [filteredCategories])

  // Total count of all FAQs across entire database
  const totalFaqsCount = useMemo(() => {
    return ALL_FAQ_CATEGORIES.reduce((acc, cat) => acc + cat.faqs.length, 0)
  }, [])

  // Toggle all visible FAQs open or closed
  const toggleAll = () => {
    if (expandedIds.size > 0) {
      setExpandedIds(new Set())
    } else {
      const allIds = new Set<string>()
      filteredCategories.forEach(cat => cat.faqs.forEach(f => allIds.add(f.id)))
      setExpandedIds(allIds)
    }
  }

  return (
    <div className="bg-[#fcfdff] pb-24 pt-12 sm:pb-32 sm:pt-16">
      <div className="content-container px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1100px]">
          
          {/* ── Page Hero Header ── */}
          <div className="mb-12 text-center sm:mb-16">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e61e73]/10 px-3.5 py-1 text-[11.5px] font-extrabold uppercase tracking-[0.08em] text-[#e61e73]">
              <span>Help & Knowledge Base</span>
            </span>

            <h1 className={`${epilogue.className} mt-3 text-[32px] font-extrabold tracking-[-0.04em] text-[#0e2547] sm:text-[44px] lg:text-[50px]`}>
              Frequently Asked Questions
            </h1>

            <p className={`${outfit.className} mx-auto mt-3.5 max-w-2xl text-[15px] leading-relaxed text-slate-500 sm:text-[16px]`}>
              Everything you need to know about Mommantum&apos;s performance marketing, SEO, Jaipur studio, and AI workflows. All authentic answers sourced directly from our client guidelines.
            </p>

            {/* ── Search Input ── */}
            <div className="mx-auto mt-8 max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search questions (e.g., Jaipur, SEO, Meta Ads, pricing)..."
                  className={`${outfit.className} w-full rounded-[14px] border border-slate-200 bg-white py-3.5 pl-12 pr-10 text-[14px] text-[#0e2547] shadow-[0_4px_16px_rgba(0,0,0,0.04)] outline-none transition-all placeholder:text-slate-400 focus:border-[#e61e73] focus:ring-2 focus:ring-[#e61e73]/20`}
                />
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Clear search"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Category Filter Pills ── */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:mb-10">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full px-4 py-2 text-[12.5px] font-bold transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-[#0e2547] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              All Topics ({totalFaqsCount})
            </button>
            {ALL_FAQ_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#e61e73] text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className={`text-[11px] ${selectedCategory === cat.id ? "text-white/80" : "text-slate-400"}`}>
                  ({cat.faqs.length})
                </span>
              </button>
            ))}
          </div>

          {/* ── Toolbar: Results summary & Expand All button ── */}
          <div className="mb-6 flex items-center justify-between border-b border-slate-200/80 pb-3.5">
            <p className={`${outfit.className} text-[13px] text-slate-500`}>
              Showing <span className="font-bold text-[#0e2547]">{totalVisibleCount}</span> questions
              {searchQuery && (
                <span> for &quot;<span className="font-semibold text-[#e61e73]">{searchQuery}</span>&quot;</span>
              )}
            </p>
            <button
              type="button"
              onClick={toggleAll}
              className={`${epilogue.className} text-[12px] font-bold text-[#0e2547] hover:text-[#e61e73] transition-colors cursor-pointer`}
            >
              {expandedIds.size > 0 ? "Collapse All" : "Expand All"}
            </button>
          </div>

          {/* ── FAQ Categorized Sections ── */}
          {filteredCategories.length === 0 ? (
            <div className="rounded-[18px] border border-slate-200 bg-white p-12 text-center shadow-xs">
              <span className="text-[32px]">🔍</span>
              <h3 className={`${epilogue.className} mt-3 text-[18px] font-extrabold text-[#0e2547]`}>
                No matching questions found
              </h3>
              <p className={`${outfit.className} mx-auto mt-2 max-w-md text-[14px] text-slate-500`}>
                We couldn&apos;t find any questions matching &quot;{searchQuery}&quot;. Try adjusting your keywords or clearing the search.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
                className={`${epilogue.className} mt-5 inline-flex items-center gap-2 rounded-[10px] bg-[#0e2547] px-5 py-2.5 text-[12px] font-bold text-white hover:bg-[#e61e73] transition-all`}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-10 sm:space-y-12">
              {filteredCategories.map(cat => (
                <div key={cat.id} className="scroll-mt-24">
                  {/* Category Header */}
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#f0f3f8] text-[18px]">
                      {cat.icon}
                    </span>
                    <div>
                      <h2 className={`${epilogue.className} text-[20px] font-extrabold tracking-[-0.02em] text-[#0e2547] sm:text-[22px]`}>
                        {cat.name}
                      </h2>
                      <p className={`${outfit.className} text-[13px] text-slate-500`}>
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  {/* Category Questions List */}
                  <div className="space-y-3">
                    {cat.faqs.map((faq, index) => {
                      const isOpen = expandedIds.has(faq.id)
                      const answerId = `faq-answer-${faq.id}`
                      const buttonId = `faq-button-${faq.id}`

                      return (
                        <div
                          key={faq.id}
                          className={`overflow-hidden rounded-[16px] border bg-white transition-all duration-200 ${
                            isOpen
                              ? "border-[#e61e73]/50 shadow-[0_6px_20px_rgba(230,30,115,0.06)]"
                              : "border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-slate-300"
                          }`}
                        >
                          <button
                            id={buttonId}
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={answerId}
                            onClick={() => toggleItem(faq.id)}
                            className="flex w-full items-center justify-between gap-4 p-4 sm:p-5 text-left transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-3.5">
                              {/* Number Badge */}
                              <span
                                className={`flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold transition-colors ${
                                  isOpen
                                    ? "bg-[#e61e73] text-white"
                                    : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                                }`}
                              >
                                {String(index + 1).padStart(2, "0")}
                              </span>

                              {/* Question Heading */}
                              <h3 className={`${epilogue.className} text-[15px] font-bold text-[#0e2547] transition-colors hover:text-[#e61e73] sm:text-[16px]`}>
                                {faq.question}
                              </h3>
                            </div>

                            {/* Chevron Toggle */}
                            <div
                              className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                                isOpen ? "rotate-180 bg-[#e61e73]/10 text-[#e61e73]" : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </button>

                          {/* Collapsible Answer */}
                          <div
                            id={answerId}
                            role="region"
                            aria-labelledby={buttonId}
                            className={`grid transition-all duration-300 ease-in-out ${
                              isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                            }`}
                          >
                            <div className="overflow-hidden">
                              <div className="border-t border-slate-100 px-4 pb-6 pt-4 sm:px-6">
                                <p className={`${outfit.className} pl-[42px] text-[14.5px] leading-[1.85] text-slate-600 sm:text-[15px]`}>
                                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Contact CTA Support Card ── */}
          <div className="mt-16 rounded-[20px] border border-slate-200/90 bg-gradient-to-br from-white to-[#f8f9fc] p-8 text-center shadow-sm sm:mt-20 sm:p-12">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#e61e73]/10 text-[24px]">
              💬
            </span>
            <h3 className={`${epilogue.className} mt-4 text-[22px] font-extrabold text-[#0e2547] sm:text-[26px]`}>
              Still have questions about your brand?
            </h3>
            <p className={`${outfit.className} mx-auto mt-2 max-w-lg text-[14.5px] leading-relaxed text-slate-500`}>
              We are open Monday to Saturday, 9am to 9pm in Jaipur and work with brands across India. Tell us about your goals and we will guide you on what to test first.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className={`${epilogue.className} inline-flex items-center gap-2 rounded-[10px] bg-[#e61e73] px-6 py-3 text-[12.5px] font-extrabold uppercase tracking-[0.06em] text-white transition-all hover:bg-[#ca155f] hover:shadow-md active:scale-95`}
              >
                <span>Book a Free Strategy Call</span>
                <span>→</span>
              </Link>
              <Link
                href="/services"
                className={`${epilogue.className} inline-flex items-center gap-2 rounded-[10px] border border-slate-200 bg-white px-6 py-3 text-[12.5px] font-extrabold uppercase tracking-[0.06em] text-[#0e2547] transition-all hover:border-slate-300 hover:bg-slate-50`}
              >
                <span>Explore All Services</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
