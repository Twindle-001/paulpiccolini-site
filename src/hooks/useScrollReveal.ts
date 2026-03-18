"use client";

import { useEffect, useRef, useState, useCallback } from "react";

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
          observer.unobserve(el);
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
 * Uses callback refs so observers attach as soon as elements mount.
 */
export function useScrollRevealItems(count: number, threshold = 0.15) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const observersRef = useRef<Map<number, IntersectionObserver>>(new Map());

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      observersRef.current.forEach((obs) => obs.disconnect());
      observersRef.current.clear();
    };
  }, []);

  const setRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      // Clean up old observer for this index
      const existing = observersRef.current.get(index);
      if (existing) {
        existing.disconnect();
        observersRef.current.delete(index);
      }

      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Stagger: delay each item slightly
            setTimeout(() => {
              setVisibleItems((prev) => {
                const next = new Set(prev);
                next.add(index);
                return next;
              });
            }, index * 120);
            observer.unobserve(el);
            observersRef.current.delete(index);
          }
        },
        { threshold, rootMargin: "0px 0px -20px 0px" }
      );

      observer.observe(el);
      observersRef.current.set(index, observer);
    },
    [threshold]
  );

  return { setRef, visibleItems };
}
