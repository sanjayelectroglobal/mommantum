import { getCaseStudies } from "@lib/data/case-studies"
import CaseStudiesClient from "./CaseStudiesClient"

export default async function CaseStudies({ countryCode }: { countryCode: string }) {
  // Fetch only first 3 for homepage
  const allStudies = await getCaseStudies()
  const studies = allStudies.slice(0, 3)

  return <CaseStudiesClient countryCode={countryCode} caseStudies={studies} />
}