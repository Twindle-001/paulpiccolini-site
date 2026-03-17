import { defineField, defineType } from "sanity";
import { createLocaleField } from "./localeFields";

export default defineType({
  name: "homePage",
  title: "Page d'Accueil",
  type: "document",
  fields: [
    createLocaleField(
      "aboutHeading",
      "Titre section À propos",
      "string",
      { description: "Exemple: Votre Photographe à Paris" }
    ),
    createLocaleField(
      "aboutText",
      "Texte À propos",
      "array",
      { description: "Texte de présentation avec mise en forme" }
    ),
    defineField({
      name: "profileImage",
      title: "Photo de profil",
      type: "image",
      options: { hotspot: true },
      description: "Image affichée dans la section À propos",
    }),
    createLocaleField(
      "portfolioHeading",
      "Titre section Portfolio",
      "string",
      { description: "Exemple: Découvrez mon travail" }
    ),
    createLocaleField(
      "servicesHeading",
      "Titre section Services",
      "string",
      { description: "Exemple: Photoshoots à Paris" }
    ),
    createLocaleField(
      "servicesIntro",
      "Introduction Services",
      "text",
      {
        description: "Texte court présentant les services",
        rows: 2,
      }
    ),
    defineField({
      name: "servicesImage",
      title: "Image section Services",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "servicesOnRequestImage",
      title: "Image bannière Services sur demande",
      type: "image",
      options: { hotspot: true },
      description: "Image de fond pour la section 'Services sur demande' (optionnelle)",
    }),
    createLocaleField(
      "servicesOnRequestHeading",
      "Titre section Services sur demande",
      "string"
    ),
    createLocaleField(
      "servicesOnRequestText",
      "Texte Services sur demande",
      "text",
      { rows: 3 }
    ),
    createLocaleField(
      "servicesOnRequestButton",
      "Texte du bouton (Services sur demande)",
      "string",
      { description: "Ex: Me contacter / Contact me" }
    ),
    createLocaleField(
      "printsHeading",
      "Titre section Tirages d'Art",
      "string",
      { description: "Exemple: Tirage d'Art - Singulart" }
    ),
    defineField({
      name: "printsLink",
      title: "Lien vers la boutique de tirages",
      type: "url",
      description:
        "Lien vers Singulart ou votre plateforme de vente de tirages",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Page d'Accueil" };
    },
  },
});
