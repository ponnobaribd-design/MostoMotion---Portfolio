import React, { useState, useMemo } from 'react';
import { useCMS } from '../../context/CMSDataContext';
import { Project, CMSAspectRatio, ProjectStatus } from '../../types/cms';
import { parseMediaUrl } from '../../lib/mediaAdapter';

export const ProjectManagerTab: React.FC = () => {
  const {
    projects,
    categories,
    createProject,
    updateProject,
    deleteProject,
    duplicateProject,
    togglePublish,
    toggleFeatured,
  } = useCMS();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProjectStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category_id: string;
    media_url: string;
    poster_url: string;
    aspect_ratio: CMSAspectRatio;
    is_featured: boolean;
    is_published: boolean;
    status: ProjectStatus;
  }>({
    title: '',
    description: '',
    category_id: '',
    media_url: '',
    poster_url: '',
    aspect_ratio: '16:9',
    is_featured: false,
    is_published: true,
    status: 'published',
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Flatten subcategories for easy dropdown selection
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

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      category_id: flatSubcategories[0]?.id || '',
      media_url: '',
      poster_url: '',
      aspect_ratio: '16:9',
      is_featured: false,
      is_published: true,
      status: 'published',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || '',
      category_id: project.category_id,
      media_url: project.media_url,
      poster_url: project.poster_url || '',
      aspect_ratio: project.aspect_ratio,
      is_featured: project.is_featured,
      is_published: project.is_published,
      status: project.status,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Project title is required');
      return;
    }
    if (!formData.media_url.trim()) {
      setFormError('Media URL is required');
      return;
    }
    if (!formData.category_id) {
      setFormError('Please select a category');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      if (editingProject) {
        const res = await updateProject(editingProject.id, formData);
        if (!res.success) throw new Error(res.error);
      } else {
        const res = await createProject(formData);
        if (!res.success) throw new Error(res.error);
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = (p.description || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }
      if (statusFilter !== 'all' && p.status !== statusFilter) {
        return false;
      }
      if (categoryFilter !== 'all' && p.category_id !== categoryFilter) {
        return false;
      }
      return true;
    });
  }, [projects, searchQuery, statusFilter, categoryFilter]);

  // Live media preview in modal
  const livePreview = parseMediaUrl(formData.media_url);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="header-font text-2xl font-black text-white uppercase tracking-tight">
            Project Manager
          </h2>
          <p className="text-white/50 text-xs font-mono">
            Create, curate, publish, and reorder video & design showcase items.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="py-3 px-5 rounded-xl bg-gradient-to-r from-[#00ff9d] to-cyan-400 text-black font-bold header-font text-xs tracking-wider uppercase flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,255,157,0.3)] transition-all cursor-pointer self-start md:self-auto"
        >
          <i className="fas fa-plus"></i>
          <span>New Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass p-4 rounded-2xl border border-white/10 flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title..."
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 pl-9 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-[#00ff9d]"
          />
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs"></i>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-white/40 uppercase text-[10px]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00ff9d]"
          >
            <option value="all">All ({projects.length})</option>
            <option value="published">Published</option>
            <option value="pending">Pending</option>
            <option value="draft">Draft</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-white/40 uppercase text-[10px]">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00ff9d] max-w-[180px] truncate"
          >
            <option value="all">All Categories</option>
            {flatSubcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.parentName} / {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="glass rounded-3xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-white/40 uppercase text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Media & Title</th>
                <th className="py-3.5 px-4 font-semibold">Format</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold text-center">Featured</th>
                <th className="py-3.5 px-4 font-semibold text-center">Published</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-white/40 font-mono">
                    No projects found matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => {
                  const matchingSub = flatSubcategories.find((s) => s.id === project.category_id);

                  return (
                    <tr key={project.id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Media & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={project.poster_url || project.media_url}
                            alt={project.title}
                            className="w-10 h-10 rounded-lg object-cover bg-zinc-900 border border-white/10 shrink-0"
                          />
                          <div>
                            <p className="font-sans font-bold text-white group-hover:text-[#00ff9d] transition-colors text-xs">
                              {project.title}
                            </p>
                            <p className="text-[10px] text-white/40 font-mono truncate max-w-xs">
                              {project.description || 'No description provided'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Format */}
                      <td className="py-3 px-4 text-white/60">
                        <div className="flex flex-col text-[10px]">
                          <span className="font-bold text-white uppercase">{project.aspect_ratio}</span>
                          <span className="text-white/40 uppercase text-[9px]">{project.source_type}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-white/70 text-[11px] font-sans">
                        {matchingSub ? (
                          <span>
                            <span className="text-white/40">{matchingSub.parentName} / </span>
                            <span className="font-medium text-white">{matchingSub.name}</span>
                          </span>
                        ) : (
                          <span className="text-white/40 italic">Unassigned</span>
                        )}
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleFeatured(project.id)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                            project.is_featured
                              ? 'text-[#00ff9d] bg-[#00ff9d]/10 border border-[#00ff9d]/30'
                              : 'text-white/20 hover:text-white/60'
                          }`}
                          title="Toggle Featured"
                        >
                          <i className={`fas fa-star text-xs`}></i>
                        </button>
                      </td>

                      {/* Published Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => togglePublish(project.id)}
                          className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            project.is_published
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : 'bg-white/10 text-white/40 hover:text-white/70'
                          }`}
                        >
                          {project.is_published ? 'Published' : 'Draft'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEdit(project)}
                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                            title="Edit Project"
                          >
                            <i className="fas fa-pen text-[10px]"></i>
                          </button>

                          {/* Duplicate */}
                          <button
                            onClick={() => duplicateProject(project.id)}
                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                            title="Duplicate Project"
                          >
                            <i className="fas fa-copy text-[10px]"></i>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteConfirmId(project.id)}
                            className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors cursor-pointer"
                            title="Delete Project"
                          >
                            <i className="fas fa-trash text-[10px]"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-2xl glass rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-black/60 border-b border-white/10 flex items-center justify-between">
              <h3 className="header-font text-base font-bold text-white uppercase tracking-wider">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                  {formError}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-mono font-medium text-white/70 uppercase mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Cyberpunk Holographic Commercial"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00ff9d]"
                />
              </div>

              {/* Category Selector */}
              <div>
                <label className="block text-xs font-mono font-medium text-white/70 uppercase mb-1">
                  Sub-Category Taxonomy *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#00ff9d]"
                >
                  {flatSubcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.parentName} → {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Media URL */}
              <div>
                <label className="block text-xs font-mono font-medium text-white/70 uppercase mb-1">
                  External Media URL (MP4, YouTube, Vimeo, Drive) *
                </label>
                <input
                  type="url"
                  value={formData.media_url}
                  onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                  placeholder="https://commondatastorage.googleapis.com/... or https://youtube.com/..."
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-[#00ff9d]"
                />
                {livePreview.isValid && (
                  <p className="text-[10px] text-[#00ff9d] font-mono mt-1">
                    Detected format: {livePreview.sourceType.toUpperCase()}
                  </p>
                )}
              </div>

              {/* Thumbnail / Poster URL */}
              <div>
                <label className="block text-xs font-mono font-medium text-white/70 uppercase mb-1">
                  Poster / Thumbnail Image URL
                </label>
                <input
                  type="url"
                  value={formData.poster_url}
                  onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-[#00ff9d]"
                />
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="block text-xs font-mono font-medium text-white/70 uppercase mb-1">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['16:9', '9:16', '1:1', '4:5'] as CMSAspectRatio[]).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setFormData({ ...formData, aspect_ratio: ratio })}
                      className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                        formData.aspect_ratio === ratio
                          ? 'border-[#00ff9d] bg-[#00ff9d]/20 text-[#00ff9d]'
                          : 'border-white/10 bg-black/30 text-white/60 hover:text-white'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono font-medium text-white/70 uppercase mb-1">
                  Description / Case Notes
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Details about client, retention metrics, tools used (After Effects, Premiere, Cinema 4D)..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00ff9d]"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-white">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#00ff9d] focus:ring-0"
                  />
                  <span>Mark as Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-white">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4 rounded text-[#00ff9d] focus:ring-0"
                  />
                  <span>Publish Immediately</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-white/60 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-2.5 px-6 rounded-xl bg-[#00ff9d] text-black font-bold text-xs header-font uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-md glass rounded-3xl border border-red-500/30 p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xl">
              <i className="fas fa-triangle-exclamation"></i>
            </div>
            <h3 className="header-font text-lg font-black text-white uppercase">
              Confirm Project Deletion
            </h3>
            <p className="text-white/60 text-xs font-mono">
              Are you sure you want to permanently delete this project? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-white/60 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteProject(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-5 py-2 rounded-xl bg-red-500 text-white font-bold text-xs font-mono uppercase tracking-wider hover:bg-red-600 transition-colors cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagerTab;
