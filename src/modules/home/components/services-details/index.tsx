export default function ServicesDetails() {
  return (
    <section className="w-full bg-white py-20 lg:py-24">
      <div className="content-container lg:px-10">
        <div className="mx-auto max-w-[900px] space-y-14">
          <div id="creative-production" className="scroll-mt-28 border-t border-neutral-300 pt-10">
            <h3 className="text-[30px] font-semibold text-black">Creative Production</h3>
            <p className="mt-4 text-[18px] leading-8 text-neutral-700">
              We create content engineered to convert and strengthen your brand presence.
            </p>
          </div>

          <div id="performance-marketing" className="scroll-mt-28 border-t border-neutral-300 pt-10">
            <h3 className="text-[30px] font-semibold text-black">Performance Marketing</h3>
            <p className="mt-4 text-[18px] leading-8 text-neutral-700">
              Profit-focused ad systems across Meta and Google, backed by testing and optimization.
            </p>
          </div>

          <div id="growth-enablement" className="scroll-mt-28 border-t border-b border-neutral-300 py-10">
            <h3 className="text-[30px] font-semibold text-black">Growth Enablement</h3>
            <p className="mt-4 text-[18px] leading-8 text-neutral-700">
              The strategic backbone of your brand, from analytics to optimization and roadmap planning.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}