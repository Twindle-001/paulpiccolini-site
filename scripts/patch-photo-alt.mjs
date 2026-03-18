/**
 * Patch script: Generate alt text for photos missing alt descriptions
 *
 * This script:
 * 1. Fetches all photos from Sanity
 * 2. For photos with missing/empty alt text, generates descriptive alt text based on:
 *    - Photo title if available
 *    - Category name (catTitle)
 *    - Original filename (cleaned up)
 * 3. Patches the alt field for each photo that needs it
 * 4. Also generates a title if missing using cleaned filename
 *
 * Alt text format:
 * - "Photo de [category] à Paris par Paul Piccolini - [title or cleaned filename]"
 * - "Portrait photographique par Paul Piccolini - [title or cleaned filename]"
 * - "Photo de voyage par Paul Piccolini - [title or cleaned filename]"
 *
 * Usage:  node scripts/patch-photo-alt.mjs
 * Requires: NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in .env.local
 *           SANITY_API_TOKEN with write access
 */

import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "a8ul70gd",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

/**
 * Clean up filename: remove extension, replace dashes/underscores with spaces
 */
function cleanFilename(filename) {
  if (!filename) return "";
  // Remove file extension
  const withoutExt = filename.replace(/\.[^.]+$/, "");
  // Replace dashes and underscores with spaces, collapse multiple spaces
  return withoutExt.replace(/[-_]+/g, " ").trim();
}

/**
 * Generate alt text based on category and filename/title
 */
function generateAltText(catTitle, titleOrFilename) {
  const label = titleOrFilename || "Photo";

  if (catTitle?.toLowerCase() === "portrait") {
    return `Portrait photographique par Paul Piccolini - ${label}`;
  }

  if (catTitle?.toLowerCase() === "voyage") {
    return `Photo de voyage par Paul Piccolini - ${label}`;
  }

  // Default format for other categories (or if no category)
  if (catTitle) {
    return `Photo de ${catTitle} à Paris par Paul Piccolini - ${label}`;
  }

  return `Photo par Paul Piccolini - ${label}`;
}

/**
 * Generate title from cleaned filename
 */
function generateTitle(filename) {
  const cleaned = cleanFilename(filename);
  // Capitalize first letter of each word
  return cleaned
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function main() {
  console.log("🚀 Starting photo alt text generation...\n");

  console.log("📷 Fetching all photos...");
  const photos = await client.fetch(
    `*[_type == "photo"]{ _id, title, alt, "catTitle": category->title.fr, "filename": image.asset->originalFilename }`
  );

  if (!photos || photos.length === 0) {
    console.log("  ⚠️  No photos found");
    return;
  }

  console.log(`  Found ${photos.length} photos\n`);

  let patchedCount = 0;
  let skippedCount = 0;

  for (const photo of photos) {
    const photoId = photo._id;
    const hasAlt = photo.alt && photo.alt.trim() !== "";
    const hasTitle = photo.title && photo.title.trim() !== "";
    const filename = photo.filename || "";
    const catTitle = photo.catTitle || "";

    // Skip if it already has alt text
    if (hasAlt) {
      console.log(`  ✅ "${filename}" — already has alt text, skipping`);
      skippedCount++;
      continue;
    }

    // Determine what to use for description
    const descriptionLabel = hasTitle ? photo.title : cleanFilename(filename);

    if (!descriptionLabel) {
      console.log(
        `  ⚠️  "${filename}" — no title or filename available, skipping`
      );
      skippedCount++;
      continue;
    }

    // Generate alt text
    const generatedAlt = generateAltText(catTitle, descriptionLabel);

    console.log(`  🔄 "${filename}"`);
    console.log(`     → alt: "${generatedAlt}"`);

    // Patch only the alt field (never touch title)
    await client.patch(photoId).set({ alt: generatedAlt }).commit();
    patchedCount++;
  }

  console.log(`\n✨ Done!`);
  console.log(`  📝 Patched: ${patchedCount} photo${patchedCount !== 1 ? "s" : ""}`);
  console.log(`  ⏭️  Skipped: ${skippedCount} photo${skippedCount !== 1 ? "s" : ""}`);
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
