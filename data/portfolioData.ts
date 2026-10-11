/**
 * Single source of truth for the portfolio.
 * - The landing page sections render from this object.
 * - The voice assistant's system instruction is generated from this object.
 * Edit this file to update both the UI and the AI's knowledge at once.
 */

export interface Project {
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  highlights: string[];
  liveUrl?: string;
  repoUrl?: string;
}

export interface Experience {
  company: string;
  role: string;
  location: string;
  start: string;
  end: string; // "Present" for current role
  summary: string;
  achievements: string[];
  tech: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Faq {
  question: string;
  answer: string;
}

export interface PortfolioData {
  profile: {
    name: string;
    firstName: string;
    title: string;
    location: string;
    timezone: string;
    yearsOfExperience: number;
    availability: string;
    shortBio: string;
    longBio: string;
  };
  contact: {
    email: string;
    linkedin: string;
    github: string;
    website?: string;
    preferredContact: string;
  };
  skills: SkillGroup[];
  projects: Project[];
  experience: Experience[];
  education: { institution: string; degree: string; years: string }[];
  certifications: string[];
  interests: string[];
  faqs: Faq[];
}

// TODO: Replace every placeholder below with your real details.
export const portfolioData: PortfolioData = {
  profile: {
    name: "Alex Rahman",
    firstName: "Alex",
    title: "Senior Full-Stack Engineer & AI Solutions Architect",
    location: "Dhaka, Bangladesh (open to remote worldwide)",
    timezone: "GMT+6",
    yearsOfExperience: 7,
    availability:
      "Open to senior full-stack / AI engineering roles and select freelance projects.",
    shortBio:
      "I build fast, reliable web products and production-grade AI features — from real-time voice agents to scalable SaaS backends.",
    longBio:
      "I'm a full-stack engineer with 7 years of experience shipping products end to end. I specialize in TypeScript, React/Next.js and Node.js, and over the last few years I've focused on applied AI: LLM-powered assistants, retrieval-augmented generation, and real-time voice interfaces. I care about latency, developer experience, and clean architecture, and I enjoy leading small teams from idea to production.",
  },
  contact: {
    email: "hello@example.com",
    linkedin: "https://linkedin.com/in/your-handle",
    github: "https://github.com/your-handle",
    website: "https://your-domain.dev",
    preferredContact: "Email is the fastest way to reach me — I usually reply within 24 hours.",
  },
  skills: [
    { category: "Frontend", items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Framer Motion", "Web Audio API"] },
    { category: "Backend", items: ["Node.js", "NestJS", "PostgreSQL", "Prisma", "Redis", "REST & GraphQL", "WebSockets"] },
    { category: "AI / ML", items: ["Gemini Live API", "OpenAI & Anthropic APIs", "RAG", "Vector databases", "Prompt engineering", "Function calling"] },
    { category: "Cloud & DevOps", items: ["Vercel", "AWS", "Docker", "GitHub Actions", "Cloudflare"] },
  ],
  projects: [
    {
      name: "VoiceFolio",
      tagline: "Real-time voice AI that answers questions about me",
      description:
        "This very site: a Next.js portfolio with a voice assistant streaming 16 kHz PCM audio to the Gemini Live API over WebSockets and playing back 24 kHz audio with sub-second latency.",
      tech: ["Next.js", "Gemini Live API", "AudioWorklet", "Framer Motion"],
      highlights: ["Ephemeral tokens keep the API key server-side", "Barge-in: you can interrupt the assistant mid-sentence"],
      repoUrl: "https://github.com/your-handle/voice-portfolio",
    },
    {
      name: "InsightDesk",
      tagline: "AI support copilot for SaaS teams",
      description:
        "A RAG-based copilot that drafts support replies from a company's docs and past tickets, cutting first-response time by 60%.",
      tech: ["Next.js", "NestJS", "PostgreSQL + pgvector", "OpenAI"],
      highlights: ["Served 40k tickets/month", "Citations on every answer"],
      liveUrl: "https://example.com",
    },
    {
      name: "ShipFast Commerce",
      tagline: "Headless e-commerce storefront",
      description:
        "High-performance storefront with edge caching and a custom checkout, reaching a 98 Lighthouse score and lifting conversion by 18%.",
      tech: ["Next.js", "Stripe", "Redis", "Vercel Edge"],
      highlights: ["< 1s LCP worldwide", "Zero-downtime deploys"],
    },
  ],
  experience: [
    {
      company: "Acme AI",
      role: "Senior Full-Stack Engineer",
      location: "Remote",
      start: "2023",
      end: "Present",
      summary: "Lead engineer for the conversational AI product line.",
      achievements: [
        "Architected a real-time voice agent platform used by 200+ business customers",
        "Reduced LLM inference cost by 45% through caching and model routing",
        "Mentored 4 engineers and introduced end-to-end type safety across the stack",
      ],
      tech: ["TypeScript", "Next.js", "Node.js", "Gemini", "AWS"],
    },
    {
      company: "Pixel Labs",
      role: "Full-Stack Developer",
      location: "Dhaka, Bangladesh",
      start: "2019",
      end: "2023",
      summary: "Built SaaS products for clients across fintech and e-commerce.",
      achievements: [
        "Delivered 15+ production web apps from scoping to launch",
        "Built a payments reconciliation service processing $2M/month",
      ],
      tech: ["React", "Node.js", "PostgreSQL", "Docker"],
    },
  ],
  education: [
    { institution: "University of Dhaka", degree: "B.Sc. in Computer Science & Engineering", years: "2015 – 2019" },
  ],
  certifications: ["AWS Certified Developer – Associate"],
  interests: ["Voice interfaces", "Developer tooling", "Open source", "Photography"],
  faqs: [
    { question: "Are you available for hire?", answer: "Yes — open to senior full-time roles and selected freelance work." },
    { question: "Do you work remotely?", answer: "Yes, fully remote, with good overlap with Europe and partial overlap with US East." },
    { question: "What is your rate?", answer: "It depends on scope. Please email me with project details and I'll send a quote." },
    { question: "How was this voice assistant built?", answer: "Next.js, the Gemini Live API over WebSockets, and AudioWorklets for raw PCM streaming." },
  ],
};
