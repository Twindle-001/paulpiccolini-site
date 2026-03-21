import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente | Paul Piccolini Photography",
  description: "CGV des prestations de photographie de Paul Piccolini.",
};

export default function CGVLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
