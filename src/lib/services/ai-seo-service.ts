// Phase 4: Removed store product/category auto-fill and Medusa SDK dependencies (listProducts, listRegions).
// Supports SEO AI metadata generation and auto-fill for service, blog, and page types.
import { supabaseAdmin } from "@lib/supabase-admin"
import { revalidateContent } from "@lib/revalidate"

export interface SeoGenerationInput {
  type: "service" | "blog" | "page"
  id: string
  title: string
  slug: string
  content?: string
  description?: string
  image?: string | null
  existingPrimaryKeyword?: string
  force?: boolean
}

export interface GeneratedSeoPayload {
  meta_title: string
  meta_description: string
  primary_keyword: string
  secondary_keywords: string[]
  tags: string[]
  og_title: string
  og_description: string
  og_image?: string | null
  twitter_card: string
  twitter_title: string
  twitter_description: string
  image_alt_text?: string
  blog_excerpt?: string
  reading_time_minutes?: number
  faqs: { question: string; answer: string }[]
}

/**
 * Strips HTML tags and returns plain text stats
 */
export function parseHtmlContent(htmlStr: string) {
  const plainText = (htmlStr || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()

  const words = plainText ? plainText.split(/\s+/).filter(Boolean) : []
  const wordCount = words.length
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))

  return { plainText, wordCount, readingTimeMinutes }
}

/**
 * Fetches real-world user queries for a keyword via Answer The Public (RapidAPI).
 * Falls back to OpenAI query generation if RapidAPI key is missing or fails.
 */
async function fetchAnswerThePublicQueries(keyword: string): Promise<string[]> {
  const apiKey = process.env.RAPIDAPI_KEY
  if (!apiKey || !keyword) {
    return []
  }

  try {
    const res = await fetch(
      `https://answer-the-public.p.rapidapi.com/search?keyword=${encodeURIComponent(
        keyword
      )}&country=in&lang=en`,
      {
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "answer-the-public.p.rapidapi.com",
        },
      }
    )

    if (res.ok) {
      const data = await res.json()
      const questions: string[] = []
      if (Array.isArray(data?.questions)) {
        for (const item of data.questions) {
          if (typeof item === "string") questions.push(item)
          else if (item?.text) questions.push(item.text)
        }
      }
      if (questions.length > 0) {
        return questions.slice(0, 5)
      }
    }
  } catch (err: any) {
    console.warn("Answer The Public RapidAPI request failed, falling back to AI:", err.message)
  }

  return []
}

/**
 * Main AI SEO Service utilizing GPT-4o-mini
 */
export class AiSeoService {
  static async generateSeoMetadata(input: SeoGenerationInput): Promise<GeneratedSeoPayload> {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is missing.")
    }

    const { plainText, readingTimeMinutes } = parseHtmlContent(input.content || input.description || "")
    const atpQuestions = await fetchAnswerThePublicQueries(input.existingPrimaryKeyword || input.title)

