import type { Metadata } from "next";
import Image from "next/image";
import PhotoGrid from "@/components/PhotoGrid";
import { LocaleString, T } from "@/components/LocaleText";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import {
  categoryBySlugQuery,
  photosByCategoryQuery,
  subcategoriesByCategoryQuery,
  categoriesQuery,
} from "@/sanity/queries";
import type { SanityCategory, SanityPhoto } from "@/sanity/types";
import { notFound } from "next/navigation";

export const revalidate = 60;

// Generate static params for all categories
export async function generateStaticParams() {
  const categories = await client.fetch<SanityCategory[]>(categoriesQuery);
  return categories.map((cat) => ({ slug: cat.slug }));
}

// Dynamic metadata from Sanity
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await client.fetch<SanityCategory>(categoryBySlugQuery, {
    slug,
  });
  if (!category) return { title: "Not Found" };
  const desc = typeof category.description === "string"
    ? category.description
    : category.description?.fr || category.description?.en || "";
  const titleStr = typeof category.title === "string"
    ? category.title
    : category.title?.fr || category.title?.en || "Category";
  return {
    title: titleStr,
    description: desc || `${titleStr} photography by Paul Piccolini`,
    alternates: {
      canonical: `/${slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [category, photos, subcategories] = await Promise.all([
    client.fetch<SanityCategory>(categoryBySlugQuery, { slug }),
    client.fetch<SanityPhoto[]>(photosByCategoryQuery, { slug }),
    client.fetch<(string | null)[]>(subcategoriesByCategoryQuery, { slug }),
  ]);

  if (!category) notFound();

  return (
    <>
      {/* Hero */}
      <section className="relative flex h-[40vh] sm:h-[60vh] items-center justify-center overflow-hidden">
        {(category.bannerImage || category.coverImage) ? (
          <Image
            src={urlFor(category.bannerImage || category.coverImage).width(1920).height(600).fit("crop").url()}
            alt={typeof category.title === "string" ? category.title : (category.title?.fr || category.title?.en || "Category")}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-brand-dark" />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 w-full text-center px-6 pt-10 sm:pt-0">
          <p className="text-xs sm:text-[10px] uppercase tracking-menu font-medium text-white/50 mb-1 sm:mb-3">Portfolio</p>
          <h1 className="font-heading text-4xl sm:text-3xl md:text-5xl lg:text-6xl tracking-wider text-white">
            <LocaleString field={typeof category.title === "string" ? { fr: category.title, en: category.title } : category.title} />
          </h1>
          {category.description && (
            <p className="mt-2 sm:mt-4 text-sm sm:text-[11px] md:text-sm text-white/60 max-w-lg mx-auto leading-relaxed">
              <LocaleString field={typeof category.description === "string" ? { fr: category.description, en: category.description } : category.description} />
            </p>
          )}
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 sm:pt-12 pb-16 sm:pb-24">
        {photos.length > 0 ? (
          <PhotoGrid photos={photos} subcategories={subcategories} />
        ) : (
          <p className="text-center text-brand-muted">
            <T fr="Photos à venir..." en="Photos coming soon..." />
          </p>
        )}
      </section>
    </>
  );
}
