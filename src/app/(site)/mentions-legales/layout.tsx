import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales | Paul Piccolini Photography",
  description:
    "Mentions légales du site Paul Piccolini Photography - Informations éditeur, hébergement et propriété intellectuelle.",
};

export default function MentionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
