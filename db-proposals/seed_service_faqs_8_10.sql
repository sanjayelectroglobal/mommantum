-- ==============================================================================
-- Seed Proposal: Seed 8-10 service FAQs into public.services
-- Status: PROPOSAL ONLY (LOCAL ONLY - Do not execute against production)
-- Purpose: Ensures every service in Mommantum has 8-10 verified FAQs
--          with answers strictly between 40 and 60 words (plain text).
-- Generated via: Automated Verification Script
-- ==============================================================================

-- performance-marketing (count: 8) | Sources: public.services (slug: performance-marketing, points, outcomes), Keywords_for_MM.xlsx ('performance marketing')
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
  },
  {
    "question": "What is your testing methodology before scaling performance ad budgets?",
    "answer": "We run structured creative, audience, and offer split tests with small initial budgets before scaling. Once an ad set proves positive unit economics and dependable customer acquisition costs, we systematically increase spend while monitoring margin health and inventory velocity to avoid unprofitable vanity scaling."
  },
  {
    "question": "How often will our team receive performance marketing reports and check-ins?",
    "answer": "Clients receive live dashboard access alongside weekly performance summaries and bi-weekly strategic review calls. We present clear metrics including ad spend, attributed revenue, blended return on ad spend, and cost per acquisition, accompanied by concrete next-step testing plans rather than confusing vanity figures."
  }
]'::jsonb
WHERE slug = 'performance-marketing';

-- social-media-marketing (count: 8) | Sources: public.services (slug: social-media-marketing, points, outcomes), Keywords_for_MM.xlsx ('SMM Service')
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
  },
  {
    "question": "Do you manage community comments and direct messages on social channels?",
    "answer": "Yes. Active community management is essential for trust and conversion. We monitor incoming comments, inquiries, and direct messages, escalating specific customer service issues to your internal team while handling initial product questions warmly and efficiently to convert casual profile visitors into loyal buyers."
  },
  {
    "question": "How do you measure return on investment from organic social media marketing?",
    "answer": "We track profile engagement rates, follower quality, website referral traffic, link clicks, and direct conversions through tracked bio links. By correlating content campaigns with product demand spikes, we ensure organic social activity actively builds brand equity and fuels our paid acquisition funnels rather than existing in isolation."
  }
]'::jsonb
WHERE slug = 'social-media-marketing';

-- search-engine-optimization (count: 8) | Sources: public.services (slug: search-engine-optimization, points, outcomes), Keywords_for_MM.xlsx ('SEO service')
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
  },
  {
    "question": "How do you handle technical SEO and core web vitals optimization?",
    "answer": "Our technical SEO audit inspects site crawlability, indexation status, schema markup implementation, mobile usability, and Google Core Web Vitals. We optimize image compression, script loading order, and page response speeds so search engine bots crawl effortlessly and visitors experience immediate, smooth page rendering on mobile devices."
  },
  {
    "question": "What is your approach to internal linking and content cluster strategy?",
    "answer": "We structure your website into thematic topic clusters where comprehensive pillar guides connect naturally to specific supporting articles. Strategic contextual internal linking distributes domain authority efficiently across commercial landing pages, guides search engines through site hierarchy, and keeps readers engaged across relevant site solutions longer."
  }
]'::jsonb
WHERE slug = 'search-engine-optimization';

-- d2c-branding-scale-growth (count: 8) | Sources: public.services (slug: d2c-branding-scale-growth, points, outcomes), Keywords_for_MM.xlsx ('Branding', 'D2C ')
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
  },
  {
    "question": "How do you develop our brand voice, positioning, and visual guidelines?",
    "answer": "We conduct customer research, competitive audits, and founder discovery sessions to define your core value proposition. We then craft comprehensive brand guidelines detailing tone of voice, typographic hierarchy, color systems, packaging aesthetics, and creative art direction so every customer touchpoint looks consistently premium and memorable."
  },
  {
    "question": "How do you help D2C brands improve customer lifetime value and repeat purchases?",
    "answer": "We analyze cohort retention metrics, average order value patterns, and reorder cycles to build automated post-purchase email and WhatsApp flows. By delivering personalized replenishment reminders, tailored bundle suggestions, and exclusive VIP incentives, we help ecommerce brands maximize customer lifetime value without relying solely on paid ad reacquisition."
  },
  {
    "question": "What timeline should we expect when building a complete brand identity system?",
    "answer": "A complete brand identity sprint typically takes between four and six weeks. This timeline covers initial market discovery, audience persona development, visual identity concepts, revisions, packaging guidelines, and final digital asset handoff, ensuring your team receives thoroughly tested brand assets ready for omnichannel commercial deployment."
  }
]'::jsonb
WHERE slug = 'd2c-branding-scale-growth';

