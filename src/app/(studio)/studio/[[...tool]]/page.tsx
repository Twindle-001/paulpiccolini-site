"use client";

import React, { useEffect, useState } from "react";

/**
 * Fix: Some browser extensions (e.g. MetaMask SES lockdown) break the
 * native ResizeObserver — the constructor exists but the callback never
 * fires. Sanity's PaneLayout depends on ResizeObserver to measure its
 * container width; without it the layout stays permanently collapsed
 * and the structure panel renders empty.
 *
 * We MUST replace ResizeObserver BEFORE importing NextStudio or any
 * Sanity modules, because @sanity/ui captures the ResizeObserver
 * constructor reference at module load time. That's why we use a
 * dynamic import() for NextStudio — it only loads after our polyfill
 * is installed.
 */

class JsonResizeObserver {
  _cb: ResizeObserverCallback;
  _els: Map<Element, { w: number; h: number }>;
  _timer: ReturnType<typeof setInterval> | null;

  constructor(cb: ResizeObserverCallback) {
    this._cb = cb;
    this._els = new Map();
    this._timer = null;
  }
  observe(el: Element) {
    this._els.set(el, { w: 0, h: 0 });
    if (!this._timer) this._timer = setInterval(() => this._check(), 200);
    requestAnimationFrame(() => this._check());
  }
  unobserve(el: Element) {
    this._els.delete(el);
    if (!this._els.size && this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }
  disconnect() {
    this._els.clear();
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }
  _check() {
    const entries: ResizeObserverEntry[] = [];
    for (const [el, prev] of this._els) {
      const r = el.getBoundingClientRect();
      if (r.width !== prev.w || r.height !== prev.h) {
        prev.w = r.width;
        prev.h = r.height;
        entries.push({
          target: el,
          contentRect: DOMRectReadOnly.fromRect({
            width: r.width,
            height: r.height,
          }),
          borderBoxSize: [
            { inlineSize: r.width, blockSize: r.height },
          ] as unknown as readonly ResizeObserverSize[],
          contentBoxSize: [
            { inlineSize: r.width, blockSize: r.height },
          ] as unknown as readonly ResizeObserverSize[],
          devicePixelContentBoxSize: [
            { inlineSize: r.width, blockSize: r.height },
          ] as unknown as readonly ResizeObserverSize[],
        });
      }
    }
    if (entries.length) this._cb(entries, this as unknown as ResizeObserver);
  }
}

export default function StudioPage() {
  const [StudioComponent, setStudioComponent] =
    useState<React.ComponentType | null>(null);

  useEffect(() => {
    // Step 1: Detect if ResizeObserver is broken
    let fired = false;
    const el = document.createElement("div");
    el.style.cssText =
      "width:1px;height:1px;position:fixed;opacity:0;pointer-events:none";
    document.body.appendChild(el);
    const ro = new ResizeObserver(() => {
      fired = true;
    });
    ro.observe(el);

    const timer = setTimeout(() => {
      ro.disconnect();
      el.remove();

      // Step 2: Replace ResizeObserver if broken
      if (!fired) {
        (window as unknown as Record<string, unknown>).ResizeObserver =
          JsonResizeObserver;
      }

      // Step 3: NOW dynamically import NextStudio and config
      // so @sanity/ui captures our working ResizeObserver
      Promise.all([
        import("next-sanity/studio"),
        import("../../../../../sanity.config"),
      ]).then(([{ NextStudio }, configModule]) => {
        const config = configModule.default;
        // Create a wrapper component that renders NextStudio with config
        setStudioComponent(() => () =>
          React.createElement(NextStudio, { config })
        );
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      ro.disconnect();
      el.remove();
    };
  }, []);

  if (!StudioComponent) {
    return <div style={{ height: "100vh", width: "100vw" }} />;
  }

  return <StudioComponent />;
}
