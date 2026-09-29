// Security utilities for URL and input validation

/**
 * Validates that a URL uses safe protocols (http/https only)
 * Prevents javascript:, data:, vbscript: and other dangerous protocols
 */
export const isValidSafeUrl = (url: string | undefined | null): boolean => {
  if (!url || typeof url !== 'string') return false;

  try {
    const parsed = new URL(url);
    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

/**
 * Sanitizes a URL - returns the URL if safe, empty string otherwise
 */
export const sanitizeUrl = (url: string | undefined | null): string => {
  if (!url || typeof url !== 'string') return '';

  try {
    const parsed = new URL(url);
    if (['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
      return parsed.href;
    }
  } catch {
    // Not a valid URL
  }

  return '';
};

/**
 * Opens a URL safely - only opens if protocol is http/https
 */
export const openSafeUrl = (url: string | undefined | null): void => {
  const safeUrl = sanitizeUrl(url);
  if (safeUrl) {
    window.open(safeUrl, '_blank', 'noopener,noreferrer');
  }
};

/**
 * Validates YouTube channel ID format (UC followed by 22 alphanumeric chars)
 */
export const isValidYouTubeChannelId = (channelId: string | undefined | null): boolean => {
  if (!channelId || typeof channelId !== 'string') return false;
  return /^UC[a-zA-Z0-9_-]{22}$/.test(channelId);
};

/**
 * Validates that a string is safe for use as a location/address (not a URL)
 */
export const isValidLocationString = (location: string | undefined | null): boolean => {
  if (!location || typeof location !== 'string') return false;

  // Reject if it looks like a URL or dangerous protocol
  const dangerousPatterns = [
    /^javascript:/i,
    /^data:/i,
    /^vbscript:/i,
    /^file:/i,
    /^about:/i,
    /^blob:/i,
    /^https?:/i, // Explicitly reject standard URLs, they should be iframes
  ];

  return !dangerousPatterns.some((pattern) => pattern.test(location.trim()));
};

/**
 * Validates image URL - must be http/https and common image extensions or data:image
 */
export const isValidImageUrl = (url: string | undefined | null): boolean => {
  if (!url || typeof url !== 'string') return false;

  // Allow data URLs for images only
  if (url.startsWith('data:image/')) {
    return true;
  }

  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

/**
 * Escapes HTML special characters to prevent XSS
 */
export const escapeHtml = (str: string | undefined | null): string => {
  if (!str || typeof str !== 'string') return '';

  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Extracts a map URL from an iframe embed code or returns the URL directly
 */
export const extractMapSrc = (input: string | undefined | null): string | null => {
  if (!input || typeof input !== 'string') return null;
  if (input.includes('<iframe')) {
    const match = input.match(/src=["'](https:\/\/(www\.)?google\.com\/maps\/embed[^"']+)["']/i);
    return match ? match[1] : null;
  }
  if (
    input.startsWith('https://www.google.com/maps/embed') ||
    input.startsWith('https://maps.google.com/maps/embed')
  ) {
    return input;
  }
  return null;
};

/**
 * Validates domain format
 */
export const isValidDomain = (domain: string | undefined | null): boolean => {
  if (!domain || typeof domain !== 'string') return false;

  // Basic domain validation - alphanumeric, hyphens, dots
  return /^[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/.test(domain);
};

/**
 * Extracts a Facebook embed URL from an iframe or raw URL
 */
export const extractFacebookSrc = (input: string | undefined | null): string | null => {
  if (!input || typeof input !== 'string') return null;

  // If it's already an iframe, extract the src
  if (input.includes('<iframe')) {
    const match = input.match(/src=["']([^"']+)["']/i);
    if (match && match[1].includes('facebook.com/plugins/')) {
      return match[1];
    }
  }

  // If it's already an embed URL
  if (
    input.includes('facebook.com/plugins/page.php') ||
    input.includes('facebook.com/plugins/video.php')
  ) {
    return input;
  }

  // If it's a raw Facebook URL
  if (input.includes('facebook.com') || input.includes('fb.watch')) {
    const isVideo =
      input.includes('/videos/') || input.includes('/watch') || input.includes('fb.watch');
    if (isVideo) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(input)}&show_text=false&width=560`;
    } else {
      return `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(input)}&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`;
    }
  }

  return null;
};
