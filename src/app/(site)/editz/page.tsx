import { Metadata } from "next"
import { getSeoSetting } from "@lib/data/seo"
import { resolveEditzData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import JsonLd from "@modules/common/components/json-ld"
import Navbar from "@modules/editz/components/Navbar"
import Hero from "@modules/editz/components/Hero"
import Services from "@modules/editz/components/Services"
import BrandMarquee from "@modules/editz/components/BrandMarquee"
import Benefits from "@modules/editz/components/Benefits"
import Projects from "@modules/editz/components/Projects"
import Audience from "@modules/editz/components/Audience"
import Process from "@modules/editz/components/Process"
import Testimonials from "@modules/editz/components/Testimonials"
import FAQ from "@modules/editz/components/FAQ"
import CTA from "@modules/editz/components/CTA"
import Footer from "@modules/editz/components/Footer"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const seoSetting = await getSeoSetting("editz").catch(() => null)
  const resolved = resolveEditzData(seoSetting)
  return buildMetadataFromResolved(resolved)
}

export default async function EditzPage() {
  const seoSetting = await getSeoSetting("editz").catch(() => null)

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDFA] text-[#111111] selection:bg-[#E32759] selection:text-white">
      <JsonLd type="editz" seoSetting={seoSetting} />
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Services />
        <BrandMarquee />
        <Benefits />
        <Projects />
        <Audience />
        <Process />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
