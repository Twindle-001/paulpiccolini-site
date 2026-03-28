"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import type { SanityPhoto } from "@/sanity/types";
import { useLanguage } from "@/context/LanguageContext";

interface PhotoGridProps {
  photos: SanityPhoto[];
  subcategories?: (string | null)[];
}

/** Returns the SEO alt text (for the HTML alt attribute) */
function getAlt(photo: SanityPhoto): string {
  return photo.alt || photo.title || "Photo";
}

export default function PhotoGrid({ photos, subcategories }: PhotoGridProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const { locale } = useLanguage();

  // Subcategory scroll navigation
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; scrollLeft: number } | null>(null);

  const updateScrollArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    updateScrollArrows();
    window.addEventListener("resize", updateScrollArrows);
    return () => window.removeEventListener("resize", updateScrollArrows);
  }, [updateScrollArrows]);

  const doScroll = useCallback((dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 200, behavior: "smooth" });
    setTimeout(updateScrollArrows, 350);
  }, [updateScrollArrows]);

  // Mouse drag-to-scroll on subcategory bar
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    dragStart.current = { x: e.pageX, scrollLeft: el.scrollLeft };
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStart.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const dx = e.pageX - dragStart.current.x;
    el.scrollLeft = dragStart.current.scrollLeft - dx;
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
    const el = scrollRef.current;
    if (el) {
      el.style.cursor = "grab";
      el.style.userSelect = "";
    }
    updateScrollArrows();
  }, [updateScrollArrows]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) handleMouseUp();
  }, [isDragging, handleMouseUp]);

  // Swipe support for lightbox
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const lightboxPrev = useCallback(() => {
    setLightbox((prev) =>
      prev !== null ? (prev > 0 ? prev - 1 : photos.length - 1) : null
    );
  }, [photos.length]);

  const lightboxNext = useCallback(() => {
    setLightbox((prev) =>
      prev !== null ? (prev < photos.length - 1 ? prev + 1 : 0) : null
    );
  }, [photos.length]);

  const handleLightboxTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleLightboxTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx < 0) lightboxNext();
        else lightboxPrev();
      }
      touchStart.current = null;
    },
    [lightboxNext, lightboxPrev]
  );

  // Filter out null subcategories
  const validSubcategories = subcategories?.filter(
    (s): s is string => s !== null && s !== undefined && s !== ""
  );
  const hasSubcategories = validSubcategories && validSubcategories.length > 0;
  const filtered =
    activeCategory === "all"
      ? photos
      : photos.filter((p) => p.subcategory === activeCategory);

  return (
    <>
      {/* Subcategory tabs with arrow navigation */}
      {hasSubcategories && (
        <div className="relative mb-6 sm:mb-12">
          {/* Left arrow */}
          {canScrollLeft && (
            <button
              onClick={() => doScroll(-1)}
              className="hidden sm:flex absolute left-0 top-0 bottom-0 z-10 items-center justify-center w-10 bg-gradient-to-r from-[#1a1a1a] to-transparent rounded-l-lg cursor-pointer group/arrow"
              aria-label="Scroll left"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/80 group-hover/arrow:text-white transition-colors"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
          )}
          {/* Right arrow */}
          {canScrollRight && (
            <button
              onClick={() => doScroll(1)}
              className="hidden sm:flex absolute right-0 top-0 bottom-0 z-10 items-center justify-center w-10 bg-gradient-to-l from-[#1a1a1a] to-transparent rounded-r-lg cursor-pointer group/arrow"
              aria-label="Scroll right"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/80 group-hover/arrow:text-white transition-colors"><polyline points="9 6 15 12 9 18" /></svg>
            </button>
          )}
          <div
            ref={scrollRef}
            onScroll={updateScrollArrows}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className="flex flex-nowrap overflow-x-auto gap-1 rounded-lg border border-white/10 bg-brand-dark/50 p-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch", cursor: "grab" }}
          >
            <button
              onClick={() => setActiveCategory("all")}
              className={`rounded-md px-3 py-2 sm:px-5 sm:py-2.5 text-[10px] sm:text-xs uppercase tracking-menu transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                activeCategory === "all"
                  ? "bg-brand-accent/20 text-brand-accent"
                  : "text-brand-muted hover:bg-white/5 hover:text-white"
              }`}
            >
              {locale === "en" ? "All" : "Tout"}
            </button>
            {validSubcategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-md px-3 py-2 sm:px-5 sm:py-2.5 text-[10px] sm:text-xs uppercase tracking-menu transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                  activeCategory === cat
                    ? "bg-brand-accent/20 text-brand-accent"
                    : "text-brand-muted hover:bg-white/5 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Grid — 2-col on mobile, masonry on desktop */}
      <div className="grid grid-cols-2 gap-2 sm:block sm:columns-2 sm:gap-4 lg:columns-3">
        {filtered.map((photo, i) => (
          <div
            key={photo._id}
            className="group relative cursor-pointer overflow-hidden sm:mb-4 sm:break-inside-avoid"
            onClick={() => setLightbox(i)}
          >
            {/* Mobile: fixed aspect ratio | Desktop: natural proportions */}
            <div className="relative aspect-[3/4] sm:hidden">
              <Image
                src={urlFor(photo.image).width(800).height(1067).url()}
                alt={getAlt(photo)}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="50vw"
              />
            </div>
            <Image
              src={urlFor(photo.image).width(800).url()}
              alt={getAlt(photo)}
              width={800}
              height={600}
              className="hidden sm:block w-full transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/20" />
            {photo.title && (
              <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-gradient-to-t from-black/60 to-transparent p-4 transition-transform duration-500 group-hover:translate-y-0">
                <p className="text-sm text-white/90">{photo.title}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setLightbox(null)}
          onTouchStart={handleLightboxTouchStart}
          onTouchEnd={handleLightboxTouchEnd}
        >
          <button
            className="absolute right-4 top-4 p-3 text-2xl text-white/60 hover:text-white md:right-6 md:top-6"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            &times;
          </button>
          {/* Prev/Next */}
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 p-4 text-3xl text-white/40 hover:text-white md:left-4"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(
                lightbox > 0 ? lightbox - 1 : filtered.length - 1
              );
            }}
            aria-label="Previous"
          >
            &#8249;
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-4 text-3xl text-white/40 hover:text-white md:right-4"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(
                lightbox < filtered.length - 1 ? lightbox + 1 : 0
              );
            }}
            aria-label="Next"
          >
            &#8250;
          </button>
          <div
            className="relative max-h-[85vh] max-w-[90vw] md:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={urlFor(filtered[lightbox].image).width(1600).url()}
              alt={getAlt(filtered[lightbox])}
              width={1600}
              height={1200}
              className="max-h-[85vh] w-auto object-contain md:max-h-[90vh]"
              sizes="90vw"
            />
            {/* Title in lightbox */}
            {filtered[lightbox].title && (
              <p className="mt-4 text-center text-sm text-white/70">
                {filtered[lightbox].title}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
