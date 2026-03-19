import { defineField, defineType } from "sanity";
import { createLocaleField } from "./localeFields";
import { BannerDesktopPreview, BannerMobilePreview } from "../components/BannerPreview";

export default defineType({
  name: "contactPage",
  title: "Page Contact",
  type: "document",
  fields: [
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
