"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@/sanity/schemas";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { bulkUploadPlugin } from "@/sanity/bulkUploadTool";

// Custom desk structure for a cleaner backoffice
const deskStructure = (S: any) =>
  S.list()
    .title("Backoffice")
    .items([
      // Configuration
      S.listItem()
        .title("Configuration Générale")
        .icon(() => "⚙️")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Configuration Générale")
        ),
      S.divider(),
      // Pages
      S.listItem()
        .title("Page d'Accueil")
        .icon(() => "🏠")
        .child(
          S.document()
            .schemaType("homePage")
            .documentId("homePage")
            .title("Page d'Accueil")
        ),
      S.listItem()
        .title("Page Services")
        .icon(() => "📸")
        .child(
          S.document()
            .schemaType("servicesPage")
            .documentId("servicesPage")
            .title("Page Services")
        ),
      S.listItem()
        .title("Page Contact")
        .icon(() => "✉️")
        .child(
          S.document()
            .schemaType("contactPage")
            .documentId("contactPage")
            .title("Page Contact")
        ),
      S.divider(),
      // Gallery Management
      S.listItem()
        .title("Slides Hero (Accueil)")
        .icon(() => "🖼️")
        .child(S.documentTypeList("heroSlide").title("Slides Hero")),
      S.listItem()
        .title("Catégories")
        .icon(() => "📁")
        .child(S.documentTypeList("category").title("Catégories")),
      S.listItem()
        .title("Photos")
        .icon(() => "📷")
        .child(
          S.documentTypeList("category")
            .title("Photos par catégorie")
            .child((categoryId: string) =>
              S.documentList()
                .title("Photos")
                .filter('_type == "photo" && category._ref == $categoryId')
                .params({ categoryId })
            )
        ),
      S.divider(),
      // Services & Products
      S.listItem()
        .title("Forfaits / Tarifs")
        .icon(() => "💰")
        .child(S.documentTypeList("service").title("Forfaits")),
      S.divider(),
      // Content
      S.listItem()
        .title("Blog")
        .icon(() => "📝")
        .child(S.documentTypeList("blogPost").title("Articles")),
      S.listItem()
        .title("Tirages d'Art")
        .icon(() => "🖨️")
        .child(S.documentTypeList("print").title("Tirages")),
    ]);

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    visionTool({ defaultApiVersion: apiVersion }),
    bulkUploadPlugin(),
  ],
});
