import React from "react"
import Link from "next/link"
import Image from "next/image"
import { supabaseAdmin } from "@lib/supabase-admin"
import { listRegions } from "@lib/data/regions"
import { sdk } from "@lib/config"
import { Epilogue, Outfit } from "next/font/google"

const epilogue = Epilogue({ subsets: ["latin"], weight: ["700", "800"] })
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "700"] })

interface RelatedLinksProps {
  type: "blog" | "product"
  id: string // slug for blog, or id for product
}

export default async function RelatedLinks({ type, id }: RelatedLinksProps) {
  const sourceId = `${type}:${id}`

  // 1. Fetch suggestions from link_suggestion
  const { data: suggestions, error: sugErr } = await supabaseAdmin
    .from("link_suggestion")
    .select("*")
    .eq("source_id", sourceId)
    .eq("status", "active")
    .order("score", { ascending: false })

  if (sugErr) {
    console.error(`RelatedLinks: Failed to fetch suggestions for ${sourceId}:`, sugErr.message)
    return null
  }

  if (!suggestions || suggestions.length === 0) {
    return null
  }

  // 2. Separate into products and blogs
  const productSuggestions = suggestions.filter((s) => s.target_type === "product")
  const blogSuggestions = suggestions.filter((s) => s.target_type === "blog")

  const productIds = productSuggestions.map((s) => s.target_id)
  const blogSlugs = blogSuggestions.map((s) => s.target_url.split("/").pop() || "")

  // 3. Fetch details in parallel
  let productsMap = new Map<string, any>()
  let blogsMap = new Map<string, any>()

  try {
    const promises: Promise<any>[] = []

    if (productIds.length > 0) {
      const regionsPromise = listRegions().then(async (regions) => {
        const regionId = regions?.[0]?.id
        if (!regionId) return
        const res = await sdk.client.fetch<{ products: any[] }>(`/store/products`, {
          query: { id: productIds, region_id: regionId }
        })
        if (res?.products) {
          res.products.forEach((p) => productsMap.set(p.id, p))
        }
      })
      promises.push(regionsPromise)
    }

    if (blogSlugs.length > 0) {
      const blogsPromise = Promise.resolve(
        supabaseAdmin
          .from("post")
          .select("id, slug, title, excerpt, featured_image, published_at")
          .in("slug", blogSlugs)
          .eq("status", "published")
          .is("deleted_at", null)
      ).then(({ data }) => {
        if (data) {
          data.forEach((b) => blogsMap.set(b.slug, b))
        }
      })
      promises.push(blogsPromise)
    }

    await Promise.all(promises)
  } catch (err: any) {
    console.error("RelatedLinks: Details fetch failed:", err.message)
  }

  // 4. Map back to recommendations lists
  const relatedProducts = productSuggestions
    .map((s) => {
      const p = productsMap.get(s.target_id)
      if (!p) return null
      return {
        id: p.id,
        title: p.title,
        handle: p.handle,
        thumbnail: p.thumbnail || "/images/placeholder.jpg",
        price: p.variants?.[0]?.calculated_price?.calculated_amount 
          ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(p.variants[0].calculated_price.calculated_amount)
          : null,
      }
    })
    .filter(Boolean)

  const relatedBlogs = blogSuggestions
    .map((s) => {
      const slug = s.target_url.split("/").pop() || ""
      const b = blogsMap.get(slug)
      if (!b) return null
      return {
        id: b.id,
        title: b.title,
        slug: b.slug,
        excerpt: b.excerpt,
        featured_image: b.featured_image || "/images/placeholder.jpg",
        published_at: b.published_at 
          ? new Date(b.published_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
          : null,
      }
    })
    .filter(Boolean)

  if (relatedProducts.length === 0 && relatedBlogs.length === 0) {
    return null
  }

  return (
    <section className="w-full border-t border-slate-200 bg-[#f9fafb] py-16 mt-16">
      <div className="content-container mx-auto px-4 max-w-[1320px]">
        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mb-14">
            <div className="flex flex-col mb-8">
              <span className={`${outfit.className} text-[13px] font-bold uppercase tracking-wider text-[#e61e73]`}>
                Store Recommendations
              </span>
              <h2 className={`${epilogue.className} text-[26px] sm:text-[32px] font-extrabold tracking-tight text-[#0e2547] mt-1`}>
                Related Products
              </h2>
            </div>

            {/* Mobile horizontal swipe + Desktop grid */}
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:pb-0">
              {relatedProducts.map((prod: any) => (
                <div 
                  key={prod.id} 
                  className="flex-none w-[260px] sm:w-auto snap-start bg-white rounded-2xl border border-slate-100 overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Link href={`/products/${prod.handle}`}>
                    <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden">
                      <Image
                        src={prod.thumbnail}
                        alt={prod.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 260px, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-5 flex flex-col justify-between">
                      <h3 className={`${outfit.className} text-[15px] font-semibold text-[#0e2547] group-hover:text-[#e61e73] transition-colors line-clamp-1`}>
                        {prod.title}
                      </h3>
                      {prod.price && (
                        <p className={`${outfit.className} text-[14px] font-bold text-slate-500 mt-2`}>
                          {prod.price}
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECOMMENDED READS */}
        {relatedBlogs.length > 0 && (
          <div>
            <div className="flex flex-col mb-8">
              <span className={`${outfit.className} text-[13px] font-bold uppercase tracking-wider text-[#e61e73]`}>
                Insights & Updates
              </span>
              <h2 className={`${epilogue.className} text-[26px] sm:text-[32px] font-extrabold tracking-tight text-[#0e2547] mt-1`}>
                Recommended Reads
              </h2>
            </div>

            {/* Mobile horizontal swipe + Desktop grid */}
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0">
              {relatedBlogs.map((post: any) => (
                <div 
                  key={post.id} 
                  className="flex-none w-[290px] sm:w-auto snap-start bg-white rounded-2xl border border-slate-100 overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
                >
                  <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                    <div className="relative aspect-[16/10] bg-slate-50 overflow-hidden">
                      <Image
                        src={post.featured_image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 290px, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow justify-between">
                      <div>
                        {post.published_at && (
                          <span className={`${outfit.className} text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-2`}>
                            {post.published_at}
                          </span>
                        )}
                        <h3 className={`${epilogue.className} text-[18px] leading-snug font-extrabold text-[#0e2547] group-hover:text-[#e61e73] transition-colors line-clamp-2`}>
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className={`${outfit.className} text-[13px] text-slate-500 leading-relaxed mt-3 line-clamp-2`}>
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                      <div className="mt-5 pt-4 border-t border-slate-50 flex items-center text-[13px] font-bold text-[#e61e73]">
                        Read Article
                        <svg 
                          className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
