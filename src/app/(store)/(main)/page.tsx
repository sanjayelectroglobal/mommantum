import { Metadata } from "next"
import { getSeoSetting } from "@lib/data/seo"
import { resolveHomepageData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import JsonLd from "@modules/common/components/json-ld"
import Hero from "@modules/home/components/hero"
import WhyMommantum from "@modules/home/components/why-mommantum"
import WhoWeAre from "@modules/home/components/who-we-are"
import StatsStrip from "@modules/home/components/stats-strip"
import OurServices from "@modules/home/components/our-services"
import CaseStudies from "@modules/home/components/case-studies"
import BrandMarquee from "@modules/editz/components/BrandMarquee"
import HomeFaq from "@modules/home/components/home-faq"

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const seoSetting = await getSeoSetting("homepage").catch(() => null)
  const resolved = resolveHomepageData(seoSetting)
  return buildMetadataFromResolved(resolved)
}

export default async function Home() {
  const countryCode = "in"
  const seoSetting = await getSeoSetting("homepage").catch(() => null)

  return (
    <>
      <JsonLd type="homepage" seoSetting={seoSetting} />
      <Hero />
      <BrandMarquee />
      <WhyMommantum />
      <WhoWeAre />
      <StatsStrip />
      <OurServices />
      <CaseStudies countryCode={countryCode} />
      <HomeFaq faqs={(seoSetting as any)?.faq_section} />
    </>
  )
}
