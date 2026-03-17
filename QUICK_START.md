# Quick Start Guide - Paul Piccolini Photography Site Rework

## What Changed

Your photography website has been completely restructured with:
- Full bilingual FR/EN support throughout
- New Sanity schemas for better content organization
- Language toggle buttons (FR/EN) in the navbar
- New pages: Blog, Art Prints Shop
- Reorganized Sanity Studio with cleaner backoffice structure

## Get Started in 5 Minutes

### 1. Create Core Documents in Sanity Studio

Go to https://sanity.io and create these THREE documents (click "Create"):

**a) Configuration Générale** (siteSettings)
- Name: Paul Piccolini
- Contact Email: paul.piccolini@gmail.com
- Social links (Instagram, LinkedIn, Facebook URLs)

**b) Page d'Accueil** (homePage)
- About section heading (both languages)
- About text (both languages)
- Profile image
- Portfolio heading (both languages)
- Services section setup (both languages)
- Prints heading & link to Singulart

**c) Page Services** (servicesPage)
- Main heading & intro (both languages)
- Banner image
- 3 philosophy items (Style, Equipment, City)
- 3 organization steps (Discussion, Planning, Photoshoot)
- CTA section

### 2. Update Existing Content

**Services:**
- Edit each service - add name in BOTH FR + EN
- Edit features - now they're objects, add text in FR + EN

**Categories:**
- Edit each (Paris, Travel, Portrait) - add description in FR + EN

**Hero Slides:**
- Edit title & subtitle - add in FR + EN

### 3. Test Locally

```bash
cd /sessions/brave-nifty-planck/mnt/Documents/paulpiccolini-site
npm run dev
```

- Visit http://localhost:3000
- Click FR/EN buttons to test language switching
- Test mobile menu
- Click SHOP to see prints page

## File Structure Overview

```
src/
├── app/(site)/
│   ├── page.tsx              → Homepage (with prints section)
│   ├── services/page.tsx     → Services page (redesigned)
│   ├── prints/page.tsx       → NEW: Art prints shop
│   ├── blog/
│   │   ├── page.tsx          → NEW: Blog listing
│   │   └── [slug]/page.tsx   → NEW: Individual articles
│   └── contact/page.tsx
│
├── components/
│   ├── Navbar.tsx            → Updated with FR/EN toggle
│   └── Footer.tsx            → Updated with dynamic links
│
├── context/
│   └── LanguageContext.tsx   → NEW: Language management
│
├── lib/
│   └── localize.ts           → NEW: Translation helpers
│
└── sanity/
    ├── schemas/
    │   ├── homePage.ts       → NEW
    │   ├── servicesPage.ts   → NEW
    │   ├── blogPost.ts       → NEW
    │   ├── print.ts          → NEW
    │   ├── localeFields.ts   → NEW: Bilingual field helper
    │   ├── siteSettings.ts   → Modified
    │   ├── category.ts       → Modified (bilingual)
    │   ├── service.ts        → Modified (bilingual)
    │   └── heroSlide.ts      → Modified (bilingual)
    ├── queries.ts            → Updated
    └── types.ts              → Updated
```

## Key New Features

### Language Support
- FR/EN buttons in top right of navbar
- Language preference saved in browser
- All content automatically switches language
- Fallback: If translation missing, shows other language

### Homepage
- New "Prints" section at bottom
- All text from Sanity (about, services, etc.)
- Portfolio section dynamically shows categories

### Services Page
- Philosophy section (3 columns) - Why Choose Me
- Organization steps - How It Works (3 steps)
- Redesigned pricing cards with bilingual features
- Custom CTA section

### New Pages
- `/prints` - Art prints collection (links to Singulart)
- `/blog` - Blog article listing
- `/blog/[slug]` - Individual article view

### Footer
- Dynamic footer links from Sanity Configuration
- Facebook support added
- Cleaner structure

## Sanity Schema Changes

### New Data Types

**Locale Fields** - All text now has FR + EN versions:
```
{
  aboutHeading: {
    fr: "Votre Photographe à Paris",
    en: "Your Photographer in Paris"
  }
}
```

**Service Features** - Changed from simple array:
```
// OLD: ["Feature 1", "Feature 2"]

// NEW:
[
  { text: { fr: "...", en: "..." }, order: 0 },
  { text: { fr: "...", en: "..." }, order: 1 }
]
```

## Navigation URLs

| Page | URL |
|------|-----|
| Homepage | / |
| Categories | /[slug] (e.g., /paris) |
| Services | /services |
| Prints Shop | /prints |
| Blog | /blog |
| Article | /blog/[slug] |
| Contact | /contact |

## Common Tasks

### Add a New Blog Post
1. Go to Sanity Studio → Blog
2. Click "Create"
3. Fill: title (FR+EN), slug, excerpt (FR+EN), content (FR+EN), cover image
4. Set published date & tags
5. Save → appears on /blog page

### Add Art Prints
1. Sanity Studio → Tirages d'Art
2. Click "Create"
3. Title, image (square), price, Singulart link
4. Save → appears on /prints page

### Update Footer Links
1. Sanity Studio → Configuration Générale
2. Scroll to "Liens Footer"
3. Edit existing or add new: label + href
4. Examples: "Mentions légales", "CGV", "Politique de confidentialité"

### Change Philosophy/Organization Items
1. Sanity Studio → Page Services
2. Edit Philosophy Items (3 columns)
3. Edit Organization Steps (3 steps)
4. Each has image, heading, text in FR+EN

## Troubleshooting

**Language toggle not working?**
- Browser must have cookies/localStorage enabled
- Try clearing browser cache
- Check ?lang=en in URL

**Images not showing?**
- Verify images are uploaded to Sanity
- Check image URLs in browser console
- Ensure cdn.sanity.io is in next.config.ts imagedomains

**Services features showing old data?**
- Edit each service
- Update "Caractéristiques" field (now an array of objects)
- Add { text: { fr: "...", en: "..." } } for each feature

**Homepage not showing prints?**
- Create at least one print document
- Set printsLink in homePage to Singulart URL
- Prints won't show if query returns empty

## Contact & Support

- Contact Email: paul.piccolini@gmail.com
- Instagram: instagram.com/paulpiccolini
- LinkedIn: linkedin.com/in/paulpiccolini

---

**Version:** 1.0
**Last Updated:** March 17, 2026
**Status:** Ready for production

## Next Steps
1. Create the three core documents in Sanity
2. Add translations to all existing content
3. Test language switching
4. Deploy to production
5. Announce on social media
