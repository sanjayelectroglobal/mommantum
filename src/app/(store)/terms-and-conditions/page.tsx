import { Metadata } from "next"
import { Epilogue, Outfit, Mansalva } from "next/font/google"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getSeoSetting } from "@lib/data/seo"
import { resolveLegalPageData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import JsonLd from "@modules/common/components/json-ld"

const epilogue = Epilogue({ subsets: ["latin"], weight: ["700", "800"] })
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500"] })
const mansalva = Mansalva({ subsets: ["latin"], weight: ["400"] })

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const seoSetting = await getSeoSetting("terms-and-conditions").catch(() => null)
  const resolved = resolveLegalPageData(
    "terms-and-conditions",
    "Terms & Conditions | Mommantum",
    "Read the terms and conditions for using Mommantum services and website.",
    seoSetting
  )
  return buildMetadataFromResolved(resolved)
}

export default async function TermsAndConditionsPage() {
  const seoSetting = await getSeoSetting("terms-and-conditions").catch(() => null)

  return (
    <main className="relative overflow-hidden bg-[#f7f8fa] pt-14 pb-20 lg:pt-20 lg:pb-24">
      <JsonLd
        type="page"
        slug="terms-and-conditions"
        title="Terms & Conditions | Mommantum"
        description="Read the terms and conditions for using Mommantum services and website."
        seoSetting={seoSetting}
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[4%] top-[8%] h-[140px] w-[420px] rounded-full bg-white/45 blur-3xl" />
        <div className="absolute right-[8%] top-[12%] h-[140px] w-[360px] rounded-full bg-white/35 blur-3xl" />
      </div>

      <div className="content-container relative px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[860px]">

          <LocalizedClientLink
            href="/"
            className={`${outfit.className} inline-flex items-center gap-2 text-[14px] font-semibold text-slate-400 transition-colors hover:text-[#e61e73]`}
          >
            ← Back to Home
          </LocalizedClientLink>

          <div className="mt-8">
            <p className={`${mansalva.className} text-[18px] text-[#e61e73]`}>
              Legal
            </p>
            <h1 className={`${epilogue.className} mt-2 text-[36px] font-extrabold tracking-[-0.05em] text-[#0e2547] sm:text-[48px]`}>
              Terms & Conditions
            </h1>
            <p className={`${outfit.className} mt-3 text-[14px] text-slate-400`}>
              Last updated: May 2026
            </p>
          </div>

          <div className="mt-10 space-y-5">
            {[
              {
                title: "1. Acceptance of Terms",
                content: `By accessing or using the Mommantum website or engaging our services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website or services.`,
              },
              {
                title: "2. Services",
                content: `Mommantum provides digital marketing, SEO, content, web development, and AI-related services for businesses. The scope, timeline, and deliverables for any engagement are agreed upon separately through a proposal or agreement between Mommantum and the client.`,
              },
              {
                title: "3. Client Responsibilities",
                content: `Clients are responsible for providing accurate information, timely feedback, and any materials or assets required for the delivery of services. Delays caused by the client may affect project timelines and Mommantum will not be held responsible for such delays.`,
              },
              {
                title: "4. Payments",
                content: `Payment terms are outlined in individual project proposals or agreements. Unless stated otherwise, payments are due as per the schedule agreed upon before the project begins. Mommantum reserves the right to pause or stop work in the event of overdue payments.`,
              },
              {
                title: "5. Intellectual Property",
                content: `Upon full payment, clients receive ownership of the final deliverables created specifically for them. Mommantum retains the right to use completed work in its portfolio and marketing materials unless the client requests otherwise in writing.`,
              },
              {
                title: "6. Confidentiality",
                content: `Both parties agree to keep confidential any proprietary or sensitive information shared during the engagement. This includes business strategies, financial data, and any information explicitly marked as confidential.`,
              },
              {
                title: "7. Limitation of Liability",
                content: `Mommantum is not liable for any indirect, incidental, or consequential damages arising from the use of our services or website. Our total liability for any claim related to our services will not exceed the amount paid by the client for that specific service.`,
              },
              {
                title: "8. Results Disclaimer",
                content: `While we work to deliver strong results, Mommantum does not guarantee specific outcomes such as a particular revenue increase, ranking position, or return on ad spend. Digital marketing results depend on many factors outside our control including market conditions, platform changes, and product quality.`,
              },
              {
                title: "9. Third-Party Tools and Platforms",
                content: `Some of our services involve the use of third-party platforms such as Meta, Google, and others. Mommantum is not responsible for changes to these platforms, their policies, or any disruption to services caused by them.`,
              },
              {
                title: "10. Termination",
                content: `Either party may terminate an engagement by providing written notice as specified in the project agreement. In the event of termination, the client is responsible for payment of all work completed up to the termination date.`,
              },
              {
                title: "11. Governing Law",
                content: `These Terms and Conditions are governed by the laws of India. Any disputes arising from these terms or our services shall be subject to the jurisdiction of the courts in Jaipur, Rajasthan.`,
              },
              {
                title: "12. Changes to These Terms",
                content: `Mommantum reserves the right to update these Terms and Conditions at any time. Changes will be reflected on this page with an updated date. Continued use of our website or services after any changes constitutes acceptance of the revised terms.`,
              },
              {
                title: "13. Contact",
                content: `For any questions regarding these Terms and Conditions, please contact us at hello@mommantum.com or through our contact page.`,
              },
            ].map((section) => (
              <div
                key={section.title}
                className="rounded-[18px] bg-white p-7 shadow-[0_4px_16px_rgba(0,0,0,0.05)] lg:p-8"
              >
                <h2 className={`${epilogue.className} text-[18px] font-extrabold tracking-[-0.03em] text-[#0e2547]`}>
                  {section.title}
                </h2>
                <p className={`${outfit.className} mt-3 text-[15px] leading-[1.9] text-slate-600`}>
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            className="mt-12 rounded-[20px] p-8 text-center"
            style={{ background: "linear-gradient(135deg, #0e2547 0%, #1a3a6b 60%, #0e2547 100%)" }}
          >
            <p className={`${mansalva.className} text-[16px] text-[#ef6a99]`}>
              Have a question?
            </p>
            <h3 className={`${epilogue.className} mt-2 text-[22px] font-extrabold tracking-[-0.04em] text-white`}>
              Get in touch with us
            </h3>
            <div className="mt-6">
              <LocalizedClientLink
                href="/contact"
                className={`${epilogue.className} inline-flex h-[48px] items-center justify-center rounded-[12px] px-8 text-[13px] font-extrabold uppercase tracking-[0.04em] text-white transition-all hover:opacity-90`}
                style={{ background: "linear-gradient(135deg, #e61e73, #9333ea)" }}
              >
                Contact Us →
              </LocalizedClientLink>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
