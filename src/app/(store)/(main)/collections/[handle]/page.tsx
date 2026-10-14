import { Metadata } from "next"
import { notFound } from "next/navigation"
export const dynamic = "force-dynamic";

import { buildSeoMetadata, getSeoSetting } from "@lib/data/seo"
import { getCollectionByHandle, listCollections } from "@lib/data/collections"
import { listRegions } from "@lib/data/regions"
import { StoreCollection, StoreRegion } from "@medusajs/types"
import CollectionTemplate from "@modules/collections/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import JsonLd from "@modules/common/components/json-ld"

type Props = {
  params: Promise<{ handle: string }>
  searchParams: Promise<{
    page?: string
    sortBy?: SortOptions
  }>
}

const PRODUCT_LIMIT = 12

export async function generateStaticParams() {
  try {
    const { collections } = await listCollections({
      fields: "*products",
    })

    if (!collections) {
      return []
    }

    const collectionHandles = collections.map(
      (collection: StoreCollection) => collection.handle
    )

    return collectionHandles.map((handle: string | undefined) => ({
      handle,
    }))
  } catch (err) {
    console.error("Failed to generate static paths for collections:", err)
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const collection = await getCollectionByHandle(params.handle)

  if (!collection) {
    notFound()
  }

  return buildSeoMetadata(
    [
      `collection:${params.handle}`,
      `collections:${params.handle}`,
      `collection-${params.handle}`,
      params.handle,
    ],
    {
      title: `${collection.title} | Medusa Store`,
      description: `${collection.title} collection`,
      canonicalPath: `/collections/${params.handle}`,
    }
  )
}

export default async function CollectionPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const collection = await getCollectionByHandle(params.handle).then(
    (collection: StoreCollection) => collection
  )

  if (!collection) {
    notFound()
  }

  const seoSetting = await getSeoSetting(`collection:${params.handle}`)

  return (
    <>
      <JsonLd
        type="collection"
        section="store"
        items={(collection.products || []).map((p: any) => ({
          name: p.title,
          handle: p.handle,
        }))}
        seoSetting={seoSetting}
      />
      <CollectionTemplate
        collection={collection}
        page={page}
        sortBy={sortBy}
        countryCode="in"
      />
    </>
  )
}

