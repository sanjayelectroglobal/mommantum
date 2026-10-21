-- ==============================================================================
-- DRAFT: keywords for static pages (NOT from Keywords_for_MM.xlsx)
-- Status: needs owner / senior approval BEFORE running on production
-- Each page: 1 primary + 4 secondary = 5 keywords. Only keyword columns are touched.
-- Pages left out on purpose: privacy-policy, terms-and-conditions (not search pages);
--                            editz (already has keywords from the sheet).
-- ==============================================================================

INSERT INTO public.seo_setting (id, page_key, page_label, primary_keyword, secondary_keywords, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'homepage', 'Home', 'digital marketing agency in jaipur', ARRAY['performance marketing agency in india', 'd2c marketing agency', 'seo company in jaipur', 'ai automation agency'], NOW())
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, primary_keyword, secondary_keywords, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'about', 'About', 'growth marketing agency jaipur', ARRAY['digital marketing team in jaipur', 'creative growth studio', 'performance marketing experts india', 'd2c brand growth partner'], NOW())
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, primary_keyword, secondary_keywords, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'contact', 'Contact', 'contact digital marketing agency in jaipur', ARRAY['hire performance marketing agency', 'digital marketing consultation jaipur', 'marketing agency in jaipur contact number', 'book a marketing strategy call'], NOW())
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, primary_keyword, secondary_keywords, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'services', 'Services', 'digital marketing services in jaipur', ARRAY['performance marketing services', 'seo services in jaipur', 'social media marketing services', 'web development company in jaipur'], NOW())
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, primary_keyword, secondary_keywords, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'work', 'Case Studies', 'digital marketing case studies', ARRAY['d2c marketing case study', 'ecommerce growth case study', 'seo case study india', 'performance marketing results'], NOW())
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, primary_keyword, secondary_keywords, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'blog', 'Blog', 'digital marketing blog', ARRAY['seo tips for beginners', 'performance marketing strategies', 'd2c growth strategies', 'ai automation for business'], NOW())
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, primary_keyword, secondary_keywords, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'blog-ai', 'Blog AI', 'ai blog automation', ARRAY['ai blog generator', 'automated seo blog writing', 'ai content automation', 'ai blog writing tool'], NOW())
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, primary_keyword, secondary_keywords, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'faq', 'FAQs', 'digital marketing agency faqs', ARRAY['performance marketing faqs', 'seo services faqs', 'web development faqs', 'ai automation faqs'], NOW())
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();
