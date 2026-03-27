import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { client } from "@/sanity/client";
import { printsQuery } from "@/sanity/queries";
import type { SanityPrint } from "@/sanity/types";
import { urlFor } from "@/sanity/image";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tirages d'Art Photo Paris — Édition Limitée",
  description:
    "Découvrez et acquérez des tirages d'art photographiques en édition limitée. Photos de Paris, voyages et portraits par Paul Piccolini. Impression fine art haute qualité, livraison France et international.",
  keywords: [
    "tirage d'art photo",
    "tirage photo édition limitée",
    "acheter tirage photo Paris",
    "tirage fine art photographe",
    "photo Paris décoration",
    "galerie photo Paris achat",
  ],
  alternates: {
    canonical: "/prints",
  },
  openGraph: {
    title: "Tirages d'Art Photo Paris — Édition Limitée | Paul Piccolini",
    description:
      "Tirages d'art photographiques en édition limitée par Paul Piccolini. Impression fine art haute qualité.",
    type: "website",
    images: [{ url: "https://paulpiccolini.com/og-image.jpg", width: 800, height: 800, alt: "Paul Piccolini - Photographe Paris" }],
    url: "https://paulpiccolini.com/prints",
  },
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch prints to generate Product schemas dynamically
  const prints = await client.fetch<SanityPrint[]>(printsQuery);

  const productSchemas = prints.map((print) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: print.title,
    image: print.image ? urlFor(print.image).width(600).url() : undefined,
    description: `Tirage d'art photographique "${print.title}" en édition limitée par Paul Piccolini. Impression fine art haute qualité.`,
    brand: {
      "@type": "Brand",
      name: "Paul Piccolini",
    },
    offers: {
      "@type": "Offer",
      price: print.price?.replace(/[^0-9]/g, "") || "360",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: print.externalLink || "https://paulpiccolini.com/prints",
      seller: {
        "@type": "Person",
        name: "Paul Piccolini",
      },
    },
    creator: {
      "@type": "Person",
      name: "Paul Piccolini",
    },
  }));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://paulpiccolini.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tirages d'Art",
        item: "https://paulpiccolini.com/prints",
      },
    ],
  };

  return (
    <>
      {productSchemas.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  );
}
