import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services - Shooting Photo à Paris",
  description:
    "Offrez-vous un shooting photo professionnel à Paris. Portraits, couples, familles dans les lieux les plus emblématiques de la capitale. Tarifs et forfaits disponibles.",
  openGraph: {
    title: "Shooting Photo à Paris | Paul Piccolini",
    description:
      "Shooting photo professionnel à Paris. Portraits, couples, familles.",
    type: "website",
    url: "https://paulpiccolini.com/services",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
