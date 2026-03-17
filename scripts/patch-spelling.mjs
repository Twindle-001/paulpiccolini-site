/**
 * Patch script to fix spelling issues in Sanity content.
 * Run with: SANITY_WRITE_TOKEN=your_token node scripts/patch-spelling.mjs
 *
 * Uses patch (NOT createOrReplace) to safely update text without touching images.
 */

import { createClient } from "@sanity/client";

const projectId = "a8ul70gd";
const dataset = "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error(
    "❌ SANITY_WRITE_TOKEN is required.\n" +
      "SANITY_WRITE_TOKEN=your_token node scripts/patch-spelling.mjs"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// Helper to create Portable Text blocks from plain text paragraphs
function toBlocks(paragraphs) {
  return paragraphs.map((text) => ({
    _type: "block",
    _key: Math.random().toString(36).slice(2, 10),
    children: [
      {
        _type: "span",
        _key: Math.random().toString(36).slice(2, 10),
        text,
        marks: [],
      },
    ],
    markDefs: [],
    style: "normal",
  }));
}

async function patchSpelling() {
  console.log("🔧 Patching spelling issues in Sanity...\n");

  // Fix 1: "diplomé" → "diplômé" in homePage aboutText.fr
  console.log('📝 Fixing "diplomé" → "diplômé" in About text...');
  await client
    .patch("homePage")
    .set({
      "aboutText.fr": toBlocks([
        "Je suis Paul Piccolini, diplômé d'un Bachelor en Commerce et d'un Master en Communication. Mais en réalité, ces diplômes ne vous diront pas l'essentiel sur moi.",
        "Doté de compétences et d'un goût pour les arts graphiques depuis mon plus jeune âge, je me suis tourné vers la photographie en 2015 lors d'un voyage de 6 mois en Australie. Avant de partir, j'avais décidé d'investir dans un appareil reflex amateur qui m'a finalement accompagné dans toutes mes aventures et est devenu une partie intégrante de mon quotidien pendant plus de 5 ans. Ma passion pour la photographie s'est intensifiée, et avec elle mon regard s'est aiguisé.",
        "En 2020, après avoir dépassé les limites de mon premier appareil, j'étais désireux d'explorer de nouvelles possibilités techniques et visuelles, j'ai donc décidé de passer à un appareil professionnel. Les retours de mon public étaient positifs et j'ai décidé de franchir une nouvelle étape. C'est ainsi que j'ai fait le grand saut pour devenir photographe professionnel.",
        "Bienvenue sur mon site où vous trouverez mon portfolio, mes services de portrait ainsi que mes tirages d'art.",
      ]),
    })
    .commit();
  console.log("  ✅ Fixed");

  // Fix 2: Minor English grammar improvement in aboutText.en
  console.log("📝 Fixing English About text (minor grammar)...");
  await client
    .patch("homePage")
    .set({
      "aboutText.en": toBlocks([
        "I am Paul Piccolini, I graduated with a Bachelor in Business and a Master in Communication. But in reality, these degrees won't tell you what matters most about me.",
        "Having skills and an appetite for the graphic arts from a young age, I turned to photography in 2015 during a 6-month trip to Australia. Before leaving, I had decided to invest in an amateur reflex camera which eventually accompanied me on all my adventures and then became an integral part of my daily life for more than 5 years. My passion for photography intensified, and with it my eye sharpened.",
        "In 2020, after having outgrown my first camera, I was eager to explore new technical and visual possibilities so I decided to upgrade to a professional camera. The feedback from my audience was positive and I decided to take a new step forward. This is how I took the plunge into becoming a professional photographer.",
        "Welcome to my website where you will find my portfolio, my portrait services as well as my prints.",
      ]),
    })
    .commit();
  console.log("  ✅ Fixed");

  // Fix 3: French typography — space before ? in servicesPage ctaHeading
  console.log("📝 Fixing French typography in Services CTA...");
  await client
    .patch("servicesPage")
    .set({
      "ctaHeading.fr": "Vous n'avez pas trouvé ce que vous cherchiez ?",
    })
    .commit();
  console.log("  ✅ Fixed");

  console.log("\n✨ All spelling fixes applied!");
}

patchSpelling().catch((err) => {
  console.error("❌ Patch failed:", err.message);
  process.exit(1);
});
