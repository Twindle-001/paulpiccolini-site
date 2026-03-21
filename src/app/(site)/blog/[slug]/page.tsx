import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { blogPostBySlugQuery } from "@/sanity/queries";
import type { SanityBlogPost } from "@/sanity/types";
import { urlFor } from "@/sanity/image";
import { JsonLd } from "@/components/JsonLd";
import BlogPostContent from "./BlogPostContent";

export const revalidate = 60;

// Dynamic metadata for SEO + canonical URL
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch<SanityBlogPost>(blogPostBySlugQuery, {
    slug,
  });

  if (!post) return { title: "Not Found" };

  const title =
    typeof post.title === "string"
      ? post.title
      : post.title?.fr || post.title?.en || "Article";

  const excerpt =
    typeof post.excerpt === "string"
      ? post.excerpt
      : post.excerpt?.fr || post.excerpt?.en || "";

  const description =
    excerpt || `${title} — Blog de Paul Piccolini Photography`;

  return {
    title: `${title} | Blog Paul Piccolini`,
    description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: `${title} | Paul Piccolini`,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: ["Paul Piccolini"],
      url: `https://paulpiccolini.com/blog/${slug}`,
      ...(post.coverImage && {
        images: [
          {
            url: urlFor(post.coverImage).width(1200).height(630).url(),
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(post.coverImage && {
        images: [urlFor(post.coverImage).width(1200).height(630).url()],
      }),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch post for JSON-LD schema
  const post = await client.fetch<SanityBlogPost>(blogPostBySlugQuery, {
    slug,
  });

  const title =
    typeof post?.title === "string"
      ? post.title
      : post?.title?.fr || post?.title?.en || "Article";
  const excerpt =
    typeof post?.excerpt === "string"
      ? post.excerpt
      : post?.excerpt?.fr || post?.excerpt?.en || "";

  // BlogPosting JSON-LD schema for rich results
  const articleSchema = post
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description: excerpt || `${title} — Blog de Paul Piccolini`,
        image: post.coverImage
          ? urlFor(post.coverImage).width(1200).height(630).url()
          : undefined,
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        author: {
          "@type": "Person",
          name: "Paul Piccolini",
          url: "https://paulpiccolini.com",
        },
        publisher: {
          "@type": "Person",
          name: "Paul Piccolini",
          url: "https://paulpiccolini.com",
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://paulpiccolini.com/blog/${slug}`,
        },
        inLanguage: "fr-FR",
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://paulpiccolini.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://paulpiccolini.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `https://paulpiccolini.com/blog/${slug}`,
      },
    ],
  };

  return (
    <>
      {articleSchema && <JsonLd data={articleSchema} />}
      <JsonLd data={breadcrumbSchema} />
      <BlogPostContent slug={slug} />
    </>
  );
}
