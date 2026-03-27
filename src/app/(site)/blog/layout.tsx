import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Photo Paris — Conseils, Coulisses & Voyages",
  description:
    "Conseils photo, coulisses de shootings à Paris et récits de voyages photographiques. Le blog de Paul Piccolini, photographe professionnel à Paris.",
  keywords: [
    "blog photo Paris",
    "conseils photographie",
    "coulisses shooting photo",
    "blog photographe professionnel",
    "spots photo Paris",
    "tutoriel photo",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog Photo Paris — Conseils, Coulisses & Voyages | Paul Piccolini",
    description:
      "Conseils photo, coulisses de shootings et récits de voyages par Paul Piccolini, photographe à Paris.",
    type: "website",
    images: [{ url: "https://paulpiccolini.com/og-image.jpg", width: 800, height: 800, alt: "Paul Piccolini - Photographe Paris" }],
    url: "https://paulpiccolini.com/blog",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