-- conversion-rate-optimization (count: 8) | Sources: public.services (slug: conversion-rate-optimization, points, outcomes), Keywords_for_MM.xlsx ('conversion rate optimization')
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
  },
  {
    "question": "What tools and research methods do you use for conversion rate audits?",
    "answer": "We combine quantitative web analytics with qualitative user behavior tracking, including visitor heatmaps, session recordings, click tracking, and checkout drop-off funnels. This dual approach reveals exact points of friction, confusing form fields, and mobile layout issues preventing ready buyers from completing purchases on your website."
  },
  {
    "question": "How do you optimize mobile checkout funnels for higher transaction completion?",
    "answer": "We streamline mobile checkouts by eliminating unnecessary form fields, enabling autofill, integrating trusted one-click payment gateways like UPI, and displaying prominent security badges. By removing navigation distractions and accelerating payment step transitions, we significantly reduce mobile cart abandonment and boost completed purchase rates."
  },
  {
    "question": "What is the typical timeline to launch our first conversion rate optimization experiments?",
    "answer": "Following onboarding, our team completes the comprehensive site audit and quantitative teardown within the first two weeks. We prioritize high-impact hypotheses using our scoring framework and deploy initial split tests on key product pages and cart flows by the third week of the partnership."
  }
]'::jsonb
WHERE slug = 'conversion-rate-optimization';

-- script-copywriting (count: 8) | Sources: public.services (slug: script-copywriting, points, outcomes), Keywords_for_MM.xlsx ('copywriting')
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

-- strategy-consulting (count: 8)
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
  },
  {
    "question": "What deliverables are included in a strategic marketing consulting engagement?",
    "answer": "Engagements deliver an actionable growth roadmap including unit economic models, competitor gap analyses, ideal customer profile definitions, channel allocation plans, and creative messaging playbooks. Rather than high-level theoretical decks, every deliverable features step-by-step implementation milestones assigned to internal or external execution teams."
  },
  {
    "question": "How do you align marketing strategy with our internal sales and operations teams?",
    "answer": "We facilitate cross-functional alignment sessions to ensure marketing forecasts match inventory supply, fulfillment capacity, and sales follow-up workflows. By unifying customer acquisition goals with operational reality, we prevent costly stockouts, customer service bottlenecks, and mismatched messaging across the entire brand experience."
  },
  {
    "question": "How long does a typical strategy consulting sprint last with Mommantum?",
    "answer": "Our strategy consulting sprints typically run for four to eight weeks, depending on business complexity and market scope. Following the strategy handoff, we frequently transition into ongoing quarterly advisory or hands-on execution oversight to guarantee strategic plans deliver targeted commercial growth."
  }
]'::jsonb
WHERE slug = 'strategy-consulting';

-- web-app-development (count: 8) | Sources: public.services (slug: web-app-development, points, outcomes), Keywords_for_MM.xlsx ('Web development')
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
  },
  {
    "question": "What modern web development tech stacks do you specialize in?",
    "answer": "We engineer high-performance web applications using modern technologies including Next.js, React, Tailwind CSS, TypeScript, and headless ecommerce platforms like Medusa and Shopify. Our modern development architecture ensures exceptional page loading speed, resilient uptime, clean API integrations, and intuitive editorial control for non-technical teams."
  },
  {
    "question": "How do you guarantee website security, uptime, and data protection?",
    "answer": "We implement industry-standard SSL encryption, secure environment variables, automated database backups, Web Application Firewall protections, and continuous vulnerability scanning. By hosting on globally distributed edge networks like Vercel and AWS, we guarantee 99.9% uptime and robust defense against automated bot traffic and DDoS disruptions."
  },
  {
    "question": "Can you migrate our existing store to a modern headless ecommerce architecture?",
    "answer": "Yes. We specialize in seamless ecommerce migrations, moving legacy catalogs, customer records, and order histories over without downtime or ranking losses. We preserve URL structures, implement 301 redirects meticulously, and optimize schema markup so your search visibility remains protected throughout the architectural upgrade."
  }
]'::jsonb
WHERE slug = 'web-app-development';

