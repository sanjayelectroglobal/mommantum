/**
 * @file page-faqs.ts
 * @description Centralized FAQ repository for Mommantum website pages.
 * Ensures visible FAQs and JSON-LD schema FAQs are 100% identical on every page.
 * 
 * Rules enforced:
 * - 8 to 10 FAQs per page.
 * - Answers 40 to 60 words, plain text, no markdown.
 * - Strictly confirmed facts only.
 */

export interface PageFAQ {
  id?: string
  question: string
  answer: string
}

export const PAGE_FAQS_MAP: Record<string, PageFAQ[]> = {
  // Sources: src/lib/data/all-faqs.ts, src/lib/schema/site.ts, mommantum_schema_antigravity_prompt.json (business_profile, home_faqs)
  "homepage": [
    {
      "question": "What does Mommantum do?",
      "answer": "Mommantum is a Jaipur based digital marketing agency and growth studio. We help D2C and ecommerce brands grow through performance marketing, SEO, social media marketing, branding, conversion rate optimization, web development, AI automation, AI agents, and video services, all connected so each channel supports the others."
    },
    {
      "question": "Where is Mommantum located and can I visit the office?",
      "answer": "Our studio office is located at B-147, Anand Vihar, Jagatpura, Jaipur-302017, Rajasthan. Clients and brand founders are welcome to visit our workspace in person. We are open Monday to Saturday from 9am to 9pm, and our team also collaborates with brands across India and internationally."
    },
    {
      "question": "Do you work with clients outside Jaipur?",
      "answer": "Yes. Although we are based in Jaipur, we work with brands across India and with international clients. The same strategy, reporting, and day to day attention applies wherever your business is based, whether you meet us in Jaipur or work with us remotely."
    },
    {
      "question": "Which services does Mommantum offer?",
      "answer": "We offer performance marketing, SEO, social media marketing, D2C branding, conversion rate optimization, copywriting, marketing consulting, web and app development, AI automation, AI agents, AI video generation, video scripting, video editing, AI video editing, podcast editing, and motion graphics. Visit our services page for details on each."
    },
    {
      "question": "How can I contact Mommantum?",
      "answer": "You can email kuldeep@mommantum.in or call or WhatsApp us on +91 7742276031. Our team is available Monday to Saturday, 9am to 9pm. You can also use the contact page on our website and tell us about your brand and goals. Just reach out with your brand and goals."
    },
    {
      "question": "What types of businesses does Mommantum work with?",
      "answer": "We work primarily with D2C brands, ecommerce stores, consumer startups, and ambitious retail businesses across India. Whether you are scaling an established brand through performance advertising or building a new digital presence through SEO and custom web development, our systems are built around your commercial stage."
    },
    {
      "question": "How does Mommantum track and report campaign results?",
      "answer": "We track measurable commercial metrics including return on ad spend, customer acquisition cost, conversion rates, and organic traffic growth. Reporting is transparent and straightforward, showing exactly where your budget went, what results were generated, and what iterative improvements or creative experiments are planned next."
    },
    {
      "question": "How do we start working with the Mommantum team?",
      "answer": "Getting started is straightforward. Contact us through our website form, email, or WhatsApp to share your store link, current growth bottlenecks, and business objectives. We review your existing channels, discuss your targets, and outline an aligned roadmap tailored to your specific requirements."
    }
  ],
  // Sources: src/lib/schema/site.ts (profile, founder), mommantum_schema_antigravity_prompt.json (business_profile)
  "about": [
    {
      "question": "Who founded Mommantum and who leads the agency?",
      "answer": "Mommantum was founded and is led by Kuldeep Ahir, who serves as creative director and growth strategist. Based in Jaipur, Kuldeep directs an in-house team of 15 specialists in performance marketing, SEO, creative video production, full-stack web development, and AI workflow automation."
    },
    {
      "question": "What is Mommantum's philosophy on digital brand growth?",
      "answer": "We believe sustainable growth happens when strategy, creative content, search visibility, and performance advertising are tightly connected. Instead of treating creative design, SEO, and paid ads as isolated silos, our team builds unified growth systems where each marketing channel strengthens and compounds the performance of the others."
    },
    {
      "question": "Where is the Mommantum office located and what are your hours?",
      "answer": "Our headquarters is located at B-147, Anand Vihar, Jagatpura, Jaipur-302017, Rajasthan. We operate Monday through Saturday from 9am to 9pm. Clients are welcome to visit our studio for in-person strategy sessions, and we regularly coordinate with remote partners across India and overseas."
    },
    {
      "question": "What makes Mommantum different from traditional marketing agencies?",
      "answer": "We prioritize measurable commercial impact like customer acquisition cost, return on ad spend, and conversion rate efficiency rather than vanity impressions or superficial follower counts. Our team combines hands-on execution with transparent weekly reporting so founders always know exactly how their marketing investment is performing."
    },
    {
      "question": "How large is the Mommantum team?",
      "answer": "Mommantum operates with an agile in-house team of 15 members in Jaipur. Our structure includes performance media buyers, SEO analysts, video editors, designers, developers, and AI automation specialists, allowing us to maintain close creative quality control without passing work to unknown third-party freelancers."
    },
    {
      "question": "Does Mommantum work with clients outside Jaipur and India?",
      "answer": "Yes. While our physical studio is rooted in Jaipur, we work with D2C brands, ecommerce stores, and high-growth businesses across all major Indian cities as well as international clients. Remote clients receive the exact same proactive communication, scheduled check-ins, and rigorous reporting as local partners."
    },
    {
      "question": "Which industries does Mommantum have deep experience with?",
      "answer": "We have extensive experience supporting direct-to-consumer ecommerce brands, apparel and fashion retailers, wellness and eco-friendly products, food and beverage concepts, consumer tech platforms, and digital creators. Our frameworks adapt directly to the specific unit economics, margins, and consumer purchase cycles of each industry."
    },
    {
      "question": "How can I schedule a discussion with the Mommantum team?",
      "answer": "You can reach out directly by emailing kuldeep@mommantum.in, calling or sending a WhatsApp message to +91 7742276031, or submitting the contact form on our website. We will discuss your current revenue targets, examine your active channels, and recommend an actionable growth plan."
    }
  ],
  // Sources: src/lib/schema/site.ts (address, telephone, email, openingHours), src/app/(site)/contact/page.tsx
  "contact": [
    {
      "question": "What are Mommantum's official office working hours?",
      "answer": "Our team is available from Monday to Saturday, between 9:00 AM and 9:00 PM Indian Standard Time. Inquiries submitted over the weekend or outside standard business hours are promptly reviewed and addressed by our team at the start of the next business working day."
    },
    {
      "question": "What is the fastest way to get in touch with Mommantum?",
      "answer": "For immediate inquiries and project discussions, you can call or WhatsApp our team directly on +91 7742276031. You can also email us at kuldeep@mommantum.in or fill out our online contact form with details about your business, website link, and specific marketing objectives."
    },
    {
      "question": "Can I visit Mommantum's physical office in Jaipur?",
      "answer": "Yes, visitors and prospective clients are welcome to meet us in person. Our office is located at B-147, Anand Vihar, Jagatpura, Jaipur-302017, Rajasthan. We recommend getting in touch beforehand to schedule a meeting time so the relevant team members can prepare for your visit."
    },
    {
      "question": "How quickly will Mommantum respond to my message?",
      "answer": "We review all incoming project inquiries within business hours and typically respond within 24 hours on working days. When submitting a message, including your store URL, existing marketing channels, and monthly goals helps our strategists provide meaningful feedback right from the very first conversation."
    },
    {
      "question": "What details should I prepare before contacting Mommantum?",
      "answer": "It is helpful to share your current website or storefront link, active advertising channels, approximate monthly ad spend if running paid campaigns, and primary business priorities. Having this background allows us to evaluate your store structure and give actionable guidance during our initial consultation."
    },
    {
      "question": "Do you offer video calls for clients located outside Jaipur?",
      "answer": "Yes. A significant portion of our clients are based across India and internationally, so we regularly conduct discovery meetings and ongoing weekly reporting sessions over Google Meet and Zoom. Distance has no impact on project velocity, communication quality, or day-to-day campaign management."
    },
    {
      "question": "Is there any cost or commitment for an initial strategy call?",
      "answer": "No. Our initial consultation is completely complimentary and carries zero obligation. We use this introductory discussion to learn about your business goals, review your website and marketing setup, and determine whether our agency frameworks represent the right commercial fit for your brand."
    },
    {
      "question": "Who will I speak with when I contact Mommantum?",
      "answer": "When you reach out, you speak directly with experienced practitioners and founders, including Kuldeep Ahir, rather than an aggressive junior sales representative. We take time to understand your operational reality and provide candid feedback on what will genuinely drive growth for your business."
    }
  ],
  // Sources: src/lib/data/services.ts, src/app/(site)/services/page.tsx
  "services": [
    {
      "question": "What core digital marketing services does Mommantum offer?",
      "answer": "Mommantum offers an integrated suite of services: performance marketing on Meta and Google Ads, technical and content SEO, social media marketing, D2C brand strategy, conversion rate optimization, custom web and app development, AI automation workflows, AI agents, and professional video editing through our EDITZ studio."
    },
    {
      "question": "How does Mommantum integrate multiple marketing channels?",
      "answer": "We ensure every marketing channel works together toward the same commercial objective. Performance ads drive targeted traffic to high-converting landing pages, SEO establishes compounding organic visibility, and engaging social content nurtures buyer trust, creating a complete growth engine rather than disjointed, competing marketing activities."
    },
    {
      "question": "Can we hire Mommantum for a single service or full-funnel growth?",
      "answer": "Yes. You can engage our team for specialized individual requirements, such as a dedicated SEO audit, high-impact video editing, or custom web development, or partner with us for full-funnel marketing management spanning paid acquisition, conversion optimization, and long-term retention systems."
    },
    {
      "question": "Which advertising platforms does Mommantum manage?",
      "answer": "We manage paid advertising campaigns across Meta Ads, including Instagram Reels, Feed, and Facebook Ads, as well as Google Ads, spanning Search, Shopping, Performance Max, Display, and YouTube. We allocate client budgets based on where target buyers actively spend time and convert."
    },
    {
      "question": "What does your AI automation and AI agent service involve?",
      "answer": "We build custom workflow automations and intelligent AI agents using frameworks like n8n. These systems handle repetitive operational tasks, including customer query routing, instant lead qualification, automated CRM updates, and internal notifications, freeing your core team to focus on strategic business priorities."
    },
    {
      "question": "Do you provide custom ecommerce and web application development?",
      "answer": "Yes. We build responsive, fast-loading ecommerce storefronts on Shopify and develop custom web applications using modern stacks like Next.js. Our development team focuses on mobile speed, intuitive user flows, and frictionless checkout experiences that directly support higher conversion rates and revenue growth."
    },
    {
      "question": "How does video production support our marketing performance?",
      "answer": "High-performing video creatives stop social scrolling, clearly explain product benefits within seconds, and dramatically reduce customer acquisition costs. Through our EDITZ studio, we produce short-form Reels, YouTube Shorts, long-form videos, and direct-response video ad variations engineered specifically for platform retention and audience action."
    },
    {
      "question": "How do I determine which service fits my brand's current needs?",
      "answer": "Reach out to our team for a comprehensive growth consultation. We will audit your current website conversion rate, traffic sources, customer acquisition costs, and revenue targets to recommend the exact sequence of services that will provide the greatest commercial return for your business."
    }
  ],
  // Sources: src/modules/home/components/our-work/index.tsx, src/lib/data/case-studies.ts
  "work": [
    {
      "question": "What types of case studies does Mommantum feature on this page?",
      "answer": "Our case studies highlight real-world client engagements across direct-to-consumer ecommerce, retail apparel, eco-friendly wellness products, and regional food and beverage brands. Each study details the original business challenge, strategic solutions implemented, and verified commercial outcomes achieved by our growth team."
    },
    {
      "question": "How does Mommantum measure and verify client results?",
      "answer": "We track concrete commercial metrics that directly impact client profitability, including return on ad spend, percentage reduction in customer acquisition cost, footfall growth, conversion rate improvements, and organic search traffic expansion, rather than vanity metrics like impression counts or superficial social likes."
    },
    {
      "question": "Are the results in these case studies typical for every client?",
      "answer": "Results vary depending on starting revenue baselines, product margins, market demand, and consistency in strategic execution. While every business is unique, the systematic testing frameworks, creative funnels, and technical optimizations detailed in our case studies are consistently applied to drive maximum performance for every partner."
    },
    {
      "question": "Can we review work samples relevant to our specific industry?",
      "answer": "Yes. You can explore published client breakdowns on this page, including The Kids Store for apparel ecommerce, Jalvayu Wellness for organic retail, and Urban Vada Pav for local food enterprises. You can also contact our team for additional campaign examples matching your specific sector."
    },
    {
      "question": "What role does Mommantum play across client engagements?",
      "answer": "We serve as an end-to-end strategic growth partner for ambitious brands. Depending on the client's needs, our involvement spans market positioning, high-converting creative production, paid acquisition funnel architecture, technical website and landing page development, search engine optimization, and ongoing weekly data analysis."
    },
    {
      "question": "How quickly do client campaigns typically show measurable traction?",
      "answer": "Paid acquisition and conversion optimization improvements often demonstrate measurable performance indicators within the initial 30 to 45 days of campaign launch. Compounding channels such as organic SEO, brand recognition, and audience retention mature steadily over several months of structured execution."
    },
    {
      "question": "Can Mommantum adapt proven frameworks to our business model?",
      "answer": "Yes. We do not use rigid cookie-cutter templates for our clients. Instead, we adapt tested principles in creative messaging, audience segmentation, landing page clarity, and retention workflows to fit your specific product catalog, customer demographics, profit margins, and competitive market landscape."
    },
    {
      "question": "How can my brand be featured in a future Mommantum case study?",
      "answer": "We partner with ambitious founders who are committed to sustainable, data-driven scaling. Contact us today through our website form, email, or WhatsApp to share your store metrics, discuss your growth goals, and explore how our team can help write your brand's success story."
    }
  ],
  // Sources: src/lib/data/blog-posts.ts, src/app/(site)/blog/page.tsx
  "blog": [
    {
      "question": "What topics does the Mommantum blog focus on?",
      "answer": "The Mommantum blog provides practical, actionable insights on performance marketing, technical and on-page SEO, AI workflow automation, short-form video creation, conversion rate optimization, and sustainable scaling strategies tailored specifically for direct-to-consumer ecommerce founders, brand creators, and modern growth marketers across India."
    },
    {
      "question": "Who writes and reviews the articles on the Mommantum blog?",
      "answer": "Every article is researched, written, and verified by active practitioners within our agency team in Jaipur, led by founder Kuldeep Ahir. We share authentic insights gained directly from running daily ad campaigns, conducting technical site audits, and building real client workflows."
    },
    {
      "question": "How frequently is new content published on the Mommantum blog?",
      "answer": "We regularly publish comprehensive tactical guides, industry breakdowns, and framework analyses on our website. Our editorial focus prioritizes depth, practical utility, and verified testing data over high-frequency generic publishing, ensuring every article provides immediate, real-world value to our community of readers."
    },
    {
      "question": "Are the marketing strategies discussed on the blog tested in practice?",
      "answer": "Yes. Every strategy, creative hook formula, and automation framework shared in our guides comes directly from active testing across our client portfolio. We only write about methodologies and tactics that have demonstrated clear, measurable commercial results in actual campaign environments."
    },
    {
      "question": "Can early-stage founders apply these playbooks effectively?",
      "answer": "Yes. Our articles are written with clear, step-by-step breakdowns designed to be accessible for early-stage bootstrapped founders while remaining valuable and informative for experienced in-house marketing directors looking to optimize existing paid funnels, creative retention hooks, and organic search infrastructure."
    },
    {
      "question": "Does the blog cover artificial intelligence and marketing automation?",
      "answer": "Yes. We frequently explore practical applications of artificial intelligence in marketing, including agentic AI architectures, automated content production systems, customer support automation, and workflow integration tools like n8n that help streamline agency operations and modern direct-to-consumer ecommerce stores across channels."
    },
    {
      "question": "Can readers suggest topics or ask specific questions?",
      "answer": "We welcome suggestions and inquiries from our community. If there is a specific marketing challenge, advertising platform shift, or SEO topic you would like our team to analyze, feel free to contact us through email or our website contact form."
    },
    {
      "question": "How can I stay updated with newly published guides?",
      "answer": "You can bookmark the Mommantum blog page and check back regularly for new playbooks, or follow Mommantum's official social media channels where our team shares key takeaways, campaign breakdowns, practical framework diagrams, and announcements for newly released deep-dive articles each month."
    }
  ],
  // Sources: src/modules/editz/lib/data.ts (SERVICES, PROCESS_STEPS, BENEFIT_CARDS), Keywords_for_MM.xlsx ('video editing')
  "editz": [
    {
      "question": "What types of video content does EDITZ by Mommantum produce?",
      "answer": "EDITZ produces short-form video edits for Instagram Reels, YouTube Shorts, and TikTok, alongside high-retention long-form YouTube videos, video podcast episodes, documentary essays, and direct-response paid social ad creatives engineered specifically to stop scrolling, engage target viewers, and drive sustainable commercial conversions."
    },
    {
      "question": "What is the typical delivery timeline for video editing projects?",
      "answer": "Our standard delivery timeframe for short-form video edits is between 24 and 48 hours from raw footage receipt. For long-form YouTube videos, podcasts, and complex multi-camera productions, deliverables are typically completed within 3 to 5 business days, depending on scope."
    },
    {
      "question": "Do video editing packages include revisions and style adjustments?",
      "answer": "Yes. Every project engagement includes iterative revision cycles to ensure the final cut matches your exact creative direction, pacing preferences, and brand aesthetic. We collaborate closely with you to refine pacing, audio balance, captions, and visual emphasis before final delivery."
    },
    {
      "question": "Can EDITZ help improve viewer retention hooks and narrative pacing?",
      "answer": "Yes. Beyond simple clip cutting, our editors analyze footage structure to craft powerful opening 3-second hooks, remove conversational dead air, insert visual pattern interrupts, and maintain tight narrative momentum that maximizes audience retention and platform watch time across all formats."
    },
    {
      "question": "Do you provide animated captions, motion graphics, and sound design?",
      "answer": "Yes. Our comprehensive editing process includes custom kinetic typography, animated captions, motion graphic overlays, color grading, visual transitions, atmospheric sound design, dynamic sound effects, and carefully selected royalty-free background music tailored to elevate overall production value for every single video project."
    },
    {
      "question": "How do creators and brands onboard and start working with EDITZ?",
      "answer": "Onboarding is fast and simple. Share your raw video footage via Google Drive, Dropbox, or Frame.io, along with your target format, reference styles, and primary goals. Our team reviews your footage, confirms specifications, and begins crafting your initial cut immediately."
    },
    {
      "question": "Are your video edits optimized specifically for social media algorithms?",
      "answer": "Yes. Every edit is engineered around native platform consumption patterns. We optimize aspect ratios, place text safely within platform interface margins, calibrate hook timing for quick-swipe feeds, and structure pacing to encourage full completion rates, rewatches, shares, and algorithmic distribution."
    },
    {
      "question": "Can you match my existing brand visual identity and editing style?",
      "answer": "Yes. Simply share existing video examples or a brand style guide outlining your preferred typography, brand color codes, pacing rhythm, and visual tone. Our editors will systematically match and maintain your established aesthetic consistently across every piece of delivered video content."
    }
  ],
  // Sources: src/lib/data/all-faqs.ts, src/lib/schema/site.ts, src/app/(site)/faq/page.tsx
  "faq": [
    {
      "question": "What does Mommantum do as a growth agency?",
      "answer": "Mommantum is a Jaipur based digital marketing agency and growth studio. We help D2C and ecommerce brands grow through performance marketing, SEO, social media marketing, branding, conversion rate optimization, web development, AI automation, AI agents, and video services, all connected so each channel supports the others."
    },
    {
      "question": "Where is Mommantum located and can prospective clients visit?",
      "answer": "Our studio office is located at B-147, Anand Vihar, Jagatpura, Jaipur-302017, Rajasthan. Clients and brand founders are welcome to visit our workspace in person. We are open Monday to Saturday from 9am to 9pm, and our team also collaborates with brands across India and internationally."
    },
    {
      "question": "Does Mommantum work with clients outside Jaipur and India?",
      "answer": "Yes. Although we are based in Jaipur, we work with brands across India and with international clients. The same strategy, reporting, and day to day attention applies wherever your business is based, whether you meet us in Jaipur or work with us remotely."
    },
    {
      "question": "Which specific services does Mommantum offer to businesses?",
      "answer": "We offer performance marketing, SEO, social media marketing, D2C branding, conversion rate optimization, copywriting, marketing consulting, web and app development, AI automation, AI agents, AI video generation, video scripting, video editing, AI video editing, podcast editing, and motion graphics. Visit our services page for details on each."
    },
    {
      "question": "How can prospective clients contact the Mommantum team?",
      "answer": "You can email kuldeep@mommantum.in or call or WhatsApp us on +91 7742276031. Our team is available Monday to Saturday, 9am to 9pm. You can also use the contact page on our website and tell us about your brand and goals. Just reach out with your brand and goals."
    },
    {
      "question": "What digital advertising platforms does Mommantum specialize in?",
      "answer": "We specialize in data-driven advertising across Meta Ads, including Instagram Reels and Facebook, and Google Ads, including Search, Performance Max, Shopping, and YouTube. We build full-funnel acquisition funnels that capture active buyer intent and convert traffic into measurable customer revenue."
    },
    {
      "question": "How does Mommantum approach search engine optimization?",
      "answer": "Our SEO services begin with a full technical and content audit to resolve crawlability issues, page speed bottlenecks, and broken structure. We then execute comprehensive on-page keyword optimization, high-value content architecture, and authoritative digital outreach to build lasting organic visibility on Google."
    },
    {
      "question": "What is Mommantum's EDITZ video editing service?",
      "answer": "EDITZ is Mommantum's dedicated creative production studio delivering high-retention short-form video edits for Reels, Shorts, and TikTok, alongside polished long-form YouTube videos, podcasts, and high-converting performance ad creatives engineered to stop scrolling, engage audience attention, and maximize watch time across platforms."
    },
    {
      "question": "How does AI automation improve operational efficiency for clients?",
      "answer": "We design and deploy custom AI automations and autonomous agents that streamline repetitive workflows, qualify incoming sales leads, manage customer service inquiries 24/7, and sync CRM data automatically, allowing client teams to eliminate manual administrative overhead and scale operations effortlessly."
    },
    {
      "question": "What is the typical process for onboarding a new client?",
      "answer": "We start with a detailed discovery consultation to review your existing store data, revenue targets, and marketing challenges. Following this audit, we deliver a transparent strategic roadmap, agree on project milestones and deliverables, and begin immediate execution with weekly progress check-ins."
    }
  ],
  // Sources: src/app/(site)/blog-ai/page.tsx, ANTIGRAVITY_PROMPT (2).md
  "blog-ai": [
    {
      "question": "What is Blog AI by Mommantum?",
      "answer": "Blog AI by Mommantum is an intelligent content engine combining agentic artificial intelligence with rigorous human editorial review. The system plans topical keyword clusters, outlines structured long-form drafts, and produces high-quality, search-optimized articles that help growing brands scale organic visibility and search authority."
    },
    {
      "question": "Does Blog AI publish automated articles without human oversight?",
      "answer": "No. We believe fully automated content lacks brand nuance and factual reliability. Every article generated through our Blog AI workflow is thoroughly reviewed, fact-checked, edited, and formatted by experienced human marketing specialists to guarantee genuine quality, reader engagement, and brand alignment."
    },
    {
      "question": "How does Blog AI optimize articles for search engine rankings?",
      "answer": "The system conducts semantic keyword research, structures clear heading hierarchies with single H1 tags and logical subheadings, optimizes meta tags, and incorporates natural internal linking structures, ensuring every article satisfies Google's helpful content guidelines, search intent, and topical depth requirements."
    },
    {
      "question": "Will search engines penalize content produced with Blog AI?",
      "answer": "No. Major search engines, including Google, evaluate content based on its helpfulness, accuracy, relevance, and user satisfaction, rather than the tools used during drafting. Because our workflows incorporate extensive human editing and verified subject expertise, the content performs reliably in search."
    },
    {
      "question": "Can Blog AI adapt to our unique brand voice and guidelines?",
      "answer": "Yes. During initial client onboarding, our team configures custom style rules, industry terminology, brand tone guidelines, and negative keyword lists, ensuring every generated draft closely matches your existing editorial standards and communicates effectively, clearly, and authentically with your target audience."
    },
    {
      "question": "How does Blog AI handle internal links to our services and products?",
      "answer": "Our system scans your website's service catalog, case studies, and key product pages, strategically embedding contextual internal hyperlinks with relevant anchor text throughout every article. This strengthens internal site architecture, improves search crawlability, and guides readers toward high-value conversion actions."
    },
    {
      "question": "What types of businesses benefit most from Blog AI systems?",
      "answer": "Direct-to-consumer ecommerce brands, B2B service firms, software platforms, and digital startups looking to scale organic search traffic without hiring large, expensive in-house writing departments find immense value in our structured, high-output Blog AI content creation, ongoing publishing, and search optimization workflows."
    },
    {
      "question": "How do we get started with Blog AI for our brand?",
      "answer": "Contact the Mommantum team through our website or email to schedule an initial consultation. We will audit your current organic search visibility, map out strategic content opportunities, and structure a scalable publishing schedule tailored directly to your brand's growth goals."
    }
  ],
  // Sources: src/app/(site)/privacy-policy/page.tsx (Sections 1-9: Data, Usage, Cookies, Third-Parties, Security, Rights, Retention, Changes, Contact)
  "privacy-policy": [
    {
      "question": "What types of personal information does Mommantum collect?",
      "answer": "Mommantum collects personal information that you provide voluntarily when submitting contact forms, booking consultations, or subscribing to updates, such as your full name, email address, phone number, and company details, alongside standard anonymous browsing analytics gathered through site cookies and tracking tools."
    },
    {
      "question": "How does Mommantum use the information collected on this website?",
      "answer": "We utilize collected information solely to respond to your project inquiries, deliver agreed marketing services, provide relevant business updates when requested, maintain website security, and analyze aggregate user behavior to continuously improve our site's navigation, overall performance, and visitor user experience."
    },
    {
      "question": "Does Mommantum share or sell visitor information to third parties?",
      "answer": "No. Mommantum never sells, trades, leases, or distributes personal contact details or client data to external third-party brokers, marketing lists, or unauthorized entities. Data is only shared with trusted technical service providers necessary to operate our website and services under confidentiality obligations."
    },
    {
      "question": "How does Mommantum safeguard and protect personal data?",
      "answer": "We implement robust administrative, technical, and physical security measures designed to protect your personal information against unauthorized access, loss, misuse, alteration, or disclosure. All web traffic is encrypted using secure HTTPS communication protocols to safeguard client data transmission at all times."
    },
    {
      "question": "Does the Mommantum website utilize cookies and tracking technologies?",
      "answer": "Yes. We use standard browser cookies and web analytics tools to assess page performance, track user navigation patterns, and understand visitor preferences. You can adjust your browser settings to decline cookies at any time, although certain website features may have reduced functionality."
    },
    {
      "question": "How long does Mommantum retain personal contact information?",
      "answer": "Personal information is retained only for the duration necessary to fulfill the operational purposes for which it was gathered, including responding to business requests, executing client service agreements, and satisfying statutory, accounting, or legal compliance requirements under applicable Indian law."
    },
    {
      "question": "What rights do visitors have regarding their stored personal data?",
      "answer": "You possess the right to request access to the personal data Mommantum holds regarding your identity, request corrections to inaccurate records, or demand the deletion of your personal contact information from our databases by contacting our team in writing at any time."
    },
    {
      "question": "How can I contact Mommantum regarding privacy questions or data requests?",
      "answer": "For any inquiries, questions, or specific data requests concerning this Privacy Policy, you can reach out directly to our privacy team by emailing kuldeep@mommantum.in or sending postal correspondence to our studio office at B-147, Anand Vihar, Jagatpura, Jaipur-302017, Rajasthan, India."
    }
  ],
  // Sources: src/app/(site)/terms-and-conditions/page.tsx (Sections 1-12: Acceptance, Scope, Responsibilities, Payments, IP, Liability, Termination, Law, Contact)
  "terms-and-conditions": [
    {
      "question": "What do the Mommantum Terms and Conditions govern?",
      "answer": "These Terms and Conditions govern your access to and use of the Mommantum website, content, and agency services. By accessing or interacting with our website, you acknowledge that you have reviewed, understood, and agreed to adhere to these binding legal terms."
    },
    {
      "question": "Who owns the intellectual property displayed on the Mommantum website?",
      "answer": "All intellectual property rights, trademarks, proprietary text, images, graphic designs, video assets, brand logos, and source code displayed across this website remain the exclusive property of Mommantum or its respective licensors, protected under applicable intellectual property, trademark, and copyright legislation."
    },
    {
      "question": "How are client service deliverables, timelines, and scope defined?",
      "answer": "Specific project scopes, deliverables, campaign timelines, and fees are established through separate, mutually agreed commercial proposals and service agreements executed between Mommantum and the client prior to project initiation, superseding general website browsing terms for active client marketing engagements and contracts."
    },
    {
      "question": "What are client responsibilities during marketing engagements?",
      "answer": "Clients are responsible for providing timely feedback, brand assets, necessary account access permissions, and accurate business information required for project completion. Mommantum is not responsible for project timeline delays caused by client-side feedback delays, missing assets, or delayed stakeholder approvals."
    },
    {
      "question": "What is Mommantum's policy regarding project fees and cancellations?",
      "answer": "Fee structures, invoicing schedules, and cancellation policies are formally outlined within individual client agreements. Unless explicitly agreed otherwise in a signed contract, deposit payments and completed milestone fees are non-refundable once creative design or marketing execution work has officially commenced."
    },
    {
      "question": "Does Mommantum guarantee specific revenue or performance numbers?",
      "answer": "While our team employs proven, data-driven growth frameworks and industry best practices, Mommantum does not guarantee specific revenue figures, commercial returns, or third-party search engine ranking positions, as outcomes are fundamentally influenced by external market factors, competition, and platform algorithms."
    },
    {
      "question": "Which legal jurisdiction governs disputes relating to Mommantum?",
      "answer": "These Terms and Conditions and any disputes arising from website use or agency service engagements are governed exclusively by the laws of India, with legal proceedings subject to the exclusive jurisdiction of the competent courts located in Jaipur, Rajasthan, India."
    },
    {
      "question": "How are revisions and modifications to these Terms communicated?",
      "answer": "Mommantum reserves the right to modify or update these Terms and Conditions at any time. Any changes become effective immediately upon posting to this page with an updated revision date, and continued browsing constitutes acceptance of the modified legal terms."
    }
  ],
  // Sources: src/modules/home/components/our-work/index.tsx (The Kids Store: whatWeDid, challenge, results)
  "work:the-kids-store": [
    {
      "question": "What was the primary growth challenge for The Kids Store?",
      "answer": "The Kids Store is an apparel and kids fashion ecommerce brand that suffered from low inbound interest, weak online visibility, and an irregular content publishing cadence that failed to communicate the quality and style of their collections effectively to prospective digital shoppers."
    },
    {
      "question": "What specific services did Mommantum provide for The Kids Store?",
      "answer": "Mommantum executed a comprehensive creative overhaul, shooting high-retention video reels and product showcases, instituting a consistent social media publishing calendar, refining digital brand clarity, and introducing storytelling-led social marketing designed to stop user scrolling and build genuine buyer engagement across digital channels."
    },
    {
      "question": "How did video production impact results for The Kids Store?",
      "answer": "Dynamic short-form video reels highlighted clothing fabrics, vibrant styles, and realistic fitting on children far more effectively than static product photos. This dynamic visual presentation stopped the social scroll, extended average watch times, and drove higher organic user engagement across platforms."
    },
    {
      "question": "What measurable outcomes were achieved during this engagement?",
      "answer": "The Kids Store campaign delivered substantial improvements in brand traction, generating higher inbound customer inquiries, markedly better social content consistency, and a significantly stronger digital brand presence across target consumer demographics on active social and ecommerce channels throughout the project."
    },
    {
      "question": "Did Mommantum assist with brand identity and messaging for the store?",
      "answer": "Yes. Our team helped clarify the brand's visual presentation and tone of voice, ensuring product descriptions, social media captions, and video styling delivered a cohesive, trustworthy, and appealing shopping experience for parents looking for premium kids apparel online in India."
    },
    {
      "question": "How did Mommantum maintain content consistency across campaigns?",
      "answer": "We established an organized monthly content calendar with scheduled batch production days, ensuring a predictable stream of styled reels, product highlights, and seasonal fashion announcements without last-minute scrambling or inconsistent gaps between published social media posts throughout the entire campaign."
    },
    {
      "question": "Can Mommantum implement a similar content framework for other apparel brands?",
      "answer": "Yes. We adapt these proven creative video and social storytelling frameworks to match the product catalog, margin profile, seasonal fashion drops, and customer demographics of emerging and established apparel, fashion, and lifestyle retail brands across India and growing global markets."
    },
    {
      "question": "How can an ecommerce brand start a project similar to The Kids Store?",
      "answer": "You can reach out directly to Mommantum via our website contact form, email, or WhatsApp. Share your current store link, product catalog, and growth goals, and our team will outline an actionable creative strategy and production roadmap for your brand."
    }
  ]
};

/**
 * Retrieves the authentic, verified FAQ list for any given page key.
 * Falls back to homepage FAQs if an unknown key is provided.
 */
export function getPageFaqs(pageKey: string): PageFAQ[] {
  const cleanKey = pageKey.trim().toLowerCase()
  if (PAGE_FAQS_MAP[cleanKey]) {
    return PAGE_FAQS_MAP[cleanKey]
  }
  if (cleanKey.startsWith("work:")) {
    return PAGE_FAQS_MAP["work:the-kids-store"] || PAGE_FAQS_MAP["work"]
  }
  return PAGE_FAQS_MAP["homepage"]
}
