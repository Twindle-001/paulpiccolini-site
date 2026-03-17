#!/bin/bash
# ═══════════════════════════════════════════════════════════
# Setup script — Sanity integration for paulpiccolini-site
# ═══════════════════════════════════════════════════════════

echo ""
echo "🔧 Configuration du backoffice Sanity..."
echo ""

# 1. Install dependencies
echo "📦 Installation des packages Sanity..."
npm install next-sanity@latest @sanity/image-url@latest sanity@latest @sanity/vision@latest styled-components@latest

if [ $? -ne 0 ]; then
  echo "❌ Erreur lors de l'installation des packages. Vérifiez votre connexion."
  exit 1
fi
echo "✅ Packages installés !"
echo ""

# 2. Remove old static category pages (replaced by dynamic [slug] route)
echo "🗑️  Suppression des anciennes pages statiques..."
rm -rf src/app/paris src/app/travel src/app/portrait
rm -rf src/app/page.tsx src/app/services/page.tsx src/app/contact/page.tsx
rm -rf src/app/studio
rm -f src/app/[slug]/page.tsx
echo "✅ Anciennes pages supprimées !"
echo ""

# 3. Remove old data file (content now comes from Sanity)
echo "🗑️  Suppression de l'ancien fichier de données statiques..."
rm -f src/lib/data.ts
echo "✅ Ancien fichier de données supprimé !"
echo ""

# 4. Check .env.local
if grep -q "VOTRE_PROJECT_ID" .env.local 2>/dev/null; then
  echo ""
  echo "⚠️  IMPORTANT: Vous devez remplir votre .env.local !"
  echo "   Ouvrez le fichier .env.local et remplacez VOTRE_PROJECT_ID"
  echo "   par votre vrai Project ID Sanity."
  echo ""
  echo "   Pour le trouver: https://www.sanity.io/manage"
  echo "   → Votre projet → Settings → API → Project ID"
  echo ""
fi

echo "═══════════════════════════════════════════════════════════"
echo "✅ Installation terminée !"
echo ""
echo "Prochaines étapes :"
echo "  1. Vérifiez que .env.local contient votre Project ID Sanity"
echo "  2. Lancez le site : npm run dev"
echo "  3. Ouvrez le Studio : http://localhost:3000/studio"
echo "  4. Commencez à ajouter du contenu dans le backoffice !"
echo "═══════════════════════════════════════════════════════════"