-- ai-automation (count: 8)
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
  },
  {
    "question": "How do you integrate AI automation with our existing CRM and communication tools?",
    "answer": "We build robust webhooks and API connectors integrating custom automation workflows with your existing CRM, WhatsApp Business, Gmail, Slack, and Google Sheets. Our automated pipelines synchronize data bi-directionally in real time, eliminating manual data entry while ensuring your internal team retains full visibility."
  },
  {
    "question": "What security standards do you maintain when automating company workflows with AI?",
    "answer": "We adhere strictly to enterprise data privacy principles. We never use proprietary company data or client customer records to train public AI models. All API tokens, webhooks, and automation environments run through secured endpoints with encrypted credentials and strict role-based permission controls."
  },
  {
    "question": "How quickly can our business expect return on investment from AI workflow automation?",
    "answer": "Most businesses experience measurable return on investment within the first thirty to sixty days. By eliminating dozens of weekly hours spent on manual reporting, repetitive customer routing, and lead qualification, your team reclaims valuable operational time while significantly speeding up response velocity."
  }
]'::jsonb
WHERE slug = 'ai-automation';

-- ai-agentic-service (count: 8)
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
  },
  {
    "question": "How do AI agents handle unexpected questions or complex human edge cases?",
    "answer": "Our AI agents are built with intelligent fallback safeguards and sentiment detection protocols. When encountering an ambiguous customer question or sensitive request, the agent gracefully acknowledges the inquiry, summarizes the context, and routes the conversation immediately to a designated human team member with full history."
  },
  {
    "question": "Can AI agents take autonomous actions like booking appointments or updating orders?",
    "answer": "Yes. Beyond simple conversational chat, our agentic workflows can check inventory levels, schedule calendar appointments, generate support tickets, update Medusa or Shopify order statuses, and trigger personalized notifications. Every autonomous action executes through authenticated APIs with strict verification boundaries to ensure complete reliability."
  },
  {
    "question": "How do you train and refine AI agent responses over time?",
    "answer": "We train agents on your proprietary brand documentation, verified product catalogs, refund policies, and past customer support transcripts. Through scheduled weekly evaluation loops, our engineers review edge cases, optimize prompts, and refine response accuracy so agent helpfulness and tone improve continuously."
  }
]'::jsonb
WHERE slug = 'ai-agentic-service';

-- ai-video-generation (count: 8)
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
  },
  {
    "question": "What creative assets or inputs do you need from us to generate AI videos?",
    "answer": "You only need to supply basic product images, website links, brand guidelines, and key promotional angles. Our creative team handles scriptwriting, voiceover generation, visual asset rendering, background audio licensing, and final format rendering, delivering publish-ready video ads directly to your team without costly shoots."
  },
  {
    "question": "Can AI generated videos be formatted for Instagram Reels, TikTok, and YouTube Shorts?",
    "answer": "Yes. We generate high-definition videos tailored for vertical 9:16 reels, shorts, and TikTok feeds, as well as landscape 16:9 formats for YouTube and website heroes. Every video includes dynamic pacing, bold on-screen subtitles, and visual hooks engineered specifically for maximum platform retention."
  },
  {
    "question": "How does AI video generation compare in cost and speed to traditional video shoots?",
    "answer": "AI video generation reduces production costs by up to seventy percent and compresses turnaround from weeks to days. By bypassing physical studios, talent casting, and weather dependencies, your brand can test multiple creative hooks rapidly and scale winning paid ad variations with minimal capital expenditure."
  }
]'::jsonb
WHERE slug = 'ai-video-generation';

