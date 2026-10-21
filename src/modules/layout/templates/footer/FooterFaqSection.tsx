/**
 * Footer FAQ Section Component
 * 
 * Purpose:
 * Renders a clean, compact FAQ accordion section directly within the website's footer area.
 * Displays 4 curated, universally relevant questions and answers about Mommantum (services,
 * office location, remote capability, and studio overview).
 * 
 * Key Features:
 * - Single-item expandable accordion (clicking question opens answer; clicking again closes it).
 * - Fully accessible keyboard navigation and ARIA attributes (aria-expanded, aria-controls).
 * - "View All FAQs" CTA button that navigates directly to the dedicated `/faq` page.
 * - Responsive layout adapted for mobile and desktop screens.
 * - Styled consistently with Mommantum's brand identity (Epilogue headings, Outfit body text, #0e2547 navy, #e61e73 accent).
 */

"use client"

import { useState } from "react"
import Link from "next/link"
import { epilogue, outfit } from "@lib/fonts"
import { getPageFaqs } from "@lib/data/page-faqs"

export default function FooterFaqSection({ customFaqs }: { customFaqs?: Array<{ question: string; answer: string; id?: string }> }) {
  // Track currently active FAQ index (null = all collapsed)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // Use provided FAQs or default to all 8 curated homepage FAQs (visible count = schema count)
  const faqs = customFaqs && customFaqs.length > 0 ? customFaqs : getPageFaqs("homepage")

  // Toggle open state for a given question index
  const handleToggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index))
  }

  return (
    <div className="border-b border-slate-100 bg-[#fafbfe]/80 py-12 sm:py-16">
      <div className="content-container px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[960px]">
          
          {/* ── Section Header ── */}
          <div className="mb-8 text-center sm:mb-10">
            <span className="inline-flex items-center rounded-full bg-[#e61e73]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#e61e73]">
              Got Questions?
            </span>
            <h2 className={`${epilogue.className} mt-3 text-[24px] font-extrabold tracking-[-0.03em] text-[#0e2547] sm:text-[30px] lg:text-[34px]`}>
              Frequently Asked Questions
            </h2>
            <p className={`${outfit.className} mx-auto mt-2 max-w-xl text-[14px] leading-relaxed text-slate-500 sm:text-[15px]`}>
              Quick answers about Mommantum, our performance marketing and AI services, and working with our Jaipur studio.
            </p>
          </div>

          {/* ── Accordion List (3–4 FAQs) ── */}
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index
              const answerId = `footer-faq-answer-${faq.id || index}`
              const buttonId = `footer-faq-button-${faq.id || index}`

              return (
                <div
                  key={faq.id || index}
                  className={`overflow-hidden rounded-[14px] border bg-white transition-all duration-200 ${
                    isOpen
                      ? "border-[#e61e73]/40 shadow-[0_4px_16px_rgba(230,30,115,0.06)]"
                      : "border-slate-200/80 shadow-[0_2px_6px_rgba(0,0,0,0.02)] hover:border-slate-300"
                  }`}
                >
                  {/* Accordion Trigger Button */}
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => handleToggle(index)}
                    className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors sm:p-5 cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Numeric Badge */}
                      <span
                        className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold transition-colors ${
                          isOpen
                            ? "bg-[#e61e73] text-white"
                            : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* Question Text */}
                      <span className={`${epilogue.className} text-[15px] font-bold text-[#0e2547] transition-colors hover:text-[#e61e73] sm:text-[16px]`}>
                        {faq.question}
                      </span>
                    </div>

                    {/* Expand/Collapse Chevron Indicator */}
                    <div
                      className={`flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                        isOpen ? "rotate-180 bg-[#e61e73]/10 text-[#e61e73]" : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </button>

                  {/* Accordion Answer Content */}
                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-slate-100 px-4 pb-5 pt-3.5 sm:px-5">
                        <p className={`${outfit.className} pl-[38px] text-[14px] leading-[1.8] text-slate-600 sm:text-[14.5px]`}>
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── View All FAQs Button ── */}
          <div className="mt-8 text-center sm:mt-10">
            <Link
              href="/faq"
              className={`${epilogue.className} inline-flex items-center gap-2 rounded-[10px] bg-[#0e2547] px-6 py-3 text-[12.5px] font-extrabold uppercase tracking-[0.06em] text-white transition-all duration-200 hover:bg-[#e61e73] hover:shadow-md active:scale-95`}
            >
              <span>View All FAQs</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 7H11.5M11.5 7L7.5 3M11.5 7L7.5 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
