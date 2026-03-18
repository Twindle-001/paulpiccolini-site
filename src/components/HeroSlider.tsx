"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/image";
import type { SanityHeroSlide } from "@/sanity/types";
import { useLanguage } from "@/context/LanguageContext";
import { localize } from "@/lib/localize";

interface HeroSliderProps {
  slides: SanityHeroSlide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { locale } = useLanguage();

  // Swipe support
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 1000);
    },
    [isTransitioning]
  );

  const goNext = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo, slides.length]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo, slides.length]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      // Only trigger if horizontal swipe is dominant and long enough
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx < 0) goNext();
        else goPrev();
      }
      touchStart.current = null;
    },
    [goNext, goPrev]
  );

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [current, goTo, slides.length]);

  if (slides.length === 0) {
    // Fallback hero when no slides exist yet
    return (
      <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-brand-darker">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-darker via-brand-dark to-brand-darker" />
        <div className="relative z-10 text-center">
          <h1 className="font-heading text-6xl font-light tracking-wider text-white md:text-7xl lg:text-8xl">
            Paul Piccolini
          </h1>
          <p className="mt-4 text-sm uppercase tracking-[0.3em] text-white/60">
            Photography
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide._id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {slide.image ? (
            <Image
              src={urlFor(slide.image).width(1920).height(1080).url()}
              alt={String(localize(slide.title, locale) || "Slide")}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-brand-dark" />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Content overlay */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="text-center">
          <p
            className="mb-4 text-sm uppercase tracking-[0.3em] text-white/60 transition-all duration-700"
            key={`sub-${current}`}
          >
            {String(localize(slides[current]?.subtitle, locale) || "")}
          </p>
          <h1
            className="font-heading text-6xl font-light tracking-wider text-white md:text-7xl lg:text-8xl"
            key={`title-${current}`}
          >
            {String(localize(slides[current]?.title, locale) || "")}
          </h1>
          {slides[current]?.link && (
            <Link
              href={slides[current].link!}
              className="btn-primary-hero mt-10 inline-block"
            >
              {locale === "en" ? "Discover" : "Découvrir"}
            </Link>
          )}
        </div>
      </div>

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 p-2 text-white/40 transition-colors hover:text-white md:left-8"
            aria-label="Previous slide"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 p-2 text-white/40 transition-colors hover:text-white md:right-8"
            aria-label="Next slide"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* Slide indicators */}
      <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="flex items-center justify-center py-3"
            aria-label={`Go to slide ${i + 1}`}
          >
            <span
              className={`block h-[2px] transition-all duration-500 ${
                i === current ? "w-10 bg-white" : "w-5 bg-white/30"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 right-8 z-10 hidden md:block">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-white/40 [writing-mode:vertical-lr]">
            Scroll
          </span>
          <div className="h-12 w-[1px] bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
