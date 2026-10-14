import { Metadata } from "next"

import { getSeoSetting } from "@lib/data/seo"
import { resolveCollectionData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import JsonLd from "@modules/common/components/json-ld"

export async function generateMetadata(): Promise<Metadata> {
  const seoSetting = await getSeoSetting("store").catch(() => null)
  const resolved = resolveCollectionData({
    section: "store",
    items: [],
    seoSetting,
  })
  return buildMetadataFromResolved(resolved)
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export default async function StorePage(props: Params) {
  const searchParams = await props.searchParams;
  const { sortBy, page } = searchParams
  const seoSetting = await getSeoSetting("store")

  return (
    <>
      <JsonLd
        type="collection"
        section="store"
        items={[]}
        seoSetting={seoSetting}
      />
      <StoreTemplate
        sortBy={sortBy}
        page={page}
        countryCode="in"
      />
    </>
  )
}

