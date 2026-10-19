/**
 * Centralized FAQ Data Repository
 * 
 * Purpose:
 * Consolidates all authentic, client-approved FAQs across Mommantum's digital marketing,
 * SEO, AI, web development, video production, and agency operations.
 * Sourced directly from existing project files:
 * - src/lib/data/home-faqs.ts
 * - db-proposals/seed_service_faqs.sql
 * - src/modules/editz/lib/data.ts
 * 
 * Guarantees:
 * - Zero fabricated or hallucinated Q&As.
 * - Single source of truth for both Homepage Footer (3-4 questions) and dedicated /faq page (all categories).
 */

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

export interface FAQCategory {
  id: string
  name: string
  description: string
  icon: string
  faqs: FAQItem[]
}

/**
 * Top 4 Curated FAQs for Homepage Footer
 * Selected specifically for brand discovery, location, remote capability, and service breadth.
 */
export const HOMEPAGE_FOOTER_FAQS: FAQItem[] = [
  {
    id: "home-1",
    question: "What does Mommantum do?",
    answer:
      "Mommantum is a Jaipur based digital marketing agency and growth studio. We help D2C and ecommerce brands grow through performance marketing, SEO, social media marketing, branding, conversion rate optimization, web development, AI automation, AI agents, and video services, all connected so each channel supports the others.",
    category: "General",
  },
  {
    id: "home-2",
    question: "Which services does Mommantum offer?",
    answer:
      "We offer performance marketing, SEO, social media marketing, D2C branding, conversion rate optimization, copywriting, marketing consulting, web and app development, AI automation, AI agents, AI video generation, video scripting, video editing, AI video editing, podcast editing, and motion graphics. Visit our services page for details on each.",
    category: "General",
  },
  {
    id: "home-3",
    question: "Do you work with clients outside Jaipur?",
    answer:
      "Yes. Although we are based in Jaipur, we work with brands across India and with international clients. The same strategy, reporting, and day to day attention applies wherever your business is based, whether you meet us in Jaipur or work with us remotely.",
    category: "General",
  },
  {
    // Mommantum official headquarters office address updated to Anand Vihar, Jagatpura
    id: "home-4",
    question: "Where is Mommantum located and can I visit the office?",
    answer:
      "Our office is at B-147, Anand Vihar, Jagatpura, Jaipur-302017, Rajasthan. Clients are welcome to visit. We are open Monday to Saturday, 9am to 9pm, and we also work with clients across India and internationally.",
    category: "General",
  },
]

/**
 * All Categorized FAQs for the Dedicated /faq Page
 */
