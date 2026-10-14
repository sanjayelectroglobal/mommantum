-- ==============================================================================
-- SQL Proposal: Clean ' - himanshu' testing suffixes from titles
-- Status: PROPOSAL ONLY (LOCAL ONLY - Do not execute against production)
-- Purpose:
--   1. SELECT: Audit and list any rows containing ' - himanshu'
--   2. UPDATE: Trims ' - himanshu' (case-insensitive regex) from seo_setting.meta_title
--              and any services / blogs title columns.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. AUDIT: Review affected rows
-- ------------------------------------------------------------------------------
SELECT id, page_key, meta_title
FROM public.seo_setting
WHERE meta_title ILIKE '%himanshu%';

SELECT id, slug, title
FROM public.services
WHERE title ILIKE '%himanshu%';

SELECT id, slug, title
FROM public.post
WHERE title ILIKE '%himanshu%';

-- ------------------------------------------------------------------------------
-- 2. UPDATE: Trim ' - himanshu' (case-insensitive) suffix
-- ------------------------------------------------------------------------------
-- In seo_setting.meta_title:
UPDATE public.seo_setting
SET 
  meta_title = REGEXP_REPLACE(meta_title, '\s*-\s*himanshu\s*$', '', 'i'),
  last_updated = NOW()
WHERE meta_title ILIKE '%himanshu%';

-- In services.title:
UPDATE public.services
SET 
  title = REGEXP_REPLACE(title, '\s*-\s*himanshu\s*$', '', 'i')
WHERE title ILIKE '%himanshu%';

-- In post.title:
UPDATE public.post
SET 
  title = REGEXP_REPLACE(title, '\s*-\s*himanshu\s*$', '', 'i')
WHERE title ILIKE '%himanshu%';

-- In blogs.title (legacy table if exists):
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blogs') THEN
    EXECUTE 'UPDATE public.blogs SET title = REGEXP_REPLACE(title, ''\s*-\s*himanshu\s*$'', '''', ''i'') WHERE title ILIKE ''%himanshu%''';
  END IF;
END $$;
