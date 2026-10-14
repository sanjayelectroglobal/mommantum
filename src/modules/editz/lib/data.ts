export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  tags: string[];
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  handle: string;
  views: string;
  metric: string;
  platform: 'YouTube' | 'TikTok' | 'Instagram' | 'Ads';
  category: 'Short-Form' | 'Long-Form' | 'Ad Creative';
  videoUrl?: string;
  thumbnail: string;
  duration: string;
}

export interface BenefitMetric {
  value: string;
  label: string;
}

export interface BenefitCard {
  title: string;
  description: string;
  highlight?: string;
}

export interface AudienceCard {
  title: string;
  description: string;
  tag: string;
  gradient: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  details: string[];
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  metric: string;
  avatar: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const SERVICES: Service[] = [
  {
    id: 'short-form',
    number: '01',
    title: 'SHORT-FORM EDITING',
    description: 'High-impact edits for TikTok, Reels, and YouTube Shorts, engineered to hook attention in the first 3 seconds and maximize retention.',
    tags: ['Reels', 'TikTok', 'Shorts', 'Pacing & Hooks'],
    icon: 'Zap',
  },
  {
    id: 'long-form',
    number: '02',
    title: 'LONG-FORM EDITING',
    description: 'High-retention edits for YouTube videos, podcasts, and video essays crafted to maintain viewer engagement across long durations.',
    tags: ['YouTube', 'Podcasts', 'Documentaries', 'Story Arc'],
    icon: 'Video',
  },
  {
    id: 'social-ads',
    number: '03',
    title: 'SOCIAL & AD CREATIVE',
    description: 'Performance-focused video creatives designed to stop the scroll, build instant buyer trust, and drive high-conversion ROI.',
    tags: ['UGC Ads', 'Meta Ads', 'TikTok Ads', 'Vocal Hooks'],
    icon: 'TrendingUp',
  },
  {
    id: 'content-strategy',
    number: '04',
    title: 'CONTENT STRATEGY',
    description: 'Data-informed content direction, title/thumbnail pairing advice, and structural pacing to double your organic reach.',
    tags: ['Retention Audits', 'Hook Testing', 'Pacing Guide', 'Growth System'],
    icon: 'Target',
  },
];

export const MARQUEE_ITEMS = [
  'Viral Short Edits',
  'YouTube Growth Edits',
  'Scroll-Stopping Ads',
  'Social Media Growth',
  'High-Retention Content',
  'Podcast Editing',
  'Performance Creative',
  'Cinematic Storytelling',
];

export const BRAND_LOGOS = [
  { name: 'NOVA', tag: 'Creators Studio' },
  { name: 'ARC', tag: 'Tech Media' },
  { name: 'FOCUS', tag: 'Growth Agency' },
  { name: 'MOTION', tag: 'Direct Response' },
  { name: 'VANTA', tag: 'E-Commerce' },
  { name: 'GROWTH', tag: 'SaaS Brand' },
  { name: 'FRAME', tag: 'Podcast Network' },
  { name: 'PULSE', tag: 'Fitness Brand' },
];

export const BENEFIT_METRICS: BenefitMetric[] = [
  { value: '32%', label: 'AVG WATCH TIME BOOST' },
  { value: '45%', label: 'ENGAGEMENT RATE INCREASE' },
  { value: '2.1M+', label: 'CLIENT REVENUE GENERATED' },
  { value: '100+', label: 'CREATORS & BRANDS TRUST US' },
];

export const BENEFIT_CARDS: BenefitCard[] = [
  {
    title: 'UNLIMITED REVISIONS',
    description: 'Every detail is refined until the final edit feels 100% aligned with your vision and platform expectations.',
    highlight: 'Zero Compromises',
  },
  {
    title: 'PROFESSIONAL HIGH-QUALITY EDITS',
    description: 'Cinematic color grading, polished sound design, custom motion graphics, and frame-accurate pacing.',
    highlight: 'Agency Grade',
  },
  {
    title: 'OPTIMIZED FOR EVERY PLATFORM',
    description: 'Tailored aspect ratios, sound-off captions, platform-specific hook techniques, and native export settings.',
    highlight: 'Maximum Reach',
  },
  {
    title: 'QUICK TURNAROUND',
    description: 'Fast and reliable delivery within 24–48 hours without sacrificing polish or retention mechanics.',
    highlight: '24–48h Speed',
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'project-1',
    title: 'Street Food Viral Series',
    handle: '@street_bite',
    views: '2.1M views',
    metric: '47% increase in online orders',
    platform: 'TikTok',
    category: 'Short-Form',
    videoUrl: '/project1.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    duration: '0:45',
  },
  {
    id: 'project-2',
    title: 'Travel Vlog Cinematic Cut',
    handle: '@wander_leo',
    views: '620K views',
    metric: '41% increase in conversions',
    platform: 'YouTube',
    category: 'Long-Form',
    videoUrl: '/project2.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
    duration: '14:20',
  },
  {
    id: 'project-3',
    title: 'App launch Commercial Ad',
    handle: '@urban_blend',
    views: '3.3M views',
    metric: '52% boost in campaign ROI',
    platform: 'Ads',
    category: 'Ad Creative',
    videoUrl: '/project3.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
    duration: '0:30',
  },
  {
    id: 'project-4',
    title: 'Productivity Podcast Highlight',
    handle: '@focusly',
    views: '265K views',
    metric: '27% increase in watch time',
    platform: 'Instagram',
    category: 'Short-Form',
    videoUrl: '/project4.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80',
    duration: '0:58',
  },
  {
    id: 'project-5',
    title: 'Entrepreneurship Deep Dive',
    handle: '@mason_carter',
    views: '2.4M+ views',
    metric: '36% viewer retention increase',
    platform: 'YouTube',
    category: 'Long-Form',
    videoUrl: '/project5.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    duration: '18:45',
  },
  {
    id: 'project-6',
    title: 'SaaS Acquisition Case Study',
    handle: '@growth_blueprint',
    views: '1.5M views',
    metric: '24K+ organic subscribers',
    platform: 'YouTube',
    category: 'Long-Form',
    videoUrl: '/project6.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    duration: '11:10',
  },
];

export const AUDIENCE_CARDS: AudienceCard[] = [
  {
    title: 'CONTENT CREATORS',
    description: 'Short-form and long-form creators making regular video content who need high-retention editing to scale audience growth rapidly.',
    tag: 'SOLO & TEAM CREATORS',
    gradient: 'from-accent/10 to-transparent',
  },
  {
    title: 'YOUTUBERS & PODCASTERS',
    description: 'Creators focused on deep story structure, pacing, sound design, and viewer retention to keep audiences hooked until the end screen.',
    tag: 'LONG-FORM SPECIALISTS',
    gradient: 'from-accent/10 to-transparent',
  },
  {
    title: 'SHORT-FORM SPECIALISTS',
    description: 'Brands & creators producing high-volume Reels, TikToks, and Shorts that require aggressive visual hooks and fast trend turnaround.',
    tag: 'VIRAL CONTENT PROS',
    gradient: 'from-accent/10 to-transparent',
  },
  {
    title: 'PERSONAL BRANDS & FOUNDERS',
    description: 'Founders and experts using video to build market authority, trust, and qualified lead pipelines through polished video assets.',
    tag: 'BUSINESS & LEADERSHIP',
    gradient: 'from-accent/10 to-transparent',
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'SHARE YOUR FOOTAGE',
    description: 'Send your raw files, footage links, reference videos, and campaign goals. We align on brand style, platform target, and hook expectations.',
    details: ['Raw file upload link', 'Style & brand guide alignment', 'Target platform specs'],
  },
  {
    step: '02',
    title: 'EDIT, REVIEW & REFINE',
    description: 'We craft the initial cut using retention storytelling, kinetic captions, and sound design. You review on Frame.io and request tweaks.',
    details: ['First cut within 24-48h', 'Frame-accurate video feedback', 'Unlimited revision rounds'],
  },
  {
    step: '03',
    title: 'DELIVER & TRACK RESULTS',
    description: 'Final videos are delivered fully render-optimized for your platforms. You post, track performance metrics, and scale winning formats.',
    details: ['Platform-ready 4K exports', 'Thumbnail & caption recommendations', 'Retention performance review'],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Honestly, I didn't expect editing to make this much difference. EDlTZ understood the style I was going for almost immediately. The videos feel much more professional now, and the best part is I don't have to keep explaining every little detail.",
    author: 'Mayank Sharma',
    role: 'Founder & CEO Jalvayu Organics Pvt. Ltd',
    company: '480K Subs',
    metric: '+68% Watch Time',
    avatar: '/review1.jpg',
  },
  {
    quote: "The biggest difference with EDlTZ is that they don't just edit videos — they understand the content. They know exactly where to cut, what to highlight, and how to keep the viewer watching. Our raw podcast clips now feel like polished, platform-ready content, without losing the original personality.",
    author: 'GAURAV PURBIA',
    role: 'SpaceTech & Deep Tech',
    company: 'Founder, Inorbii',
    metric: '3.8M Reels Views',
    avatar: '/review2.jpg',
  },
  {
    quote: "Finding a reliable editor who actually understands story arcs and doesn't swallow deadlines used to be a nightmare. With EDITZ, raw podcast footage turns into viral shorts overnight. Worth every rupee.",
    author: 'Aakash Singh',
    role: 'LegalTech | TESTWIN | IIT KGP',
    company: 'Building Deep Tech. Solution',
    metric: '4.5x Ad ROAS',
    avatar: '/review3.jpg',
  },
];

export const FAQS: FAQItem[] = [
  {
    question: 'What types of videos do you edit?',
    answer: 'We edit Short-Form content (TikTok, Instagram Reels, YouTube Shorts), Long-Form YouTube videos, Podcasts, Video Essays, and Direct Response Social Ad Creatives.',
    category: 'Services',
  },
  {
    question: 'How fast can you deliver my video?',
    answer: 'Most short-form videos are delivered within 24–48 hours, while long-form projects typically take 3–5 business days, depending on complexity.',
    category: 'Timeline',
  },
  {
    question: 'Do you offer revisions?',
    answer: 'Yes. Every project includes revisions to make sure the final edit matches your vision, style, and expectations.',
    category: 'Process',
  },
  {
    question: 'Can you improve my content flow and retention hooks?',
    answer: 'Absolutely. We can help structure your footage, strengthen the opening hook, improve pacing, add pattern interrupts, and keep viewers engaged.',
    category: 'Strategy',
  },
  {
    question: 'Do you provide captions, motion graphics, and sound design?',
    answer: 'Yes. We can include animated captions, motion graphics, transitions, sound effects, music, B-roll, and other elements depending on your editing requirements.',
    category: 'Features',
  },
  {
    question: 'How do we start working together?',
    answer: "Simply send us your footage and tell us what you're looking for. We'll discuss the style, requirements, timeline, and deliverables before getting started.",
    category: 'Onboarding',
  },
  {
    question: 'Do you edit specifically for social media algorithms?',
    answer: "Yes. We optimize edits for each platform's viewing behavior, including strong hooks, fast pacing, captions, retention-focused cuts, and platform-specific formats.",
    category: 'Optimization',
  },
  {
    question: 'Can you edit videos in my existing style?',
    answer: "Yes. Send us a few examples of videos you like or your existing content, and we'll match the editing style, pacing, captions, and overall visual language.",
    category: 'Style',
  },
];
