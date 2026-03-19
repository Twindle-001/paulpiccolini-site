import { defineField, defineType } from "sanity";
import { createLocaleField } from "./localeFields";

export default defineType({
  name: "printsPage",
  title: "Page Tirages d'Art",
  type: "document",
  fields: [
    defineField({
      name: "bannerImage",
      title: "Image bannière",
      type: "image",
      options: { hotspot: true },
      description:
        "Image de fond de la bannière Tirages (optionnelle, sinon fond sombre)",
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
