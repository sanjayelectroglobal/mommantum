import { Metadata } from "next"
import { notFound } from "next/navigation"
import { buildSeoMetadata } from "@lib/data/seo"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"
import { HttpTypes } from "@medusajs/types"
import JsonLd from "@modules/common/components/json-ld"

type Props = {
  params: Promise<{ handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

export async function generateStaticParams() {
  try {
    const { response } = await listProducts({
      countryCode: "in",
      queryParams: { limit: 100, fields: "handle" },
    })

    return response.products
      .map((product) => ({
        handle: product.handle,
      }))
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string
) {
  if (!selectedVariantId || !product.variants) {
    return product.images || []
  }

  const variant = product.variants!.find((v) => v.id === selectedVariantId)
  if (!variant?.images?.length) {
    return product.images || []
  }

  const imageIdsMap = new Map(variant.images.map((i) => [i.id, true]))
  return (product.images || []).filter((i) => imageIdsMap.has(i.id))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion("in")

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: "in",
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  return buildSeoMetadata(
    [
      `product:${product.id}`,
      `product:${handle}`,
      `products:${handle}`,
      `product-${handle}`,
      handle,
    ],
    {
      title: `${product.title} | Mommantum`,
      description: product.description || `${product.title}`,
      canonicalPath: `/products/${handle}`,
      image: product.thumbnail,
      keywords: product.tags?.map((tag) => tag.value).filter(Boolean),
    }
  )
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion("in")
  const searchParams = await props.searchParams

  const selectedVariantId = searchParams.v_id

  if (!region) {
    notFound()
  }

  const pricedProduct = await listProducts({
    countryCode: "in",
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  const images = getImagesForVariant(pricedProduct, selectedVariantId)

  if (!pricedProduct) {
    notFound()
  }

  return (
    <>
      <JsonLd
        resolved={{
          contentType: "page",
          title: pricedProduct.title,
          description: pricedProduct.description || pricedProduct.title,
          canonicalUrl: `https://www.mommantum.com/products/${params.handle}`,
          image: pricedProduct.thumbnail || undefined,
          keywords: [],
          breadcrumbs: [
            { name: "Home", url: "https://www.mommantum.com/" },
            { name: "Store", url: "https://www.mommantum.com/store" },
            {
              name: pricedProduct.title,
              url: `https://www.mommantum.com/products/${params.handle}`,
            },
          ],
        }}
      />
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode="in"
        images={images}
      />
    </>
  )
}
