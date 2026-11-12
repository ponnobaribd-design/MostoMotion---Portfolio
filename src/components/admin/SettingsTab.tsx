import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const SettingsTab: React.FC = () => {
  const { isConfigured } = useAuth();
  const [defaultView, setDefaultView] = useState<'featured' | 'all'>('featured');
  const [autoplayInView, setAutoplayInView] = useState<boolean>(true);
  const [hoverPortalEnabled, setHoverPortalEnabled] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(
      'mostomotion_gallery_settings',
      JSON.stringify({ defaultView, autoplayInView, hoverPortalEnabled })
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="header-font text-2xl font-black text-white uppercase tracking-tight">
          System & CMS Settings
        </h2>
        <p className="text-white/50 text-xs font-mono">
          Configure public gallery defaults, performance preferences, and inspect Supabase credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Gallery Configuration Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSaveSettings} className="glass p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
            <h3 className="header-font text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <i className="fas fa-sliders text-[#00ff9d]"></i>
              <span>Public Gallery Preferences</span>
            </h3>

            {savedSuccess && (
              <div className="p-3.5 rounded-xl bg-[#00ff9d]/10 border border-[#00ff9d]/30 text-[#00ff9d] text-xs font-mono flex items-center gap-2">
                <i className="fas fa-check-circle"></i>
                <span>Settings saved successfully!</span>
              </div>
            )}

            {/* Default View */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-medium text-white/70 uppercase">
                Initial Public Gallery Load State
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDefaultView('featured')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    defaultView === 'featured'
                      ? 'bg-[#00ff9d]/15 border-[#00ff9d] text-white'
                      : 'bg-black/40 border-white/10 text-white/50 hover:text-white'
                  }`}
                >
                  <p className="font-bold text-xs font-mono text-[#00ff9d]">Featured Only (Default)</p>
                  <p className="text-[10px] text-white/50 mt-1 font-sans">
                    Visitors see hand-curated featured projects first.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDefaultView('all')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    defaultView === 'all'
                      ? 'bg-[#00ff9d]/15 border-[#00ff9d] text-white'
                      : 'bg-black/40 border-white/10 text-white/50 hover:text-white'
                  }`}
                >
                  <p className="font-bold text-xs font-mono text-cyan-400">All Published Works</p>
                  <p className="text-[10px] text-white/50 mt-1 font-sans">
                    Displays complete collection upon initial page scroll.
                  </p>
                </button>
              </div>
            </div>

            {/* Performance & Playback Toggles */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoplayInView}
                  onChange={(e) => setAutoplayInView(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-[#00ff9d] focus:ring-0"
                />
                <div>
                  <span className="text-xs font-mono text-white font-medium">
                    IntersectionObserver Viewport Autoplay
                  </span>
                  <p className="text-[10px] text-white/40">
                    Automatically plays inline previews only when 25%+ of the video is visible on screen, pausing when scrolled past.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hoverPortalEnabled}
                  onChange={(e) => setHoverPortalEnabled(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-[#00ff9d] focus:ring-0"
                />
                <div>
                  <span className="text-xs font-mono text-white font-medium">
                    Aspect-Ratio-Aware Floating Pop-up
                  </span>
                  <p className="text-[10px] text-white/40">
                    Scales videos vertically or horizontally on desktop hover without disrupting surrounding grid geometry.
                  </p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-[#00ff9d] text-black font-bold text-xs header-font uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
            >
              Save Configuration
            </button>
          </form>
        </div>

        {/* Database Diagnostic & Netlify Instructions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="header-font text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <i className="fas fa-server text-cyan-400"></i>
              <span>Supabase Connection Health</span>
            </h3>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-white/50">Status:</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    isConfigured
                      ? 'bg-[#00ff9d]/20 text-[#00ff9d]'
                      : 'bg-cyan-500/20 text-cyan-300'
                  }`}
                >
                  {isConfigured ? 'LIVE CONNECTED' : 'PREVIEW / SANDBOX'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">VITE_SUPABASE_URL:</span>
                <span className="text-white/80">
                  {isConfigured ? 'Configured (Hidden)' : 'Not Set'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">VITE_SUPABASE_ANON_KEY:</span>
                <span className="text-white/80">
                  {isConfigured ? 'Configured (Hidden)' : 'Not Set'}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-[11px] text-white/60 font-sans leading-relaxed">
              <p className="font-mono text-white text-xs font-bold">
                How to link your live Supabase project:
              </p>
              <ol className="list-decimal pl-4 space-y-1 font-mono text-[10px]">
                <li>Create a free project at <span className="text-[#00ff9d]">supabase.com</span>.</li>
                <li>Go to <strong>SQL Editor</strong> in Supabase and paste the contents of <code className="text-white bg-black/40 px-1 py-0.5 rounded">/supabase/migration.sql</code>.</li>
                <li>Copy Project URL and Anon Public Key from <strong>Settings &gt; API</strong>.</li>
                <li>Add to your Netlify site or <code className="text-white bg-black/40 px-1 py-0.5 rounded">.env</code>:
                  <div className="bg-black/60 p-2 rounded-lg text-white font-mono text-[9px] mt-1 space-y-0.5 select-all">
                    <div>VITE_SUPABASE_URL=https://your-ref.supabase.co</div>
                    <div>VITE_SUPABASE_ANON_KEY=eyJhbGci...</div>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
