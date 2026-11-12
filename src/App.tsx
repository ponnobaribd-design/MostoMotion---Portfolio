import React, { useState, useEffect } from 'react';
import { PERSONAL_INFO, SERVICES, PORTFOLIO, SOCIAL_LINKS, SKILLS, REVIEWS } from './constants';
import { playInteractionSound } from './audio';
import AIChatAssistant from './components/AIChatAssistant';
import MagneticLink from './components/MagneticLink';
import VideoPlayer from './components/VideoPlayer';
import RayButton from './components/RayButton';
import SciFiBackground from './components/SciFiBackground';
import ServiceCard from './components/ServiceCard';
import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';
import ScrollReveal from './components/ScrollReveal';
import PortfolioCard from './components/PortfolioCard';
import SidebarGallery from './components/SidebarGallery';
import TestimonialCard from './components/TestimonialCard';
import SkillRow from './components/SkillRow';
import MostoLogo from './components/MostoLogo';
import DynamicName from './components/DynamicName';
import GalleryTitle from './components/GalleryTitle';
import StartProjectArea from './components/StartProjectArea';
import CartoonCharacter from './components/CartoonCharacter';

// CMS & Auth Integrations
import { RouterProvider, useRouter } from './components/Router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CMSDataProvider } from './context/CMSDataContext';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './components/admin/AdminLogin';
import ModeratorDashboard from './components/admin/ModeratorDashboard';

