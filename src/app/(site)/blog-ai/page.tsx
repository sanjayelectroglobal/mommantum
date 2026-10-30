import { Metadata } from "next"
import { getSeoSetting } from "@lib/data/seo"
import { getPageMetaDefault } from "@lib/schema/page-defaults"
import { getPageFaqs } from "@lib/data/page-faqs"
import { resolveLegalPageData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import JsonLd from "@modules/common/components/json-ld"
import PageFaqSection from "@modules/common/components/page-faq-section"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const seoSetting = await getSeoSetting("blog-ai").catch(() => null)
  const defaultMeta = getPageMetaDefault("blog-ai")!
  const resolved = resolveLegalPageData(
    "blog-ai",
    defaultMeta.title,
    defaultMeta.description,
    seoSetting
  )
  return buildMetadataFromResolved(resolved)
}

export default async function BlogAiPage() {
  const seoSetting = await getSeoSetting("blog-ai").catch(() => null)
  const defaultMeta = getPageMetaDefault("blog-ai")!
  const faqs = getPageFaqs("blog-ai")

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white text-slate-900 px-6 py-12 text-center animate-in fade-in duration-500">
      <JsonLd
        type="page"
        slug="blog-ai"
        title={defaultMeta.title}
        description={defaultMeta.description}
        seoSetting={seoSetting}
      />
      <div className="max-w-xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-100 text-pink-600 text-xs font-semibold uppercase tracking-wider">
          🤖 AI Content Systems
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-none">
          Blog <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600">AI</span>
        </h1>
        <p className="text-lg text-slate-600 font-medium max-w-lg mx-auto">
          We are building an intelligent content engine to automate blog creation, SEO optimization, and agentic publishing. Stay tuned!
        </p>
        <div className="pt-6">
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
      {faqs && faqs.length > 0 && (
        <div className="w-full max-w-4xl mx-auto mt-16 text-left">
          <PageFaqSection
            faqs={faqs}
            title="Blog AI FAQs"
            subtitle="Everything you need to know about Mommantum AI blog automation, editorial pipelines, and LLM workflows."
          />
        </div>
      )}
    </div>
  )
}
