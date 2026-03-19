import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Paul Piccolini Photography",
  description:
    "Politique de confidentialité et protection des données personnelles.",
};

export default function PolitiqueConfidentialite() {
  return (
    <main className="min-h-screen bg-brand-dark text-brand-light px-6 py-24 max-w-3xl mx-auto">
      <h1 className="text-3xl font-light tracking-wide mb-12">
        Politique de confidentialité
      </h1>

      <section className="space-y-6 text-sm leading-relaxed text-brand-light/80">
        <p className="text-brand-light/60 italic">
          Dernière mise à jour : mars 2026
        </p>

        <div>
          <h2 className="text-lg font-medium text-brand-light mb-2">Responsable du traitement</h2>
          <p>
            Paul Piccolini — Entrepreneur individuel<br />
            73 avenue des Ternes, 75017 Paris<br />
            paul.piccolini@gmail.com
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium text-brand-light mb-2">Données collectées</h2>
          <p>
            Lors de l’utilisation du formulaire de contact, les données suivantes
            peuvent être collectées : prénom, nom, adresse e-mail, numéro de
            téléphone (optionnel) et le contenu de votre message.
          </p>
          <p className="mt-2">
            Aucune donnée n’est collectée automatiquement lors de la simple
            navigation sur le site, sauf si un outil d’analyse anonymisé est
            mis en place ultérieurement (voir section Cookies).
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium text-brand-light mb-2">Finalité du traitement</h2>
          <p>
            Les données collectées via le formulaire de contact sont utilisées
            uniquement pour :
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Répondre à vos demandes de renseignements ou de devis.</li>
            <li>Organiser et planifier les prestations photographiques.</li>
            <li>Établir les devis et factures.</li>
          </ul>
          <p className="mt-2">
            Vos données ne sont jamais vendues, cédées ou utilisées à des fins
            publicitaires.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium text-brand-light mb-2">Durée de conservation</h2>
          <p>
            Les données issues du formulaire de contact sont conservées pendant
            une durée maximale de 3 ans après le dernier échange. Les données
            liées à la facturation sont conservées 10 ans conformément aux
            obligations comptables.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium text-brand-light mb-2">Partage des données</h2>
          <p>
            Vos données personnelles ne sont partagées avec aucun tiers, à
            l’exception des prestataires techniques nécessaires au fonctionnement
            du site :
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Vercel (hébergement du site).</li>
            <li>Sanity (gestion de contenu).</li>
          </ul>
          <p className="mt-2">
            Si un service d’envoi d’e-mails est mis en place ultérieurement
            (type Brevo, Mailchimp), cette section sera mise à jour.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium text-brand-light mb-2">Cookies</h2>
          <p>
            Ce site n’utilise actuellement aucun cookie de suivi ou publicitaire.
            Des cookies strictement nécessaires au fonctionnement du site peuvent
            être déposés. Si un outil d’analyse d’audience (type Google Analytics
            ou Plausible) est ajouté ultérieurement, un bandeau de consentement
            sera mis en place et cette politique sera mise à jour.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium text-brand-light mb-2">Vos droits</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données
            (RGPD) et à la loi Informatique et Libertés, vous disposez des droits
            suivants :
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Droit d’accès à vos données personnelles.</li>
            <li>Droit de rectification ou de suppression.</li>
            <li>Droit à la limitation du traitement.</li>
            <li>Droit à la portabilité de vos données.</li>
            <li>Droit d’opposition au traitement.</li>
          </ul>
          <p className="mt-2">
            Pour exercer ces droits, contactez :
            paul.piccolini@gmail.com. Une réponse vous sera apportée dans un
            délai de 30 jours.
          </p>
          <p className="mt-2">
            Vous pouvez également introduire une réclamation auprès de la CNIL
            (Commission Nationale de l’Informatique et des Libertés) :
            www.cnil.fr.
          </p>
        </div>
      </section>
    </main>
  );
}
