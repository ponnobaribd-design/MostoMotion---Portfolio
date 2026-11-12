import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Project, Category, UserProfile, SiteSetting, ProjectStatus } from '../types/cms';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseUrl.includes('.supabase.co') &&
    supabaseAnonKey.length > 20
  );
};

// Create client or fallback safe client
export const supabase: SupabaseClient = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createClient('https://placeholder-project.supabase.co', 'placeholder-anon-key-01234567890123456789012345', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

/**
 * Data access helpers with fallback handling
 */
export async function fetchPublishedProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      category:categories!projects_category_id_fkey(*)
    `)
    .eq('is_published', true)
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('[Supabase] fetchPublishedProjects error:', error.message);
    return [];
  }

  return (data as Project[]) || [];
}

export async function fetchAllCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.warn('[Supabase] fetchAllCategories error:', error.message);
    return [];
  }

  // Build hierarchical category tree (parent -> subcategories)
  const allCategories = (data as Category[]) || [];
  const parents = allCategories.filter((c) => !c.parent_id);
  const children = allCategories.filter((c) => c.parent_id);

  parents.forEach((p) => {
    p.subcategories = children
      .filter((c) => c.parent_id === p.id)
      .sort((a, b) => a.sort_order - b.sort_order);
  });

  return parents;
}

export async function fetchAdminProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      category:categories!projects_category_id_fkey(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as Project[]) || [];
}

export async function fetchModeratorSubmissions(userId: string): Promise<Project[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      category:categories!projects_category_id_fkey(*)
    `)
    .eq('submitted_by', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as Project[]) || [];
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.warn('[Supabase] getUserProfile error:', error.message);
    return null;
  }

  return data as UserProfile;
}
