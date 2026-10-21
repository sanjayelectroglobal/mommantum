-- ==============================================================================
-- Proposal: meta title and meta description for static pages (KEYWORDS REMOVED: they must come from the keyword sheet)
-- Status: PROPOSAL ONLY - review before running on production
-- Table: public.seo_setting (upsert on page_key)
-- Rules: title 50-60 chars, description 140-160 chars. Keywords are NOT in this file (see Keywords_for_MM sheet).
-- ==============================================================================

-- Home
INSERT INTO public.seo_setting (id, page_key, page_label, meta_title, meta_description, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'homepage', 'Home', 'Mommantum | Digital Marketing Agency in Jaipur, India', 'Mommantum is a Jaipur-based digital marketing agency helping D2C and ecommerce brands grow with performance marketing, SEO, creative and AI automation.', NOW())
ON CONFLICT (page_key) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  last_updated = NOW();

-- About
INSERT INTO public.seo_setting (id, page_key, page_label, meta_title, meta_description, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'about', 'About', 'About Mommantum | Growth Studio and Marketing Agency Jaipur', 'Meet Mommantum, a Jaipur growth studio led by Kuldeep Ahir. We connect strategy, creative, SEO and performance marketing to help brands scale steadily.', NOW())
ON CONFLICT (page_key) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  last_updated = NOW();

-- Contact
INSERT INTO public.seo_setting (id, page_key, page_label, meta_title, meta_description, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'contact', 'Contact', 'Contact Mommantum | Talk to a Jaipur Marketing Agency Today', 'Contact Mommantum to discuss performance marketing, SEO, web development or AI workflow projects. Email, call or WhatsApp our Jaipur team, Monday to Saturday.', NOW())
ON CONFLICT (page_key) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  last_updated = NOW();

-- Services
INSERT INTO public.seo_setting (id, page_key, page_label, meta_title, meta_description, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'services', 'Services', 'Marketing, SEO, Web and AI Services | Mommantum Jaipur', 'Explore Mommantum services: performance marketing, SEO, social media, branding, web and app development, AI automation, AI agents and video production.', NOW())
ON CONFLICT (page_key) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  last_updated = NOW();

-- Case Studies
INSERT INTO public.seo_setting (id, page_key, page_label, meta_title, meta_description, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'work', 'Case Studies', 'Case Studies | Mommantum Client Work and Growth Results', 'See how Mommantum helps brands grow. Browse case studies across ecommerce, SEO, web development and creative systems, with real strategy and results.', NOW())
ON CONFLICT (page_key) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  last_updated = NOW();

-- Blog
INSERT INTO public.seo_setting (id, page_key, page_label, meta_title, meta_description, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'blog', 'Blog', 'Mommantum Blog | SEO, Marketing and AI Growth Playbooks', 'Read practical guides from the Mommantum team on SEO, performance marketing, AI automation and scaling D2C brands, written for founders and marketers.', NOW())
ON CONFLICT (page_key) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  last_updated = NOW();

-- Editz
INSERT INTO public.seo_setting (id, page_key, page_label, meta_title, meta_description, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'editz', 'Editz', 'EDITZ by Mommantum | Video Editing Studio for Creators', 'EDITZ by Mommantum delivers short-form and long-form video editing for creators and brands: Reels, YouTube videos, podcasts and high-converting ad creatives.', NOW())
ON CONFLICT (page_key) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  last_updated = NOW();

-- Blog AI
INSERT INTO public.seo_setting (id, page_key, page_label, meta_title, meta_description, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'blog-ai', 'Blog AI', 'Blog AI by Mommantum | AI Blog Writing and Automation', 'Blog AI by Mommantum uses AI-driven content systems to plan, write and publish SEO-friendly blogs for your brand, with human review at every step.', NOW())
ON CONFLICT (page_key) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  last_updated = NOW();

-- Privacy Policy
INSERT INTO public.seo_setting (id, page_key, page_label, meta_title, meta_description, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'privacy-policy', 'Privacy Policy', 'Privacy Policy | Mommantum Data and Information Practices', 'Read the Mommantum privacy policy to learn what information we collect on our website, how we use it, how we protect it and how to contact us.', NOW())
ON CONFLICT (page_key) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  last_updated = NOW();

-- Terms & Conditions
INSERT INTO public.seo_setting (id, page_key, page_label, meta_title, meta_description, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'terms-and-conditions', 'Terms & Conditions', 'Terms and Conditions | Mommantum Website and Services', 'Read the terms and conditions for using the Mommantum website and services, including client responsibilities, payments, deliverables and legal terms.', NOW())
ON CONFLICT (page_key) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  last_updated = NOW();

-- FAQs
INSERT INTO public.seo_setting (id, page_key, page_label, meta_title, meta_description, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'faq', 'FAQs', 'FAQs | Mommantum Marketing, SEO, Web and AI Questions', 'Find clear answers to common questions about Mommantum''s performance marketing, SEO, social media, web development, AI automation and Jaipur studio.', NOW())
ON CONFLICT (page_key) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  last_updated = NOW();
