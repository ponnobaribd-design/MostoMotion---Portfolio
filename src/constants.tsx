import { Service, PortfolioItem, SocialLink, Skill } from './types';

export const PERSONAL_INFO = {
  name: "Md. Mostofa Kamal",
  brand: "Mosto.Motion",
  tagline: "Lucrative Visual Experiences",
  subtitle: "Motion & Video Expert",
  email: "mostofaeeiubat1@gmail.com",
  phone: "+880 1723 918351",
  whatsapp: "https://wa.me/8801723918351",
  whatsappNumber: "8801723918351",
  telegramUsername: "Kochimosto",
  mainPortfolio: "https://graphicsdesignermishat.my.canva.site/mosto",
  drivePortfolio: "https://drive.google.com/drive/folders/1NAQGoB7lrkkut_tndw7UYL_ZvYgcDwza?usp=drive_link",
  resumeUrl: "https://drive.google.com/file/d/1wSz8vaayl4VWAkxdot2R4tyBx18udOQt/view?usp=drive_link",
  availability: "AVAILABLE FOR WORLD-CLASS PROJECTS",
  photoUrl: "/mostoprofile.png" 
};

export const REVIEWS = [
  {
    name: "John D.",
    role: "CEO",
    text: "The motion design exceeded our expectations. Truly world-class results for our brand launch!",
    color: "from-[#00ff9d] to-cyan-400"
  },
  {
    name: "Sarah M.",
    role: "Marketing Director",
    text: "Highly professional editing. The retention rates on our videos skyrocketed after Mosto's touch.",
    color: "from-cyan-400 to-purple-500"
  },
  {
    name: "Michael R.",
    role: "Content Creator",
    text: "Mosto knows exactly how to capture a brand's essence through visuals. Efficient and creative.",
    color: "from-purple-500 to-[#00ff9d]"
  }
];

export const SERVICES: Service[] = [
  {
    id: "motion",
    title: "Motion Graphics",
    description: "Premium animation systems designed to breathe life into static interfaces and brand narratives.",
    icon: "fa-bolt-lightning",
    features: [
      "SaaS Product Narratives",
      "Interface Motion Systems",
      "Commercial Identity",
      "Dynamic Social Content"
    ]
  },
  {
    id: "editing",
    title: "Video Editing",
    description: "High-retention cinematic editing focused on rhythmic storytelling and psychological engagement.",
    icon: "fa-clapperboard",
    features: [
      "Podcasting Post-Pro",
      "High-Impact Reels",
      "Corporate Brand Films",
      "Direct-Response Adverts"
    ]
  },
  {
    id: "sound",
    title: "Sound Design",
    description: "Spatial audio engineering to create an immersive auditory layer that completes the visual experience.",
    icon: "fa-wave-square",
    features: [
      "Surgical Noise Cleanup",
      "Atmospheric FX Design",
      "Spatial Mix & Mastering",
      "Rhythmic Foley Design",
      "Vocal Chain Engineering"
    ]
  },
  {
    id: "color",
    title: "COLOR GRADING",
    description: "Crafting cinematic color palettes and visual consistency that elevate storytelling, strengthen brand identity, and create emotional impact across every frame.",
    icon: "fa-palette",
    features: [
      "CINEMATIC LOOK DEVELOPMENT",
      "BRAND COLOR CONSISTENCY",
      "FILM EMULATION WORKFLOWS",
      "COMMERCIAL COLOR FINISHING",
      "VISUAL COLOR DESIGN"
    ]
  },
  {
    id: "social",
    title: "SOCIAL MEDIA MANAGER",
    description: "Strategic content planning, platform optimization, and performance-focused distribution designed to maximize audience engagement and brand growth.",
    icon: "fa-bullhorn",
    features: [
      "CONTENT STRATEGY DEVELOPMENT",
      "SHORT-FORM CONTENT SYSTEMS",
      "PLATFORM OPTIMIZATION",
      "CONTENT CALENDAR MANAGEMENT",
      "PERFORMANCE ANALYTICS"
    ]
  }
];

