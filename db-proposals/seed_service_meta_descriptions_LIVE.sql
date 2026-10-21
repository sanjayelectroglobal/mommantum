-- LIVE-SCHEMA VERSION (no id, updated_at, text columns only)
-- Service meta descriptions (140-160 chars). Source = existing service description + a fixed approved suffix.
-- Before running: confirm each source sentence equals the service description in the database; skip any that differ.
-- Only meta_description and updated_at are written.

-- performance-marketing (154 chars, suffix 2)
INSERT INTO public.seo_setting (page_key, page_label, meta_description, updated_at)
VALUES ('service:performance-marketing', 'Service: performance-marketing', 'Data-driven paid campaigns on Meta and Google that generate real revenue, not just clicks. Mommantum is a Jaipur-based growth studio helping brands scale.', NOW())
ON CONFLICT (page_key) DO UPDATE SET meta_description = EXCLUDED.meta_description, updated_at = NOW();

-- social-media-marketing (148 chars, suffix 5)
INSERT INTO public.seo_setting (page_key, page_label, meta_description, updated_at)
VALUES ('service:social-media-marketing', 'Service: social-media-marketing', 'Social media marketing services that help your brand stay visible, build trust, and connect with the right audience consistently. Mommantum, Jaipur.', NOW())
ON CONFLICT (page_key) DO UPDATE SET meta_description = EXCLUDED.meta_description, updated_at = NOW();

-- search-engine-optimization (143 chars, suffix 4)
INSERT INTO public.seo_setting (page_key, page_label, meta_description, updated_at)
VALUES ('service:search-engine-optimization', 'Service: search-engine-optimization', 'Get found by people who are ready to buy — on search engines, answer platforms, and AI-driven tools. Mommantum is a Jaipur-based growth studio.', NOW())
ON CONFLICT (page_key) DO UPDATE SET meta_description = EXCLUDED.meta_description, updated_at = NOW();

-- d2c-branding-scale-growth (154 chars, suffix 2)
INSERT INTO public.seo_setting (page_key, page_label, meta_description, updated_at)
VALUES ('service:d2c-branding-scale-growth', 'Service: d2c-branding-scale-growth', 'End-to-end brand and growth strategy built specifically for direct-to-consumer businesses. Mommantum is a Jaipur-based growth studio helping brands scale.', NOW())
ON CONFLICT (page_key) DO UPDATE SET meta_description = EXCLUDED.meta_description, updated_at = NOW();

-- conversion-rate-optimization (143 chars, suffix 2)
INSERT INTO public.seo_setting (page_key, page_label, meta_description, updated_at)
VALUES ('service:conversion-rate-optimization', 'Service: conversion-rate-optimization', 'Turn more of your existing traffic into customers without spending more on ads. Mommantum is a Jaipur-based growth studio helping brands scale.', NOW())
ON CONFLICT (page_key) DO UPDATE SET meta_description = EXCLUDED.meta_description, updated_at = NOW();

-- script-copywriting (154 chars, suffix 2)
INSERT INTO public.seo_setting (page_key, page_label, meta_description, updated_at)
VALUES ('service:script-copywriting', 'Service: script-copywriting', 'Words that sell — ads, landing pages, emails, video scripts, and brand copy that converts. Mommantum is a Jaipur-based growth studio helping brands scale.', NOW())
ON CONFLICT (page_key) DO UPDATE SET meta_description = EXCLUDED.meta_description, updated_at = NOW();

-- strategy-consulting (145 chars, suffix 4)
INSERT INTO public.seo_setting (page_key, page_label, meta_description, updated_at)
VALUES ('service:strategy-consulting', 'Service: strategy-consulting', 'Clear direction and practical growth plans for D2C brands that want better results from their efforts. Mommantum is a Jaipur-based growth studio.', NOW())
ON CONFLICT (page_key) DO UPDATE SET meta_description = EXCLUDED.meta_description, updated_at = NOW();

