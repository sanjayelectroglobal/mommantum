import Image from "next/image"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import JsonLd from "@modules/common/components/json-ld"
import { getBlogPost, getBlogPosts } from "@lib/data/blog-posts"
import { getSeoSetting } from "@lib/data/seo"
import { resolveBlogData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import { Epilogue, Outfit, Mansalva } from "next/font/google"
import BlogFaqAccordion from "./_components/BlogFaqAccordion"
import { supabaseAdmin } from "@lib/supabase-admin"
import { injectInternalLinks } from "@lib/util/linker"
import RelatedLinks from "../../../../components/RelatedLinks"

const epilogue = Epilogue({ subsets: ["latin"], weight: ["700", "800"] })
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "700"] })
const mansalva = Mansalva({ subsets: ["latin"], weight: ["400"] })

export const dynamicParams = true
export const revalidate = 60

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function escHtml(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

// Strip all HTML tags and decode entities — returns plain text
function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim()
}

// Extract first href from an HTML string
function extractHref(html: string): string | null {
  const m = html.match(/href="([^"]*)"/)
  return m ? m[1] : null
}

// ── Parse <li> items from a flat list HTML string ────────────────────────────
// Uses a simple character-level parser to handle nested tags correctly
function parseLiItems(listHtml: string): { innerHtml: string }[] {
  const items: { innerHtml: string }[] = []
  let i = 0
  const len = listHtml.length

  while (i < len) {
    // Find opening <li
    const start = listHtml.indexOf("<li", i)
    if (start === -1) break

    // Find end of opening tag >
    const openEnd = listHtml.indexOf(">", start)
    if (openEnd === -1) break

    // Now find the matching </li> — track nesting
    let depth = 1
    let j = openEnd + 1

    while (j < len && depth > 0) {
      if (listHtml.startsWith("<li", j)) {
        depth++
        j += 3
      } else if (listHtml.startsWith("</li>", j)) {
        depth--
        if (depth === 0) break
        j += 5
      } else {
        j++
      }
    }

    const innerHtml = listHtml.slice(openEnd + 1, j)
    items.push({ innerHtml })
    i = j + 5 // skip past </li>
  }

  return items
}

// ── Extract the first nested list (<ol> or <ul>) from an HTML string ─────────
// Returns the nested list HTML and the content before it (the main item text)
function extractNestedList(html: string): { listHtml: string; beforeHtml: string } | null {
  const match = html.match(/<(ol|ul)[^>]*>/)
  if (!match || match.index === undefined) return null

  const tag = match[1]
  const openTag = `<${tag}`
  const closeTag = `</${tag}>`
  const start = match.index

  let depth = 1
  let i = start + match[0].length

  while (i < html.length && depth > 0) {
    if (html.startsWith(openTag, i)) {
      depth++
      i += openTag.length
    } else if (html.startsWith(closeTag, i)) {
      depth--
      if (depth === 0) break
      i += closeTag.length
    } else {
      i++
    }
  }

  return {
    beforeHtml: html.slice(0, start),
    listHtml: html.slice(start, i + closeTag.length),
  }
}

