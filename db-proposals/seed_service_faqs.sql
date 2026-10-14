-- ==============================================================================
-- Seed Proposal: Seed service FAQs into public.service
-- Status: PROPOSAL ONLY (LOCAL ONLY - Do not execute against production)
-- Purpose: Populates client-approved FAQs verbatim from prompt JSON
--          Slug mapping:
--            - ai-agents -> ai-agentic-service
--            - copywriting + content-video-scripting -> script-copywriting (cap 8: 5 cw + 3 cvs)
--            - marketing-consulting -> strategy-consulting
--          Excluded services (no DB rows):
--            - video-editing, ai-video-editing, podcast-editing, motion-graphics
-- Generated via: scripts/gen-faq-sql.ts
-- ==============================================================================

-- Performance Marketing (slug: performance-marketing, count: 6)
UPDATE public.services
SET faqs = '[
  {
    "question": "What does a performance marketing agency in India actually do?",
    "answer": "Performance marketing means every rupee you spend on ads should lead to something measurable, like a sale, a lead, or a booked call. We run campaigns on Meta Ads and Google Ads, test different creatives, and build a clear path from the first click to the final purchase."
  },
  {
    "question": "Which platforms do you run performance marketing campaigns on?",
    "answer": "We run performance marketing campaigns mainly on Meta Ads and Google Ads. Before spending anything, we study your market, your competitors, and your audience, so budget goes to the platform where your buyers actually are and where results can be measured, not wherever is simply popular."
  },
  {
    "question": "Which marketing performance metrics do you track?",
    "answer": "We track ROAS, CAC, and cost per result closely, so nothing runs on guesswork. Reporting stays honest and simple. You see what you spent, what it produced, and what we plan to test or scale next, based on real numbers instead of impressions or vanity views."
  },
  {
    "question": "What is the difference between brand and performance marketing?",
    "answer": "Brand marketing builds awareness slowly over time, while performance based marketing is built to get direct, trackable results. We focus on the second, because many brands come to us when they need actual revenue, not just visibility. Both work best when they support each other."
  },
  {
    "question": "Do you work as an ecommerce performance marketing agency for D2C brands?",
    "answer": "Yes. We work with D2C and ecommerce brands across India and internationally. We set campaigns live, test different creatives and offers, and only scale up spend once the numbers support it. Our team is based in Jaipur and works with clients remotely and in person."
  },
  {
    "question": "How does performance marketing connect with your other services?",
    "answer": "Paid ads never run separately from the rest of your brand. Performance marketing connects with our SEO, conversion rate optimization, web development, and social media marketing work, so paid growth and organic growth support each other instead of pulling in different directions."
  }
]'::jsonb
WHERE slug = 'performance-marketing';

-- Social Media Marketing (slug: social-media-marketing, count: 6)
UPDATE public.services
SET faqs = '[
  {
    "question": "What do your social media marketing services include?",
    "answer": "Our social media marketing services cover content planning, daily posting, and audience engagement, mostly built around Instagram. We prepare a content calendar with a mix of reels, posts, and stories, so your page stays active without feeling random, and we focus on genuine engagement rather than chasing likes."
  },
  {
    "question": "Are you a social media marketing agency in India or only in Jaipur?",
    "answer": "We are based in Jaipur and work as a social media marketing agency in India for D2C and ecommerce brands, and we also take on international clients. Whether you searched for a social media marketing agency near me or a national partner, the day to day work is handled the same way."
  },
  {
    "question": "Do you offer Instagram marketing services?",
    "answer": "Yes. Instagram is where most D2C brands find their buyers, so our Instagram marketing service covers content creation, reels, captions, and staying active with your community. The focus is always genuine engagement and building a real following that turns into sales, not just collecting likes."
  },
  {
    "question": "Do you use AI in social media marketing?",
    "answer": "We use AI in a few places, mainly to plan content faster and work out what kinds of posts tend to perform better over time. The content is still shaped around your brand and audience, so it feels consistent and human rather than automated or generic."
  },
  {
    "question": "Do you combine organic content with paid promotion?",
    "answer": "Yes. Good social media work usually needs both sides working together: organic content to build trust and paid promotion to reach people faster. This is where the benefits of social media marketing really show up, and our performance marketing team plans paid support alongside your content calendar."
  },
  {
    "question": "How do you plan a social media strategy before posting?",
    "answer": "Before we post anything, we spend time understanding your brand and looking at what is already working for similar D2C and ecommerce businesses. From there we build a content calendar, so every reel, post, and story has a purpose and your page grows steadily instead of posting at random."
  }
]'::jsonb
WHERE slug = 'social-media-marketing';

