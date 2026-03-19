import { defineField, defineType } from "sanity";
import { createLocaleField } from "./localeFields";
import { BannerDesktopPreview, BannerMobilePreview } from "../components/BannerPreview";

export default defineType({
  name: "printsPage",
  title: "Page Tirages d'Art",
  type: "document",
  fields: [
    defineField({
      name: "bannerImage",
      title: "Bannière Desktop",
      type: "image",
      options: { hotspot: true },
      description: "Image bannière pour ordinateur (format panoramique recommandé)",
      components: { input: BannerDesktopPreview },
    }),
    defineField({
      name: "bannerImageMobile",
      title: "Bannière Mobile",
      type: "image",
      options: { hotspot: true },
      description: "Image bannière pour téléphone (format portrait ou 3:4 recommandé). Utilise la bannière desktop si non rempli.",
      components: { input: BannerMobilePreview },
    }),
    createLocaleField("heading", "Titre bannière", "string", {
      description: "Ex: Tirages d'Art - Singulart",
    }),
    createLocaleField("subheading", "Sous-titre bannière", "string", {
      description: "Ex: Tirages d'Art / Art Prints",
    }),
    createLocaleField("description", "Description bannière", "text", {
      description: "Texte descriptif affiché sous le titre dans la bannière",
      rows: 3,
    }),
    createLocaleField("introText", "Texte d'introduction", "text", {
      description:
        "Texte d'introduction affiché entre la bannière et la grille de tirages",
      rows: 4,
    }),
    createLocaleField("ctaHeading", "Titre CTA final", "string"),
    createLocaleField("ctaText", "Texte CTA final", "text", { rows: 3 }),
  ],
  preview: {
    prepare() {
      return { title: "Page Tirages d'Art" };
    },
  },
});
