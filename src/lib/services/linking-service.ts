// Phase 4: Removed store product embeddings and Medusa SDK dependencies (listProducts, listRegions).
// linking-service now indexes marketing entities (blogs and services).
import { createHash } from "crypto"
import { supabaseAdmin } from "@lib/supabase-admin"

export interface LinkEmbedding {
  id: string
  resource_type: "blog" | "service"
  resource_id: string
  title: string
  url: string
  content_hash: string
  status: string
  group_key: string | null
  keywords: string | null
  embedding: number[] | null
  created_at?: string
}

export interface LinkSuggestion {
  id: string
  source_type: string
  source_id: string
  target_type: string
  target_id: string
  target_title: string
  target_url: string
  anchor_text: string
  score: number
  mode: string
  status: string
}

function cosineSimilarity(vecA: number[] | null, vecB: number[] | null): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0 || vecA.length !== vecB.length) {
    return 0
  }
  let dotProduct = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }
  if (normA === 0 || normB === 0) return 0
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

export class LinkingService {
  /**
   * Generates a 1536-dimension embedding vector from OpenAI
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not defined.")
    }

    const cleanedText = text.replace(/\s+/g, " ").slice(0, 8000)

    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: cleanedText,
        dimensions: 1536,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`OpenAI API Error (${res.status}): ${errText}`)
    }

    const json = await res.json()
    return json.data[0].embedding
  }

  /**
   * Generates md5 content hash to check for changes
   */
  static getContentHash(text: string): string {
    return createHash("md5").update(text).digest("hex")
  }

  /**
   * Syncs blog posts and services into the link_embedding table
   */
  static async syncEmbeddings(): Promise<{ synced: number; deleted: number }> {
    console.log("Starting Link Embedding Synchronization...")

    const { data: posts, error: postErr } = await supabaseAdmin
      .from("post")
      .select("*")
      .is("deleted_at", null)
      .eq("status", "published")

    if (postErr) {
      throw new Error(`Failed to fetch blogs from Supabase: ${postErr.message}`)
    }

    const { data: services, error: servErr } = await supabaseAdmin
      .from("services")
      .select("*")

    if (servErr) {
      console.warn("Could not fetch services for internal linking:", servErr.message)
    }

    const { data: existing, error: existErr } = await supabaseAdmin
      .from("link_embedding")
      .select("id, content_hash")

    if (existErr) {
      throw new Error(`Failed to fetch existing embeddings: ${existErr.message}`)
    }

    const existingMap = new Map<string, string>()
    if (existing) {
      for (const row of existing) {
        existingMap.set(row.id, row.content_hash)
      }
    }

    const activeIds = new Set<string>()
    let syncedCount = 0

    // 1. Sync blog posts
    for (const post of posts || []) {
      const id = `blog:${post.slug}`
      activeIds.add(id)

      const title = post.title || ""
      const excerpt = post.excerpt || ""
      const content = post.content || ""
      const bodyText = `${title}\n\n${excerpt}\n\n${content}`
      const hash = this.getContentHash(bodyText)

      const prevHash = existingMap.get(id)
      if (prevHash === hash) {
        continue
      }

      console.log(`Generating embedding for blog post: ${title}`)
      const embedding = await this.generateEmbedding(bodyText)

      const { error: upsertErr } = await supabaseAdmin
        .from("link_embedding")
        .upsert({
          id,
          resource_type: "blog",
          resource_id: post.id,
          title,
          url: `/blog/${post.slug}`,
          content_hash: hash,
          status: "published",
          group_key: post.category_id || "blog",
          keywords: post.meta_title || post.title || "",
          embedding,
          updated_at: new Date().toISOString(),
        })

      if (upsertErr) {
        console.error(`Failed to upsert embedding for blog ${title}:`, upsertErr.message)
      } else {
        syncedCount++
      }
    }

    // 2. Sync services
    for (const s of services || []) {
      const id = `service:${s.slug}`
      activeIds.add(id)

      const title = s.title || ""
      const intro = s.intro || ""
      const description = s.description || ""
      const points = Array.isArray(s.points) ? s.points.join(" ") : ""
      const bodyText = `${title}\n\n${intro}\n\n${description}\n\n${points}`
      const hash = this.getContentHash(bodyText)

      const prevHash = existingMap.get(id)
      if (prevHash === hash) {
        continue
      }

      console.log(`Generating embedding for service: ${title}`)
      const embedding = await this.generateEmbedding(bodyText)

      const { error: upsertErr } = await supabaseAdmin
        .from("link_embedding")
        .upsert({
          id,
          resource_type: "service",
          resource_id: s.id || s.slug,
          title,
          url: `/services/${s.slug}`,
          content_hash: hash,
          status: "published",
          group_key: "services",
          keywords: s.short_label || s.title || "",
          embedding,
          updated_at: new Date().toISOString(),
        })

      if (upsertErr) {
        console.error(`Failed to upsert embedding for service ${title}:`, upsertErr.message)
      } else {
        syncedCount++
      }
    }

    let deletedCount = 0
    for (const existingId of Array.from(existingMap.keys())) {
      if (!activeIds.has(existingId)) {
        console.log(`Deactivating / removing embedding: ${existingId}`)
        await supabaseAdmin
          .from("link_embedding")
          .update({ status: "deleted", updated_at: new Date().toISOString() })
          .eq("id", existingId)

        await supabaseAdmin
          .from("link_suggestion")
          .delete()
          .or(`source_id.eq.${existingId},target_id.eq.${existingId}`)

        deletedCount++
      }
    }

    console.log(`Sync completed. Synced: ${syncedCount}, Deleted: ${deletedCount}`)
    return { synced: syncedCount, deleted: deletedCount }
  }

