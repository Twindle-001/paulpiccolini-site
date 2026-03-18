"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { urlFor } from "@/sanity/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { localize } from "@/lib/localize";
import type { LocaleField } from "@/sanity/types";

interface NavbarProps {
  siteName?: string;
  logo?: SanityImageSource;
  categories?: { title: string | LocaleField<string>; slug: string }[];
}

export default function Navbar({
  siteName = "Paul Piccolini",
  logo,
  categories = [],
}: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { locale, toggleLanguage } = useLanguage();

  // Build navigation links dynamically from Sanity categories
  const links = [
    { label: "HOME", href: "/" },
    ...categories.map((cat) => ({
      label: (typeof cat.title === "string"
        ? cat.title
        : String(localize(cat.title, locale))
      ).toUpperCase(),
      href: `/${cat.slug}`,
    })),
    { label: "SERVICES", href: "/services" },
    { label: "SHOP", href: "/prints" },
    { label: "CONTACT", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="bg-brand-darker/80 backdrop-blur-md border-b border-white/5">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-3">
            {logo && (
              <Image
                src={urlFor(logo).width(80).height(80).url()}
                alt={siteName}
                width={40}
                height={40}
                className="object-contain"
              />
            )}
            <div>
              <span className="font-heading text-xl tracking-wide text-white">
                {siteName}
              </span>
              <span className="block text-[10px] uppercase tracking-[0.3em] text-brand-muted">
                Photography
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            {links.map((link, i) => (
              <Link
                key={`d-${i}-${link.label}`}
                href={link.href}
                className={`nav-link text-xs tracking-menu transition-colors ${
                  pathname === link.href
                    ? "text-white border-b border-brand-accent"
                    : "text-brand-light/60 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Language toggle + Menu button */}
          <div className="flex items-center gap-4">
            {/* Language buttons */}
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => locale !== "fr" && toggleLanguage()}
                className={`px-2 py-2 tracking-wider transition-colors ${
                  locale === "fr"
                    ? "text-white font-semibold"
                    : "text-brand-muted hover:text-white"
                }`}
              >
                FR
              </button>
              <span className="text-brand-muted/40">/</span>
              <button
                onClick={() => locale !== "en" && toggleLanguage()}
                className={`px-2 py-2 tracking-wider transition-colors ${
                  locale === "en"
                    ? "text-white font-semibold"
                    : "text-brand-muted hover:text-white"
                }`}
              >
                EN
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-3 -mr-2 text-white"
              aria-label="Menu"
            >
              <div className="space-y-1.5">
                <span
                  className={`block h-[1px] w-6 bg-white transition-all duration-300 ${
                    isOpen ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-[1px] w-6 bg-white transition-all duration-300 ${
                    isOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-[1px] w-6 bg-white transition-all duration-300 ${
                    isOpen ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            isOpen ? "max-h-96 pb-6" : "max-h-0"
          }`}
        >
          <div className="flex flex-col items-center gap-0 pt-2">
            {links.map((link, i) => (
              <Link
                key={`m-${i}-${link.label}`}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`w-full text-center px-6 py-4 text-sm tracking-menu transition-all duration-200 ${
                  pathname === link.href
                    ? "text-white bg-white/5 font-medium"
                    : "text-brand-light/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
