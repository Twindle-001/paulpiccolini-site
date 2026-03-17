import { defineField, defineType } from "sanity";
import { createLocaleField } from "./localeFields";

export default defineType({
  name: "category",
  title: "Catégorie",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    createLocaleField("description", "Description", "text", {
      description: "Description en français et anglais",
      rows: 3,
    }),
    defineField({
      name: "coverImage",
      title: "Image de couverture",
      type: "image",
      options: { hotspot: true },
      description:
        "Image affichée en hero de la page catégorie et en preview sur la homepage",
    }),
    defineField({
      name: "bannerImage",
      title: "Image bannière hero (optionnel)",
      type: "image",
      options: { hotspot: true },
      description:
        "Image spécifique pour le hero de la page. Utilise coverImage si non rempli.",
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
      title: "Ordre d'affichage",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", media: "coverImage" },
  },
});
