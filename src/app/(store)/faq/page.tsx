/**
 * Dedicated FAQ Page Route (/faq)
 * 
 * Purpose:
 * Renders the dedicated, full-catalog FAQ knowledge base for Mommantum.
 * Provides answers across all services (Performance Marketing, SEO, Social Media,
 * Web Development, AI Automation, Branding, CRO, and Video Production).
 * 
 * Features:
 * - Server component with dynamic SEO metadata generation and canonical URL.
 * - Interactive FaqPageClient for instant search, category filtering, and accordion toggling.
 * - Conforms to Mommantum's App Router architecture under (store)/faq.
 */

import { Metadata } from "next"
import FaqPageClient from "./_components/FaqPageClient"

export const revalidate = 3600 // Cache for 1 hour

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Frequently Asked Questions | Mommantum - Growth Studio",
    description:
      "Find clear, honest answers to frequently asked questions about Mommantum's performance marketing, SEO, social media marketing, web development, AI automation, and Jaipur studio.",
    alternates: {
      canonical: "https://www.mommantum.com/faq",
    },
    openGraph: {
      title: "Frequently Asked Questions | Mommantum",
      description:
        "Clear answers about our services, Jaipur office, remote client work, and growth strategies.",
      url: "https://www.mommantum.com/faq",
      type: "website",
    },
  }
}

export default function FaqPage() {
  return <FaqPageClient />
}
