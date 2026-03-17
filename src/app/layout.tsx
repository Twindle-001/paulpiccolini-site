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
    default: "Paul Piccolini Photography",
    template: "%s | Paul Piccolini",
  },
  description:
    "Photographe professionnel basé à Paris. Portraits, paysages urbains et voyages.",
  keywords: [
    "photographe Paris",
    "portrait photography",
    "shooting photo",
    "photographie urbaine",
    "photographie de voyage",
    "portraits professionnels",
    "tirages d'art",
  ],
  authors: [
    {
      name: "Paul Piccolini",
      url: "https://paulpiccolini.com",
    },
  ],
  metadataBase: new URL("https://paulpiccolini.com"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: "en_US",
    siteName: "Paul Piccolini Photography",
    title: "Paul Piccolini Photography",
    description:
      "Photographe professionnel basé à Paris. Portraits, paysages urbains et voyages.",
    url: "https://paulpiccolini.com",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Paul Piccolini Photography",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paul Piccolini Photography",
    description:
      "Photographe professionnel basé à Paris. Portraits, paysages urbains et voyages.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
