/**
 * Patch script: Fix duplicate subheading/heading for Portfolio and Prints sections
 *
 * Before: subheading="Portfolio" + heading="PORTFOLIO" (same word twice)
 * After:  subheading="Portfolio" + heading="Découvrez mon travail" / "Explore My Work"
 *
 * Before: subheading="Tirages d'Art" + heading="TIRAGES D'ART" (same word twice)
 * After:  subheading="Tirages d'Art" + heading="Collection Singulart" / "Singulart Collection"
 *
 * Usage:  node scripts/patch-headings.mjs
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
  console.log("🏠 Fetching homePage...");
  const homePage = await client.fetch(
    `*[_type == "homePage"][0]{ _id, portfolioHeading, printsHeading }`
  );

  if (!homePage) {
    console.log("  ⚠️  No homePage document found");
    return;
  }

  console.log("  Current portfolioHeading:", JSON.stringify(homePage.portfolioHeading));
  console.log("  Current printsHeading:", JSON.stringify(homePage.printsHeading));

  console.log("\n🔄 Patching headings to avoid duplication with subheadings...");

  await client
    .patch(homePage._id)
    .set({
      portfolioHeading: {
        fr: "Découvrez mon travail",
        en: "Explore My Work",
      },
      printsHeading: {
        fr: "Collection Singulart",
        en: "Singulart Collection",
      },
    })
    .commit();

  console.log("✅ Headings patched!");
  console.log("   Portfolio: subheading='Portfolio' + heading='Découvrez mon travail'");
  console.log("   Prints: subheading='Tirages d'Art' + heading='Collection Singulart'");
  console.log("\n💡 Tu peux modifier ces textes depuis le Sanity Studio à tout moment.");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
