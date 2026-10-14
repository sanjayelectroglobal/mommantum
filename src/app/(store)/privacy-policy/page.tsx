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
  const seoSetting = await getSeoSetting("privacy-policy").catch(() => null)
  const resolved = resolveLegalPageData(
    "privacy-policy",
    "Privacy Policy | Mommantum",
    "Read how Mommantum collects, uses, and protects information on its website.",
    seoSetting
  )
  return buildMetadataFromResolved(resolved)
}

export default async function PrivacyPolicyPage() {
  const seoSetting = await getSeoSetting("privacy-policy").catch(() => null)

  return (
    <main className="relative overflow-hidden bg-[#f7f8fa] pt-14 pb-20 lg:pt-20 lg:pb-24">
      <JsonLd
        type="page"
        slug="privacy-policy"
        title="Privacy Policy | Mommantum"
        description="Read how Mommantum collects, uses, and protects information on its website."
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
              Privacy Policy
            </h1>
            <p className={`${outfit.className} mt-3 text-[14px] text-slate-400`}>
              Last updated: May 2026
            </p>
          </div>

          <div className="mt-10 space-y-8">

            {[
              {
                title: "1. Information We Collect",
                content: `When you visit our website or contact us, we may collect information you provide directly, such as your name, email address, phone number, and any other details you share through our contact forms or booking pages. We also collect standard analytics data such as pages visited, time on site, and device type through tools like Google Analytics.`,
              },
              {
                title: "2. How We Use Your Information",
                content: `We use the information we collect to respond to your enquiries, provide our services, send you relevant updates if you have opted in, and improve our website and service quality. We do not sell or rent your personal information to any third party.`,
              },
              {
                title: "3. Cookies",
                content: `Our website uses cookies to improve your browsing experience and to help us understand how visitors use our site. Cookies are small files placed on your device. You can choose to disable cookies through your browser settings, though this may affect some features of the site.`,
              },
              {
                title: "4. Third-Party Services",
                content: `We use third-party tools including Google Analytics, Google Ads, and Meta Ads to run campaigns and measure performance. These services may collect data in accordance with their own privacy policies. We recommend reviewing their policies separately.`,
              },
              {
                title: "5. Data Security",
                content: `We take reasonable measures to protect your personal information from unauthorised access, use, or disclosure. However, no method of transmission over the internet is completely secure and we cannot guarantee absolute security.`,
              },
              {
                title: "6. Your Rights",
                content: `You have the right to request access to the personal data we hold about you, to ask us to correct any inaccurate data, and to request deletion of your data where applicable. To make any such request, please contact us at the email below.`,
              },
              {
                title: "7. Data Retention",
                content: `We retain your personal information only for as long as is necessary to fulfil the purposes for which it was collected, or as required by law. When data is no longer needed, we securely delete or anonymise it.`,
              },
              {
                title: "8. Changes to This Policy",
                content: `We may update this Privacy Policy from time to time. When we do, we will update the date at the top of this page. We encourage you to review this page periodically to stay informed about how we are protecting your information.`,
              },
              {
                title: "9. Contact Us",
                content: `If you have any questions or concerns about this Privacy Policy or how we handle your data, please reach out to us at hello@mommantum.com or through our contact page.`,
              },
            ].map((section) => (
              <div
                key={section.title}
                className="rounded-[18px] bg-white p-7 shadow-[0_4px_16px_rgba(0,0,0,0.05)] lg:p-8"
              >
                <h2 className={`${epilogue.className} text-[20px] font-extrabold tracking-[-0.03em] text-[#0e2547]`}>
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
