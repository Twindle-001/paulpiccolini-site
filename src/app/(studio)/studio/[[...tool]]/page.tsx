"use client";

import { NextStudio } from "next-sanity/studio";
import { useEffect, useState } from "react";
import config from "../../../../../sanity.config";

/**
 * Fix: Some browser extensions (e.g. MetaMask SES lockdown) break the
 * native ResizeObserver — the constructor exists but the callback never
 * fires. Sanity’s PaneLayout depends on ResizeObserver to measure its
 * container width; without it the layout stays permanently collapsed
 * and the structure panel renders empty.
 *
 * This component detects a broken ResizeObserver on mount and replaces
 * it with a polling-based fallback before rendering NextStudio.
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
  const [ready, setReady] = useState(false);

  useEffect(() => {
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
      if (!fired) {
        (window as unknown as Record<string, unknown>).ResizeObserver =
          JsonResizeObserver;
      }
      setReady(true);
    }, 150);

    return () => {
      clearTimeout(timer);
      ro.disconnect();
      el.remove();
    };
  }, []);

  if (!ready) return <div style={{ height: "100vh", width: "100vw" }} />;
  return <NextStudio config={config} />;
}