-- Search Engine Optimization (slug: search-engine-optimization, count: 6)
UPDATE public.services
SET faqs = '[
  {
    "question": "What do your SEO services in India include?",
    "answer": "Our SEO services in India start with a full SEO audit, then cover on page SEO like titles and content structure, and off page SEO like backlinks and mentions. We also handle Shopify SEO for ecommerce stores, local SEO for city based brands, and general SEO for D2C brands growing across India."
  },
  {
    "question": "How do you start an SEO project?",
    "answer": "We run a full SEO audit before touching anything on your site. It shows what is actually wrong, whether that is weak content, slow load times, broken canonical tags, or pages that search engines cannot read well. Then we fix both the on page and off page sides together."
  },
  {
    "question": "Do you promise SEO rankings overnight?",
    "answer": "No. Search engines do not work that way, and we never promise overnight results. We keep reporting simple and honest, and we care more about whether your traffic actually buys something than about a report full of rankings. SEO builds over time as trust builds with Google."
  },
  {
    "question": "Do you offer Shopify SEO and local SEO?",
    "answer": "Yes. We handle Shopify SEO for ecommerce stores, local SEO for brands serving specific cities like Jaipur, and general SEO for D2C brands trying to grow across India. The plan always starts with what your actual customers search for before they buy, not random keywords."
  },
  {
    "question": "What is AEO and do you include it?",
    "answer": "AEO means answer engine optimization. More people now ask questions through AI tools and voice assistants, so we structure your content to help your brand show up there too, not just on a regular Google search page. We include it alongside traditional SEO work."
  },
  {
    "question": "Have you achieved SEO results for a real brand?",
    "answer": "Yes. For a wellness brand we worked with, organic growth became a real part of their revenue. You can read the full story in our Jalvayu Wellness case study, which shows how SEO worked together with branding and marketing instead of running as a separate task."
  }
]'::jsonb
WHERE slug = 'search-engine-optimization';

-- D2C Branding & Scale Growth (slug: d2c-branding-scale-growth, count: 5)
UPDATE public.services
SET faqs = '[
  {
    "question": "What does your D2C branding and growth service include?",
    "answer": "We work on brand positioning, visual identity, and messaging so your D2C business feels like one connected experience, from product pages to packaging to retention emails. We also write website copy, product pages, and landing pages, and look at your acquisition channels to find the right mix."
  },
  {
    "question": "Why does a D2C brand need more than a good product?",
    "answer": "A good product is not enough anymore. Many D2C brands launch with something solid, but the website confuses people, the brand voice keeps changing, and customers do not stick around. If things do not say the same thing everywhere, that gap quietly costs you sales."
  },
  {
    "question": "Are you a branding agency in India that also handles marketing?",
    "answer": "Yes. As a branding agency in India, we connect branding with performance marketing and social media marketing, so every part of your D2C business grows in the same direction. Branding does not sit alone as a design task, it supports ads, content, and your website."
  },
  {
    "question": "What results have your D2C clients seen?",
    "answer": "A wellness brand we worked with grew its monthly revenue five times in six months once branding and marketing worked together. A street food brand, Urban Vada Pav, grew daily footfall from 40 to 210. Both are covered in detail in our case studies."
  },
  {
    "question": "Do you help with customer retention after the first sale?",
    "answer": "Yes. Combined with retention programmes like email and SMS, our branding and website work helps turn one time buyers into repeat customers instead of losing them after the first sale. Consistent messaging across ads, site, and emails makes people far more likely to come back."
  }
]'::jsonb
WHERE slug = 'd2c-branding-scale-growth';

