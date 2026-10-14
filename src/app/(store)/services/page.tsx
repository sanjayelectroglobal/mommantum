import { Metadata } from "next"
import { getServices } from "@lib/data/services"
import { getSeoSetting } from "@lib/data/seo"
import { resolveCollectionData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import JsonLd from "@modules/common/components/json-ld"
import ServicesClient from "./_components/ServicesClient"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const [services, seoSetting] = await Promise.all([
    getServices(),
    getSeoSetting("services").catch(() => null),
  ])
  const resolved = resolveCollectionData({
    section: "services",
    items: services,
    seoSetting,
  })
  return buildMetadataFromResolved(resolved)
}

export default async function ServicesPage() {
  const [services, seoSetting] = await Promise.all([
    getServices(),
    getSeoSetting("services").catch(() => null),
  ])

  return (
    <>
      <JsonLd
        type="collection"
        section="services"
        items={services}
        seoSetting={seoSetting}
      />
      <ServicesClient services={services} />
    </>
  )
}
