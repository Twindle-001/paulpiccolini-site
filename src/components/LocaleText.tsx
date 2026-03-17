"use client";

import { useLanguage } from "@/context/LanguageContext";
import { localize } from "@/lib/localize";
import type { LocaleField } from "@/sanity/types";

/**
 * Renders a locale-aware text string from a LocaleField
 */
export function LocaleString({
  field,
  fallback = "",
}: {
  field?: LocaleField<string>;
  fallback?: string;
}) {
  const { locale } = useLanguage();
  const text = String(localize(field, locale) || fallback);
  return <>{text}</>;
}

/**
 * Renders a simple translated string based on current locale
 */
export function T({ fr, en }: { fr: string; en: string }) {
  const { locale } = useLanguage();
  return <>{locale === "en" ? en : fr}</>;
}
