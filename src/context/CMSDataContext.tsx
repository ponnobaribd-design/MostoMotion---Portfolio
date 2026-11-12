import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, Category, ProjectStatus, CMSAspectRatio, MediaType, MediaSourceType } from '../types/cms';
import { supabase, isSupabaseConfigured, fetchPublishedProjects, fetchAllCategories, fetchAdminProjects } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { GALLERY_CATEGORIES, GALLERY_ITEMS } from '../components/galleryData';
import { parseMediaUrl } from '../lib/mediaAdapter';

interface CMSDataContextType {
  categories: Category[];
  projects: Project[];
  publishedProjects: Project[];
  pendingProjects: Project[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
  
  // Project Actions
  createProject: (projectData: Partial<Project>) => Promise<{ success: boolean; error?: string; project?: Project }>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<{ success: boolean; error?: string }>;
  deleteProject: (id: string) => Promise<{ success: boolean; error?: string }>;
  duplicateProject: (id: string) => Promise<{ success: boolean; error?: string }>;
  approveProject: (id: string) => Promise<{ success: boolean; error?: string }>;
  rejectProject: (id: string, reason?: string) => Promise<{ success: boolean; error?: string }>;
  togglePublish: (id: string) => Promise<{ success: boolean; error?: string }>;
  toggleFeatured: (id: string) => Promise<{ success: boolean; error?: string }>;
  
  // Category Actions
  createCategory: (catData: Partial<Category>) => Promise<{ success: boolean; error?: string }>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<{ success: boolean; error?: string }>;
  deleteCategory: (id: string) => Promise<{ success: boolean; error?: string }>;
}

const CMSDataContext = createContext<CMSDataContextType | undefined>(undefined);

// Generate default local fallback categories matching exact prompt requirement
const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat-motion',
    name: 'Motion Graphics',
    slug: 'motion-graphics',
    parent_id: null,
    description: 'Dynamic 2D/3D animation, commercials, and brand identities.',
    sort_order: 1,
    is_active: true,
    subcategories: [
      { id: 'sub-motion-1', name: 'Restaurant Ads', slug: 'motion-restaurant-ads', parent_id: 'cat-motion', description: null, sort_order: 1, is_active: true },
      { id: 'sub-motion-2', name: 'Promotional / Commercial Video', slug: 'motion-promotional-commercial', parent_id: 'cat-motion', description: null, sort_order: 2, is_active: true },
      { id: 'sub-motion-3', name: 'Before / After', slug: 'motion-before-after', parent_id: 'cat-motion', description: null, sort_order: 3, is_active: true },
      { id: 'sub-motion-4', name: 'Logo & Title Animation', slug: 'motion-logo-title-animation', parent_id: 'cat-motion', description: null, sort_order: 4, is_active: true },
    ],
  },
  {
    id: 'cat-video',
    name: 'Video Editing',
    slug: 'video-editing',
    parent_id: null,
    description: 'High-retention pacing, narrative flow, sound design, and color grading.',
    sort_order: 2,
    is_active: true,
    subcategories: [
      { id: 'sub-video-1', name: 'Podcast Editing', slug: 'video-podcast-editing', parent_id: 'cat-video', description: null, sort_order: 1, is_active: true },
      { id: 'sub-video-2', name: 'Short-form Content', slug: 'video-short-form-content', parent_id: 'cat-video', description: null, sort_order: 2, is_active: true },
      { id: 'sub-video-3', name: 'Before / After', slug: 'video-before-after', parent_id: 'cat-video', description: null, sort_order: 3, is_active: true },
      { id: 'sub-video-4', name: 'Educational Content', slug: 'video-educational-content', parent_id: 'cat-video', description: null, sort_order: 4, is_active: true },
      { id: 'sub-video-5', name: 'Restaurant Ads', slug: 'video-restaurant-ads', parent_id: 'cat-video', description: null, sort_order: 5, is_active: true },
    ],
  },
  {
    id: 'cat-graphic',
    name: 'Graphic Design',
    slug: 'graphic-design',
    parent_id: null,
    description: 'Social creatives, high-CTR YouTube thumbnails, and concept art.',
    sort_order: 3,
    is_active: true,
    subcategories: [
      { id: 'sub-graphic-1', name: 'Social Media Creatives', slug: 'graphic-social-media-creatives', parent_id: 'cat-graphic', description: null, sort_order: 1, is_active: true },
      { id: 'sub-graphic-2', name: 'YouTube Thumbnails', slug: 'graphic-youtube-thumbnails', parent_id: 'cat-graphic', description: null, sort_order: 2, is_active: true },
      { id: 'sub-graphic-3', name: 'AI Generated Concept Art', slug: 'graphic-ai-generated-concept-art', parent_id: 'cat-graphic', description: null, sort_order: 3, is_active: true },
    ],
  },
];

