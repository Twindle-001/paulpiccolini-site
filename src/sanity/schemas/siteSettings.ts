import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Configuration Générale",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nom du photographe",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "contactEmail",
      title: "Email de contact",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "instagram",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn URL",
      type: "url",
    }),
    defineField({
      name: "facebook",
      title: "Facebook URL",
      type: "url",
    }),
    defineField({
      name: "footerLinks",
      title: "Liens Footer",
      type: "array",
      of: [
        defineField({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Libellé",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "href",
              title: "URL",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
      description:
        'Liens du footer (Mentions légales, CGV, Politique de confidentialité, etc.)',
    }),
  ],
  preview: {
    select: { title: "name" },
    prepare({ title }) {
      return { title: title || "Configuration Générale" };
    },
  },
});
