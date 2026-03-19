/**
 * Sort portrait photos into "Indoor" or "Outdoor" subcategories.
 *
 * The script analyses each photo's filename and image URL to make a best guess,
 * then applies the subcategory in Sanity.
 *
 * How it works:
 * 1. Fetches all portrait photos
 * 2. For each photo, opens the image URL so you can see it
 * 3. Uses filename hints to guess indoor/outdoor
 * 4. Applies the subcategory to Sanity
 *
 * Usage:
 *   node scripts/sort-portraits.mjs          # auto-sort based on filename hints
 *   node scripts/sort-portraits.mjs --dry    # preview only, no changes
 *   node scripts/sort-portraits.mjs --ask    # ask for each photo interactively
 *
 * Requires: SANITY_API_TOKEN in .env.local
 */

import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import * as readline from "readline";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "a8ul70gd",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const isDry = process.argv.includes("--dry");
const isAsk = process.argv.includes("--ask");

// Keywords that suggest indoor or outdoor
const outdoorKeywords = [
  "outdoor", "outside", "street", "rue", "jardin", "garden", "park", "parc",
  "pont", "bridge", "tour", "tower", "eiffel", "seine", "river", "plage",
  "beach", "montagne", "mountain", "forest", "foret", "forêt", "lac", "lake",
  "champ", "field", "terrasse", "balcon", "roof", "toit", "exterieur",
  "ext", "ville", "city", "urban", "trocadero", "louvre", "sacre",
  "montmartre", "marais", "bastille", "opera", "concorde", "invalides",
  "arc", "champs", "avenue", "boulevard", "quai", "berge", "canal",
  "neige", "snow", "pluie", "rain", "soleil", "sun", "coucher", "sunset",
  "sky", "ciel", "nature", "vert", "green", "arbre", "tree",
];

const indoorKeywords = [
  "indoor", "inside", "studio", "interieur", "interior", "chambre", "room",
  "salon", "living", "cuisine", "kitchen", "restaurant", "cafe", "café",
  "hotel", "hôtel", "bureau", "office", "salle", "hall", "galerie",
  "gallery", "musee", "museum", "atelier", "workshop", "maison", "house",
  "appartement", "apartment", "lit", "bed", "fenetre", "window",
  "miroir", "mirror", "escalier", "stair", "couloir", "corridor",
  "bibliothèque", "library", "bar", "club", "spa",
];

function guessSubcategory(filename, alt) {
  const text = `${filename || ""} ${alt || ""}`.toLowerCase();

  let outdoorScore = 0;
  let indoorScore = 0;

  for (const kw of outdoorKeywords) {
    if (text.includes(kw)) outdoorScore++;
  }
  for (const kw of indoorKeywords) {
    if (text.includes(kw)) indoorScore++;
  }

  if (outdoorScore > indoorScore) return "Outdoor";
  if (indoorScore > outdoorScore) return "Indoor";
  return null; // can't determine
}

function askUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((res) => {
    rl.question(question, (answer) => {
      rl.close();
      res(answer.trim().toLowerCase());
    });
  });
}

async function main() {
  console.log("📸 Fetching portrait photos from Sanity...\n");

  const photos = await client.fetch(`
    *[_type == "photo" && category->slug.current == "portrait"] | order(order asc) {
      _id,
      alt,
      subcategory,
      "originalFilename": image.asset->originalFilename,
      "imageUrl": image.asset->url
    }
  `);

  console.log(`Found ${photos.length} portrait photos.\n`);

  if (photos.length === 0) {
    console.log("No photos found. Check that the category slug is 'portrait'.");
    return;
  }

  const results = { Indoor: 0, Outdoor: 0, skipped: 0 };

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const name = photo.originalFilename || "unknown";
    let sub = guessSubcategory(name, photo.alt);

    console.log(`${i + 1}/${photos.length}: ${name}`);
    console.log(`   Alt: ${photo.alt || "N/A"}`);
    console.log(`   Current subcategory: ${photo.subcategory || "none"}`);
    console.log(`   Image: ${photo.imageUrl}`);
    console.log(`   Auto-guess: ${sub || "❓ unknown"}`);

    if (isAsk || !sub) {
      const answer = await askUser(
        `   → Enter subcategory (i=Indoor, o=Outdoor, s=Skip): `
      );
      if (answer === "i" || answer === "indoor") sub = "Indoor";
      else if (answer === "o" || answer === "outdoor") sub = "Outdoor";
      else {
        console.log("   ⏭️ Skipped\n");
        results.skipped++;
        continue;
      }
    }

    console.log(`   ✅ → ${sub}`);

    if (!isDry) {
      await client
        .patch(photo._id)
        .set({ subcategory: sub })
        .commit();
      console.log("   💾 Saved to Sanity");
    } else {
      console.log("   (dry run — not saved)");
    }

    results[sub]++;
    console.log("");
  }

  console.log("\n📊 Summary:");
  console.log(`   Indoor:  ${results.Indoor}`);
  console.log(`   Outdoor: ${results.Outdoor}`);
  console.log(`   Skipped: ${results.skipped}`);
  if (isDry) console.log("\n⚠️  Dry run — no changes were made.");
  else console.log("\n✅ Done! Subcategories updated in Sanity.");
}

main().catch(console.error);