-- content-video-scripting (count: 8) | Sources: public.services (slug: content-video-scripting, intro, points, outcomes), Keywords_for_MM.xlsx ('video scripting')
UPDATE public.services
SET faqs = '[
    {
      "question": "What types of video scripts does Mommantum write?",
      "answer": "We write video scripts for high converting paid ads, Instagram Reels, YouTube Shorts, and full length YouTube explainer videos. Every script is structured with strong opening hooks to stop the scroll, clear messaging tied to your brand identity, and simple scene directions that make filming straightforward for your team."
    },
    {
      "question": "How do you structure scripts to increase viewer retention?",
      "answer": "Our scripts focus on immediate visual and verbal hooks within the first two seconds, followed by concise value delivery and natural pacing. We eliminate fluff so viewers stay engaged longer, preventing early drop offs and guiding them seamlessly toward a clear call to action that supports your marketing goals."
    },
    {
      "question": "Can you adapt scripts for AI text-to-video tools?",
      "answer": "Yes. We format prompts and narration scripts specifically engineered to work with AI video generation tools. We structure descriptive visual cues, camera transitions, and voiceover timing so text to video platforms can generate cohesive, high quality clips that align accurately with your creative vision and brand guidelines."
    },
    {
      "question": "Do you provide voiceover and narration scripts?",
      "answer": "We write complete voiceover scripts with natural phrasing, tone indicators, and timing notes for professional voice artists or AI voice models. Our scripts ensure spoken dialogue sounds authentic, conversational, and aligned with your target audience, making the final recorded voiceover clear, engaging, and easy to edit."
    },
    {
      "question": "How does scriptwriting connect with video editing?",
      "answer": "Good editing depends on a well structured script. By planning cuts, graphics, captions, and b-roll placements during the scripting phase, we save significant editing time. Footage matches the intended narrative flow, resulting in faster post production turnaround and a polished finished video that delivers real business impact."
    },
    {
      "question": "Do you write multiple script variations for creative testing?",
      "answer": "Yes. We create multiple script variations featuring alternative opening hooks, angles, and calls to action. This allows growth teams and media buyers to test different creative concepts against each other in paid ad campaigns, discovering which message resonates best with target audiences before scaling production spend."
    },
    {
      "question": "What information do you need from us to begin writing scripts?",
      "answer": "We need your core product offer, target audience details, brand voice guidelines, and the primary campaign goal. If you have reference videos or past performance data, we review those as well. We then organize creative ideas into actionable shooting scripts ready for fast, efficient production."
    },
    {
      "question": "Do you support ongoing content planning alongside scriptwriting?",
      "answer": "Yes. We partner with brands on ongoing retainers to build regular monthly content calendars. We generate fresh video concepts, plan weekly short form scripts for social channels, and ensure your video production pipeline stays filled with relevant, on brand ideas without last minute creative scrambling."
    }
  ]'::jsonb
WHERE slug = 'content-video-scripting';


-- video-editing (count: 8) | Sources: public.services (slug: video-editing, intro, points, outcomes), Keywords_for_MM.xlsx ('video editing')
UPDATE public.services
SET faqs = '[
    {
      "question": "What video editing services does Mommantum provide?",
      "answer": "We provide comprehensive video editing for paid social ads, Instagram Reels, YouTube videos, and corporate presentations. Our studio handles footage trimming, rhythm pacing, sound design, animated captions, color grading, and aspect ratio formatting to deliver polished, ready to publish video assets that elevate your brand image."
    },
    {
      "question": "How do you optimize video pacing for better watch time?",
      "answer": "We eliminate awkward pauses, dead space, and repetitive footage by using tight cuts, dynamic zooms, and rhythmic transitions. By syncing audio beats with visual changes and maintaining continuous motion, we keep viewers engaged throughout the video, increasing overall completion rates and platform algorithm distribution."
    },
    {
      "question": "Do you create multiple video versions for ad testing?",
      "answer": "Yes. We produce multiple creative variations from your raw footage, testing different introductory hooks, text overlays, background music tracks, and calls to action. This gives media buyers diverse creative options to test across Meta and TikTok ad sets, finding winning creatives that drive higher return on ad spend."
    },
    {
      "question": "Can you edit long form YouTube content and podcasts?",
      "answer": "Yes. We edit long form YouTube videos and video podcasts, ensuring balanced audio levels, multicamera angle switching, graphic title cards, and seamless chapter transitions. We structure long form videos to maintain viewer interest, then extract key memorable moments into short vertical clips for social media distribution."
    },
    {
      "question": "What is your typical turnaround time for edited videos?",
      "answer": "Standard short form social videos and ad creatives are typically delivered within two to three business days, while comprehensive long form YouTube projects take slightly longer. We maintain efficient revision workflows to incorporate your feedback quickly, ensuring your content publishing schedule remains consistent and reliable."
    },
    {
      "question": "Do you add subtitles and custom captions to videos?",
      "answer": "Yes. We design high contrast, animated captions and subtitles styled to match your visual brand identity. Because many users watch social video without sound, accurate and engaging captions ensure your message is communicated clearly, increasing retention and accessibility across mobile feeds and story formats."
    },
    {
      "question": "How do we share raw footage with your editing team?",
      "answer": "You can upload raw footage directly to secure cloud storage folders on Google Drive, Dropbox, or Frame.io. Our team downloads the assets, organizes project files, and delivers review drafts through timestamped feedback platforms, making commenting, requesting adjustments, and final file approval seamless and simple."
    },
    {
      "question": "Can you handle high volume ongoing video editing retainers?",
      "answer": "Yes. We support content creators, D2C brands, and marketing agencies with monthly video editing retainers. Our editors follow your established brand style guides and template presets, delivering a consistent stream of finished weekly videos without requiring you to recruit and manage internal editing staff."
    }
  ]'::jsonb
