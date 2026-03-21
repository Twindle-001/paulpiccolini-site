import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Réservation Shooting Photo Paris | Paul Piccolini",
  description:
    "Contactez Paul Piccolini, photographe professionnel à Paris. Réservation de shooting photo, demande de tirages d'art ou projet sur mesure. Réponse garantie sous 24h.",
  keywords: [
    "contact photographe Paris",
    "réserver shooting photo Paris",
    "devis photographe Paris",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact — Réservation Shooting Photo Paris | Paul Piccolini",
    description:
      "Contactez Paul Piccolini pour un shooting photo à Paris ou un projet sur mesure.",
    type: "website",
    url: "https://paulpiccolini.com/contact",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