-- web-app-development (155 chars, suffix 2)
INSERT INTO public.seo_setting (page_key, page_label, meta_description, updated_at)
VALUES ('service:web-app-development', 'Service: web-app-development', 'Fast, scalable websites and web applications built for performance, conversion, and growth. Mommantum is a Jaipur-based growth studio helping brands scale.', NOW())
ON CONFLICT (page_key) DO UPDATE SET meta_description = EXCLUDED.meta_description, updated_at = NOW();

-- ai-automation (158 chars, suffix 2)
INSERT INTO public.seo_setting (page_key, page_label, meta_description, updated_at)
VALUES ('service:ai-automation', 'Service: ai-automation', 'Automate repetitive workflows with AI so your team focuses on work that actually needs humans. Mommantum is a Jaipur-based growth studio helping brands scale.', NOW())
ON CONFLICT (page_key) DO UPDATE SET meta_description = EXCLUDED.meta_description, updated_at = NOW();

-- ai-agentic-service (156 chars, suffix 2)
INSERT INTO public.seo_setting (page_key, page_label, meta_description, updated_at)
VALUES ('service:ai-agentic-service', 'Service: ai-agentic-service', 'Custom AI agents that think, decide, and act — handling complex multi-step tasks end to end. Mommantum is a Jaipur-based growth studio helping brands scale.', NOW())
ON CONFLICT (page_key) DO UPDATE SET meta_description = EXCLUDED.meta_description, updated_at = NOW();

-- ai-video-generation (156 chars, suffix 2)
INSERT INTO public.seo_setting (page_key, page_label, meta_description, updated_at)
VALUES ('service:ai-video-generation', 'Service: ai-video-generation', 'High-quality AI-generated video content for ads, social, explainers, and brand storytelling. Mommantum is a Jaipur-based growth studio helping brands scale.', NOW())
ON CONFLICT (page_key) DO UPDATE SET meta_description = EXCLUDED.meta_description, updated_at = NOW();

-- content-video-scripting (149 chars, suffix 1)
INSERT INTO public.seo_setting (page_key, page_label, meta_description, updated_at)
VALUES ('service:content-video-scripting', 'Service: content-video-scripting', 'Good content does not start with a camera, it starts with a script. Mommantum is a Jaipur-based growth studio helping D2C and ecommerce brands scale.', NOW())
ON CONFLICT (page_key) DO UPDATE SET meta_description = EXCLUDED.meta_description, updated_at = NOW();

-- video-editing (147 chars, as is)
INSERT INTO public.seo_setting (page_key, page_label, meta_description, updated_at)
VALUES ('service:video-editing', 'Service: video-editing', 'A great video that is poorly edited loses people fast, choppy cuts, dead silence, slow pacing, and viewers are gone before your message even lands.', NOW())
ON CONFLICT (page_key) DO UPDATE SET meta_description = EXCLUDED.meta_description, updated_at = NOW();

-- ai-video-editing (153 chars, suffix 5)
INSERT INTO public.seo_setting (page_key, page_label, meta_description, updated_at)
VALUES ('service:ai-video-editing', 'Service: ai-video-editing', 'Sitting there for hours trimming clips, matching up cuts, fixing tiny details one by one, that is basically what editing used to mean. Mommantum, Jaipur.', NOW())
ON CONFLICT (page_key) DO UPDATE SET meta_description = EXCLUDED.meta_description, updated_at = NOW();

-- podcast-editing (155 chars, as is)
INSERT INTO public.seo_setting (page_key, page_label, meta_description, updated_at)
VALUES ('service:podcast-editing', 'Service: podcast-editing', 'Recording a podcast is the easy part, turning hours of raw conversation into something people actually want to listen to is where most podcasts fall apart.', NOW())
ON CONFLICT (page_key) DO UPDATE SET meta_description = EXCLUDED.meta_description, updated_at = NOW();

-- motion-graphics (145 chars, suffix 2)
INSERT INTO public.seo_setting (page_key, page_label, meta_description, updated_at)
VALUES ('service:motion-graphics', 'Service: motion-graphics', 'A plain photo or a still video can only say so much before people scroll past it. Mommantum is a Jaipur-based growth studio helping brands scale.', NOW())
ON CONFLICT (page_key) DO UPDATE SET meta_description = EXCLUDED.meta_description, updated_at = NOW();
