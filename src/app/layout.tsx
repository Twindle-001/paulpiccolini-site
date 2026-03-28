import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
});

const GA_MEASUREMENT_ID = "G-JRHRR0H6Y5";

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
  // Validation Google Search Console effectuée via DNS (sc-domain:paulpiccolini.com)
  // Propriété URL-prefix (https://paulpiccolini.com/) également vérifiée automatiquement
  // Fichier de vérification : google889f04ac6adef8f1.html
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
