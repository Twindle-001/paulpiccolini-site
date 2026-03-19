import { defineField, defineType } from "sanity";
import { createLocaleField } from "./localeFields";

export default defineType({
  name: "category",
  title: "Catégorie",
  type: "document",
  fields: [
    createLocaleField("title", "Titre", "string", {
      description: "Nom de la catégorie en FR et EN (ex: Voyage / Travel)",
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title.fr", maxLength: 96 },
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
      title: "Bannière Desktop",
      type: "image",
      options: { hotspot: true },
      description:
        "Image bannière pour ordinateur (format panoramique recommandé). Utilise coverImage si non rempli.",
    }),
    defineField({
      name: "bannerImageMobile",
      title: "Bannière Mobile",
      type: "image",
      options: { hotspot: true },
      description:
        "Image bannière pour téléphone (format portrait ou 3:4 recommandé). Utilise la bannière desktop si non rempli.",
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
    select: { titleFr: "title.fr", titleEn: "title.en", media: "coverImage" },
    prepare({ titleFr, titleEn, media }) {
      return { title: titleFr || titleEn || "Sans titre", media };
    },
  },
});
