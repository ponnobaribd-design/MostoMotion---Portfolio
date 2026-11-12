import { GalleryMediaItem, CategoryStructure } from '../types/gallery';

export const GALLERY_CATEGORIES: CategoryStructure[] = [
  {
    category: 'Motion Graphics',
    icon: 'fa-bolt-lightning',
    subCategories: [
      'Restaurant Ads',
      'Promotional / Commercial Video',
      'Before / After',
      'Logo & Title Animation',
    ],
  },
  {
    category: 'Video Editing',
    icon: 'fa-clapperboard',
    subCategories: [
      'Podcast Editing',
      'Short-form Content',
      'Before / After',
      'Educational Content',
      'Restaurant Ads',
    ],
  },
  {
    category: 'Graphic Design',
    icon: 'fa-palette',
    subCategories: [
      'Social Media Creatives',
      'YouTube Thumbnails',
      'AI Generated Concept Art',
    ],
  },
];

export const GALLERY_ITEMS: GalleryMediaItem[] = [
  // ----------------- MOTION GRAPHICS: Restaurant Ads -----------------
  {
    id: 'mg-rest-1',
    title: 'Smoked Sizzle - Gourmet Burger Motion Promo',
    category: 'Motion Graphics',
    subCategory: 'Restaurant Ads',
    orientation: 'horizontal',
    aspectRatio: '16:9',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-camera-moving-around-a-delicious-hamburger-42998-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80',
    youtubeId: 'RqTISupuvJQ',
    client: 'Gourmet Beast Bistro',
    year: '2026',
    tags: ['Kinetic Typography', 'Food Styling', '2D Particles'],
    metrics: '+45% Table Bookings',
    description: 'Dynamic kinetic typography integrated with high-speed macro food sizzles and liquid particle burst animations.'
  },
  {
    id: 'mg-rest-2',
    title: 'Neon Crust - Midnight Pizza Reel',
    category: 'Motion Graphics',
    subCategory: 'Restaurant Ads',
    orientation: 'vertical',
    aspectRatio: '9:16',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-view-of-neon-lights-and-rain-in-the-city-42506-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    client: 'Crust & Neon Lounge',
    year: '2026',
    tags: ['9:16 Vertical Reel', 'Motion Tracking', 'Neon Glow'],
    metrics: '1.2M Instagram Views',
    description: 'High-energy vertical story promo featuring neon outline animations, 3D pizza cheese-pull simulation, and rhythmic sound effects.'
  },

  // ----------------- MOTION GRAPHICS: Promotional / Commercial Video -----------------
  {
    id: 'mg-promo-1',
    title: 'Apex Cloud - SaaS Platform Reveal',
    category: 'Motion Graphics',
    subCategory: 'Promotional / Commercial Video',
    orientation: 'horizontal',
    aspectRatio: '16:9',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-glowing-lines-in-a-futuristic-tunnel-31998-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    youtubeId: 'CpIo8M0OoMQ',
    client: 'Apex Enterprise Cloud',
    year: '2026',
    tags: ['UI Animation', '3D Camera', 'Isometric Tech'],
    metrics: '3.4x Conversion Rate',
    description: 'Futuristic product journey revealing complex cloud architectures with sleek glassmorphic HUD elements and fluid UI camera tracking.'
  },
  {
    id: 'mg-promo-2',
    title: 'CyberPulse - Next-Gen Smart Watch Launch',
    category: 'Motion Graphics',
    subCategory: 'Promotional / Commercial Video',
    orientation: 'vertical',
    aspectRatio: '9:16',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-woman-in-a-cyberpunk-setting-42505-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    client: 'PulseTech Wearables',
    year: '2026',
    tags: ['TikTok Ad', 'CGI Modeling', 'Hype Transitions'],
    metrics: '88% Watch Retention',
    description: 'High-octane mobile-first vertical commercial blending 3D exploded hardware layers with cyberpunk lighting and bass-heavy foley.'
  },

  // ----------------- MOTION GRAPHICS: Before / After -----------------
  {
    id: 'mg-ba-1',
    title: 'Raw Wireframe to 3D Cyber City',
    category: 'Motion Graphics',
    subCategory: 'Before / After',
    orientation: 'horizontal',
    aspectRatio: '16:9',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-flying-cars-and-skyscrapers-43486-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    youtubeId: 'WRImp6ar1tw',
    client: 'Studio Breakdown',
    year: '2026',
    tags: ['VFX Breakdown', 'Compositing', 'After Effects'],
    metrics: 'Staff Pick Showcase',
    description: 'Interactive visual breakdown transitioning from flat 2D illustrator outlines into multi-pass raytraced neon skyscraper sequences.'
  },

  // ----------------- MOTION GRAPHICS: Logo & Title Animation -----------------
  {
    id: 'mg-logo-1',
    title: 'Synthetix Brand Signature & Kinetic Opener',
    category: 'Motion Graphics',
    subCategory: 'Logo & Title Animation',
    orientation: 'horizontal',
    aspectRatio: '16:9',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-computer-keyboard-40659-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    youtubeId: '37RE2szARdI',
    client: 'Synthetix AI',
    year: '2026',
    tags: ['Logo Sting', 'Liquid Metal', 'Sound Design'],
    metrics: 'Official Brand Asset',
    description: 'Ultra-crisp chrome liquid logo transformation with metallic sound design and radiant caustic lighting reflections.'
  },

  // ----------------- VIDEO EDITING: Podcast Editing -----------------
  {
    id: 've-pod-1',
    title: 'The Founder Deep-Dive - Multi-Cam Podcast Master',
    category: 'Video Editing',
    subCategory: 'Podcast Editing',
    orientation: 'horizontal',
    aspectRatio: '16:9',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-top-aerial-shot-of-seashore-with-rocks-1090-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
    youtubeId: 'WSueOjXq38s',
    client: 'Visionary Founders Talk',
    year: '2026',
    tags: ['Multi-Camera Sync', 'Audio Cleanup', 'Subtitles'],
    metrics: '250K+ Monthly Listens',
    description: 'Comprehensive 4-camera rhythmic switcher editing, surgical room noise elimination, and real-time motion lower-thirds.'
  },
  {
    id: 've-pod-2',
    title: 'Unfiltered Mindset - Podcast Micro-Clips',
    category: 'Video Editing',
    subCategory: 'Podcast Editing',
    orientation: 'vertical',
    aspectRatio: '9:16',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-dj-mixing-music-in-a-club-42502-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80',
    client: 'The Unfiltered Show',
    year: '2026',
    tags: ['Viral Hook', 'Dynamic B-Roll', 'Animated Captions'],
    metrics: '3.8M Collective Views',
    description: 'Punchy 9:16 podcast bite formatted with dynamic word-by-word highlighted captions, sound punch-ins, and contextual overlays.'
  },

  // ----------------- VIDEO EDITING: Short-form Content -----------------
  {
    id: 've-short-1',
    title: 'High-Impact Fitness & Discipline Hook Reel',
    category: 'Video Editing',
    subCategory: 'Short-form Content',
    orientation: 'vertical',
    aspectRatio: '9:16',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-exercising-in-a-gym-vertical-video-41716-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    youtubeId: 'QsnVvXJWG1o',
    client: 'IronMind Athletics',
    year: '2026',
    tags: ['High Retention', 'Match Cuts', 'Sound FX'],
    metrics: '94% Retention Through 0:30',
    description: 'Fast-paced rhythmic editing engineered around speech cadence, speed ramping, speed cuts, and atmospheric whoosh sound effects.'
  },
  {
    id: 've-short-2',
    title: 'Cyberpunk Streets - Night Shift Travel Vlog',
    category: 'Video Editing',
    subCategory: 'Short-form Content',
    orientation: 'vertical',
    aspectRatio: '9:16',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-view-of-neon-lights-and-rain-in-the-city-42506-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    client: 'Urban Wanderers',
    year: '2026',
    tags: ['Color Grade', 'Speed Ramp', 'Trending Audio'],
    metrics: '420K Shares',
    description: 'Cinematic color graded night reels using speed ramps, whip transitions, and bass drops synchronized with neon lights.'
  },

  // ----------------- VIDEO EDITING: Before / After -----------------
  {
    id: 've-ba-1',
    title: 'Flat Log Footage to Cinematic Film Look',
    category: 'Video Editing',
    subCategory: 'Before / After',
    orientation: 'horizontal',
    aspectRatio: '16:9',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    youtubeId: 'nUQIWg_oAAs',
    client: 'Cinema Masterclass',
    year: '2026',
    tags: ['Color Grading', 'DaVinci Resolve', 'ACES Workflow'],
    metrics: '98% Positive Feedback',
    description: 'Wipe slider showcasing washed out Sony S-Log3 raw recording vs. custom film-stock emulated teal & orange final master.'
  },

  // ----------------- VIDEO EDITING: Educational Content -----------------
  {
    id: 've-edu-1',
    title: 'How Global Economies Shift - Documentary Edit',
    category: 'Video Editing',
    subCategory: 'Educational Content',
    orientation: 'horizontal',
    aspectRatio: '16:9',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-computer-keyboard-40659-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    youtubeId: '5RLkYLxCV5U',
    client: 'Economics Explained Channel',
    year: '2026',
    tags: ['Documentary Style', 'Parallax Maps', 'Archival VFX'],
    metrics: '850K YouTube Views',
    description: 'Deep narrative flow with archival photo 2.5D parallax displacement, timeline graphics, and suspenseful orchestral scoring.'
  },

  // ----------------- VIDEO EDITING: Restaurant Ads -----------------
  {
    id: 've-rest-1',
    title: 'Artisan Espresso - Craft & Roasted Moments',
    category: 'Video Editing',
    subCategory: 'Restaurant Ads',
    orientation: 'vertical',
    aspectRatio: '9:16',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-dj-mixing-music-in-a-club-42502-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    client: 'Velvet Coffee Roasters',
    year: '2026',
    tags: ['Coffee Aesthetic', 'Macro B-Roll', 'ASMR Audio'],
    metrics: '+60% Story Engagement',
    description: 'Sensory coffee brewing experience highlighted with ASMR steam sounds, warm film tones, and rhythmic shot transitions.'
  },

  // ----------------- GRAPHIC DESIGN: Social Media Creatives -----------------
  {
    id: 'gd-sm-1',
    title: 'Cyberpunk Sneaker Drop - Instagram Carousel System',
    category: 'Graphic Design',
    subCategory: 'Social Media Creatives',
    orientation: 'horizontal',
    aspectRatio: '16:9',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    client: 'Volt Footwear',
    year: '2026',
    tags: ['Photoshop', 'Typography', 'Multi-Slide Grid'],
    metrics: '15.4K Saves',
    description: 'High-contrast neon brutalist visual identity with custom Japanese cyber glyphs and metallic product lighting.'
  },
  {
    id: 'gd-sm-2',
    title: 'Futuristic Music Festival - Billboard & Story Ad',
    category: 'Graphic Design',
    subCategory: 'Social Media Creatives',
    orientation: 'vertical',
    aspectRatio: '9:16',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    client: 'SubZero Festival',
    year: '2026',
    tags: ['Festival Poster', 'Event Identity', 'Holographic FX'],
    metrics: 'Sold Out in 4 Hours',
    description: 'Holographic foil texture styling with custom typography and neon gradient framing designed for high-conversion stories.'
  },

  // ----------------- GRAPHIC DESIGN: YouTube Thumbnails -----------------
  {
    id: 'gd-yt-1',
    title: 'The AI Revolution - 100K CTR Optimized Cover',
    category: 'Graphic Design',
    subCategory: 'YouTube Thumbnails',
    orientation: 'horizontal',
    aspectRatio: '16:9',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    client: 'Tech Frontier',
    year: '2026',
    tags: ['Thumbnails', 'Expression Cutout', 'Contrast Theory'],
    metrics: '16.8% Initial CTR',
    description: 'Eye-catching 3D glowing robot composition with high-saturation contrast and custom stylized 3D typography.'
  },

  // ----------------- GRAPHIC DESIGN: AI Generated Concept Art -----------------
  {
    id: 'gd-ai-1',
    title: 'Neon Tokyo 2099 - Spatial Concept Keyframes',
    category: 'Graphic Design',
    subCategory: 'AI Generated Concept Art',
    orientation: 'horizontal',
    aspectRatio: '16:9',
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    client: 'SciFi Indie Feature',
    year: '2026',
    tags: ['Midjourney v6', 'Photoshop Paint-over', 'World-building'],
    metrics: 'Pre-production Asset',
    description: 'AI-assisted cinematic concept key art refined with matte painting, atmospheric volumetric fog, and authentic neon reflections.'
  },
  {
    id: 'gd-ai-2',
    title: 'Bio-Mechanical Cyber Android Portrait',
    category: 'Graphic Design',
    subCategory: 'AI Generated Concept Art',
    orientation: 'vertical',
    aspectRatio: '9:16',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    client: 'Autonomous Labs',
    year: '2026',
    tags: ['Concept Art', 'Character Design', '9:16 Portrait'],
    metrics: 'Featured on ArtStation',
    description: 'Detailed cybernetic headpiece design featuring translucent acrylic panels, internal cooling circuits, and emerald LED eye lenses.'
  }
];
