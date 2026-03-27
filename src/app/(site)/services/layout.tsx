import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Shooting Photo à Paris — Tarifs & Réservation",
  description:
    "Réservez votre shooting photo à Paris dès 150€. Portraits dans les lieux les plus emblématiques de la capitale. 5 à 15 photos retouchées, galerie privée en ligne. Livraison sous 72h.",
  keywords: [
    "shooting photo Paris",
    "shooting photo Paris prix",
    "photographe portrait Paris tarif",
    "séance photo Paris",
    "shooting photo couple Paris",
    "shooting photo Tour Eiffel",
    "offrir shooting photo Paris",
  ],
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Shooting Photo à Paris — Tarifs & Réservation | Paul Piccolini",
    description:
      "Réservez votre shooting photo à Paris dès 150€. Portraits dans les lieux les plus emblématiques de la capitale.",
    type: "website",
    images: [{ url: "https://paulpiccolini.com/og-image.jpg", width: 800, height: 800, alt: "Paul Piccolini - Photographe Paris" }],
    url: "https://paulpiccolini.com/services",
  },
};

// JSON-LD Service schema for rich snippets (tarifs visibles dans Google)
const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Shooting Photo",
  provider: {
    "@type": "Photographer",
    name: "Paul Piccolini",
    url: "https://paulpiccolini.com",
  },
  areaServed: {
    "@type": "City",
    name: "Paris",
  },
  description:
    "Shooting photo professionnel à Paris. Portraits dans les lieux les plus emblématiques de la ville lumière.",
  offers: [
    {
      "@type": "Offer",
      name: "Shooting 1h",
      description:
        "1 lieu au choix à Paris, 5 photos retouchées haute définition, galerie privée en ligne",
      price: "150",
      priceCurrency: "EUR",
      url: "https://paulpiccolini.com/services",
    },
    {
      "@type": "Offer",
      name: "Shooting 1h30",
      description:
        "2 lieux au choix à Paris, 10 photos retouchées haute définition, galerie privée en ligne, aide au choix des tenues",
      price: "220",
      priceCurrency: "EUR",
      url: "https://paulpiccolini.com/services",
    },
    {
      "@type": "Offer",
      name: "Shooting 2h",
      description:
        "3 lieux au choix à Paris, 15 photos retouchées haute définition, galerie privée en ligne, aide au choix des tenues, changement de look possible",
      price: "300",
      priceCurrency: "EUR",
      url: "https://paulpiccolini.com/services",
    },
  ],
};

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
      name: "Services",
      item: "https://paulpiccolini.com/services",
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={servicesSchema} />
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  );
}
