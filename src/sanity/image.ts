import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "./client";

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Extract hotspot position from a Sanity image object
 * Returns CSS object-position value (e.g. "50% 30%")
 * Falls back to "center center" if no hotspot defined
 */
export function getHotspot(image: any): string {
  if (!image?.hotspot) return "center center";
  const x = Math.round(image.hotspot.x * 100);
  const y = Math.round(image.hotspot.y * 100);
  return `${x}% ${y}%`;
}

// ─── Image optimization helpers ───────────────────────────────────
// These bypass Vercel's image optimizer entirely and leverage Sanity CDN
// for on-the-fly resizing, format negotiation (AVIF/WebP/JPEG), and quality.

/** Standard responsive widths for srcset generation */
const SRCSET_WIDTHS = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

/** Quality presets by image context — higher for hero/prints, lower for thumbs */
export const QUALITY = {
  hero: 82,       // Full-screen sliders — high quality, large impact
  banner: 85,     // Category banners — high quality
  portfolio: 78,  // Portfolio cards — balanced
  print: 88,      // Art prints for sale — premium quality
  gallery: 78,    // Photo grid items — balanced
  lightbox: 85,   // Lightbox full view — high quality
  thumbnail: 65,  // Small thumbnails, avatars — low weight
  profile: 80,    // About section profile image
} as const;

/**
 * Build a srcset string for responsive images using Sanity CDN.
 * Each entry requests auto=format so the CDN negotiates AVIF > WebP > JPEG
 * based on the browser Accept header — zero extra work needed.
 *
 * @param source  Sanity image source
 * @param quality Quality level (1-100)
 * @param maxWidth Optional cap — no srcset entries above this width
 * @param height  Optional height constraint (for cropped images)
 */
export function buildSrcSet(
  source: SanityImageSource,
  quality: number,
  maxWidth?: number,
  height?: number
): string {
  const widths = maxWidth
    ? SRCSET_WIDTHS.filter((w) => w <= maxWidth)
    : SRCSET_WIDTHS;

  return widths
    .map((w) => {
      let b = urlFor(source).width(w).quality(quality).auto("format").fit("max");
      if (height) {
        const h = Math.round(height * (w / (maxWidth || w)));
        b = b.height(h);
      }
      return `${b.url()} ${w}w`;
    })
    .join(", ");
}

/**
 * Build the src for a single image at a specific width.
 * Always includes auto=format + fit=max for optimal delivery.
 */
export function buildSrc(
  source: SanityImageSource,
  width: number,
  quality: number,
  height?: number
): string {
  let b = urlFor(source).width(width).quality(quality).auto("format").fit("max");
  if (height) b = b.height(height);
  return b.url();
}
