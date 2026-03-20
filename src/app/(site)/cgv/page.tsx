"use client";

import { useLanguage } from "@/context/LanguageContext";

const content = {
  fr: {
    title: "Conditions Générales de Vente",
    lastUpdated: "mars 2026",
    articles: [
      {
        number: 1,
        title: "Objet",
        content:
          "Les présentes CGV régissent les prestations de services de photographie proposées par Paul Piccolini, entrepreneur individuel (SIRET : 893 719 773 00010), ci-après dénommé « le Photographe », à tout client professionnel ou particulier, ci-après dénommé « le Client ».",
      },
      {
        number: 2,
        title: "Prestations",
        content:
          "Le Photographe propose des prestations de photographie immobilière et d’architecture, incluant la prise de vue sur site et la livraison de fichiers numériques retraités en haute définition. Le détail de chaque prestation (nombre de photos, durée, lieu) est défini par devis préalable accepté par le Client.",
      },
      {
        number: 3,
        title: "Tarifs et paiement",
        content:
          "Les tarifs sont indiqués en euros et sont nets de taxes (TVA non applicable, article 293 B du CGI). Un acompte de 30 % du montant total est exigé à la réservation. Le solde est dû à la livraison des fichiers numériques. Les fichiers en haute définition ne sont transmis qu’après réception du paiement intégral.",
        subContent:
          "Modes de paiement acceptés : virement bancaire, chèque.",
      },
      {
        number: 4,
        title: "Délais de livraison",
        content:
          "Les photographies retraitées sont livrées par voie électronique (lien de téléchargement sécurisé) dans un délai de 72 heures ouvrées après la séance, sauf accord différent mentionné sur le devis.",
      },
      {
        number: 5,
        title: "Annulation et report",
        isList: true,
        listItems: [
          "Plus de 48h: remboursement intégral.",
          "24-48h: 50% retenu.",
          "Moins de 24h/absence: acompte retenu.",
          "Report gratuit si prévenu 48h avant.",
        ],
        subContent:
          "En cas d’annulation du fait du Photographe, l’acompte est intégralement remboursé ou la séance reportée sans frais.",
      },
      {
        number: 6,
        title: "Propriété intellectuelle et droits d’utilisation",
        content:
          "Les photographies restent la propriété intellectuelle du Photographe, conformément au Code de la propriété intellectuelle. Le Client bénéficie d’une licence d’utilisation non exclusive pour les usages définis au devis (publication en ligne, supports commerciaux, etc.). Toute utilisation non prévue nécessite un accord écrit préalable.",
      },
      {
        number: 7,
        title: "Tirages d’art",
        content:
          "Les tirages d’art sont vendus exclusivement via la plateforme Singulart. Les conditions de vente, de livraison et de rétractation applicables aux tirages sont celles de Singulart.",
      },
      {
        number: 8,
        title: "Responsabilité",
        content:
          "Le Photographe s’engage à réaliser la prestation avec professionnalisme. En cas de défaillance technique imprévue rendant la prestation impossible, le Photographe proposera une nouvelle date ou le remboursement intégral. Sa responsabilité est limitée au montant de la prestation.",
      },
      {
        number: 9,
        title: "Droit applicable et litiges",
        content:
          "Les présentes CGV sont soumises au droit français. En cas de litige, les parties s’efforceront de trouver une solution amiable. À défaut, les tribunaux de Paris seront seuls compétents.",
      },
    ],
  },
  en: {
    title: "Terms and Conditions",
    lastUpdated: "March 2026",
    articles: [
      {
        number: 1,
        title: "Scope",
        content:
          "These Terms and Conditions govern the photography services provided by Paul Piccolini, sole proprietor (SIRET: 893 719 773 00010), hereinafter referred to as the 'Photographer', to any professional or private client, hereinafter referred to as the 'Client'.",
      },
      {
        number: 2,
        title: "Services",
        content:
          "The Photographer offers real estate and architectural photography services, including on-site shooting and delivery of high-definition processed digital files. The details of each service (number of photos, duration, location) are specified in a quote previously accepted by the Client.",
      },
      {
        number: 3,
        title: "Rates and Payment",
        content:
          "Rates are stated in euros and are net of taxes (VAT not applicable, article 293 B of the French General Tax Code). A 30% deposit of the total amount is required at booking. The balance is due upon delivery of the digital files. High-definition files are transmitted only after receipt of full payment.",
        subContent: "Accepted payment methods: bank transfer, cheque.",
      },
      {
        number: 4,
        title: "Delivery Timeline",
        content:
          "Processed photographs are delivered electronically (secure download link) within 72 business hours after the shoot, unless a different arrangement is mentioned in the quote.",
      },
      {
        number: 5,
        title: "Cancellation and Rescheduling",
        isList: true,
        listItems: [
          "More than 48 hours: full refund.",
          "24-48 hours: 50% retained.",
          "Less than 24 hours/no-show: deposit retained.",
          "Free rescheduling if notified 48 hours in advance.",
        ],
        subContent:
          "In case of cancellation by the Photographer, the deposit is fully refunded or the shoot is rescheduled free of charge.",
      },
      {
        number: 6,
        title: "Intellectual Property and Rights of Use",
        content:
          "Photographs remain the intellectual property of the Photographer, in accordance with the French Intellectual Property Code. The Client benefits from a non-exclusive license to use the images for the purposes specified in the quote (online publication, commercial materials, etc.). Any use not provided for requires prior written consent.",
      },
      {
        number: 7,
        title: "Art Prints",
        content:
          "Art prints are sold exclusively through the Singulart platform. The terms of sale, delivery, and withdrawal applicable to prints are those of Singulart.",
      },
      {
        number: 8,
        title: "Liability",
        content:
          "The Photographer commits to performing the service with professionalism. In case of unforeseen technical failure making the service impossible, the Photographer will offer a new date or full refund. The Photographer's liability is limited to the amount of the service.",
      },
      {
        number: 9,
        title: "Applicable Law and Disputes",
        content:
          "These Terms and Conditions are subject to French law. In case of dispute, the parties will endeavor to find an amicable solution. Failing that, the Paris courts will have exclusive jurisdiction.",
      },
    ],
  },
};

export default function CGVPage() {
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
        {text.articles.map((article) => (
          <div key={article.number}>
            <h2 className="text-lg font-medium text-brand-light mb-2">
              {locale === "fr" ? "Article" : "Article"} {article.number} —{" "}
              {article.title}
            </h2>

            <p>{article.content}</p>

            {article.isList && article.listItems && (
              <ul className="list-disc list-inside space-y-1 mt-2">
                {article.listItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}

            {article.subContent && <p className="mt-2">{article.subContent}</p>}
          </div>
        ))}
      </section>
    </main>
  );
}
