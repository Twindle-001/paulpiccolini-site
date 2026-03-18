"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { printsQuery, homePageQuery } from "@/sanity/queries";
import type { SanityPrint, SanityHomePage } from "@/sanity/types";
import { useLanguage } from "@/context/LanguageContext";
import { localize } from "@/lib/localize";

export default function PrintsPage() {
  const [prints, setPrints] = useState<SanityPrint[]>([]);
  const [homePage, setHomePage] = useState<SanityHomePage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { locale } = useLanguage();

  useEffect(() => {
    async function fetchData() {
      const [printsData, homeData] = await Promise.all([
        client.fetch<SanityPrint[]>(printsQuery),
        client.fetch<SanityHomePage>(homePageQuery),
      ]);
      setPrints(printsData);
      setHomePage(homeData);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="h-screen bg-brand-darker" />;
  }

  return (
    <>
      {/* Hero */}
      <section className="flex h-[30vh] sm:h-[40vh] items-center justify-center bg-brand-dark">
        <div className="w-full text-center px-6">
          <p className="section-subheading mb-2 sm:mb-4 text-brand-muted text-[10px] sm:text-sm">
            {localize(homePage?.printsSubheading, locale) ||
              (locale === "en" ? "Art Prints" : "Tirages d'Art")}
          </p>
          <h1 className="font-heading text-3xl tracking-wider text-white sm:text-5xl md:text-6xl">
            {localize(homePage?.printsHeading, locale) ||
              (locale === "en"
                ? "Fine Art Prints Collection"
                : "Tirages d'Art - Singulart")}
          </h1>
          <p className="mt-4 text-sm text-brand-light/60 max-w-lg mx-auto">
            {locale === "en"
              ? "High-quality art prints from my photographic collections"
              : "Tirages d'art de haute qualité de mes collections photographiques"}
          </p>
        </div>
      </section>

      {/* Prints Grid */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {prints.map((print) => (
            <a
              key={print._id}
              href={print.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded border border-white/10 overflow-hidden hover:border-brand-accent/50 transition-all duration-300 hover:-translate-y-1"
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
          {locale === "en"
            ? "Looking for something specific?"
            : "Vous cherchez quelque chose de spécifique ?"}
        </h2>
        <p className="mt-4 text-sm text-brand-light/60">
          {locale === "en"
            ? "Contact me to discuss custom print options or framing services."
            : "Contactez-moi pour discuter des options d'impression personnalisées ou des services d'encadrement."}
        </p>
      </section>
    </>
  );
}
