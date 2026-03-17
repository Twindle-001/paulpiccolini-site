/**
 * Cleanup duplicate categories and hero slides in Sanity.
 * Keeps only the ones created by the migration script (with fixed IDs).
 * Run with: SANITY_WRITE_TOKEN=your_token node scripts/cleanup-duplicates.mjs
 */

import { createClient } from "@sanity/client";

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error("❌ SANITY_WRITE_TOKEN required");
  process.exit(1);
}

const client = createClient({
  projectId: "a8ul70gd",
  dataset: "production",
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function cleanup() {
  console.log("🧹 Cleaning up duplicates...\n");

  // IDs we want to KEEP (created by migration)
  const keepCategoryIds = ["category-paris", "category-travel", "category-portrait"];
  const keepHeroIds = ["heroSlide-paris", "heroSlide-travel", "heroSlide-portrait"];
  const keepServiceIds = ["service-1h", "service-1h30", "service-2h"];

  // Find and delete duplicate categories
  const allCategories = await client.fetch('*[_type == "category"]{ _id, title }');
  console.log(`Found ${allCategories.length} categories:`);
  for (const cat of allCategories) {
    console.log(`  - ${cat._id}: ${cat.title}`);
    if (!keepCategoryIds.includes(cat._id) && !cat._id.startsWith("drafts.")) {
      console.log(`    ❌ Deleting duplicate: ${cat._id}`);
      await client.delete(cat._id);
    } else {
      console.log(`    ✅ Keeping`);
    }
  }

  // Find and delete duplicate hero slides
  const allSlides = await client.fetch('*[_type == "heroSlide"]{ _id, title }');
  console.log(`\nFound ${allSlides.length} hero slides:`);
  for (const slide of allSlides) {
    console.log(`  - ${slide._id}: ${JSON.stringify(slide.title)}`);
    if (!keepHeroIds.includes(slide._id) && !slide._id.startsWith("drafts.")) {
      console.log(`    ❌ Deleting duplicate: ${slide._id}`);
      await client.delete(slide._id);
    } else {
      console.log(`    ✅ Keeping`);
    }
  }

  // Find and delete duplicate services
  const allServices = await client.fetch('*[_type == "service"]{ _id, name }');
  console.log(`\nFound ${allServices.length} services:`);
  for (const svc of allServices) {
    console.log(`  - ${svc._id}: ${JSON.stringify(svc.name)}`);
    if (!keepServiceIds.includes(svc._id) && !svc._id.startsWith("drafts.")) {
      console.log(`    ❌ Deleting duplicate: ${svc._id}`);
      await client.delete(svc._id);
    } else {
      console.log(`    ✅ Keeping`);
    }
  }

  console.log("\n✨ Cleanup complete!");
}

cleanup().catch((err) => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});
