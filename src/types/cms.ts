export type UserRole = 'admin' | 'moderator';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  // Computed / hydrated fields
  subcategories?: Category[];
}

export type ProjectStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'published';

export type MediaType = 'video' | 'image' | 'embed';

export type MediaSourceType = 
  | 'direct_mp4' 
  | 'youtube' 
  | 'vimeo' 
  | 'google_drive' 
  | 'image' 
  | 'other';

export type CMSAspectRatio = '9:16' | '16:9' | '1:1' | '4:5';

export interface Project {
  id: string;
  title: string;
  description: string | null;
  category_id: string;
  media_type: MediaType;
  source_type: MediaSourceType;
  media_url: string;
  poster_url: string | null;
  aspect_ratio: CMSAspectRatio;
  is_featured: boolean;
  is_published: boolean;
  status: ProjectStatus;
  submitted_by: string | null;
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Associated hydrated data
  category?: Category;
  parent_category?: Category;
}

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: Record<string, unknown> | string | number | boolean;
  updated_at: string;
}

export interface MediaParseResult {
  sourceType: MediaSourceType;
  embedUrl: string;
  rawUrl: string;
  isValid: boolean;
  videoId?: string;
  errorMessage?: string;
}
