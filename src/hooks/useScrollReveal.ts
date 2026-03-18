"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hook that detects when an element enters the viewport.
 * Returns a ref to attach to the element and a boolean indicating visibility.
 * Once visible, stays visible (no re-trigger on scroll away).
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15
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
          observer.unobserve(el); // once visible, stop observing
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

/**
 * Hook for individual items within a grid — adds staggered delay.
 * Observes each item independently.
 */
export function useScrollRevealItems(count: number, threshold = 0.2) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    refs.current.forEach((el, index) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Stagger: delay each item slightly
            setTimeout(() => {
              setVisibleItems((prev) => new Set(prev).add(index));
            }, index * 100);
            observer.unobserve(el);
          }
        },
        { threshold, rootMargin: "0px 0px -30px 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [count, threshold]);

  const setRef = (index: number) => (el: HTMLElement | null) => {
    refs.current[index] = el;
  };

  return { setRef, visibleItems };
}
