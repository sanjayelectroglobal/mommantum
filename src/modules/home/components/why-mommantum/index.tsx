"use client"

import React, { useEffect, useRef, useState } from "react"
import { WandSparkles, TrendingUp, Users, Clock3, Eye } from "lucide-react"
import { motion, type Variants } from "motion/react"
import { Epilogue, Outfit } from "next/font/google"

const epilogue = Epilogue({ subsets: ["latin"], weight: ["700", "800"] })
const outfit   = Outfit({ subsets: ["latin"], weight: ["400", "500"] })

const topItems = [
  {
    Icon: WandSparkles,
    accent: "sky",
    title: "Growth Alignment",
    text: "Growth works only when everything moves together. Most agencies focus only on ads or creatives. As a performance marketing company we align strategy, content, and campaigns so your brand grows as one system.",
  },
  {
    Icon: TrendingUp,
    accent: "pink",
    title: "Outcomes That Matter",
    text: "We focus on results that actually grow your business — not just reports. Better conversions, lower CAC, higher ROAS, CRO, stronger retention, and consistent revenue growth.",
  },
  {
    Icon: Users,
    accent: "green",
    title: "A Skilled, D2C-Focused Team",
    text: "Work with a team that understands modern brand growth. As a branding and marketing agency, we bring strategy, creatives, and performance together under one roof.",
  },
] as const

const bottomItems = [
  {
    Icon: Clock3,
    accent: "violet",
    title: "Predictable Execution",
    text: "Clear process, fixed timelines, and simple reporting so you always know what's done, what's working, and what comes next.",
  },
  {
    Icon: Eye,
    accent: "pink",
    title: "Total Transparency",
    text: "We keep everything clear and honest. If you're looking for a branding agency in India, we ensure open communication and full visibility at every stage.",
  },
] as const

const accentStyles = {
  sky:    { icon: "text-[#163b67]", scribble: "text-sky-300" },
  pink:   { icon: "text-[#163b67]", scribble: "text-pink-300" },
  green:  { icon: "text-[#163b67]", scribble: "text-emerald-300" },
  violet: { icon: "text-[#163b67]", scribble: "text-violet-300" },
} as const

const blobs = [
  { x: "left-[10%]",  y: "top-[8%]",     w: 480, h: 80,  color: "bg-purple-200/40",  blur: "blur-3xl" },
  { x: "right-[6%]",  y: "top-[14%]",    w: 360, h: 72,  color: "bg-fuchsia-200/30", blur: "blur-3xl" },
  { x: "left-[-2%]",  y: "top-[40%]",    w: 340, h: 64,  color: "bg-white/50",       blur: "blur-2xl" },
  { x: "left-[30%]",  y: "top-[32%]",    w: 500, h: 88,  color: "bg-white/35",       blur: "blur-2xl" },
  { x: "right-[-4%]", y: "top-[44%]",    w: 320, h: 60,  color: "bg-sky-100/40",     blur: "blur-2xl" },
  { x: "left-[8%]",   y: "bottom-[18%]", w: 400, h: 72,  color: "bg-white/40",       blur: "blur-2xl" },
  { x: "left-[38%]",  y: "bottom-[8%]",  w: 460, h: 68,  color: "bg-fuchsia-100/30", blur: "blur-3xl" },
  { x: "right-[10%]", y: "bottom-[16%]", w: 340, h: 64,  color: "bg-purple-100/35",  blur: "blur-2xl" },
] as const

function FeatureItem({
  Icon, title, text, accent,
}: {
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  title: string; text: string; accent: keyof typeof accentStyles
}) {
  const s = accentStyles[accent]
  return (
    <div className="text-center">
      <div className="relative mx-auto mb-5 flex h-[92px] items-center justify-center">
        <div className={`absolute rotate-[-16deg] text-[58px] leading-none ${s.scribble}`}>≋</div>
        <div className={`relative z-10 ${s.icon}`}>
          <Icon strokeWidth={2.25} className="h-[54px] w-[54px]" />
        </div>
      </div>
      <h3 className={`${epilogue.className} text-[22px] font-extrabold tracking-[-0.03em] text-[#0e2547] lg:text-[24px]`}>
        {title}
      </h3>
      <p className={`${outfit.className} mx-auto mt-3 max-w-[380px] text-[15px] leading-[1.85]text-slate-600 lg:text-[16px]`}>
        {text}
      </p>
    </div>
  )
}

export default function WhyMommantum() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = headingRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActive(false)
            requestAnimationFrame(() => requestAnimationFrame(() => setActive(true)))
          } else if (!entry.isIntersecting) {
            setActive(false)
          }
        })
      },
      { root: null, rootMargin: "0px 0px -80px 0px", threshold: [0, 0.5, 1] }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative overflow-hidden bg-[#f3f4f6] py-16 lg:py-20">
      <style>{`
        @keyframes paintStroke {
          0%   { width:0%;   opacity:0; transform:scaleY(0.4) translateX(-4px); filter:blur(3px); }
          15%  {             opacity:1; transform:scaleY(1.15) translateX(0px);  filter:blur(1px); }
          60%  { width:102%;            transform:scaleY(1)    translateX(0px);  filter:blur(0px); }
          78%  { width:107%;            transform:scaleY(0.85); }
          88%  { width:100%;            transform:scaleY(1); }
          100% { width:100%; opacity:1; transform:scaleY(1)    translateX(0px);  filter:blur(0px); }
        }
        @keyframes glowPulse {
          0%,100% { box-shadow:0 2px 8px rgba(168,85,247,0.35),0 0px 0px rgba(168,85,247,0); }
          50%      { box-shadow:0 2px 14px rgba(168,85,247,0.65),0 4px 24px rgba(192,38,211,0.3); }
        }
        .heading-underline {
          display:block; height:13px; border-radius:3px;
          background:linear-gradient(90deg,#7c3aed 0%,#a855f7 35%,#c026d3 65%,#e11d78 100%);
          width:0%; opacity:0; margin:4px auto 0; transform-origin:left center;
        }
        .heading-underline.active {
          animation:
            paintStroke 0.7s cubic-bezier(0.16,1,0.3,1) forwards,
            glowPulse 2.2s ease-in-out 0.65s infinite;
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        {blobs.map((b, i) => (
          <div key={i}
            className={`absolute rounded-[999px] ${b.x} ${b.y} ${b.color} ${b.blur}`}
            style={{ width: b.w, height: b.h }}
          />
        ))}
      </div>

      <div className="content-container relative lg:px-10">
        <div className="mx-auto max-w-[980px] text-center">
          <h2
            ref={headingRef}
            className={`${epilogue.className} inline-block text-[44px] font-extrabold tracking-[-0.04em] text-[#0e2547] lg:text-[56px]`}
          >
            Why Mommantum?
            <span className={`heading-underline${active ? " active" : ""}`} />
          </h2>
          <p className={`${outfit.className} mx-auto mt-5 max-w-[700px] text-[17px] leading-8text-slate-600 lg:text-[18px]`}>
            Focused on Real Business Growth — because predictable D2C growth
            requires alignment, and that&apos;s what we deliver.
          </p>
        </div>

        <motion.div
          className="mx-auto mt-16 grid max-w-[1320px] gap-x-10 gap-y-12 md:grid-cols-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4 }}
        >
          {topItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <FeatureItem {...item} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mx-auto mt-12 grid max-w-[920px] gap-x-12 gap-y-12 md:grid-cols-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4 }}
        >
          {bottomItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <FeatureItem {...item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}