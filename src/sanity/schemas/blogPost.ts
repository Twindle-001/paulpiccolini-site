import { defineField, defineType } from "sanity";
import { createLocaleField } from "./localeFields";

export default defineType({
  name: "blogPost",
  title: "Article Blog",
  type: "document",
  fields: [
    createLocaleField("title", "Titre", "string", { required: true }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title.fr", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    createLocaleField("excerpt", "Extrait", "text", {
      description: "Texte court affiché en aperçu",
      rows: 2,
    }),
    createLocaleField("content", "Contenu", "array", {
      description: "Contenu principal avec mise en forme",
    }),
    defineField({
      name: "coverImage",
      title: "Image de couverture",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "publishedAt",
      title: "Date de publication",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      description: "Mots-clés pour catégoriser l'article",
    }),
  ],
  orderings: [
    {
      title: "Date de publication (récent)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title.fr",
      subtitle: "publishedAt",
      media: "coverImage",
    },
    prepare({ title, subtitle, media }) {
      const date = subtitle
        ? new Date(subtitle).toLocaleDateString("fr-FR")
        : "Date non définie";
      return {
        title: title || "Article sans titre",
        subtitle: date,
        media,
      };
    },
  },
});
