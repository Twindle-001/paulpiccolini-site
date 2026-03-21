"use client";


import Image from "next/image";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { client } from "@/sanity/client";
import { urlFor, getHotspot } from "@/sanity/image";
import { contactPageQuery } from "@/sanity/queries";
import type { SanityContactPage } from "@/sanity/types";
import { localize } from "@/lib/localize";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [contactData, setContactData] = useState<SanityContactPage | null>(
    null
  );
  const { locale } = useLanguage();
  const [packName, setPackName] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPackName(params.get("pack"));
  }, []);

  useEffect(() => {
    client.fetch<SanityContactPage>(contactPageQuery).then(setContactData);
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") || "";
    const lastName = formData.get("lastName") || "";
    const email = formData.get("email") || "";
    const phone = formData.get("phone") || "";
    const message = formData.get("message") || "";
    const subject = formData.get("_subject") || "Nouveau message depuis paulpiccolini.com";

    try {
      const res = await fetch("https://formsubmit.co/ajax/paul.piccolini@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: subject,
          "Prénom": firstName,
          "Nom": lastName,
          "Email": email,
          "Téléphone": phone,
          "Message": message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  // Editable texts with fallbacks
  const heroSub =
    String(localize(contactData?.heroSubtitle, locale) || "") ||
    (locale === "en" ? "Get in touch" : "Prendre contact");
  const heroTitle =
    String(localize(contactData?.heroTitle, locale) || "") ||
    "Contact";
  const intro =
    String(localize(contactData?.intro, locale) || "") ||
    (locale === "en"
      ? "Feel free to contact me for a photoshoot in Paris, a custom project, or any question about my work. I'll get back to you within 24 hours."
      : "N'hésitez pas à me contacter pour un shooting photo à Paris, un projet sur mesure, ou toute question sur mon travail. Je vous répondrai sous 24 heures.");
  const sentTitle =
    String(localize(contactData?.sentTitle, locale) || "") ||
    (locale === "en" ? "Message sent!" : "Message envoyé !");
  const sentText =
    String(localize(contactData?.sentText, locale) || "") ||
    (locale === "en"
      ? "Thank you for reaching out. I'll reply as soon as possible."
      : "Merci pour votre message. Je vous répondrai dès que possible.");
  const errorText =
    String(localize(contactData?.errorText, locale) || "") ||
    (locale === "en"
      ? "An error occurred. Please try again or email me directly at paul.piccolini@gmail.com"
      : "Une erreur est survenue. Réessayez ou envoyez-moi un email à paul.piccolini@gmail.com");
  const submitBtn =
    String(localize(contactData?.submitButtonText, locale) || "") ||
    (locale === "en" ? "Send message" : "Envoyer le message");

  const t = {
    firstName: locale === "en" ? "First name" : "Prénom",
    lastName: locale === "en" ? "Last name" : "Nom",
    email: "Email",
    phone: locale === "en" ? "Phone (optional)" : "Téléphone (optionnel)",
    message: "Message",
    sending: locale === "en" ? "Sending..." : "Envoi...",
    tryAgain: locale === "en" ? "Try again" : "Réessayer",
  };

  return (
    <>
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        textarea:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px #0a0a0a inset !important;
          -webkit-text-fill-color: #e5e5e5 !important;
          caret-color: #e5e5e5 !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
      
      {/* Hero */}
      <section className="bg-brand-dark pt-32 pb-10 sm:pt-36 sm:pb-14 text-center px-6">
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl tracking-wider text-white">
          {heroTitle}
        </h1>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-2xl px-6 py-24">
        <p className="mb-12 text-center text-sm leading-relaxed text-brand-light/60">
          {intro}
        </p>

        {status === "sent" ? (
          <div className="rounded border border-brand-accent/30 bg-brand-accent/10 p-8 text-center">
            <p className="font-heading text-2xl text-white">{sentTitle}</p>
            <p className="mt-2 text-sm text-brand-light/60">{sentText}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hidden field for Formspree to know the reply-to email */}
            <input type="hidden" name="_subject" value={packName ? `${locale === "en" ? "Booking request" : "Demande de r\u00e9servation"} – ${packName}` : "Nouveau message depuis paulpiccolini.com"} />

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-xs uppercase tracking-menu text-brand-muted"
                >
                  {t.firstName}
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  className="w-full border-b border-white/10 bg-transparent px-0 py-3
                             text-sm text-white outline-none transition-colors
                             focus:border-brand-accent"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-xs uppercase tracking-menu text-brand-muted"
                >
                  {t.lastName}
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  className="w-full border-b border-white/10 bg-transparent px-0 py-3
                             text-sm text-white outline-none transition-colors
                             focus:border-brand-accent"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs uppercase tracking-menu text-brand-muted"
              >
                {t.email}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full border-b border-white/10 bg-transparent px-0 py-3
                           text-sm text-white outline-none transition-colors
                           focus:border-brand-accent"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-xs uppercase tracking-menu text-brand-muted"
              >
                {t.phone}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full border-b border-white/10 bg-transparent px-0 py-3
                           text-sm text-white outline-none transition-colors
                           focus:border-brand-accent"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-xs uppercase tracking-menu text-brand-muted"
              >
                {t.message}
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full resize-none border-b border-white/10 bg-transparent
                           px-0 py-3 text-sm text-white outline-none transition-colors
                           focus:border-brand-accent"
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-red-400 text-center">{errorText}</p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-accent w-full justify-center disabled:opacity-50"
            >
              {status === "sending" ? t.sending : status === "error" ? t.tryAgain : submitBtn}
            </button>
          </form>
        )}
      </section>
    </>
  );
}
