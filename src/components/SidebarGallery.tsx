import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MediaCategory,
  SubCategory,
  GalleryMediaItem,
} from '../types/gallery';
import { GALLERY_CATEGORIES, GALLERY_ITEMS } from './galleryData';
import VideoCard from './VideoCard';
import { useCMS } from '../context/CMSDataContext';

interface SidebarGalleryProps {
  initialCategory?: MediaCategory | 'All';
  initialSubCategory?: SubCategory | 'All';
}

export const SidebarGallery: React.FC<SidebarGalleryProps> = ({
  initialCategory = 'All',
  initialSubCategory = 'All',
}) => {
  const { publishedProjects, categories: cmsCategories } = useCMS();

  // Selected category and sub-category
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory | 'All'>(initialCategory);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | 'All'>(initialSubCategory);
  
  // Format filter: 'all' | '16:9' | '9:16'
  const [formatFilter, setFormatFilter] = useState<'all' | '16:9' | '9:16'>('all');

  // Featured toggle: default to true on initial gallery load
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(true);

  // Default state: ALL categories are open (collapsible accordion)
  const [openAccordions, setOpenAccordions] = useState<Record<MediaCategory, boolean>>({
    'Motion Graphics': true,
    'Video Editing': true,
    'Graphic Design': true,
  });

  // Modal active item
  const [activeModalItem, setActiveModalItem] = useState<GalleryMediaItem | null>(null);

  // Mobile sidebar drawer open/close
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Dynamically bridge CMS published projects to GalleryMediaItem format
  const dynamicItems: (GalleryMediaItem & { isFeatured?: boolean })[] = useMemo(() => {
    if (publishedProjects && publishedProjects.length > 0) {
      return publishedProjects.map((p) => {
        let parentCatName: MediaCategory = 'Motion Graphics';
        let subCatName: SubCategory = 'Restaurant Ads';

        // Match against CMS categories
        for (const cat of cmsCategories) {
          const foundSub = cat.subcategories?.find(
            (s) => s.id === p.category_id || s.name === p.category_id
          );
          if (foundSub) {
            parentCatName = cat.name as MediaCategory;
            subCatName = foundSub.name as SubCategory;
            break;
          }
        }

        const isVertical = p.aspect_ratio === '9:16';

        return {
          id: p.id,
          title: p.title,
          category: parentCatName,
          subCategory: subCatName,
          orientation: isVertical ? 'vertical' : 'horizontal',
          aspectRatio: isVertical ? '9:16' : '16:9',
          videoUrl: p.media_url,
          thumbnail: p.poster_url || p.media_url,
          description: p.description || undefined,
          client: 'Client Showcase',
          year: '2026',
          metrics: p.is_featured ? 'Featured Work' : undefined,
          isFeatured: p.is_featured,
        };
      });
    }

    // Fallback to initial curated gallery items with first 6 as featured
    return GALLERY_ITEMS.map((item, idx) => ({
      ...item,
      isFeatured: idx < 6,
    }));
  }, [publishedProjects, cmsCategories]);

  // Toggle individual category accordion
  const toggleAccordion = (cat: MediaCategory) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  // Select all works
  const handleSelectAll = () => {
    setSelectedCategory('All');
    setSelectedSubCategory('All');
    setFeaturedOnly(false);
    setMobileDrawerOpen(false);
  };

  // Select a parent category
  const handleSelectCategory = (cat: MediaCategory) => {
    setSelectedCategory(cat);
    setSelectedSubCategory('All');
    setFeaturedOnly(false);
    setMobileDrawerOpen(false);
  };

  // Select a specific sub-category
  const handleSelectSubCategory = (cat: MediaCategory, sub: SubCategory) => {
    setSelectedCategory(cat);
    setSelectedSubCategory(sub);
    setFeaturedOnly(false);
    setMobileDrawerOpen(false);
  };

  // Filter items based on active criteria
  const filteredItems = useMemo(() => {
    return dynamicItems.filter((item) => {
      // If in initial load and featuredOnly is active, show only featured
      if (featuredOnly && selectedCategory === 'All' && selectedSubCategory === 'All') {
        if (!item.isFeatured) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Sub-category filter
      if (selectedSubCategory !== 'All' && item.subCategory !== selectedSubCategory) {
        return false;
      }
      // Aspect ratio / Format filter
      if (formatFilter !== 'all') {
        if (formatFilter === '16:9' && item.orientation !== 'horizontal') return false;
        if (formatFilter === '9:16' && item.orientation !== 'vertical') return false;
      }
      return true;
    });
  }, [dynamicItems, selectedCategory, selectedSubCategory, formatFilter, featuredOnly]);

  // Count items per category/subcategory
  const counts = useMemo(() => {
    const total = dynamicItems.length;
    const catCounts: Record<string, number> = {};
    const subCounts: Record<string, number> = {};

    GALLERY_CATEGORIES.forEach((cat) => {
      catCounts[cat.category] = dynamicItems.filter((i) => i.category === cat.category).length;
      cat.subCategories.forEach((sub) => {
        subCounts[`${cat.category}-${sub}`] = dynamicItems.filter(
          (i) => i.category === cat.category && i.subCategory === sub
        ).length;
      });
    });

    return { total, catCounts, subCounts };
  }, [dynamicItems]);

  return (
    <div className="w-full relative">
      {/* Top Filter Bar: Mobile Trigger & Format Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle Button */}
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="lg:hidden glass-btn flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold header-font text-[#00ff9d] border-[#00ff9d]/30 cursor-pointer"
          >
            <i className="fas fa-sliders text-sm"></i>
            <span>CATEGORIES</span>
            <span className="w-5 h-5 rounded-full bg-[#00ff9d]/20 text-[#00ff9d] text-[10px] flex items-center justify-center font-mono">
              {filteredItems.length}
            </span>
          </button>

          {/* Active Filter Breadcrumbs & Featured Indicator */}
          <div className="flex items-center gap-2 text-xs header-font">
            <span className="text-white/40 uppercase tracking-widest hidden sm:inline">Active:</span>
            {featuredOnly && selectedCategory === 'All' && selectedSubCategory === 'All' ? (
              <span className="text-[#00ff9d] font-bold flex items-center gap-1.5">
                <i className="fas fa-star text-[10px]"></i>
                Featured Projects Showcase
              </span>
            ) : (
              <span className="text-[#00ff9d] font-bold">
                {selectedCategory === 'All' ? 'All Collections' : selectedCategory}
              </span>
            )}

            {selectedSubCategory !== 'All' && (
              <>
                <span className="text-white/30">/</span>
                <span className="text-cyan-400 font-bold">{selectedSubCategory}</span>
              </>
            )}

            {(selectedCategory !== 'All' || selectedSubCategory !== 'All' || formatFilter !== 'all' || !featuredOnly) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedSubCategory('All');
                  setFormatFilter('all');
                  setFeaturedOnly(true);
                }}
                className="ml-2 text-[10px] text-white/40 hover:text-white underline tracking-wider uppercase transition-colors cursor-pointer"
              >
                Reset to Featured
              </button>
            )}
          </div>
        </div>

        {/* Format Selector Pills (All / 16:9 / 9:16) */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl glass border border-white/10 text-xs">
          <button
            onClick={() => setFormatFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold transition-all cursor-pointer ${
              formatFilter === 'all'
                ? 'bg-[#00ff9d] text-black shadow-[0_0_15px_rgba(0,255,157,0.4)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            All Formats
          </button>
          <button
            onClick={() => setFormatFilter('16:9')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              formatFilter === '16:9'
                ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <i className="fas fa-desktop text-[9px]"></i>
            16:9 Horizontal
          </button>
          <button
            onClick={() => setFormatFilter('9:16')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              formatFilter === '9:16'
                ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <i className="fas fa-mobile-screen text-[9px]"></i>
            9:16 Vertical
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ===================== SIDEBAR (LEFT) ===================== */}
        <aside
          className={`lg:col-span-4 xl:col-span-3 lg:sticky lg:top-28 z-30 space-y-4 ${
            mobileDrawerOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="glass p-5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-2xl">
            {/* Header: All Works Button */}
            <button
              onClick={handleSelectAll}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl font-bold header-font text-xs tracking-widest uppercase transition-all mb-4 cursor-pointer ${
                selectedCategory === 'All' && selectedSubCategory === 'All' && !featuredOnly
                  ? 'bg-gradient-to-r from-[#00ff9d]/20 to-cyan-500/20 text-[#00ff9d] border border-[#00ff9d]/40 shadow-[0_0_20px_rgba(0,255,157,0.15)]'
                  : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <i className="fas fa-border-all text-[#00ff9d]"></i>
                <span>ALL WORKS</span>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                {counts.total}
              </span>
            </button>

            {/* Accordion Categories in EXACT Specified Order */}
            <div className="space-y-3">
              {GALLERY_CATEGORIES.map((catGroup) => {
                const isOpen = openAccordions[catGroup.category];
                const isCatActive = selectedCategory === catGroup.category;

                return (
                  <div
                    key={catGroup.category}
                    className="border border-white/5 rounded-xl overflow-hidden bg-black/30 transition-colors hover:border-white/15"
                  >
                    {/* Category Accordion Header */}
                    <div
                      className={`flex items-center justify-between p-3 cursor-pointer select-none transition-colors ${
                        isCatActive ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'
                      }`}
                      onClick={() => toggleAccordion(catGroup.category)}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectCategory(catGroup.category);
                        }}
                        className="flex items-center gap-2.5 text-left flex-1 group cursor-pointer"
                      >
                        <i
                          className={`fas ${catGroup.icon} text-xs transition-colors ${
                            isCatActive ? 'text-[#00ff9d]' : 'text-white/40 group-hover:text-white'
                          }`}
                        ></i>
                        <span
                          className={`header-font text-xs font-bold tracking-wider uppercase transition-colors ${
                            isCatActive ? 'text-[#00ff9d]' : 'text-white/90 group-hover:text-[#00ff9d]'
                          }`}
                        >
                          {catGroup.category}
                        </span>
                      </button>

                      {/* Right side: Count & Collapse Chevron */}
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-white/40">
                          {counts.catCounts[catGroup.category] || 0}
                        </span>
                        <motion.button
                          type="button"
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="w-6 h-6 flex items-center justify-center text-white/40 hover:text-white cursor-pointer"
                          aria-label={`Toggle ${catGroup.category} menu`}
                        >
                          <i className="fas fa-chevron-down text-[10px]"></i>
                        </motion.button>
                      </div>
                    </div>

                    {/* Sub-Category List (Collapsible) */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden border-t border-white/5 bg-black/40"
                        >
                          <ul className="py-2 px-1.5 space-y-1">
                            {catGroup.subCategories.map((subName) => {
                              const isSubActive =
                                selectedCategory === catGroup.category && selectedSubCategory === subName;
                              const subCount =
                                counts.subCounts[`${catGroup.category}-${subName}`] || 0;

                              return (
                                <li key={subName}>
                                  <button
                                    onClick={() => handleSelectSubCategory(catGroup.category, subName)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all text-left group cursor-pointer ${
                                      isSubActive
                                        ? 'bg-[#00ff9d]/15 text-[#00ff9d] font-bold border border-[#00ff9d]/30 shadow-[0_0_12px_rgba(0,255,157,0.15)] pl-4'
                                        : 'text-white/60 hover:text-white hover:bg-white/5 font-medium'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                                          isSubActive
                                            ? 'bg-[#00ff9d] scale-125 shadow-[0_0_8px_#00ff9d]'
                                            : 'bg-white/20 group-hover:bg-white/50'
                                        }`}
                                      />
                                      <span className="tracking-wide text-[11px]">{subName}</span>
                                    </div>
                                    <span
                                      className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${
                                        isSubActive
                                          ? 'bg-[#00ff9d]/20 text-[#00ff9d]'
                                          : 'text-white/30 group-hover:text-white/60'
                                      }`}
                                    >
                                      {subCount}
                                    </span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Quick Spec Footnote */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-white/30">
              <span>DYNAMIC CMS</span>
              <span className="text-[#00ff9d] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse"></span>
                AUTOPLAY IN-VIEW
              </span>
            </div>
          </div>
        </aside>

        {/* ===================== GALLERY GRID (RIGHT) ===================== */}
        <main className="lg:col-span-8 xl:col-span-9">
          {filteredItems.length === 0 ? (
            <div className="glass p-16 rounded-3xl border border-white/10 text-center space-y-4">
              <i className="fas fa-film text-4xl text-white/20"></i>
              <h3 className="header-font text-lg font-bold text-white uppercase tracking-wider">
                No Projects Found In This Category
              </h3>
              <p className="text-white/50 text-xs max-w-md mx-auto">
                Select a different category or click below to view all portfolio showcases.
              </p>
              <button
                onClick={handleSelectAll}
                className="glass-btn px-6 py-2.5 rounded-xl text-xs font-bold text-[#00ff9d] uppercase tracking-widest mt-2 cursor-pointer"
              >
                Show All Works
              </button>
            </div>
          ) : (
            /* Framer Motion layout grid */
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    layoutId={item.id}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="w-full"
                  >
                    <VideoCard item={item} onOpenModal={(it) => setActiveModalItem(it)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </div>

      {/* Pop-up Media Detail Modal */}
      <AnimatePresence>
        {activeModalItem && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-xl animate-in fade-in">
            <div
              className="absolute inset-0"
              onClick={() => setActiveModalItem(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className={`relative z-10 w-full glass rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col ${
                activeModalItem.orientation === 'vertical' ? 'max-w-xl' : 'max-w-4xl'
              }`}
            >
              {/* Modal Top Bar */}
              <div className="p-4 bg-black/60 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse"></span>
                  <span className="header-font text-xs font-bold text-white tracking-widest uppercase">
                    {activeModalItem.category} / {activeModalItem.subCategory}
                  </span>
                </div>
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              </div>

              {/* Modal Media Showcase */}
              <div className="relative bg-black flex items-center justify-center overflow-hidden">
                {activeModalItem.videoUrl ? (
                  <video
                    src={activeModalItem.videoUrl}
                    poster={activeModalItem.thumbnail}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className={`w-full max-h-[60vh] object-contain ${
                      activeModalItem.orientation === 'vertical' ? 'aspect-[9/16]' : 'aspect-video'
                    }`}
                  />
                ) : (
                  <img
                    src={activeModalItem.thumbnail}
                    alt={activeModalItem.title}
                    className="w-full max-h-[60vh] object-contain"
                  />
                )}
              </div>

              {/* Modal Information Footer */}
              <div className="p-6 bg-[#030308] border-t border-white/10 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="header-font text-xl md:text-2xl font-black text-white">
                      {activeModalItem.title}
                    </h3>
                    {activeModalItem.client && (
                      <p className="text-white/60 text-xs mt-1">
                        Client: <span className="text-[#00ff9d] font-bold">{activeModalItem.client}</span> ({activeModalItem.year || '2026'})
                      </p>
                    )}
                  </div>

                  {activeModalItem.youtubeId && (
                    <a
                      href={`https://www.youtube.com/watch?v=${activeModalItem.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-btn flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold header-font text-white hover:text-[#00ff9d] border-red-500/30 shrink-0 uppercase tracking-widest"
                    >
                      <i className="fab fa-youtube text-red-500 text-sm"></i>
                      Watch on YouTube
                    </a>
                  )}
                </div>

                {activeModalItem.description && (
                  <p className="text-white/70 text-xs leading-relaxed">
                    {activeModalItem.description}
                  </p>
                )}

                {/* Performance Badge */}
                {activeModalItem.metrics && (
                  <div className="pt-2 border-t border-white/5">
                    <span className="font-mono text-xs text-[#00ff9d] font-bold">
                      {activeModalItem.metrics}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SidebarGallery;
