/**
 * Patch script: Migrate category titles from plain string to locale objects { fr, en }
 * Also sets portfolioSubheading and printsSubheading on homePage
 *
 * Usage:  node scripts/patch-categories-locale.mjs
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

// ─── Category title translations ─────────────────────────
const categoryTranslations = {
  paris: { fr: "Paris", en: "Paris" },
  voyage: { fr: "Voyage", en: "Travel" },
  travel: { fr: "Voyage", en: "Travel" },
  portrait: { fr: "Portrait", en: "Portrait" },
};

async function patchCategories() {
  console.log("📂 Fetching categories...");
  const categories = await client.fetch(
    `*[_type == "category"]{ _id, title, "slug": slug.current }`
  );

  for (const cat of categories) {
    const slug = cat.slug?.toLowerCase();
    const translation = categoryTranslations[slug];

    if (!translation) {
      console.log(`  ⚠️  No translation mapping for slug "${slug}" — skipping`);
      continue;
    }

    // Check if already migrated (title is already an object with fr/en)
    if (typeof cat.title === "object" && cat.title?.fr) {
      console.log(`  ✅ "${slug}" already has locale title — skipping`);
      continue;
    }

    console.log(`  🔄 Patching "${slug}": "${cat.title}" → { fr: "${translation.fr}", en: "${translation.en}" }`);
    await client
      .patch(cat._id)
      .set({
        title: {

          fr: translation.fr,
          en: translation.en,
        },
      })
      .commit();
  }

  console.log("✅ Categories patched!\n");
}

// ─── Home page subheadings ───────────────────────────────
async function patchHomePageSubheadings() {
  console.log("🏠 Fetching homePage...");
  const homePage = await client.fetch(
    `*[_type == "homePage"][0]{ _id, portfolioSubheading, printsSubheading }`
  );

  if (!homePage) {
    console.log("  ⚠️  No homePage document found");
    return;
  }

  const patches = {};

  if (!homePage.portfolioSubheading?.fr) {
    patches["portfolioSubheading"] = {
      _type: "localeString",
      fr: "Portfolio",
      en: "Portfolio",
    };
  }

  if (!homePage.printsSubheading?.fr) {
    patches["printsSubheading"] = {
      _type: "localeString",
      fr: "Tirages d'Art",
      en: "Art Prints",
    };
  }

  if (Object.keys(patches).length === 0) {
    console.log("  ✅ Subheadings already set — skipping");
    return;
  }

  console.log("  🔄 Setting subheadings:", Object.keys(patches).join(", "));
  await client.patch(homePage._id).set(patches).commit();
  console.log("✅ Home page subheadings patched!\n");
}

// ─── Run ─────────────────────────────────────────────────
async function main() {
  console.log("🚀 Starting locale migration...\n");
  await patchCategories();
  await patchHomePageSubheadings();
  console.log("🎉 All done!");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
