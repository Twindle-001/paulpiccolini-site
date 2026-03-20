import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { JsonLd } from "@/components/JsonLd";
import { client } from "@/sanity/client";
import { siteSettingsQuery, categoriesQuery } from "@/sanity/queries";
import type { SanitySettings, SanityCategory } from "@/sanity/types";
import ImageProtection from "@/components/ImageProtection";

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
    name: "Paul Piccolini Photography",
    url: "https://paulpiccolini.com",
    description:
      "Photographe professionnel basé à Paris spécialisé dans les portraits, paysages urbains et voyages. Services de shooting photo sur mesure.",
    image: "https://paulpiccolini.com/og-image.jpg",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Paris",
      addressCountry: "FR",
    },
    sameAs: [
      settings?.instagram || "https://instagram.com/paulpiccolini",
      settings?.linkedin || "https://linkedin.com/in/paulpiccolini",
      settings?.facebook || "https://facebook.com/paulpiccolini",
    ].filter(Boolean),
    priceRange: "€€",
    telephone: "",
  };

  return (
    <Providers>
        <ImageProtection />
      <JsonLd data={photographerSchema} />
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
