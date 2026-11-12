import React, { useState } from 'react';
import { useCMS } from '../../context/CMSDataContext';
import { Project } from '../../types/cms';
import SmartMediaRenderer from '../media/SmartMediaRenderer';

export const SubmissionsTab: React.FC = () => {
  const { pendingProjects, projects, approveProject, rejectProject } = useCMS();

  const [activePreviewProject, setActivePreviewProject] = useState<Project | null>(null);
  const [rejectingProject, setRejectingProject] = useState<Project | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter all submissions that have gone through the workflow
  const rejectedSubmissions = projects.filter((p) => p.status === 'rejected');
  const approvedRecent = projects.filter((p) => p.status === 'published' && p.approved_at);

  const handleApprove = async (id: string) => {
    setIsProcessing(true);
    try {
      await approveProject(id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingProject) return;
    setIsProcessing(true);
    try {
      await rejectProject(rejectingProject.id, rejectionReason);
      setRejectingProject(null);
      setRejectionReason('');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="header-font text-2xl font-black text-white uppercase tracking-tight">
          Moderator Submissions & Approval Queue
        </h2>
        <p className="text-white/50 text-xs font-mono">
          Review external project uploads. Moderator uploads strictly remain pending until an administrator approves and publishes them.
        </p>
      </div>

      {/* Pending Queue Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <h3 className="header-font text-sm font-bold text-white uppercase tracking-wider">
              Awaiting Approval ({pendingProjects.length})
            </h3>
          </div>
        </div>

        {pendingProjects.length === 0 ? (
          <div className="glass p-12 rounded-3xl border border-white/10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center text-white/40">
              <i className="fas fa-check-double text-lg text-[#00ff9d]"></i>
            </div>
            <h4 className="header-font text-base font-bold text-white uppercase">
              Approval Queue Clear
            </h4>
            <p className="text-white/40 text-xs max-w-sm mx-auto font-mono">
              There are no pending submissions awaiting review. Moderator submissions will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingProjects.map((project) => (
              <div
                key={project.id}
                className="glass rounded-3xl border border-amber-500/20 overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Media Preview Box */}
                  <div className="relative aspect-video bg-black/80">
                    <SmartMediaRenderer
                      mediaUrl={project.media_url}
                      posterUrl={project.poster_url}
                      aspectRatio={project.aspect_ratio}
                      title={project.title}
                      autoPlayInView={false}
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500/80 backdrop-blur-md text-black font-bold font-mono text-[9px] uppercase tracking-wider">
                      Pending Review
                    </div>
                  </div>

                  {/* Submission Details */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h4 className="header-font text-lg font-bold text-white">
                        {project.title}
                      </h4>
                      <p className="text-white/40 text-[10px] font-mono mt-1">
                        Submitted: {new Date(project.created_at).toLocaleDateString()} • Format: {project.aspect_ratio} ({project.source_type})
                      </p>
                    </div>

                    {project.description && (
                      <p className="text-white/70 text-xs leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5 font-sans">
                        {project.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-white/50">
                      <span>Source Link:</span>
                      <a
                        href={project.media_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline truncate max-w-xs"
                      >
                        {project.media_url}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Approval & Rejection Action Bar */}
                <div className="p-5 bg-black/40 border-t border-white/5 flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setRejectingProject(project);
                      setRejectionReason('');
                    }}
                    disabled={isProcessing}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <i className="fas fa-xmark mr-1.5"></i>
                    Reject
                  </button>

                  <button
                    onClick={() => handleApprove(project.id)}
                    disabled={isProcessing}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00ff9d] to-cyan-400 text-black text-xs font-bold header-font uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <i className="fas fa-check"></i>
                    Approve & Publish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Submissions Audit Trail */}
      <div className="glass p-6 rounded-3xl border border-white/10 space-y-4">
        <h3 className="header-font text-sm font-bold text-white uppercase tracking-wider">
          Recent Decision Audit Log
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-white/40 uppercase text-[10px]">
                <th className="pb-3 font-semibold">Project Title</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Audit Notes</th>
                <th className="pb-3 font-semibold text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[...approvedRecent, ...rejectedSubmissions].slice(0, 6).map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 pr-4 font-sans font-medium text-white">
                    {item.title}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        item.status === 'published'
                          ? 'bg-[#00ff9d]/20 text-[#00ff9d]'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-white/50 text-[11px]">
                    {item.rejection_reason ? `Rejected: ${item.rejection_reason}` : 'Approved & Published'}
                  </td>
                  <td className="py-3 text-right text-white/40 text-[10px]">
                    {new Date(item.updated_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-md glass rounded-3xl border border-red-500/30 p-6 space-y-4">
            <h3 className="header-font text-base font-bold text-white uppercase tracking-wider">
              Reject Submission: {rejectingProject.title}
            </h3>
            <p className="text-white/60 text-xs font-mono">
              Provide feedback for the moderator explaining why this submission was rejected.
            </p>
            <div>
              <label className="block text-xs font-mono text-white/70 uppercase mb-1">
                Rejection Reason / Notes
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                placeholder="e.g. Media file resolution is too low, or audio is missing background track..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-red-400"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectingProject(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-white/60 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 rounded-xl bg-red-500 text-white font-bold text-xs font-mono uppercase tracking-wider hover:bg-red-600 transition-colors cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionsTab;
