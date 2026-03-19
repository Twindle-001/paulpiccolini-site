import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales | Paul Piccolini Photography",
  description: "Mentions légales du site paulpiccolini.com",
};

export default function MentionsLegales() {
  return (
    <main className="min-h-screen bg-brand-dark text-brand-light px-6 py-24 max-w-3xl mx-auto">
      <h1 className="text-3xl font-light tracking-wide mb-12">Mentions légales</h1>

      <section className="space-y-6 text-sm leading-relaxed text-brand-light/80">
        <div>
          <h2 className="text-lg font-medium text-brand-light mb-2">Éditeur du site</h2>
          <p>
            Paul Piccolini — Entrepreneur individuel<br />
            SIRET : 893 719 773 00010<br />
            73 avenue des Ternes, 75017 Paris<br />
            Téléphone : 06 78 70 93 54<br />
            E-mail : paul.piccolini@gmail.com
          </p>
          <p className="mt-2">
            TVA non applicable, article 293 B du Code général des impôts.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium text-brand-light mb-2">Directeur de la publication</h2>
          <p>Paul Piccolini</p>
        </div>

        <div>
          <h2 className="text-lg font-medium text-brand-light mb-2">Hébergement</h2>
          <p>
            Vercel Inc.<br />
            440 N Barranca Ave #4133, Covina, CA 91723, États-Unis<br />
            Site : vercel.com
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium text-brand-light mb-2">Propriété intellectuelle</h2>
          <p>
            L’ensemble du contenu de ce site (textes, photographies, illustrations,
            logo, mise en page) est la propriété exclusive de Paul Piccolini, sauf
            mention contraire. Toute reproduction, représentation, modification,
            publication ou adaptation, totale ou partielle, est strictement interdite
            sans l’autorisation écrite préalable de Paul Piccolini.
          </p>
          <p className="mt-2">
            Les photographies présentées sur ce site sont protégées par le Code de
            la propriété intellectuelle. Leur téléchargement, copie ou utilisation sans
            autorisation est passible de poursuites.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium text-brand-light mb-2">Responsabilité</h2>
          <p>
            Paul Piccolini s’efforce d’assurer l’exactitude des informations
            diffusées sur ce site. Toutefois, il ne saurait être tenu responsable des
            omissions, inexactitudes ou difficultés d’accès au site. Paul Piccolini
            se réserve le droit de modifier le contenu du site à tout moment et sans
            préavis.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium text-brand-light mb-2">Crédits</h2>
          <p>
            Développement : Next.js + Tailwind CSS<br />
            CMS : Sanity<br />
            Photographies : Paul Piccolini
          </p>
        </div>
      </section>
    </main>
  );
}
