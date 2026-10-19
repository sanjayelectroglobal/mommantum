/**
 * @file all-services-focus.ts
 * @description Complete Service Focus content from all 26 pages of official Mommantum documentation
 * ("Service focus & video edits page content mm.pdf").
 * 
 * Contains all 16 service sections. Each service section has:
 * - Main service heading
 * - 3 distinct strategic focus point cards with numbers, titles, and verbatim text
 * - Hyperlinked case studies and related services
 */

import { injectInternalLinks } from "@lib/util/linker"

export interface ServiceFocusCard {
  number: string
  title: string
  content: string
}

export interface ServiceFocusGroup {
  id: string
  slug: string
  serviceName: string
  pageNumber: number
  cards: ServiceFocusCard[]
}

export const ALL_SERVICES_FOCUS: ServiceFocusGroup[] = [
  {
    "id": "performance-marketing",
    "slug": "performance-marketing",
    "serviceName": "Performance Marketing — Meta Ads & Google Ads",
    "pageNumber": 1,
    "cards": [
      {
        "number": "1",
        "title": "What Performance Marketing Actually Means",
        "content": "Performance marketing is simple to explain but hard to do well. It means every rupee you spend on ads should lead to something you can measure, like a sale, a lead, or a booked call. As a performance marketing agency in India, we run performance marketing campaigns on Meta Ads and Google Ads where the goal is always growth, not just views. We look at real buying behaviour to target the right people, test different ad creatives, and build a clear path from the first click to the final purchase. This is what makes us a performance marketing company in India that clients trust, because we focus on what actually moves the needle instead of just running ads and hoping for the best."
      },
      {
        "number": "2",
        "title": "How We Plan Our Performance Marketing Strategy",
        "content": "Before we spend a single rupee, we study your market, your competitors, and your audience. That is the base of every performance marketing strategy we build. As an ecommerce performance marketing agency, we set campaigns live, test different creatives and offers, and only scale up spend once the numbers support it. We track marketing performance metrics like ROAS, CAC, and cost per result closely, so nothing runs on guesswork. There is a real difference between brand vs performance marketing. Brand marketing builds awareness slowly over time, while our performance based marketing is built to get direct, trackable results, which is why many brands choose us over other performance marketing agencies in India when they need actual revenue, not just visibility."
      },
      {
        "number": "3",
        "title": "Why Brands Work With Us Long Term",
        "content": "When you work with a performance marketing specialist, you get daily attention on your campaigns, honest reporting, and constant testing across different performance marketing platforms. We never treat ads as something separate from the rest of your brand. It connects closely with our SEO and AEO work, conversion rate optimization, web development, and social media marketing, so paid growth and organic growth support each other instead of pulling in different directions. This is why many D2C and ecommerce brands across India see us as one of the better performance marketing solutions for long term, sustainable growth."
      }
    ]
  },
  {
    "id": "social-media-marketing",
    "slug": "social-media-marketing",
    "serviceName": "Social Media Marketing — SMO & Content Creation",
    "pageNumber": 2,
    "cards": [
      {
        "number": "1",
        "title": "What Social Media Marketing Really Means",
        "content": "A lot of brands post on Instagram every day and still wonder why nothing is changing. That usually happens when there is no real plan behind the content. Social media marketing, done properly, means knowing who your audience is, what they actually care about, and what kind of content makes them stop and pay attention instead of scrolling past. As a social media marketing agency in India, this is where we start every project. Our social media marketing services cover content planning, daily posting, and audience engagement, mostly built around Instagram since that is still where most D2C brands find their buyers. Whether you searched for social media marketers near me or a social media marketing agency near me, this is the kind of day to day work we handle, for brands in Jaipur and across India."
      },
      {
        "number": "2",
        "title": "Building a Strategy That Actually Grows Your Page",
        "content": "Before we post anything, we spend time understanding your brand and looking at what is already working for similar D2C and ecommerce businesses. From there we put together a content calendar with a mix of reels, posts, and stories so your page stays active without feeling random. As a social media marketing company in Jaipur, we also use AI in a few places, mainly to plan content faster and figure out what kind of posts tend to perform better over time. Good social media work usually needs both sides working together, organic content to build trust and paid promotion to reach people faster, and this is really where the benefits of social media marketing show up. You can see how this has played out for real brands in our case studies."
      },
      {
        "number": "3",
        "title": "Why Brands Stick With Us for Instagram",
        "content": "Instagram marketing is still one of the strongest ways for a D2C brand to build a real following and turn that into sales. Our instagram marketing service covers content creation, reels, captions, and staying active with your community, with the focus always on genuine engagement rather than chasing likes. We are often called one of the better social media marketing companies in Jaipur because we do not treat social media as a separate task sitting on its own. It works alongside our performance marketing, SEO and AEO, and web development work, so your brand actually grows across channels instead of just one place."
      }
    ]
  },
  {
    "id": "search-engine-optimization",
    "slug": "search-engine-optimization",
    "serviceName": "Search Engine Optimization — SEO, AEO & GEO",
    "pageNumber": 3,
    "cards": [
      {
        "number": "1",
        "title": "Why Most SEO Efforts Fail",
        "content": "Most brands try SEO at some point, add a few keywords, publish a couple of blogs, and then wonder why nothing changed. The real problem is usually a missing plan, not a missing keyword. Before we touch anything on your site, we run a full SEO audit to understand what is actually wrong, whether that is weak content, slow load times, broken canonical tags, or pages that search engines simply cannot read well. From there we fix both sides of the equation, the on page SEO like titles and content structure, and the off page SEO like backlinks and mentions that build trust with Google over time. This is the groundwork we lay for every brand that comes to us looking for the best SEO agency in Jaipur."
      },
      {
        "number": "2",
        "title": "Building an SEO Plan Around Real Buyers",
        "content": "Ranking for random keywords does not pay the bills, ranking for the right ones does. Our SEO strategy always starts with figuring out what your actual customers search for before they buy, then building content and pages around exactly that. We handle Shopify SEO for ecommerce stores, local SEO for brands serving specific cities, and general SEO for D2C brands trying to grow across India. Since more people now ask questions directly through AI tools and voice assistants, we also structure content so your brand can show up there too, not just on a regular Google search page. This approach played out well for a wellness brand we worked with, where organic growth became a real part of their revenue. You can read that story on our Jalvayu Wellness case study."
      },
      {
        "number": "3",
        "title": "What Makes Our SEO Work Different",
        "content": "A lot of SEO agencies hand you a report full of rankings and call it a win. We care more about whether that traffic actually buys something. As an SEO agency working with brands across Jaipur and India, we keep reporting simple and honest, and we never promise overnight results because search engines just do not work that way. SEO here is not a separate task sitting on its own, it connects directly with our performance marketing and social media marketing work, so your brand keeps growing on every front. You can see this same approach in action for a retail brand in our The Kids Store case study."
      }
    ]
  },
  {
    "id": "d2c-branding-scale-growth",
    "slug": "d2c-branding-scale-growth",
    "serviceName": "D2C Overall Branding and Scale Growth",
    "pageNumber": 4,
    "cards": [
      {
        "number": "1",
        "title": "Why D2C Brands Need More Than Just a Good Product",
        "content": "Having a good product is not enough anymore. A lot of D2C brands launch with something genuinely solid, but the website confuses people, the brand voice keeps changing, and customers just do not stick around. This is usually where D2C ecommerce businesses lose money without even realising it. Before we touch any marketing, we look at how your brand actually presents itself, on the website, in the ads, and across every place a customer might land. If things are not saying the same thing everywhere, that gap is quietly costing you sales."
      },
      {
        "number": "2",
        "title": "Building a D2C Marketing Strategy That Actually Sticks",
        "content": "A real D2C marketing strategy is not just about running more ads. It starts with figuring out what makes your brand different, then making sure that shows up consistently, from your product pages to your packaging to your retention emails. We work on brand positioning, visual identity, and messaging so your D2C business feels like one connected experience instead of a bunch of separate campaigns. This is also where we look at your acquisition channels and figure out the right mix, so you are not putting all your budget into paid ads alone. One brand we worked with saw their monthly revenue grow five times in just six months once their branding and marketing started working together. You can read that story in our Jalvayu Wellness case study."
      },
      {
        "number": "3",
        "title": "Turning a D2C Website Into a Growth Engine",
        "content": "Your D2C website is often the first real impression a customer gets of your brand, and it needs to do more than just look nice. We write and structure website copy, product pages, and landing pages so visitors actually understand what you are offering and why it matters to them. Combined with retention programmes like email and SMS, this helps turn one time buyers into repeat customers instead of losing them after the first sale. A street food brand we worked with grew their daily footfall five times over using this exact approach of tying branding, content, and local marketing together. You can see how that played out in our Urban Vada Pav case study. This branding work also connects closely with our performance marketing and social media marketing, so every part of your D2C business grows in the same direction."
      }
    ]
  },
  {
    "id": "conversion-rate-optimization",
    "slug": "conversion-rate-optimization",
    "serviceName": "CRO — Conversion Rate Optimization",
    "pageNumber": 5,
    "cards": [
      {
        "number": "1",
        "title": "Where Most Websites Quietly Lose Sales",
        "content": "A lot of brands spend heavily on ads, get decent traffic, and still wonder why sales are not matching up. The answer is usually sitting right there on the website. People land on a page, get confused about what to do next, and just leave. Conversion rate optimization is about finding those exact moments where visitors drop off and fixing them, instead of just sending more traffic into the same broken funnel. As part of our conversion rate optimization services, we run a full audit first, looking at your product pages, checkout flow, and overall site experience to understand where things are actually breaking down."
      },
      {
        "number": "2",
        "title": "How We Actually Improve Conversions",
        "content": "This is not something we guess our way through. As a conversion rate optimization agency in India, we look at real user behaviour, how people scroll, where they click, where they stop, and use that to decide what needs fixing. Sometimes it is a confusing call to action, sometimes it is a slow page, sometimes it is just too much friction before checkout. We test changes through A/B testing rather than assuming what will work, and keep refining based on what the data actually shows. Conversion rate optimization in digital marketing works best when it sits alongside SEO and paid campaigns, not separately from them, since better pages help every channel perform better. This is exactly how a kids clothing brand we worked with saw their conversion rate jump from 0.6% to 2.8%. You can read that in our The Kids Store case study."
      },
      {
        "number": "3",
        "title": "Why This Work Pays for Itself",
        "content": "The traffic you already have is traffic you already paid for, so improving how much of it converts is one of the most direct ways to grow without increasing your ad budget. As a conversion rate optimization agency, we focus on outcomes you can actually see, more purchases, fewer drop-offs, and a lower cost per customer over time. This work connects closely with our performance marketing and web development services, since a well built page and a well run campaign need to work together to actually convert. A wellness brand we worked with saw their website conversion rate improve from 0.7% to 3.1% once this approach was applied properly, as shown in our Jalvayu Wellness case study."
      }
    ]
  },
  {
    "id": "script-copywriting",
    "slug": "script-copywriting",
    "serviceName": "Script & Copywriting",
    "pageNumber": 6,
    "cards": [
      {
        "number": "1",
        "title": "The Words Are Doing More Work Than You Think",
        "content": "Every website is selling something, and the copy is what actually does that selling, not the design. Someone lands on a page, skims a few lines, and decides in seconds whether to keep reading or leave. That is why copywriting is never just about filling space with nice sentences. It is about saying exactly what a product does, who it is for, and why someone should care, in a way that is simple enough to understand at a glance. A lot of brands confuse this with regular content writing, but the two are not the same thing. Content writing builds trust over time, copywriting is built to get someone to act right now."
      },
      {
        "number": "2",
        "title": "Writing That Works Across Every Channel",
        "content": "We write differently depending on where the copy is going, because a Facebook ad, a product page, and an email all need a different kind of push. Our copywriting services cover ad copy, website copywriting, product descriptions, and email sequences, each written for how people actually behave on that platform. SEO copywriting is part of this too, since we write around what people are already searching for, so the traffic you get is more likely to convert instead of just passing through. We do use AI as a tool to speed up research and early drafts, but nothing goes live without a real writer shaping it to match your brand voice. A street food brand we worked with grew their daily footfall from 40 to 210 largely because their messaging finally matched what customers actually wanted to hear. You can see that in our Urban Vada Pav case study."
      },
      {
        "number": "3",
        "title": "Why This Needs a Proper Copywriter, Not Just Anyone Available",
        "content": "A freelance copywriter can be useful for a one off project, but most growing brands need copy that stays consistent everywhere, ads, website, emails, and product pages, all sounding like the same brand. As a sales copywriter and marketing copywriter working closely with your team, we treat copywriting as something to test and improve, not write once and leave alone. This connects directly with our conversion rate optimization and SEO work, since even great copy underperforms if the page around it is slow or confusing. A kids clothing brand we worked with saw their conversion rate climb from 0.6% to 2.8% once their copy actually matched what buyers needed to hear. Read more in our The Kids Store case study."
      }
    ]
  },
  {
    "id": "strategy-consulting",
    "slug": "strategy-consulting",
    "serviceName": "Strategy & Consulting",
    "pageNumber": 7,
    "cards": [
      {
        "number": "1",
        "title": "Why So Many Brands Feel Stuck",
        "content": "A lot of brands are not short on effort, they are short on direction. You run some ads, post on social media, maybe try a bit of SEO, and none of it feels connected. That is usually not a hard work problem, it is a strategy problem. Before we suggest anything, we take time to actually understand your business, what you are selling, who buys it, and where things are currently breaking down. This is the starting point for every marketing strategy we build, because throwing more tactics at an unclear problem rarely fixes it."
      },
      {
        "number": "2",
        "title": "Turning Confusion Into a Clear Plan",
        "content": "Once we know where the gaps are, we build a growth plan that actually makes sense for your stage as a business, not a generic template copied from somewhere else. This includes looking at your offer and pricing, your brand positioning, and which channels deserve your time and budget right now versus later. We have seen this play out clearly with brands we have worked with directly, like a wellness brand that grew monthly revenue five times over in just six months once their strategy, branding, and execution finally moved in the same direction. You can read the full story in our Jalvayu Wellness case study."
      },
      {
        "number": "3",
        "title": "Support That Goes Beyond Just Advice",
        "content": "Strategy on paper does not help much if no one helps you act on it. That is why our consulting does not stop at a document full of suggestions, we stay involved, review what is working, and adjust the plan as real results come in. This connects closely with our other services, from performance marketing to D2C branding, so the strategy we build is something you can actually execute, not just something you read once and forget. A street food brand we worked with used this same approach to grow daily footfall from 40 to 210, which you can see in our Urban Vada Pav case study."
      }
    ]
  },
  {
    "id": "web-app-development",
    "slug": "web-app-development",
    "serviceName": "Web and App Development",
    "pageNumber": 8,
    "cards": [
      {
        "number": "1",
        "title": "Your Website Is Doing More Than Just Existing",
        "content": "A website that just sits there looking nice is not actually helping your business grow. As a web development company in Jaipur, we build sites and apps meant to do a job, get someone to understand your product fast, trust it, and take action without getting stuck or confused. This means clean navigation, fast load times, and a structure that actually makes sense on mobile, since most people browsing D2C brands in India are on their phones. Custom web development, done properly, is less about flashy design and more about removing every small thing that makes a visitor hesitate before buying."
      },
      {
        "number": "2",
        "title": "Building the Right Platform for Your Business",
        "content": "Not every brand needs the same kind of website, so we do not build with one template and adjust the colours. For ecommerce brands, we handle ecommerce web development on platforms like Shopify and WordPress, built specifically to move people from browsing to checkout without friction. For brands that need more than a standard site, we build custom web applications, tools, portals, or dashboards, using whichever stack actually fits the project instead of pushing one framework for everything. A kids clothing brand we worked with saw their store conversion rate jump from 0.6% to 2.8% partly because the site itself finally supported the buying journey instead of getting in the way. You can read that in our The Kids Store case study."
      },
      {
        "number": "3",
        "title": "Why Web Development Should Not Sit on Its Own",
        "content": "A website built in isolation, disconnected from your marketing, SEO, and ad campaigns, rarely performs the way it should. As a web development company in India, we build with that connection in mind, so pages support your SEO work and convert the traffic your performance marketing campaigns bring in. We also stay involved after launch, since a website is never really finished, it needs updates, speed checks, and small fixes as your brand grows. A wellness brand we worked with saw their website conversion rate more than quadruple once the site actually supported the rest of their growth system. You can see that in our Jalvayu Wellness case study."
      }
    ]
  },
  {
    "id": "ai-automation",
    "slug": "ai-automation",
    "serviceName": "AI Automation & Workflow Systems",
    "pageNumber": 9,
    "cards": [
      {
        "number": "1",
        "title": "What AI Automation Actually Solves",
        "content": "Most businesses do not lose time on hard problems, they lose time on repeated small ones, replying to the same questions, updating the same sheets, chasing the same follow ups. AI automation is simply about handing that repeated work over to a system so your team stops doing it manually every single day. As an AI automation agency, we start by watching how your business actually runs day to day, then figure out exactly where AI automation tools can take over without anything breaking or feeling forced."
      },
      {
        "number": "2",
        "title": "Building AI Workflow Automation Around Your Business",
        "content": "No two businesses run the same way, so we do not drop in a generic bot and call it done. Our AI automation services are built around your actual workflow, whether that means an AI chat agent handling customer queries, automated follow ups, or connecting tools you already use so information moves between them without anyone copying and pasting. This is AI driven automation done properly, tested with real scenarios before it goes live, and checked again after, not just switched on and left alone. A wellness brand we worked with used automation like this to help manage growing order volume as their revenue scaled five times in six months. You can read that in our Jalvayu Wellness case study."
      },
      {
        "number": "3",
        "title": "Why This Needs to Connect With the Rest of Your Growth",
        "content": "Automation on its own only goes so far if it is sitting disconnected from your marketing and sales. As we set up AI marketing automation and AI workflow automation, we make sure it actually supports what is happening on the performance marketing and social media side too, so leads get followed up faster and nothing falls through during a busy campaign. Once live, we stay involved, checking how the automation is performing and adjusting it as your business grows, rather than treating it as a one time setup."
      }
    ]
  },
  {
    "id": "ai-agentic-service",
    "slug": "ai-agentic-service",
    "serviceName": "AI Agentic Services & Custom AI Agents",
    "pageNumber": 10,
    "cards": [
      {
        "number": "1",
        "title": "What AI Agents Actually Do For Your Business",
        "content": "If you run a business, you already know the feeling, the same questions coming in every day, the same follow ups sitting in your inbox, the same small tasks eating up hours that could go into something bigger. AI agents are built to take that load off you. Unlike basic automation that just follows one fixed step, an AI agent can actually look at a situation, decide what to do next, and carry a task through to the end on its own. So instead of your team manually checking, replying, and updating things one by one, the agent handles it while you focus on running the business."
      },
      {
        "number": "2",
        "title": "How This Helps You Day to Day",
        "content": "Think about what an AI chat agent does for you directly, it replies to your customers the moment they message, day or night, without your team sitting by the phone. If you are in real estate, an AI real estate agent style setup can qualify leads and answer property questions before your sales team even steps in, so by the time you talk to a customer, they are already interested and informed. In healthcare, AI agents can handle appointment queries and basic patient questions, so your front desk is not stuck answering the same thing all day. We build these using proper agentic AI frameworks and tools like n8n, matching the type of agent, whether that is a model based agent, a utility based agent, or a simpler rule based one, to what your business actually needs, not just picking whatever sounds advanced."
      },
      {
        "number": "3",
        "title": "Why This Keeps Paying Off For You",
        "content": "Once it is set up, you are not stuck managing it constantly. We test the agent against real situations before it goes live, and after launch, we keep checking how it performs and adjust it as your business changes. Brands we have worked with have seen what happens when systems actually support daily operations instead of adding to the workload, from a wellness brand that scaled revenue five times in six months as shown in our Jalvayu Wellness case study, to a street food brand that grew daily footfall five times over using similar hands off systems, as seen in our Urban Vada Pav case study, and a retail brand that improved conversion sharply once their operations tightened up, covered in our The Kids Store case study. This also connects with our AI automation and web development work, so the agent fits properly into the tools and website you already use, instead of sitting on its own."
      }
    ]
  },
  {
    "id": "ai-video-generation",
    "slug": "ai-video-generation",
    "serviceName": "AI Video Generation",
    "pageNumber": 11,
    "cards": [
      {
        "number": "1",
        "title": "What This Actually Solves For You",
        "content": "If you have ever tried getting a proper video made for your brand, you know the drill, hiring a crew, booking a shoot, waiting days for edits, and by the time it is ready, the trend or moment you wanted to catch has already passed. An AI video generator changes that timeline completely. You give us your product photos, a script, or even just an idea, and we turn it into a finished video without you needing to arrange a shoot every single time."
      },
      {
        "number": "2",
        "title": "How This Fits Into What You Are Already Doing",
        "content": "Say you want to test five different video hooks for a Meta ad, normally that means five separate shoots or a lot of extra editing time and cost. With AI generated video, we can turn out multiple versions quickly, so instead of guessing which message will work, you actually get to test and see. We work with text to video generator AI setups for turning scripts straight into content, and image to video generator AI for cases where you already have great product photos sitting unused and just need them to move. A street food brand we worked with grew their daily footfall from 40 to 210 partly by staying consistently visible with fresh content, shown in our Urban Vada Pav case study."
      },
      {
        "number": "3",
        "title": "Why This Keeps Working For You Over Time",
        "content": "The real advantage shows up over months, not just on day one. When you can create custom video content quickly, you stay active on social media without burning out your budget on production, and your ad campaigns get fresh creative before performance starts dropping off. A kids clothing brand we worked with used fast, tested creative to help push their conversion rate from 0.6% to 2.8%, covered in our The Kids Store case study, while a wellness brand scaled revenue five times in six months keeping their content fresh across channels, as shown in our Jalvayu Wellness case study. This service connects closely with our performance marketing and social media marketing work, so the videos we create are built to actually perform, not just look good."
      }
    ]
  },
  {
    "id": "content-video-scripting",
    "slug": "content-video-scripting",
    "serviceName": "Content and Video Scripting",
    "pageNumber": 12,
    "cards": [
      {
        "number": "1",
        "title": "Why a Script Comes Before the Camera",
        "content": "Most brands make the same mistake, they start filming before they know what they actually want to say. That is where a video script comes in. Whether it is a short video script for reels or a proper script for a YouTube video, the script is the actual plan, what gets said first, what keeps someone watching, and what makes them take action by the end. Content only works when it has a clear point, and that point comes from the script, not from good editing or a nice camera. This is why brands come to us before shooting anything, we write the script first so the video actually has a direction to follow."
      },
      {
        "number": "2",
        "title": "Turning a Script Into Content That Performs",
        "content": "A script is not just words on a page, it needs to be built for how people actually watch videos, especially on Instagram and YouTube where the first few seconds decide everything. We write scripts with a strong opening, a clear middle, and an ending that asks the viewer to do something, so nothing feels like it just fades out. These scripts also work well with text to video tools, since we keep the pacing and sentence structure ready for that kind of production, connecting directly with our AI video generation service."
      },
      {
        "number": "3",
        "title": "Why This Fits Into Your Bigger Content Plan",
        "content": "A script written on its own, without knowing what the brand is trying to say overall, rarely performs well. We build scripts around your actual content plan, so every video connects back to the same message instead of feeling random or disconnected. Once the script is locked, it flows straight into content that supports your performance marketing and social media marketing work, so every video you post is actually built to convert, not just fill up your feed."
      }
    ]
  },
  {
    "id": "video-editing",
    "slug": "video-editing",
    "serviceName": "Video Editing",
    "pageNumber": 15,
    "cards": [
      {
        "number": "1",
        "title": "Why Editing Decides Whether a Video Actually Works",
        "content": "You can shoot great footage and still end up with a video nobody finishes watching if the edit is off. Pacing, cuts, transitions, sound, all of it either keeps someone watching or gives them a reason to scroll away. As a video editing service, we take raw clips and shape them into something that actually holds attention, trimming the boring parts, tightening the pace, and making sure the video says what it needs to say without dragging on. Whether it is for a quick reel or a longer YouTube video, the edit is often the real difference between content that performs and content that just exists."
      },
      {
        "number": "2",
        "title": "Editing Built for Where Your Video Actually Gets Watched",
        "content": "A video meant for Instagram reels needs a different pace and style than something meant for TikTok or YouTube, and we edit with that in mind instead of using one format for everything. We stay on top of new trending video editing styles across platforms, quick cuts, captions, transitions, so your content does not feel outdated the moment it goes live. This professional video editing work connects directly with our content and video scripting service, since a well written script edited properly is what actually turns into a video worth watching, not just footage stitched together."
      },
      {
        "number": "3",
        "title": "Editing as Part of Your Ongoing Content System",
        "content": "We do not treat video editing as a one off task, we build it into your regular content flow, so ads, reels, and campaigns keep going out consistently instead of getting stuck waiting on edits. This corporate video editing and ongoing support means your brand has a reliable video editing agency handling the backend work, while you focus on strategy and ideas. It ties in closely with our AI video generation and social media marketing work, so every edited video fits into a bigger plan instead of being a standalone piece of content."
      }
    ]
  },
  {
    "id": "ai-video-editing",
    "slug": "ai-video-editing",
    "serviceName": "AI Video Editing",
    "pageNumber": 18,
    "cards": [
      {
        "number": "1",
        "title": "What AI Really Changes About the Editing Process",
        "content": "If you break editing down, a lot of it is repetitive once you think about it, cutting pauses, adjusting pacing, syncing captions, doing the same steps on basically every video. This is where AI video editing actually helps, taking care of that repetitive part quickly so we can spend time on things that genuinely need a human touch, the story, the pacing that fits your brand, the final feel of it. We do use AI tools to move faster, but nothing goes out the door untouched, everything still gets a proper look over before we call it done."
      },
      {
        "number": "2",
        "title": "Keeping Up Without Slowing Everything Down",
        "content": "If you are posting regularly on social media or running video ads, you already know how much editing can eat into your week. With AI assisted editing, turnaround gets a lot quicker, which matters when you are trying to test a few different hooks or just trying to keep up with a busy posting schedule. It works especially well when paired with a script we have already written through our content and video scripting service, since a clear script makes the whole AI editing process smoother and faster."
      },
      {
        "number": "3",
        "title": "Where This Sits in Your Overall Content Plan",
        "content": "AI video editing is not really trying to replace proper editing, it is more about speeding up the parts that do not need a lot of creative thinking, so we can put that time into the parts that do. It connects closely with our regular video editing work, and often with AI video generation too, especially when a video is being created almost entirely through AI from start to finish. Put together, this basically means your brand gets more usable content without needing a bigger production setup every time something new needs to go out."
      }
    ]
  },
  {
    "id": "podcast-editing",
    "slug": "podcast-editing",
    "serviceName": "Podcast Editing",
    "pageNumber": 21,
    "cards": [
      {
        "number": "1",
        "title": "Why Raw Recordings Need a Proper Edit",
        "content": "A podcast recording almost never comes out perfect the first time, there are long pauses, background noise, someone talking over another person, or audio levels that jump around between speakers. Podcast audio editing is about fixing all of that so listeners hear a smooth conversation instead of a rough recording. We clean up the sound, tighten the pacing by cutting out dead space, and balance audio levels so every speaker sounds clear throughout. This is the difference between a podcast people finish listening to and one they give up on halfway through."
      },
      {
        "number": "2",
        "title": "Editing for How People Actually Listen Today",
        "content": "Podcasts are not just audio anymore, a lot of listeners now watch on platforms as a video podcast, so we edit with both formats in mind instead of treating audio as an afterthought. If you record on camera, we sync and edit the video podcast alongside the audio, adding simple visual elements where needed so it works well for platforms that support video. This editing work connects closely with our video editing service, since a lot of the same care around pacing and clarity applies whether it is a full episode or a short clip pulled from it for social media."
      },
      {
        "number": "3",
        "title": "Making Your Podcast Easy to Publish and Grow",
        "content": "Editing is only useful if it fits into a workflow that actually gets episodes out consistently. We handle podcast editing as an ongoing process, not a one time task, so new episodes go out on schedule instead of sitting half finished. This also ties into your wider content plan, since well edited podcast clips work well as standalone content for social media marketing, and episodes built around a clear structure benefit from the same planning we use in our content and video scripting work."
      }
    ]
  },
  {
    "id": "motion-graphics",
    "slug": "motion-graphics",
    "serviceName": "Motion Graphics",
    "pageNumber": 24,
    "cards": [
      {
        "number": "1",
        "title": "Why Movement Grabs Attention Faster Than a Still Image",
        "content": "Think about scrolling through Instagram, a still photo barely gets a second glance, but something moving usually makes you pause, even for a moment. That small pause is often all a brand needs to get a message across. We build motion graphics animation with exactly that first moment in mind, since most ads and reels either win or lose someone's attention within the opening few seconds. None of this animation is added just to look busy either, every bit of movement is there to support what you are actually trying to say, not distract from it."
      },
      {
        "number": "2",
        "title": "Making Complicated Things Easy to Understand",
        "content": "Some ideas are just hard to explain with a photo or plain footage alone, how a product works, what a process involves, or how one thing compares to another. This is usually where animation and motion graphics do their best work, turning something that would take a paragraph to explain into a few seconds people can actually follow at a glance. We build this using Adobe After Effects, shaping graphic animation around your brand rather than dropping in a generic template. A lot of this work sits alongside our video editing service too, since motion is often layered directly into an already edited video to strengthen one specific moment."
      },
      {
        "number": "3",
        "title": "Keeping It Consistent With Your Brand, Not Just Trendy",
        "content": "There is more than one way to do motion graphics, some brands need simple text animation, others need something closer to a full animated explainer, and we pick the style based on what actually fits rather than what happens to be trending that month. As a motion graphics agency, we keep the same visual language running across everything we animate for you, so it starts to feel like a real part of your brand rather than a one off effect. This also connects with our content and video scripting work, since knowing exactly what a script is trying to say makes it a lot easier to know where animation will actually help."
      }
    ]
  }
];

