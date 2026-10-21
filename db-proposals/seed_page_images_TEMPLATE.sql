-- ==============================================================================
-- IMAGE URL TEMPLATE (fill in LATER by the owner, then review and run)
-- Status: PLACEHOLDERS ONLY. Replace every <PASTE_URL_HERE>. Do NOT run as-is.
-- Rules: HTTPS, absolute URL, image must open in a browser.
--        og images: 1200 x 630 px (jpg/webp/png).  Logo: 500 x 500 px square.
-- ==============================================================================

-- 1-11. Page share images (Open Graph / Twitter / schema image)
UPDATE public.seo_setting SET og_image = '<PASTE_URL_HERE>', twitter_image = '<PASTE_URL_HERE>' WHERE page_key = 'homepage';
UPDATE public.seo_setting SET og_image = '<PASTE_URL_HERE>', twitter_image = '<PASTE_URL_HERE>' WHERE page_key = 'about';
UPDATE public.seo_setting SET og_image = '<PASTE_URL_HERE>', twitter_image = '<PASTE_URL_HERE>' WHERE page_key = 'contact';
UPDATE public.seo_setting SET og_image = '<PASTE_URL_HERE>', twitter_image = '<PASTE_URL_HERE>' WHERE page_key = 'services';
UPDATE public.seo_setting SET og_image = '<PASTE_URL_HERE>', twitter_image = '<PASTE_URL_HERE>' WHERE page_key = 'work';
UPDATE public.seo_setting SET og_image = '<PASTE_URL_HERE>', twitter_image = '<PASTE_URL_HERE>' WHERE page_key = 'blog';
UPDATE public.seo_setting SET og_image = '<PASTE_URL_HERE>', twitter_image = '<PASTE_URL_HERE>' WHERE page_key = 'editz';
UPDATE public.seo_setting SET og_image = '<PASTE_URL_HERE>', twitter_image = '<PASTE_URL_HERE>' WHERE page_key = 'blog-ai';
UPDATE public.seo_setting SET og_image = '<PASTE_URL_HERE>', twitter_image = '<PASTE_URL_HERE>' WHERE page_key = 'privacy-policy';
UPDATE public.seo_setting SET og_image = '<PASTE_URL_HERE>', twitter_image = '<PASTE_URL_HERE>' WHERE page_key = 'terms-and-conditions';
UPDATE public.seo_setting SET og_image = '<PASTE_URL_HERE>', twitter_image = '<PASTE_URL_HERE>' WHERE page_key = 'faq';

-- 12-13. Logo and founder photo (inside site_setting.organization_profile)
UPDATE public.site_setting
SET logo_url = '<PASTE_LOGO_URL_HERE>',
    organization_profile = jsonb_set(
      jsonb_set(organization_profile, '{logo,url}', to_jsonb('<PASTE_LOGO_URL_HERE>'::text)),
      '{founder,image}', to_jsonb('<PASTE_KULDEEP_PHOTO_URL_HERE>'::text))
WHERE id = (SELECT id FROM public.site_setting LIMIT 1);

-- 14. Each service image  (table: public.services, column: image)  one line per service
-- UPDATE public.services SET image = '<PASTE_URL_HERE>' WHERE slug = 'performance-marketing';
-- (repeat for every service slug)

-- 15. Each blog post featured image (table: post, column: featured_image)
-- 16. Each case study image (case study table, column: image)
