"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Locale = "fr" | "en";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Try to get locale from localStorage or URL
    const saved = localStorage.getItem("locale") as Locale | null;
    const params = new URLSearchParams(window.location.search);
    const param = params.get("lang") as Locale | null;

    const newLocale = param || saved || "fr";
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    // Remove any ?lang= param from URL to keep canonical URLs clean for SEO
    const params = new URLSearchParams(window.location.search);
    if (params.has("lang")) {
      params.delete("lang");
      const newUrl = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  };

  const toggleLanguage = () => {
    setLocale(locale === "fr" ? "en" : "fr");
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