const PublicWebsite: React.FC = () => {
  const { navigate } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [revealStage, setRevealStage] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [videoColor, setVideoColor] = useState('#00ff9d');
  const [logoHovered, setLogoHovered] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const handlePreloaderComplete = () => {
    setRevealStage(1);
    setTimeout(() => {
      setRevealStage(2);
    }, 600);
    setTimeout(() => {
      setRevealStage(3);
    }, 1200);
  };

  useEffect(() => {
    const handleColorChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.color) {
        setVideoColor(customEvent.detail.color);
      }
    };
    const handleToggle = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        setIsChatOpen(!!customEvent.detail.open);
      }
    };
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener('youtube-video-color', handleColorChange);
    window.addEventListener('messenger-toggle', handleToggle);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('youtube-video-color', handleColorChange);
      window.removeEventListener('messenger-toggle', handleToggle);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Socials: LinkedIn, YouTube, Behance, Upwork (No Telegram)
  const availableSocials = SOCIAL_LINKS.filter(s => s.platform !== "Telegram");

  const sortedPortfolio = PORTFOLIO;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ['home', 'services', 'portfolio', 'about', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveTab(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger modern audio feedback whenever a major section transition completes
  useEffect(() => {
    try {
      const hasInitialLoad = sessionStorage.getItem('app-loaded');
      if (!hasInitialLoad) {
        sessionStorage.setItem('app-loaded', 'true');
        return;
      }
      playInteractionSound();
    } catch (e) {
      console.warn('sessionStorage is blocked or not available in this sandbox environment:', e);
    }
  }, [activeTab]);

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi, I'm ${formData.name}. %0AEmail: ${formData.email} %0A%0AProject Details: %0A${formData.message}`;
    window.open(`https://wa.me/${PERSONAL_INFO.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent selection:bg-[#00ff9d]/30 text-white">
      {/* Dynamic Sci-Fi Theme and Grid Background */}
      {/* Continuous Glow Styles for Logo */}
      <style>{`
        @keyframes header-logo-glow {
          0%, 100% {
            filter: drop-shadow(0 0 10px rgba(0, 255, 157, 0.45)) drop-shadow(0 0 18px rgba(6, 182, 212, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 18px rgba(0, 255, 157, 0.65)) drop-shadow(0 0 28px rgba(6, 182, 212, 0.45));
          }
        }
      `}</style>
      <SciFiBackground />

      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3 glass border-b border-white/5 shadow-xl backdrop-blur-3xl' : 'py-5 bg-transparent'}`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <a 
            href="#home" 
            className="flex flex-col items-center lg:items-start group cursor-pointer"
          >
            <MostoLogo />
            <p className="header-font text-[8px] font-bold text-white/50 mt-1 tracking-[0.5em] uppercase transition-colors group-hover:text-[#00ff9d] text-center lg:text-left pl-4">
              {PERSONAL_INFO.subtitle}
            </p>
          </a>
          
          <nav className="hidden lg:block ml-auto mr-12">
            <ul className="flex items-center gap-10 header-font text-[10px] font-bold uppercase tracking-widest">
              {['home', 'services', 'portfolio', 'about', 'contact'].map((item) => (
                <li key={item}>
                  <MagneticLink 
                    href={`#${item}`} 
                    active={activeTab === item}
                    activeClassName="text-[#00ff9d] glow-accent"
                    inactiveClassName="text-white/40 hover:text-[#00ff9d] aura-hover"
                  >
                    {item}
                  </MagneticLink>
                </li>
              ))}
            </ul>
          </nav>

          <RayButton 
            href={PERSONAL_INFO.mainPortfolio} 
            target="_blank" 
            className="hidden sm:inline-flex"
          >
            <span className="header-font px-6 py-2 text-[8px] font-black uppercase tracking-widest text-white leading-tight">
               ACCESS PORTFOLIO
            </span>
          </RayButton>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center pt-32 sm:pt-28 md:pt-24 pb-8 px-4 sm:px-6 text-center">
        <div 
          className="container mx-auto flex flex-col items-center transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1)"
          style={{
            opacity: revealStage >= 1 ? 1 : 0,
            transform: revealStage >= 1 ? 'translateY(0)' : 'translateY(30px)',
            willChange: 'opacity, transform'
          }}
        >
          {/* Tagline */}
          <div className="inline-block header-font px-8 py-2 rounded-full glass bg-white/[0.02] border border-white/10 mb-4 animate-subtle-float">
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] via-cyan-400 to-purple-500">
              {PERSONAL_INFO.tagline}
            </span>
          </div>
          
          {/* Auto-playing Showreel Replacement */}
          <VideoPlayer />

          {/* Description */}
          <p 
            className="max-w-4xl mx-auto text-base md:text-xl font-semibold tracking-tight mb-4 md:whitespace-nowrap transition-all duration-500 ease-out"
            style={{ 
              color: videoColor,
              textShadow: `0 0 20px ${videoColor}30`,
            }}
          >
            Advanced motion graphics and cinematic post-production for modern brands.
          </p>

          {/* Call to Action Group - Extremely Tight Spacing */}
          <div className="flex flex-col items-center gap-2">
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 justify-center header-font">
              <RayButton 
                href={PERSONAL_INFO.drivePortfolio} 
                target="_blank"
              >
                <span className="px-10 py-3 font-bold text-[11px] tracking-widest text-white leading-tight">
                  VIEW WORK
                </span>
              </RayButton>
              <RayButton 
                href="#contact"
              >
                <span className="px-10 py-3 font-bold text-[11px] tracking-widest text-white leading-tight">
                  GET IN TOUCH
                </span>
              </RayButton>
            </div>

            {/* Social Links - Colorful Borders */}
            <div className="flex flex-wrap justify-center gap-4">
              {availableSocials.map(s => (
                <RayButton 
                  key={s.platform} 
                  href={s.url} 
                  target="_blank" 
                  isIcon={true}
                  platform={s.platform}
                  className="w-12 h-12"
                >
                  {s.platform === 'Upwork' ? (
                    <svg className="w-5 h-5 fill-current text-white/70 group-hover:text-[#00ff9d] transition-all" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
                    </svg>
                  ) : (
                    <i className={`fab ${s.icon} text-lg text-white/70 group-hover:text-[#00ff9d] transition-all`}></i>
                  )}
                </RayButton>
              ))}
            </div>

            {/* Access Portfolio - Same tight gap */}
            <div>
              <RayButton 
                href={PERSONAL_INFO.mainPortfolio} 
                target="_blank"
              >
                <span className="px-8 py-2.5 text-[10px] font-black uppercase tracking-widest text-white leading-tight">
                  ACCESS PORTFOLIO
                </span>
              </RayButton>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-6">
        <ScrollReveal forceVisible={revealStage >= 2}>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="header-font text-[10px] font-bold text-white tracking-[1em] mb-4 uppercase opacity-100">Expertise</h2>
              <h3 className="header-font text-3xl md:text-5xl font-black text-white tracking-[0.3em] uppercase transition-all duration-500 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#00ff9d] hover:to-cyan-400 hover:scale-105 cursor-pointer select-none drop-shadow-[0_0_15px_rgba(0,255,157,0.3)]">Core Services</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
              {SERVICES.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  videoColor={videoColor} 
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Portfolio Showcase */}
      <section id="portfolio" className="py-16 px-6 bg-white/[0.001]">
        <ScrollReveal forceVisible={revealStage >= 3}>
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-8">
              <div>
                <h2 className="header-font text-[10px] font-bold text-[#00ff9d] tracking-[1em] mb-3 uppercase">Selected Work</h2>
                <GalleryTitle />
              </div>
              <a href={PERSONAL_INFO.drivePortfolio} target="_blank" className="aura-hover header-font text-gray-500 hover:text-white font-bold text-[11px] tracking-widest border-b border-white/10 pb-2 uppercase group transition-all">
                VIEW DRIVE ARCHIVE <i className="fas fa-arrow-right-long ml-4 transition-transform group-hover:translate-x-1"></i>
              </a>
            </div>

            {/* Upgraded Modular Sidebar Gallery */}
            <SidebarGallery />
          </div>
        </ScrollReveal>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Top Row: Name & Description */}
          <div className="mb-16">
            <div className="space-y-6 text-center lg:text-left">
              <div>
                <h2 className="header-font text-[11px] font-bold text-[#ffffff] tracking-[1em] mb-4 uppercase">The Producer</h2>
                <h3 className="header-font text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase leading-[1.1]">
                  <DynamicName />
                </h3>
              </div>

              <p className="text-gray-300 text-base md:text-lg leading-relaxed font-medium opacity-90 italic tracking-tight max-w-4xl mx-auto lg:mx-0">
                I have experience in Graphics Design, Motion Design & Video Editing helping businesses like yours. I'm excited about your project and confident I can deliver high-quality results that exceed your expectations. Let's work together to make this a success!
              </p>
            </div>
          </div>

          <ScrollReveal>
            {/* Second Row: Skills Column on Left, Testimonials next to it on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Skills Column (Left, spans 5 cols on desktop) */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h2 className="header-font text-[11px] font-bold scifi-text-mask tracking-[1em] mb-6 uppercase text-center lg:text-left">Skills & Expertise</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  {SKILLS.map((skill) => (
                    <SkillRow key={skill.name} skill={skill} />
                  ))}
                  
                  {/* Get CV embedded directly in the column with a playful cartoon pointing character and scaling pulse effects */}
                  <div className="flex items-center gap-3 w-full">
                    <CartoonCharacter />
                    <a 
                      href={PERSONAL_INFO.resumeUrl} 
                      target="_blank" 
                      className="flex-1 flex items-center gap-4 p-4 rounded-xl group transition-all duration-300 aura-hover bg-[#00ff9d]/5 border border-[#00ff9d]/20 hover:border-[#00ff9d] hover:bg-[#00ff9d]/10 hover:scale-[1.03] active:scale-95 relative overflow-hidden"
                      style={{
                        animation: 'cv-soft-pulse 3s infinite ease-in-out'
                      }}
                    >
                      {/* Self-contained keyframe animation for standard continuous button pulse shadow */}
                      <style>{`
                        @keyframes cv-soft-pulse {
                          0%, 100% {
                            box-shadow: 0 0 0 0 rgba(0, 255, 157, 0);
                          }
                          50% {
                            box-shadow: 0 0 15px 1px rgba(0, 255, 157, 0.12);
                          }
                        }
                      `}</style>
                      <div className="w-10 h-10 rounded-lg bg-[#00ff9d]/10 flex items-center justify-center transition-all group-hover:bg-[#00ff9d]/20 group-hover:scale-105 duration-300">
                        <i className="fas fa-file-pdf text-lg text-[#00ff9d] transition-transform group-hover:scale-110"></i>
                      </div>
                      <span className="header-font text-[10px] font-black text-[#00ff9d] group-hover:text-white uppercase tracking-widest transition-colors duration-300">
                        GET CV
                      </span>
                    </a>

                    {/* Subtle paper/document icon that gently floats or partially curls/unfurls with a smooth, continuous loop */}
                    <div className="relative w-12 h-12 flex items-center justify-center shrink-0 select-none" style={{ perspective: '1000px' }}>
                      <svg
                        width="32"
                        height="38"
                        viewBox="0 0 32 38"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          animation: 'doc-float-curl 4s ease-in-out infinite',
                          transformOrigin: 'bottom center',
                        }}
                      >
                        <style>{`
                          @keyframes doc-float-curl {
                            0%, 100% {
                              transform: translateY(0px) rotate(0deg) rotateY(0deg);
                              filter: drop-shadow(0 2px 4px rgba(0, 255, 157, 0.1));
                            }
                            50% {
                              transform: translateY(-6px) rotate(4deg) rotateY(-20deg);
                              filter: drop-shadow(0 12px 16px rgba(0, 255, 157, 0.35));
                            }
                          }
                          @keyframes corner-curl {
                            0%, 100% {
                              transform: scale(1);
                            }
                            50% {
                              transform: scale(1.25) translate(-0.5px, 0.5px);
                            }
                          }
                        `}</style>
                        <path
                          d="M2 2C2 0.895431 2.89543 0 4 0H20L30 10V36C30 37.1046 29.1046 38 28 38H4C2.89543 38 2 37.1046 2 36V2Z"
                          fill="rgba(0, 255, 157, 0.03)"
                          stroke="rgba(0, 255, 157, 0.25)"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M20 0V10H30"
                          stroke="rgba(0, 255, 157, 0.5)"
                          strokeWidth="1.5"
                          fill="rgba(0, 255, 157, 0.15)"
                          style={{
                            transformOrigin: '20px 10px',
                            animation: 'corner-curl 4s ease-in-out infinite',
                          }}
                        />
                        <line x1="6" y1="16" x2="26" y2="16" stroke="rgba(0, 255, 157, 0.4)" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="6" y1="22" x2="22" y2="22" stroke="rgba(0, 255, 157, 0.4)" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="6" y1="28" x2="18" y2="28" stroke="rgba(0, 255, 157, 0.3)" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="24" cy="28" r="2" fill="#00ff9d" className="animate-pulse" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonials Column (Right, spans 7 cols on desktop) */}
              <div className="lg:col-span-7 relative space-y-6">
                <div>
                  <h2 className="header-font text-[11px] font-bold text-[#00ff9d] tracking-[1em] mb-6 uppercase text-center lg:text-left">Testimonials</h2>
                </div>
                <div className="grid gap-6">
                  {REVIEWS.map((review, idx) => (
                    <TestimonialCard key={idx} review={review} />
                  ))}
                </div>
                
                <div className="mt-8 flex justify-center lg:justify-start">
                  <div className="px-6 py-3 rounded-full border border-[#00ff9d]/30 bg-[#00ff9d]/5 backdrop-blur-3xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse"></div>
                    <span className="header-font text-[10px] font-black text-[#00ff9d] uppercase tracking-widest">100% Project Success Rate</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-6">
        <ScrollReveal>
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="header-font text-[11px] font-bold text-[#00ff9d] tracking-[1em] mb-6 uppercase">Direct Bridge</h2>
                {/* START PROJECT - Two lines with two colors */}
                <StartProjectArea />
                
                <div className="space-y-8 mt-12">
                  <div className="flex gap-8 items-center group cursor-pointer aura-hover" onClick={() => window.location.href=`mailto:${PERSONAL_INFO.email}`}>
                    <div className="w-14 h-14 rounded-xl border border-white/10 flex items-center justify-center text-xl transition-all group-hover:border-white">
                      <i className="far fa-envelope"></i>
                    </div>
                    <div>
                      <h5 className="header-font text-[10px] font-bold text-white/20 mb-1 tracking-widest uppercase">Email Protocol</h5>
                      <p className="text-lg font-bold text-white group-hover:text-[#00ff9d] transition-all">{PERSONAL_INFO.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-8 items-center group cursor-pointer aura-hover" onClick={() => window.open(`https://wa.me/${PERSONAL_INFO.whatsappNumber}`, '_blank')}>
                    <div className="w-14 h-14 rounded-xl border border-white/10 flex items-center justify-center text-xl transition-all group-hover:border-white">
                      <i className="fab fa-whatsapp"></i>
                    </div>
                    <div>
                      <h5 className="header-font text-[10px] font-bold text-white/20 mb-1 tracking-widest uppercase">WhatsApp Direct</h5>
                      <p className="text-lg font-bold text-white group-hover:text-[#00ff9d] transition-all">{PERSONAL_INFO.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass p-12 rounded-[2.5rem] shadow-xl border border-white/5 relative overflow-hidden">
                <form className="space-y-6 relative z-10" onSubmit={handleInquiry}>
                  <div className="space-y-3">
                    <label className="header-font text-[10px] font-bold text-white/20 ml-6 uppercase tracking-widest">Identity</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="NAME / BRAND" className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-6 py-4 focus:outline-none focus:border-[#00ff9d]/20 transition-all font-bold text-[11px] text-white placeholder-white/65 placeholder:text-white/65 uppercase tracking-widest" />
                  </div>
                  <div className="space-y-3">
                    <label className="header-font text-[10px] font-bold text-white/20 ml-6 uppercase tracking-widest">Return Channel</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="EMAIL ADDRESS" className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-6 py-4 focus:outline-none focus:border-[#00ff9d]/20 transition-all font-bold text-[11px] text-white placeholder-white/65 placeholder:text-white/65 uppercase tracking-widest" />
                  </div>
                  <div className="space-y-3">
                    <label className="header-font text-[10px] font-bold text-white/20 ml-6 uppercase tracking-widest">Mission Details</label>
                    <textarea rows={4} required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder="DESCRIBE YOUR CREATIVE VISION" className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-6 py-8 focus:outline-none focus:border-[#00ff9d]/20 transition-all font-bold text-[11px] text-white placeholder-white/65 placeholder:text-white/65 resize-none uppercase tracking-widest"></textarea>
                  </div>
                  <button type="submit" className="glass-btn w-full text-white py-4 rounded-xl font-bold header-font tracking-widest text-[13px] aura-hover shadow-lg hover:border-[#00ff9d] uppercase transition-all">
                    SEND MESSAGE
                  </button>
                </form>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5 text-center bg-white/[0.01]">
        <div className="container mx-auto px-6">
          <div className="mb-12 flex justify-center">
            <MostoLogo isFooter={true} />
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {availableSocials.map(s => (
              <a 
                key={s.platform} 
                href={s.url} 
                target="_blank" 
                title={s.platform}
                className={`glass-btn flex items-center justify-center w-11 h-11 rounded-full border transition-all aura-hover text-white/60 hover:text-[#00ff9d] hover:scale-110
                  ${s.platform === 'LinkedIn' ? 'border-blue-500/30' : 
                    s.platform === 'YouTube' ? 'border-red-500/30' : 
                    s.platform === 'Behance' ? 'border-cyan-400/30' : 
                    s.platform === 'Upwork' ? 'border-emerald-500/30 hover:border-emerald-400' : 
                    'border-purple-500/30'}`}
              >
                {s.platform === 'Upwork' ? (
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
                  </svg>
                ) : (
                  <i className={`fab ${s.icon} text-base`}></i>
                )}
              </a>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs font-mono">
            <p className="header-font text-[10px] text-white/30 font-bold tracking-[2em] select-none uppercase">
              &copy; {new Date().getFullYear()} {PERSONAL_INFO.brand}
            </p>
            <span className="hidden sm:inline text-white/20">•</span>
            <button
              onClick={() => navigate('/admin')}
              className="text-[11px] font-mono text-white/40 hover:text-[#00ff9d] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <i className="fas fa-lock text-[9px]"></i>
              <span>CMS Admin Portal</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Floating CMS Portal Launcher Button (Bottom Left) */}
      <button
        onClick={() => navigate('/admin')}
        className="fixed bottom-6 left-6 z-40 glass px-3.5 py-2.5 rounded-2xl border border-white/10 hover:border-[#00ff9d]/50 text-white/70 hover:text-[#00ff9d] text-xs font-mono flex items-center gap-2.5 shadow-2xl backdrop-blur-xl transition-all cursor-pointer group hover:scale-105 active:scale-95"
        title="Open CMS Admin Dashboard"
      >
        <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse"></span>
        <i className="fas fa-sliders text-xs text-[#00ff9d] group-hover:rotate-45 transition-transform"></i>
        <span className="font-bold tracking-wider uppercase text-[10px]">CMS Portal</span>
      </button>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        back-to-top-button-selector=""
        className={`fixed z-[60] flex items-center justify-center w-14 h-14 rounded-full glass border transition-all duration-500 cursor-pointer ${
          scrolled ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        } hover:scale-110 active:scale-95 group shadow-lg`}
        style={{
          borderColor: scrolled ? `${videoColor}40` : 'rgba(255,255,255,0.1)',
          boxShadow: scrolled ? `0 0 25px ${videoColor}20` : 'none',
          bottom: '96px',
          right: isChatOpen ? (windowWidth < 768 ? '356px' : '420px') : '24px',
        }}
        title="Back to Top"
        aria-label="Back to top of the page"
      >
        <i 
          className="fas fa-chevron-up text-lg transition-transform duration-300 group-hover:-translate-y-1" 
          style={{ color: videoColor }}
        ></i>
      </button>

      <AIChatAssistant />
      <CustomCursor />
      <Preloader onComplete={handlePreloaderComplete} />
    </div>
  );
};

const AppRouter: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const { role, isLoading } = useAuth();

  if (currentPath.startsWith('/admin')) {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-[#020205] text-white flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#00ff9d] border-t-transparent animate-spin" />
          <p className="font-mono text-xs text-white/50 tracking-widest uppercase">
            Verifying Authorization...
          </p>
        </div>
      );
    }

    if (!role) {
      return <AdminLogin onBackToPublic={() => navigate('/')} />;
    }

    if (role === 'moderator') {
      return <ModeratorDashboard onBackToPublic={() => navigate('/')} />;
    }

    return <AdminLayout onBackToPublic={() => navigate('/')} />;
  }

  return <PublicWebsite />;
};

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <CMSDataProvider>
          <AppRouter />
        </CMSDataProvider>
      </AuthProvider>
    </RouterProvider>
  );
}