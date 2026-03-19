import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Paul Piccolini, photographe professionnel à Paris. Demande de shooting photo, tirages d'art ou projet sur mesure. Réponse sous 24h.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact | Paul Piccolini Photography",
    description:
      "Contactez Paul Piccolini pour un shooting photo à Paris.",
    type: "website",
    url: "https://paulpiccolini.com/contact",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
