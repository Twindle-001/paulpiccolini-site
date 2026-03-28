"use client";

import Image from "next/image";
import Link from "next/link";
import { PortableText } from "next-sanity";
import { useEffect, useState } from "react";
import { client } from "@/sanity/client";
import { urlFor, buildSrc, buildSrcSet, QUALITY } from "@/sanity/image";
import { blogPostBySlugQuery } from "@/sanity/queries";
import type { SanityBlogPost } from "@/sanity/types";
import { useLanguage } from "@/context/LanguageContext";
import { localize, getLocalizedArray } from "@/lib/localize";

interface BlogPostContentProps {
  slug: string;
}

export default function BlogPostContent({ slug }: BlogPostContentProps) {
  const [post, setPost] = useState<SanityBlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { locale } = useLanguage();

  useEffect(() => {
    async function fetchPost() {
      const data = await client.fetch<SanityBlogPost>(
        blogPostBySlugQuery,
        { slug }
      );
      setPost(data);
      setIsLoading(false);
    }
    fetchPost();
  }, [slug]);

  if (isLoading) {
    return <div className="h-screen bg-brand-darker" />;
  }

  if (!post) {
    return (
      <section className="flex h-[50vh] items-center justify-center bg-brand-dark">
        <div className="text-center">
          <h1 className="font-heading text-3xl text-white">
            {locale === "en" ? "Article not found" : "Article non trouvé"}
          </h1>
          <Link href="/blog" className="btn-primary mt-8 inline-block">
            {locale === "en" ? "Back to blog" : "Retour au blog"}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero with cover image */}
      {post.coverImage && (
        <section className="relative h-[50vh] overflow-hidden">
          <img
            src={buildSrc(post.coverImage, 1920, QUALITY.hero)}
            srcSet={buildSrcSet(post.coverImage, QUALITY.hero)}
            alt={String(localize(post.title, locale) || "Article")}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/60" />
        </section>
      )}

      {/* Article content */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <article>
          {/* Header */}
          <header className="mb-12">
            <h1 className="font-heading text-5xl text-white mb-4">
              {localize(post.title, locale)}
            </h1>
            <div className="flex items-center gap-4 text-sm text-brand-light/60">
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString(
                    locale === "en" ? "en-US" : "fr-FR"
                  )}
                </time>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-2 py-1 text-xs rounded-full bg-brand-dark text-brand-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert max-w-none space-y-6">
            <PortableText
              value={getLocalizedArray(post.content, locale)}
              components={{
                block: {
                  p: ({ children }) => (
                    <p className="text-base leading-relaxed text-brand-light/70">
                      {children}
                    </p>
                  ),
                  h2: ({ children }) => (
                    <h2 className="font-heading text-3xl text-white mt-12 mb-6">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="font-heading text-2xl text-white mt-8 mb-4">
                      {children}
                    </h3>
                  ),
                },
              }}
            />
          </div>
        </article>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <Link href="/blog" className="text-sm text-brand-accent hover:text-white transition-colors">
            &larr; {locale === "en" ? "Back to blog" : "Retour au blog"}
          </Link>
        </div>
      </section>
    </>
  );
}
