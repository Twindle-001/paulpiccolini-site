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
  return {
    title: category.title,
    description: desc || `${category.title} photography by Paul Piccolini`,
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
      <section className="relative flex h-[60vh] items-center justify-center overflow-hidden">
        {category.coverImage ? (
          <Image
            src={urlFor(category.coverImage).width(1920).height(1080).url()}
            alt={category.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-brand-dark" />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center">
          <p className="section-subheading mb-4 text-white/50">Portfolio</p>
          <h1 className="font-heading text-6xl tracking-wider text-white md:text-7xl">
            {category.title}
          </h1>
        </div>
      </section>

      {/* Description */}
      {category.description && (
        <section className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="text-sm leading-relaxed text-brand-light/70">
            <LocaleString field={typeof category.description === "string" ? { fr: category.description, en: category.description } : category.description} />
          </p>
        </section>
      )}

      {/* Gallery */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
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