-- Conversion Rate Optimization (slug: conversion-rate-optimization, count: 5)
UPDATE public.services
SET faqs = '[
  {
    "question": "What do your conversion rate optimization services include?",
    "answer": "Our conversion rate optimization services start with a full audit of your product pages, checkout flow, and overall site experience to find exactly where visitors drop off. We then fix those moments and test changes through A/B testing, rather than assuming what will work."
  },
  {
    "question": "How do you decide what to fix on my website?",
    "answer": "We look at real user behaviour: how people scroll, where they click, and where they stop. Sometimes the problem is a confusing call to action, sometimes a slow page, and sometimes too much friction before checkout. The data decides what we change first."
  },
  {
    "question": "What conversion improvements have you delivered?",
    "answer": "A kids clothing brand, The Kids Store, saw its conversion rate rise from 0.6% to 2.8%. A wellness brand, Jalvayu Wellness, improved its website conversion rate from 0.7% to 3.1%. Both results are explained in our case studies with the work behind them."
  },
  {
    "question": "Why optimize conversions before spending more on ads?",
    "answer": "The traffic you already have is traffic you already paid for. Improving how much of it converts is one of the most direct ways to grow without raising your ad budget, which means more purchases, fewer drop offs, and a lower cost per customer over time."
  },
  {
    "question": "Is conversion rate optimization in digital marketing separate from SEO and ads?",
    "answer": "No. It works best alongside SEO and paid campaigns, since better pages help every channel perform better. We connect it with our performance marketing and web development services, because a well built page and a well run campaign need to work together to convert."
  }
]'::jsonb
WHERE slug = 'conversion-rate-optimization';

-- Scriptwriting & Copywriting (slug: script-copywriting, count: 8)
UPDATE public.services
SET faqs = '[
  {
    "question": "What copywriting services do you offer?",
    "answer": "Our copywriting services cover ad copy, website copywriting, product descriptions, and email sequences, each written for how people actually behave on that platform. SEO copywriting is part of this too, since we write around what people already search for, so traffic is more likely to convert."
  },
  {
    "question": "What is the difference between copywriting and content writing?",
    "answer": "Content writing builds trust over time, while copywriting is built to get someone to act right now. Many brands confuse the two. Copywriting says exactly what a product does, who it is for, and why someone should care, in a way simple enough to understand at a glance."
  },
  {
    "question": "Do you use AI for copywriting?",
    "answer": "We use AI as a tool to speed up research and early drafts, but nothing goes live without a real writer shaping it to match your brand voice. That keeps the work fast while making sure every ad, page, and email sounds like your brand."
  },
  {
    "question": "Why hire a copywriting team instead of a freelance copywriter?",
    "answer": "A freelance copywriter can help with a one off project, but most growing brands need copy that stays consistent across ads, website, emails, and product pages. We treat copywriting as something to test and improve, not write once and leave alone."
  },
  {
    "question": "Has your copywriting improved results for real brands?",
    "answer": "Yes. A kids clothing brand saw its conversion rate climb from 0.6% to 2.8% once its copy matched what buyers needed to hear. A street food brand grew daily footfall from 40 to 210, largely because its messaging finally matched what customers wanted to hear."
  },
  {
    "question": "What is a video script and why does it matter?",
    "answer": "A script is the written plan for a video: what gets said, in what order, and how it flows from start to finish. It is the base every good video is built on, because a weak script means confused viewers, low watch time, and ads skipped early."
  },
  {
    "question": "How do you write a script for a YouTube video?",
    "answer": "We start with the main point you want to get across, build an opening that hooks the viewer in the first few seconds, then structure the middle and end so the video flows naturally instead of feeling scattered. Full YouTube and explainer scripts are part of our service."
  },
  {
    "question": "Do you write short video scripts for reels and shorts?",
    "answer": "Yes. Most of our scripting work is for short form content like reels, shorts, and quick social videos, since that is where most brands need consistent, fast turnaround content. We also create hooks and openings written to stop the scroll."
  }
]'::jsonb
WHERE slug = 'script-copywriting';

