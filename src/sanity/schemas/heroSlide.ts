import { defineField, defineType } from "sanity";
import { createLocaleField } from "./localeFields";

export default defineType({
  name: "heroSlide",
  title: "Slide Hero (Accueil)",
  type: "document",
  fields: [
    createLocaleField("title", "Titre", "string", { required: true }),
    createLocaleField("subtitle", "Sous-titre", "string"),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "link",
      title: "Lien (URL de la page)",
      type: "string",
      description: "Ex: /paris, /travel, /portrait",
    }),
    defineField({
      name: "order",
      title: "Ordre d'affichage",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Ordre",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title.fr", media: "image" },
  },
});
