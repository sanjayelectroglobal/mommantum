/**
 * @file home-faqs.ts
 * @description Curated homepage frequently asked questions for Mommantum.
 * Re-exports the 8 verified homepage FAQs from page-faqs.ts.
 */

import { getPageFaqs, PageFAQ } from "./page-faqs"

export interface HomeFAQ {
  question: string
  answer: string
}

export const HOME_FAQS: HomeFAQ[] = getPageFaqs("homepage")
