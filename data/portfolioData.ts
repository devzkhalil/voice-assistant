/**
 * Single source of truth for the portfolio.
 * - Every page renders from this object.
 * - The voice assistant's system instruction is generated from this object.
 * Edit this file to update both the UI and the AI's knowledge at once.
 *
 * Sources: the v3 site (github.com/devzkhalil/devzkhalil.com), the live sites linked
 * from each project, and the GitHub profile. Anything not found there is left out
 * rather than invented, so the assistant says "I don't have that detail" instead of guessing.
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

export interface Colleague {
  name: string;
  position: string;
  image: string;
  special?: boolean;
}

export interface DeviceGroup {
  title: string;
  image: string;
  specs: { label: string; value: string }[];
}

export interface PortfolioData {
  profile: {
    name: string;
    firstName: string;
    /** First name as it should be spoken in Bangla (used by the voice assistant). */
    firstNameBn: string;
    title: string;
    location: string;
    timezone: string;
    yearsOfExperience: number;
    availability: string;
    shortBio: string;
    longBio: string;
    avatar: string;
    ogImage: string;
    roles: string[];
    company: string;
  };
  contact: {
    email: string;
    linkedin: string;
    github: string;
    x: string;
    facebook: string;
    instagram: string;
    website?: string;
    resume: string;
    preferredContact: string;
  };
  organizations: { name: string; url?: string; avatar: string }[];
  skills: SkillGroup[];
  projects: Project[];
  openSource: Project[];
  experience: Experience[];
  education: { institution: string; degree: string; years: string }[];
  certifications: string[];
  interests: string[];
  colleagues: Colleague[];
  devices: { current: DeviceGroup[]; nov2025: DeviceGroup[] };
  faqs: Faq[];
}

