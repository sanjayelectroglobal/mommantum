-- LIVE-SCHEMA VERSION: no id column (bigint identity), updated_at instead of last_updated, jsonb keywords.
-- ==============================================================================
-- DRAFT: keywords for static pages (NOT from Keywords_for_MM.xlsx)
-- Status: needs owner / senior approval BEFORE running on production
-- Each page: 1 primary + 4 secondary = 5 keywords. Only keyword columns are touched.
-- Pages left out on purpose: privacy-policy, terms-and-conditions (not search pages);
--                            editz (already has keywords from the sheet).
-- ==============================================================================

INSERT INTO public.seo_setting (page_key, page_label, primary_keyword, secondary_keywords, updated_at)
VALUES ('homepage', 'Home', 'digital marketing agency in jaipur', to_jsonb(ARRAY['performance marketing agency in india', 'd2c marketing agency', 'seo company in jaipur', 'ai automation agency']::text[]), NOW())
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  updated_at = NOW();

INSERT INTO public.seo_setting (page_key, page_label, primary_keyword, secondary_keywords, updated_at)
VALUES ('about', 'About', 'growth marketing agency jaipur', to_jsonb(ARRAY['digital marketing team in jaipur', 'creative growth studio', 'performance marketing experts india', 'd2c brand growth partner']::text[]), NOW())
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  updated_at = NOW();

INSERT INTO public.seo_setting (page_key, page_label, primary_keyword, secondary_keywords, updated_at)
VALUES ('contact', 'Contact', 'contact digital marketing agency in jaipur', to_jsonb(ARRAY['hire performance marketing agency', 'digital marketing consultation jaipur', 'marketing agency in jaipur contact number', 'book a marketing strategy call']::text[]), NOW())
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  updated_at = NOW();

INSERT INTO public.seo_setting (page_key, page_label, primary_keyword, secondary_keywords, updated_at)
VALUES ('services', 'Services', 'digital marketing services in jaipur', to_jsonb(ARRAY['performance marketing services', 'seo services in jaipur', 'social media marketing services', 'web development company in jaipur']::text[]), NOW())
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  updated_at = NOW();

INSERT INTO public.seo_setting (page_key, page_label, primary_keyword, secondary_keywords, updated_at)
VALUES ('work', 'Case Studies', 'digital marketing case studies', to_jsonb(ARRAY['d2c marketing case study', 'ecommerce growth case study', 'seo case study india', 'performance marketing results']::text[]), NOW())
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  updated_at = NOW();

INSERT INTO public.seo_setting (page_key, page_label, primary_keyword, secondary_keywords, updated_at)
VALUES ('blog', 'Blog', 'digital marketing blog', to_jsonb(ARRAY['seo tips for beginners', 'performance marketing strategies', 'd2c growth strategies', 'ai automation for business']::text[]), NOW())
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  updated_at = NOW();

INSERT INTO public.seo_setting (page_key, page_label, primary_keyword, secondary_keywords, updated_at)
VALUES ('blog-ai', 'Blog AI', 'ai blog automation', to_jsonb(ARRAY['ai blog generator', 'automated seo blog writing', 'ai content automation', 'ai blog writing tool']::text[]), NOW())
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  updated_at = NOW();

INSERT INTO public.seo_setting (page_key, page_label, primary_keyword, secondary_keywords, updated_at)
VALUES ('faq', 'FAQs', 'digital marketing agency faqs', to_jsonb(ARRAY['performance marketing faqs', 'seo services faqs', 'web development faqs', 'ai automation faqs']::text[]), NOW())
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  updated_at = NOW();