    const prompt = `
You are an expert Content & Digital Marketing SEO Strategist for the brand "Mommantum".
Generate optimized SEO metadata and search-intent FAQs for a ${input.type}.

Input Details:
- Type: ${input.type}
- Title: ${input.title}
- Slug/Path: ${input.slug}
- Content Snippet: ${plainText.slice(0, 2000)}
- Real User Search Queries (if available): ${atpQuestions.length > 0 ? atpQuestions.join(" | ") : "None"}

Strict Rules for JSON Output:
1. "meta_title": Under 60 characters, MUST include primary keyword, MUST end with " | Mommantum".
2. "meta_description": 150-160 characters, catchy hook, includes primary keyword and marketing value proposition.
3. "primary_keyword": 1 main high-intent search term string.
4. "secondary_keywords": Array of exactly 4 secondary keyword strings.
5. "tags": Array of 5 to 8 relevant tag strings.
6. "og_title": Catchy title for social media (under 60 chars).
7. "og_description": Engaging social description (under 160 chars).
8. "twitter_card": "summary_large_image".
9. "twitter_title": Twitter specific title.
10. "twitter_description": Twitter specific description.
11. "image_alt_text": Descriptive alt text for featured image (under 120 chars).
12. "blog_excerpt": Under 300 characters engaging summary (only relevant for blogs, string for all).
13. "faqs": Array of 3 to 5 Q&A objects ({ "question": "...", "answer": "..." }) solving user search intent questions.

Output ONLY valid JSON without markdown fences matching schema:
{
  "meta_title": "...",
  "meta_description": "...",
  "primary_keyword": "...",
  "secondary_keywords": ["...", "...", "...", "..."],
  "tags": ["...", "..."],
  "og_title": "...",
  "og_description": "...",
  "twitter_card": "summary_large_image",
  "twitter_title": "...",
  "twitter_description": "...",
  "image_alt_text": "...",
  "blog_excerpt": "...",
  "faqs": [
    { "question": "...", "answer": "..." }
  ]
}
`

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an SEO AI generator responding strictly in raw JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`OpenAI Chat Completion failed (${res.status}): ${err}`)
    }

    const data = await res.json()
    const content = data.choices[0]?.message?.content
    if (!content) {
      throw new Error("Empty response returned from OpenAI.")
    }

    const parsed: GeneratedSeoPayload = JSON.parse(content)
    parsed.reading_time_minutes = readingTimeMinutes
    return parsed
  }

  /**
   * Scans and auto-fills SEO metadata for Services, Blogs, and Pages
   */
  static async runAutoFillJob(options?: {
    type?: "service" | "blog" | "page"
    id?: string
    force?: boolean
    limit?: number
  }): Promise<{ processedCount: number; updatedCount: number; errors: string[] }> {
    const limit = options?.limit || 100
    const force = options?.force || false
    const errors: string[] = []
    let processedCount = 0
    let updatedCount = 0

    // 1. Target specific single item if ID provided
    if (options?.id && options?.type) {
      try {
        const itemInput = await this.getItemInput(options.type, options.id)
        if (itemInput) {
          processedCount++
          const payload = await this.generateSeoMetadata({ ...itemInput, force })
          await this.saveSeoSetting(options.type, itemInput.id, itemInput.slug, payload)
          updatedCount++
        }
      } catch (err: any) {
        errors.push(`Error processing ${options.type}:${options.id}: ${err.message}`)
      }
      return { processedCount, updatedCount, errors }
    }

    // 2. Batch Scan Services
    if (!options?.type || options.type === "service") {
      try {
        const { data: services } = await supabaseAdmin
          .from("services")
          .select("*")
          .limit(limit)

        if (services) {
          for (const s of services) {
            processedCount++
            const pageKey = `service:${s.slug}`
            if (!force) {
              const { data: existing } = await supabaseAdmin
                .from("seo_setting")
                .select("meta_title, meta_description")
                .eq("page_key", pageKey)
                .single()
              if (existing?.meta_title && existing?.meta_description) continue
            }

            try {
              const payload = await this.generateSeoMetadata({
                type: "service",
                id: s.slug,
                title: s.title || s.short_label || "",
                slug: `/services/${s.slug}`,
                description: s.description || s.intro || "",
                image: s.image || null,
              })
              await this.saveSeoSetting("service", s.slug, `/services/${s.slug}`, payload)
              updatedCount++
            } catch (err: any) {
              errors.push(`Service ${s.slug} failed: ${err.message}`)
            }
          }
        }
      } catch (err: any) {
        errors.push(`Batch services fetch failed: ${err.message}`)
      }
    }

    // 3. Batch Scan Blogs
    if (!options?.type || options.type === "blog") {
      try {
        const { data: posts } = await supabaseAdmin
          .from("post")
          .select("*")
          .is("deleted_at", null)
          .eq("status", "published")
          .limit(limit)

        if (posts) {
          for (const post of posts) {
            processedCount++
            const pageKey = `blog:${post.slug}`
            if (!force) {
              const { data: existing } = await supabaseAdmin
                .from("seo_setting")
                .select("meta_title, meta_description")
                .eq("page_key", pageKey)
                .single()
              if (existing?.meta_title && existing?.meta_description) continue
            }

            try {
              const payload = await this.generateSeoMetadata({
                type: "blog",
                id: post.id || post.slug,
                title: post.title || "",
                slug: `/blog/${post.slug}`,
                content: post.content || post.excerpt || "",
                image: post.featured_image || null,
              })
              await this.saveSeoSetting("blog", post.slug, `/blog/${post.slug}`, payload)

              // Update blog excerpt if missing
              if (!post.excerpt && payload.blog_excerpt) {
                await supabaseAdmin
                  .from("post")
                  .update({ excerpt: payload.blog_excerpt })
                  .eq("id", post.id)
              }

              updatedCount++
            } catch (err: any) {
              errors.push(`Blog ${post.slug} failed: ${err.message}`)
            }
          }
        }
      } catch (err: any) {
        errors.push(`Batch blogs fetch failed: ${err.message}`)
      }
    }

    return { processedCount, updatedCount, errors }
  }

  private static async getItemInput(
    type: "service" | "blog" | "page",
    id: string
  ): Promise<SeoGenerationInput | null> {
    if (type === "blog") {
      const { data: post } = await supabaseAdmin
        .from("post")
        .select("*")
        .or(`id.eq.${id},slug.eq.${id}`)
        .single()
      if (!post) return null
      return {
        type: "blog",
        id: post.id || post.slug,
        title: post.title || "",
        slug: `/blog/${post.slug}`,
        content: post.content || post.excerpt || "",
        image: post.featured_image || null,
      }
    }

    if (type === "service") {
      const { data: s } = await supabaseAdmin
        .from("services")
        .select("*")
        .or(`id.eq.${id},slug.eq.${id}`)
        .single()
      if (!s) return null
      return {
        type: "service",
        id: s.slug,
        title: s.title || s.short_label || "",
        slug: `/services/${s.slug}`,
        description: s.description || s.intro || "",
        image: s.image || null,
      }
    }

    return null
  }

  /**
   * Upserts generated SEO metadata payload into Supabase `seo_setting`
   */
  private static async saveSeoSetting(
    type: string,
    id: string,
    slug: string,
    payload: GeneratedSeoPayload
  ) {
    const pageKey = `${type}:${id}`

    const dataObj = {
      page_key: pageKey,
      page_label: `${type.toUpperCase()}: ${payload.meta_title.split("|")[0].trim()}`,
      meta_title: payload.meta_title,
      meta_description: payload.meta_description,
      slug: slug,
      canonical_url: slug,
      robots_index: true,
      robots_follow: true,
      primary_keyword: payload.primary_keyword,
      secondary_keywords: payload.secondary_keywords,
      meta_keywords: payload.tags.join(", "),
      og_title: payload.og_title,
      og_description: payload.og_description,
      og_image: payload.og_image,
      og_type: type === "blog" ? "article" : "website",
      twitter_card: payload.twitter_card,
      twitter_title: payload.twitter_title,
      twitter_description: payload.twitter_description,
      twitter_image: payload.og_image,
      faq_section: payload.faqs,
      updated_at: new Date().toISOString(),
    }

    const { data: existing } = await supabaseAdmin
      .from("seo_setting")
      .select("id")
      .eq("page_key", pageKey)
      .maybeSingle()

    if (existing?.id) {
      const { error } = await supabaseAdmin
        .from("seo_setting")
        .update(dataObj)
        .eq("id", existing.id)
      if (error) {
        throw new Error(`Supabase seo_setting update failed for ${pageKey}: ${error.message}`)
      }
    } else {
      const { error } = await supabaseAdmin
        .from("seo_setting")
        .insert({
          id: `seo_${crypto.randomUUID().replace(/-/g, "")}`,
          ...dataObj,
        })
      if (error) {
        throw new Error(`Supabase seo_setting insert failed for ${pageKey}: ${error.message}`)
      }
    }

    await revalidateContent({ type: "seo", pageKey })
  }
}
