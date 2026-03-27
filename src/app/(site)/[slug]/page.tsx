import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PhotoGrid from "@/components/PhotoGrid";
import { LocaleString, T } from "@/components/LocaleText";
import { client } from "@/sanity/client";
import { urlFor, getHotspot } from "@/sanity/image";
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

// SEO-optimized metadata per category
const categoryMetaOverrides: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  paris: {
    title: "Photos de Paris — Galerie Street Photography",
    description:
      "Explorez Paris à travers l'objectif de Paul Piccolini. Galerie de photographies urbaines : monuments, ruelles secrètes, lumières de la ville lumière. Street photography et paysages urbains.",
    keywords: [
      "photo Paris",
      "galerie photo Paris",
      "street photography Paris",
      "photographie urbaine Paris",
      "photos monuments Paris",
      "Paris de nuit photo",
    ],
  },
  portrait: {
    title: "Portraits Artistiques — Galerie Photo | Paul Piccolini Photographe Paris",
    description:
      "Galerie de portraits artistiques par Paul Piccolini, photographe à Paris. Portraits en lumière naturelle, shootings en extérieur. Découvrez mon style et réservez votre séance.",
    keywords: [
      "portrait photographe Paris",
      "portrait artistique Paris",
      "photographe portrait professionnel",
      "shooting portrait Paris",
      "portrait lumière naturelle",
    ],
  },
  travel: {
    title: "Photographie de Voyage — Galerie & Récits du Monde",
    description:
      "Carnet photographique de voyages à travers le monde par Paul Piccolini. Thaïlande, Australie et bien plus. Découvrez des images authentiques capturées au fil de mes aventures.",
    keywords: [
      "photographie de voyage",
      "photo voyage monde",
      "photographe voyageur",
      "carnet photo voyage",
    ],
  },
};

// Dynamic metadata from Sanity, enhanced with SEO overrides
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

  const desc =
    typeof category.description === "string"
      ? category.description
      : category.description?.fr || category.description?.en || "";
  const titleStr =
    typeof category.title === "string"
      ? category.title
      : category.title?.fr || category.title?.en || "Category";

  // Use SEO override if available, otherwise use Sanity data
  const override = categoryMetaOverrides[slug];
  const finalTitle = override?.title || titleStr;
  const finalDesc =
    override?.description ||
    desc ||
    `Galerie ${titleStr} — Photographie par Paul Piccolini, photographe professionnel à Paris.`;

  return {
    title: finalTitle,
    description: finalDesc,
    keywords: override?.keywords,
    alternates: {
      canonical: `/${slug}`,
    },
    openGraph: {
      title: finalTitle,
      description: finalDesc,
      url: `https://paulpiccolini.com/${slug}`,
      type: "website",
      ...(category.coverImage && {
        images: [
          {
            url: urlFor(category.coverImage).width(1200).height(630).url(),
            width: 1200,
            height: 630,
            alt: titleStr,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDesc,
      ...(category.coverImage && {
        images: [urlFor(category.coverImage).width(1200).height(630).url()],
      }),
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

  // Sort subcategories by custom order defined in Sanity (category.subcategoryOrder)
  const orderedSubcategories = (() => {
    const order = (category as any).subcategoryOrder as string[] | undefined;
    if (!order || order.length === 0) return subcategories;
    // Sort: items in order array first (by their position), then the rest alphabetically
    const valid = subcategories.filter((s): s is string => s !== null);
    return valid.sort((a, b) => {
      const idxA = order.indexOf(a);
      const idxB = order.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  })();

  return (
    <>
      {/* Hero */}
      <section className="relative flex h-[40vh] sm:h-auto items-center justify-center overflow-hidden">
        {(() => {
          const desktopImg = category.bannerImage || category.coverImage;
          const mobileImg = category.bannerImageMobile || desktopImg;
          const altText = typeof category.title === "string" ? category.title : (category.title?.fr || category.title?.en || "Category");
          if (!desktopImg) return <div className="absolute inset-0 bg-brand-dark" />;
          return (
            <>
              {/* Desktop: fixed crop, scales proportionally — cadrage ne change jamais */}
              <img
                src={urlFor(desktopImg).width(1920).height(400).fit("crop").quality(85).url()}
                alt={altText}
                className="hidden sm:block w-full h-auto"
              />
              {/* Mobile: fills 40vh container with hotspot positioning */}
              <Image
                src={urlFor(mobileImg).width(800).quality(85).url()}
                alt={altText}
                fill
                className="object-cover sm:hidden"
                style={{ objectPosition: getHotspot(mobileImg) }}
                priority
                sizes="100vw"
              />
            </>
          );
        })()}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-full text-center px-6 pt-10 sm:pt-0">
            <p className="text-xs sm:text-sm uppercase tracking-menu font-medium text-white/50 mb-1 sm:mb-3">Portfolio</p>
          <h1 className="font-heading text-4xl sm:text-3xl md:text-5xl lg:text-6xl tracking-wider text-white">
            <LocaleString field={typeof category.title === "string" ? { fr: category.title, en: category.title } : category.title} />
          </h1>
          {category.description && (
            <p className="mt-2 sm:mt-4 text-sm sm:text-[11px] md:text-sm text-white/60 max-w-lg mx-auto leading-relaxed">
              <LocaleString field={typeof category.description === "string" ? { fr: category.description, en: category.description } : category.description} />
            </p>
          )}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 sm:pt-12 pb-16 sm:pb-24">
        {photos.length > 0 ? (
          <PhotoGrid photos={photos} subcategories={orderedSubcategories} />
        ) : (
          <p className="text-center text-brand-muted">
            <T fr="Photos à venir..." en="Photos coming soon..." />
          </p>
        )}
      </section>

      {/* CTA Portrait → Services */}
      {slug === "portrait" && (
        <section className="bg-brand-dark px-6 pb-20 pt-8 text-center">
          <p className="mx-auto max-w-lg text-sm text-brand-light/60 leading-relaxed">
            <T
              fr="Envie d’une séance photo portrait ? Découvrez mes formules et réservez votre créneau."
              en="Want a portrait photo session? Check out my packages and book your slot."
            />
          </p>
          <Link href="/services" className="btn-accent mt-6 inline-block">
            <T fr="Voir les offres" en="View packages" />
          </Link>
        </section>
      )}
    </>
  );
}
