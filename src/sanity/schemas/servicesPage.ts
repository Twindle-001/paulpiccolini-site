import { defineField, defineType } from "sanity";
import { createLocaleField } from "./localeFields";
import { BannerDesktopPreview, BannerMobilePreview } from "../components/BannerPreview";

export default defineType({
  name: "servicesPage",
  title: "Page Services",
  type: "document",
  fields: [
    createLocaleField("heading", "Titre principal", "string", {
      description: "Titre de la page services",
    }),
    createLocaleField("intro", "Introduction", "text", {
      description: "Texte d'introduction court",
      rows: 2,
    }),
    defineField({
      name: "bannerImage",
      title: "Bannière Desktop",
      type: "image",
      options: { hotspot: true },
      description: "Image bannière pour ordinateur (format panoramique recommandé)",
      components: { input: BannerDesktopPreview },
    }),
    defineField({
      name: "bannerImageMobile",
      title: "Bannière Mobile",
      type: "image",
      options: { hotspot: true },
      description: "Image bannière pour téléphone (format portrait ou 3:4 recommandé). Utilise la bannière desktop si non rempli.",
      components: { input: BannerMobilePreview },
    }),
    defineField({
      name: "philosophyItems",
      title: "Section Philosophie (3 colonnes)",
      type: "array",
      of: [
        defineField({
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
            }),
            createLocaleField("heading", "Titre", "string"),
            createLocaleField("text", "Texte", "text", { rows: 3 }),
            defineField({
              name: "order",
              title: "Ordre",
              type: "number",
              initialValue: 0,
            }),
          ],
          preview: {
            select: {
              title: "heading.fr",
              media: "image",
            },
          },
        }),
      ],
      description: "Exemple: Style unique, Équipement, Ville",
    }),
    createLocaleField(
      "organizationHeading",
      "Titre section Organisation",
      "string"
    ),
    defineField({
      name: "organizationSteps",
      title: "Étapes du processus (3 étapes)",
      type: "array",
      of: [
        defineField({
          type: "object",
          fields: [
            defineField({
              name: "iconDescription",
              title: "Description de l'icône",
              type: "string",
              description: "Ex: Discussion, Planning, Photoshoot",
            }),
            createLocaleField("text", "Texte de l'étape", "text", {
              rows: 2,
            }),
            defineField({
              name: "order",
              title: "Ordre",
              type: "number",
              initialValue: 0,
            }),
          ],
        }),
      ],
    }),
    createLocaleField("ctaHeading", "Titre CTA final", "string"),
    createLocaleField("ctaText", "Texte CTA final", "text", { rows: 3 }),
  ],
  preview: {
    prepare() {
      return { title: "Page Services" };
    },
  },
});