export const ALL_FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: "general",
    name: "General & Agency",
    description: "Company background, office location, remote collaboration, and general inquiries.",
    icon: "🏢",
    faqs: [
      {
        id: "gen-1",
        question: "What does Mommantum do?",
        answer:
          "Mommantum is a Jaipur based digital marketing agency and growth studio. We help D2C and ecommerce brands grow through performance marketing, SEO, social media marketing, branding, conversion rate optimization, web development, AI automation, AI agents, and video services, all connected so each channel supports the others.",
        category: "General & Agency",
      },
      {
        // Mommantum official headquarters office address updated to Anand Vihar, Jagatpura
        id: "gen-2",
        question: "Where is Mommantum located and can I visit the office?",
        answer:
          "Our office is at B-147, Anand Vihar, Jagatpura, Jaipur-302017, Rajasthan. Clients are welcome to visit. We are open Monday to Saturday, 9am to 9pm, and we also work with clients across India and internationally.",
        category: "General & Agency",
      },
      {
        id: "gen-3",
        question: "Do you work with clients outside Jaipur?",
        answer:
          "Yes. Although we are based in Jaipur, we work with brands across India and with international clients. The same strategy, reporting, and day to day attention applies wherever your business is based, whether you meet us in Jaipur or work with us remotely.",
        category: "General & Agency",
      },
      {
        id: "gen-4",
        question: "Which services does Mommantum offer?",
        answer:
          "We offer performance marketing, SEO, social media marketing, D2C branding, conversion rate optimization, copywriting, marketing consulting, web and app development, AI automation, AI agents, AI video generation, video scripting, video editing, AI video editing, podcast editing, and motion graphics.",
        category: "General & Agency",
      },
      {
        id: "gen-5",
        question: "How can I contact Mommantum?",
        answer:
          "You can email kuldeep@mommantum.in or call or WhatsApp us on +91 7742276031. Our team is available Monday to Saturday, 9am to 9pm. You can also use the contact page on our website and tell us about your brand and goals.",
        category: "General & Agency",
      },
    ],
  },
  {
    id: "performance-marketing",
    name: "Performance Marketing",
    description: "Paid advertising across Meta, Google Ads, ROAS tracking, and paid acquisition.",
    icon: "📈",
    faqs: [
      {
        id: "perf-1",
        question: "What does a performance marketing agency in India actually do?",
        answer:
          "Performance marketing means every rupee you spend on ads should lead to something measurable, like a sale, a lead, or a booked call. We run campaigns on Meta Ads and Google Ads, test different creatives, and build a clear path from the first click to the final purchase.",
        category: "Performance Marketing",
      },
      {
        id: "perf-2",
        question: "Which platforms do you run performance marketing campaigns on?",
        answer:
          "We run performance marketing campaigns mainly on Meta Ads and Google Ads. Before spending anything, we study your market, your competitors, and your audience, so budget goes to the platform where your buyers actually are and where results can be measured, not wherever is simply popular.",
        category: "Performance Marketing",
      },
      {
        id: "perf-3",
        question: "Which marketing performance metrics do you track?",
        answer:
          "We track ROAS, CAC, and cost per result closely, so nothing runs on guesswork. Reporting stays honest and simple. You see what you spent, what it produced, and what we plan to test or scale next, based on real numbers instead of impressions or vanity views.",
        category: "Performance Marketing",
      },
      {
        id: "perf-4",
        question: "What is the difference between brand and performance marketing?",
        answer:
          "Brand marketing builds awareness slowly over time, while performance based marketing is built to get direct, trackable results. We focus on the second, because many brands come to us when they need actual revenue, not just visibility. Both work best when they support each other.",
        category: "Performance Marketing",
      },
      {
        id: "perf-5",
        question: "Do you work as an ecommerce performance marketing agency for D2C brands?",
        answer:
          "Yes. We work with D2C and ecommerce brands across India and internationally. We set campaigns live, test different creatives and offers, and only scale up spend once the numbers support it. Our team is based in Jaipur and works with clients remotely and in person.",
        category: "Performance Marketing",
      },
      {
        id: "perf-6",
        question: "How does performance marketing connect with your other services?",
        answer:
          "Paid ads never run separately from the rest of your brand. Performance marketing connects with our SEO, conversion rate optimization, web development, and social media marketing work, so paid growth and organic growth support each other instead of pulling in different directions.",
        category: "Performance Marketing",
      },
    ],
  },
  {
    id: "seo",
    name: "Search Engine Optimization",
    description: "Organic search visibility, technical SEO audits, Shopify SEO, and AEO/GEO.",
    icon: "🔍",
    faqs: [
      {
        id: "seo-1",
        question: "What do your SEO services in India include?",
        answer:
          "Our SEO services in India start with a full SEO audit, then cover on page SEO like titles and content structure, and off page SEO like backlinks and mentions. We also handle Shopify SEO for ecommerce stores, local SEO for city based brands, and general SEO for D2C brands growing across India.",
        category: "Search Engine Optimization",
      },
      {
        id: "seo-2",
        question: "How do you start an SEO project?",
        answer:
          "We run a full SEO audit before touching anything on your site. It shows what is actually wrong, whether that is weak content, slow load times, broken canonical tags, or pages that search engines cannot read well. Then we fix both the on page and off page sides together.",
        category: "Search Engine Optimization",
      },
      {
        id: "seo-3",
        question: "Do you promise SEO rankings overnight?",
        answer:
          "No. Search engines do not work that way, and we never promise overnight results. We keep reporting simple and honest, and we care more about whether your traffic actually buys something than about a report full of rankings. SEO builds over time as trust builds with Google.",
        category: "Search Engine Optimization",
      },
      {
        id: "seo-4",
        question: "Do you offer Shopify SEO and local SEO?",
        answer:
          "Yes. We handle Shopify SEO for ecommerce stores, local SEO for brands serving specific cities like Jaipur, and general SEO for D2C brands trying to grow across India. The plan always starts with what your actual customers search for before they buy, not random keywords.",
        category: "Search Engine Optimization",
      },
      {
        id: "seo-5",
        question: "What is AEO and do you include it?",
        answer:
          "AEO means answer engine optimization. More people now ask questions through AI tools and voice assistants, so we structure your content to help your brand show up there too, not just on a regular Google search page. We include it alongside traditional SEO work.",
        category: "Search Engine Optimization",
      },
      {
        id: "seo-6",
        question: "Have you achieved SEO results for a real brand?",
        answer:
          "Yes. For a wellness brand we worked with, organic growth became a real part of their revenue. You can read the full story in our Jalvayu Wellness case study, which shows how SEO worked together with branding and marketing instead of running as a separate task.",
        category: "Search Engine Optimization",
      },
    ],
  },
  {
    id: "social-media",
    name: "Social Media Marketing",
    description: "Instagram reels, content calendars, community engagement, and organic reach.",
    icon: "📱",
    faqs: [
      {
        id: "smm-1",
        question: "What do your social media marketing services include?",
        answer:
          "Our social media marketing services cover content planning, daily posting, and audience engagement, mostly built around Instagram. We prepare a content calendar with a mix of reels, posts, and stories, so your page stays active without feeling random, and we focus on genuine engagement rather than chasing likes.",
        category: "Social Media Marketing",
      },
      {
        id: "smm-2",
        question: "Are you a social media marketing agency in India or only in Jaipur?",
        answer:
          "We are based in Jaipur and work as a social media marketing agency in India for D2C and ecommerce brands, and we also take on international clients. Whether you searched for a social media marketing agency near me or a national partner, the day to day work is handled the same way.",
        category: "Social Media Marketing",
      },
      {
        id: "smm-3",
        question: "Do you offer Instagram marketing services?",
        answer:
          "Yes. Instagram is where most D2C brands find their buyers, so our Instagram marketing service covers content creation, reels, captions, and staying active with your community. The focus is always genuine engagement and building a real following that turns into sales, not just collecting likes.",
        category: "Social Media Marketing",
      },
      {
        id: "smm-4",
        question: "Do you use AI in social media marketing?",
        answer:
          "We use AI in a few places, mainly to plan content faster and work out what kinds of posts tend to perform better over time. The content is still shaped around your brand and audience, so it feels consistent and human rather than automated or generic.",
        category: "Social Media Marketing",
      },
      {
        id: "smm-5",
        question: "Do you combine organic content with paid promotion?",
        answer:
          "Yes. Good social media work usually needs both sides working together: organic content to build trust and paid promotion to reach people faster. This is where the benefits of social media marketing really show up, and our performance marketing team plans paid support alongside your content calendar.",
        category: "Social Media Marketing",
      },
      {
        id: "smm-6",
        question: "How do you plan a social media strategy before posting?",
        answer:
          "Before we post anything, we spend time understanding your brand and looking at what is already working for similar D2C and ecommerce businesses. From there we build a content calendar, so every reel, post, and story has a purpose and your page grows steadily instead of posting at random.",
        category: "Social Media Marketing",
      },
    ],
  },
  {
    id: "web-development",
    name: "Web & App Development",
    description: "High-speed ecommerce stores, custom Next.js web applications, and UI/UX.",
    icon: "💻",
    faqs: [
      {
        id: "web-1",
        question: "What does a web development company in Jaipur like Mommantum build?",
        answer:
          "As a web development company in Jaipur, we build websites and apps meant to do a job: help someone understand your product fast, trust it, and take action without getting stuck. That includes ecommerce stores, custom web applications, tools, portals, and dashboards, built on the stack that fits.",
        category: "Web & App Development",
      },
      {
        id: "web-2",
        question: "Which platforms do you use for ecommerce web development?",
        answer:
          "For ecommerce brands, we handle ecommerce web development on platforms like Shopify and WordPress, built to move people from browsing to checkout without friction. For brands that need more than a standard site, we build custom web applications using whichever stack fits the project.",
        category: "Web & App Development",
      },
      {
        id: "web-3",
        question: "Will my website work well on mobile?",
        answer:
          "Yes. Most people browsing D2C brands in India are on their phones, so we build with clean navigation, fast load times, and a structure that makes sense on mobile. Good custom web development removes every small thing that makes a visitor hesitate before buying.",
        category: "Web & App Development",
      },
      {
        id: "web-4",
        question: "Do you support the website after launch?",
        answer:
          "Yes. We stay involved after launch, since a website is never really finished. It needs updates, speed checks, and small fixes as your brand grows, so the site keeps supporting your marketing instead of slowly falling behind. This ongoing support covers updates, speed checks, and fixes without starting over.",
        category: "Web & App Development",
      },
      {
        id: "web-5",
        question: "Does web development connect with your SEO and ads work?",
        answer:
          "Yes. A website built in isolation rarely performs as it should. We build pages that support your SEO work and convert the traffic your performance marketing campaigns bring in, so the site, the search visibility, and the ads all work together.",
        category: "Web & App Development",
      },
    ],
  },
  {
    id: "ai-automation",
    name: "AI Automation & Agents",
    description: "Custom AI workflows, n8n agentic systems, CRM integrations, and automated lead capture.",
    icon: "🤖",
    faqs: [
      {
        id: "ai-1",
        question: "What does an AI automation agency like Mommantum do?",
        answer:
          "As an AI automation agency, we hand repeated small tasks to a system so your team stops doing them manually every day, like replying to the same questions, updating the same sheets, and chasing the same follow ups. We start by watching how your business actually runs.",
        category: "AI Automation & Agents",
      },
      {
        id: "ai-2",
        question: "What can you automate with AI?",
        answer:
          "Our AI automation services are built around your workflow. That can mean an AI chat agent handling customer queries, automated follow ups, or connecting tools you already use so information moves between them without anyone copying and pasting, including AI marketing automation for leads.",
        category: "AI Automation & Agents",
      },
      {
        id: "ai-3",
        question: "Do you install a generic bot?",
        answer:
          "No. No two businesses run the same way, so we do not drop in a generic bot and call it done. We build around your actual workflow, test it with real scenarios before it goes live, and check it again afterwards.",
        category: "AI Automation & Agents",
      },
      {
        id: "ai-4",
        question: "What are AI agents and how are they different from basic automation?",
        answer:
          "Basic automation follows one fixed step. An AI agent can look at a situation, decide what to do next, and carry a task through to the end on its own. Instead of your team checking, replying, and updating things one by one, the agent handles it.",
        category: "AI Automation & Agents",
      },
      {
        id: "ai-5",
        question: "What can an AI chat agent do for my business?",
        answer:
          "An AI chat agent replies to customers the moment they message, day or night, without your team sitting by the phone. For real estate it can qualify leads and answer property questions, and in healthcare it can handle appointment queries and basic patient questions.",
        category: "AI Automation & Agents",
      },
      {
        id: "ai-6",
        question: "Which frameworks and tools do you use to build AI agents?",
        answer:
          "We build using proper agentic AI frameworks and tools like n8n. We match the type of agent, whether model based, utility based, or a simpler rule based one, to what your business actually needs, rather than picking whatever sounds most advanced.",
        category: "AI Automation & Agents",
      },
    ],
  },
  {
    id: "branding-cro",
    name: "Branding, CRO & Strategy",
    description: "Conversion audits, D2C positioning, retention loops, and growth roadmaps.",
    icon: "🎯",
    faqs: [
      {
        id: "brand-1",
        question: "What does your D2C branding and growth service include?",
        answer:
          "We work on brand positioning, visual identity, and messaging so your D2C business feels like one connected experience, from product pages to packaging to retention emails. We also write website copy, product pages, and landing pages, and look at your acquisition channels to find the right mix.",
        category: "Branding, CRO & Strategy",
      },
      {
        id: "brand-2",
        question: "Why does a D2C brand need more than a good product?",
        answer:
          "A good product is not enough anymore. Many D2C brands launch with something solid, but the website confuses people, the brand voice keeps changing, and customers do not stick around. If things do not say the same thing everywhere, that gap quietly costs you sales.",
        category: "Branding, CRO & Strategy",
      },
      {
        id: "brand-3",
        question: "What do your conversion rate optimization services include?",
        answer:
          "Our conversion rate optimization services start with a full audit of your product pages, checkout flow, and overall site experience to find exactly where visitors drop off. We then fix those moments and test changes through A/B testing, rather than assuming what will work.",
        category: "Branding, CRO & Strategy",
      },
      {
        id: "brand-4",
        question: "Why optimize conversions before spending more on ads?",
        answer:
          "The traffic you already have is traffic you already paid for. Improving how much of it converts is one of the most direct ways to grow without raising your ad budget, which means more purchases, fewer drop offs, and a lower cost per customer over time.",
        category: "Branding, CRO & Strategy",
      },
      {
        id: "brand-5",
        question: "What does your marketing strategy consulting involve?",
        answer:
          "Before suggesting anything, we take time to understand your business: what you sell, who buys it, and where things are breaking down. We then build a growth plan suited to your stage, covering your offer and pricing, brand positioning, and which channels deserve your time and budget now versus later.",
        category: "Branding, CRO & Strategy",
      },
    ],
  },
  {
    id: "video-creative",
    name: "Video Editing & Creative Production",
    description: "Short-form reels, long-form YouTube, AI video generation, and pacing hooks.",
    icon: "🎬",
    faqs: [
      {
        id: "vid-1",
        question: "What types of videos do you edit?",
        answer:
          "We edit Short-Form content (TikTok, Instagram Reels, YouTube Shorts), Long-Form YouTube videos, Podcasts, Video Essays, and Direct Response Social Ad Creatives.",
        category: "Video Editing & Creative Production",
      },
      {
        id: "vid-2",
        question: "How fast can you deliver my video?",
        answer:
          "Most short-form videos are delivered within 24–48 hours, while long-form projects typically take 3–5 business days, depending on complexity.",
        category: "Video Editing & Creative Production",
      },
      {
        id: "vid-3",
        question: "Do you offer revisions?",
        answer:
          "Yes. Every project includes revisions to make sure the final edit matches your vision, style, and expectations.",
        category: "Video Editing & Creative Production",
      },
      {
        id: "vid-4",
        question: "Can you improve my content flow and retention hooks?",
        answer:
          "Absolutely. We can help structure your footage, strengthen the opening hook, improve pacing, add pattern interrupts, and keep viewers engaged.",
        category: "Video Editing & Creative Production",
      },
      {
        id: "vid-5",
        question: "Do you provide captions, motion graphics, and sound design?",
        answer:
          "Yes. We can include animated captions, motion graphics, transitions, sound effects, music, B-roll, and other elements depending on your editing requirements.",
        category: "Video Editing & Creative Production",
      },
      {
        id: "vid-6",
        question: "What does your AI video generator service do?",
        answer:
          "You give us your product photos, a script, or even just an idea, and we turn it into a finished video without you needing to arrange a shoot every time. It removes the usual crew, booking, and waiting time, so the moment you wanted to catch is not missed.",
        category: "Video Editing & Creative Production",
      },
      {
        id: "vid-7",
        question: "Do you edit specifically for social media algorithms?",
        answer:
          "Yes. We optimize edits for each platform's viewing behavior, including strong hooks, fast pacing, captions, retention-focused cuts, and platform-specific formats.",
        category: "Video Editing & Creative Production",
      },
    ],
  },
]
