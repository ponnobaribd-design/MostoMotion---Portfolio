import { MediaSourceType, MediaParseResult, CMSAspectRatio } from '../types/cms';

/**
 * Validates whether a string is a valid web URL with http/https protocol.
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Parses and identifies external media URLs, converting them into secure embed URLs.
 */
export function parseMediaUrl(rawUrl: string): MediaParseResult {
  const cleanUrl = (rawUrl || '').trim();

  if (!cleanUrl) {
    return {
      sourceType: 'other',
      embedUrl: '',
      rawUrl: '',
      isValid: false,
      errorMessage: 'URL is required',
    };
  }

  if (!isValidUrl(cleanUrl)) {
    return {
      sourceType: 'other',
      embedUrl: '',
      rawUrl: cleanUrl,
      isValid: false,
      errorMessage: 'Invalid URL format. Must start with http:// or https://',
    };
  }

  // 1. YouTube detection (watch?v=, youtu.be/, shorts/, embed/)
  const ytMatch = cleanUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      sourceType: 'youtube',
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&rel=0&modestbranding=1`,
      rawUrl: cleanUrl,
      isValid: true,
    };
  }

  // 2. Vimeo detection (vimeo.com/{id})
  const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/i);
  if (vimeoMatch && vimeoMatch[3]) {
    const videoId = vimeoMatch[3];
    return {
      sourceType: 'vimeo',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&autopause=0&background=0`,
      rawUrl: cleanUrl,
      isValid: true,
    };
  }

  // 3. Google Drive video preview detection (drive.google.com/file/d/{id}/...)
  const gdriveMatch = cleanUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (gdriveMatch && gdriveMatch[1]) {
    const fileId = gdriveMatch[1];
    return {
      sourceType: 'google_drive',
      videoId: fileId,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      rawUrl: cleanUrl,
      isValid: true,
    };
  }

  // 4. Direct video file extensions (.mp4, .webm, .mov, .m4v, or common CDN patterns)
  const isDirectVideo = /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(cleanUrl) ||
    cleanUrl.includes('commondatastorage.googleapis.com') ||
    cleanUrl.includes('assets.mixkit.co') ||
    cleanUrl.includes('cdn.pixabay.com/video');
  if (isDirectVideo) {
    return {
      sourceType: 'direct_mp4',
      embedUrl: cleanUrl,
      rawUrl: cleanUrl,
      isValid: true,
    };
  }

  // 5. Image extensions (.jpg, .jpeg, .png, .webp, .gif, .svg, or image CDN)
  const isImage = /\.(jpg|jpeg|png|webp|gif|svg|avif)(\?.*)?$/i.test(cleanUrl) ||
    cleanUrl.includes('images.unsplash.com') ||
    cleanUrl.includes('cdn.pixabay.com/photo');
  if (isImage) {
    return {
      sourceType: 'image',
      embedUrl: cleanUrl,
      rawUrl: cleanUrl,
      isValid: true,
    };
  }

  // 6. Generic web media fallback
  return {
    sourceType: 'other',
    embedUrl: cleanUrl,
    rawUrl: cleanUrl,
    isValid: true,
  };
}

/**
 * Returns Tailwind aspect-ratio classes corresponding to CMSAspectRatio
 */
export function getAspectRatioClasses(ratio: CMSAspectRatio): string {
  switch (ratio) {
    case '9:16':
      return 'aspect-[9/16]';
    case '16:9':
      return 'aspect-video';
    case '1:1':
      return 'aspect-square';
    case '4:5':
      return 'aspect-[4/5]';
    default:
      return 'aspect-video';
  }
}

/**
 * Computes numeric aspect ratio (width / height)
 */
export function getNumericAspectRatio(ratio: CMSAspectRatio): number {
  switch (ratio) {
    case '9:16':
      return 9 / 16;
    case '16:9':
      return 16 / 9;
    case '1:1':
      return 1;
    case '4:5':
      return 4 / 5;
    default:
      return 16 / 9;
  }
}
