import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente | Paul Piccolini Photography",
  description: "CGV des prestations de photographie de Paul Piccolini.",
};

export default function CGV() {
  return (
    <main className="min-h-screen bg-brand-dark text-brand-light px-6 py-24 max-w-3xl mx-auto">
      <h1 className="text-3xl font-light tracking-wide mb-12">
        Conditions Générales de Vente
      </h1>

      <section className="space-y-6 text-sm leading-relaxed text-brand-light/80">
        <p className="text-brand-light/60 italic">
          Dernière mise à jour : mars 2026
        </p>

        <div>
          <h2 className="text-lg font-medium text-brand-light mb-2">Article 1 — Objet</h2>
          <p>
            Les présentes Conditions Générales de Vente (CGV) régissent les
            prestations de services de photographie proposées par Paul Piccolini,
            entrepreneur individuel (SIRET : 893 719 773 00010), ci-après
            dénommé « le Photographe », à tout client professionnel ou
            particulier, ci-après dénommé « le Client ».
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium text-brand-light mb-2">Article 2 — Prestations</h2>
          <p>
            Le Photographe propose des prestations de photographie immobilière et
            d’architecture, incluant la prise de vue sur site et la livraison de
            fichiers numériques retraités en haute définition. Le détail de chaque
            prestation (nombre de photos, durée, lieu) est défini par devis
            préalable accepté par le Client.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium text-brand-light mb-2">Article 3 — Tarifs et paiement</h2>
          <p>
            Les tarifs sont indiqués en euros et sont nets de taxes (TVA non
            applicable, article 293 B du CGI). Un acompte de 30 % du montant total
            est exigé à la réservation. Le solde est dû à la livraison des
            fichiers numériques. Les fichiers en haute définition ne sont transmis
            qu’après réception du paiement intégral.
          </p>
          <p className="mt-2">
            Modes de paiement acceptés : virement bancaire, chèque.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium text-brand-light mb-2">Article 4 — Délais de livraison</h2>
          <p>
            Les photographies retraitées sont livrées par voie électronique
            (lien de téléchargement sécurisé) dans un délai de 72 heures ouvrées
            après la séance, sauf accord différent mentionné sur le devis.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium text-brand-light mb-2">Article 5 — Annulation et report</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Plus de 48 h avant la séance : remboursement intégral de l’acompte.</li>
            <li>Entre 24 h et 48 h : 50 % de l’acompte retenu.</li>
            <li>Moins de 24 h ou absence : acompte intégralement retenu.</li>
            <li>Report gratuit si le Photographe est prévenu au moins 48 h à l’avance.</li>
          </ul>
          <p className="mt-2">
            En cas d’annulation du fait du Photographe, l’acompte est
            intégralement remboursé ou la séance reportée sans frais.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium text-brand-light mb-2">Article 6 — Propriété intellectuelle et droits d’utilisation</h2>
          <p>
            Les photographies restent la propriété intellectuelle du Photographe,
            conformément au Code de la propriété intellectuelle. Le Client
            bénéficie d’une licence d’utilisation non exclusive pour les usages
            définis au devis (publication en ligne, supports commerciaux, etc.).
            Toute utilisation non prévue nécessite un accord écrit préalable.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium text-brand-light mb-2">Article 7 — Tirages d’art</h2>
          <p>
            Les tirages d’art sont vendus exclusivement via la plateforme Singulart.
            Les conditions de vente, de livraison et de rétractation applicables
            aux tirages sont celles de Singulart.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium text-brand-light mb-2">Article 8 — Responsabilité</h2>
          <p>
            Le Photographe s’engage à réaliser la prestation avec
            professionnalisme. En cas de défaillance technique imprévue rendant la
            prestation impossible, le Photographe proposera une nouvelle date ou le
            remboursement intégral. Sa responsabilité est limitée au montant de la
            prestation.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium text-brand-light mb-2">Article 9 — Droit applicable et litiges</h2>
          <p>
            Les présentes CGV sont soumises au droit français. En cas de litige,
            les parties s’efforceront de trouver une solution amiable. À défaut,
            les tribunaux de Paris seront seuls compétents.
          </p>
        </div>
      </section>
    </main>
  );
}
