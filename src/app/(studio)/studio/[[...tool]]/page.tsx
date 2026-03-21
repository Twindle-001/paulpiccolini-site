"use client";

import { NextStudio } from "next-sanity/studio";
import { useEffect } from "react";
import config from "../../../../../sanity.config";

/**
 * Fix: Sanity PaneLayout collapsed deadlock.
 *
 * On initial render the PaneLayout container has width 0 before
 * ResizeObserver fires, so every pane is flagged collapsed.
 * Collapsed panes render children as `false`, which means the
 * child Pane components never call `mount()` on the layout
 * manager — keeping `panes: []` forever.
 *
 * This hook watches for that stuck state and forces a layout
 * recalculation by briefly toggling the container width, which
 * makes the ResizeObserver fire with the real dimensions and
 * breaks the deadlock.
 */
function usePaneLayoutFix() {
  useEffect(() => {
    const interval = setInterval(() => {
      const paneLayout = document.querySelector<HTMLElement>(
        '[data-ui="PaneLayout"]'
      );
      if (!paneLayout) return;

      const listPane = paneLayout.querySelector('[data-ui="ListPane"]');
      if (!listPane) return;

      // If the ListPane exists but has no children, the deadlock is active
      if (listPane.innerHTML.length > 0) {
        clearInterval(interval);
        return;
      }

      // Remove hidden attribute so ResizeObserver can measure properly
      paneLayout.querySelectorAll("[hidden]").forEach((el) => {
        el.removeAttribute("hidden");
      });

      // Force a size change to trigger ResizeObserver callback
      const origWidth = paneLayout.style.width;
      paneLayout.style.width = paneLayout.offsetWidth - 1 + "px";
      requestAnimationFrame(() => {
        paneLayout.style.width = origWidth;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);
}

export default function StudioPage() {
  usePaneLayoutFix();

  return <NextStudio config={config} />;
}