  /**
   * Recalculates linking suggestions based on embedding similarity matches and custom bonuses
   */
  static async recalculateSuggestions(): Promise<{ totalCandidates: number; selected: number }> {
    console.log("Recalculating link suggestions...")

    const { data: embeddings, error } = await supabaseAdmin
      .from("link_embedding")
      .select("id, resource_type, resource_id, title, url, group_key, keywords, embedding, created_at")
      .eq("status", "published")

    if (error || !embeddings) {
      throw new Error(`Failed to fetch embeddings for scoring: ${error?.message}`)
    }

    const candidates: any[] = []

    for (let i = 0; i < embeddings.length; i++) {
      const source = embeddings[i]
      if (!source.embedding) continue

      for (let j = 0; j < embeddings.length; j++) {
        if (i === j) continue
        const target = embeddings[j]
        if (!target.embedding) continue

        const sim = cosineSimilarity(source.embedding, target.embedding)
        const simScore = sim * 0.6

        let groupBonus = 0
        if (source.group_key && target.group_key && source.group_key === target.group_key) {
          groupBonus = 0.15
        }

        let kwBonus = 0
        if (source.keywords && target.keywords) {
          const kw1Arr = source.keywords.toLowerCase().split(/[,\s]+/).filter(Boolean)
          const kw2Set = new Set(target.keywords.toLowerCase().split(/[,\s]+/).filter(Boolean))
          const intersectCount = kw1Arr.filter((x: string) => kw2Set.has(x)).length
          const unionSet = new Set([...kw1Arr, ...Array.from(kw2Set)])
          if (unionSet.size > 0) {
            kwBonus = (intersectCount / unionSet.size) * 0.15
          }
        }

        let boost = 0
        const targetDate = new Date(target.created_at || Date.now())
        const isFresh = Date.now() - targetDate.getTime() < 30 * 24 * 60 * 60 * 1000
        if (isFresh) boost += 0.05

        const totalScore = Math.min(1.0, simScore + groupBonus + kwBonus + boost)
        const anchorText = target.title

        candidates.push({
          source_type: source.resource_type,
          source_id: source.id,
          target_type: target.resource_type,
          target_id: target.id,
          target_title: target.title,
          target_url: target.url,
          anchor_text: anchorText,
          score: totalScore,
          mode: "related_block",
          status: "active",
        })
      }
    }

    candidates.sort((a, b) => b.score - a.score)

    const outboundCounts = new Map<string, number>()
    const inboundCounts = new Map<string, number>()
    const selected: any[] = []

    for (const cand of candidates) {
      const sourceId = cand.source_id
      const targetId = cand.target_id

      const maxOutbound = 6
      const currentOutbound = outboundCounts.get(sourceId) || 0
      if (currentOutbound >= maxOutbound) continue

      const currentInbound = inboundCounts.get(targetId) || 0
      if (currentInbound >= 30) continue

      const alreadyHasLink = selected.some(
        (s) => s.source_id === sourceId && s.target_id === targetId
      )
      if (alreadyHasLink) continue

      selected.push({
        id: `sug_${crypto.randomUUID().replace(/-/g, "")}`,
        ...cand,
      })

      outboundCounts.set(sourceId, currentOutbound + 1)
      inboundCounts.set(targetId, currentInbound + 1)
    }

    console.log(`Scoring finished. Candidates: ${candidates.length}, Selected: ${selected.length}`)

    const { error: delError } = await supabaseAdmin
      .from("link_suggestion")
      .delete()
      .neq("id", "")

    if (delError) {
      throw new Error(`Failed to clean up suggestions: ${delError.message}`)
    }

    for (let i = 0; i < selected.length; i += 100) {
      const chunk = selected.slice(i, i + 100)
      const { error: insError } = await supabaseAdmin.from("link_suggestion").insert(chunk)

      if (insError) {
        console.error("Bulk insert failed for suggestions chunk:", insError.message)
      }
    }

    return { totalCandidates: candidates.length, selected: selected.length }
  }
}
