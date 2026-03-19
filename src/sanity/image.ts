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
