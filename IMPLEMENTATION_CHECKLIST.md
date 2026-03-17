# Implementation Checklist for Reworked Site

## Phase 1: Deploy & Test (Immediate)

### Backend Setup
- [ ] Deploy updated Sanity schemas to production
- [ ] Verify all new schema types appear in Sanity Studio
- [ ] Check desk structure displays correctly with new organization

### Create Required Singletons
In Sanity Studio, create these documents:

**Configuration Générale (siteSettings)**
- [ ] Photographer name: "Paul Piccolini"
- [ ] Contact email: paul.piccolini@gmail.com
- [ ] Instagram URL
- [ ] LinkedIn URL
- [ ] Facebook URL
- [ ] Footer links array (Mentions légales, CGV, Politique de confidentialité)
- [ ] Optional: Logo image

**Page d'Accueil (homePage)**
- [ ] About heading (FR + EN)
- [ ] About text (FR + EN) - Portable text
- [ ] Profile image (from siteSettings or new)
- [ ] Portfolio heading (FR + EN)
- [ ] Services heading (FR + EN)
- [ ] Services intro (FR + EN)
- [ ] Services image
- [ ] Services on request heading (FR + EN)
- [ ] Services on request text (FR + EN)
- [ ] Prints heading (FR + EN)
- [ ] Prints link URL (to Singulart or shop)

**Page Services (servicesPage)**
- [ ] Main heading (FR + EN)
- [ ] Intro text (FR + EN)
- [ ] Banner image
- [ ] Philosophy items (3 items minimum):
  - [ ] Image, heading (FR+EN), text (FR+EN), order
  - [ ] Examples: Style unique, Équipement, Ville
- [ ] Organization heading (FR + EN)
- [ ] Organization steps (3 items):
  - [ ] Icon description, text (FR+EN), order
  - [ ] Examples: Discussion, Planning, Photoshoot
- [ ] CTA heading (FR + EN)
- [ ] CTA text (FR + EN)

### Update Existing Content
- [ ] Update all Category descriptions to include FR + EN
- [ ] Update all Service names to include FR + EN
- [ ] Update all Service features to include FR + EN (note: changed to objects)
- [ ] Add bilingual titles/subtitles to Hero slides
- [ ] Verify all images are optimized

### Frontend Testing
- [ ] Test homepage loads with localization context
- [ ] Test FR/EN toggle buttons work in navbar
- [ ] Test language persists on refresh
- [ ] Test language switches in URL parameter
- [ ] Test homepage responsive design
- [ ] Test services page with new content
- [ ] Test prints page displays correctly
- [ ] Test blog listing/article pages
- [ ] Test mobile menu functions

## Phase 2: Content Migration (Week 1)

### Blog Setup (Optional)
- [ ] Create 2-3 sample blog posts
- [ ] Add cover images
- [ ] Write excerpts in FR + EN
- [ ] Add content in portable text format
- [ ] Set published dates
- [ ] Add tags (optional)
- [ ] Test blog pages display correctly

### Prints Setup
- [ ] Add 3-6 prints to collection
- [ ] Add print images (square aspect ratio recommended)
- [ ] Set prices (format: "130€ - 490€" or "199€")
- [ ] Add external links to Singulart
- [ ] Set order for display
- [ ] Test prints page and links

### Newsletter/Contact Integration (Optional)
- [ ] Implement Formspree integration in contact form
- [ ] Test form submission
- [ ] Configure email notifications

## Phase 3: SEO & Performance (Week 2)

### SEO Optimization
- [ ] Update meta descriptions for all pages
- [ ] Add robots.txt configuration
- [ ] Create sitemap.xml
- [ ] Set up Google Search Console
- [ ] Add structured data (Schema.org)

### Performance
- [ ] Test image optimization with Next.js Image
- [ ] Verify font loading performance
- [ ] Check Core Web Vitals
- [ ] Test on mobile devices (iOS/Android)
- [ ] Lighthouse audit (target: 90+ all metrics)

### Analytics
- [ ] Set up Google Analytics 4
- [ ] Configure goal tracking
- [ ] Set up conversion tracking for contact/prints

## Phase 4: Launch (Week 2/3)

### Pre-Launch
- [ ] Final QA pass on all pages
- [ ] Test all links (internal/external)
- [ ] Verify contact form works
- [ ] Check print links to Singulart
- [ ] Test language switching on all pages
- [ ] Mobile responsiveness final check
- [ ] Browser compatibility test (Chrome, Firefox, Safari, Edge)

### Deployment
- [ ] Deploy to production
- [ ] Verify all pages load correctly
- [ ] Test form submissions in production
- [ ] Monitor error logs

### Post-Launch
- [ ] Submit sitemap to Google Search Console
- [ ] Announce on social media (Instagram, LinkedIn, Facebook)
- [ ] Test social sharing (OG tags)
- [ ] Monitor analytics for first week

## Configuration Reference

### Sanity Project
- Project ID: a8ul70gd
- Dataset: production
- API Version: Latest (v2024-11-01 or current)

### Environment Variables
```
NEXT_PUBLIC_SANITY_PROJECT_ID=a8ul70gd
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-11-01
```

### Image Optimization
- Domains: cdn.sanity.io, paulpiccolini.com
- Format: AVIF with fallbacks
- Lazy loading: Enabled by default

## Default Content (Fallbacks)

If content is missing from Sanity, pages will display:

**Homepage:**
- EN: "Your Photographer in Paris"
- FR: "Votre Photographe à Paris"

**Services Page:**
- EN: "Paris Photoshoots"
- FR: "Photoshoots à Paris"

**Services on Request:**
- EN: "Services on Request" / "Interior, events or other requests..."
- FR: "Services sur demande" / "Intérieur, événements ou autres demandes..."

**Gallery:**
- EN: "Discover"
- FR: "Découvrir"

## Troubleshooting

### Language not persisting
- Check localStorage enabled in browser
- Verify LanguageContext wrapped in layout.tsx
- Check URL parameter: ?lang=en or ?lang=fr

### Images not loading
- Verify image domains in next.config.ts
- Check Sanity image URLs are accessible
- Ensure CDN configuration correct

### Content not appearing
- Verify documents created as singletons (not lists)
- Check field names match schema exactly
- Verify _id field exists for singletons:
  - siteSettings: "siteSettings"
  - homePage: "homePage"
  - servicesPage: "servicesPage"

### Mobile menu not working
- Check CSS transitions in Navbar.tsx
- Verify z-index hierarchy (navbar: z-50)
- Test on actual mobile devices

## Support Notes

- All pages use client-side data fetching (useEffect)
- Language preference stored in localStorage
- Images use Next.js Image component for optimization
- Portable text rendering via next-sanity
- Forms ready for Formspree integration
- Contact email: paul.piccolini@gmail.com

---

Last Updated: 2026-03-17
Version: 1.0 Complete Rework
