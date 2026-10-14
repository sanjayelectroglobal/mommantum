export default function SectionHeading({
  title,
  highlight,
  subtitle,
  desc,
}: {
  title: string
  highlight?: string
  subtitle?: string
  desc?: string
}) {
  return (
    <div className="relative mx-auto max-w-[980px] text-center">
      {/* soft background glow */}
      <div className="absolute left-1/2 top-10 h-28 w-[420px] -translate-x-1/2 rounded-full bg-rose-200/30 blur-3xl" />
      <div className="absolute right-[18%] top-0 h-20 w-20 rounded-full bg-sky-200/30 blur-2xl" />
      <div className="absolute left-[16%] top-8 h-16 w-16 rounded-full bg-violet-200/30 blur-2xl" />

      {/* scribble */}
      <div className="absolute left-[6%] top-[18px] rotate-[-12deg] text-[46px] leading-none text-violet-400/70">
        ≈
      </div>

      {/* tab heading */}
      <div className="relative inline-flex items-center justify-center rounded-[32px] border border-white/70 bg-white/80 px-8 py-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm lg:px-12 lg:py-6">
        <h2 className="text-[34px] font-bold leading-none tracking-tight text-slate-900 lg:text-[58px]">
          {title}{" "}
          {highlight && <span className="text-rose-500">{highlight}</span>}
        </h2>
      </div>

      {/* subtitle */}
      {subtitle && (
        <p className="mt-8 text-[20px] font-semibold leading-tight text-slate-800 lg:text-[30px] lg:whitespace-nowrap">
          {subtitle}
        </p>
      )}

      {/* desc */}
      {desc && (
        <p className="mx-auto mt-4 max-w-[920px] text-[16px] leading-7text-slate-600 lg:text-[18px] lg:whitespace-nowrap">
          {desc}
        </p>
      )}
    </div>
  )
}