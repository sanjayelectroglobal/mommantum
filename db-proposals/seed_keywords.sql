-- ==============================================================================
-- Seed Proposal: Seed primary and secondary keywords into seo_setting
-- Status: PROPOSAL ONLY (LOCAL ONLY - Do not execute against production)
-- Sourced strictly from: C:\Users\BIT\Downloads\Keywords_for_MM.xlsx
-- Rules:
--   - Exactly 1 primary_keyword per page (where a green cell exists in xlsx)
--   - Exactly 5 relevant secondary_keywords per page
--   - Services without green cells have primary_keyword = NULL and candidates in comment
--   - Services without a tab in xlsx have primary_keyword = NULL and comment 'no tab in xlsx'
--   - Static pages have been moved to seed_static_page_keywords_DRAFT.sql
-- ==============================================================================

-- 1. Performance Marketing (Sheet: 'performance marketing')
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:performance-marketing',
  'Performance Marketing',
  'Performance marketing',
  ARRAY['performance marketing agency', 'performance marketing companies', 'performance marketing campaigns', 'marketing performance metrics', 'performance marketing services'],
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 2. Social Media Marketing (Sheet: 'SMM Service')
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:social-media-marketing',
  'Social Media Marketing',
  'social media marketing services',
  ARRAY['social media marketing', 'social media marketing agency', 'social media digital marketing', 'social media marketing strategy', 'benefits of social media marketing'],
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 3. Search Engine Optimization (Sheet: 'SEO service')
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:search-engine-optimization',
  'Search Engine Optimization',
  'best seo company',
  ARRAY['best seo company in jaipur', 'seo company in jaipur', 'seo services in jaipur', 'seo expert in jaipur', 'seo agency in jaipur'],
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 4. D2C Branding & Scale Growth (Sheets: 'Branding' & 'D2C ')
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:d2c-branding-scale-growth',
  'D2C Branding & Scale Growth',
  'branding agency in india',
  ARRAY['d2c marketing', 'brand identity design agency', 'brand marketing agency', 'branding and marketing agency', 'd2c brands'],
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 5. Conversion Rate Optimization (Sheet: 'conversion rate optimization')
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:conversion-rate-optimization',
  'Conversion Rate Optimization',
  'conversion rate optimization services',
  ARRAY['conversion rate optimization', 'conversion rate optimization in digital marketing', 'conversion rate optimization agency', 'conversion rate optimization agency in india', 'conversion rate optimization agency india'],
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 6. Scriptwriting & Copywriting (Sheet: 'copywriting')
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:script-copywriting',
  'Scriptwriting & Copywriting',
  'copywriting services',
  ARRAY['copywriting', 'website copywriting', 'email copywriting', 'best copywriting ads', 'creative copywriting'],
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 7. Web & App Development (Sheet: 'Web development')
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:web-app-development',
  'Web & App Development',
  'best web development company',
  ARRAY['web application development', 'web developer portfolio', 'web development company in jaipur', 'web development languages', 'web development company in india'],
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 8. AI Automation (Sheet: 'ai automation')
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:ai-automation',
  'AI Automation',
  'ai automation agency',
  ARRAY['ai workflow automation', 'ai automation services', 'ai automation testing', 'ai marketing automation', 'ai driven automation'],
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 9. AI Agentic Service (Sheet: 'AI agent')
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:ai-agentic-service',
  'AI Agentic Service',
  'ai agents',
  ARRAY['agentic ai', 'ai agent', 'agentic ai frameworks', 'n8n ai agent', 'types of agents in ai'],
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 10. Video Editing (Sheet: 'video editing')
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:video-editing',
  'Video Editing',
  'video editing services',
  ARRAY['video editor', 'video editer', 'online video editor', 'edits video editor', 'online video editing'],
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 11. EDITZ (Sheet: 'video editing')
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'editz',
  'EDITZ Video Editing',
  'video editing services',
  ARRAY['video editor', 'video editer', 'online video editor', 'edits video editor', 'online video editing'],
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 11. Podcast Editing (Sheet: 'Pod cast')
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:podcast-editing',
  'Podcast Editing',
  'podcast editing',
  ARRAY['podcast audio editing', 'how to edit audio', 'video audio editor', 'audio podcast', 'video podcast'],
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- ==============================================================================
-- SERVICES WITHOUT GREEN CELLS IN XLSX (primary_keyword = NULL, candidates in comments)
-- ==============================================================================

-- 12. AI Video Generation (Sheet: 'AI video generater' - NO GREEN CELL IN XLSX)
-- Candidates from sheet: 'ai video generator', 'video generator ai', 'ai generated video', 'best ai video generator', 'video ai generator'
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:ai-video-generation',
  'AI Video Generation',
  NULL, -- no green cell in xlsx: needs owner selection
  NULL,
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 13. Content & Video Scripting (Sheet: 'video scripting' - NO GREEN CELL IN XLSX)
-- Candidates from sheet: 'video script', 'short video script', 'how to write a script for youtube video', 'create script', 'text to video'
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:content-video-scripting',
  'Content and Video Scripting',
  NULL, -- no green cell in xlsx: needs owner selection
  NULL,
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 14. AI Video Editing (Sheet: 'AI video editing' - NO GREEN CELL IN XLSX)
-- Candidates from sheet: 'ai video editing', 'ai powered video editor', 'ai edit video', 'ai video edit', 'video editor ai'
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:ai-video-editing',
  'AI Video Editing',
  NULL, -- no green cell in xlsx: needs owner selection
  NULL,
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 15. Motion Graphics (Sheet: 'motion graphics' - NO GREEN CELL IN XLSX)
-- Candidates from sheet: 'motion graphics', 'motion graphics animation', 'animation and motion graphics', 'motion graphics video', 'motion graphics agency'
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:motion-graphics',
  'Motion Graphics',
  NULL, -- no green cell in xlsx: needs owner selection
  NULL,
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();

-- 16. Google Ads (Sheet: 'Google ads' - NO GREEN CELL IN XLSX)
-- Candidates from sheet: 'google ads', 'google ads pricing', 'google ads experts', 'agency google ads', 'google ads agency'
-- Note: Currently not in active services list; kept for reference
-- INSERT INTO public.seo_setting ... (NULL, NULL)

-- 17. UI & UX (Sheet: 'Ux & UI' - NO GREEN CELL IN XLSX)
-- Candidates from sheet: 'ui ux design', 'ui ux designer', 'ui and ux design', 'ui ux design agency', 'ui ux design company'
-- Note: Currently not in active services list; kept for reference
-- INSERT INTO public.seo_setting ... (NULL, NULL)

-- ==============================================================================
-- SERVICES WITHOUT A TAB IN XLSX (no tab in xlsx)
-- ==============================================================================

-- 18. Strategy Consulting (no tab in xlsx)
INSERT INTO public.seo_setting (
  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated
) VALUES (
  'seo_' || replace(gen_random_uuid()::text, '-', ''),
  'service:strategy-consulting',
  'Strategy Consulting',
  NULL, -- no tab in xlsx
  NULL, -- no tab in xlsx
  NOW()
)
ON CONFLICT (page_key) DO UPDATE SET
  primary_keyword = EXCLUDED.primary_keyword,
  secondary_keywords = EXCLUDED.secondary_keywords,
  last_updated = NOW();
