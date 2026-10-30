/**
 * Service Detail Page (/services/[slug])
 * 
 * Purpose:
 * Renders individual dynamic landing pages for each of Mommantum's 16 services
 * (including Performance Marketing, SEO, AI Automation, AI Video Generation,
 * Content & Video Scripting, Video Editing, AI Video Editing, Podcast Editing, etc.).
 * 
 * Features & Content Architecture:
 * - Dynamic metadata with JSON-LD schema integration for Google Rich Results.
 * - Outlines key outcomes, hero intro with automated internal keyword linking.
 * - Sourced service focus points displayed as clean editorial paragraphs with pink numbering.
 * - What We Do, Why It Matters, interactive FAQ accordions, and high-conversion CTAs.
 */

import { notFound } from "next/navigation"
import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import JsonLd from "@modules/common/components/json-ld"
import { getServices, getService } from "@lib/data/services"
import { getSeoSetting } from "@lib/data/seo"
import { resolveServiceData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import FaqAccordion from "./_components/FaqAccordion"
import { supabaseAdmin } from "@lib/supabase-admin"
import { injectInternalLinks } from "@lib/util/linker"
import { getServiceFocusPoints, enrichServiceFocusContent } from "@lib/data/service-focus"

// Revalidate page cache every 60 seconds (ISR)
export const revalidate = 60

import { epilogue, outfit, mansalva } from "@lib/fonts"

// Default value if database has no whyItMatters entries
const defaultWhyItMatters = [
  "Running ads without a clear system leads to wasted budget. We focus on what actually drives growth. When the right audience sees the right message and lands on a clear page, they are more likely to buy.",
  "This helps you increase sales, lower your customer acquisition cost, improve your ROAS, and build repeat customers - not just one-time buyers.",
]

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const services = await getServices()
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const [service, seoSetting] = await Promise.all([
    getService(params.slug),
    getSeoSetting(`service:${params.slug}`).catch(() => null),
  ])

  if (!service) return {}

  const resolved = resolveServiceData(service, seoSetting)
  return buildMetadataFromResolved(resolved)
}

