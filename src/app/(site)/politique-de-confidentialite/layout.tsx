import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Paul Piccolini Photography",
  description:
    "Politique de confidentialité et protection des données personnelles du site Paul Piccolini Photography.",
};

export default function PolitiqueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
