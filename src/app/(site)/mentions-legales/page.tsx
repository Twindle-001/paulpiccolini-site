"use client";

import { useLanguage } from "@/context/LanguageContext";

const content = {
  fr: {
    title: "Mentions Légales",
    lastUpdated: "mars 2026",
    sections: [
      {
        title: "Éditeur du site",
        content:
          "Ce site est édité par Paul Piccolini, entrepreneur individuel, SIRET 893 719 773 00010, domicilié en France.",
      },
      {
        title: "Contact",
        content: "Email : paul.piccolini@gmail.com",
      },
      {
        title: "Hébergement",
        content:
          "Ce site est hébergé sur les serveurs de Vercel Inc., plateforme cloud de déploiement et d’hébergement web.",
      },
      {
        title: "Propriété intellectuelle",
        content:
          "L’ensemble du contenu de ce site (textes, images, vidéos, designs) est protégé par les dispositions du Code de la propriété intellectuelle. Les photographies présentées sur ce site restent la propriété intellectuelle de Paul Piccolini. Toute reproduction, représentation, modification ou adaptation sans autorisation préalable est strictement interdite.",
      },
      {
        title: "Données personnelles et cookies",
        content:
          "Ce site peut utiliser des cookies pour améliorer votre expérience utilisateur. Les données personnelles collectées sont traitées conformément à la réglementation RGPD. Vous disposez d’un droit d’accès, de modification et de suppression de vos données personnelles. Pour exercer ces droits, contactez paul.piccolini@gmail.com.",
      },
      {
        title: "Limitation de responsabilité",
        content:
          "Paul Piccolini s’efforce de maintenir les informations sur ce site à jour et exactes. Cependant, aucune garantie n’est fournie quant à l’exactitude, l’exhaustivité ou la pertinence des informations. L’utilisation du site se fait à vos risques et périls.",
      },
      {
        title: "Droit applicable",
        content:
          "Ces mentions légales sont régies par le droit français. Tout litige sera soumis aux tribunaux compétents de Paris.",
      },
    ],
  },
  en: {
    title: "Legal Notice",
    lastUpdated: "March 2026",
    sections: [
      {
        title: "Site Publisher",
        content:
          "This site is published by Paul Piccolini, sole proprietor, SIRET 893 719 773 00010, domiciled in France.",
      },
      {
        title: "Contact",
        content: "Email: paul.piccolini@gmail.com",
      },
      {
        title: "Hosting",
        content:
          "This site is hosted on the servers of Vercel Inc., a cloud platform for deployment and web hosting.",
      },
      {
        title: "Intellectual Property",
        content:
          "All content on this site (texts, images, videos, designs) is protected by the provisions of the French Intellectual Property Code. The photographs presented on this site remain the intellectual property of Paul Piccolini. Any reproduction, representation, modification or adaptation without prior authorization is strictly prohibited.",
      },
      {
        title: "Personal Data and Cookies",
        content:
          "This site may use cookies to improve your user experience. Personal data collected is processed in accordance with GDPR regulations. You have the right to access, modify and delete your personal data. To exercise these rights, contact paul.piccolini@gmail.com.",
      },
      {
        title: "Limitation of Liability",
        content:
          "Paul Piccolini endeavors to keep information on this site up to date and accurate. However, no warranty is provided as to the accuracy, completeness or relevance of the information. Use of the site is at your own risk.",
      },
      {
        title: "Applicable Law",
        content:
          "These legal notices are governed by French law. Any dispute will be subject to the competent courts of Paris.",
      },
    ],
  },
};

export default function MentionsPage() {
  const { locale } = useLanguage();
  const text = content[locale as keyof typeof content] || content.en;

  return (
    <main className="min-h-screen bg-brand-dark text-brand-light px-6 py-24 max-w-3xl mx-auto">
      <h1 className="text-3xl font-light tracking-wide mb-12">{text.title}</h1>

      <div className="mb-8">
        <p className="text-brand-light/60 italic">
          {locale === "fr" ? "Dernière mise à jour : " : "Last updated: "}
          {text.lastUpdated}
        </p>
      </div>

      <section className="space-y-6 text-sm leading-relaxed text-brand-light/80">
        {text.sections.map((section, idx) => (
          <div key={idx}>
            <h2 className="text-lg font-medium text-brand-light mb-2">
              {section.title}
            </h2>
            <p>{section.content}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
