import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import JsonLd from "@modules/common/components/json-ld"
import { getCaseStudies, getCaseStudy } from "@lib/data/case-studies"
import { getSeoSetting } from "@lib/data/seo"
import { resolveCaseStudyData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import { epilogue, outfit, mansalva } from "@lib/fonts"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const studies = await getCaseStudies()
  return studies.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [study, seoSetting] = await Promise.all([
    getCaseStudy(slug),
    getSeoSetting(`work:${slug}`).catch(() => null),
  ])

  if (!study) return {}

  const resolved = resolveCaseStudyData(study, seoSetting)
  return buildMetadataFromResolved(resolved)
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params
  const countryCode = "in"
  const [study, seoSetting] = await Promise.all([
    getCaseStudy(slug),
    getSeoSetting(`work:${slug}`).catch(() => null),
  ])
  if (!study) return notFound()

  const accent = study.accent || "#e61e73"

  return (
    <main className="relative overflow-hidden bg-[#f7f8fa] pt-14 pb-20 lg:pt-20 lg:pb-24">
      <JsonLd type="case-study" data={study} seoSetting={seoSetting} />


      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[4%] top-[10%] h-[140px] w-[420px] rounded-full bg-white/45 blur-3xl" />
        <div className="absolute right-[8%] top-[12%] h-[140px] w-[360px] rounded-full bg-white/35 blur-3xl" />
        <div className="absolute left-[18%] bottom-[10%] h-[120px] w-[420px] rounded-full bg-white/35 blur-3xl" />
      </div>

      <div className="content-container relative px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1320px]">

          {/* Back */}
          <Link
            href="/work"
            className={`${outfit.className} inline-flex items-center gap-2 text-[14px] font-semibold text-slate-400 transition-colors hover:text-[#e61e73]`}
          >
            ← Back to Work
          </Link>

          {/* Header */}
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <p
                className={`${mansalva.className} text-[18px] font-bold`}
                style={{ color: accent }}
              >
                {study.category}
              </p>
              <h1 className={`${epilogue.className} mt-3 text-[36px] font-extrabold leading-[0.97] tracking-[-0.06em] text-[#0e2547] sm:text-[48px] lg:text-[64px]`}>
                {study.title}
              </h1>
              {study.about && (
                <p className={`${outfit.className} mt-5 max-w-[680px] text-[16px] leading-[1.95] text-slate-600`}>
                  {study.about}
                </p>
              )}
            </div>

            {/* Results card */}
            <div className="rounded-[22px] bg-white p-7 shadow-[0_12px_36px_rgba(0,0,0,0.07)]">
              <h2 className={`${epilogue.className} text-[20px] font-extrabold tracking-[-0.04em] text-[#0e2547]`}>
                Results
              </h2>
              <ul className="mt-5 space-y-3">
                {study.results.map((item) => (
                  <li
                    key={item}
                    className={`${outfit.className} flex items-start gap-3 text-[14px] leading-[1.75] text-slate-600`}
                  >
                    <span
                      className="mt-[8px] h-2 w-2 shrink-0 rounded-full"
                      style={{ background: accent }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Image */}
          <div className="mt-10 overflow-hidden rounded-[22px] shadow-[0_16px_48px_rgba(0,0,0,0.10)]">
            <div className="relative aspect-[16/9] w-full bg-[#eef0f2]">
              <Image
                src={study.image}
                alt={study.title}
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 1320px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Challenge */}
          <div className="mt-10 rounded-[22px] bg-white px-8 py-9 shadow-[0_8px_28px_rgba(0,0,0,0.05)] lg:px-12 lg:py-10">
            <p
              className={`${mansalva.className} text-[16px]`}
              style={{ color: accent }}
            >
              The Challenge
            </p>
            <h2 className={`${epilogue.className} mt-2 text-[22px] font-extrabold tracking-[-0.04em] text-[#0e2547] lg:text-[28px]`}>
              What was holding growth back
            </h2>
            <p className={`${outfit.className} mt-4 max-w-[920px] text-[15px] leading-[1.95] text-slate-600`}>
              {study.challenge}
            </p>

            {study.overview && (
              <>
                <div className="my-6 h-[1px] bg-slate-100" />
                <p
                  className={`${mansalva.className} text-[15px]`}
                  style={{ color: accent }}
                >
                  Strategy
                </p>
                <p className={`${outfit.className} mt-3 max-w-[920px] text-[15px] leading-[1.95] text-slate-600`}>
                  {study.overview}
                </p>
              </>
            )}
          </div>

          {/* What we did + Strategy */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[22px] bg-white p-7 shadow-[0_8px_28px_rgba(0,0,0,0.05)] lg:p-10">
              <h3 className={`${epilogue.className} text-[20px] font-extrabold tracking-[-0.04em] text-[#0e2547]`}>
                What We Did
              </h3>
              <ul className="mt-5 space-y-3">
                {study.whatWeDid.map((item) => (
                  <li
                    key={item}
                    className={`${outfit.className} flex items-start gap-3 text-[14px] leading-[1.8] text-slate-600`}
                  >
                    <span
                      className="mt-[9px] h-2 w-2 shrink-0 rounded-full"
                      style={{ background: accent, opacity: 0.8 }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[22px] bg-white p-7 shadow-[0_8px_28px_rgba(0,0,0,0.05)] lg:p-10">
              <h3 className={`${epilogue.className} text-[20px] font-extrabold tracking-[-0.04em] text-[#0e2547]`}>
                Strategy Overview
              </h3>
              <p className={`${outfit.className} mt-5 text-[15px] leading-[1.95] text-slate-600`}>
                {study.solution || study.overview}
              </p>
            </div>
          </div>

          {/* Metrics table */}
          {study.metrics && study.metrics.length > 0 && (
            <div className="mt-6 overflow-hidden rounded-[22px] bg-white shadow-[0_8px_28px_rgba(0,0,0,0.05)]">
              <div className="px-8 pt-8 pb-2 lg:px-10 lg:pt-10">
                <p
                  className={`${mansalva.className} text-[16px]`}
                  style={{ color: accent }}
                >
                  By the numbers
                </p>
                <h3 className={`${epilogue.className} mt-1 text-[20px] font-extrabold tracking-[-0.04em] text-[#0e2547]`}>
                  Before vs After
                </h3>
              </div>

              <div className="overflow-x-auto px-8 pb-8 lg:px-10 lg:pb-10">
                <table className="mt-6 w-full min-w-[420px] border-collapse">
                  <thead>
                    <tr>
                      <th className={`${epilogue.className} border-b border-slate-100 pb-3 text-left text-[11px] font-extrabold uppercase tracking-[0.07em] text-slate-400`}>
                        Metric
                      </th>
                      <th className={`${epilogue.className} border-b border-slate-100 pb-3 text-center text-[11px] font-extrabold uppercase tracking-[0.07em] text-slate-400`}>
                        Before
                      </th>
                      <th
                        className={`${epilogue.className} border-b border-slate-100 pb-3 text-center text-[11px] font-extrabold uppercase tracking-[0.07em]`}
                        style={{ color: accent }}
                      >
                        After
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {study.metrics.map((row, i) => (
                      <tr key={row.label} className={i % 2 === 0 ? "bg-[#fafafa]" : "bg-white"}>
                        <td className={`${outfit.className} rounded-l-[8px] py-3.5 pl-3 text-[13px] font-semibold text-slate-700`}>
                          {row.label}
                        </td>
                        <td className={`${outfit.className} py-3.5 text-center text-[13px] text-slate-400 line-through`}>
                          {row.before}
                        </td>
                        <td
                          className={`${epilogue.className} rounded-r-[8px] py-3.5 text-center text-[14px] font-extrabold`}
                          style={{ color: accent }}
                        >
                          {row.after}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Insights */}
          {study.insights && (
            <div className="mt-6 rounded-[22px] bg-white px-8 py-8 shadow-[0_8px_28px_rgba(0,0,0,0.05)] lg:px-10 lg:py-10">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[10px] text-white"
                  style={{ background: `linear-gradient(135deg, ${accent}, #9333ea)` }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    />
                    <path d="M9 21h6M10 18v3M14 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <h3 className={`${epilogue.className} text-[18px] font-extrabold tracking-[-0.03em] text-[#0e2547]`}>
                    Key Insight
                  </h3>
                  <p className={`${outfit.className} mt-3 text-[15px] leading-[1.95] text-slate-600`}>
                    {study.insights}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom CTA */}
          <div
            className="mt-12 overflow-hidden rounded-[22px] p-8 text-center lg:p-10"
            style={{ background: "linear-gradient(135deg, #0e2547 0%, #1a3a6b 60%, #0e2547 100%)" }}
          >
            <p className={`${mansalva.className} text-[16px] text-[#ef6a99]`}>
              Want results like this?
            </p>
            <h3 className={`${epilogue.className} mt-2 text-[22px] font-extrabold tracking-[-0.04em] text-white lg:text-[30px]`}>
              Let&apos;s build your growth system
            </h3>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/work"
                className={`${epilogue.className} inline-flex h-[44px] items-center justify-center rounded-[12px] border border-white/20 px-6 text-[12px] font-extrabold uppercase tracking-[0.04em] text-white transition-all hover:bg-white/10`}
              >
                ← View More Work
              </Link>
              <Link
                href="/contact"
                className={`${epilogue.className} inline-flex h-[44px] items-center justify-center rounded-[12px] px-6 text-[12px] font-extrabold uppercase tracking-[0.04em] text-white transition-all hover:opacity-90`}
                style={{ background: "linear-gradient(135deg, #e61e73, #9333ea)" }}
              >
                Let&apos;s Make It Happen →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}