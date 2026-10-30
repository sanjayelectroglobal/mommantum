/**
 * Dedicated FAQ Page Route (/faq)
 *
 * Renders the full-catalog FAQ knowledge base. SEO title / description / keywords come from
 * seo_setting (page_key "faq"); JSON-LD (WebPage + nested FAQPage + BreadcrumbList) is emitted
 * through the central JsonLd component.
 */

import { Metadata } from "next"
import FaqPageClient from "./_components/FaqPageClient"
import JsonLd from "@modules/common/components/json-ld"
import { getSeoSetting } from "@lib/data/seo"
import { ALL_FAQ_CATEGORIES } from "@lib/data/all-faqs"
import { resolveLegalPageData, buildMetadataFromResolved } from "@lib/schema/resolvers"

export const revalidate = 3600 // Cache for 1 hour

const FAQ_TITLE = "FAQs | Mommantum"
const FAQ_DESCRIPTION =
  "Answers to common questions about Mommantum's performance marketing, SEO, social media, web development and AI automation services."

// First 10 questions of the page (these are visible on /faq by default)
const FAQ_SCHEMA_ITEMS = ALL_FAQ_CATEGORIES.flatMap((c) => c.faqs)
  .slice(0, 10)
  .map((f) => ({ question: f.question, answer: f.answer }))

export async function generateMetadata(): Promise<Metadata> {
  const seoSetting = await getSeoSetting("faq").catch(() => null)
  return buildMetadataFromResolved(
    resolveLegalPageData("faq", FAQ_TITLE, FAQ_DESCRIPTION, seoSetting, FAQ_SCHEMA_ITEMS)
  )
}

export default async function FaqPage() {
  const seoSetting = await getSeoSetting("faq").catch(() => null)
  return (
    <>
      <JsonLd
        type="page"
        slug="faq"
        title={FAQ_TITLE}
        description={FAQ_DESCRIPTION}
        seoSetting={seoSetting}
        faqs={FAQ_SCHEMA_ITEMS}
      />
      <FaqPageClient />
    </>
  )
}
