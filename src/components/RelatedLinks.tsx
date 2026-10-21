// Phase 4: Removed store product recommendations, listRegions, and Medusa sdk imports.
// Kept blog post related links and recommended reads intact.
import React from "react"
import Link from "next/link"
import Image from "next/image"
import { supabaseAdmin } from "@lib/supabase-admin"
import { epilogue, outfit } from "@lib/fonts"

interface RelatedLinksProps {
  type: "blog"
  id: string // slug for blog
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

  // 2. Filter blog suggestions
  const blogSuggestions = suggestions.filter((s) => s.target_type === "blog")
  const blogSlugs = blogSuggestions.map((s) => s.target_url.split("/").pop() || "")

  if (blogSlugs.length === 0) {
    return null
  }

  // 3. Fetch blog details
  const blogsMap = new Map<string, any>()
  try {
    const { data } = await supabaseAdmin
      .from("post")
      .select("id, slug, title, excerpt, featured_image, published_at")
      .in("slug", blogSlugs)
      .eq("status", "published")
      .is("deleted_at", null)

    if (data) {
      data.forEach((b) => blogsMap.set(b.slug, b))
    }
  } catch (err: any) {
    console.error("RelatedLinks: Details fetch failed:", err.message)
  }

  // 4. Map back to recommendations list
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
          ? new Date(b.published_at).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : null,
      }
    })
    .filter(Boolean)

  if (relatedBlogs.length === 0) {
    return null
  }

  return (
    <section className="w-full border-t border-slate-200 bg-[#f9fafb] py-16 mt-16">
      <div className="content-container mx-auto px-4 max-w-[1320px]">
        {/* RECOMMENDED READS */}
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
      </div>
    </section>
  )
}
