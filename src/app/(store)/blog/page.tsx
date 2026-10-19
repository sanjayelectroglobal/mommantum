import Image from "next/image"
import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import JsonLd from "@modules/common/components/json-ld"
import { getBlogPosts } from "@lib/data/blog-posts"
import { getSeoSetting } from "@lib/data/seo"
import { resolveCollectionData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import { epilogue, outfit, mansalva } from "@lib/fonts"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const [blogPosts, seoSetting] = await Promise.all([
    getBlogPosts(),
    getSeoSetting("blog").catch(() => null),
  ])
  const resolved = resolveCollectionData({
    section: "blog",
    items: blogPosts,
    seoSetting,
  })
  return buildMetadataFromResolved(resolved)
}

export default async function BlogPage() {
  const [blogPosts, seoSetting] = await Promise.all([
    getBlogPosts(),
    getSeoSetting("blog").catch(() => null),
  ])

  const [featured, ...rest] = blogPosts

  if (!featured) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f3f4f6]">
        <div className="text-center">
          <p className="text-slate-400 text-lg">No blog posts yet.</p>
          <p className="text-slate-300 text-sm mt-2">
            Backend: {process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "NOT SET"}
          </p>
        </div>
      </main>
    )
  }

  const popular = blogPosts.slice(0, 5)

  function formatDate(dateStr: string | null | undefined) {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <main className="relative overflow-hidden bg-[#f3f4f6] pt-14 pb-18 lg:pt-18 lg:pb-22">
      <JsonLd
        type="collection"
        section="blog"
        items={blogPosts}
        seoSetting={seoSetting}
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[5%] top-[8%] h-[130px] w-[400px] rounded-full bg-white/45 blur-3xl" />
        <div className="absolute right-[6%] top-[10%] h-[140px] w-[340px] rounded-full bg-white/40 blur-3xl" />
      </div>

      <div className="content-container relative px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1320px]">

          <div className="max-w-[680px]">
            <p className={`${mansalva.className} mb-2 text-[18px] text-[#e61e73] sm:mb-3 sm:text-[22px]`}>
              Blog
            </p>
            <h1 className={`${epilogue.className} text-[32px] font-extrabold leading-[0.95] tracking-[-0.06em] text-[#0e2547] sm:text-[42px] lg:text-[62px]`}>
              <span className="relative inline-block">
                News & stuff
                <span className="absolute bottom-[5px] left-0 -z-10 h-[10px] w-[58%] bg-[#ef6a99] sm:bottom-[6px] sm:h-[13px]" />
              </span>
            </h1>
            <p className={`${outfit.className} mt-4 max-w-[560px] text-[15px] leading-7 text-slate-600 sm:mt-5 sm:text-[16px] sm:leading-8`}>
              We write about what we see working, what is not working, and how brands can grow without wasting time and money on the wrong things. If you run a D2C brand or an ecommerce business and want to get better at performance marketing, branding, content, or just marketing in general, this is the right place.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-[1fr_340px] lg:items-start lg:gap-10">

            {/* LEFT */}
            <div>
              {/* Featured */}
              <article className="group">
                <LocalizedClientLink href={`/blog/${featured.slug}`} className="block">
                  <div className="overflow-hidden rounded-[16px] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.06)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_24px_55px_rgba(0,0,0,0.1)] lg:rounded-[18px] lg:shadow-[0_18px_45px_rgba(0,0,0,0.07)] lg:group-hover:shadow-[0_26px_60px_rgba(0,0,0,0.11)]">
                    <div className="relative aspect-[16/9] w-full">
                      {featured.featured_image ? (
                        <Image
                          src={featured.featured_image}
                          alt={featured.title}
                          fill
                          priority
                          fetchPriority="high"
                          sizes="(max-width: 1024px) 100vw, 820px"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-[#0e2547] to-[#e61e73]" />
                      )}
                      <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
                        {featured.category_id && (
                          <span className={`${mansalva.className} rounded-full bg-[#e61e73] px-3 py-1 text-[13px] text-white sm:px-4 sm:py-1.5 sm:text-[14px]`}>
                            {featured.category_id}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </LocalizedClientLink>
                <div className="mt-4 sm:mt-5">
                  <p className={`${outfit.className} text-[12px] font-semibold uppercase tracking-[0.04em] text-slate-400 sm:text-[13px]`}>
                    {formatDate(featured.published_at)}
                  </p>
                  <h2 className={`${epilogue.className} mt-2 text-[24px] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#0e2547] sm:text-[28px] lg:text-[34px]`}>
                    <LocalizedClientLink
                      href={`/blog/${featured.slug}`}
                      className="hover:text-[#e61e73] transition-colors"
                    >
                      {featured.title}
                    </LocalizedClientLink>
                  </h2>
                  <p className={`${outfit.className} mt-2.5 text-[14px] leading-[1.7] text-slate-600 sm:mt-3 sm:text-[15px] sm:leading-[1.85]`}>
                    {featured.excerpt}
                  </p>
                  <LocalizedClientLink
                    href={`/blog/${featured.slug}`}
                    className={`${epilogue.className} mt-3.5 inline-flex items-center text-[12px] font-extrabold uppercase tracking-[0.04em] text-[#0e2547] hover:text-[#e61e73] transition-colors sm:mt-4 sm:text-[13px]`}
                  >
                    Read Article <span className="ml-1.5 text-[15px] sm:text-[16px]">›</span>
                  </LocalizedClientLink>
                </div>
              </article>

              {rest.length > 0 && (
                <div className="my-8 border-t border-slate-200 lg:my-10" />
              )}

              {/* Rest list */}
              <div className="space-y-6 sm:space-y-8">
                {rest.map((post) => (
                  <article key={post.slug} className="group flex gap-4 sm:gap-5">
                    <LocalizedClientLink href={`/blog/${post.slug}`} className="shrink-0">
                      <div className="overflow-hidden rounded-[12px] shadow-[0_6px_20px_rgba(0,0,0,0.06)] sm:rounded-[14px] sm:shadow-[0_8px_24px_rgba(0,0,0,0.07)]">
                        <div className="relative h-[90px] w-[130px] sm:h-[110px] sm:w-[160px]">
                          {post.featured_image ? (
                            <Image
                              src={post.featured_image}
                              alt={post.title}
                              fill
                              sizes="(max-width: 640px) 130px, 160px"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-[#0e2547] to-[#e61e73]" />
                          )}
                        </div>
                      </div>
                    </LocalizedClientLink>
                    <div className="flex flex-col justify-center min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3">
                        {post.category_id && (
                          <p className={`${mansalva.className} text-[14px] text-[#e61e73] sm:text-[15px]`}>
                            {post.category_id}
                          </p>
                        )}
                        {post.category_id && post.published_at && (
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                        )}
                        <p className={`${outfit.className} text-[11px] font-semibold uppercase tracking-[0.04em] text-slate-400 sm:text-[12px]`}>
                          {formatDate(post.published_at)}
                        </p>
                      </div>
                      <h3 className={`${epilogue.className} mt-1 text-[16px] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#0e2547] sm:mt-1.5 sm:text-[18px] lg:text-[20px]`}>
                        <LocalizedClientLink
                          href={`/blog/${post.slug}`}
                          className="hover:text-[#e61e73] transition-colors"
                        >
                          {post.title}
                        </LocalizedClientLink>
                      </h3>
                      <p className={`${outfit.className} mt-1 line-clamp-2 text-[13px] leading-[1.6] text-slate-600 sm:mt-1.5 sm:text-[14px] sm:leading-[1.7]`}>
                        {post.excerpt}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6 lg:sticky lg:top-[100px] lg:space-y-7">

              <div className="rounded-[18px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:rounded-[20px] sm:p-6 sm:shadow-[0_12px_35px_rgba(0,0,0,0.05)]">
                <h3 className={`${epilogue.className} mb-4 text-[17px] font-extrabold tracking-[-0.03em] text-[#0e2547] sm:mb-5 sm:text-[18px]`}>
                  Popular articles
                </h3>
                <div className="space-y-4 sm:space-y-5">
                  {popular.map((post, i) => (
                    <div key={post.slug} className="flex gap-2.5 sm:gap-3">
                      <span className={`${epilogue.className} mt-0.5 shrink-0 text-[12px] font-extrabold text-[#99dcf8] sm:text-[13px]`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <LocalizedClientLink href={`/blog/${post.slug}`}>
                          <h4 className={`${epilogue.className} text-[13px] font-extrabold leading-[1.3] tracking-[-0.02em] text-[#0e2547] hover:text-[#e61e73] transition-colors sm:text-[14px]`}>
                            {post.title}
                          </h4>
                        </LocalizedClientLink>
                        <p className={`${outfit.className} mt-0.5 text-[11px] text-slate-400 sm:mt-1 sm:text-[12px]`}>
                          {formatDate(post.published_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[18px] bg-[#0e2547] p-5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:rounded-[20px] sm:p-6 sm:shadow-[0_12px_35px_rgba(0,0,0,0.1)]">
                <p className={`${mansalva.className} text-[15px] text-[#ef6a99] sm:text-[16px]`}>
                  Want to work with us?
                </p>
                <h3 className={`${epilogue.className} mt-2 text-[20px] font-extrabold tracking-[-0.04em] sm:text-[22px]`}>
                  Let's build your growth system
                </h3>
                <p className={`${outfit.className} mt-2.5 text-[12px] leading-6 text-white/80 sm:mt-3 sm:text-[13px]`}>
                  Strategy, creative, and performance — all aligned.
                </p>
                <LocalizedClientLink
                  href="/contact"
                  className={`${epilogue.className} mt-4 inline-flex h-[44px] items-center justify-center rounded-[11px] bg-[#e61e73] px-5 text-[12px] font-extrabold uppercase tracking-[0.03em] text-white transition-all hover:bg-[#ca155f] sm:mt-5 sm:h-[46px] sm:rounded-[12px] sm:px-6 sm:text-[13px]`}
                >
                  Let's Talk ›
                </LocalizedClientLink>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
