"use client";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@/sanity/schemas";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { bulkUploadPlugin } from "@/sanity/bulkUploadTool";
import { shuffleOrderPlugin } from "@/sanity/shuffleOrderTool";

// TEST: using default structure to diagnose if custom deskStructure is the issue
export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes
  },
  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: apiVersion }),
    bulkUploadPlugin(),
    shuffleOrderPlugin(),
  ],
});
