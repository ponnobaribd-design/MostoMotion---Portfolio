import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSDataContext';
import OverviewTab from './OverviewTab';
import ProjectManagerTab from './ProjectManagerTab';
import CategoryManagerTab from './CategoryManagerTab';
import SubmissionsTab from './SubmissionsTab';
import MediaManagerTab from './MediaManagerTab';
import SettingsTab from './SettingsTab';

interface AdminLayoutProps {
  onBackToPublic: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToPublic }) => {
  const { profile, signOut } = useAuth();
  const { pendingProjects } = useCMS();
  const [activeTab, setActiveTab] = useState<string>('overview');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'fa-gauge' },
    { id: 'projects', label: 'Projects', icon: 'fa-film' },
    { id: 'categories', label: 'Categories', icon: 'fa-folder-tree' },
    {
      id: 'submissions',
      label: 'Submissions',
      icon: 'fa-bell',
      badge: pendingProjects.length > 0 ? pendingProjects.length : undefined,
    },
    { id: 'media', label: 'Media Tester', icon: 'fa-photo-film' },
    { id: 'settings', label: 'Settings', icon: 'fa-gear' },
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col">
      {/* Top Cyber Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#020205]/85 backdrop-blur-2xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToPublic}
            className="glass-btn flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono text-white/70 hover:text-white border-white/10 hover:border-[#00ff9d]/30 transition-all cursor-pointer"
          >
            <i className="fas fa-arrow-left text-[10px]"></i>
            <span className="hidden sm:inline">Public Portfolio</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse"></span>
            <h1 className="header-font text-base font-black tracking-wider uppercase text-white">
              MOSTO MOTION <span className="text-[#00ff9d]">CMS</span>
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/30 text-[9px] font-mono font-bold uppercase tracking-wider">
              ADMIN
            </span>
          </div>
        </div>

        {/* Right profile info & logout */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-white text-xs font-mono font-medium">
              {profile?.email || 'admin@mostomotion.com'}
            </span>
            <span className="text-[10px] text-white/40 font-mono">
              Role-Based Access: Super Admin
            </span>
          </div>

          <button
            onClick={signOut}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 text-xs font-mono transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Horizontal Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#00ff9d]/20 to-cyan-500/20 text-[#00ff9d] border border-[#00ff9d]/40 shadow-[0_0_15px_rgba(0,255,157,0.2)]'
                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <i className={`fas ${item.icon} text-xs`}></i>
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-black text-[10px] font-black flex items-center justify-center animate-bounce">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tab View */}
        <main>
          {activeTab === 'overview' && (
            <OverviewTab
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenNewProjectModal={() => setActiveTab('projects')}
            />
          )}
          {activeTab === 'projects' && <ProjectManagerTab />}
          {activeTab === 'categories' && <CategoryManagerTab />}
          {activeTab === 'submissions' && <SubmissionsTab />}
          {activeTab === 'media' && <MediaManagerTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
