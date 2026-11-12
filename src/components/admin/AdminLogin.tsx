import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginProps {
  onBackToPublic: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToPublic }) => {
  const { signIn, isConfigured, setDemoRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await signIn(email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Invalid credentials.');
      }
    } catch {
      setErrorMsg('Failed to log in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background cyber glowing ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff9d]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar with Back Link */}
      <div className="absolute top-8 left-8 flex items-center gap-3">
        <button
          onClick={onBackToPublic}
          className="glass-btn flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono text-white/70 hover:text-white border-white/10 hover:border-[#00ff9d]/40 transition-all cursor-pointer"
        >
          <i className="fas fa-arrow-left text-xs"></i>
          <span>RETURN TO PORTFOLIO</span>
        </button>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff9d]/10 border border-[#00ff9d]/30 text-[#00ff9d] text-[10px] font-mono font-bold tracking-widest uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse"></span>
            CMS CONTROL PORTAL
          </div>
          <h1 className="header-font text-3xl md:text-4xl font-black tracking-tight text-white uppercase">
            MOSTO <span className="text-[#00ff9d]">MOTION</span>
          </h1>
          <p className="text-white/50 text-xs mt-2 font-mono">
            Secure Role-Based Dashboard & Approval Engine
          </p>
        </div>

        {/* Configuration Notice Badge */}
        {!isConfigured && (
          <div className="mb-6 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold font-mono">
              <i className="fas fa-circle-info text-cyan-400"></i>
              <span>GUIDED PREVIEW MODE ACTIVE</span>
            </div>
            <p className="text-[11px] text-cyan-200/80 leading-relaxed">
              Supabase environment variables (<code className="bg-black/40 px-1 py-0.5 rounded text-white">VITE_SUPABASE_URL</code>) are not yet configured. You can test all Admin and Moderator capabilities instantly using the quick buttons below:
            </p>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDemoRole('admin')}
                className="flex-1 py-2 px-3 rounded-lg bg-[#00ff9d] text-black font-bold text-[11px] font-mono tracking-wider hover:opacity-90 transition-opacity"
              >
                Enter as Admin
              </button>
              <button
                type="button"
                onClick={() => setDemoRole('moderator')}
                className="flex-1 py-2 px-3 rounded-lg bg-cyan-400 text-black font-bold text-[11px] font-mono tracking-wider hover:opacity-90 transition-opacity"
              >
                Enter as Moderator
              </button>
            </div>
          </div>
        )}

        {/* Login Form Card */}
        <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
                <i className="fas fa-circle-exclamation shrink-0"></i>
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono font-medium text-white/70 uppercase tracking-wider mb-2">
                Authorized Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mostomotion.com"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-white/30 text-xs font-mono focus:outline-none focus:border-[#00ff9d] transition-colors"
                />
                <i className="fas fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-xs"></i>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-white/70 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-white/30 text-xs font-mono focus:outline-none focus:border-[#00ff9d] transition-colors"
                />
                <i className="fas fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-xs"></i>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#00ff9d] to-cyan-400 text-black font-bold header-font text-xs tracking-widest uppercase hover:shadow-[0_0_25px_rgba(0,255,157,0.4)] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-circle-notch fa-spin"></i>
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-shield-halved"></i>
                  <span>SIGN IN TO PORTAL</span>
                </>
              )}
            </button>
          </form>

          {/* Security footnote */}
          <div className="mt-6 pt-4 border-t border-white/5 text-center text-[10px] font-mono text-white/30">
            <span>PROTECTED BY SUPABASE ROW LEVEL SECURITY (RLS)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
