import Link from "next/link"
import Image from "next/image"
import { Epilogue, Outfit, Mansalva } from "next/font/google"

const epilogue = Epilogue({ subsets: ["latin"], weight: ["700", "800"] })
const outfit   = Outfit({ subsets: ["latin"], weight: ["400", "500", "700"] })
const mansalva = Mansalva({ subsets: ["latin"], weight: ["400"] })

type AccentKey = "rose" | "violet" | "sky"

interface CaseStudy {
  id: string
  brand: string
  category: string
  challenge: string
  whatWeDid: string[]
  results: string[]
  accent: AccentKey
  /** Accepts .jpg, .jpeg, .png, or .webp — Next.js Image handles all formats */
  image: string
  imageAlt: string
}

const caseStudies: CaseStudy[] = [
  {
    id: "jalvayu-wellness",
    brand: "Jalvayu Wellness",
    category: "Eco-friendly D2C / Incense",
    challenge:
      "Strong product, but lacked high-performing creatives and consistent revenue.",
    whatWeDid: [
      "Created storytelling-led creative strategy",
      "Shot performance-focused content",
      "Built Meta conversion funnels",
      "Improved landing page clarity",
    ],
    results: ["2× revenue in 45 days", "28% lower CAC", "Multiple winning creatives"],
    accent: "rose",
    image: "/images/work/jalvayu.webp",
    imageAlt: "Jalvayu Wellness — campaign visual",
  },
  {
    id: "the-kids-store",
    brand: "The Kids Store",
    category: "Ecommerce / Apparel",
    challenge: "Low visibility and weak inbound pipeline.",
    whatWeDid: [
      "Shot reels and product videos",
      "Built consistent content strategy",
      "Improved brand clarity",
      "Created better social storytelling",
    ],
    results: ["Higher inbound interest", "Better content consistency", "Stronger digital presence"],
    accent: "violet",
    image: "/images/work/electroglobal.webp",
    imageAlt: "The Kids Store — product and content visual",
  },
  {
    id: "urban-vada-pav",
    brand: "Urban Vada Pav",
    category: "QSR / F&B",
    challenge:
      "Strong offline presence, but needed digital visibility and flavour-focused content.",
    whatWeDid: [
      "Shot high-engagement reels",
      "Highlighted signature flavours",
      "Ran hyper-local Meta campaigns",
      "Improved social visibility",
    ],
    results: ["5× footfall growth", "Higher local awareness", "Better campaign traction"],
    accent: "sky",
    image: "/images/work/urbanvada.webp",
    imageAlt: "Urban Vada Pav — food and outlet visual",
  },
]

interface AccentStyle {
  glow: string
  soft: string
  text: string
  border: string
  overlay: string
  tag: string
}

const accentStyles: Record<AccentKey, AccentStyle> = {
  rose: {
    glow:    "bg-rose-200/40",
    soft:    "bg-rose-50",
    text:    "text-rose-500",
    border:  "border-rose-200/60",
    overlay: "from-rose-900/30 via-transparent to-transparent",
    tag:     "bg-rose-500",
  },
  violet: {
    glow:    "bg-violet-200/40",
    soft:    "bg-violet-50",
    text:    "text-violet-500",
    border:  "border-violet-200/60",
    overlay: "from-violet-900/30 via-transparent to-transparent",
    tag:     "bg-violet-500",
  },
  sky: {
    glow:    "bg-sky-200/40",
    soft:    "bg-sky-50",
    text:    "text-sky-500",
    border:  "border-sky-200/60",
    overlay: "from-sky-900/30 via-transparent to-transparent",
    tag:     "bg-sky-500",
  },
}

