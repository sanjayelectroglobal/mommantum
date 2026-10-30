"use client"

import { useState } from "react"

type FAQ = { question: string; answer: string }

export default function BlogFaqAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number>(0)

  if (!faqs || faqs.length === 0) return null

  return (
    <div style={{ margin: "40px 0" }}>
      {/* Title */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        fontSize: "26px", fontWeight: 800, color: "#0e2547",
        letterSpacing: "-0.04em", marginBottom: "20px",
      }}>
        Frequently Asked Questions
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          padding: "3px 12px", borderRadius: "999px",
          background: "linear-gradient(135deg, #e61e73, #9333ea)",
          color: "white", fontSize: "12px", fontWeight: 700,
          letterSpacing: "0.04em", textTransform: "uppercase",
        }}>
          FAQ
        </span>
      </div>

      {/* Accordion */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx
          return (
            <div
              key={idx}
              style={{
                border: isOpen ? "1.5px solid #e61e73" : "1.5px solid #e2e8f0",
                borderRadius: "16px",
                background: "white",
                overflow: "hidden",
                boxShadow: isOpen
                  ? "0 6px 24px rgba(230,30,115,0.1)"
                  : "0 2px 8px rgba(14,37,71,0.04)",
                transition: "box-shadow 0.3s ease, border-color 0.3s ease",
              }}
            >
              {/* Question button */}
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                style={{
                  width: "100%", display: "flex", alignItems: "center",
                  justifyContent: "space-between", gap: "16px",
                  padding: "18px 22px", cursor: "pointer",
                  background: "none", border: "none", textAlign: "left",
                  fontSize: "16px", fontWeight: 700,
                  color: isOpen ? "#e61e73" : "#0e2547",
                  lineHeight: 1.4, transition: "color 0.2s ease",
                }}
              >
                <span>{faq.question}</span>
                {/* +/× icon */}
                <span style={{
                  flexShrink: 0, width: "28px", height: "28px",
                  borderRadius: "8px", display: "flex", alignItems: "center",
                  justifyContent: "center",
                  background: isOpen
                    ? "linear-gradient(135deg, #e61e73, #9333ea)"
                    : "#f1f5f9",
                  transition: "background 0.3s ease, transform 0.3s ease",
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                }}>
                  <svg viewBox="0 0 24 24" fill="none" width="14" height="14"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    stroke={isOpen ? "white" : "#64748b"}
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
              </button>

              {/* Answer */}
              <div style={{
                maxHeight: isOpen ? "1200px" : "0",
                overflow: "hidden",
                transition: "max-height 0.35s ease",
                padding: isOpen ? "0 22px 20px" : "0 22px",
              }}>
                <div style={{
                  fontSize: "15px", lineHeight: 1.85, color: "#475569",
                  borderTop: "1px solid #f1f5f9", paddingTop: "16px",
                }}>
                  {faq.answer}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
