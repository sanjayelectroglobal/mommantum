import { getEntityId } from "../config"
import { devWarn } from "../validate"

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQTemplateOptions {
  pageUrl: string
  faqs: FAQItem[]
}

/**
 * Creates FAQPage schema.
 * Emits ONLY when there is at least 1 valid Q&A item.
 * Warns in dev mode if service FAQ answers are outside 40-60 words.
 */
export function createFAQSchema(options: FAQTemplateOptions): Record<string, any> | null {
  const { pageUrl, faqs } = options
  if (!faqs || !Array.isArray(faqs) || faqs.length === 0) {
    return null
  }

  const validFaqs = faqs.filter(
    (f) => f && typeof f.question === "string" && f.question.trim() && typeof f.answer === "string" && f.answer.trim()
  )

  if (validFaqs.length === 0) {
    return null
  }

  // Soft word count check for quality
  validFaqs.forEach((f, idx) => {
    const wordCount = f.answer.trim().split(/\s+/).length
    if (wordCount < 30 || wordCount > 70) {
      devWarn(`FAQ index ${idx} ("${f.question.slice(0, 30)}...") has answer length of ${wordCount} words (recommendation: 40-60 words).`)
    }
  })

  const faqId = getEntityId(pageUrl, "#faq")

  return {
    "@type": "FAQPage",
    "@id": faqId,
    mainEntity: validFaqs.map((f) => ({
      "@type": "Question",
      name: f.question.trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer.trim(),
      },
    })),
  }
}
