import { defineField, defineType } from "sanity";
import { createLocaleField } from "./localeFields";

export default defineType({
  name: "contactPage",
  title: "Page Contact",
  type: "document",
  fields: [
    defineField({
      name: "bannerImage",
      title: "Image bannière",
      type: "image",
      options: { hotspot: true },
      description: "Image de fond de la bannière Contact (optionnelle, sinon fond sombre)",
    }),
    createLocaleField(
      "heroSubtitle",
      "Sous-titre bannière",
      "string",
      { description: "Ex: Prendre contact / Get in touch" }
    ),
    createLocaleField(
      "heroTitle",
      "Titre bannière",
      "string",
      { description: "Ex: Contact" }
    ),
    createLocaleField(
      "intro",
      "Texte d'introduction",
      "text",
      {
        description: "Texte affiché au-dessus du formulaire",
        rows: 3,
      }
    ),
    createLocaleField(
      "sentTitle",
      "Titre confirmation envoi",
      "string",
      { description: "Ex: Message envoyé !" }
    ),
    createLocaleField(
      "sentText",
      "Texte confirmation envoi",
      "text",
      { rows: 2 }
    ),
    createLocaleField(
      "errorText",
      "Texte en cas d'erreur",
      "text",
      { rows: 2 }
    ),
    createLocaleField(
      "submitButtonText",
      "Texte du bouton envoyer",
      "string",
      { description: "Ex: Envoyer le message" }
    ),
  ],
  preview: {
    prepare() {
      return { title: "Page Contact" };
    },
  },
});
