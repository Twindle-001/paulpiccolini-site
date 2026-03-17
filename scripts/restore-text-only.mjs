/**
 * Restores all text content WITHOUT touching images.
 * Use this after an accidental overwrite to get text back while keeping images safe.
 *
 * Run with: SANITY_WRITE_TOKEN=your_token node scripts/restore-text-only.mjs
 */

import { createClient } from "@sanity/client";

const projectId = "a8ul70gd";
const dataset = "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error("❌ SANITY_WRITE_TOKEN is required.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

function toBlocks(paragraphs) {
  return paragraphs.map((text) => ({
    _type: "block",
    _key: Math.random().toString(36).slice(2, 10),
    children: [
      {
        _type: "span",
        _key: Math.random().toString(36).slice(2, 10),
        text,
        marks: [],
      },
    ],
    markDefs: [],
    style: "normal",
  }));
}

async function restore() {
  console.log("🔧 Restoring text content (images will NOT be touched)...\n");

  // Patch homePage — text only
  console.log("📝 Restoring Home Page text...");
  await client
    .patch("homePage")
    .set({
      aboutHeading: {
        fr: "Votre Photographe à Paris",
        en: "Your Photographer in Paris",
      },
      aboutText: {
        fr: toBlocks([
          "Je suis Paul Piccolini, diplômé d'un Bachelor en Commerce et d'un Master en Communication. Mais en réalité, ces diplômes ne vous diront pas l'essentiel sur moi.",
          "Doté de compétences et d'un goût pour les arts graphiques depuis mon plus jeune âge, je me suis tourné vers la photographie en 2015 lors d'un voyage de 6 mois en Australie. Avant de partir, j'avais décidé d'investir dans un appareil reflex amateur qui m'a finalement accompagné dans toutes mes aventures et est devenu une partie intégrante de mon quotidien pendant plus de 5 ans. Ma passion pour la photographie s'est intensifiée, et avec elle mon regard s'est aiguisé.",
          "En 2020, après avoir dépassé les limites de mon premier appareil, j'étais désireux d'explorer de nouvelles possibilités techniques et visuelles, j'ai donc décidé de passer à un appareil professionnel. Les retours de mon public étaient positifs et j'ai décidé de franchir une nouvelle étape. C'est ainsi que j'ai fait le grand saut pour devenir photographe professionnel.",
          "Bienvenue sur mon site où vous trouverez mon portfolio, mes services de portrait ainsi que mes tirages d'art.",
        ]),
        en: toBlocks([
          "I am Paul Piccolini, I graduated with a Bachelor in Business and a Master in Communication. But in reality, these degrees won't tell you the most about me.",
          "Having skills and an appetite for the graphic arts from a young age, I turned to photography in 2015 during a 6 month trip to Australia. Before leaving, I had decided to invest in an amateur reflex camera which eventually accompanied me on all my adventures and then became an integral part of my daily life for more than 5 years. My passion for photography intensified, and with it my eyes sharpened.",
          "In 2020, after having outgrown my first camera I was eager to explore new technical and visual possibilities so I decided to upgrade to a professional camera. The feedback from my audience was positive and I decided to take a new step forward. This is how I took the plunge into becoming a professional photographer.",
          "Welcome to my website where you will find my portfolio, my portrait services as well as my prints.",
        ]),
      },
      portfolioHeading: { fr: "PORTFOLIO", en: "PORTFOLIO" },
      servicesHeading: { fr: "Shooting Photo à Paris", en: "Paris Photoshoot" },
      servicesIntro: {
        fr: "Offrez-vous ou offrez un shooting photo dans les lieux les plus emblématiques de Paris.",
        en: "Gift yourself or others a photoshoot in the most iconic places of Paris.",
      },
      servicesOnRequestHeading: {
        fr: "Services sur demande",
        en: "Services on request",
      },
      servicesOnRequestText: {
        fr: "Intérieur, événements ou autres demandes… Envoyez-moi une demande par email en expliquant votre projet.",
        en: "Interior, events or other requests… Send me a request by email explaining your project.",
      },
      servicesOnRequestButton: {
        fr: "Me contacter",
        en: "Contact me",
      },
      printsHeading: { fr: "TIRAGES D'ART", en: "FINE ART PRINTS" },
      printsLink: "https://www.singulart.com/en/artist/paul-piccolini-19523",
    })
    .commit();
  console.log("  ✅ Home Page text restored (images preserved)");

  // Patch servicesPage — text only
  console.log("📝 Restoring Services Page text...");
  await client
    .patch("servicesPage")
    .set({
      heading: { fr: "Shootings Photo à Paris", en: "Paris Photoshoots" },
      intro: {
        fr: "Offrez-vous ou offrez un shooting photo devant les lieux les plus emblématiques de Paris.",
        en: "Gift yourself or others a photoshoot at the most iconic locations in Paris.",
      },
      philosophyItems: [
        {
          _key: "style",
          _type: "object",
          heading: { fr: "Un style unique et émotionnel", en: "A unique & emotional style" },
          text: {
            fr: "Il n'y a pas de photos plus réussies que celles qui viennent naturellement de leur sujet, dans une forme d'authenticité et de décontraction. L'objectif de mon approche est de mettre en valeur le sujet en suggérant et en composant avec les modèles pour révéler tout leur potentiel photographique.",
            en: "There are no more successful photos than those that come naturally from their subject, in a form of authenticity and relaxation. The goal of my approach is to highlight the subject by suggesting and composing with the models to reveal their full photographic potential.",
          },
          order: 1,
        },
        {
          _key: "equip",
          _type: "object",
          heading: { fr: "Un équipement haut de gamme", en: "High-end equipment" },
          text: {
            fr: "J'utilise un appareil photo professionnel haut de gamme avec un capteur de 42 Mégapixels idéal pour l'impression de photos en Haute Définition quel que soit le format. J'utilise également deux objectifs. Un 50mm classique couramment utilisé par de nombreux photographes portraitistes. Et un 16-35mm appelé « grand angle » qui me permet d'obtenir un rendu plus artistique.",
            en: "I use a high-end professional camera with a 42 Megapixel sensor, ideal for printing photos in High Definition regardless of format. I also use two lenses. A classic 50mm commonly used by many portrait photographers. And a 16-35mm called a \"wide angle\" which allows me to achieve a more artistic rendering.",
          },
          order: 2,
        },
        {
          _key: "city",
          _type: "object",
          heading: { fr: "Une ville bien-aimée", en: "A beloved city" },
          text: {
            fr: "Paris ne se révèle que si l'on explore chacun de ses recoins et chemins cachés. J'aime partir à la recherche des lieux les plus atypiques et secrets qui subliment la ville lumière, source d'inspiration infinie.",
            en: "Paris only reveals itself if you explore each of its hidden corners and paths. I love to search for the most unique and secret places that sublimate the City of Light, an infinite source of inspiration.",
          },
          order: 3,
        },
      ],
      organizationHeading: { fr: "Organisation", en: "Organization" },
      organizationSteps: [
        {
          _key: "step1",
          _type: "object",
          iconDescription: "Discussion",
          text: {
            fr: "Dans un premier temps, nous discuterons de votre projet photo par téléphone ou par email. Mon objectif est d'identifier les attentes et les motivations qui vous poussent à vouloir un shooting photo. Plus j'en saurai sur vos motivations, plus je serai en mesure de répondre à vos attentes aussi précisément que possible.",
            en: "First, we will discuss your photo project by phone or email. My goal is to identify the expectations and motivations that drive you to want a photoshoot. The more I know about your motivations, the more I will be able to meet your expectations as precisely as possible.",
          },
          order: 1,
        },
        {
          _key: "step2",
          _type: "object",
          iconDescription: "Planning",
          text: {
            fr: "Ensuite, nous pourrons planifier un créneau horaire, un jour et un lieu.",
            en: "Then, we can plan a time slot, a day, and a location.",
          },
          order: 2,
        },
        {
          _key: "step3",
          _type: "object",
          iconDescription: "Photoshoot",
          text: {
            fr: "La durée du shooting variera entre 1 heure et 2 heures selon la formule choisie. La durée du shooting aura un impact sur le nombre de photos et de lieux de shooting.",
            en: "The duration of the shoot will vary between 1 hour and 2 hours depending on the package chosen. The duration will impact the number of photos and shooting locations.",
          },
          order: 3,
        },
      ],
      ctaHeading: {
        fr: "Vous n'avez pas trouvé ce que vous cherchiez ?",
        en: "Didn't find what you were looking for?",
      },
      ctaText: {
        fr: "Je m'adapte aussi à vos demandes ! Contactez-moi pour en discuter.",
        en: "I also adapt to your requests! Contact me to discuss.",
      },
    })
    .commit();
  console.log("  ✅ Services Page text restored (images preserved)");

  // Patch hero slides — text only
  console.log("📝 Restoring Hero Slides text...");
  const slideData = [
    { _id: "heroSlide-paris", title: { fr: "Paris", en: "Paris" }, subtitle: { fr: "Découvrir Paris", en: "Discover Paris" }, link: "/paris", order: 1 },
    { _id: "heroSlide-travel", title: { fr: "Travel", en: "Travel" }, subtitle: { fr: "Découvrir les voyages", en: "Discover the travels" }, link: "/travel", order: 2 },
    { _id: "heroSlide-portrait", title: { fr: "Portrait", en: "Portrait" }, subtitle: { fr: "Découvrir les portraits", en: "Discover the portraits" }, link: "/portrait", order: 3 },
  ];
  for (const s of slideData) {
    await client.patch(s._id).set({ title: s.title, subtitle: s.subtitle, link: s.link, order: s.order }).commit();
  }
  console.log("  ✅ Hero Slides text restored (images preserved)");

  // Patch categories — text only
  console.log("📝 Restoring Categories text...");
  const catData = [
    { _id: "category-paris", description: { fr: "Découvrez Paris à travers mon objectif. La ville lumière sous toutes ses facettes.", en: "Discover Paris through my lens. The City of Light in all its facets." } },
    { _id: "category-travel", description: { fr: "Découvrez mes photos de voyage à travers le monde.", en: "Discover my travel photography from around the world." } },
    { _id: "category-portrait", description: { fr: "Découvrez mes portraits réalisés à Paris et ailleurs.", en: "Discover my portraits taken in Paris and beyond." } },
  ];
  for (const c of catData) {
    await client.patch(c._id).set({ description: c.description }).commit();
  }
  console.log("  ✅ Categories text restored (images preserved)");

  // Create Contact Page
  console.log("📝 Creating Contact Page...");
  await client.createOrReplace({
    _id: "contactPage",
    _type: "contactPage",
    heroSubtitle: { fr: "Prendre contact", en: "Get in touch" },
    heroTitle: { fr: "Contact", en: "Contact" },
    intro: {
      fr: "N'hésitez pas à me contacter pour un shooting photo à Paris, un projet sur mesure, ou toute question sur mon travail. Je vous répondrai sous 24 heures.",
      en: "Feel free to contact me for a photoshoot in Paris, a custom project, or any question about my work. I'll get back to you within 24 hours.",
    },
    sentTitle: { fr: "Message envoyé !", en: "Message sent!" },
    sentText: {
      fr: "Merci pour votre message. Je vous répondrai dès que possible.",
      en: "Thank you for reaching out. I'll reply as soon as possible.",
    },
    errorText: {
      fr: "Une erreur est survenue. Réessayez ou envoyez-moi un email à paul.piccolini@gmail.com",
      en: "An error occurred. Please try again or email me directly at paul.piccolini@gmail.com",
    },
    submitButtonText: { fr: "Envoyer le message", en: "Send message" },
  });
  console.log("  ✅ Contact Page created");

  console.log("\n✨ All text restored! Your images are intact.");
  console.log("   Refresh your Studio to see the new 'Page Contact' section.");
}

restore().catch((err) => {
  console.error("❌ Restore failed:", err.message);
  process.exit(1);
});