-- Strategy Consulting (slug: strategy-consulting, count: 5)
UPDATE public.services
SET faqs = '[
  {
    "question": "What does your marketing strategy consulting involve?",
    "answer": "Before suggesting anything, we take time to understand your business: what you sell, who buys it, and where things are breaking down. We then build a growth plan suited to your stage, covering your offer and pricing, brand positioning, and which channels deserve your time and budget now versus later."
  },
  {
    "question": "Who is marketing consulting meant for?",
    "answer": "It suits brands that are not short on effort but short on direction. If you run ads, post on social media, and try some SEO, yet none of it feels connected, that is usually a strategy problem rather than a hard work problem, and this is where we start."
  },
  {
    "question": "Is it just a strategy document, or do you help execute?",
    "answer": "Our consulting does not stop at a document full of suggestions. We stay involved, review what is working, and adjust the plan as real results come in. The strategy connects with our performance marketing and D2C branding services, so it is something you can actually execute."
  },
  {
    "question": "Do you build a custom plan or use a generic template?",
    "answer": "Every plan is custom. We do not copy a generic template from somewhere else. Once we know where the gaps are, we build a growth plan that makes sense for your stage as a business, based on your offer, positioning, and where your customers already are."
  },
  {
    "question": "What results has strategy-led work delivered?",
    "answer": "A wellness brand, Jalvayu Wellness, grew monthly revenue five times in six months once its strategy, branding, and execution moved in the same direction. A street food brand, Urban Vada Pav, grew daily footfall from 40 to 210 using the same approach."
  }
]'::jsonb
WHERE slug = 'strategy-consulting';

-- Web & App Development (slug: web-app-development, count: 5)
UPDATE public.services
SET faqs = '[
  {
    "question": "What does a web development company in Jaipur like Mommantum build?",
    "answer": "As a web development company in Jaipur, we build websites and apps meant to do a job: help someone understand your product fast, trust it, and take action without getting stuck. That includes ecommerce stores, custom web applications, tools, portals, and dashboards, built on the stack that fits."
  },
  {
    "question": "Which platforms do you use for ecommerce web development?",
    "answer": "For ecommerce brands, we handle ecommerce web development on platforms like Shopify and WordPress, built to move people from browsing to checkout without friction. For brands that need more than a standard site, we build custom web applications using whichever stack fits the project."
  },
  {
    "question": "Will my website work well on mobile?",
    "answer": "Yes. Most people browsing D2C brands in India are on their phones, so we build with clean navigation, fast load times, and a structure that makes sense on mobile. Good custom web development removes every small thing that makes a visitor hesitate before buying."
  },
  {
    "question": "Do you support the website after launch?",
    "answer": "Yes. We stay involved after launch, since a website is never really finished. It needs updates, speed checks, and small fixes as your brand grows, so the site keeps supporting your marketing instead of slowly falling behind. This ongoing support covers updates, speed checks, and fixes without starting over."
  },
  {
    "question": "Does web development connect with your SEO and ads work?",
    "answer": "Yes. A website built in isolation rarely performs as it should. We build pages that support your SEO work and convert the traffic your performance marketing campaigns bring in, so the site, the search visibility, and the ads all work together."
  }
]'::jsonb
WHERE slug = 'web-app-development';

