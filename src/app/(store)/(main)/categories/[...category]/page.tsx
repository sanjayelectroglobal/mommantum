import { Metadata } from "next"
import { notFound } from "next/navigation"

import { buildSeoMetadata, getSeoSetting } from "@lib/data/seo"
import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import JsonLd from "@modules/common/components/json-ld"

type Props = {
  params: Promise<{ category: string[] }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateStaticParams() {
  try {
    const product_categories = await listCategories()

    if (!product_categories) {
      return []
    }

    const categoryHandles = product_categories.map(
      (category: any) => category.handle
    )

    return categoryHandles.map((handle: any) => ({
      category: [handle],
    }))
  } catch (err) {
    console.error("Failed to generate static paths for categories:", err)
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  try {
    const productCategory = await getCategoryByHandle(params.category)

    const title = `${productCategory.name} | Mommantum`

    const description = productCategory.description ?? `${productCategory.name} category.`

    const categoryPath = params.category.join("/")

    return buildSeoMetadata(
      [
        `category:${categoryPath}`,
        `categories:${categoryPath}`,
        `category-${params.category.at(-1)}`,
        params.category.at(-1),
      ],
      {
        title,
        description,
        canonicalPath: `/categories/${categoryPath}`,
      }
    )
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const productCategory = await getCategoryByHandle(params.category)

  if (!productCategory) {
    notFound()
  }

  const categoryPath = params.category.join("/")
  const seoSetting = await getSeoSetting(`category:${categoryPath}`)

  return (
    <>
      <JsonLd
        type="collection"
        section="store"
        items={(productCategory.products || []).map((p: any) => ({
          name: p.title,
          handle: p.handle,
        }))}
        seoSetting={seoSetting}
      />
      <CategoryTemplate
        category={productCategory}
        sortBy={sortBy}
        page={page}
        countryCode="in"
      />
    </>
  )
}

