import { MetadataRoute } from "next";
import { client } from "@/sanity/client";

interface Category {
  slug: string;
  _updatedAt: string;
}

interface BlogPost {
  slug: string;
  publishedAt: string;
}

interface Print {
  _id: string;
  _updatedAt?: string;
}

const baseUrl = "https://paulpiccolini.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all categories
  const categories = await client.fetch<Category[]>(
    `*[_type == "category"] { "slug": slug.current, _updatedAt }`
  );

  // Fetch all blog posts
  const blogPosts = await client.fetch<BlogPost[]>(
    `*[_type == "blogPost"] { "slug": slug.current, publishedAt }`
  );

  // Fetch all prints
  const prints = await client.fetch<Print[]>(
    `*[_type == "print"] { _id, _updatedAt }`
  );

  // Static pages
  const staticPages = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/prints`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
  ];

  // Category pages
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/${category.slug}`,
    lastModified: new Date(category._updatedAt || new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Blog post pages
  const blogPostPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt || new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...blogPostPages];
}
