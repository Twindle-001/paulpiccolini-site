"use client";

import { useLanguage } from "@/context/LanguageContext";

const content = {
  fr: {
    title: "Politique de confidentialité",
    lastUpdated: "mars 2026",
    sections: [
      {
        title: "Responsable du traitement",
        content: "Paul Piccolini — Entrepreneur individuel",
        address: "73 avenue des Ternes, 75017 Paris",
        email: "paul.piccolini@gmail.com",
      },
      {
        title: "Données collectées",
        content: "Lors de l’utilisation du formulaire de contact, les données suivantes peuvent être collectées : prénom, nom, adresse e-mail, numéro de téléphone et le contenu de votre message.",
        subContent: "Lors de votre navigation, Google Analytics 4 collecte des données anonymisées (pages consultées, durée de visite, type d’appareil, localisation approximative) à des fins d’analyse d’audience. Aucune donnée personnelle identifiante n’est transmise.",
      },
      {
        title: "Finalité du traitement",
        content: "Les données collectées via le formulaire de contact sont utilisées uniquement pour :",
        listItems: [
          "Répondre à vos demandes de renseignements ou de devis.",
          "Organiser et planifier les prestations photographiques.",
          "Établir les devis et factures.",
        ],
        subContent: "Vos données ne sont jamais vendues, cédées ou utilisées à des fins publicitaires.",
      },
      {
        title: "Durée de conservation",
        content: "Les données issues du formulaire de contact sont conservées pendant une durée maximale de 3 ans après le dernier échange. Les données liées à la facturation sont conservées 10 ans conformément aux obligations comptables.",
      },
      {
        title: "Partage des données",
        content: "Vos données personnelles ne sont partagées avec aucun tiers, à l’exception des prestataires techniques nécessaires au fonctionnement du site :",
        listItems: [
          "Vercel (hébergement du site).",
          "Sanity (gestion de contenu).",
          "Google Analytics 4 (analyse d’audience anonymisée).",
        ],
        subContent: "Si un service d’envoi d’e-mails est mis en place ultérieurement (type Brevo, Mailchimp), cette section sera mise à jour.",
      },
      {
        title: "Cookies et analyse d’audience",
        content: "Ce site utilise Google Analytics 4 pour mesurer l’audience de manière anonymisée. Cet outil dépose des cookies permettant de comptabiliser les visites et les pages consultées, sans collecter de données personnelles identifiantes. Les adresses IP sont anonymisées. Vous pouvez désactiver le suivi Google Analytics en installant le module complémentaire de navigateur disponible sur https://tools.google.com/dlpage/gaoptout. Des cookies strictement nécessaires au fonctionnement du site peuvent également être déposés.",
      },
      {
        title: "Vos droits",
        content: "Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez des droits suivants :",
        listItems: [
          "Droit d’accès à vos données personnelles.",
          "Droit de rectification ou de suppression.",
          "Droit d’opposition au traitement.",
        ],
        subContent: "Pour exercer ces droits, contactez : paul.piccolini@gmail.com. Une réponse vous sera apportée dans un délai de 30 jours.",
        extraContent: "Vous pouvez également introduire une réclamation auprès de la CNIL (Commission Nationale de l’Informatique et des Libertés) : www.cnil.fr.",
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    lastUpdated: "March 2026",
    sections: [
      {
        title: "Data Controller",
        content: "Paul Piccolini — Sole Proprietor",
        address: "73 avenue des Ternes, 75017 Paris",
        email: "paul.piccolini@gmail.com",
      },
      {
        title: "Data Collected",
        content: "When using the contact form, the following data may be collected: first name, last name, email address, phone number and the content of your message.",
        subContent: "During your browsing, Google Analytics 4 collects anonymized data (pages visited, visit duration, device type, approximate location) for audience analysis purposes. No personally identifiable data is transmitted.",
      },
      {
        title: "Purpose of Processing",
        content: "Data collected via the contact form is used solely to:",
        listItems: [
          "Respond to your inquiries or quote requests.",
          "Organize and plan photography services.",
          "Prepare quotes and invoices.",
        ],
        subContent: "Your data is never sold, transferred or used for advertising purposes.",
      },
      {
        title: "Data Retention",
        content: "Data from the contact form is retained for a maximum of 3 years after the last exchange. Billing-related data is retained for 10 years in accordance with accounting obligations.",
      },
      {
        title: "Data Sharing",
        content: "Your personal data is not shared with any third party, except for the technical service providers necessary for the operation of the site:",
        listItems: [
          "Vercel (site hosting).",
          "Sanity (content management).",
          "Google Analytics 4 (anonymized audience analysis).",
        ],
        subContent: "If an email sending service is implemented in the future (such as Brevo, Mailchimp), this section will be updated.",
      },
      {
        title: "Cookies & Audience Analytics",
        content: "This site uses Google Analytics 4 to measure audience in an anonymized manner. This tool sets cookies to count visits and pages viewed, without collecting personally identifiable data. IP addresses are anonymized. You can disable Google Analytics tracking by installing the browser add-on available at https://tools.google.com/dlpage/gaoptout. Strictly necessary cookies for the operation of the site may also be set.",
      },
      {
        title: "Your Rights",
        content: "In accordance with the General Data Protection Regulation (GDPR) and the French Data Protection Act, you have the following rights:",
        listItems: [
          "Right to access your personal data.",
          "Right to rectification or deletion.",
          "Right to object to processing.",
        ],
        subContent: "To exercise these rights, contact: paul.piccolini@gmail.com. A response will be provided within 30 days.",
        extraContent: "You may also file a complaint with the CNIL (French National Commission for Information Technology and Civil Liberties): www.cnil.fr.",
      },
    ],
  },
};

export default function PolitiquePage() {
  const { locale } = useLanguage();
  const text = content[locale as keyof typeof content] || content.en;

  return (
    <main className="min-h-screen bg-brand-dark text-brand-light px-6 py-24 max-w-3xl mx-auto">
      <h1 className="text-3xl font-light tracking-wide mb-12">{text.title}</h1>

      <section className="space-y-6 text-sm leading-relaxed text-brand-light/80">
        <p className="text-brand-light/60 italic">
          {locale === "fr" ? "Dernière mise à jour : " : "Last updated: "}
          {text.lastUpdated}
        </p>

        {text.sections.map((section, idx) => (
          <div key={idx}>
            <h2 className="text-lg font-medium text-brand-light mb-2">
              {section.title}
            </h2>

            {section.address ? (
              <p>
                {section.content}<br />
                {section.address}<br />
                {section.email}
              </p>
            ) : (
              <p>{section.content}</p>
            )}

            {section.listItems && (
              <ul className="list-disc list-inside mt-2 space-y-1">
                {section.listItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}

            {section.subContent && <p className="mt-2">{section.subContent}</p>}
            {section.extraContent && <p className="mt-2">{section.extraContent}</p>}
          </div>
        ))}
      </section>
    </main>
  );
}