export default async function ServiceDetailPage(props: Props) {
  const params = await props.params
  let service = null
  let allServices: any[] = []
  let seoSetting = null
  let keywords: any[] = []
  
  try {
    const [srv, allSrv, seo, kwRes] = await Promise.all([
      getService(params.slug),
      getServices(),
      getSeoSetting(`service:${params.slug}`),
      supabaseAdmin.from("site_keywords").select("*")
    ])
    service = srv
    allServices = allSrv
    seoSetting = seo
    keywords = kwRes.data || []
  } catch (err) {
    console.error("Error loading service detail page data:", err)
  }

  if (!service) return notFound()

  // Retrieve service-specific focus points from official documentation for this service
  const focusPoints = getServiceFocusPoints(params.slug)

  const linkedIntro = service.intro && keywords.length > 0
    ? injectInternalLinks(service.intro, keywords)
    : service.intro

  const whyItMatters = service.whyItMatters.length
    ? service.whyItMatters
    : defaultWhyItMatters

  return (
    <main className="relative overflow-hidden bg-[#f7f8fa] pt-14 pb-20 lg:pt-20 lg:pb-24">
      <JsonLd type="service" data={service} seoSetting={seoSetting} />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[4%] top-[10%] h-[140px] w-[420px] rounded-full bg-white/45 blur-3xl" />
        <div className="absolute right-[8%] top-[12%] h-[140px] w-[360px] rounded-full bg-white/35 blur-3xl" />
        <div className="absolute left-[16%] bottom-[8%] h-[120px] w-[380px] rounded-full bg-white/30 blur-3xl" />
      </div>

      <div className="content-container relative px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1320px]">

          {/* Back link */}
          <LocalizedClientLink
            href="/services"
            className={`${outfit.className} inline-flex items-center gap-2 text-[14px] font-semibold text-slate-400 transition-colors hover:text-[#e61e73]`}
          >
            ← Back to Services
          </LocalizedClientLink>

          {/* Header */}
          <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_380px] lg:items-start">
            <div>
              <p className={`${mansalva.className} text-[20px] font-bold text-[#e61e73]`}>
                {service.shortLabel}
              </p>
              <h1 className={`${epilogue.className} mt-3 max-w-[780px] text-[36px] font-extrabold leading-[0.97] tracking-[-0.06em] text-[#0e2547] sm:text-[48px] lg:text-[62px]`}>
                {service.title}
              </h1>
              <p 
                className={`${outfit.className} mt-6 max-w-[720px] text-[17px] leading-[1.95] text-slate-600`}
                dangerouslySetInnerHTML={{ __html: linkedIntro }}
              />
            </div>

            {/* Outcomes card */}
            <div className="rounded-[22px] bg-white p-7 shadow-[0_12px_36px_rgba(0,0,0,0.06)]">
              <h2 className={`${epilogue.className} text-[22px] font-extrabold tracking-[-0.04em] text-[#0e2547]`}>
                Outcomes
              </h2>
              <ul className="mt-5 space-y-4">
                {service.outcomes.map((item) => (
                  <li
                    key={item}
                    className={`${outfit.className} flex items-start gap-3 text-[15px] leading-[1.8] text-slate-600`}
                  >
                    <span className="mt-[10px] h-2 w-2 shrink-0 rounded-full bg-[#e61e73]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Service focus — Sourced directly and verbatim from official PDF for this specific service */}
          <section aria-labelledby="service-focus-heading" className="mt-10 rounded-[22px] bg-white px-8 py-9 shadow-[0_8px_28px_rgba(0,0,0,0.05)] lg:px-12 lg:py-12">
            <p id="service-focus-heading" className={`${mansalva.className} text-[18px] text-[#e61e73]`}>
              Service focus
            </p>
            <h2 className={`${epilogue.className} mt-3 text-[26px] font-extrabold leading-[1.1] tracking-[-0.04em] text-[#0e2547] sm:text-[32px] lg:text-[36px]`}>
              {service.title}
            </h2>

            {/* As-is content from PDF — Highlighted headings and links, NO cards */}
            <div className="mt-8 space-y-8">
              {focusPoints.map((point) => (
                <div key={point.number} className="pt-2">
                  {/* Highlighted heading with pink accented number */}
                  <h3 className={`${epilogue.className} text-[20px] font-extrabold tracking-[-0.03em] text-[#0e2547] sm:text-[23px] lg:text-[25px]`}>
                    <span className="text-[#e61e73] mr-2.5 font-black">{point.number}.</span>
                    <span className="text-[#0e2547]">{point.title}</span>
                  </h3>

                  {/* As-is verbatim paragraph content with highlighted links */}
                  <p
                    className={`${outfit.className} mt-3 text-[15.5px] leading-[1.95] text-slate-600`}
                    dangerouslySetInnerHTML={{
                      __html: enrichServiceFocusContent(point.content, params.slug, keywords)
                    }}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* What we do + Why it matters */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[22px] bg-white p-7 shadow-[0_8px_28px_rgba(0,0,0,0.05)] lg:p-10">
              <h3 className={`${epilogue.className} text-[24px] font-extrabold tracking-[-0.04em] text-[#0e2547]`}>
                What we do
              </h3>
              <ul className="mt-5 space-y-4">
                {service.points.map((item) => (
                  <li
                    key={item}
                    className={`${outfit.className} flex items-start gap-3 text-[15px] leading-[1.8] text-slate-600`}
                  >
                    <span className="mt-[10px] h-2 w-2 shrink-0 rounded-full bg-[#ef6a99]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[22px] bg-white p-7 shadow-[0_8px_28px_rgba(0,0,0,0.05)] lg:p-10">
              <h3 className={`${epilogue.className} text-[24px] font-extrabold tracking-[-0.04em] text-[#0e2547]`}>
                Why it matters
              </h3>
              {whyItMatters.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={`${outfit.className} ${index === 0 ? "mt-5" : "mt-4"} text-[15px] leading-[1.95] text-slate-600`}
                >
                  {paragraph}
                </p>
              ))}
              <div className="mt-8">
                <LocalizedClientLink
                  href="/contact"
                  className={`${epilogue.className} inline-flex h-[52px] items-center justify-center rounded-[14px] bg-[#e61e73] px-8 text-[14px] font-extrabold uppercase tracking-[0.03em] text-white transition-all hover:bg-[#ca155f]`}
                >
                  Let&apos;s Talk →
                </LocalizedClientLink>
              </div>
            </div>
          </div>

          {/* FAQs — accordion */}
          {service.faqs && service.faqs.length > 0 && (
            <div className="mt-12">
              <div className="mb-7">
                <p className={`${mansalva.className} text-[18px] text-[#e61e73]`}>
                  Got questions?
                </p>
                <h2 className={`${epilogue.className} mt-1 text-[28px] font-extrabold tracking-[-0.04em] text-[#0e2547] lg:text-[36px]`}>
                  Frequently Asked Questions
                </h2>
              </div>
              <FaqAccordion faqs={service.faqs} />
            </div>
          )}

          {/* Bottom CTA */}
          <div
            className="mt-12 overflow-hidden rounded-[22px] p-8 text-center lg:p-10"
            style={{ background: "linear-gradient(135deg, #0e2547 0%, #1a3a6b 60%, #0e2547 100%)" }}
          >
            <p className={`${mansalva.className} text-[18px] text-[#ef6a99]`}>
              Ready to grow?
            </p>
            <h3 className={`${epilogue.className} mt-2 text-[24px] font-extrabold tracking-[-0.04em] text-white lg:text-[32px]`}>
              Let&apos;s build your growth system
            </h3>
            <p className={`${outfit.className} mt-3 text-[14px] text-white/75`}>
              Book a free strategy call — no commitment, just clarity.
            </p>
            <div className="mt-7">
              <LocalizedClientLink
                href="/contact"
                className={`${epilogue.className} inline-flex h-[50px] items-center justify-center rounded-[12px] px-8 text-[13px] font-extrabold uppercase tracking-[0.04em] text-white transition-all hover:opacity-90`}
                style={{ background: "linear-gradient(135deg, #e61e73, #9333ea)" }}
              >
                Book a Free Call →
              </LocalizedClientLink>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
