"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { blogPostsQuery } from "@/sanity/queries";
import type { SanityBlogPost } from "@/sanity/types";
import { useLanguage } from "@/context/LanguageContext";
import { localize } from "@/lib/localize";

export default function BlogPage() {
  const [posts, setPosts] = useState<SanityBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { locale } = useLanguage();

  useEffect(() => {
    async function fetchPosts() {
      const data = await client.fetch<SanityBlogPost[]>(blogPostsQuery);
      setPosts(data);
      setIsLoading(false);
    }
    fetchPosts();
  }, []);

  if (isLoading) {
    return <div className="h-screen bg-brand-darker" />;
  }

  return (
    <>
      {/* Hero */}
      <section className="flex h-[40vh] items-center justify-center bg-brand-dark">
        <div className="text-center">
          <p className="section-subheading mb-4 text-brand-muted">
            {locale === "en" ? "Blog" : "Blog"}
          </p>
          <h1 className="font-heading text-5xl tracking-wider text-white md:text-6xl">
            {locale === "en" ? "Articles & Stories" : "Articles et Histoires"}
          </h1>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        {posts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-brand-light/60">
              {locale === "en"
                ? "No articles yet. Check back soon!"
                : "Pas d'articles pour le moment. Revenez bientôt !"}
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded border border-white/10 overflow-hidden hover:border-brand-accent/50 transition-all duration-300 hover:-translate-y-1"
              >
                {post.coverImage && (
                  <div className="relative aspect-video overflow-hidden bg-brand-darker">
                    <Image
                      src={urlFor(post.coverImage)
                        .width(600)
                        .height(400)
                        .url()}
                      alt={String(localize(post.title, locale) || "Article")}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
                <div className="flex flex-col flex-1 p-6">
                  <h3 className="font-heading text-lg text-white">
                    {localize(post.title, locale)}
                  </h3>
                  <p className="mt-3 text-sm text-brand-light/60 line-clamp-3">
                    {localize(post.excerpt, locale)}
                  </p>
                  <div className="mt-auto pt-4">
                    <p className="text-xs text-brand-muted">
                      {post.publishedAt &&
                        new Date(post.publishedAt).toLocaleDateString(
                          locale === "en" ? "en-US" : "fr-FR"
                        )}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
