import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { servicesQuery, siteSettingsQuery } from "@/sanity/queries";
import type { SanityService, SanitySettings } from "@/sanity/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Services",
  description:
    "Book a professional photoshoot in Paris with Paul Piccolini. Discovery, Classic and Premium packages available.",
};

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([
    client.fetch<SanityService[]>(servicesQuery),
    client.fetch<SanitySettings>(siteSettingsQuery),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative flex h-[50vh] items-center justify-center overflow-hidden">
        {settings?.servicesImage ? (
          <Image
            src={urlFor(settings.servicesImage).width(1920).height(1080).url()}
            alt="Services"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://paulpiccolini.com/wp-content/uploads/2021/10/A7R07485-Modifier-scaled.jpg")',
            }}
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center">
          <p className="section-subheading mb-4 text-white/50">Services</p>
          <h1 className="font-heading text-5xl tracking-wider text-white md:text-6xl">
            {settings?.servicesHeading || "Paris Photoshoots"}
          </h1>
          <p className="mt-4 text-sm text-white/60">
            {settings?.servicesIntro ||
              "Gift yourself or others a photoshoot in the most iconic places of Paris."}
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-8 md:grid-cols-3">
          {services.map((plan) => (
            <div
              key={plan._id}
              className={`relative flex flex-col rounded border p-8 transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? "border-brand-accent bg-brand-dark"
                  : "border-white/10 bg-brand-dark/50"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-accent px-4 py-1 text-[10px] uppercase tracking-wider text-brand-darker font-semibold">
                  Popular
                </span>
              )}

              <h3 className="font-heading text-2xl text-white">{plan.name}</h3>

              <div className="mt-6 mb-8">
                <span className="font-heading text-5xl text-white">
                  {plan.price}
                </span>
                <span className="ml-1 text-lg text-brand-muted">
                  {plan.currency}
                </span>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features?.map((feature, i) => (
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
                    {feature}
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
                Book now
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose me */}
      <section className="border-t border-white/5 bg-brand-dark py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-16 md:grid-cols-2 md:items-center">
            <div>
              <p className="section-subheading mb-4">Why choose me</p>
              <h2 className="section-heading mb-8">
                A Unique &amp; Emotional Style
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-brand-light/70">
                <p>
                  Choosing a photographer means choosing a specific know-how and
                  style. My approach to portrait photography combines technical
                  precision with emotional sensitivity.
                </p>
                <p>
                  I use high-end professional equipment (Sony Alpha 7R series)
                  to ensure the highest quality for every shot. Paris is not
                  just a backdrop &mdash; it&apos;s a character in every photo.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden">
              {settings?.profileImage ? (
                <Image
                  src={urlFor(settings.profileImage).width(800).height(1000).url()}
                  alt="Professional photography in Paris"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <Image
                  src="https://paulpiccolini.com/wp-content/uploads/2021/10/A7R07463-Modifier-2-scaled.jpg"
                  alt="Professional photography in Paris"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="font-heading text-3xl text-white">
          Didn&apos;t find what you wanted?
        </h2>
        <p className="mt-4 text-sm text-brand-light/60">
          Contact me to discuss your custom project. I&apos;ll be happy to find
          the best solution for your needs.
        </p>
        <Link href="/contact" className="btn-accent mt-8 inline-block">
          Get in touch
        </Link>
      </section>
    </>
  );
}
