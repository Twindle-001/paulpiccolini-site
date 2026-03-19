import { defineField, defineType } from "sanity";
import { createLocaleField } from "./localeFields";
import { UnifiedBannerPreview } from "../components/BannerPreview";

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
      title: "Banniere (Desktop + Mobile)",
      type: "image",
      options: { hotspot: true },
      description:
        "Image banniere unique pour desktop et mobile. Utilisez le hotspot pour ajuster le cadrage mobile.",
      components: { input: UnifiedBannerPreview },
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
      description: "Exemple: Style unique, Equipement, Ville",
    }),
    createLocaleField(
      "organizationHeading",
      "Titre section Organisation",
      "string"
    ),
    defineField({
      name: "organizationSteps",
      title: "Etapes du processus (3 etapes)",
      type: "array",
      of: [
        defineField({
          type: "object",
          fields: [
            defineField({
              name: "iconDescription",
              title: "Description de l'icone",
              type: "string",
              description: "Ex: Discussion, Planning, Photoshoot",
            }),
            createLocaleField("text", "Texte de l'etape", "text", {
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
