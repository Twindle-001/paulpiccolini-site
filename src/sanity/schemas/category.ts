import { defineField, defineType } from "sanity";
import { createLocaleField } from "./localeFields";
import { UnifiedBannerPreview } from "../components/BannerPreview";

export default defineType({
  name: "category",
  title: "Categorie",
  type: "document",
  fields: [
    createLocaleField("title", "Titre", "string", {
      description: "Nom de la categorie en FR et EN (ex: Voyage / Travel)",
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title.fr", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    createLocaleField("description", "Description", "text", {
      description: "Description en francais et anglais",
      rows: 3,
    }),
    defineField({
      name: "coverImage",
      title: "Image de couverture",
      type: "image",
      options: { hotspot: true },
      description:
        "Image affichee en hero de la page categorie et en preview sur la homepage",
    }),
    defineField({
      name: "bannerImage",
      title: "Banniere (Desktop + Mobile)",
      type: "image",
      options: { hotspot: true },
      description:
        "Image banniere unique pour desktop et mobile. Utilisez le hotspot pour ajuster le cadrage mobile. Si vide, coverImage est utilisee.",
      components: { input: UnifiedBannerPreview },
    }),
    defineField({
      name: "subcategoryOrder",
      title: "Ordre des sous-catégories",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Glissez-déposez pour réorganiser les sous-catégories. Les noms doivent correspondre exactement aux sous-catégories des photos.",
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