export const portfolioData: PortfolioData = {
  profile: {
    name: "MD Khalil",
    firstName: "Khalil",
    firstNameBn: "খলিল",
    title: "Full Stack Developer",
    location: "Noakhali, Chittagong, Bangladesh",
    timezone: "GMT+6",
    yearsOfExperience: 5,
    availability:
      "Currently working full-time as a Full Stack Developer at Pixency (since November 2025). His website also lists him as open to freelance work.",
    shortBio:
      "Full Stack Developer with about five years of experience building efficient, scalable, user-centric web products with Laravel, Vue.js and React.",
    longBio:
      "I am a dedicated Full Stack Developer with about five years of professional experience, working since 2022. I am passionate about creating efficient, scalable, and user-centric web solutions, mainly with Laravel and Vue.js, and I am now working with React as well. I also have a strong interest in Artificial Intelligence (AI) and SaaS product development. I enjoy building efficient and user-friendly web applications, have experience with database management systems and software development tools, and take pride in solving problems and collaborating effectively with others.",
    avatar: "https://avatars.githubusercontent.com/u/70958192?v=4",
    ogImage: "/images/devzkhalil.png",
    roles: ["Full Stack Developer", "Fitness Enthusiast", "Cryptocurrency Enthusiast", "SaaS Passionate"],
    company: "Pixency",
  },
  contact: {
    email: "devzkhalil@gmail.com",
    linkedin: "https://www.linkedin.com/in/devzkhalil/",
    github: "https://github.com/devzkhalil",
    x: "https://x.com/devzkhalil",
    facebook: "https://facebook.com/devzkhalil",
    instagram: "https://www.instagram.com/devzkhalil/",
    resume: "/devzkhalil-resume.pdf",
    preferredContact: "Email is the best way to reach Khalil; he is also on LinkedIn, X, Facebook and Instagram as devzkhalil.",
  },
  organizations: [
    { name: "Zakirsoft", url: "https://zakirsoft.com/", avatar: "https://avatars.githubusercontent.com/u/68361724" },
    { name: "Echotemplate", url: "https://github.com/echotemplate", avatar: "https://avatars.githubusercontent.com/u/77661058?s=200&v=4" },
    { name: "Templatecookie", url: "https://templatecookie.com/", avatar: "https://avatars.githubusercontent.com/u/84447337" },
    { name: "Templatecottage", url: "https://github.com/templatecottage", avatar: "https://avatars.githubusercontent.com/u/110558028" },
    { name: "Hidden Company", avatar: "/images/hidden-company.png" },
  ],
  skills: [
    { category: "Frontend", items: ["Vue.js", "React", "Tailwind", "Bootstrap", "Ant Design", "jQuery", "JavaScript", "CSS", "HTML"] },
    { category: "Backend", items: ["Laravel", "PHP", "MySQL", "Artisan Tool", "JSON", "REST API", "DigitalOcean Spaces"] },
    { category: "Others", items: ["Git & GitHub", "Jira", "Trello", "Slack", "Notion", "Google Docs", "Server Management"] },
  ],
  projects: [
    {
      name: "Nexes",
      tagline: "School management software for Bangladesh",
      description:
        "A school and madrasa management platform: question paper creation, OMR, online exams and a complete EMS, with bKash and Nagad payments.",
      tech: [],
      highlights: [],
      liveUrl: "https://nexes.ai/",
    },
    {
      name: "JuggleHire",
      tagline: "AI-native recruitment CRM",
      description:
        "A recruitment CRM for recruiters and agencies: candidates ranked by fit, with scheduling, assessments and signed offers built in.",
      tech: [],
      highlights: [],
      liveUrl: "https://jugglehire.com/",
    },
    {
      name: "ScentQ",
      tagline: "Monthly perfume subscription box",
      description: "An e-commerce subscription service offering designer fragrances every month with free shipping.",
      tech: [],
      highlights: [],
      liveUrl: "https://scentq.com/",
    },
    {
      name: "Bofamarket",
      tagline: "Free classifieds marketplace",
      description:
        "A marketplace connecting buyers and sellers with free classified ads across real estate, jobs, services and more.",
      tech: [],
      highlights: [],
      liveUrl: "https://bofamarketplace.com/",
    },
    {
      name: "Jobadoo",
      tagline: "Live project",
      description: "A live project Khalil worked on (UK domain).",
      tech: [],
      highlights: [],
      liveUrl: "https://jobadoo.co.uk/",
    },
    {
      name: "Jobpilot",
      tagline: "Templatecookie product",
      description: "A Templatecookie product demo that Khalil worked on.",
      tech: [],
      highlights: [],
      liveUrl: "https://jobpilot.templatecookie.com/",
    },
    {
      name: "Adlisting",
      tagline: "Templatecookie product",
      description: "A Templatecookie product demo that Khalil worked on.",
      tech: [],
      highlights: [],
      liveUrl: "https://adlisting.templatecookie.com/",
    },
    {
      name: "Schooling",
      tagline: "Templatecookie product",
      description: "A Templatecookie product demo that Khalil worked on.",
      tech: [],
      highlights: [],
      liveUrl: "https://schooling.templatecookie.com/",
    },
    {
      name: "BoboSoho",
      tagline: "Live project",
      description: "A live project (office.bobosoho.com) that Khalil worked on.",
      tech: [],
      highlights: [],
      liveUrl: "https://office.bobosoho.com/",
    },
  ],
  openSource: [
    {
      name: "laravel-one-click-installer",
      tagline: "One-click installer package for Laravel apps",
      description: "The installer package for Laravel applications in the release field; published on Packagist.",
      tech: ["PHP", "Laravel"],
      highlights: [],
      liveUrl: "https://packagist.org/packages/devzkhalil/laravel-one-click-installer",
      repoUrl: "https://github.com/devzkhalil/laravel-one-click-installer",
    },
    {
      name: "laravel-trovit-xml-feed",
      tagline: "Trovit XML feed generator for Laravel",
      description: "A package that helps you generate Trovit XML feeds in a Laravel project.",
      tech: ["PHP", "Laravel"],
      highlights: [],
      repoUrl: "https://github.com/devzkhalil/laravel-trovit-xml-feed",
    },
    {
      name: "laravel-primer-octicons",
      tagline: "GitHub Octicons for Laravel",
      description: "A Laravel package to integrate GitHub's Octicons icons into a Laravel project.",
      tech: ["Blade", "Laravel"],
      highlights: [],
      repoUrl: "https://github.com/devzkhalil/laravel-primer-octicons",
    },
    {
      name: "whatsapp-sidebar-blur-chrome-extension",
      tagline: "Blur the WhatsApp Web sidebar for privacy",
      description: "A Chrome extension that minimizes distractions and protects privacy by blurring the WhatsApp sidebar.",
      tech: ["JavaScript", "Chrome Extension"],
      highlights: [],
      repoUrl: "https://github.com/devzkhalil/whatsapp-sidebar-blur-chrome-extension",
    },
    {
      name: "puppeteer-facebook-unfriends-script",
      tagline: "Facebook unfriend tool built with Puppeteer",
      description: "A tool built with Puppeteer, the Node.js library, to automate unfriending on Facebook.",
      tech: ["JavaScript", "Puppeteer"],
      highlights: [],
      repoUrl: "https://github.com/devzkhalil/puppeteer-facebook-unfriends-script",
    },
    {
      name: "facebook-reels-off-extension",
      tagline: "Chrome extension to switch off Facebook Reels",
      description: "A browser extension project for turning Facebook Reels off.",
      tech: ["JavaScript", "Chrome Extension"],
      highlights: [],
      repoUrl: "https://github.com/devzkhalil/facebook-reels-off-extension",
    },
  ],
  experience: [
    {
      company: "Pixency",
      role: "Full Stack Developer",
      location: "",
      start: "Nov 2025",
      end: "Present",
      summary:
        "Contributing to Pixency's recently launched SaaS projects, handling core frontend and backend responsibilities. Building scalable features, optimizing performance and ensuring smooth deployment. Also involved in setting up and supporting Pixency's upcoming client service operations, including maintaining and extending their digital product ecosystem.",
      achievements: [],
      tech: [],
    },
    {
      company: "Lomeyo",
      role: "Junior Laravel & Vue.js Developer",
      location: "",
      start: "Feb 2022",
      end: "Nov 2025",
      summary:
        "Khalil's coding career took off at Lomeyo, where he began as a Junior Laravel & Vue.js Developer. It let him dive into real-world projects, applying and expanding his knowledge of Laravel and Vue.js with guidance from an experienced team.",
      achievements: [],
      tech: ["Laravel", "Vue.js"],
    },
    {
      company: "Zakirsoft",
      role: "Laravel Intern",
      location: "",
      start: "Feb 2022",
      end: "Jun 2022",
      summary:
        "An internship as a Laravel developer, applying his skills in a professional setting and learning practical industry insights from experienced professionals.",
      achievements: [],
      tech: ["Laravel"],
    },
    {
      company: "Self practice",
      role: "Self-taught developer",
      location: "Home",
      start: "Feb 2021",
      end: "Jan 2022",
      summary:
        "During the COVID-19 pandemic Khalil dedicated himself to self-study at home, building his coding skills through consistent practice and self-discipline.",
      achievements: [],
      tech: [],
    },
  ],
  education: [
    { institution: "Saikat Government College", degree: "Higher Secondary Certificate (HSC), Business Studies", years: "2021" },
    { institution: "Hatiya Janakallan Shikkha Trust High School", degree: "Secondary School Certificate (SSC)", years: "2019" },
  ],
  certifications: [],
  interests: ["Fitness", "Cryptocurrency", "SaaS products", "Artificial Intelligence"],
  colleagues: [
    { name: "Ariful Islam", position: "Full Stack Developer", image: "ariful-islam.png" },
    { name: "Sraboni Akter", position: "Laravel Developer", image: "woman.png" },
    { name: "Rakibul Islam", position: "Frontend Developer", image: "rakibul-islam.png" },
    { name: "Abiruzzaman Molla", position: "Full Stack Developer", image: "abiruzzaman.png" },
    { name: "Emon Raj", position: "PHP Developer", image: "emon-raj.png" },
    { name: "Jannat Shathi", position: "Laravel Developer", image: "woman.png" },
    { name: "Zafor Iqbal", position: "User Interface Designer", image: "zafor-iqbal.png" },
    { name: "Opu Saha", position: "Full Stack Developer", image: "opu-saha.png", special: true },
    { name: "Abdul Awal", position: "Laravel Developer", image: "abdul-awal.png" },
    { name: "Suraiya Aysha", position: "Laravel Developer", image: "woman.png" },
    { name: "Shumon Pal", position: "Laravel Developer", image: "shumon-pal.png" },
    { name: "Al Nahian", position: "Frontend Developer", image: "al-nahian.png" },
    { name: "Pranto Saha", position: "Full Stack Developer", image: "pranto-saha.png" },
    { name: "Usama Ahmed", position: "Laravel Developer", image: "usama-ahmed.png" },
    { name: "Shahed Suzan", position: "Laravel Developer", image: "shahed-suzan.png" },
    { name: "Yeamin Rabbi", position: "Laravel Developer", image: "yeamin-rabbi.png" },
    { name: "Naim Ahmed", position: "Frontend Developer", image: "naim-ahmed.png" },
    { name: "Arman Rahman", position: "Laravel Developer", image: "arman-rahman.png" },
    { name: "Zidan Khan", position: "Laravel Developer (Intern)", image: "zidan-khan.png" },
    { name: "Hridoy Roy", position: "Laravel Developer", image: "hridoy-roy.png" },
    { name: "MD Suzayet", position: "Laravel Developer", image: "md-suzayet.png" },
    { name: "Rakib Ahmed", position: "Laravel Developer", image: "rakib-ahmed.png" },
    { name: "Al Amin Islam", position: "Backend Developer", image: "al-amin-islam.png" },
  ],
  devices: {
    current: [
      {
        title: "MacBook Air M4",
        image: "/images/mackbook-air.webp",
        specs: [
          { label: "RAM", value: "16 GB" },
          { label: "Storage", value: "256GB" },
        ],
      },
      {
        title: "Monitor",
        image: "/images/monitor.avif",
        specs: [
          { label: "Name", value: "HP 21.5 inch Full HD LED Backlit IPS Panel Monitor" },
          { label: "Response Time", value: "5 ms, 60 Hz Refresh Rate" },
        ],
      },
      {
        title: "Internet",
        image: "/images/internet.avif",
        specs: [
          { label: "Mobile Data", value: "Available With 40 Mbps" },
          { label: "Wifi", value: "Available With 10 Mbps" },
        ],
      },
    ],
    nov2025: [
      {
        title: "PC Configuration",
        image: "/images/pc.avif",
        specs: [
          { label: "RAM", value: "16.0 GiB" },
          { label: "Processor", value: "Intel® Core™ i3-6100 CPU @ 3.70GHz × 4" },
          { label: "Graphics", value: "Mesa Intel® HD Graphics 530 (SKL GT2)" },
          { label: "Disk Capacity", value: "120.0 GB" },
          { label: "Operating System", value: "Ubuntu 24.04.1 LTS" },
        ],
      },
      {
        title: "Monitor",
        image: "/images/monitor.avif",
        specs: [
          { label: "Name", value: "HP 21.5 inch Full HD LED Backlit IPS Panel Monitor" },
          { label: "Response Time", value: "5 ms, 60 Hz Refresh Rate" },
        ],
      },
      {
        title: "Backup Device",
        image: "/images/laptop.avif",
        specs: [
          { label: "Name", value: "HP EliteBook Folio 9480m Notebook" },
          { label: "RAM", value: "4 GiB" },
          { label: "Processor", value: "Intel® Core™ i5-4310U CPU @ 2.00GHz × 4" },
          { label: "Operating System", value: "Ubuntu 22.04.4 LTS" },
        ],
      },
      {
        title: "Internet",
        image: "/images/internet.avif",
        specs: [
          { label: "Mobile Data", value: "Available With 40 Mbps" },
          { label: "Wifi", value: "Available With 10 Mbps" },
        ],
      },
      {
        title: "Electricity Backup",
        image: "/images/electricity.avif",
        specs: [
          { label: "Inverter", value: "Livguard i2-Verter LG 1100i" },
          { label: "Battery", value: "165 AH" },
          { label: "Backup Time", value: "10 Hours" },
        ],
      },
    ],
  },
  faqs: [
    {
      question: "Where does Khalil work?",
      answer:
        "Khalil is a Full Stack Developer at Pixency since November 2025. Before that he worked at Lomeyo as a Laravel and Vue.js developer from February 2022 to November 2025.",
    },
    {
      question: "What is Khalil's main tech stack?",
      answer:
        "Laravel and PHP with MySQL on the backend, and Vue.js on the frontend, plus Tailwind and Bootstrap. He is also actively working with React now. He also works with REST APIs, Git and server management.",
    },
    {
      question: "Where is Khalil based?",
      answer: "He is based in Noakhali, in the Chittagong division of Bangladesh, in the GMT+6 timezone.",
    },
    {
      question: "How can I contact Khalil?",
      answer: "By email at devzkhalil at gmail dot com, or through LinkedIn, X, Facebook and Instagram, all as devzkhalil.",
    },
    {
      question: "How many years of experience does Khalil have?",
      answer: "Khalil has about five years of professional experience; he started working in February 2022, after a year of self-study.",
    },
  ],
};
