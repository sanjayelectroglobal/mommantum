-- ==============================================================================
-- Cleanup Proposal: Clean up polluted schema_json in seo_setting
-- Status: PROPOSAL ONLY (LOCAL ONLY - Do not execute against production)
-- Purpose: Nullifies polluted schema_json column in seo_setting where raw FAQ
--          arrays were previously dumped by the AI SEO generator, restoring clean
--          state and deferring JSON-LD generation to the centralized schema graph.
-- ==============================================================================

-- 1. Where schema_json starts with an array bracket '[' (raw FAQ arrays), migrate to faq_section if faq_section is empty
UPDATE public.seo_setting
SET faq_section = schema_json::jsonb
WHERE schema_json IS NOT NULL
  AND schema_json LIKE '[%'
  AND (faq_section IS NULL OR faq_section = '[]'::jsonb);

-- 2. Clear out schema_json across seo_setting so the centralized dynamic schema
-- generator has total authoritative control over valid Schema.org graph generation.
UPDATE public.seo_setting
SET schema_json = NULL
WHERE schema_json IS NOT NULL;
