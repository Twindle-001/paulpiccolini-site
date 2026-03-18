/**
 * Remove auto-generated titles from photos.
 * Unsets the "title" field on all photos that have one.
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

async function main() {
  console.log("🗑️  Removing auto-generated titles from photos...\n");

  const photos = await client.fetch(
    `*[_type == "photo" && defined(title)]{ _id, title, "filename": image.asset->originalFilename }`
  );

  console.log(`  Found ${photos.length} photos with titles\n`);

  let count = 0;
  for (const photo of photos) {
    console.log(`  🔄 "${photo.filename}" — removing title "${photo.title}"`);
    await client.patch(photo._id).unset(["title"]).commit();
    count++;
  }

  console.log(`\n✨ Done! Removed titles from ${count} photos.`);
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
