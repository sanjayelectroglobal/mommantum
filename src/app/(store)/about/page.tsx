import { Metadata } from "next"
import { getSeoSetting } from "@lib/data/seo"
import { resolveAboutData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import JsonLd from "@modules/common/components/json-ld"
import AboutClient from "./_components/AboutClient"
import CaseStudies from "@modules/home/components/case-studies"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const seoSetting = await getSeoSetting("about").catch(() => null)
  const resolved = resolveAboutData(seoSetting)
  return buildMetadataFromResolved(resolved)
}

export default async function AboutPage() {
  const countryCode = "in"
  const seoSetting = await getSeoSetting("about").catch(() => null)

  return (
    <>
      <JsonLd type="about" seoSetting={seoSetting} />
      <AboutClient countryCode={countryCode}>
        <CaseStudies countryCode={countryCode} />
      </AboutClient>
    </>
  )
}