function buildTocHtml(listHtml: string): string {
  const liItems = parseLiItems(listHtml)
  if (!liItems.length) return listHtml

  type SubItem = { prefix: string; label: string; href: string | null }
  type Group   = { num: number; text: string; href: string | null; subs: SubItem[] }

  const groups: Group[] = []
  let mainCounter = 0

  for (const { innerHtml } of liItems) {
    // Check if this <li> contains a nested list (sub-items as children)
    const nested = extractNestedList(innerHtml)

    if (nested) {
      // The text/anchor before the nested list = the main item label
      const mainText = stripTags(nested.beforeHtml).trim()
      const mainHref = extractHref(nested.beforeHtml)
      mainCounter++
      const clean = mainText.replace(/^\d+\.?\s+/, "").trim() || mainText

      // Parse sub-items from the nested list
      const subLiItems = parseLiItems(nested.listHtml)
      const subs: SubItem[] = subLiItems.map((sub, idx) => {
        const rawText = stripTags(sub.innerHtml)
        const href = extractHref(sub.innerHtml)
        const prefixMatch = rawText.match(/^(\d+(?:\.\d+|[a-zA-Z]))[.)]?\s*/)
        const prefix = prefixMatch ? prefixMatch[1] : `${mainCounter}${String.fromCharCode(97 + idx)}`
        const label = rawText.replace(/^(\d+(?:\.\d+|[a-zA-Z]))[.)]?\s*/, "").trim()
        return { prefix, label, href }
      })

      groups.push({ num: mainCounter, text: clean, href: mainHref, subs })
    } else {
      // Flat structure — fall back to text-pattern matching on "1.1" prefixes
      const rawText = stripTags(innerHtml)
      const href = extractHref(innerHtml)
      const SUB_RE = /^(\d+(?:\.\d+|[a-zA-Z]))[.)]?\s*/

      if (SUB_RE.test(rawText)) {
        const m = rawText.match(SUB_RE)!
        const prefix = m[1]
        const label  = rawText.replace(SUB_RE, "").trim()
        if (groups.length) {
          groups[groups.length - 1].subs.push({ prefix, label, href })
        }
      } else {
        mainCounter++
        const clean = rawText.replace(/^\d+\.?\s+/, "").trim() || rawText
        groups.push({ num: mainCounter, text: clean, href, subs: [] })
      }
    }
  }

  if (!groups.length) return listHtml

  const rows = groups.map((g) => {
    const mainHref = g.href ? ` href="${g.href}"` : ""
    const mainTag  = g.href ? "a" : "div"

    const mainRow = `
      <${mainTag}${mainHref} class="blog-toc-main">
        <span class="blog-toc-number">${g.num}</span>
        <span class="blog-toc-label">${escHtml(g.text)}</span>
      </${mainTag}>`

    const subRows = g.subs.map((s) => {
      const subHref = s.href ? ` href="${s.href}"` : ""
      const subTag  = s.href ? "a" : "div"
      return `
        <${subTag}${subHref} class="blog-toc-sub">
          <span class="blog-toc-sub-prefix">${escHtml(s.prefix)}</span>
          <span class="blog-toc-sub-label">${escHtml(s.label)}</span>
        </${subTag}>`
    }).join("")

    const subBlock = g.subs.length
      ? `<div class="blog-toc-sublist">${subRows}</div>`
      : ""

    return `
<div class="blog-toc-group">
  ${mainRow}
  ${subBlock}
</div>`
  }).join("")

  return `
<nav class="blog-toc" aria-label="Table of contents">
  <p class="blog-toc-title">Table of Contents</p>
  <div class="blog-toc-list">${rows}</div>
</nav>`
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT TRANSFORMER
// ─────────────────────────────────────────────────────────────────────────────

