import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { JsonLd } from "@/components/JsonLd";
import { client } from "@/sanity/client";
import { siteSettingsQuery, categoriesQuery } from "@/sanity/queries";
import type { SanitySettings, SanityCategory } from "@/sanity/types";

export const revalidate = 60;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, categories] = await Promise.all([
    client.fetch<SanitySettings>(siteSettingsQuery),
    client.fetch<SanityCategory[]>(categoriesQuery),
  ]);

  // JSON-LD structured data for Photographer/Organization
  const photographerSchema = {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "Photographer"],
    "@id": "https://paulpiccolini.com/#photographer",
    name: "Paul Piccolini Photography",
    url: "https://paulpiccolini.com",
    description:
      "Photographe professionnel basé à Paris spécialisé en portraits artistiques, photographie urbaine et tirages d'art en édition limitée. Shooting photo sur mesure à Paris.",
    image: "https://paulpiccolini.com/og-image.jpg",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Paris",
      addressRegion: "Île-de-France",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 48.8566,
      longitude: 2.3522,
    },
    sameAs: [
      settings?.instagram || "https://instagram.com/paulpiccolini",
      settings?.linkedin || "https://linkedin.com/in/paulpiccolini",
      settings?.facebook || "https://facebook.com/paulpiccolini",
    ].filter(Boolean),
    priceRange: "€€",
    telephone: "",
    knowsAbout: [
      "Portrait Photography",
      "Street Photography",
      "Urban Photography",
      "Travel Photography",
      "Fine Art Prints",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Paul Piccolini Photography",
    url: "https://paulpiccolini.com",
    description:
      "Site officiel de Paul Piccolini, photographe professionnel à Paris. Galeries photo, shooting portraits et tirages d'art en édition limitée.",
    publisher: {
      "@type": "Person",
      name: "Paul Piccolini",
    },
    inLanguage: "fr-FR",
  };

  return (
    <Providers>
      <JsonLd data={photographerSchema} />
      <JsonLd data={websiteSchema} />
      <Navbar
        siteName={settings?.name}
        logo={settings?.logo}
        categories={categories.map((c) => ({
          title: c.title,
          slug: c.slug,
        }))}
      />
      <main>{children}</main>
      <Footer
        siteName={settings?.name}
        instagram={settings?.instagram}
        linkedin={settings?.linkedin}
        facebook={settings?.facebook}
        footerLinks={settings?.footerLinks}
      />
    </Providers>
  );
}
