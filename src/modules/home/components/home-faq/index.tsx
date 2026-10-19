import { epilogue, outfit, mansalva } from "@lib/fonts"
import { HOME_FAQS, HomeFAQ } from "@lib/data/home-faqs"
import FaqAccordion from "app/(store)/services/[slug]/_components/FaqAccordion"

interface HomeFaqProps {
  faqs?: HomeFAQ[]
}

export default function HomeFaq({ faqs }: HomeFaqProps) {
  const faqList = faqs && faqs.length > 0 ? faqs : HOME_FAQS

  return (
    <section className="relative overflow-hidden bg-[#f7f8fa] py-20 lg:py-24 border-t border-slate-200/60">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-12">
        <div className="mb-10 text-center">
          <p className={`${mansalva.className} text-[20px] text-[#e61e73]`}>
            Frequently Asked Questions
          </p>
          <h2
            className={`${epilogue.className} mt-2 text-[32px] font-extrabold tracking-[-0.04em] text-[#0e2547] sm:text-[40px] lg:text-[46px]`}
          >
            Everything you need to know about Mommantum
          </h2>
          <p className={`${outfit.className} mt-3 text-[16px] text-slate-600 max-w-2xl mx-auto`}>
            Clear answers about our services, office location, and how we help brands scale.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <FaqAccordion faqs={faqList} />
        </div>
      </div>
    </section>
  )
}
