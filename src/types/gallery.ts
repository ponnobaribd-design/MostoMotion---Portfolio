export type MediaCategory = 'Motion Graphics' | 'Video Editing' | 'Graphic Design';

export type MotionGraphicsSub = 
  | 'Restaurant Ads' 
  | 'Promotional / Commercial Video' 
  | 'Before / After' 
  | 'Logo & Title Animation';

export type VideoEditingSub = 
  | 'Podcast Editing' 
  | 'Short-form Content' 
  | 'Before / After' 
  | 'Educational Content' 
  | 'Restaurant Ads';

export type GraphicDesignSub = 
  | 'Social Media Creatives' 
  | 'YouTube Thumbnails' 
  | 'AI Generated Concept Art';

export type SubCategory = MotionGraphicsSub | VideoEditingSub | GraphicDesignSub;

export type MediaOrientation = 'horizontal' | 'vertical';
export type AspectRatio = '16:9' | '9:16' | '1:1';

export interface GalleryMediaItem {
  id: string;
  title: string;
  category: MediaCategory;
  subCategory: SubCategory;
  orientation: MediaOrientation;
  aspectRatio: AspectRatio;
  videoUrl?: string;
  thumbnail: string;
  youtubeId?: string;
  client?: string;
  year?: string;
  tags?: string[];
  metrics?: string;
  description?: string;
}

export interface CategoryStructure {
  category: MediaCategory;
  icon: string;
  subCategories: SubCategory[];
}
