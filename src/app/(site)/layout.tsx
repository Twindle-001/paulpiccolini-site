import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { JsonLd } from "@/components/JsonLd";
import { client } from "@/sanity/client";
import { siteSettingsQuery, categoriesQuery, servicesQuery } from "@/sanity/queries";
import type { SanitySettings, SanityCategory, SanityService } from "@/sanity/types";
import ImageProtection from "@/components/ImageProtection";

export const revalidate = 60;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, categories, services] = await Promise.all([
    client.fetch<SanitySettings>(siteSettingsQuery),
    client.fetch<SanityCategory[]>(categoriesQuery),
    client.fetch<SanityService[]>(servicesQuery),
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
    potentialAction: [
      {
        "@type": "ReserveAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://paulpiccolini.com/booking",
          actionPlatform: [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform",
          ],
        },
        name: "Réserver un shooting photo",
      },
      {
        "@type": "CommunicateAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://paulpiccolini.com/contact",
          actionPlatform: [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform",
          ],
        },
        name: "Contacter Paul Piccolini",
      },
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

  // Schema.org Service for photo packages
  const serviceSchemaList = services.map((s) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name?.fr || "",
    provider: {
      "@type": "ProfessionalService",
      name: "Paul Piccolini Photography",
    },
    offers: {
      "@type": "Offer",
      price: s.price,
      priceCurrency: s.currency || "EUR",
    },
  }));

  return (
    <Providers>
        <ImageProtection />
      <JsonLd data={photographerSchema} />
      <JsonLd data={websiteSchema} />
      {serviceSchemaList.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
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
