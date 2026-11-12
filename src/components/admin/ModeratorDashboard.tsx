import React, { useState, useMemo } from 'react';
import { useCMS } from '../../context/CMSDataContext';
import { useAuth } from '../../context/AuthContext';
import { CMSAspectRatio, Project, MediaType } from '../../types/cms';
import { parseMediaUrl } from '../../lib/mediaAdapter';

interface ModeratorDashboardProps {
  onBackToPublic: () => void;
}

export const ModeratorDashboard: React.FC<ModeratorDashboardProps> = ({ onBackToPublic }) => {
  const { user, profile, signOut } = useAuth();
  const { categories, projects, createProject } = useCMS();

  const [activeTab, setActiveTab] = useState<'upload' | 'submissions'>('upload');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSubId, setSelectedSubId] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [aspectRatio, setAspectRatio] = useState<CMSAspectRatio>('16:9');
  const [mediaType, setMediaType] = useState<MediaType>('video');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [viewingFeedback, setViewingFeedback] = useState<Project | null>(null);

  // Flatten subcategories
  const flatSubcategories = useMemo(() => {
    const list: { id: string; name: string; parentName: string }[] = [];
    categories.forEach((cat) => {
      cat.subcategories?.forEach((sub) => {
        list.push({
          id: sub.id,
          name: sub.name,
          parentName: cat.name,
        });
      });
    });
    return list;
  }, [categories]);

  // Set default category
  React.useEffect(() => {
    if (!selectedSubId && flatSubcategories.length > 0) {
      setSelectedSubId(flatSubcategories[0].id);
    }
  }, [flatSubcategories, selectedSubId]);

  // Filter only submissions by current moderator
  const mySubmissions = useMemo(() => {
    const currentId = user?.id || profile?.id;
    return projects.filter(
      (p) => p.submitted_by === currentId || p.submitted_by === 'demo-moderator-uuid-0002'
    );
  }, [projects, user, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !mediaUrl.trim() || !selectedSubId) {
      setErrorMessage('Please fill in all required fields (title, category, and media URL).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Strictly enforced on client and Supabase RLS: status: 'pending', is_published: false
      const res = await createProject({
        title,
        description,
        category_id: selectedSubId,
        media_url: mediaUrl,
        poster_url: posterUrl || null,
        aspect_ratio: aspectRatio,
        media_type: mediaType,
      });

      if (!res.success) {
        throw new Error(res.error || 'Failed to submit project');
      }

      setFeedbackSuccess(true);
      setTitle('');
      setDescription('');
      setMediaUrl('');
      setPosterUrl('');
      setActiveTab('submissions');
      setTimeout(() => setFeedbackSuccess(false), 5000);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const parsedMedia = parseMediaUrl(mediaUrl);

  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#020205]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToPublic}
            className="glass-btn flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono text-white/70 hover:text-white border-white/10"
          >
            <i className="fas fa-arrow-left text-[10px]"></i>
            <span className="hidden sm:inline">Portfolio</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <h1 className="header-font text-base font-black tracking-wider uppercase text-white">
              Moderator Portal
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px] font-mono font-bold uppercase">
              MODERATOR
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-white/40 text-xs font-mono hidden md:inline">
            {profile?.email || 'moderator@mostomotion.com'}
          </span>
          <button
            onClick={signOut}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 text-xs font-mono transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-5 py-2.5 rounded-xl header-font text-xs font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'bg-gradient-to-r from-cyan-400 to-[#00ff9d] text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className="fas fa-cloud-arrow-up text-xs"></i>
            <span>Upload New Project</span>
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-5 py-2.5 rounded-xl header-font text-xs font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'submissions'
                ? 'bg-gradient-to-r from-cyan-400 to-[#00ff9d] text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className="fas fa-list-check text-xs"></i>
            <span>My Submissions ({mySubmissions.length})</span>
          </button>
        </div>

        {feedbackSuccess && (
          <div className="p-4 rounded-2xl bg-[#00ff9d]/10 border border-[#00ff9d]/30 text-[#00ff9d] text-xs font-mono flex items-center gap-3">
            <i className="fas fa-check-circle text-lg"></i>
            <div>
              <p className="font-bold">Project Submitted Successfully!</p>
              <p className="text-[11px] text-[#00ff9d]/80 mt-0.5">
                Your upload is now in the <strong>PENDING</strong> approval queue. An administrator will review and publish it.
              </p>
            </div>
          </div>
        )}

        {/* Tab 1: Upload Form */}
        {activeTab === 'upload' && (
          <div className="glass p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
            <div>
              <h2 className="header-font text-xl font-bold text-white uppercase tracking-wider">
                Submit Project For Curation
              </h2>
              <p className="text-white/50 text-xs font-mono mt-1">
                All submissions enter the pending review queue. You cannot publish projects directly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-medium text-white/70 uppercase mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Modern Minimalist Real Estate Promo"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-white/70 uppercase mb-1">
                    Target Sub-Category *
                  </label>
                  <select
                    value={selectedSubId}
                    onChange={(e) => setSelectedSubId(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  >
                    {flatSubcategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.parentName} → {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-white/70 uppercase mb-1">
                    Media Type
                  </label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value as MediaType)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="video">Video (MP4 / YouTube / Vimeo)</option>
                    <option value="image">Static Graphic / Thumbnail</option>
                    <option value="embed">Embed Stream</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-white/70 uppercase mb-1">
                  External Media URL *
                </label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://..."
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-cyan-400"
                />
                {parsedMedia.isValid && (
                  <p className="text-[10px] text-cyan-400 font-mono mt-1">
                    Detected source: {parsedMedia.sourceType.toUpperCase()}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-white/70 uppercase mb-1">
                  Thumbnail / Poster URL
                </label>
                <input
                  type="url"
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-white/70 uppercase mb-1">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['16:9', '9:16', '1:1', '4:5'] as CMSAspectRatio[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setAspectRatio(r)}
                      className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                        aspectRatio === r
                          ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300'
                          : 'border-white/10 bg-black/30 text-white/60 hover:text-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-white/70 uppercase mb-1">
                  Project Description & Production Notes
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Explain the client context, animation techniques, or pacing..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-[#00ff9d] text-black font-bold header-font text-xs tracking-widest uppercase hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Uploading to Approval Queue...' : 'Submit Project for Review'}
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: My Submissions */}
        {activeTab === 'submissions' && (
          <div className="space-y-4">
            <h2 className="header-font text-xl font-bold text-white uppercase tracking-wider">
              My Uploaded Works & Status
            </h2>

            {mySubmissions.length === 0 ? (
              <div className="glass p-12 rounded-3xl border border-white/10 text-center space-y-3">
                <i className="fas fa-inbox text-3xl text-white/20"></i>
                <h4 className="header-font text-base font-bold text-white uppercase">
                  No Submissions Yet
                </h4>
                <p className="text-white/40 text-xs font-mono">
                  You haven't submitted any projects yet. Use the "Upload New Project" tab above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mySubmissions.map((item) => (
                  <div
                    key={item.id}
                    className="glass p-5 rounded-2xl border border-white/10 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase font-mono ${
                            item.status === 'published'
                              ? 'bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/30'
                              : item.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : item.status === 'rejected'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : 'bg-white/10 text-white/60'
                          }`}
                        >
                          {item.status.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-mono text-white/40">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="header-font text-sm font-bold text-white">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-white/60 text-xs mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {item.status === 'rejected' && item.rejection_reason && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-mono">
                        <div className="font-bold flex items-center gap-1.5 mb-0.5">
                          <i className="fas fa-circle-exclamation"></i>
                          <span>Feedback from Administrator:</span>
                        </div>
                        <p className="text-[11px] text-red-200/90">{item.rejection_reason}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ModeratorDashboard;
