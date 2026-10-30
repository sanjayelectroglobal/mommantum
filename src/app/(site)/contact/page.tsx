import { Metadata } from "next"
import { getSeoSetting } from "@lib/data/seo"
import { resolveContactData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import JsonLd from "@modules/common/components/json-ld"
import { getPageFaqs } from "@lib/data/page-faqs"
import PageFaqSection from "@modules/common/components/page-faq-section"
import ContactClient from "./_components/ContactClient"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const seoSetting = await getSeoSetting("contact").catch(() => null)
  const resolved = resolveContactData(seoSetting)
  return buildMetadataFromResolved(resolved)
}

export default async function ContactPage() {
  const seoSetting = await getSeoSetting("contact").catch(() => null)
  const faqs = getPageFaqs("contact")

  return (
    <>
      <JsonLd type="contact" seoSetting={seoSetting} />
      <ContactClient />
      {faqs && faqs.length > 0 && (
        <PageFaqSection
          faqs={faqs}
          title="Contact & Consultation FAQs"
          subtitle="Everything you need to know about scheduling a consultation, project timelines, and communication."
        />
      )}
    </>
  )
}
