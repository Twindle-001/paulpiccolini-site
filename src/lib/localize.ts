/**
 * Localization helper function
 * Returns the text in the requested locale, falls back to French then English
 */
export function localize(
  field: { fr?: string | any[]; en?: string | any[] } | undefined,
  locale: string
): string | any[] {
  if (!field) return "";

  if (locale === "en") {
    return field.en || field.fr || "";
  }

  return field.fr || field.en || "";
}

/**
 * Get a text string from a locale field
 */
export function getLocalizedString(
  field: { fr?: string; en?: string } | undefined,
  locale: string
): string {
  const result = localize(field, locale);
  return typeof result === "string" ? result : "";
}

/**
 * Get portable text array from a locale field
 */
export function getLocalizedArray(
  field: { fr?: any[]; en?: any[] } | undefined,
  locale: string
): any[] {
  const result = localize(field, locale);
  return Array.isArray(result) ? result : [];
}
