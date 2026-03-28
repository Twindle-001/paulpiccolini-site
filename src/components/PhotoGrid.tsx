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

  // Lightbox scroll-snap: track current slide via native scroll
  const lbScrollRef = useRef<HTMLDivElement>(null);

  // Scroll to the correct slide when lightbox opens
  useEffect(() => {
    if (lightbox === null || !lbScrollRef.current) return;
    const el = lbScrollRef.current;
    // Instant scroll to the selected photo (no animation on open)
    el.scrollTo({ left: lightbox * el.clientWidth, behavior: "instant" as ScrollBehavior });
  }, [lightbox === null]); // only on open/close

  // Update lightbox index when user scrolls/swipes
  const handleLbScroll = useCallback(() => {
    const el = lbScrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== lightbox && idx >= 0 && idx < filtered.length) {
      setLightbox(idx);
    }
  }, [lightbox, filtered.length]);

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
                src={urlFor(photo.image).width(800).height(1067).quality(75).auto("format").url()}
                alt={getAlt(photo)}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="50vw"
              />
            </div>
            <Image
              src={urlFor(photo.image).width(800).quality(75).auto("format").url()}
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
      {/* Lightbox — full-screen scroll-snap slider */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Close button */}
          <button
            className="absolute right-4 top-4 p-3 text-2xl text-white/60 hover:text-white z-20 md:right-6 md:top-6"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            &times;
          </button>

          {/* Desktop arrows */}
          <button
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 p-4 text-3xl text-white/40 hover:text-white z-20"
            onClick={() => {
              if (lightbox > 0 && lbScrollRef.current) {
                lbScrollRef.current.scrollTo({ left: (lightbox - 1) * lbScrollRef.current.clientWidth, behavior: "smooth" });
              }
            }}
            aria-label="Previous"
          >
            &#8249;
          </button>
          <button
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-4 text-3xl text-white/40 hover:text-white z-20"
            onClick={() => {
              if (lightbox < filtered.length - 1 && lbScrollRef.current) {
                lbScrollRef.current.scrollTo({ left: (lightbox + 1) * lbScrollRef.current.clientWidth, behavior: "smooth" });
              }
            }}
            aria-label="Next"
          >
            &#8250;
          </button>

          {/* Slide counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 text-xs text-white/40">
            {lightbox + 1} / {filtered.length}
          </div>

          {/* Scroll-snap container — native swipe */}
          <div
            ref={lbScrollRef}
            onScroll={handleLbScroll}
            className="lightbox-scroll flex h-full overflow-x-auto overflow-y-hidden"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {filtered.map((photo, i) => (
              <div
                key={photo._id}
                className="flex h-full w-screen flex-shrink-0 items-center justify-center"
                style={{ scrollSnapAlign: "center" }}
              >
                <Image
                  src={urlFor(photo.image).width(800).quality(75).auto("format").url()}
                  alt={getAlt(photo)}
                  width={800}
                  height={600}
                  className="max-h-[92vh] w-auto max-w-[100vw] object-contain"
                  sizes="100vw"
                  priority={Math.abs(i - lightbox) <= 1}
                />
              </div>
            ))}
          </div>

          {/* Title overlay */}
          {filtered[lightbox].title && (
            <div className="absolute bottom-6 left-0 right-0 z-20 text-center pointer-events-none">
              <p className="text-sm text-white/70">{filtered[lightbox].title}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