export const PORTFOLIO: PortfolioItem[] = [
  { 
    id: "p2", 
    title: "Podcast Editing", 
    category: "Editing", 
    thumbnail: "https://img.youtube.com/vi/WSueOjXq38s/maxresdefault.jpg", 
    youtubeId: "WSueOjXq38s" 
  },
  { 
    id: "p1", 
    title: "Food Promo Showreel", 
    category: "Commercial", 
    thumbnail: "https://img.youtube.com/vi/RqTISupuvJQ/maxresdefault.jpg", 
    youtubeId: "RqTISupuvJQ" 
  },
  { 
    id: "p5", 
    title: "Promo Video Showcase", 
    category: "Advertising", 
    thumbnail: "https://img.youtube.com/vi/37RE2szARdI/maxresdefault.jpg", 
    youtubeId: "37RE2szARdI" 
  },
  { 
    id: "p7", 
    title: "Website Display Ads", 
    category: "Marketing", 
    thumbnail: "https://img.youtube.com/vi/H0dOcd3Ff5M/maxresdefault.jpg", 
    youtubeId: "H0dOcd3Ff5M" 
  },
  { 
    id: "p3", 
    title: "Explainer & Promo Videos", 
    category: "Motion Graphics", 
    thumbnail: "https://img.youtube.com/vi/CpIo8M0OoMQ/maxresdefault.jpg", 
    youtubeId: "CpIo8M0OoMQ" 
  },
  { 
    id: "p4", 
    title: "Visual Storytelling", 
    category: "Cinematic", 
    thumbnail: "https://img.youtube.com/vi/nUQIWg_oAAs/maxresdefault.jpg", 
    youtubeId: "nUQIWg_oAAs" 
  },
  { 
    id: "p6", 
    title: "Infographic & Parallax Animation", 
    category: "2D Animation", 
    thumbnail: "https://img.youtube.com/vi/WRImp6ar1tw/maxresdefault.jpg", 
    youtubeId: "WRImp6ar1tw" 
  },
  { 
    id: "p8", 
    title: "Documentary Video Editing", 
    category: "Documentary", 
    thumbnail: "https://img.youtube.com/vi/QsnVvXJWG1o/maxresdefault.jpg", 
    youtubeId: "QsnVvXJWG1o" 
  },
  { 
    id: "p9", 
    title: "Educational & Explainer Animation", 
    category: "Educational", 
    thumbnail: "https://img.youtube.com/vi/5RLkYLxCV5U/maxresdefault.jpg", 
    youtubeId: "5RLkYLxCV5U" 
  },
  { 
    id: "p10", 
    title: "Ad for Global Brand", 
    category: "Global Ad", 
    thumbnail: "https://img.youtube.com/vi/eaUG8yh5fkQ/maxresdefault.jpg", 
    youtubeId: "eaUG8yh5fkQ" 
  }
];

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: "LinkedIn", url: "https://www.linkedin.com/in/mostomotion/", icon: "fa-linkedin-in" },
  { platform: "YouTube", url: "https://www.youtube.com/@mosto.motion/videos", icon: "fa-youtube" },
  { platform: "Behance", url: "https://www.behance.net/mostobd", icon: "fa-behance" },
  { platform: "Telegram", url: "https://t.me/Kochimosto", icon: "fa-telegram" },
  { platform: "Upwork", url: "https://www.upwork.com/freelancers/~01f4303787067d6f94", icon: "fa-upwork" }
];

export const SKILLS: Skill[] = [
  { name: "After Effects", icon: "fa-bolt-lightning", level: 95 },
  { name: "Premiere Pro", icon: "fa-clapperboard", level: 90 },
  { name: "Illustrator", icon: "fa-pen-nib", level: 85 },
  { name: "Canva Pro", icon: "fa-wand-magic-sparkles", level: 95 },
  { name: "CapCut", icon: "fa-scissors", level: 85 }
];