-- ==============================================================================
-- Seed Proposal: Seed primary and secondary keywords into seo_setting
-- Status: PROPOSAL ONLY (LOCAL ONLY - Do not execute against production)
-- Purpose: Upserts primary_keyword and secondary_keywords from prompt JSON
--          for page_key 'service:{slug}'
-- Generated via: scripts/gen-faq-sql.ts
-- ==============================================================================

-- 1. Performance Marketing
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:performance-marketing',
  'Performance Marketing',
  'performance marketing',
  ARRAY['performance marketing agency in india', 'performance marketing services', 'performance marketing campaigns', 'performance based marketing', 'performance marketing platforms'],
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 2. Social Media Marketing
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:social-media-marketing',
  'Social Media Marketing',
  'social media marketing agency in india',
  ARRAY['social media marketing services', 'social media marketing company in jaipur', 'instagram marketing service', 'social media marketing strategy', 'benefits of social media marketing'],
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 3. Search Engine Optimization
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:search-engine-optimization',
  'Search Engine Optimization',
  'seo services india',
  ARRAY['best seo company in jaipur', 'seo agency in india', 'seo audit', 'shopify seo company', 'local seo company'],
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 4. D2C Branding & Scale Growth
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:d2c-branding-scale-growth',
  'D2C Branding & Scale Growth',
  'branding agency in india',
  ARRAY['branding agency', 'brand identity design agency', 'branding and marketing agency', 'd2c marketing strategy', 'd2c brands'],
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 5. Conversion Rate Optimization
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:conversion-rate-optimization',
  'Conversion Rate Optimization',
  'conversion rate optimization services',
  ARRAY['conversion rate optimization agency', 'conversion rate optimization in digital marketing', 'conversion rate optimization agency in india'],
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 6. Scriptwriting & Copywriting
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:script-copywriting',
  'Scriptwriting & Copywriting',
  'copywriting',
  ARRAY['website copywriting', 'email copywriting', 'video script', 'short video script', 'copywriting facebook ads'],
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 7. Strategy Consulting
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:strategy-consulting',
  'Strategy Consulting',
  NULL,
  ARRAY[]::text[],
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 8. Web & App Development
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:web-app-development',
  'Web & App Development',
  'web development company in jaipur',
  ARRAY['cms web development services', 'web development agency near me', 'web portal development company', 'progressive web app development company', 'shopify web development'],
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 9. AI Automation
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:ai-automation',
  'AI Automation',
  'ai automation agency',
  ARRAY['ai automation services', 'ai workflow automation', 'ai marketing automation', 'ai driven automation'],
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 10. AI Agentic Service
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:ai-agentic-service',
  'AI Agentic Service',
  'ai agents',
  ARRAY['agentic ai frameworks', 'n8n ai agent', 'building ai agents', 'types of ai agents'],
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 11. AI Video Generation
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:ai-video-generation',
  'AI Video Generation',
  'text to video generator ai',
  ARRAY['image to video generator ai', 'ai video generator online', 'ai video generation', 'best ai video generator'],
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