function transformContent(html: string): string {
  if (!html) return html

  // 1. Strip [Featured Image ...] placeholders
  html = html.replace(/\[Featured Image[^\]]*\]/gi, "")

  // 2. Strip author byline paragraphs containing ·
  html = html.replace(/<p[^>]*>[^<]*·[^<]*<\/p>/gi, "")

  // 3. Strip date · min read paragraphs
  html = html.replace(
    /<p[^>]*>(?:(?!<\/p>).)*?(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}(?:(?!<\/p>).)*?min read(?:(?!<\/p>).)*?<\/p>/gi,
    ""
  )

  // 4. N8N FAQ sections are kept as-is (source of truth).
  //    Key Takeaways and Checklist background/color overrides are handled via CSS below.

  // 5. Rewrite Table of Contents
  // Find "table of contents" or "contents" h2 + immediately following ol/ul
  let result = ""
  let lastIndex = 0

  const tempRegex = /<h2[^>]*>(?:(?!<\/h2>).)*?(?:table of contents|contents)(?:(?!<\/h2>).)*?<\/h2>/gi
  let tocMatch: RegExpExecArray | null

  while ((tocMatch = tempRegex.exec(html)) !== null) {
    const h2End = tocMatch.index + tocMatch[0].length

    // Find the opening tag of the list right after h2 (skip whitespace)
    const afterH2 = html.slice(h2End).trimStart()
    const listTagMatch = afterH2.match(/^(<(?:ol|ul)[^>]*>)/)
    if (!listTagMatch) continue

    const listTagOffset = h2End + (html.slice(h2End).length - afterH2.length)
    const listTag = listTagMatch[1]
    const isOl = listTag.startsWith("<ol")
    const closeTag = isOl ? "</ol>" : "</ul>"
    const openTag  = isOl ? "<ol" : "<ul"

    // Find matching close tag with depth tracking
    let depth = 1
    let i = listTagOffset + listTag.length

    while (i < html.length && depth > 0) {
      if (html.startsWith(openTag, i)) {
        depth++
        i += openTag.length
      } else if (html.startsWith(closeTag, i)) {
        depth--
        if (depth === 0) break
        i += closeTag.length
      } else {
        i++
      }
    }

    const listEnd = i + closeTag.length
    const listHtml = html.slice(listTagOffset, listEnd)

    // Replace the h2 + list with transformed TOC
    result += html.slice(lastIndex, tocMatch.index)
    result += buildTocHtml(listHtml)
    lastIndex = listEnd
  }

  result += html.slice(lastIndex)
  return result
}

// ─────────────────────────────────────────────────────────────────────────────
// METADATA + STATIC PARAMS
// ─────────────────────────────────────────────────────────────────────────────

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const params = await props.params
  const [post, seoSetting] = await Promise.all([
    getBlogPost(params.slug),
    getSeoSetting(`blog:${params.slug}`).catch(() => null),
  ])
  if (!post) return {}

  const resolved = resolveBlogData(post, seoSetting)
  return buildMetadataFromResolved(resolved)
}

