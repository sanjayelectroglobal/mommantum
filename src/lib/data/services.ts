import { createClient } from "@supabase/supabase-js"
import { unstable_cache } from "next/cache"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type FAQ = {
  question: string
  answer: string
}

export type Service = {
  id?: string
  slug: string
  title: string
  shortLabel: string
  description: string
  intro: string
  image: string
  points: string[]
  outcomes: string[]
  whyItMatters: string[]
  faqs: FAQ[]
}

type ServiceRow = {
  id: string
  slug: string
  title: string
  short_label: string
  description: string
  intro: string
  image: string
  points: string[]
  outcomes: string[]
  why_it_matters?: string[]
  faqs: { question: string; answer: string }[]
  created_at: string
}

export const getServices = unstable_cache(
  async (): Promise<Service[]> => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: true })

    if (error || !data) return []

    return (data as ServiceRow[]).map((s) => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      shortLabel: s.short_label,
      description: s.description,
      intro: s.intro,
      image: s.image,
      points: s.points || [],
      outcomes: s.outcomes || [],
      whyItMatters: s.why_it_matters || [],
      faqs: s.faqs || [],
    }))
  },
  ["services-list"],
  { revalidate: 60, tags: ["services"] }
)

export async function getService(slug: string): Promise<Service | null> {
  if (!slug) return null
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error || !data) return null

  const s = data as ServiceRow

  return {
    id: s.id,
    slug: s.slug,
    title: s.title,
    shortLabel: s.short_label,
    description: s.description,
    intro: s.intro,
    image: s.image,
    points: s.points || [],
    outcomes: s.outcomes || [],
    whyItMatters: s.why_it_matters || [],
    faqs: s.faqs || [],
  }
}
