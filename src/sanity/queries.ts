import { groq } from "next-sanity";

// ─── Site Settings ───────────────────────────────────────
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    name,
    logo,
    contactEmail,
    instagram,
    linkedin,
    facebook,
    footerLinks
  }
`;

// ─── Home Page ───────────────────────────────────────────
export const homePageQuery = groq`
  *[_type == "homePage"][0] {
    aboutHeading,
    aboutText,
    profileImage,
    portfolioHeading,
    servicesHeading,
    servicesIntro,
    servicesImage,
    servicesOnRequestImage,
    servicesOnRequestHeading,
    servicesOnRequestText,
    servicesOnRequestButton,
    printsHeading,
    printsLink
  }
`;

// ─── Services Page ───────────────────────────────────────
export const servicesPageQuery = groq`
  *[_type == "servicesPage"][0] {
    heading,
    intro,
    bannerImage,
    philosophyItems[] {
      image,
      heading,
      text,
      order
    },
    organizationHeading,
    organizationSteps[] {
      iconDescription,
      text,
      order
    },
    ctaHeading,
    ctaText
  }
`;

// ─── Contact Page ───────────────────────────────────────
export const contactPageQuery = groq`
  *[_type == "contactPage"][0] {
    bannerImage,
    heroSubtitle,
    heroTitle,
    intro,
    sentTitle,
    sentText,
    errorText,
    submitButtonText
  }
`;

// ─── Hero Slides ─────────────────────────────────────────
export const heroSlidesQuery = groq`
  *[_type == "heroSlide"] | order(order asc) {
    _id,
    title,
    subtitle,
    image,
    link,
    order
  }
`;

// ─── Categories ──────────────────────────────────────────
export const categoriesQuery = groq`
  *[_type == "category"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    coverImage,
    bannerImage,
    order
  }
`;

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    coverImage,
    bannerImage,
    order
  }
`;

// ─── Photos ──────────────────────────────────────────────
export const photosByCategoryQuery = groq`
  *[_type == "photo" && category->slug.current == $slug] | order(order asc) {
    _id,
    title,
    image,
    alt,
    subcategory,
    featured
  }
`;

export const subcategoriesByCategoryQuery = groq`
  array::unique(*[_type == "photo" && category->slug.current == $slug].subcategory)
`;

export const featuredPhotosQuery = groq`
  *[_type == "photo" && featured == true] | order(order asc) {
    _id,
    title,
    image,
    alt,
    "categorySlug": category->slug.current,
    "categoryTitle": category->title
  }
`;

// ─── Services / Pricing ───────────────────────────────────
export const servicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id,
    name,
    price,
    currency,
    popular,
    features[] {
      text,
      order
    },
    order
  }
`;

// ─── Blog Posts ───────────────────────────────────────────
export const blogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    publishedAt,
    tags
  }
`;

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    content,
    coverImage,
    publishedAt,
    tags
  }
`;

// ─── Prints / Art ─────────────────────────────────────────
export const printsQuery = groq`
  *[_type == "print"] | order(order asc) {
    _id,
    title,
    image,
    price,
    externalLink,
    order
  }
`;
