import React, { useState } from 'react';
import { parseMediaUrl } from '../../lib/mediaAdapter';
import SmartMediaRenderer from '../media/SmartMediaRenderer';
import { CMSAspectRatio } from '../../types/cms';

export const MediaManagerTab: React.FC = () => {
  const [testUrl, setTestUrl] = useState(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  );
  const [testPoster, setTestPoster] = useState(
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop'
  );
  const [aspectRatio, setAspectRatio] = useState<CMSAspectRatio>('16:9');

  const parsed = parseMediaUrl(testUrl);

  const sampleUrls = [
    {
      name: 'Direct MP4 Stream',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      poster: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
      ratio: '16:9' as CMSAspectRatio,
    },
    {
      name: 'YouTube Shorts / Vertical Reel',
      url: 'https://www.youtube.com/shorts/aqz-KE-bpKQ',
      poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      ratio: '9:16' as CMSAspectRatio,
    },
    {
      name: 'YouTube Widescreen Video',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      poster: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop',
      ratio: '16:9' as CMSAspectRatio,
    },
    {
      name: 'Google Drive File Preview',
      url: 'https://drive.google.com/file/d/1aB2c3D4e5F6g7H8i9J0/view',
      poster: '',
      ratio: '16:9' as CMSAspectRatio,
    },
    {
      name: 'Static High-Res Graphic Art',
      url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop',
      poster: '',
      ratio: '1:1' as CMSAspectRatio,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="header-font text-2xl font-black text-white uppercase tracking-tight">
          Media Source Adapter & Inspector
        </h2>
        <p className="text-white/50 text-xs font-mono">
          Validate external media URLs, test provider embed conversions, and simulate playback across aspect ratios.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* URL Input & Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="header-font text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <i className="fas fa-link text-[#00ff9d]"></i>
              <span>Test External URL</span>
            </h3>

            <div>
              <label className="block text-xs font-mono text-white/70 uppercase mb-1">
                Media Stream URL
              </label>
              <input
                type="url"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-[#00ff9d]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/70 uppercase mb-1">
                Optional Poster / Fallback URL
              </label>
              <input
                type="url"
                value={testPoster}
                onChange={(e) => setTestPoster(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-[#00ff9d]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/70 uppercase mb-1">
                Aspect Ratio Simulation
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['16:9', '9:16', '1:1', '4:5'] as CMSAspectRatio[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setAspectRatio(r)}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                      aspectRatio === r
                        ? 'border-[#00ff9d] bg-[#00ff9d]/20 text-[#00ff9d]'
                        : 'border-white/10 bg-black/30 text-white/60 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Sample Presets */}
            <div className="pt-2">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block mb-2">
                Quick Sample Presets:
              </span>
              <div className="space-y-1.5">
                {sampleUrls.map((sample) => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => {
                      setTestUrl(sample.url);
                      setTestPoster(sample.poster);
                      setAspectRatio(sample.ratio);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 text-[11px] font-mono text-white/70 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>{sample.name}</span>
                    <span className="text-[9px] text-[#00ff9d]">{sample.ratio}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Parsed Diagnostic Output */}
          <div className="glass p-5 rounded-2xl border border-white/10 space-y-3 font-mono text-xs">
            <h4 className="text-white/40 uppercase text-[10px] tracking-wider">
              Adapter Detection Analysis:
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-white/50">Valid URL:</span>
                <span className={parsed.isValid ? 'text-[#00ff9d]' : 'text-red-400'}>
                  {parsed.isValid ? 'YES' : 'NO'}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-white/50">Detected Source:</span>
                <span className="text-cyan-400 uppercase font-bold">
                  {parsed.sourceType}
                </span>
              </div>
              {parsed.videoId && (
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-white/50">Extracted ID:</span>
                  <span className="text-white/80">{parsed.videoId}</span>
                </div>
              )}
              <div className="border-b border-white/5 pb-1">
                <span className="text-white/50 block mb-0.5">Sanitized Embed Target:</span>
                <span className="text-white/70 break-all text-[10px]">
                  {parsed.embedUrl || '(None)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Visual Render Sandbox (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="header-font text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <i className="fas fa-eye text-cyan-400"></i>
                <span>Live Responsive Sandbox Preview</span>
              </h3>
              <span className="font-mono text-[10px] text-white/40">
                Mode: {aspectRatio}
              </span>
            </div>

            <div
              className={`mx-auto rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black ${
                aspectRatio === '9:16' ? 'max-w-[280px]' : 'max-w-full'
              }`}
            >
              <SmartMediaRenderer
                mediaUrl={testUrl}
                posterUrl={testPoster}
                aspectRatio={aspectRatio}
                title="Sandbox Media Test"
                autoPlayInView={true}
                showControlsOnHover={true}
              />
            </div>

            <p className="text-center text-white/40 text-[10px] font-mono">
              Hover over video card to reveal sound controls or test stream playback.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaManagerTab;
