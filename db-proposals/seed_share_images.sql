-- ==============================================================================
-- SHARE IMAGES (og_image / twitter_image) for static pages and services
-- Status: READY. Review, then run in Supabase AFTER the site with the new images is deployed
--         (the image files must open at the URLs below, otherwise the links are broken).
-- Run order: seed_page_meta_and_keywords.sql first, then this file.
-- Images: public/og/pages/*.jpg and public/og/services/*.jpg (1200 x 630).
-- Blog posts, case studies and services.image column are NOT touched.
-- ==============================================================================

-- Static pages
INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'homepage', 'Home', 'https://www.mommantum.com/og/pages/home.jpg', 'https://www.mommantum.com/og/pages/home.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'about', 'About', 'https://www.mommantum.com/og/pages/about.jpg', 'https://www.mommantum.com/og/pages/about.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'contact', 'Contact', 'https://www.mommantum.com/og/pages/contact.jpg', 'https://www.mommantum.com/og/pages/contact.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'services', 'Services', 'https://www.mommantum.com/og/pages/services.jpg', 'https://www.mommantum.com/og/pages/services.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'work', 'Case Studies', 'https://www.mommantum.com/og/pages/work.jpg', 'https://www.mommantum.com/og/pages/work.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'blog', 'Blog', 'https://www.mommantum.com/og/pages/blog.jpg', 'https://www.mommantum.com/og/pages/blog.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'editz', 'Editz', 'https://www.mommantum.com/og/pages/editz.jpg', 'https://www.mommantum.com/og/pages/editz.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'blog-ai', 'Blog AI', 'https://www.mommantum.com/og/pages/blog-ai.jpg', 'https://www.mommantum.com/og/pages/blog-ai.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'faq', 'FAQs', 'https://www.mommantum.com/og/pages/faq.jpg', 'https://www.mommantum.com/og/pages/faq.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'privacy-policy', 'Privacy Policy', 'https://www.mommantum.com/og/pages/privacy-policy.jpg', 'https://www.mommantum.com/og/pages/privacy-policy.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'terms-and-conditions', 'Terms & Conditions', 'https://www.mommantum.com/og/pages/terms-and-conditions.jpg', 'https://www.mommantum.com/og/pages/terms-and-conditions.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

-- Services (page_key = service:{slug})
INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'service:performance-marketing', 'Performance Marketing', 'https://www.mommantum.com/og/services/performance-marketing.jpg', 'https://www.mommantum.com/og/services/performance-marketing.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'service:social-media-marketing', 'Social Media Marketing', 'https://www.mommantum.com/og/services/social-media-marketing.jpg', 'https://www.mommantum.com/og/services/social-media-marketing.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'service:search-engine-optimization', 'Search Engine Optimization', 'https://www.mommantum.com/og/services/search-engine-optimization.jpg', 'https://www.mommantum.com/og/services/search-engine-optimization.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'service:d2c-branding-scale-growth', 'D2C Branding and Scale Growth', 'https://www.mommantum.com/og/services/d2c-branding-scale-growth.jpg', 'https://www.mommantum.com/og/services/d2c-branding-scale-growth.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'service:conversion-rate-optimization', 'Conversion Rate Optimization', 'https://www.mommantum.com/og/services/conversion-rate-optimization.jpg', 'https://www.mommantum.com/og/services/conversion-rate-optimization.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'service:script-copywriting', 'Script & Copywriting', 'https://www.mommantum.com/og/services/script-copywriting.jpg', 'https://www.mommantum.com/og/services/script-copywriting.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'service:strategy-consulting', 'Strategy & Consulting', 'https://www.mommantum.com/og/services/strategy-consulting.jpg', 'https://www.mommantum.com/og/services/strategy-consulting.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'service:web-app-development', 'Web and App Development', 'https://www.mommantum.com/og/services/web-app-development.jpg', 'https://www.mommantum.com/og/services/web-app-development.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'service:ai-automation', 'AI Automation', 'https://www.mommantum.com/og/services/ai-automation.jpg', 'https://www.mommantum.com/og/services/ai-automation.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'service:ai-agentic-service', 'AI Agentic Service', 'https://www.mommantum.com/og/services/ai-agentic-service.jpg', 'https://www.mommantum.com/og/services/ai-agentic-service.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'service:ai-video-generation', 'AI Video Generation', 'https://www.mommantum.com/og/services/ai-video-generation.jpg', 'https://www.mommantum.com/og/services/ai-video-generation.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'service:content-video-scripting', 'Content and Video Scripting', 'https://www.mommantum.com/og/services/content-video-scripting.jpg', 'https://www.mommantum.com/og/services/content-video-scripting.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'service:video-editing', 'Video Editing', 'https://www.mommantum.com/og/services/video-editing.jpg', 'https://www.mommantum.com/og/services/video-editing.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'service:ai-video-editing', 'AI Video Editing', 'https://www.mommantum.com/og/services/ai-video-editing.jpg', 'https://www.mommantum.com/og/services/ai-video-editing.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'service:podcast-editing', 'Podcast Editing', 'https://www.mommantum.com/og/services/podcast-editing.jpg', 'https://www.mommantum.com/og/services/podcast-editing.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();

INSERT INTO public.seo_setting (id, page_key, page_label, og_image, twitter_image, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'service:motion-graphics', 'Motion Graphics', 'https://www.mommantum.com/og/services/motion-graphics.jpg', 'https://www.mommantum.com/og/services/motion-graphics.jpg', NOW())
ON CONFLICT (page_key) DO UPDATE SET og_image = EXCLUDED.og_image, twitter_image = EXCLUDED.twitter_image, last_updated = NOW();
