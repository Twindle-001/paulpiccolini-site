/**
 * Patch script: creates the Contact Page and adds the button field to HomePage
 * WITHOUT touching any existing images or other data.
 *
 * Run with: SANITY_WRITE_TOKEN=your_token node scripts/patch-contact.mjs
 */

import { createClient } from "@sanity/client";

const projectId = "a8ul70gd";
const dataset = "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error("❌ SANITY_WRITE_TOKEN is required.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function patch() {
  console.log("🚀 Patching...\n");

  // 1. Create Contact Page (new document, safe to createOrReplace)
  console.log("📝 Creating Contact Page...");
  await client.createOrReplace({
    _id: "contactPage",
    _type: "contactPage",
    heroSubtitle: {
      fr: "Prendre contact",
      en: "Get in touch",
    },
    heroTitle: {
      fr: "Contact",
      en: "Contact",
    },
    intro: {
      fr: "N'hésitez pas à me contacter pour un shooting photo à Paris, un projet sur mesure, ou toute question sur mon travail. Je vous répondrai sous 24 heures.",
      en: "Feel free to contact me for a photoshoot in Paris, a custom project, or any question about my work. I'll get back to you within 24 hours.",
    },
    sentTitle: {
      fr: "Message envoyé !",
      en: "Message sent!",
    },
    sentText: {
      fr: "Merci pour votre message. Je vous répondrai dès que possible.",
      en: "Thank you for reaching out. I'll reply as soon as possible.",
    },
    errorText: {
      fr: "Une erreur est survenue. Réessayez ou envoyez-moi un email à paul.piccolini@gmail.com",
      en: "An error occurred. Please try again or email me directly at paul.piccolini@gmail.com",
    },
    submitButtonText: {
      fr: "Envoyer le message",
      en: "Send message",
    },
  });
  console.log("  ✅ Contact Page created");

  // 2. Patch HomePage to ADD the button field (without touching images or other fields)
  console.log("📝 Patching Home Page (adding button field only)...");
  await client
    .patch("homePage")
    .set({
      servicesOnRequestButton: {
        fr: "Me contacter",
        en: "Contact me",
      },
    })
    .commit();
  console.log("  ✅ Home Page patched (images preserved)");

  console.log("\n✨ Done! Refresh your Studio to see 'Page Contact'.");
}

patch().catch((err) => {
  console.error("❌ Patch failed:", err.message);
  process.exit(1);
});
