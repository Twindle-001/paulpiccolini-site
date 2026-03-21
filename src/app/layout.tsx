import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: {
    default:
      "Paul Piccolini — Photographe à Paris | Portraits & Tirages d'Art",
    template: "%s | Paul Piccolini",
  },
  description:
    "Photographe professionnel à Paris spécialisé en portraits artistiques, photographie urbaine et tirages d'art en édition limitée. Réservez votre shooting photo ou découvrez mes galeries.",
  keywords: [
    "photographe Paris",
    "photographe portrait Paris",
    "shooting photo Paris",
    "photographie urbaine Paris",
    "photographie de voyage",
    "portraits professionnels Paris",
    "tirage d'art photo",
    "tirage photo édition limitée",
    "photographe professionnel Paris",
    "séance photo Paris",
  ],
  authors: [
    {
      name: "Paul Piccolini",
      url: "https://paulpiccolini.com",
    },
  ],
  creator: "Paul Piccolini",
  metadataBase: new URL("https://paulpiccolini.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: "en_US",
    siteName: "Paul Piccolini Photography",
    title:
      "Paul Piccolini — Photographe à Paris | Portraits & Tirages d'Art",
    description:
      "Photographe professionnel à Paris spécialisé en portraits artistiques, photographie urbaine et tirages d'art en édition limitée. Réservez votre shooting photo ou découvrez mes galeries.",
    url: "https://paulpiccolini.com",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Paul Piccolini — Photographe professionnel à Paris",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Paul Piccolini — Photographe à Paris | Portraits & Tirages d'Art",
    description:
      "Photographe professionnel à Paris spécialisé en portraits artistiques, photographie urbaine et tirages d'art en édition limitée.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // TODO: Remplace par ton vrai code Google Search Console !
  // Va sur https://search.google.com/search-console → Ajouter une propriété
  // → Méthode "balise HTML" → Copie le code
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