/**
 * Returns all service focus groups with the specified service placed first.
 */
export function getAllServicesFocusOrdered(currentSlug?: string): ServiceFocusGroup[] {
  if (!currentSlug) return ALL_SERVICES_FOCUS;
  const current = ALL_SERVICES_FOCUS.find(s => s.slug === currentSlug);
  const others = ALL_SERVICES_FOCUS.filter(s => s.slug !== currentSlug);
  return current ? [current, ...others] : ALL_SERVICES_FOCUS;
}

/**
 * Enriches focus card text with contextual links to case studies, cross-services,
 * and site keywords without modifying the authentic verbatim wording.
 */
export function enrichCardContent(
  text: string,
  groupSlug: string,
  siteKeywords?: { keyword: string; target_url: string; max_matches_per_page?: number }[]
): string {
  if (!text) return "";

  let enriched = text;

  // 1. Link specific client case studies mentioned in the text
  enriched = enriched.replace(
    /Jalvayu Wellness case study/gi,
    '<a href="/work/jalvayu-wellness" class="text-[#e61e73] font-semibold underline underline-offset-4 hover:text-[#0e2547] transition-colors">Jalvayu Wellness case study</a>'
  );
  enriched = enriched.replace(
    /The Kids Store case study/gi,
    '<a href="/work/the-kids-store" class="text-[#e61e73] font-semibold underline underline-offset-4 hover:text-[#0e2547] transition-colors">The Kids Store case study</a>'
  );
  enriched = enriched.replace(
    /Urban Vada Pav case study/gi,
    '<a href="/work/urban-vada-pav" class="text-[#e61e73] font-semibold underline underline-offset-4 hover:text-[#0e2547] transition-colors">Urban Vada Pav case study</a>'
  );
  enriched = enriched.replace(
    /\bcase studies\b/gi,
    '<a href="/work" class="text-[#e61e73] font-semibold underline underline-offset-4 hover:text-[#0e2547] transition-colors">case studies</a>'
  );

  // 2. Link cross-services mentioned in the text (first match only, avoiding self-links and nested anchors)
  const crossServices: { phrase: string; slug: string; url: string }[] = [
    { phrase: "conversion rate optimization", slug: "conversion-rate-optimization", url: "/services/conversion-rate-optimization" },
    { phrase: "performance marketing", slug: "performance-marketing", url: "/services/performance-marketing" },
    { phrase: "social media marketing", slug: "social-media-marketing", url: "/services/social-media-marketing" },
    { phrase: "web development", slug: "web-app-development", url: "/services/web-app-development" },
    { phrase: "AI video generation", slug: "ai-video-generation", url: "/services/ai-video-generation" },
    { phrase: "AI automation", slug: "ai-automation", url: "/services/ai-automation" },
    { phrase: "copywriting", slug: "script-copywriting", url: "/services/script-copywriting" },
    { phrase: "SEO and AEO", slug: "search-engine-optimization", url: "/services/search-engine-optimization" },
    { phrase: "video editing", slug: "video-editing", url: "/services/social-media-marketing" },
    { phrase: "content and video scripting", slug: "content-video-scripting", url: "/services/script-copywriting" },
  ];

  for (const s of crossServices) {
    if (s.slug === groupSlug) continue;

    const escaped = s.phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?<!<a[^>]*>[^<]*)\\b(${escaped})\\b(?![^<]*<\\/a>)`, "i");
    enriched = enriched.replace(
      regex,
      `<a href="${s.url}" class="text-[#e61e73] font-semibold underline underline-offset-4 hover:text-[#0e2547] transition-colors">$1</a>`
    );
  }

  // 3. Inject site keywords if configured
  if (siteKeywords && siteKeywords.length > 0) {
    enriched = injectInternalLinks(enriched, siteKeywords);
  }

  return enriched;
}