// Map GALLERY_ITEMS to initial Project array
const SEED_PROJECTS: Project[] = GALLERY_ITEMS.map((item, idx) => {
  // Find matching subcategory ID
  let matchedSubId = 'sub-motion-1';
  SEED_CATEGORIES.forEach((cat) => {
    cat.subcategories?.forEach((sub) => {
      if (sub.name === item.subCategory) {
        matchedSubId = sub.id;
      }
    });
  });

  const parsed = parseMediaUrl(item.videoUrl || item.thumbnail);

  return {
    id: item.id,
    title: item.title,
    description: item.description || null,
    category_id: matchedSubId,
    media_type: item.videoUrl ? 'video' : 'image',
    source_type: parsed.sourceType,
    media_url: item.videoUrl || item.thumbnail,
    poster_url: item.thumbnail,
    aspect_ratio: (item.aspectRatio === '9:16' ? '9:16' : '16:9') as CMSAspectRatio,
    is_featured: idx < 6, // First 6 are featured by default
    is_published: true,
    status: 'published' as ProjectStatus,
    submitted_by: null,
    approved_by: null,
    approved_at: new Date().toISOString(),
    rejection_reason: null,
    sort_order: idx + 1,
    created_at: new Date(Date.now() - idx * 86400000).toISOString(),
    updated_at: new Date(Date.now() - idx * 86400000).toISOString(),
  };
});