-- AI Automation (slug: ai-automation, count: 5)
UPDATE public.services
SET faqs = '[
  {
    "question": "What does an AI automation agency like Mommantum do?",
    "answer": "As an AI automation agency, we hand repeated small tasks to a system so your team stops doing them manually every day, like replying to the same questions, updating the same sheets, and chasing the same follow ups. We start by watching how your business actually runs."
  },
  {
    "question": "What can you automate with AI?",
    "answer": "Our AI automation services are built around your workflow. That can mean an AI chat agent handling customer queries, automated follow ups, or connecting tools you already use so information moves between them without anyone copying and pasting, including AI marketing automation for leads."
  },
  {
    "question": "Do you install a generic bot?",
    "answer": "No. No two businesses run the same way, so we do not drop in a generic bot and call it done. We build around your actual workflow, test it with real scenarios before it goes live, and check it again afterwards."
  },
  {
    "question": "Does automation connect with marketing and sales?",
    "answer": "Yes. Automation on its own only goes so far if it sits disconnected from marketing and sales. We make sure it supports your performance marketing and social media work too, so leads get followed up faster and nothing falls through during a busy campaign."
  },
  {
    "question": "Do you support the automation after it goes live?",
    "answer": "Yes. Once it is live, we stay involved, checking how the automation performs and adjusting it as your business grows, rather than treating it as a one time setup. AI workflow automation works best when it keeps improving with your business."
  }
]'::jsonb
WHERE slug = 'ai-automation';

-- AI Agentic Service (slug: ai-agentic-service, count: 5)
UPDATE public.services
SET faqs = '[
  {
    "question": "What are AI agents and how are they different from basic automation?",
    "answer": "Basic automation follows one fixed step. An AI agent can look at a situation, decide what to do next, and carry a task through to the end on its own. Instead of your team checking, replying, and updating things one by one, the agent handles it."
  },
  {
    "question": "What can an AI chat agent do for my business?",
    "answer": "An AI chat agent replies to customers the moment they message, day or night, without your team sitting by the phone. For real estate it can qualify leads and answer property questions, and in healthcare it can handle appointment queries and basic patient questions."
  },
  {
    "question": "Which frameworks and tools do you use to build AI agents?",
    "answer": "We build using proper agentic AI frameworks and tools like n8n. We match the type of agent, whether model based, utility based, or a simpler rule based one, to what your business actually needs, rather than picking whatever sounds most advanced."
  },
  {
    "question": "How do you test an AI agent before it goes live?",
    "answer": "We test the agent against real situations before launch. After launch, we keep checking how it performs and adjust it as your business changes, so you are not stuck managing it constantly and it keeps working as your needs grow."
  },
  {
    "question": "Will AI agents fit with the tools and website I already use?",
    "answer": "Yes. Our AI agent work connects with our AI automation and web development services, so the agent fits properly into the tools and website you already use instead of sitting on its own as a separate system that nobody maintains."
  }
]'::jsonb
WHERE slug = 'ai-agentic-service';

-- AI Video Generation (slug: ai-video-generation, count: 5)
UPDATE public.services
SET faqs = '[
  {
    "question": "What does your AI video generator service do?",
    "answer": "You give us your product photos, a script, or even just an idea, and we turn it into a finished video without you needing to arrange a shoot every time. It removes the usual crew, booking, and waiting time, so the moment you wanted to catch is not missed."
  },
  {
    "question": "Do you offer text to video and image to video?",
    "answer": "Yes. We work with text to video generator AI setups for turning scripts straight into content, and image to video generator AI for cases where you already have great product photos sitting unused and just need them to move. Both routes let you produce fresh video content faster, without arranging a separate shoot each time."
  },
  {
    "question": "Can AI generated video help me test ad hooks?",
    "answer": "Yes. Testing five different video hooks for a Meta ad normally means five shoots or a lot of extra editing. With AI generated video we can turn out multiple versions quickly, so you test and see what works instead of guessing which message will land."
  },
  {
    "question": "Do I need to organise a shoot?",
    "answer": "No. That is the main point of this service. With your product photos, script, or idea, we produce the video, so you do not need to arrange a crew or a shoot every single time you want new content. You simply share what you have and we handle the rest of the production process."
  },
  {
    "question": "How does it work with your scripting and editing services?",
    "answer": "Scripting is usually the first step before video creation. Once the script is ready, it feeds into our AI video generation work, and our video editing and AI video editing services can polish the final result so the whole process moves faster from idea to finished video."
  }
]'::jsonb
WHERE slug = 'ai-video-generation';

