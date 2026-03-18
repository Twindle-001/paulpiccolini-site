/**
 * Upload logo to Sanity and set it on siteSettings
 */
import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { createReadStream } from "fs";

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
  const logoPath = resolve(__dirname, "../public/og-image.jpg");

  // Use the original PNG from the Logo folder if accessible, otherwise use the public copy
  const pngPath = "/sessions/brave-nifty-planck/mnt/Site Web Vercel/Logo/logo site noir et blanc.png";

  let filePath;
  try {
    const { statSync } = await import("fs");
    statSync(pngPath);
    filePath = pngPath;
  } catch {
    filePath = logoPath;
  }

  console.log(`📤 Uploading logo from: ${filePath}`);

  const imageAsset = await client.assets.upload("image", createReadStream(filePath), {
    filename: "logo-paul-piccolini.png",
  });

  console.log(`✅ Uploaded: ${imageAsset._id}`);

  // Find siteSettings document
  const settings = await client.fetch(`*[_type == "siteSettings"][0]{ _id }`);

  if (!settings) {
    console.log("❌ No siteSettings document found");
    return;
  }

  console.log(`🔧 Patching siteSettings (${settings._id})...`);

  await client
    .patch(settings._id)
    .set({
      logo: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAsset._id,
        },
      },
    })
    .commit();

  console.log("✅ Logo updated in Sanity!");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
