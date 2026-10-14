"use client"

import { useState } from "react"
import { Epilogue, Outfit } from "next/font/google"

const epilogue = Epilogue({ subsets: ["latin"], weight: ["700", "800"] })
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500"] })

type FAQ = { question: string; answer: string }

export default function FaqAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i
        return (
          <div
            key={i}
            className="overflow-hidden rounded-[16px] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all duration-200"
            style={{
              border: isOpen ? "1.5px solid #e61e73" : "1.5px solid transparent",
            }}
          >
            {/* Question — clickable */}
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Number badge */}
                <div
                  className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white"
                  style={{
                    background: isOpen
                      ? "linear-gradient(135deg, #e61e73, #9333ea)"
                      : "#e8ecf0",
                    color: isOpen ? "white" : "#94a3b8",
                    transition: "all 0.2s ease",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3
                  className={`${epilogue.className} text-[15px] font-extrabold leading-[1.3] text-[#0e2547]`}
                >
                  {faq.question}
                </h3>
              </div>

              {/* Chevron */}
              <div
                className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full transition-all duration-200"
                style={{
                  background: isOpen ? "#fff0f6" : "#f6f7f8",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 5L7 9L11 5"
                    stroke={isOpen ? "#e61e73" : "#94a3b8"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>

            {/* Answer — animated */}
            <div
              style={{
                maxHeight: isOpen ? "400px" : "0px",
                overflow: "hidden",
                transition: "max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div className="border-t border-slate-100 px-6 pb-5 pt-4">
                <p
                  className={`${outfit.className} text-[14px] leading-[1.9]text-slate-600`}
                  style={{ paddingLeft: "44px" }}
                >
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}