WHERE slug = 'video-editing';


-- ai-video-editing (count: 8) | Sources: public.services (slug: ai-video-editing, intro, points, outcomes), Keywords_for_MM.xlsx ('AI video editing')
UPDATE public.services
SET faqs = '[
    {
      "question": "What is AI video editing and how does it work?",
      "answer": "AI video editing combines automated artificial intelligence tools with experienced human video editors. AI software rapidly identifies key moments, cuts out silent pauses, generates accurate captions, and normalizes audio levels, after which our professional editors refine the pacing, style, and visual polish to ensure exceptional output quality."
    },
    {
      "question": "How does AI video editing save time and reduce costs?",
      "answer": "Automating tedious technical tasks like transcription, silence detection, and rough cut assembly cuts post production time in half. This speed significantly lowers production costs per video, allowing brands to publish higher volumes of content and test more creative concepts without sacrificing overall craftsmanship or storytelling quality."
    },
    {
      "question": "Does human editing still review AI assisted video projects?",
      "answer": "Always. While AI tools accelerate initial footage processing and rough cuts, human editors oversee every single detail. We fine tune comedic timing, emotional narrative pacing, color correction, sound balance, and typography, ensuring the finished video feels intentional, authentic, and completely aligned with your brand standards."
    },
    {
      "question": "Can AI video editing extract viral clips from long recordings?",
      "answer": "Yes. We utilize AI listening tools to scan hours of long form webinars, podcasts, or interviews for engaging topics and energetic exchanges. We then manually craft these highlights into vertical short form clips with captivating hooks, animated text, and background music optimized for social media growth."
    },
    {
      "question": "What video formats and platforms do you optimize for?",
      "answer": "We optimize exports for all major digital platforms, including vertical nine by sixteen for Instagram Reels, YouTube Shorts, and TikTok, alongside horizontal sixteen by nine for YouTube and websites. AI tools reframe subjects automatically to keep action centered across every screen dimension."
    },
    {
      "question": "How do you handle automated caption generation and accuracy?",
      "answer": "AI transcription tools generate initial caption text with accurate word level synchronization. Our editors then manually proofread every line to correct brand terminology, technical jargon, and punctuation, styling captions with legible typography and dynamic animation to maximize viewer comprehension on silent feeds."
    },
    {
      "question": "Can AI video editing help us test more paid ad variations?",
      "answer": "Yes. The speed of AI workflow automation enables us to generate dozens of creative permutations quickly. We test alternative opening hooks, customer problem statements, and call to action endings, giving performance marketing teams data driven creative assets to improve click through rates and ad efficiency."
    },
    {
      "question": "What raw materials do you need to start AI video editing?",
      "answer": "We need your recorded video footage or audio files, your brand assets such as logos and brand fonts, and your project objectives. Our team analyzes the source material, applies AI powered workflows, and delivers polished drafts ready for your review and deployment."
    }
  ]'::jsonb
WHERE slug = 'ai-video-editing';


