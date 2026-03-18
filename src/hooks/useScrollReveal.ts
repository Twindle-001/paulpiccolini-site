"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Observes a single container element.
 * When it enters the viewport, sets isVisible = true (one-shot).
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.1
) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
