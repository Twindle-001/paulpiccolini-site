"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../../sanity.config";

export default function StudioPage() {
  return (
    <>
      {/* Fix: Sanity PaneLayout deadlock - hidden panes block ResizeObserver,
         keeping layout collapsed. This CSS ensures panes remain measurable. */}
      <style>{`
        [data-ui="PaneLayout"] > [hidden] {
          display: block !important;
          visibility: visible !important;
        }
      `}</style>
      <NextStudio config={config} />
    </>
  );
}