-- podcast-editing (count: 8) | Sources: public.services (slug: podcast-editing, intro, points, outcomes), Keywords_for_MM.xlsx ('Pod cast')
UPDATE public.services
SET faqs = '[
    {
      "question": "What is included in your podcast editing service?",
      "answer": "Our podcast editing service covers comprehensive audio cleanup, video podcast editing, background noise removal, equalization, volume balancing across speakers, and filler word reduction. We also insert your intro, outro, sponsor messages, and provide ready to publish files formatted for Apple Podcasts, Spotify, and YouTube."
    },
    {
      "question": "Do you edit both audio-only and video podcast formats?",
      "answer": "Yes. We edit audio only podcasts as well as multi camera video podcasts. For video episodes, we handle dynamic camera switching between hosts and guests, color grading, title animations, and audio video synchronization, delivering engaging full episodes suitable for YouTube and dedicated streaming platforms."
    },
    {
      "question": "How do you improve podcast audio quality and clarity?",
      "answer": "We apply advanced digital audio processing including vocal isolation, de-essing, ambient room noise reduction, and dynamic compression. By balancing volume levels between hosts and remote guests, we ensure speech sounds crisp, warm, and natural, providing listeners with a pleasant and fatigue free listening experience."
    },
    {
      "question": "Can you repurpose full podcast episodes into short social clips?",
      "answer": "Yes. We extract the most insightful, thought provoking, or entertaining moments from each episode and format them into vertical video clips for Instagram Reels, TikTok, and LinkedIn. Each clip includes animated subtitles and branding, driving new listeners from social media directly to your show."
    },
    {
      "question": "What is your turnaround time for weekly podcast episodes?",
      "answer": "We typically deliver fully edited podcast episodes within two to three business days from receiving raw audio or video files. This consistent turnaround allows podcast creators and corporate hosts to maintain a reliable publishing schedule and build a loyal audience without production delays."
    },
    {
      "question": "Do you write podcast show notes and episode summaries?",
      "answer": "Yes. We provide written episode summaries, key takeaway bullet points, timestamps, and resource links ready to paste into your podcast hosting dashboard. Well written show notes improve your podcast search visibility and help listeners easily navigate the topics covered in each episode."
    },
    {
      "question": "How do you handle remote guest recordings and uneven audio?",
      "answer": "Remote recordings often suffer from uneven microphones and varied room acoustics. We balance differing audio tracks individually, matching vocal volume, filtering background echo, and smoothing glitches so remote conversations sound like both speakers recorded together directly in the same professional studio environment."
    },
    {
      "question": "Can you assist with podcast launch strategy and setup?",
      "answer": "Yes. We help new podcasters configure RSS hosting feeds, artwork specifications, intro music licensing, and directory submissions on Apple, Spotify, and Amazon Music. We establish efficient recording workflows so you can launch your podcast confidently with professional audio standards from episode one."
    }
  ]'::jsonb
WHERE slug = 'podcast-editing';


-- motion-graphics (count: 8) | Sources: public.services (slug: motion-graphics, intro, points, outcomes), Keywords_for_MM.xlsx ('motion graphics')
UPDATE public.services
SET faqs = '[
    {
      "question": "What types of motion graphics does Mommantum produce?",
      "answer": "We create custom 2D animated explainers, kinetic typography, animated logos, UI product walkthroughs, social media ad animations, and branded motion overlays. Our motion graphics enhance storytelling, making abstract concepts easy to understand and giving your marketing content a polished, state of the art visual feel."
    },
    {
      "question": "How do motion graphics improve ad performance and conversion rates?",
      "answer": "Motion naturally captures attention in fast scrolling social feeds. Dynamic animated text, moving graphics, and engaging product demonstrations hold viewer interest longer than static images, communicating your core value proposition clearly and driving higher click through rates and sales conversions on paid ad campaigns."
    },
    {
      "question": "Do you design animated product explainers for SaaS and tech brands?",
      "answer": "Yes. We specialize in animated explainer videos that simplify complex software workflows, web platforms, and tech services. By animating user interface elements, key features, and user benefits, we help prospective customers understand your product quickly without needing lengthy technical documentation."
    },
    {
      "question": "What animation software and tools do you use?",
      "answer": "Our motion design team primarily uses industry standard Adobe After Effects, Illustrator, and Premiere Pro. We create custom vector illustrations, kinetic typography presets, and composite animation layers to ensure smooth keyframing, fluid transitions, and high resolution rendering across all digital formats."
    },
    {
      "question": "Can you incorporate motion graphics into existing live footage?",
      "answer": "Yes. We frequently integrate animated lower thirds, callout arrows, statistic graphics, and animated icon badges into live action videos and product footage. This visual enhancement emphasizes critical product benefits and keeps audiences engaged without requiring you to re film your footage."
    },
    {
      "question": "Do you create animated logo intros and brand motion guidelines?",
      "answer": "Yes. We design memorable animated logo stings, video bumper intros, and animated lower thirds that establish strong brand recall. We also provide motion design guidelines so your video editors can maintain consistent animation styles, transitions, and easing across all future video production."
    },
    {
      "question": "What is the typical production process for a motion graphics video?",
      "answer": "The process begins with scriptwriting and concept outlining, followed by visual style frames and storyboard sketches for your review. Once approved, we build custom illustrations, animate keyframes, synchronize voiceover audio, and apply final sound design to produce a finished, broadcast quality animation."
    },
    {
      "question": "How long does a typical motion graphics project take to complete?",
      "answer": "Short social motion graphics and animated ads typically take three to five business days, while comprehensive sixty second animated explainer videos take approximately one to two weeks depending on storyboard complexity and revision cycles. We provide regular milestone updates throughout the entire animation process."
    }
  ]'::jsonb
WHERE slug = 'motion-graphics';

