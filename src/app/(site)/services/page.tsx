"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { client } from "@/sanity/client";
import { urlFor, getHotspot } from "@/sanity/image";
import { servicesQuery, servicesPageQuery } from "@/sanity/queries";
import type { SanityService, SanityServicesPage } from "@/sanity/types";
import { useLanguage } from "@/context/LanguageContext";
import { localize } from "@/lib/localize";

export default function ServicesPage() {
  const [data, setData] = useState<{
    services: SanityService[];
    servicesPage?: SanityServicesPage;
  }>({
    services: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const { locale } = useLanguage();

  useEffect(() => {
    async function fetchData() {
      const [services, servicesPage] = await Promise.all([
        client.fetch<SanityService[]>(servicesQuery),
        client.fetch<SanityServicesPage>(servicesPageQuery),
      ]);
      setData({ services, servicesPage });
      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="h-screen bg-brand-darker" />;
  }

  const { services, servicesPage } = data;

  return (
    <>
      {/* Hero */}
      <section className="relative flex h-[40vh] sm:h-auto items-center justify-center overflow-hidden">
        {servicesPage?.bannerImage ? (
          <>
            <img
              src={urlFor(servicesPage.bannerImage).width(1920).height(400).fit("crop").quality(85).url()}
              alt="Services"
              className="hidden sm:block w-full h-auto"
            />
            <Image
              src={urlFor(servicesPage.bannerImageMobile || servicesPage.bannerImage).width(800).quality(85).url()}
              alt="Services"
              fill
              className="object-cover sm:hidden"
              style={{ objectPosition: getHotspot(servicesPage.bannerImageMobile || servicesPage.bannerImage) }}
              priority
              sizes="100vw"
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-brand-dark" />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-full text-center px-6 pt-10 sm:pt-0">
            <p className="text-xs sm:text-sm uppercase tracking-menu font-medium text-white/50 mb-1 sm:mb-3">
              {locale === "en" ? "Services" : "Services"}
            </p>
            <h1 className="font-heading text-4xl sm:text-3xl md:text-5xl lg:text-6xl tracking-wider text-white">
              {localize(servicesPage?.heading, locale) ||
                (locale === "en"
                  ? "Paris Photoshoots"
                  : "Photoshoots à Paris")}
            </h1>
            <p className="mt-2 sm:mt-4 text-sm sm:text-[11px] md:text-sm text-white/60 max-w-lg mx-auto leading-relaxed">
              {localize(servicesPage?.intro, locale) ||
                (locale === "en"
                  ? "Gift yourself or others a photoshoot in the most iconic places of Paris."
                  : "Offrez-vous ou offrez à quelqu'un un photoshoot dans les lieux les plus emblématiques de Paris.")}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-8 md:grid-cols-3">
          {services.map((plan) => (
            <div
              key={plan._id}
              className={`relative flex flex-col rounded border p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? "border-brand-accent bg-brand-dark"
                  : "border-white/10 bg-brand-dark/50"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-accent px-4 py-1 text-[10px] uppercase tracking-wider text-brand-darker font-semibold">
                  {locale === "en" ? "Best Deal" : "Meilleur choix"}
                </span>
              )}

              <h3 className="font-heading text-2xl text-white">
                {localize(plan.name, locale)}
              </h3>

              <div className="mt-6 mb-8">
                <span className="font-heading text-5xl text-white">
                  {plan.price}
                </span>
                <span className="ml-1 text-lg text-brand-muted">
                  {plan.currency}
                </span>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features?.filter(Boolean).map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-brand-light/70"
                  >
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {String(localize(feature?.text, locale) || "")}
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className={
                  plan.popular
                    ? "btn-accent text-center"
                    : "btn-primary text-center"
                }
              >
                {locale === "en" ? "Book now" : "Réserver"}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      {servicesPage?.philosophyItems && servicesPage.philosophyItems.length > 0 && (
        <section className="border-t border-white/5 bg-brand-dark py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-16 text-center">
              <h2 className="section-heading">
                {locale === "en" ? "My Approach" : "Mon approche"}
              </h2>
            </div>

            <div className="grid gap-8 md:gap-12 md:grid-cols-3">
              {servicesPage.philosophyItems
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((item, i) => (
                  <div key={i}>
                    {item.image && (
                      <div className="relative aspect-square overflow-hidden rounded mb-6">
                        <Image
                          src={urlFor(item.image).width(400).height(400).url()}
                          alt={String(localize(item.heading, locale) || "")}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <h3 className="font-heading text-xl text-white mb-3">
                      {localize(item.heading, locale)}
                    </h3>
                    <p className="text-sm leading-relaxed text-brand-light/70">
                      {localize(item.text, locale)}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Organisation Steps */}
      {servicesPage?.organizationSteps &&
        servicesPage.organizationSteps.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 py-24">
            <div className="mb-16 text-center">
              <h2 className="section-heading">
                {localize(servicesPage.organizationHeading, locale) ||
                  (locale === "en"
                    ? "How It Works"
                    : "Comment ça marche")}
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {servicesPage.organizationSteps
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((step, i) => (
                  <div key={i} className="text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent text-brand-darker font-heading text-lg font-semibold">
                        {i + 1}
                      </div>
                    </div>
                    <h3 className="font-heading text-lg text-white mb-2">
                      {step.iconDescription}
                    </h3>
                    <p className="text-sm text-brand-light/60">
                      {localize(step.text, locale)}
                    </p>
                  </div>
                ))}
            </div>
          </section>
        )}

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="font-heading text-3xl text-white">
          {localize(servicesPage?.ctaHeading, locale) ||
            (locale === "en"
              ? "Didn't find what you wanted?"
              : "Vous n'avez pas trouvé ce que vous cherchiez ?")}
        </h2>
        <p className="mt-4 text-sm text-brand-light/60">
          {localize(servicesPage?.ctaText, locale) ||
            (locale === "en"
              ? "Contact me to discuss your custom project. I'll be happy to find the best solution for your needs."
              : "Contactez-moi pour discuter de votre projet personnalisé. Je serai heureux de trouver la meilleure solution pour vos besoins.")}
        </p>
        <Link href="/contact" className="btn-accent mt-8 inline-block">
          {locale === "en" ? "Get in touch" : "Me contacter"}
        </Link>
      </section>
    </>
  );
}
