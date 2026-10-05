/**
 * Utility functions for validating and parsing YouTube URLs
 */

export interface ValidationResult {
  isValid: boolean;
  videoId: string | null;
  normalizedUrl: string | null;
  error?: string;
  errorCode?: 'EMPTY_URL' | 'INVALID_FORMAT' | 'UNSUPPORTED_HOST' | 'INVALID_ID';
}

const YOUTUBE_HOSTS = [
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtu.be',
  'www.youtu.be'
];

/**
 * Extracts YouTube video ID (11 characters) from various supported URL schemes
 */
export function extractYouTubeVideoId(input: string): string | null {
  if (!input || typeof input !== 'string') return null;

  const trimmed = input.trim();

  // If directly an 11-char alphanumeric ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    // Add protocol if missing for proper URL parsing
    let urlString = trimmed;
    if (!/^https?:\/\//i.test(urlString)) {
      urlString = 'https://' + urlString;
    }

    const url = new URL(urlString);
    const hostname = url.hostname.toLowerCase();

    // Verify it belongs to youtube or youtu.be
    const isSupportedHost = YOUTUBE_HOSTS.includes(hostname);

    if (!isSupportedHost || !['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.port) {
      return null;
    }

    // 1. youtu.be/VIDEO_ID
    if (hostname === 'youtu.be' || hostname === 'www.youtu.be') {
      const pathname = url.pathname.replace(/^\/+/, '');
      const potentialId = pathname.split('/')[0];
      if (potentialId && /^[a-zA-Z0-9_-]{11}$/.test(potentialId)) {
        return potentialId;
      }
    }

    // 2. youtube.com/watch?v=VIDEO_ID
    const vParam = url.pathname === '/watch' ? url.searchParams.get('v') : null;
    if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) {
      return vParam;
    }

    // 3. youtube.com/shorts/VIDEO_ID
    // 4. youtube.com/embed/VIDEO_ID
    // 5. youtube.com/v/VIDEO_ID
    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts.length >= 2) {
      const prefix = pathParts[0].toLowerCase();
      const potentialId = pathParts[1];
      if (['shorts', 'embed', 'v', 'live'].includes(prefix)) {
        if (potentialId && /^[a-zA-Z0-9_-]{11}$/.test(potentialId)) {
          return potentialId;
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Validates a user-supplied YouTube URL and provides friendly error messages
 */
export function validateYouTubeUrl(input: string): ValidationResult {
  if (!input || !input.trim()) {
    return {
      isValid: false,
      videoId: null,
      normalizedUrl: null,
      error: 'Please enter a YouTube video URL.',
      errorCode: 'EMPTY_URL'
    };
  }

  const trimmed = input.trim();

  // Basic host check
  try {
    let urlString = trimmed;
    if (!/^https?:\/\//i.test(urlString)) {
      urlString = 'https://' + urlString;
    }
    const url = new URL(urlString);
    const hostname = url.hostname.toLowerCase();
    const isSupported = YOUTUBE_HOSTS.includes(hostname);

    if (!isSupported && !/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return {
        isValid: false,
        videoId: null,
        normalizedUrl: null,
        error: 'Unsupported domain. Please provide a link from youtube.com or youtu.be.',
        errorCode: 'UNSUPPORTED_HOST'
      };
    }
  } catch {
    return {
      isValid: false,
      videoId: null,
      normalizedUrl: null,
      error: 'Invalid URL syntax. Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      errorCode: 'INVALID_FORMAT'
    };
  }

  const videoId = extractYouTubeVideoId(trimmed);

  if (!videoId) {
    return {
      isValid: false,
      videoId: null,
      normalizedUrl: null,
      error: 'Could not detect a valid 11-character YouTube video ID in this link.',
      errorCode: 'INVALID_ID'
    };
  }

  return {
    isValid: true,
    videoId,
    normalizedUrl: `https://www.youtube.com/watch?v=${videoId}`
  };
}
