import { defineField, defineType } from "sanity";
import { createLocaleField } from "./localeFields";
import { UnifiedBannerPreview } from "../components/BannerPreview";

export default defineType({
  name: "contactPage",
  title: "Page Contact",
  type: "document",
  fields: [
    defineField({
      name: "bannerImage",
      title: "Banniere (Desktop + Mobile)",
      type: "image",
      options: { hotspot: true },
      description:
        "Image banniere unique pour desktop et mobile. Utilisez le hotspot pour ajuster le cadrage mobile.",
      components: { input: UnifiedBannerPreview },
    }),
    createLocaleField("heroSubtitle", "Sous-titre banniere", "string", {
      description: "Ex: Prendre contact / Get in touch",
    }),
    createLocaleField("heroTitle", "Titre banniere", "string", {
      description: "Ex: Contact",
    }),
    createLocaleField("intro", "Texte d'introduction", "text", {
      description: "Texte affiche au-dessus du formulaire",
      rows: 3,
    }),
    createLocaleField("sentTitle", "Titre confirmation envoi", "string", {
      description: "Ex: Message envoye !",
    }),
    createLocaleField("sentText", "Texte confirmation envoi", "text", {
      rows: 2,
    }),
    createLocaleField("errorText", "Texte en cas d'erreur", "text", {
      rows: 2,
    }),
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
