import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { blogPostBySlugQuery } from "@/sanity/queries";
import type { SanityBlogPost } from "@/sanity/types";
import { urlFor } from "@/sanity/image";
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
    title,
    description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: `${title} | Paul Piccolini`,
      description,
      type: "article",
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
  return <BlogPostContent slug={slug} />;
}
