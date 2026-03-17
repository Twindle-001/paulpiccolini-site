import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { client } from "@/sanity/client";
import { siteSettingsQuery, categoriesQuery } from "@/sanity/queries";
import type { SanitySettings, SanityCategory } from "@/sanity/types";

export const revalidate = 60;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, categories] = await Promise.all([
    client.fetch<SanitySettings>(siteSettingsQuery),
    client.fetch<SanityCategory[]>(categoriesQuery),
  ]);

  return (
    <Providers>
      <Navbar
        siteName={settings?.name}
        logo={settings?.logo}
        categories={categories.map((c) => ({
          title: c.title,
          slug: c.slug,
        }))}
      />
      <main>{children}</main>
      <Footer
        siteName={settings?.name}
        instagram={settings?.instagram}
        linkedin={settings?.linkedin}
        facebook={settings?.facebook}
        footerLinks={settings?.footerLinks}
      />
    </Providers>
  );
}
