import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Réservation | Paul Piccolini Photography",
  description: "Réservez votre séance photo avec Paul Piccolini.",
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
