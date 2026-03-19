import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

// Locale field type
export interface LocaleField<T = string> {
  fr?: T;
  en?: T;
}

// Settings & Configuration
export interface SanitySettings {
  _id?: string;
  name: string;
  logo?: SanityImageSource;
  contactEmail?: string;
  instagram?: string;
  linkedin?: string;
  facebook?: string;
  footerLinks?: Array<{
    label: string;
    href: string;
  }>;
}

// Pages
export interface SanityHomePage {
  _id?: string;
  aboutHeading?: LocaleField<string>;
  aboutText?: LocaleField<any[]>;
  profileImage?: SanityImageSource;
  portfolioSubheading?: LocaleField<string>;
  portfolioHeading?: LocaleField<string>;
  servicesHeading?: LocaleField<string>;
  servicesIntro?: LocaleField<string>;
  servicesImage?: SanityImageSource;
  servicesOnRequestImage?: SanityImageSource;
  servicesOnRequestHeading?: LocaleField<string>;
  servicesOnRequestText?: LocaleField<string>;
  servicesOnRequestButton?: LocaleField<string>;
  printsSubheading?: LocaleField<string>;
  printsHeading?: LocaleField<string>;
  printsLink?: string;
}

export interface SanityServicesPage {
  _id?: string;
  heading?: LocaleField<string>;
  intro?: LocaleField<string>;
  bannerImage?: SanityImageSource;
  bannerImageMobile?: SanityImageSource;
  philosophyItems?: Array<{
    image?: SanityImageSource;
    heading?: LocaleField<string>;
    text?: LocaleField<string>;
    order?: number;
  }>;
  organizationHeading?: LocaleField<string>;
  organizationSteps?: Array<{
    iconDescription?: string;
    text?: LocaleField<string>;
    order?: number;
  }>;
  ctaHeading?: LocaleField<string>;
  ctaText?: LocaleField<string>;
}

export interface SanityContactPage {
  _id?: string;
  bannerImage?: SanityImageSource;
  bannerImageMobile?: SanityImageSource;
  heroSubtitle?: LocaleField<string>;
  heroTitle?: LocaleField<string>;
  intro?: LocaleField<string>;
  sentTitle?: LocaleField<string>;
  sentText?: LocaleField<string>;
  errorText?: LocaleField<string>;
  submitButtonText?: LocaleField<string>;
}

// Gallery & Categories
export interface SanityCategory {
  _id: string;
  title: LocaleField<string>;
  slug: string;
  description?: LocaleField<string>;
  coverImage?: SanityImageSource;
  bannerImage?: SanityImageSource;
  bannerImageMobile?: SanityImageSource;
  order?: number;
}

export interface SanityPhoto {
  _id: string;
  title?: string;
  image: SanityImageSource;
  alt?: string;
  subcategory?: string;
  featured?: boolean;
  categorySlug?: string;
  categoryTitle?: string;
}

// Hero Slides
export interface SanityHeroSlide {
  _id: string;
  title?: LocaleField<string>;
  subtitle?: LocaleField<string>;
  image: SanityImageSource;
  link?: string;
  order?: number;
}

// Services & Pricing
export interface SanityService {
  _id: string;
  name?: LocaleField<string>;
  price: string;
  currency: string;
  popular?: boolean;
  features?: Array<{
    text?: LocaleField<string>;
    order?: number;
  }>;
  order?: number;
}

// Blog
export interface SanityBlogPost {
  _id: string;
  title?: LocaleField<string>;
  slug?: string;
  excerpt?: LocaleField<string>;
  content?: LocaleField<any[]>;
  coverImage?: SanityImageSource;
  publishedAt?: string;
  tags?: string[];
}

// Prints
export interface SanityPrint {
  _id: string;
  title: string;
  image?: SanityImageSource;
  price: string;
  externalLink: string;
  order?: number;
}

export interface SanityPrintsPage {
  bannerImage?: SanityImageSource;
  bannerImageMobile?: SanityImageSource;
  heading?: LocaleField;
  subheading?: LocaleField;
  description?: LocaleField;
  introText?: LocaleField;
  ctaHeading?: LocaleField;
  ctaText?: LocaleField;
}