export default function OurWork() {
  return (
    <section className="relative w-full overflow-hidden bg-[#f7f7f7] py-24 lg:py-28">
      {/* background deco */}
      <div className="absolute left-[8%] top-[12%] h-24 w-24 rounded-full bg-violet-200/30 blur-3xl" />
      <div className="absolute right-[8%] top-[16%] h-24 w-24 rounded-full bg-rose-200/30 blur-3xl" />
      <div className="absolute left-[6%] top-[30%] rotate-[-15deg] text-[54px] leading-none text-violet-400/70">
        ≈
      </div>
      <div className="absolute right-[8%] bottom-[20%] rotate-[12deg] text-[58px] leading-none text-sky-400/70">
        ≋
      </div>

      <div className="content-container relative lg:px-10">
        <div className="mx-auto max-w-[1320px]">

          {/* ── Section heading (inline — no external component needed) ── */}
          <div className="mb-4 flex flex-col gap-2">
            <p className={`${mansalva.className} text-[18px] text-[#e61e73]`}>
              our portfolio
            </p>
            <h2
              className={`${epilogue.className} text-[36px] font-extrabold leading-[0.95] tracking-[-0.05em] text-[#0e2547] sm:text-[48px] lg:text-[60px]`}
            >
              Our{" "}
              <span className="relative inline-block">
                Work
                <span className="absolute bottom-[4px] left-0 -z-10 h-[12px] w-[110%] bg-[#ef6a99]" />
              </span>
            </h2>
            <p className={`${outfit.className} mt-2 text-[15px] font-500 text-slate-400`}>
              Case studies built on real strategy and measurable growth
            </p>
            <p className={`${outfit.className} text-[14px] text-slate-400`}>
              A closer look at how creative, performance, and positioning came together for real brands
            </p>
          </div>

          {/* ── Cards ── */}
          <div className="mt-16 space-y-10">
            {caseStudies.map((item, index) => {
              const accent  = accentStyles[item.accent]
              const reverse = index % 2 === 1

              return (
                <div
                  key={item.id}
                  className="grid items-stretch gap-6 overflow-hidden rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)] lg:grid-cols-12 lg:p-8"
                >
                  {/* ── Left: text ── */}
                  <div className={`lg:col-span-7 ${reverse ? "lg:order-2" : ""}`}>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${accent.soft} ${accent.text} text-lg`}
                      >
                        ★
                      </span>
                      <h3
                        className={`${epilogue.className} text-[28px] font-bold tracking-tight text-slate-900`}
                      >
                        {item.brand}
                      </h3>
                    </div>

                    <p className={`${outfit.className} mt-5 text-[15px] leading-7 text-slate-600`}>
                      <span className="font-semibold text-slate-900">Category:</span>{" "}
                      {item.category}
                    </p>

                    <p className={`${outfit.className} mt-3 text-[15px] leading-7 text-slate-600`}>
                      <span className="font-semibold text-slate-900">Challenge:</span>{" "}
                      {item.challenge}
                    </p>

                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                      <div>
                        <h4
                          className={`${epilogue.className} text-[18px] font-semibold text-slate-900`}
                        >
                          What We Did
                        </h4>
                        <ul className={`${outfit.className} mt-3 space-y-2 text-[15px] leading-7 text-slate-600`}>
                          {item.whatWeDid.map((point) => (
                            <li key={point}>• {point}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4
                          className={`${epilogue.className} text-[18px] font-semibold text-slate-900`}
                        >
                          Results
                        </h4>
                        <ul className={`${outfit.className} mt-3 space-y-2 text-[15px] leading-7 text-slate-600`}>
                          {item.results.map((point) => (
                            <li key={point}>• {point}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Link
                      href={`/work/${item.id}`}
                      className={`${outfit.className} mt-7 inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-3 text-[15px] font-semibold text-slate-900 transition hover:border-rose-200 hover:text-rose-500`}
                    >
                      View case study
                      <span className="ml-2">→</span>
                    </Link>
                  </div>

                  {/* ── Right: image panel ── */}
                  <div className={`relative lg:col-span-5 ${reverse ? "lg:order-1" : ""}`}>
                    <div
                      className={`relative flex h-full min-h-[280px] overflow-hidden rounded-[24px] border ${accent.border}`}
                    >
                      {/*
                        next/image natively serves WebP to browsers that support it,
                        regardless of the source format (.jpg, .png, .webp).
                        If your file IS already a .webp, it's served as-is (no double conversion).
                        The `sizes` prop ensures the correct srcSet is generated for the layout.
                      */}
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                      />

                      {/* gradient overlay */}
                      <div
                        className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${accent.overlay}`}
                      />

                      {/* corner glow */}
                      <div
                        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full ${accent.glow} blur-3xl`}
                      />

                      {/* "Featured Case" chip — top right */}
                      <div className="absolute right-4 top-4 z-10 rounded-full bg-white/90 px-4 py-1.5 text-[12px] font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
                        Featured Case
                      </div>

                      {/* brand name chip — bottom left */}
                      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${accent.tag}`} />
                        <span className="rounded-full bg-white/90 px-3 py-1 text-[12px] font-semibold text-slate-800 shadow-sm backdrop-blur-sm">
                          {item.brand}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Bottom CTA ── */}
          <div className="mt-14 text-center">
            <Link
              href="/work"
              className={`${outfit.className} inline-flex items-center rounded-full border border-rose-200 bg-white px-6 py-3 text-[15px] font-semibold text-slate-900 shadow-sm transition hover:text-rose-500`}
            >
              More case studies
              <span className="ml-2">→</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}