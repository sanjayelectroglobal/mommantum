"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { motion, useReducedMotion, type Variants } from "motion/react"
import { TrendingUp, Globe, Megaphone, Bot, Video, Zap, PenTool, BarChart3 } from "lucide-react"
import { Epilogue, Outfit } from "next/font/google"

const epilogue = Epilogue({ subsets: ["latin"], weight: ["700", "800"] })
const outfit   = Outfit({ subsets: ["latin"], weight: ["400", "500", "700"] })

const skills = [
  { title: "Performance Ads",   Icon: TrendingUp,  color: "#e61e73", bg: "#fff0f6", bgHover: "#fce7f3", border: "#fbb6d4", link: "/services/performance-marketing" },
  { title: "SEO & AEO",         Icon: BarChart3,   color: "#9333ea", bg: "#f5eeff", bgHover: "#e9d5ff", border: "#d8b4fe", link: "/services/search-engine-optimization" },
  { title: "Web Development",   Icon: Globe,       color: "#0ea5e9", bg: "#e8f6ff", bgHover: "#c8e8f8", border: "#7dd3fc", link: "/services/web-app-development" },
  { title: "Copywriting",       Icon: PenTool,     color: "#f59e0b", bg: "#fffbeb", bgHover: "#fef9c3", border: "#fde68a", link: "/services/script-copywriting" },
  { title: "Social Media",      Icon: Megaphone,   color: "#e61e73", bg: "#fff0f6", bgHover: "#fce7f3", border: "#fbb6d4", link: "/services/social-media-marketing" },
  { title: "AI Automation",     Icon: Bot,         color: "#49d7a4", bg: "#e8fdf5", bgHover: "#bbf7d0", border: "#6ee7b7", link: "/services/ai-automation" },
  { title: "AI Agents",         Icon: Zap,         color: "#9333ea", bg: "#f5eeff", bgHover: "#e9d5ff", border: "#d8b4fe", link: "/services/ai-agentic-service" },
  { title: "AI Video",          Icon: Video,       color: "#0ea5e9", bg: "#e8f6ff", bgHover: "#c8e8f8", border: "#7dd3fc", link: "/services/ai-video-generation" },
]

const SparkIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 80 80" fill="none">
    <path d="M40 8 L44 34 L68 28 L48 44 L62 66 L40 52 L18 66 L32 44 L12 28 L36 34 Z"
      stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" fill="none" />
    <circle cx="40" cy="40" r="5" fill="currentColor" opacity="0.3" />
    <path d="M40 2 L40 14 M40 66 L40 78 M2 40 L14 40 M66 40 L78 40"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
  </svg>
)

const GrowthArrow = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 80 80" fill="none">
    <path d="M10 65 L28 42 L44 52 L68 18"
      stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M54 14 L72 14 L72 32"
      stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="28" cy="42" r="4" fill="currentColor" opacity="0.4" />
    <circle cx="44" cy="52" r="4" fill="currentColor" opacity="0.4" />
  </svg>
)

const ChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 80 80" fill="none">
    <rect x="8" y="44" width="14" height="26" rx="4" stroke="currentColor" strokeWidth="3.5" fill="none" />
    <rect x="28" y="28" width="14" height="42" rx="4" stroke="currentColor" strokeWidth="3.5" fill="none" />
    <rect x="48" y="14" width="14" height="56" rx="4" stroke="currentColor" strokeWidth="3.5" fill="none" />
    <path d="M6 74 L74 74" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
  </svg>
)

const LightningIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 60 80" fill="none">
    <path d="M36 4 L10 44 L28 44 L24 76 L50 36 L32 36 Z"
      stroke="currentColor" strokeWidth="4" strokeLinejoin="round" fill="none" />
    <path d="M44 10 L48 4 M52 22 L58 18 M50 36 L56 34"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
  </svg>
)

const GoalsText = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 130 52" fill="none">
    <text x="4" y="42"
      fontFamily="'Epilogue','Arial Black',sans-serif"
      fontWeight="800" fontSize="40" fill="#f43f8e" letterSpacing="-1">
      GOALS
    </text>
  </svg>
)

const leftColVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
}
const fadeUpVariants: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
}
const doodleContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

const MotionLink = motion.create(Link)

export default function WhoWeAre() {
  const prefersReduced = useReducedMotion()
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null)

  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-20">
      <style>{`
        .skill-card {
          display: flex; flex-direction: column; align-items: flex-start;
          gap: 10px; padding: 14px 14px 16px; border-radius: 14px;
          cursor: default; transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        }
        .skill-card .skill-title { font-size: 13px; font-weight: 700; color: #0e2547; line-height: 1.3; }
        .btn-more {
          position: relative; display: inline-flex; align-items: center; gap: 10px;
          padding: 15px 32px; border-radius: 14px; font-size: 15px; font-weight: 700;
          letter-spacing: 0.04em; text-transform: uppercase; color: #fff;
          text-decoration: none; background: #49d7a4; overflow: hidden;
        }
        .btn-more::before {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%);
          transform: translateX(-100%); transition: transform 0.45s ease;
        }
        .btn-more:hover::before { transform: translateX(100%); }
        .btn-more .arrow { display: inline-block; transition: transform 0.22s ease; }
        .btn-more:hover .arrow { transform: translateX(5px); }
      `}</style>

      <div className="content-container relative lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">

          {/* LEFT */}
          <motion.div
            className="max-w-[760px]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={leftColVariants}
          >
            <motion.p
              className={`${outfit.className} text-[20px] font-bold tracking-[-0.03em] text-[#49d7a4] lg:text-[26px]`}
              variants={fadeUpVariants}
            >
              Performance Marketing & Web Solutions
            </motion.p>

            <motion.div className="mt-3 inline-block" variants={fadeUpVariants}>
              <h2 className={`${epilogue.className} text-[42px] font-extrabold leading-none tracking-[-0.05em] text-[#0e2547] lg:text-[58px]`}>
                Who we are
              </h2>
              <motion.span
                style={{
                  display: "block", height: "10px", borderRadius: "3px",
                  background: "#49d7a4", marginTop: "8px", transformOrigin: "left center",
                  boxShadow: "0 2px 6px rgba(73,215,164,0.3)",
                }}
                initial={{ width: "0%", opacity: 0 }}
                whileInView={{ width: "100%", opacity: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.65, delay: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
              />
            </motion.div>

            <motion.p
              className={`${outfit.className} mt-6 max-w-[640px] text-[16px] leading-[1.9] text-slate-600 lg:text-[18px]`}
              variants={fadeUpVariants}
            >
              We provide performance marketing services and web solutions in India
              to help D2C brands grow with clear positioning, better conversions,
              and systems built to scale revenue.
            </motion.p>

            <motion.h3
              className={`${epilogue.className} mt-10 text-[28px] font-extrabold tracking-[-0.04em] text-[#0e2547] lg:text-[36px]`}
              variants={fadeUpVariants}
            >
              What we do:
            </motion.h3>

            {/* Skills grid */}
            <motion.div
              className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06 } },
              } satisfies Variants}
            >
              {skills.map(({ title, Icon, color, bg, bgHover, border, link }, i) => {
                const isHov = hoveredSkill === i
                return (
                  <LocalizedClientLink key={title} href={link} className="block select-none">
                    <motion.div
                      className="skill-card cursor-pointer"
                      style={{
                        border: `1.5px solid ${isHov ? color : border}`,
                        background: isHov ? bgHover : bg,
                        boxShadow: isHov ? "0 6px 20px rgba(15,23,42,0.08)" : "none",
                      }}
                      variants={{
                        hidden:   { opacity: 0, y: 20, scale: 0.94 },
                        visible:  { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
                      } satisfies Variants}
                      whileHover={prefersReduced ? {} : { y: -6, scale: 1.04, transition: { duration: 0.18 } }}
                      whileTap={prefersReduced ? {} : { scale: 0.97 }}
                      onMouseEnter={() => setHoveredSkill(i)}
                      onMouseLeave={() => setHoveredSkill(null)}
                    >
                      <div style={{ color }}>
                        <Icon className="h-[28px] w-[28px]" strokeWidth={2.2} />
                      </div>
                      <p className="skill-title">{title}</p>
                    </motion.div>
                  </LocalizedClientLink>
                )
              })}
            </motion.div>

            <motion.div variants={fadeUpVariants} className="mt-10">
              <MotionLink
                href="/about"
                className={`${outfit.className} btn-more`}
                whileHover={prefersReduced ? {} : {
                  y: -3, scale: 1.02,
                  boxShadow: "0 8px 28px rgba(73,215,164,0.5)",
                  transition: { duration: 0.22 },
                }}
                whileTap={prefersReduced ? {} : {
                  y: 0, scale: 0.99,
                  transition: { duration: 0.1 },
                }}
              >
                More About Us
                <span className="arrow">→</span>
              </MotionLink>
            </motion.div>
          </motion.div>

          {/* RIGHT — image + doodles */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[520px]">
              <div className="flex items-end justify-center">
                <Image
                  src="/who-we-are-person.png"
                  alt="Who we are — Mommantum team"
                  width={430}
                  height={525}
                  sizes="(max-width: 640px) 260px, (max-width: 1024px) 320px, 420px"
                  className="h-auto w-[260px] object-contain sm:w-[320px] lg:w-[420px]"
                />
              </div>

              <motion.div
                className="absolute inset-0"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={doodleContainerVariants}
              >
                <motion.div
                  className="absolute right-[14%] top-[2%] w-[32px] text-[#386edc] sm:w-[42px] lg:w-[54px]"
                  variants={{ hidden: { opacity: 0, scale: 0.4, rotate: -30 }, visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } } } satisfies Variants}
                  whileHover={prefersReduced ? {} : { scale: 1.2, rotate: 20, transition: { duration: 0.22 } }}
                >
                  <SparkIcon />
                </motion.div>

                <motion.div
                  className="absolute left-[4%] top-[32%] w-[60px] sm:w-[80px] lg:w-[110px]"
                  variants={{ hidden: { opacity: 0, x: -30, rotate: -16, scale: 0.8 }, visible: { opacity: 1, x: 0, rotate: -8, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } } } satisfies Variants}
                  whileHover={prefersReduced ? {} : { scale: 1.1, rotate: -4, transition: { duration: 0.22 } }}
                >
                  <GoalsText />
                </motion.div>

                <motion.div
                  className="absolute right-[10%] top-[26%] w-[32px] text-[#7c3aed] sm:w-[42px] lg:w-[56px]"
                  variants={{ hidden: { opacity: 0, y: -20, x: 10, scale: 0.6 }, visible: { opacity: 1, y: 0, x: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } } } satisfies Variants}
                  whileHover={prefersReduced ? {} : { scale: 1.15, rotate: -8, transition: { duration: 0.2 } }}
                >
                  <GrowthArrow />
                </motion.div>

                <motion.div
                  className="absolute bottom-[14%] left-[6%] w-[34px] text-[#38bdf8] sm:w-[44px] lg:w-[58px]"
                  variants={{ hidden: { opacity: 0, x: -20, y: 20, scale: 0.6 }, visible: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } } } satisfies Variants}
                  whileHover={prefersReduced ? {} : { scale: 1.12, y: -4, transition: { duration: 0.22 } }}
                >
                  <ChartIcon />
                </motion.div>

                <motion.div
                  className="absolute bottom-[10%] right-[12%] w-[28px] text-[#f43f8e] sm:w-[36px] lg:w-[48px]"
                  variants={{ hidden: { opacity: 0, x: 20, y: 20, scale: 0.6 }, visible: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } } } satisfies Variants}
                  whileHover={prefersReduced ? {} : { scale: 1.15, rotate: 10, transition: { duration: 0.2 } }}
                >
                  <LightningIcon />
                </motion.div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}