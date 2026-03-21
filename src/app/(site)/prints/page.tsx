"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { client } from "@/sanity/client";
import { urlFor, getHotspot } from "@/sanity/image";
import { printsQuery, printsPageQuery } from "@/sanity/queries";
import type { SanityPrint, SanityPrintsPage } from "@/sanity/types";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { localize } from "@/lib/localize";

export default function PrintsPage() {
  const [prints, setPrints] = useState<SanityPrint[]>([]);
  const [pageData, setPageData] = useState<SanityPrintsPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { locale } = useLanguage();

  useEffect(() => {
    async function fetchData() {
      const [printsData, pageInfo] = await Promise.all([
        client.fetch<SanityPrint[]>(printsQuery),
        client.fetch<SanityPrintsPage>(printsPageQuery),
      ]);
      setPrints(printsData);
      setPageData(pageInfo);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  // Mobile scroll highlight for print cards
  useEffect(() => {
    if (isLoading) return;
    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    if (!isTouchDevice) return;

    const cards = document.querySelectorAll(".scroll-highlight-print");
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          } else {
            entry.target.classList.remove("in-view");
          }
        });
      },
      { rootMargin: "-30% 0px -30% 0px", threshold: 0 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [isLoading]);

  if (isLoading) {
    return <div className="h-screen bg-brand-darker" />;
  }

  const heading =
    localize(pageData?.heading, locale) ||
    (locale === "en" ? "Fine Art Prints Collection" : "Tirages d'Art - Singulart");
  const subheading =
    localize(pageData?.subheading, locale) ||
    (locale === "en" ? "Art Prints" : "Tirages d'Art");
  const description =
    localize(pageData?.description, locale) ||
    (locale === "en"
      ? "High-quality art prints from my photographic collections"
      : "Tirages d'art de haute qualité de mes collections photographiques");
  const introText = localize(pageData?.introText, locale);

  return (
    <>
      {/* Hero */}
      <section className="relative flex h-[40vh] sm:h-auto items-center justify-center overflow-hidden">
        {pageData?.bannerImage ? (
          <>
            <img
              src={urlFor(pageData.bannerImage).width(1920).height(400).fit("crop").quality(85).url()}
              alt={String(heading)}
              className="hidden sm:block w-full h-auto"
            />
            <Image
              src={urlFor(pageData.bannerImageMobile || pageData.bannerImage).width(800).quality(85).url()}
              alt={String(heading)}
              fill
              className="object-cover sm:hidden"
              style={{ objectPosition: getHotspot(pageData.bannerImageMobile || pageData.bannerImage) }}
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/60" />
          </>
        ) : (
          <div className="absolute inset-0 bg-brand-dark" />
        )}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-full text-center px-6 pt-10 sm:pt-0">
            <p className="text-xs sm:text-sm uppercase tracking-menu font-medium text-white/50 mb-1 sm:mb-3">
              {subheading}
            </p>
            <h1 className="font-heading text-4xl sm:text-3xl md:text-5xl lg:text-6xl tracking-wider text-white">
              {heading}
            </h1>
            <p className="mt-2 sm:mt-4 text-sm sm:text-[11px] md:text-sm text-white/60 max-w-lg mx-auto leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* Intro text */}
      {introText && (
        <section className="mx-auto max-w-3xl px-6 pt-16 pb-4 text-center">
          <p className="text-sm sm:text-base text-brand-light/70 leading-relaxed">
            {introText}
          </p>
          <Link
            href="/contact"
            className="btn-accent mt-8 inline-block"
          >
            {locale === "en" ? "Contact me" : "Me contacter"}
          </Link>
        </section>
      )}

      {/* Prints Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {prints.map((print) => (
            <a
              key={print._id}
              href={print.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="scroll-highlight-print group flex flex-col rounded border border-white/10 overflow-hidden transition-all duration-300"
            >
              {print.image && (
                <div className="relative aspect-square overflow-hidden bg-brand-darker">
                  <Image
                    src={urlFor(print.image).width(600).height(600).url()}
                    alt={print.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="flex flex-col flex-1 p-6">
                <h3 className="font-heading text-lg text-white">
                  {print.title}
                </h3>
                <p className="mt-2 text-sm text-brand-accent font-semibold">
                  {print.price}
                </p>
                <div className="mt-auto pt-4">
                  <p className="text-xs uppercase tracking-menu text-brand-muted group-hover:text-white transition-colors">
                    {locale === "en"
                      ? "View on Singulart"
                      : "Voir sur Singulart"}{" "}
                    &rarr;
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="font-heading text-3xl text-white">
          {localize(pageData?.ctaHeading, locale) ||
            (locale === "en"
              ? "Looking for something specific?"
              : "Vous cherchez quelque chose de spécifique ?")}
        </h2>
        <p className="mt-4 text-sm text-brand-light/60">
          {localize(pageData?.ctaText, locale) ||
            (locale === "en"
              ? "Contact me to discuss custom print options or framing services."
              : "Contactez-moi pour discuter des options d'impression personnalisées ou des services d'encadrement.")}
        </p>
            <Link href="/contact" className="btn-accent mt-8 inline-block">
              {locale === "en" ? "Contact me" : "Me contacter"}
            </Link>
      </section>
    </>
  );
}
