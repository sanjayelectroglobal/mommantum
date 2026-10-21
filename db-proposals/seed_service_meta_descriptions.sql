-- ==============================================================================
-- Proposal: Service meta descriptions (Step 7)
-- Status: PROPOSAL ONLY (Step 0b precondition blocked due to missing last_updated)
-- Table: public.seo_setting (upsert on page_key)
-- Generated strictly according to Step 7 length & suffix rules
-- ==============================================================================

-- 1. search-engine-optimization (len: 143, suffix2 applied)
INSERT INTO public.seo_setting (id, page_key, page_label, meta_description, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'service:search-engine-optimization', 'Search Engine Optimization', 'Get found by people who are ready to buy — on search engines, answer platforms, and AI-driven tools. Mommantum is a Jaipur-based growth studio.', NOW())
ON CONFLICT (page_key) DO UPDATE SET
  meta_description = EXCLUDED.meta_description,
  last_updated = NOW();

-- 2. social-media-marketing (len: 148, suffix3 applied)
INSERT INTO public.seo_setting (id, page_key, page_label, meta_description, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'service:social-media-marketing', 'Social Media Marketing', 'Social media marketing services that help your brand stay visible, build trust, and connect with the right audience consistently. Mommantum, Jaipur.', NOW())
ON CONFLICT (page_key) DO UPDATE SET
  meta_description = EXCLUDED.meta_description,
  last_updated = NOW();

-- 3. strategy-consulting (len: 145, suffix2 applied)
INSERT INTO public.seo_setting (id, page_key, page_label, meta_description, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'service:strategy-consulting', 'Strategy Consulting', 'Clear direction and practical growth plans for D2C brands that want better results from their efforts. Mommantum is a Jaipur-based growth studio.', NOW())
ON CONFLICT (page_key) DO UPDATE SET
  meta_description = EXCLUDED.meta_description,
  last_updated = NOW();

-- 4. content-video-scripting (len: 152, cut at last clause/space)
INSERT INTO public.seo_setting (id, page_key, page_label, meta_description, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'service:content-video-scripting', 'Content & Video Scripting', 'Good content does not start with a camera, it starts with a script. Most brands jump straight into filming and end up with videos that look fine but say', NOW())
ON CONFLICT (page_key) DO UPDATE SET
  meta_description = EXCLUDED.meta_description,
  last_updated = NOW();

-- 5. video-editing (len: 146, cut at punctuation)
INSERT INTO public.seo_setting (id, page_key, page_label, meta_description, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'service:video-editing', 'Video Editing', 'A great video that is poorly edited loses people fast, choppy cuts, dead silence, slow pacing, and viewers are gone before your message even lands', NOW())
ON CONFLICT (page_key) DO UPDATE SET
  meta_description = EXCLUDED.meta_description,
  last_updated = NOW();

-- 6. ai-video-editing (len: 155, cut at last clause/space)
INSERT INTO public.seo_setting (id, page_key, page_label, meta_description, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'service:ai-video-editing', 'AI Video Editing', 'Sitting there for hours trimming clips, matching up cuts, fixing tiny details one by one, that is basically what editing used to mean. AI video editing has', NOW())
ON CONFLICT (page_key) DO UPDATE SET
  meta_description = EXCLUDED.meta_description,
  last_updated = NOW();

-- 7. podcast-editing (len: 154, cut at punctuation)
INSERT INTO public.seo_setting (id, page_key, page_label, meta_description, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'service:podcast-editing', 'Podcast Editing', 'Recording a podcast is the easy part, turning hours of raw conversation into something people actually want to listen to is where most podcasts fall apart', NOW())
ON CONFLICT (page_key) DO UPDATE SET
  meta_description = EXCLUDED.meta_description,
  last_updated = NOW();

-- 8. motion-graphics (len: 152, cut at last clause/space)
INSERT INTO public.seo_setting (id, page_key, page_label, meta_description, last_updated)
VALUES ('seo_' || replace(gen_random_uuid()::text, '-', ''), 'service:motion-graphics', 'Motion Graphics', 'A plain photo or a still video can only say so much before people scroll past it. The moment something starts moving on screen, whether that is a bit of', NOW())
ON CONFLICT (page_key) DO UPDATE SET
  meta_description = EXCLUDED.meta_description,
  last_updated = NOW();

-- The following 8 services have no suffix fitting 140-160 characters and are left unchanged per Step 7 rules:
-- - d2c-branding-scale-growth (len: 90)
-- - script-copywriting (len: 90)
-- - web-app-development (len: 91)
-- - ai-automation (len: 94)
-- - performance-marketing (len: 90)
-- - ai-video-generation (len: 92)
-- - conversion-rate-optimization (len: 79)
-- - ai-agentic-service (len: 92)
