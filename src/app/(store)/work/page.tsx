import { Metadata } from "next"
import { getCaseStudies, getTestimonials, teamMember } from "@lib/data/case-studies"
import { getSeoSetting } from "@lib/data/seo"
import { resolveCollectionData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import JsonLd from "@modules/common/components/json-ld"
import WorkPage from "./_components/WorkClient"

export async function generateMetadata(): Promise<Metadata> {
  const [caseStudies, seoSetting] = await Promise.all([
    getCaseStudies(),
    getSeoSetting("work").catch(() => null),
  ])
  const resolved = resolveCollectionData({
    section: "work",
    items: caseStudies,
    seoSetting,
  })
  return buildMetadataFromResolved(resolved)
}

export default async function WorkPageServer({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params

  const [caseStudies, testimonials, seoSetting] = await Promise.all([
    getCaseStudies(),
    getTestimonials(),
    getSeoSetting("work").catch(() => null),
  ])

  return (
    <>
      <JsonLd
        type="collection"
        section="work"
        items={caseStudies}
        seoSetting={seoSetting}
      />
      <WorkPage
        params={{ countryCode }}
        caseStudies={caseStudies}
        testimonials={testimonials}
        teamMember={teamMember}
      />
    </>
  )
}