export const CMSDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, isAdmin, isModerator } = useAuth();
  const [categories, setCategories] = useState<Category[]>(SEED_CATEGORIES);
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isConfigured = isSupabaseConfigured();

  // Load data from Supabase or fallback
  const refreshData = useCallback(async () => {
    if (!isConfigured) {
      // In demo/unconfigured mode, retrieve modified projects from localStorage if available
      const savedProjects = localStorage.getItem('mostomotion_cms_projects');
      if (savedProjects) {
        try {
          setProjects(JSON.parse(savedProjects));
        } catch {
          setProjects(SEED_PROJECTS);
        }
      }
      const savedCategories = localStorage.getItem('mostomotion_cms_categories');
      if (savedCategories) {
        try {
          setCategories(JSON.parse(savedCategories));
        } catch {
          setCategories(SEED_CATEGORIES);
        }
      }
      return;
    }

    setIsLoading(true);
    try {
      const [fetchedCats, fetchedProjects] = await Promise.all([
        fetchAllCategories(),
        isAdmin ? fetchAdminProjects() : fetchPublishedProjects(),
      ]);

      if (fetchedCats.length > 0) {
        setCategories(fetchedCats);
      }
      if (fetchedProjects.length > 0) {
        setProjects(fetchedProjects);
      }
    } catch (err) {
      console.warn('[CMSDataContext] Error refreshing data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isConfigured, isAdmin]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Persist demo changes to localStorage
  const saveLocalProjects = (updated: Project[]) => {
    setProjects(updated);
    if (!isConfigured) {
      localStorage.setItem('mostomotion_cms_projects', JSON.stringify(updated));
    }
  };

  const saveLocalCategories = (updated: Category[]) => {
    setCategories(updated);
    if (!isConfigured) {
      localStorage.setItem('mostomotion_cms_categories', JSON.stringify(updated));
    }
  };

  // Create Project
  const createProject = async (
    projectData: Partial<Project>
  ): Promise<{ success: boolean; error?: string; project?: Project }> => {
    // If moderator, strictly enforce pending status and prevent self-publish
    const status: ProjectStatus = isModerator ? 'pending' : (projectData.status || 'draft');
    const is_published = isModerator ? false : Boolean(projectData.is_published);
    const submitted_by = user?.id || profile?.id || null;

    const parsedMedia = parseMediaUrl(projectData.media_url || '');

    const newProject: Project = {
      id: isConfigured ? '' : `proj-${Date.now()}`,
      title: projectData.title || 'Untitled Project',
      description: projectData.description || null,
      category_id: projectData.category_id || '',
      media_type: (projectData.media_type || (parsedMedia.sourceType === 'image' ? 'image' : 'video')) as MediaType,
      source_type: (projectData.source_type || parsedMedia.sourceType) as MediaSourceType,
      media_url: projectData.media_url || '',
      poster_url: projectData.poster_url || null,
      aspect_ratio: (projectData.aspect_ratio || '16:9') as CMSAspectRatio,
      is_featured: isModerator ? false : Boolean(projectData.is_featured),
      is_published,
      status,
      submitted_by,
      approved_by: isModerator ? null : (status === 'published' ? user?.id || null : null),
      approved_at: !isModerator && status === 'published' ? new Date().toISOString() : null,
      rejection_reason: null,
      sort_order: projects.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!isConfigured) {
      const updated = [newProject, ...projects];
      saveLocalProjects(updated);
      return { success: true, project: newProject };
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          title: newProject.title,
          description: newProject.description,
          category_id: newProject.category_id,
          media_type: newProject.media_type,
          source_type: newProject.source_type,
          media_url: newProject.media_url,
          poster_url: newProject.poster_url,
          aspect_ratio: newProject.aspect_ratio,
          is_featured: newProject.is_featured,
          is_published: newProject.is_published,
          status: newProject.status,
          submitted_by: newProject.submitted_by,
          sort_order: newProject.sort_order,
        })
        .select(`*, category:categories!projects_category_id_fkey(*)`)
        .single();

      if (error) return { success: false, error: error.message };
      setProjects((prev) => [data as Project, ...prev]);
      return { success: true, project: data as Project };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save project';
      return { success: false, error: msg };
    }
  };

  // Update Project
  const updateProject = async (id: string, updates: Partial<Project>): Promise<{ success: boolean; error?: string }> => {
    if (!isConfigured) {
      const updated = projects.map((p) => (p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p));
      saveLocalProjects(updated);
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) return { success: false, error: error.message };
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      return { success: false, error: msg };
    }
  };

  // Delete Project (Admin only)
  const deleteProject = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin) {
      return { success: false, error: 'Unauthorized: Admin role required' };
    }

    if (!isConfigured) {
      const updated = projects.filter((p) => p.id !== id);
      saveLocalProjects(updated);
      return { success: true };
    }

    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      return { success: false, error: msg };
    }
  };

  // Duplicate Project (Admin only)
  const duplicateProject = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin) return { success: false, error: 'Admin role required' };
    const original = projects.find((p) => p.id === id);
    if (!original) return { success: false, error: 'Project not found' };

    const duplicateData: Partial<Project> = {
      ...original,
      title: `${original.title} (Copy)`,
      status: 'draft',
      is_published: false,
    };
    return createProject(duplicateData);
  };

  // Approve Project (Admin only)
  const approveProject = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin) return { success: false, error: 'Admin role required' };
    return updateProject(id, {
      status: 'published',
      is_published: true,
      approved_by: user?.id || profile?.id || null,
      approved_at: new Date().toISOString(),
      rejection_reason: null,
    });
  };

  // Reject Project (Admin only)
  const rejectProject = async (id: string, reason?: string): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin) return { success: false, error: 'Admin role required' };
    return updateProject(id, {
      status: 'rejected',
      is_published: false,
      rejection_reason: reason || 'Submission did not meet portfolio criteria.',
    });
  };

  // Toggle Publish
  const togglePublish = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin) return { success: false, error: 'Admin role required' };
    const p = projects.find((x) => x.id === id);
    if (!p) return { success: false, error: 'Project not found' };
    const nextPublished = !p.is_published;
    return updateProject(id, {
      is_published: nextPublished,
      status: nextPublished ? 'published' : 'draft',
    });
  };

  // Toggle Featured
  const toggleFeatured = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin) return { success: false, error: 'Admin role required' };
    const p = projects.find((x) => x.id === id);
    if (!p) return { success: false, error: 'Project not found' };
    return updateProject(id, {
      is_featured: !p.is_featured,
    });
  };

  // Category Actions
  const createCategory = async (catData: Partial<Category>): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin) return { success: false, error: 'Admin role required' };
    const slug = (catData.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newCat: Category = {
      id: isConfigured ? '' : `cat-${Date.now()}`,
      name: catData.name || 'New Category',
      slug: catData.slug || slug,
      parent_id: catData.parent_id || null,
      description: catData.description || null,
      sort_order: catData.sort_order || 0,
      is_active: catData.is_active ?? true,
      subcategories: [],
    };

    if (!isConfigured) {
      if (newCat.parent_id) {
        const updated = categories.map((c) => {
          if (c.id === newCat.parent_id) {
            return {
              ...c,
              subcategories: [...(c.subcategories || []), newCat],
            };
          }
          return c;
        });
        saveLocalCategories(updated);
      } else {
        saveLocalCategories([...categories, newCat]);
      }
      return { success: true };
    }

    try {
      const { error } = await supabase.from('categories').insert({
        name: newCat.name,
        slug: newCat.slug,
        parent_id: newCat.parent_id,
        description: newCat.description,
        sort_order: newCat.sort_order,
        is_active: newCat.is_active,
      });
      if (error) return { success: false, error: error.message };
      refreshData();
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create category';
      return { success: false, error: msg };
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin) return { success: false, error: 'Admin role required' };
    if (!isConfigured) {
      const updateList = (list: Category[]): Category[] => {
        return list.map((item) => {
          if (item.id === id) {
            return { ...item, ...updates };
          }
          if (item.subcategories) {
            return { ...item, subcategories: updateList(item.subcategories) };
          }
          return item;
        });
      };
      saveLocalCategories(updateList(categories));
      return { success: true };
    }

    try {
      const { error } = await supabase.from('categories').update(updates).eq('id', id);
      if (error) return { success: false, error: error.message };
      refreshData();
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Category update failed';
      return { success: false, error: msg };
    }
  };

  const deleteCategory = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin) return { success: false, error: 'Admin role required' };
    if (!isConfigured) {
      const filterList = (list: Category[]): Category[] => {
        return list
          .filter((item) => item.id !== id)
          .map((item) => ({
            ...item,
            subcategories: item.subcategories ? filterList(item.subcategories) : [],
          }));
      };
      saveLocalCategories(filterList(categories));
      return { success: true };
    }

    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
      refreshData();
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      return { success: false, error: msg };
    }
  };

  const publishedProjects = projects.filter((p) => p.is_published && p.status === 'published');
  const pendingProjects = projects.filter((p) => p.status === 'pending');

  return (
    <CMSDataContext.Provider
      value={{
        categories,
        projects,
        publishedProjects,
        pendingProjects,
        isLoading,
        refreshData,
        createProject,
        updateProject,
        deleteProject,
        duplicateProject,
        approveProject,
        rejectProject,
        togglePublish,
        toggleFeatured,
        createCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CMSDataContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSDataContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSDataProvider');
  }
  return context;
};
