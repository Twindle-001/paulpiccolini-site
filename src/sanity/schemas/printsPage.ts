import { defineField, defineType } from "sanity";
import { createLocaleField } from "./localeFields";
import { UnifiedBannerPreview } from "../components/BannerPreview";

export default defineType({
  name: "printsPage",
  title: "Page Tirages d'Art",
  type: "document",
  fields: [
    defineField({
      name: "bannerImage",
      title: "Banniere (Desktop + Mobile)",
      type: "image",
      options: { hotspot: true },
      description:
        "Image banniere unique pour desktop et mobile. Utilisez le hotspot pour ajuster le cadrage mobile.",
      components: { input: UnifiedBannerPreview },
    }),
    createLocaleField("heading", "Titre banniere", "string", {
      description: "Ex: Tirages d'Art - Singulart",
    }),
    createLocaleField("subheading", "Sous-titre banniere", "string", {
      description: "Ex: Tirages d'Art / Art Prints",
    }),
    createLocaleField("description", "Description banniere", "text", {
      description:
        "Texte descriptif affiche sous le titre dans la banniere",
      rows: 3,
    }),
    createLocaleField("introText", "Texte d'introduction", "text", {
      description:
        "Texte d'introduction affiche entre la banniere et la grille de tirages",
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
