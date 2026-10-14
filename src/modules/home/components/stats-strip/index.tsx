"use client"

/*
  ┌──────────────────────────────────────────────────────────────────┐
  │  MOTION IN THIS FILE                                             │
  │                                                                  │
  │  1. Card        → fades up on scroll into view                  │
  │  2. Numbers     → count up from 0 → final value on scroll       │
  │  3. Lines       → width animates 0% → 100% staggered            │
  │  4. Stat blocks → stagger left to right (0.15s apart)           │
  │                                                                  │
  │  DELETED:                                                        │
  │  - useEffect + useRef + useState + IntersectionObserver         │
  │  - Tailwind delay-0/200/500 classes                             │
  │  - transition-all / ease-out on line divs                       │
  └──────────────────────────────────────────────────────────────────┘
*/

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useReducedMotion, type Variants } from "motion/react"
import { Epilogue, Outfit } from "next/font/google"

const epilogue = Epilogue({ subsets: ["latin"], weight: ["700", "800"] })
const outfit   = Outfit({ subsets: ["latin"], weight: ["400", "500"] })

// ── Data ──────────────────────────────────────────────────────────────────────

const stats = [
  {
    number: 5,
    prefix: "+",
    label: "Years of experience",
    color: "#d42cf0",
    lineColor: "#c58cf7",
    glowColor: "rgba(212,44,240,0.18)",
  },
  {
    number: 20,
    prefix: "+",
    label: "Completed projects",
    color: "#ef3a6b",
    lineColor: "#e6678e",
    glowColor: "rgba(239,58,107,0.18)",
  },
  {
    number: 50,
    prefix: "+",
    label: "Agency members",
    color: "#55b8f5",
    lineColor: "#9bdcf8",
    glowColor: "rgba(85,184,245,0.18)",
  },
]

// ── Motion variants ───────────────────────────────────────────────────────────

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 36 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
}

const statBlockVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
}

// ── Counter hook ──────────────────────────────────────────────────────────────
/*
  useCounter — counts from 0 to `target` over `duration` ms.
  Starts only when `active` becomes true (driven by useInView).
  Uses requestAnimationFrame for smooth 60fps counting.
  Returns immediately with target value if prefersReduced is true.
*/
function useCounter(target: number, duration: number, active: boolean, prefersReduced: boolean | null) {
  const [count, setCount] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!active) return
    if (prefersReduced) { setCount(target); return }

    const startTime = performance.now()
    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic — fast start, slows at the end
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, target, duration, prefersReduced])

  return count
}

// ── StatBlock subcomponent ────────────────────────────────────────────────────

function StatBlock({
  stat,
  index,
  isActive,
  prefersReduced,
}: {
  stat: typeof stats[0]
  index: number
  isActive: boolean
  prefersReduced: boolean | null
}) {
  const count = useCounter(stat.number, 1400, isActive, prefersReduced)

  return (
    <motion.div
      className="flex justify-center md:justify-start"
      variants={statBlockVariants}
    >
      <div className="w-full max-w-[290px]">

        {/* Number + label row */}
        <div className="flex items-end gap-3">
          {/*
            Number — renders the counted value.
            Font size scales: 56px mobile → 64px lg.
            Glow sits behind via ::before (CSS drop-shadow on the text).
          */}
          <span
            className={`${epilogue.className} text-[56px] font-extrabold leading-none tracking-[-0.05em] sm:text-[60px] lg:text-[68px]`}
            style={{
              color: stat.color,
              filter: `drop-shadow(0 0 18px ${stat.glowColor})`,
            }}
          >
            {stat.prefix}{count}
          </span>

          <span
            className={`${outfit.className} max-w-[130px] pb-2 text-left text-[17px] font-semibold leading-[1.35]text-slate-600 sm:text-[18px]`}
          >
            {stat.label}
          </span>
        </div>

        {/*
          Animated line — motion.div, width 0% → 100%.
          delay is index * 0.18 so lines draw left to right.
          Only animates when isActive (the card is in view).
        */}
        <div className="mt-5 h-[9px] w-[200px] overflow-hidden rounded-full sm:w-[220px] lg:w-[250px]"
          style={{ background: `${stat.lineColor}30` }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: stat.lineColor }}
            initial={{ width: "0%" }}
            animate={isActive ? { width: "100%" } : { width: "0%" }}
            transition={{
              duration: 0.85,
              delay: 0.2 + index * 0.18,
              ease: [0.16, 1, 0.3, 1] as const,
            }}
          />
        </div>

      </div>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function StatsStrip() {
  const prefersReduced = useReducedMotion()

  /*
    useInView — Motion's built-in hook that returns true when the
    ref element enters the viewport. Replaces useEffect + IntersectionObserver.

    once: false → resets and re-triggers every scroll pass
    amount: 0.4 → fires when 40% of the section is visible
  */
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.4 })

  return (
    <section
      ref={sectionRef}
      /*
        SPACING FIX:
        Original: pt-28 pb-20 md:pt-40 md:pb-24
        The top padding was nearly double the bottom.

        Fixed: symmetric padding — py-16 md:py-20 lg:py-24
        This gives equal visual breathing room above and below the card.
        Adjust py- values to taste, but keep top == bottom.
      */
      className="bg-[#f3f4f6] py-16 md:py-20 lg:py-24"
    >
      <div className="content-container px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1240px]">

          {/*
            CARD — fades up on scroll.
            Motion handles the entrance animation.
            Box shadow stays CSS — no change needed there.
          */}
          <motion.div
            className="relative overflow-hidden rounded-[16px] bg-white px-6 py-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] sm:px-10 md:px-12 md:py-12 lg:px-16 lg:py-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.4 }}
            variants={cardVariants}
          >

            {/* soft paint brush — unchanged */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-70">
              <div className="relative h-[220px] w-[78%] max-w-[760px]">
                <div className="absolute left-[4%] top-[18%] h-[58px] w-[56%] rounded-[999px] bg-[#f2f2f2] blur-[12px]" />
                <div className="absolute left-[18%] top-[30%] h-[64px] w-[62%] rounded-[999px] bg-[#efefef] blur-[14px]" />
                <div className="absolute left-[10%] top-[45%] h-[60px] w-[70%] rounded-[999px] bg-[#f3f3f3] blur-[13px]" />
                <div className="absolute left-[26%] top-[58%] h-[54px] w-[52%] rounded-[999px] bg-[#f0f0f0] blur-[12px]" />
              </div>
            </div>

            {/*
              STATS GRID — parent staggers each StatBlock.
              isInView is passed down so the counter and line
              both start at the right moment.
            */}
            <motion.div
              className="relative grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-12"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={gridVariants}
            >
              {stats.map((stat, i) => (
                <StatBlock
                  key={stat.label}
                  stat={stat}
                  index={i}
                  isActive={isInView}
                  prefersReduced={prefersReduced}
                />
              ))}
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  )
}