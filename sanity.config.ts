"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@/sanity/schemas";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { bulkUploadPlugin } from "@/sanity/bulkUploadTool";
import { shuffleOrderPlugin } from "@/sanity/shuffleOrderTool";

// Custom desk structure — 4 groups: Site, Portfolio, Boutique, Contenu
const deskStructure = (S: any) =>
  S.list()
    .title("Backoffice")
    .items([
      // ─── SITE ──────────────────────────────────────────
      S.listItem()
        .title("Site")
        .icon(() => "🌐")
        .child(
          S.list()
            .title("Site")
            .items([
              S.listItem()
                .title("Configuration Générale")
                .icon(() => "⚙️")
                .child(
                  S.document()
                    .schemaType("siteSettings")
                    .documentId("siteSettings")
                    .title("Configuration Générale")
                ),
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
                .title("Slides Hero (Accueil)")
                .icon(() => "🖼️")
                .child(
                  S.documentTypeList("heroSlide").title("Slides Hero")
                ),
            ])
        ),

      S.divider(),

      // ─── PORTFOLIO ─────────────────────────────────────
      S.listItem()
        .title("Portfolio")
        .icon(() => "📷")
        .child(
          S.list()
            .title("Portfolio")
            .items([
              S.listItem()
                .title("Catégories")
                .icon(() => "📁")
                .child(
                  S.documentTypeList("category").title(
                    "Catégories — Bannière & description"
                  )
                ),
              S.listItem()
                .title("Photos")
                .icon(() => "📷")
                .child(
                  S.documentTypeList("category")
                    .title("Photos par catégorie")
                    .child((categoryId: string) =>
                      S.documentList()
                        .title("Photos")
                        .filter(
                          '_type == "photo" && category._ref == $categoryId'
                        )
                        .params({ categoryId })
                    )
                ),
            ])
        ),

      S.divider(),

      // ─── BOUTIQUE ──────────────────────────────────────
      S.listItem()
        .title("Boutique")
        .icon(() => "💰")
        .child(
          S.list()
            .title("Boutique")
            .items([
              S.listItem()
                .title("Forfaits / Tarifs")
                .icon(() => "💰")
                .child(S.documentTypeList("service").title("Forfaits")),
              S.listItem()
                .title("Tirages d'Art (produits)")
                .icon(() => "🎨")
                .child(S.documentTypeList("print").title("Tirages")),
            ])
        ),

      S.divider(),

      // ─── CONTENU ───────────────────────────────────────
      S.listItem()
        .title("Contenu")
        .icon(() => "📝")
        .child(
          S.list()
            .title("Contenu")
            .items([
              S.listItem()
                .title("Page Services")
                .icon(() => "📸")
                .child(
                  S.document()
                    .schemaType("servicesPage")
                    .documentId("servicesPage")
                    .title("Page Services — Bannière, titres & textes")
                ),
              S.listItem()
                .title("Page Tirages d'Art")
                .icon(() => "🖨️")
                .child(
                  S.document()
                    .schemaType("printsPage")
                    .documentId("printsPage")
                    .title("Page Tirages — Bannière, titres & textes")
                ),
              S.listItem()
                .title("Page Contact")
                .icon(() => "✉️")
                .child(
                  S.document()
                    .schemaType("contactPage")
                    .documentId("contactPage")
                    .title("Page Contact — Bannière, titres & textes")
                ),
              S.listItem()
                .title("Blog")
                .icon(() => "📝")
                .child(
                  S.documentTypeList("blogPost").title("Articles")
                ),
            ])
        ),
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
    shuffleOrderPlugin(),
  ],
});
