import React from 'react';
import { useCMS } from '../../context/CMSDataContext';
import { useAuth } from '../../context/AuthContext';

interface OverviewTabProps {
  onNavigateTab: (tab: string) => void;
  onOpenNewProjectModal: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigateTab, onOpenNewProjectModal }) => {
  const { projects, categories, pendingProjects, publishedProjects } = useCMS();
  const { isConfigured } = useAuth();

  const draftCount = projects.filter((p) => p.status === 'draft').length;
  const featuredCount = projects.filter((p) => p.is_featured).length;

  const totalCategoriesCount = categories.reduce(
    (acc, cat) => acc + 1 + (cat.subcategories?.length || 0),
    0
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner with Quick Actions */}
      <div className="glass p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse"></span>
            <span className="text-[10px] font-mono text-[#00ff9d] uppercase tracking-widest font-bold">
              SYSTEM ONLINE
            </span>
          </div>
          <h2 className="header-font text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
            Portfolio CMS Dashboard
          </h2>
          <p className="text-white/60 text-xs leading-relaxed font-sans">
            Manage public portfolio works, curate featured showcases, organize category hierarchies, and review moderator project submissions in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={onOpenNewProjectModal}
            className="py-3 px-5 rounded-xl bg-gradient-to-r from-[#00ff9d] to-cyan-400 text-black font-bold header-font text-xs tracking-wider uppercase flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,255,157,0.3)] transition-all cursor-pointer"
          >
            <i className="fas fa-plus"></i>
            <span>Add Project</span>
          </button>
          {pendingProjects.length > 0 && (
            <button
              onClick={() => onNavigateTab('submissions')}
              className="py-3 px-5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold header-font text-xs tracking-wider uppercase flex items-center gap-2 hover:bg-amber-500/30 transition-all cursor-pointer"
            >
              <i className="fas fa-bell animate-bounce text-amber-400"></i>
              <span>{pendingProjects.length} Pending Submissions</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Projects */}
        <div className="glass p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-white/40 text-xs">
            <span className="font-mono uppercase tracking-wider text-[10px]">Total Works</span>
            <i className="fas fa-film text-sm text-[#00ff9d]"></i>
          </div>
          <p className="header-font text-3xl font-black text-white">{projects.length}</p>
          <p className="text-[10px] font-mono text-white/40">{featuredCount} marked featured</p>
        </div>

        {/* Published Projects */}
        <div className="glass p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-white/40 text-xs">
            <span className="font-mono uppercase tracking-wider text-[10px]">Published</span>
            <i className="fas fa-globe text-sm text-cyan-400"></i>
          </div>
          <p className="header-font text-3xl font-black text-cyan-400">{publishedProjects.length}</p>
          <p className="text-[10px] font-mono text-white/40">Visible to public</p>
        </div>

        {/* Pending Submissions */}
        <div className="glass p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-white/40 text-xs">
            <span className="font-mono uppercase tracking-wider text-[10px]">Submissions</span>
            <i className="fas fa-clock text-sm text-amber-400"></i>
          </div>
          <p className="header-font text-3xl font-black text-amber-400">{pendingProjects.length}</p>
          <p className="text-[10px] font-mono text-white/40">Requires review</p>
        </div>

        {/* Draft Projects */}
        <div className="glass p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-white/40 text-xs">
            <span className="font-mono uppercase tracking-wider text-[10px]">Drafts</span>
            <i className="fas fa-file-lines text-sm text-purple-400"></i>
          </div>
          <p className="header-font text-3xl font-black text-purple-400">{draftCount}</p>
          <p className="text-[10px] font-mono text-white/40">Unpublished</p>
        </div>

        {/* Total Categories */}
        <div className="glass p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-white/40 text-xs">
            <span className="font-mono uppercase tracking-wider text-[10px]">Taxonomies</span>
            <i className="fas fa-folder-tree text-sm text-emerald-400"></i>
          </div>
          <p className="header-font text-3xl font-black text-emerald-400">{totalCategoriesCount}</p>
          <p className="text-[10px] font-mono text-white/40">{categories.length} main groups</p>
        </div>
      </div>

      {/* Supabase Integration Diagnostics Banner */}
      <div className="glass p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isConfigured
                ? 'bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/30'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
            }`}
          >
            <i className={`fas ${isConfigured ? 'fa-database' : 'fa-info'} text-sm`}></i>
          </div>
          <div>
            <h4 className="header-font text-xs font-bold text-white uppercase tracking-wider">
              {isConfigured ? 'Supabase Database Connected' : 'Supabase Integration Ready'}
            </h4>
            <p className="text-white/50 text-[11px] font-mono mt-0.5">
              {isConfigured
                ? 'Connected to live PostgreSQL instance with Row Level Security enforcement.'
                : 'Interactive sandbox mode is active. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to link live database.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('settings')}
          className="glass-btn px-4 py-2 rounded-xl text-xs font-mono text-white/80 hover:text-white shrink-0 self-start md:self-auto cursor-pointer"
        >
          View Setup Details <i className="fas fa-arrow-right text-[10px] ml-1"></i>
        </button>
      </div>

      {/* Recent Projects Table Preview */}
      <div className="glass p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fas fa-layer-group text-xs text-[#00ff9d]"></i>
            <h3 className="header-font text-sm font-bold text-white uppercase tracking-wider">
              Recent Projects Showcase
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('projects')}
            className="text-xs font-mono text-[#00ff9d] hover:underline"
          >
            View All ({projects.length}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-white/40 uppercase text-[10px]">
                <th className="pb-3 font-semibold">Project Title</th>
                <th className="pb-3 font-semibold">Media Type</th>
                <th className="pb-3 font-semibold">Ratio</th>
                <th className="pb-3 font-semibold">Featured</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.slice(0, 5).map((project) => (
                <tr key={project.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4 font-sans font-medium text-white flex items-center gap-3">
                    <img
                      src={project.poster_url || project.media_url}
                      alt={project.title}
                      className="w-8 h-8 rounded-lg object-cover shrink-0 bg-zinc-900 border border-white/10"
                    />
                    <span className="truncate max-w-xs">{project.title}</span>
                  </td>
                  <td className="py-3 pr-4 text-white/60 uppercase text-[10px]">
                    {project.source_type}
                  </td>
                  <td className="py-3 pr-4 text-white/60 text-[10px]">
                    {project.aspect_ratio}
                  </td>
                  <td className="py-3 pr-4">
                    {project.is_featured ? (
                      <span className="text-[#00ff9d] text-xs">
                        <i className="fas fa-star"></i>
                      </span>
                    ) : (
                      <span className="text-white/20 text-xs">
                        <i className="far fa-star"></i>
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        project.status === 'published'
                          ? 'bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/30'
                          : project.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : project.status === 'rejected'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-white/10 text-white/60 border border-white/15'
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
