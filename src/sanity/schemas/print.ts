import { defineField, defineType } from "sanity";

export default defineType({
  name: "print",
  title: "Tirage d'Art",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Prix",
      type: "string",
      description: 'Ex: "130€ - 490€" ou "199€"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "externalLink",
      title: "Lien externe (Singulart, etc.)",
      type: "url",
      validation: (Rule) => Rule.required(),
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
    select: { title: "title", subtitle: "price", media: "image" },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Tirage",
        subtitle: subtitle || "Prix non défini",
        media,
      };
    },
  },
});
