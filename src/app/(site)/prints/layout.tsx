import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tirages d'Art",
  description:
    "Découvrez les tirages d'art de Paul Piccolini. Photographies de Paris, voyages et portraits disponibles en édition limitée sur Singulart.",
  alternates: {
    canonical: "/prints",
  },
  openGraph: {
    title: "Tirages d'Art | Paul Piccolini Photography",
    description: "Tirages d'art photographiques en édition limitée.",
    type: "website",
    url: "https://paulpiccolini.com/prints",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
