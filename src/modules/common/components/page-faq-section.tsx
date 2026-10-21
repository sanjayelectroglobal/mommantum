"use client"

import { useState } from "react"
import { epilogue, outfit, mansalva } from "@lib/fonts"
import { PageFAQ } from "@lib/data/page-faqs"

interface PageFaqSectionProps {
  faqs: PageFAQ[]
  badge?: string
  heading?: string
  title?: string
  subheading?: string
  subtitle?: string
  className?: string
}

export default function PageFaqSection({
  faqs,
  badge = "Got Questions?",
  heading,
  title,
  subheading,
  subtitle,
  className = "",
}: PageFaqSectionProps) {
  const displayHeading = title || heading || "Frequently Asked Questions"
  const displaySubheading =
    subtitle !== undefined
      ? subtitle
      : subheading !== undefined
      ? subheading
      : "Clear answers to common questions about our services, process, and deliverables."
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!faqs || faqs.length === 0) return null

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section aria-labelledby="page-faqs-heading" className={`border-t border-slate-100 bg-[#fafbfe]/90 py-14 sm:py-18 ${className}`}>
      <div className="content-container px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[960px]">
          {/* Header */}
          <div className="mb-8 text-center sm:mb-12">
            <span className={`${mansalva.className} inline-flex items-center rounded-full bg-[#e61e73]/10 px-3.5 py-1 text-[13px] font-bold text-[#e61e73]`}>
              {badge}
            </span>
            <h2
              id="page-faqs-heading"
              className={`${epilogue.className} mt-3 text-[26px] font-extrabold tracking-[-0.03em] text-[#0e2547] sm:text-[32px] lg:text-[36px]`}
            >
              {displayHeading}
            </h2>
            {displaySubheading && (
              <p className={`${outfit.className} mx-auto mt-2.5 max-w-xl text-[14.5px] leading-relaxed text-slate-500 sm:text-[15.5px]`}>
                {displaySubheading}
              </p>
            )}
          </div>

          {/* Accordion */}
          <div className="space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index
              const answerId = `page-faq-answer-${index}`
              const buttonId = `page-faq-button-${index}`

              return (
                <div
                  key={index}
                  className={`overflow-hidden rounded-[16px] border bg-white transition-all duration-200 ${
                    isOpen
                      ? "border-[#e61e73]/40 shadow-[0_4px_16px_rgba(230,30,115,0.06)]"
                      : "border-slate-200/80 shadow-[0_2px_6px_rgba(0,0,0,0.02)] hover:border-slate-300"
                  }`}
                >
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => handleToggle(index)}
                    className="flex w-full items-center justify-between gap-4 p-4.5 text-left transition-colors sm:p-5 cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold transition-colors ${
                          isOpen
                            ? "bg-[#e61e73] text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className={`${epilogue.className} text-[15px] font-bold text-[#0e2547] transition-colors hover:text-[#e61e73] sm:text-[16px]`}>
                        {faq.question}
                      </span>
                    </div>

                    <div
                      className={`flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                        isOpen ? "rotate-180 bg-[#e61e73]/10 text-[#e61e73]" : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </button>

                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-slate-100 px-4.5 pb-5 pt-3.5 sm:px-5">
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
      </div>
    </section>
  )
}
