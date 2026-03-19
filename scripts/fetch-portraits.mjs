import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "a8ul70gd",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const photos = await client.fetch(`
  *[_type == "photo" && category->slug.current == "portrait"] | order(order asc) {
    _id,
    title,
    alt,
    subcategory,
    "imageUrl": image.asset->url,
    "originalFilename": image.asset->originalFilename
  }
`);

console.log(`Found ${photos.length} portrait photos:\n`);
photos.forEach((p, i) => {
  console.log(`${i+1}. [${p._id}]`);
  console.log(`   File: ${p.originalFilename || 'N/A'}`);
  console.log(`   Alt: ${p.alt || 'N/A'}`);
  console.log(`   URL: ${p.imageUrl}`);
  console.log('');
});
