/**
 * @file page-defaults.ts
 * @description Centralized fallback meta title and description for static pages.
 * Sourced directly from db-proposals/seed_page_meta_and_keywords.sql.
 * 
 * Rules:
 * - Title: 50 to 60 characters
 * - Description: 140 to 160 characters
 * - Matches DB values 1-to-1 so code fallback equals DB seed.
 * - NO hardcoded keywords (keywords must only come from database seo_setting).
 */

export interface PageMetaDefault {
  title: string
  description: string
}

export const PAGE_META_DEFAULTS: Record<string, PageMetaDefault> = {
  homepage: {
    title: "Mommantum | Digital Marketing Agency in Jaipur, India",
    description:
      "Mommantum is a Jaipur-based digital marketing agency helping D2C and ecommerce brands grow with performance marketing, SEO, creative and AI automation.",
  },
  about: {
    title: "About Mommantum | Growth Studio and Marketing Agency Jaipur",
    description:
      "Meet Mommantum, a Jaipur growth studio led by Kuldeep Ahir. We connect strategy, creative, SEO and performance marketing to help brands scale steadily.",
  },
  contact: {
    title: "Contact Mommantum | Talk to a Jaipur Marketing Agency Today",
    description:
      "Contact Mommantum to discuss performance marketing, SEO, web development or AI workflow projects. Email, call or WhatsApp our Jaipur team, Monday to Saturday.",
  },
  services: {
    title: "Marketing, SEO, Web and AI Services | Mommantum Jaipur",
    description:
      "Explore Mommantum services: performance marketing, SEO, social media, branding, web and app development, AI automation, AI agents and video production.",
  },
  work: {
    title: "Case Studies | Mommantum Client Work and Growth Results",
    description:
      "See how Mommantum helps brands grow. Browse case studies across ecommerce, SEO, web development and creative systems, with real strategy and results.",
  },
  blog: {
    title: "Mommantum Blog | SEO, Marketing and AI Growth Playbooks",
    description:
      "Read practical guides from the Mommantum team on SEO, performance marketing, AI automation and scaling D2C brands, written for founders and marketers.",
  },
  editz: {
    title: "EDITZ by Mommantum | Video Editing Studio for Creators",
    description:
      "EDITZ by Mommantum delivers short-form and long-form video editing for creators and brands: Reels, YouTube videos, podcasts and high-converting ad creatives.",
  },
  "blog-ai": {
    title: "Blog AI by Mommantum | AI Blog Writing and Automation",
    description:
      "Blog AI by Mommantum uses AI-driven content systems to plan, write and publish SEO-friendly blogs for your brand, with human review at every step.",
  },
  "privacy-policy": {
    title: "Privacy Policy | Mommantum Data and Information Practices",
    description:
      "Read the Mommantum privacy policy to learn what information we collect on our website, how we use it, how we protect it and how to contact us.",
  },
  "terms-and-conditions": {
    title: "Terms and Conditions | Mommantum Website and Services",
    description:
      "Read the terms and conditions for using the Mommantum website and services, including client responsibilities, payments, deliverables and legal terms.",
  },
  faq: {
    title: "FAQs | Mommantum Marketing, SEO, Web and AI Questions",
    description:
      "Find clear answers to common questions about Mommantum's performance marketing, SEO, social media, web development, AI automation and Jaipur studio.",
  },
}

export function getPageMetaDefault(pageKey: string): PageMetaDefault | undefined {
  return PAGE_META_DEFAULTS[pageKey]
}
