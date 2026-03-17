# Paul Piccolini Photography Site - Complete Rework Summary

## Overview
Complete restructure of Sanity schemas, frontend pages, and language support for bilingual FR/EN website.

## Changes Made

### 1. Sanity Schemas (Restructured)

#### New Files Created:
- **src/sanity/schemas/localeFields.ts** - Helper functions for bilingual field creation
- **src/sanity/schemas/homePage.ts** - Homepage content management (about, services, prints)
- **src/sanity/schemas/servicesPage.ts** - Services page structure (philosophy, process, CTA)
- **src/sanity/schemas/blogPost.ts** - Blog article schema with portable text
- **src/sanity/schemas/print.ts** - Art prints/Singulart collection items

#### Modified Files:
- **src/sanity/schemas/siteSettings.ts**
  - Renamed title to "Configuration Générale"
  - Added logo, contactEmail, footerLinks array
  - Removed: siteTitle, description, profileImage, about/services fields

- **src/sanity/schemas/heroSlide.ts**
  - Added bilingual title and subtitle support
  - Added order field

- **src/sanity/schemas/category.ts**
  - Added bilingual description support
  - Added bannerImage field (separate from coverImage)
  - Added order field

- **src/sanity/schemas/service.ts**
  - Bilingual name support
  - Features refactored to array of objects with bilingual text
  - Added order field

### 2. Sanity Studio Desk Structure
Updated sanity.config.ts with reorganized backoffice:
```
⚙️ Configuration Générale (singleton)
🏠 Page d'Accueil (singleton)
📸 Page Services (singleton)
────────────
🖼️ Slides Hero
📁 Catégories
📷 Photos (by category)
────────────
💰 Forfaits / Tarifs
────────────
📝 Blog
🖨️ Tirages d'Art
```

### 3. Language Support

#### New Files:
- **src/context/LanguageContext.tsx** - React context for locale management
- **src/lib/localize.ts** - Helper functions for locale field retrieval

#### Features:
- FR/EN toggle buttons in Navbar
- Language persists in localStorage and URL parameter (?lang=en)
- All content pulls from localized fields
- Fallback: EN → FR or FR → EN if translation missing

### 4. Frontend Pages (Updated/New)

#### Updated:
- **src/app/layout.tsx** - Added LanguageProvider wrapper
- **src/app/(site)/layout.tsx** - Updated Footer props to include facebook and footerLinks
- **src/app/(site)/page.tsx** (Homepage)
  - Client component with useLanguage hook
  - Fetches homePageQuery and printsQuery
  - Uses localize() for all text
  - New Prints section at bottom

- **src/components/Navbar.tsx**
  - Added FR/EN language toggle buttons
  - Added SHOP link to /prints
  - Dynamic category links
  - Active link styling with brand-accent border

- **src/components/Footer.tsx**
  - Accepts footerLinks prop for dynamic footer links
  - Added Facebook support
  - Renders links from Sanity configuration

#### New Pages:
- **src/app/(site)/services/page.tsx** - Complete rework
  - Uses servicesPageQuery for page content
  - Philosophy section (3 columns from Sanity)
  - Organisation steps (3-step process)
  - Bilingual pricing cards with features

- **src/app/(site)/prints/page.tsx** - New
  - Grid of prints from print schema
  - External links to Singulart or shop URLs
  - Bilingual CTA section

- **src/app/(site)/blog/page.tsx** - New
  - Lists all blog posts (newest first)
  - Card layout with cover image, title, excerpt
  - Published date display

- **src/app/(site)/blog/[slug]/page.tsx** - New
  - Individual blog post view
  - Full portable text rendering
  - Author date, tags, cover image
  - Back to blog link

### 5. Sanity Queries and Types

#### Updated src/sanity/queries.ts:
- homePageQuery - New
- servicesPageQuery - New
- blogPostsQuery - New
- blogPostBySlugQuery - New
- printsQuery - New
- Updated all existing queries to include new fields

#### Updated src/sanity/types.ts:
- LocaleField<T> generic type for bilingual fields
- New interfaces:
  - SanityHomePage
  - SanityServicesPage
  - SanityBlogPost
  - SanityPrint
- Updated existing interfaces for locale support

### 6. Configuration Changes
- Brand colors maintained: brand-dark, brand-darker, brand-muted, brand-light, brand-accent
- Tailwind CSS styling preserved
- Image domains: cdn.sanity.io, paulpiccolini.com
- Sanity project: a8ul70gd (production dataset)

## Key Features Implemented

✓ Bilingual FR/EN support on all pages
✓ Language toggle in navbar (FR/EN buttons)
✓ Persistent language preference (localStorage + URL)
✓ Dynamic category navigation
✓ Redesigned services page with philosophy section
✓ Blog system with article management
✓ Art prints collection page
✓ Dynamic footer with configurable links
✓ Responsive mobile menu
✓ Elegant dark theme maintained

## Migration Notes

### For Content Editors:
1. Duplicate existing content to new schemas:
   - Move homepage content → homePage singleton
   - Move services content → servicesPage singleton
   - Add translations for all fields in FR/EN

2. New Sanity Documents to create:
   - At least one homePage document
   - At least one servicesPage document
   - Add prints to print collection
   - Add blog articles (optional)

### Breaking Changes:
- Old siteSettings fields (aboutHeading, servicesHeading, etc.) moved to homePage
- Gallery pages now use category.description (bilingual)
- Service features changed from string[] to object array with text field

### URL Changes:
- New: /prints - Art prints collection
- New: /blog - Blog listing
- New: /blog/[slug] - Individual articles
- Existing: /, /[slug], /services, /contact maintained

## Files Changed Summary
- 10 schema files (6 new, 4 modified)
- 1 config file (sanity.config.ts)
- 8 component/page files created/modified
- 3 utility files created (localeFields, LanguageContext, localize)
- 2 Sanity files (queries, types)

## Next Steps
1. Deploy changes to Sanity
2. Create homePage and servicesPage documents in studio
3. Add translations to all bilingual fields
4. Create blog posts and print items (optional)
5. Test language switching across all pages
6. Update footer links in Configuration Générale
