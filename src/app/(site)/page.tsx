"use client";

import Image from "next/image";
import Link from "next/link";
import { PortableText } from "next-sanity";
import { useEffect, useState } from "react";
import HeroSlider from "@/components/HeroSlider";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import {
  siteSettingsQuery,
  heroSlidesQuery,
  categoriesQuery,
  homePageQuery,
  printsQuery,
} from "@/sanity/queries";
import type {
  SanitySettings,
  SanityHeroSlide,
  SanityCategory,
  SanityHomePage,
  SanityPrint,
} from "@/sanity/types";
import { useLanguage } from "@/context/LanguageContext";
import { localize, getLocalizedArray } from "@/lib/localize";

export default function HomePage() {
  const [data, setData] = useState<{
    settings?: SanitySettings;
    homePage?: SanityHomePage;
    heroSlides: SanityHeroSlide[];
    categories: SanityCategory[];
    prints: SanityPrint[];
  }>({
    heroSlides: [],
    categories: [],
    prints: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const { locale } = useLanguage();

  useEffect(() => {
    async function fetchData() {
      const [settings, homePage, heroSlides, categories, prints] =
        await Promise.all([
          client.fetch<SanitySettings>(siteSettingsQuery),
          client.fetch<SanityHomePage>(homePageQuery),
          client.fetch<SanityHeroSlide[]>(heroSlidesQuery),
          client.fetch<SanityCategory[]>(categoriesQuery),
          client.fetch<SanityPrint[]>(printsQuery),
        ]);

      setData({
        settings,
        homePage,
        heroSlides,
        categories,
        prints,
      });
      setIsLoading(false);
    }

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="h-screen bg-brand-darker" />;
  }

  const { settings, homePage, heroSlides, categories, prints } = data;

  return (
    <>
      {/* Hero Slider */}
      <HeroSlider slides={heroSlides} />

      {/* About Section */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid gap-16 md:grid-cols-2 md:items-center">
          {/* Portrait image */}
          <div className="relative aspect-square overflow-hidden">
            {homePage?.profileImage ? (
              <Image
                src={urlFor(homePage.profileImage).width(800).url()}
                alt={settings?.name || "Paul Piccolini"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 bg-brand-dark" />
            )}
          </div>

          {/* Text */}
          <div>
            <p className="section-subheading mb-4">
              {locale === "en" ? "About" : "À propos"}
            </p>
            <h2 className="section-heading mb-8">
              {localize(homePage?.aboutHeading, locale) ||
                (locale === "en"
                  ? "Your Photographer in Paris"
                  : "Votre Photographe à Paris")}
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-brand-light/70">
              {homePage?.aboutText ? (
                <PortableText
                  value={getLocalizedArray(homePage.aboutText, locale)}
                />
              ) : (
                <p>
                  {locale === "en"
                    ? "I am Paul Piccolini, a professional photographer based in Paris. Welcome to my portfolio."
                    : "Je suis Paul Piccolini, photographe professionnel basé à Paris. Bienvenue dans mon portfolio."}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Preview — dynamic categories */}
      <section className="bg-brand-dark py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <p className="section-subheading mb-4">
              Portfolio
            </p>
            <h2 className="section-heading">
              {localize(homePage?.portfolioHeading, locale) ||
                (locale === "en" ? "Explore My Work" : "Découvrez mon travail")}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/${cat.slug}`}
                className="group relative aspect-[3/4] overflow-hidden"
              >
                {cat.coverImage ? (
                  <Image
                    src={urlFor(cat.coverImage).width(800).height(1067).url()}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-brand-dark" />
                )}
                <div className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="font-heading text-3xl tracking-wider text-white">
                      {cat.title}
                    </h3>
                    <span className="mt-3 inline-block border-b border-white/40 pb-1 text-xs uppercase tracking-menu text-white/70 transition-all duration-300 group-hover:border-white group-hover:text-white">
                      {locale === "en" ? "Discover" : "Découvrir"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Photoshoot */}
          <div className="group relative aspect-video overflow-hidden">
            {homePage?.servicesImage ? (
              <Image
                src={urlFor(homePage.servicesImage).width(800).height(450).url()}
                alt="Paris Photoshoot"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 bg-brand-dark" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
            <div className="absolute bottom-0 p-8">
              <h3 className="font-heading text-2xl text-white">
                {localize(homePage?.servicesHeading, locale) ||
                  (locale === "en"
                    ? "Paris Photoshoots"
                    : "Photoshoots à Paris")}
              </h3>
              <p className="mt-2 text-sm text-white/60">
                {localize(homePage?.servicesIntro, locale) ||
                  (locale === "en"
                    ? "Gift yourself or others a photoshoot in the most iconic places of Paris."
                    : "Offrez-vous ou offrez à quelqu'un un photoshoot dans les lieux les plus emblématiques de Paris.")}
              </p>
              <Link
                href="/services"
                className="mt-4 inline-block text-xs uppercase tracking-menu text-brand-accent"
              >
                {locale === "en" ? "See prices" : "Voir les tarifs"} &rarr;
              </Link>
            </div>
          </div>

          {/* Custom request */}
          <div className="relative flex flex-col justify-center overflow-hidden rounded border border-white/5 bg-brand-dark p-10">
            {homePage?.servicesOnRequestImage && (
              <>
                <Image
                  src={urlFor(homePage.servicesOnRequestImage).width(800).height(600).url()}
                  alt="Services sur demande"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/60" />
              </>
            )}
            <h3 className="relative z-10 font-heading text-2xl text-white">
              {localize(homePage?.servicesOnRequestHeading, locale) ||
                (locale === "en" ? "Services on Request" : "Services sur demande")}
            </h3>
            <p className="relative z-10 mt-4 text-sm leading-relaxed text-brand-light/60">
              {localize(homePage?.servicesOnRequestText, locale) ||
                (locale === "en"
                  ? "Interior, events or other requests... Send me a request by email explaining your project."
                  : "Intérieur, événements ou autres demandes... Envoyez-moi une demande par email en expliquant votre projet.")}
            </p>
            <Link href="/contact" className="relative z-10 btn-primary mt-8 self-start">
              {localize(homePage?.servicesOnRequestButton, locale) ||
                (locale === "en" ? "Contact me" : "Me contacter")}
            </Link>
          </div>
        </div>
      </section>

      {/* Prints Section */}
      {prints && prints.length > 0 && (
        <section className="border-t border-white/5 bg-brand-dark py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-16 text-center">
              <p className="section-subheading mb-4">
                {locale === "en" ? "Art Prints" : "Tirages d'Art"}
              </p>
              <h2 className="section-heading">
                {localize(homePage?.printsHeading, locale) ||
                  (locale === "en"
                    ? "Fine Art Prints Collection"
                    : "Tirage d'Art - Singulart")}
              </h2>
              <p className="mt-4 text-sm text-brand-light/60 mx-auto max-w-2xl">
                {locale === "en"
                  ? "Explore and acquire high-quality art prints from my photographic collections."
                  : "Découvrez et acquérez des tirages d'art de haute qualité de mes collections photographiques."}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {prints.slice(0, 6).map((print) => (
                <a
                  key={print._id}
                  href={print.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded border border-white/10 hover:border-brand-accent/50 transition-all duration-300"
                >
                  {print.image && (
                    <div className="relative aspect-square overflow-hidden bg-brand-darker">
                      <Image
                        src={urlFor(print.image).width(600).height(600).url()}
                        alt={print.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-heading text-lg text-white">
                      {print.title}
                    </h3>
                    <p className="mt-2 text-sm text-brand-accent font-semibold">
                      {print.price}
                    </p>
                    <p className="mt-3 text-xs uppercase tracking-menu text-brand-muted group-hover:text-white transition-colors">
                      {locale === "en" ? "View on Singulart" : "Voir sur Singulart"}{" "}
                      &rarr;
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {homePage?.printsLink && (
              <div className="mt-12 text-center">
                <a
                  href={homePage.printsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent inline-block"
                >
                  {locale === "en"
                    ? "View All Prints"
                    : "Voir tous les tirages"}{" "}
                  &rarr;
                </a>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
