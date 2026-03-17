import { defineField, defineType } from "sanity";
import { createLocaleField } from "./localeFields";

export default defineType({
  name: "service",
  title: "Service / Forfait",
  type: "document",
  fields: [
    createLocaleField("name", "Nom du forfait", "string", { required: true }),
    defineField({
      name: "price",
      title: "Prix",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "currency",
      title: "Devise",
      type: "string",
      initialValue: "€",
    }),
    defineField({
      name: "popular",
      title: "Mise en avant (Popular)",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "features",
      title: "Caractéristiques",
      type: "array",
      of: [
        defineField({
          type: "object",
          fields: [
            createLocaleField("text", "Texte", "string"),
            defineField({
              name: "order",
              title: "Ordre",
              type: "number",
              initialValue: 0,
            }),
          ],
        }),
      ],
      description: "Liste des prestations incluses en FR et EN",
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
    select: { title: "name.fr", subtitle: "price" },
    prepare({ title, subtitle }) {
      return { title: title || "Forfait", subtitle: `${subtitle} €` };
    },
  },
});