export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts()
    return posts.slice(0, 10).map((post) => ({ slug: post.slug }))
  } catch {
    return []
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default async function BlogDetailPage(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params

  let post
  try {
    post = await getBlogPost(params.slug)
  } catch (err) {
    console.error("BlogDetailPage fetch error:", err)
    return notFound()
  }

  if (!post) return notFound()

  const seoKeys = [
    `blog:${params.slug}`,
    `blog-post:${params.slug}`,
    `post:${params.slug}`,
    `blog-${params.slug}`,
    params.slug,
  ]

  let popularPosts: Awaited<ReturnType<typeof getBlogPosts>> = []
  let seoSetting = null
  let keywords: any[] = []
  try {
    const [posts, seo, kwRes] = await Promise.all([
      getBlogPosts(),
      getSeoSetting(`blog:${params.slug}`),
      supabaseAdmin.from("site_keywords").select("*"),
    ])
    popularPosts = posts.filter((item) => item.slug !== params.slug).slice(0, 5)
    seoSetting = seo
    keywords = kwRes.data || []
  } catch (err) {
    console.error("Error fetching dependencies for blog detail page:", err)
    popularPosts = []
  }

  function formatDate(dateStr: string | null | undefined) {
    if (!dateStr) return ""
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        year: "numeric", month: "long", day: "numeric",
      })
    } catch {
      return ""
    }
  }

  const validImages = post.image_urls?.filter(Boolean) || []
  
  // Apply internal linking keywords
  const linkedContent = post.content && keywords.length > 0
    ? injectInternalLinks(post.content, keywords)
    : post.content

  const processedContent = linkedContent ? transformContent(linkedContent) : null

  return (
    <main className="relative overflow-hidden bg-[#f3f4f6] pt-14 pb-20 lg:pt-18 lg:pb-24">
      <JsonLd type="blog" data={post} seoSetting={seoSetting} />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[4%] top-[5%] h-[180px] w-[500px] rounded-full bg-white/50 blur-3xl" />
        <div className="absolute right-[6%] top-[8%] h-[160px] w-[400px] rounded-full bg-white/40 blur-3xl" />
        <div className="absolute left-[20%] bottom-[10%] h-[140px] w-[460px] rounded-full bg-white/30 blur-3xl" />
      </div>

      <style>{`
        .blog-content { font-family: inherit; }
        .blog-content h2 {
          font-size: 22px; font-weight: 800; color: #0e2547;
          letter-spacing: -0.04em; margin: 32px 0 14px; line-height: 1.1;
          padding-bottom: 10px; border-bottom: 2px solid #f1f5f9;
        }
        @media (min-width: 768px) {
          .blog-content h2 { font-size: 26px; margin: 40px 0 16px; }
        }
        .blog-content h3 { font-size: 18px; font-weight: 700; color: #0e2547; margin: 24px 0 10px; line-height: 1.2; }
        @media (min-width: 768px) {
          .blog-content h3 { font-size: 20px; margin: 28px 0 10px; }
        }
        .blog-content h4 { font-size: 16px; font-weight: 700; color: #1e3a5f; margin: 18px 0 8px; }
        @media (min-width: 768px) {
          .blog-content h4 { font-size: 17px; margin: 20px 0 8px; }
        }
        .blog-content p  { font-size: 15px; line-height: 1.8; color: #475569; margin: 12px 0; }
        @media (min-width: 768px) {
          .blog-content p { font-size: 16px; line-height: 2; margin: 14px 0; }
        }
        .blog-content strong { font-weight: 700; color: #0e2547; }
        .blog-content em { font-style: italic; }
        .blog-content u  { text-decoration: underline; }
        .blog-content s  { text-decoration: line-through; color: #94a3b8; }

        .blog-content ul { list-style: none; padding: 0; margin: 16px 0; }
        @media (min-width: 768px) {
          .blog-content ul { margin: 20px 0; }
        }
        .blog-content ul li {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 15px; line-height: 1.7; color: #475569;
          margin: 8px 0; padding: 10px 12px;
          background: #f8fafc; border-radius: 10px; border-left: 3px solid #e61e73;
        }
        @media (min-width: 768px) {
          .blog-content ul li {
            gap: 12px; font-size: 16px; line-height: 1.85;
            margin: 10px 0; padding: 10px 14px;
          }
        }
        .blog-content ul li::before {
          content: ""; display: inline-block; width: 6px; height: 6px;
          border-radius: 50%; background: #e61e73; flex-shrink: 0; margin-top: 8px;
        }
        @media (min-width: 768px) {
          .blog-content ul li::before {
            width: 7px; height: 7px; margin-top: 9px;
          }
        }
        .blog-content ol { padding-left: 0; margin: 16px 0; counter-reset: ol-counter; list-style: none; }
        @media (min-width: 768px) {
          .blog-content ol { margin: 20px 0; }
        }
        .blog-content ol li {
          counter-increment: ol-counter; display: flex; align-items: flex-start;
          gap: 12px; font-size: 15px; line-height: 1.7; color: #475569;
          margin: 8px 0; padding: 10px 12px; background: #f8fafc; border-radius: 10px;
        }
        @media (min-width: 768px) {
          .blog-content ol li {
            gap: 14px; font-size: 16px; line-height: 1.85;
            margin: 10px 0; padding: 10px 14px;
          }
        }
        .blog-content ol li::before {
          content: counter(ol-counter); display: flex; align-items: center;
          justify-content: center; min-width: 24px; height: 24px;
          border-radius: 50%; background: #0e2547; color: white;
          font-size: 11px; font-weight: 800; flex-shrink: 0; margin-top: 2px;
        }
        @media (min-width: 768px) {
          .blog-content ol li::before {
            min-width: 26px; height: 26px; font-size: 12px;
          }
        }

        .toc-item-main:hover {
          border-color: #e61e73 !important;
          box-shadow: 0 4px 16px rgba(230,30,115,.1) !important;
          transform: translateX(3px);
        }
        .toc-item-sub:hover {
          background: #f0f4ff !important;
          border-color: #e61e73 !important;
        }

        .blog-content blockquote {
          border-left: 3px solid #e61e73; padding: 14px 16px; margin: 20px 0;
          background: linear-gradient(135deg,#fff5f8 0%,#fff0f5 100%);
          border-radius: 0 10px 10px 0; color: #475569;
          font-size: 15px; line-height: 1.7; font-style: italic;
          box-shadow: 0 4px 14px rgba(230,30,115,.08);
        }
        @media (min-width: 768px) {
          .blog-content blockquote {
            border-left: 4px solid #e61e73; padding: 16px 22px; margin: 24px 0;
            border-radius: 0 12px 12px 0; font-size: 17px; line-height: 1.85;
          }
        }
        .blog-content a { color: #e61e73; text-decoration: none; font-weight: 600; border-bottom: 1px solid rgba(230,30,115,.3); transition: border-color .2s; word-break: break-word; }
        .blog-content a:hover { border-bottom-color: #e61e73; }
        .blog-content img { max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,.08); margin: 20px auto; display: block; }
        @media (min-width: 768px) {
          .blog-content img { border-radius: 16px; box-shadow: 0 12px 32px rgba(0,0,0,.1); margin: 24px auto; }
        }
        .blog-content hr { border: none; height: 2px; background: linear-gradient(90deg,#e61e73,transparent); margin: 24px 0; border-radius: 2px; }
        @media (min-width: 768px) {
          .blog-content hr { margin: 32px 0; }
        }
        .blog-content .ql-align-center { text-align: center; }
        .blog-content .ql-align-right  { text-align: right; }
        .blog-content .ql-align-justify { text-align: justify; }

        /* Override N8N inline background colors — handled in transformContent */

        /* Fix N8N Key Takeaways / Checklist bad background and text colors */
        .blog-content div[style], .blog-content section[style],
        .blog-content p[style], .blog-content span[style],
        .blog-content ul[style], .blog-content ol[style],
        .blog-content li[style] {
          background: transparent !important;
          background-color: transparent !important;
          color: inherit !important;
          border-color: inherit !important;
        }
        /* Restore specific known good containers */
        .blog-content div[style*="border"], .blog-content div[style*="padding"],
        .blog-content div[style*="margin"], .blog-content div[style*="border-radius"] {
          background: #f8fafc !important;
          color: #334155 !important;
        }

        .img-card { overflow: hidden; border-radius: 20px; box-shadow: 0 12px 36px rgba(0,0,0,.1); transition: transform .3s ease, box-shadow .3s ease; }
        .img-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,.13); }
        .img-card img { width: 100%; object-fit: cover; display: block; transition: transform .5s ease; margin: 0; border-radius: 0; box-shadow: none; }
        .img-card:hover img { transform: scale(1.03); }

        .popular-sidebar { position: sticky; top: 96px; align-self: flex-start; }
        @media (max-width: 1024px) { .popular-sidebar { position: static; } }
      `}</style>

      <div className="content-container relative px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1180px]">

          <LocalizedClientLink
            href="/blog"
            className={`${outfit.className} inline-flex items-center gap-2 text-[14px] font-semibold text-slate-400 transition-colors hover:text-[#e61e73]`}
          >
            <span className="text-[18px]">←</span> Back to Blog
          </LocalizedClientLink>

          {/* Post header */}
          <div className="mt-6 sm:mt-8">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {post.category_id && (
                <span
                  className={`${mansalva.className} inline-flex items-center rounded-full px-3 py-1 text-[13px] text-white sm:px-4 sm:text-[14px]`}
                  style={{ background: "linear-gradient(135deg, #e61e73, #9333ea)" }}
                >
                  {post.category_id}
                </span>
              )}
              {post.published_at && (
                <span className={`${outfit.className} text-[12px] font-semibold uppercase tracking-[0.05em] text-slate-400 sm:text-[13px]`}>
                  {formatDate(post.published_at)}
                </span>
              )}
            </div>

            <h1 className={`${epilogue.className} mt-4 max-w-[820px] text-[28px] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#0e2547] sm:mt-5 sm:text-[36px] lg:text-[54px]`}>
              {post.title}
            </h1>

            {post.excerpt && (
              <p className={`${outfit.className} mt-4 max-w-[700px] text-[15px] leading-[1.7] text-slate-600 sm:mt-5 sm:text-[17px] sm:leading-[1.85]`}>
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Two-column layout */}
          <div className="mt-10 flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-8">

            {/* Main article */}
            <div className="min-w-0">
              <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)] lg:rounded-[24px]">
                <div className="h-[4px] w-full" style={{ background: "linear-gradient(90deg, #e61e73, #9333ea, #0ea5e9)" }} />
                <div className="p-5 sm:p-7 lg:p-12">

                  {post.featured_image && (
                    <div className="mb-8 overflow-hidden rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] lg:mb-10 lg:rounded-[24px] lg:shadow-[0_24px_60px_rgba(0,0,0,0.12)]">
                      <div className="relative aspect-[16/9] w-full">
                        <Image
                          src={post.featured_image}
                          alt={post.title}
                          fill
                          className="object-cover"
                          priority
                          fetchPriority="high"
                          sizes="(max-width: 1024px) 100vw, 820px"
                        />
                      </div>
                    </div>
                  )}

                  {processedContent ? (
                    <div className="blog-content" dangerouslySetInnerHTML={{ __html: processedContent }} />
                  ) : (
                    <p className={`${outfit.className} text-[16px] text-slate-400 italic`}>Content coming soon.</p>
                  )}

                </div>
              </div>

              {/* FAQs Section */}
              {post.faqs && post.faqs.length > 0 && (
                <div className="mt-8 lg:mt-10">
                  <BlogFaqAccordion faqs={post.faqs} />
                </div>
              )}

              {/* Extra images */}
              {validImages.length > 0 && (
                <div className="mt-8 lg:mt-10">
                  <p className={`${mansalva.className} mb-5 text-[16px] text-[#e61e73] lg:mb-6 lg:text-[18px]`}>More from this article</p>
                  {validImages.length === 1 && (
                    <div className="img-card relative w-full h-[320px] sm:h-[420px] md:h-[500px]">
                      <Image src={validImages[0]} alt={`${post.title} image 1`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 800px" />
                    </div>
                  )}
                  {validImages.length === 2 && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
                      {validImages.map((img, i) => (
                        <div key={i} className="img-card relative w-full h-[240px] sm:h-[320px] md:h-[400px]">
                          <Image src={img} alt={`${post.title} image ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
                        </div>
                      ))}
                    </div>
                  )}
                  {validImages.length === 3 && (
                    <div className="flex flex-col gap-4 lg:gap-5">
                      <div className="img-card relative w-full h-[300px] sm:h-[400px] md:h-[480px]">
                        <Image src={validImages[0]} alt={`${post.title} image 1`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 800px" />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
                        {validImages.slice(1).map((img, i) => (
                          <div key={i} className="img-card relative w-full h-[200px] sm:h-[280px] md:h-[340px]">
                            <Image src={img} alt={`${post.title} image ${i + 2}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {validImages.length >= 4 && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
                      {validImages.map((img, i) => (
                        <div key={i} className="img-card relative w-full h-[220px] sm:h-[300px] md:h-[360px]">
                          <Image src={img} alt={`${post.title} image ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Bottom CTA */}
              <div
                className="relative mt-10 overflow-hidden rounded-[20px] p-6 text-center shadow-[0_16px_40px_rgba(14,37,71,0.18)] sm:p-8 lg:mt-14 lg:rounded-[24px] lg:p-12 lg:shadow-[0_18px_50px_rgba(14,37,71,0.2)]"
                style={{ background: "linear-gradient(135deg, #0e2547 0%, #1a3a6b 50%, #0e2547 100%)" }}
              >
                <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
                  <div className="absolute left-[10%] top-[20%] h-20 w-20 rounded-full bg-[#e61e73] lg:h-24 lg:w-24" />
                  <div className="absolute right-[15%] bottom-[20%] h-14 w-14 rounded-full bg-[#9333ea] lg:h-16 lg:w-16" />
                </div>
                <p className={`${mansalva.className} relative text-[16px] text-[#ef6a99] lg:text-[18px]`}>Want to read more?</p>
                <h3 className={`${epilogue.className} relative mt-2 text-[22px] font-extrabold tracking-[-0.04em] text-white sm:text-[26px] lg:mt-3 lg:text-[34px]`}>
                  Explore all our articles
                </h3>
                <p className={`${outfit.className} relative mt-2 text-[14px] text-white/75 lg:mt-3 lg:text-[15px]`}>
                  Strategy, creative, and performance insights — all in one place.
                </p>
                <div className="relative mt-6 lg:mt-8">
                  <LocalizedClientLink
                    href="/blog"
                    className={`${epilogue.className} inline-flex h-[48px] items-center justify-center rounded-[12px] px-8 text-[13px] font-extrabold uppercase tracking-[0.04em] text-white transition-all hover:opacity-90 hover:-translate-y-0.5 lg:h-[52px] lg:rounded-[14px] lg:px-10 lg:text-[14px]`}
                    style={{ background: "linear-gradient(135deg, #e61e73, #9333ea)" }}
                  >
                    View More Articles ›
                  </LocalizedClientLink>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            {popularPosts.length > 0 && (
              <aside className="popular-sidebar">
                <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)] lg:rounded-[24px]">
                  <div className="h-[4px] w-full" style={{ background: "linear-gradient(90deg, #e61e73, #9333ea)" }} />
                  <div className="p-5 sm:p-6">
                    <div className="mb-5 flex items-center gap-2.5 sm:gap-3 lg:mb-6">
                      <div
                        className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] sm:h-[36px] sm:w-[36px] lg:rounded-[10px]"
                        style={{ background: "linear-gradient(135deg, #0e2547, #1e4a8a)" }}
                      >
                        <span className="text-[14px] sm:text-[16px]">🔥</span>
                      </div>
                      <h2 className={`${epilogue.className} text-[18px] font-extrabold tracking-[-0.03em] text-[#0e2547] sm:text-[20px]`}>
                        Popular Articles
                      </h2>
                    </div>

                    <div className="flex flex-col gap-1">
                      {popularPosts.map((item, i) => (
                        <LocalizedClientLink
                          key={item.slug}
                          href={`/blog/${item.slug}`}
                          className="group relative flex items-start gap-3 rounded-[12px] p-2.5 transition-all hover:bg-[#f8faff] sm:gap-4 sm:rounded-[14px] sm:p-3"
                        >
                          <span
                            className={`${epilogue.className} mt-[2px] flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-[7px] text-[11px] font-extrabold text-white sm:mt-[3px] sm:h-[28px] sm:w-[28px] sm:rounded-[8px] sm:text-[12px]`}
                            style={{
                              background: i === 0
                                ? "linear-gradient(135deg, #e61e73, #9333ea)"
                                : i === 1
                                ? "linear-gradient(135deg, #f97316, #e61e73)"
                                : "linear-gradient(135deg, #0e2547, #1e4a8a)"
                            }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className={`${epilogue.className} block text-[13px] font-extrabold leading-[1.3] tracking-[-0.02em] text-[#0e2547] transition-colors group-hover:text-[#e61e73] line-clamp-2 sm:text-[14px]`}>
                              {item.title}
                            </span>
                            {item.published_at && (
                              <span className={`${outfit.className} mt-1 block text-[10px] text-slate-400 sm:mt-1.5 sm:text-[11px]`}>
                                {formatDate(item.published_at)}
                              </span>
                            )}
                          </span>
                          <span className="mt-[4px] flex-shrink-0 text-[14px] text-slate-300 transition-colors group-hover:text-[#e61e73] sm:mt-[5px] sm:text-[16px]">›</span>
                        </LocalizedClientLink>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
      <RelatedLinks type="blog" id={params.slug} />
    </main>
  )
}
