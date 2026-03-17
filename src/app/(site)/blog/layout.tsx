import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Blog de Paul Piccolini, photographe à Paris. Conseils photo, récits de voyage et coulisses de mes shootings.",
  openGraph: {
    title: "Blog | Paul Piccolini Photography",
    description: "Blog photo : conseils, voyages et coulisses.",
    type: "website",
    url: "https://paulpiccolini.com/blog",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
