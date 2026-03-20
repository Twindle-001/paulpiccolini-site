import { defineField, defineType } from "sanity";

export default defineType({
  name: "photo",
  title: "Photo",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Titre de la photo",
      type: "string",
      description: "Titre visible au survol dans la galerie (optionnel)",
    }),
    defineField({
      name: "alt",
      title: "Texte SEO (alt)",
      type: "string",
      description:
        "Description pour le r\u00e9f\u00e9rencement et l'accessibilit\u00e9. Si vide, le titre sera utilis\u00e9 automatiquement.",
    }),
    defineField({
      name: "category",
      title: "Cat\u00e9gorie",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subcategory",
      title: "Sous-cat\u00e9gorie",
      type: "string",
      description:
        "Ex: monuments, street, landscape... (utilis\u00e9 pour les filtres dans la galerie)",
    }),
    defineField({
      name: "order",
      title: "Ordre d'affichage",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "featured",
      title: "Photo mise en avant",
      type: "boolean",
      initialValue: false,
      description: "Afficher cette photo sur la page d'accueil",
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
    select: {
      photoTitle: "title",
      alt: "alt",
      catFr: "category.title.fr",
      catEn: "category.title.en",
      subcategory: "subcategory",
      media: "image",
    },
    prepare({ photoTitle, alt, catFr, catEn, subcategory, media }) {
      const category = catFr || catEn || "";
      const sub = subcategory || "";
      const subtitle = sub ? category + " \u2014 " + sub : category;
      return {
        title: photoTitle || alt || "Sans titre",
        subtitle,
        media,
      };
    },
  },
});
