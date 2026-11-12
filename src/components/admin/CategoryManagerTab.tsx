import React, { useState } from 'react';
import { useCMS } from '../../context/CMSDataContext';
import { Category } from '../../types/cms';

export const CategoryManagerTab: React.FC = () => {
  const { categories, createCategory, updateCategory, deleteCategory } = useCMS();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [parentForNewSub, setParentForNewSub] = useState<Category | null>(null);

  // Form states
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catSort, setCatSort] = useState(1);
  const [catIsActive, setCatIsActive] = useState(true);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Open Add Main Category
  const handleOpenAddMain = () => {
    setEditingCategory(null);
    setParentForNewSub(null);
    setCatName('');
    setCatSlug('');
    setCatDesc('');
    setCatSort(categories.length + 1);
    setCatIsActive(true);
    setFormError('');
    setIsModalOpen(true);
  };

  // Open Add Subcategory
  const handleOpenAddSub = (parent: Category) => {
    setEditingCategory(null);
    setParentForNewSub(parent);
    setCatName('');
    setCatSlug('');
    setCatDesc('');
    setCatSort((parent.subcategories?.length || 0) + 1);
    setCatIsActive(true);
    setFormError('');
    setIsModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setParentForNewSub(null);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatDesc(cat.description || '');
    setCatSort(cat.sort_order);
    setCatIsActive(cat.is_active);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      setFormError('Name is required');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      if (editingCategory) {
        const res = await updateCategory(editingCategory.id, {
          name: catName,
          slug: catSlug || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: catDesc || null,
          sort_order: Number(catSort),
          is_active: catIsActive,
        });
        if (!res.success) throw new Error(res.error);
      } else {
        const res = await createCategory({
          name: catName,
          slug: catSlug || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          parent_id: parentForNewSub ? parentForNewSub.id : null,
          description: catDesc || null,
          sort_order: Number(catSort),
          is_active: catIsActive,
        });
        if (!res.success) throw new Error(res.error);
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="header-font text-2xl font-black text-white uppercase tracking-tight">
            Category & Subcategory Hierarchy
          </h2>
          <p className="text-white/50 text-xs font-mono">
            Organize gallery taxonomy, accordion navigation order, and active states.
          </p>
        </div>

        <button
          onClick={handleOpenAddMain}
          className="py-3 px-5 rounded-xl bg-gradient-to-r from-[#00ff9d] to-cyan-400 text-black font-bold header-font text-xs tracking-wider uppercase flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,255,157,0.3)] transition-all cursor-pointer self-start md:self-auto"
        >
          <i className="fas fa-plus"></i>
          <span>Add Main Category</span>
        </button>
      </div>

      {/* Categories Tree */}
      <div className="space-y-4">
        {categories.map((mainCat, index) => (
          <div
            key={mainCat.id}
            className="glass rounded-3xl border border-white/10 overflow-hidden"
          >
            {/* Main Category Header Row */}
            <div className="p-5 bg-white/[0.03] flex flex-wrap items-center justify-between gap-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/40 font-mono text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <div>
                  <h3 className="header-font text-base font-bold text-white flex items-center gap-2">
                    <span>{mainCat.name}</span>
                    <span className="text-[10px] font-mono text-white/30 font-normal">
                      /{mainCat.slug}
                    </span>
                  </h3>
                  {mainCat.description && (
                    <p className="text-white/40 text-[11px] font-sans mt-0.5">
                      {mainCat.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Main Actions */}
              <div className="flex items-center gap-2">
                {/* Active Toggle */}
                <button
                  onClick={() => updateCategory(mainCat.id, { is_active: !mainCat.is_active })}
                  className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                    mainCat.is_active
                      ? 'bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/30'
                      : 'bg-white/10 text-white/40'
                  }`}
                >
                  {mainCat.is_active ? 'Active' : 'Inactive'}
                </button>

                {/* Add Subcategory */}
                <button
                  onClick={() => handleOpenAddSub(mainCat)}
                  className="px-3 py-1 rounded-lg bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 text-[10px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <i className="fas fa-plus text-[9px]"></i>
                  <span>Add Subcategory</span>
                </button>

                {/* Edit */}
                <button
                  onClick={() => handleOpenEdit(mainCat)}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Edit Category"
                >
                  <i className="fas fa-pen text-[10px]"></i>
                </button>

                {/* Delete */}
                <button
                  onClick={() => {
                    if (confirm(`Delete main category "${mainCat.name}" and all subcategories?`)) {
                      deleteCategory(mainCat.id);
                    }
                  }}
                  className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors cursor-pointer"
                  title="Delete Category"
                >
                  <i className="fas fa-trash text-[10px]"></i>
                </button>
              </div>
            </div>

            {/* Subcategories List */}
            <div className="p-4 bg-black/40">
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider mb-2">
                Sub-categories ({mainCat.subcategories?.length || 0}):
              </p>
              {mainCat.subcategories && mainCat.subcategories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {mainCat.subcategories.map((sub, sIdx) => (
                    <div
                      key={sub.id}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-[10px] text-white/30">
                          {sIdx + 1}.
                        </span>
                        <span className="text-xs font-medium text-white/90 truncate">
                          {sub.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={() => handleOpenEdit(sub)}
                          className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center text-[9px] cursor-pointer"
                        >
                          <i className="fas fa-pen"></i>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete subcategory "${sub.name}"?`)) {
                              deleteCategory(sub.id);
                            }
                          }}
                          className="w-6 h-6 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center text-[9px] cursor-pointer"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-mono text-white/30 py-2">
                  No subcategories created yet for this category.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-lg glass rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 bg-black/60 border-b border-white/10 flex items-center justify-between">
              <h3 className="header-font text-base font-bold text-white uppercase tracking-wider">
                {editingCategory
                  ? 'Edit Category'
                  : parentForNewSub
                  ? `Add Subcategory to "${parentForNewSub.name}"`
                  : 'Add Main Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-medium text-white/70 uppercase mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value);
                    if (!editingCategory) {
                      setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="e.g. 3D Architectural Renders"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00ff9d]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-white/70 uppercase mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  placeholder="3d-architectural-renders"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-[#00ff9d]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-white/70 uppercase mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Short description for tooltip or header"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00ff9d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-white/70 uppercase mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={catSort}
                    onChange={(e) => setCatSort(Number(e.target.value))}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#00ff9d]"
                  />
                </div>

                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-white">
                    <input
                      type="checkbox"
                      checked={catIsActive}
                      onChange={(e) => setCatIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-[#00ff9d] focus:ring-0"
                    />
                    <span>Active in Public Gallery</span>
                  </label>
                </div>
              </div>

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
                  {isSubmitting ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagerTab;
