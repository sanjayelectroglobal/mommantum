-- ==============================================================================
-- Seed Proposal: Seed home FAQs into seo_setting.faq_section
-- Status: PROPOSAL ONLY (LOCAL ONLY - Do not execute against production)
-- Purpose: Populates the 5 client-approved homepage FAQs verbatim from prompt JSON
--          into seo_setting for page_key = 'home' (and 'homepage')
-- Generated via: scripts/gen-faq-sql.ts
-- ==============================================================================

UPDATE public.seo_setting
SET 
  faq_section = '[
  {
    "question": "What does Mommantum do?",
    "answer": "Mommantum is a Jaipur based digital marketing agency and growth studio. We help D2C and ecommerce brands grow through performance marketing, SEO, social media marketing, branding, conversion rate optimization, web development, AI automation, AI agents, and video services, all connected so each channel supports the others.",
    "answer_words": 46
  },
  {
    "question": "Where is Mommantum located and can I visit the office?",
    "answer": "Our office is at B40A, Krishi Nagar, Taroo Ki Koot, near B2 Bypass, Jaipur, Rajasthan 302029. Clients are welcome to visit. We are open Monday to Saturday, 9am to 9pm, and we also work with clients across India and internationally.",
    "answer_words": 40
  },
  {
    "question": "Do you work with clients outside Jaipur?",
    "answer": "Yes. Although we are based in Jaipur, we work with brands across India and with international clients. The same strategy, reporting, and day to day attention applies wherever your business is based, whether you meet us in Jaipur or work with us remotely.",
    "answer_words": 43
  },
  {
    "question": "Which services does Mommantum offer?",
    "answer": "We offer performance marketing, SEO, social media marketing, D2C branding, conversion rate optimization, copywriting, marketing consulting, web and app development, AI automation, AI agents, AI video generation, video scripting, video editing, AI video editing, podcast editing, and motion graphics. Visit our services page for details on each.",
    "answer_words": 47
  },
  {
    "question": "How can I contact Mommantum?",
    "answer": "You can email kuldeep@mommantum.in or call or WhatsApp us on 7742276031. Our team is available Monday to Saturday, 9am to 9pm. You can also use the contact page on our website and tell us about your brand and goals. Just reach out with your brand and goals.",
    "answer_words": 47
  }
]'::jsonb,
  last_updated = NOW()
WHERE page_key IN ('home', 'homepage');
