"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { localize } from "@/lib/localize";
import { client } from "@/sanity/client";
import { servicesQuery } from "@/sanity/queries";
import type { SanityService } from "@/sanity/types";

type FormStatus = "idle" | "sending" | "sent" | "error";

export default function BookingPage() {
  const { locale } = useLanguage();
  const [services, setServices] = useState<SanityService[]>([]);
  const [selectedPack, setSelectedPack] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [showCouple, setShowCouple] = useState(false);

  useEffect(() => {
    client.fetch<SanityService[]>(servicesQuery).then((data) => {
      setServices(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
      setIsLoading(false);

      const params = new URLSearchParams(window.location.search);
      const packParam = params.get("pack");
      if (packParam) {
        const match = data.find(
          (s) =>
            localize(s.name, locale)?.toLowerCase() ===
            packParam.toLowerCase()
        );
        if (match) setSelectedPack(match._id);
      }
    });
  }, [locale]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    const svc = services.find((s) => s._id === fd.get("formula"));
    const svcName = svc ? localize(svc.name, locale) || "" : "";

    try {
      const res = await fetch(
        "https://formsubmit.co/ajax/paul.piccolini@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _subject: `Demande de r\u00e9servation \u2013 ${svcName}`,
            Formule: `${svcName} (${svc?.currency || ""} ${svc?.price || ""})`,
            "Date souhait\u00e9e": fd.get("date"),
            "Nombre de personnes": fd.get("people"),
            "Pr\u00e9nom": fd.get("firstName"),
            Nom: fd.get("lastName"),
            Email: fd.get("email"),
            "T\u00e9l\u00e9phone": fd.get("phone") || "Non fourni",
            Message: fd.get("message") || "Aucun",
          }),
        }
      );
      const data = await res.json();
      setStatus(data.success ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  const t = {
    title: locale === "en" ? "Booking" : "R\u00e9servation",
    subtitle:
      locale === "en"
        ? "Fill out the form below to request a photo session. I\u2019ll get back to you within 24 hours."
        : "Remplissez le formulaire ci-dessous pour demander une s\u00e9ance photo. Je vous r\u00e9pondrai sous 24 heures.",
    formule: locale === "en" ? "Package" : "Formule",
    selectFormule:
      locale === "en" ? "Select a package" : "S\u00e9lectionner une formule",
    date: locale === "en" ? "Preferred date" : "Date souhait\u00e9e",
    selectOpt: locale === "en" ? "Select" : "S\u00e9lectionner",
    people:
      locale === "en" ? "Number of people" : "Nombre de personnes",
    coupleNote:
      locale === "en"
        ? "Couple session: +50\u20ac supplement"
        : "S\u00e9ance en couple : +50\u20ac de suppl\u00e9ment",
    firstName: locale === "en" ? "First name" : "Pr\u00e9nom",
    lastName: locale === "en" ? "Last name" : "Nom",
    email: "Email",
    phone:
      locale === "en"
        ? "Phone (optional)"
        : "T\u00e9l\u00e9phone (optionnel)",
    message:
      locale === "en"
        ? "Message / Additional details"
        : "Message / D\u00e9tails suppl\u00e9mentaires",
    submit:
      locale === "en" ? "Send my request" : "Envoyer ma demande",
    sending: locale === "en" ? "Sending..." : "Envoi en cours...",
    sent:
      locale === "en"
        ? "Your request has been sent! I\u2019ll get back to you within 24 hours."
        : "Votre demande a bien \u00e9t\u00e9 envoy\u00e9e ! Je vous r\u00e9pondrai sous 24 heures.",
    error:
      locale === "en"
        ? "An error occurred. Please try again or email me at paul.piccolini@gmail.com"
        : "Une erreur est survenue. R\u00e9essayez ou envoyez-moi un email \u00e0 paul.piccolini@gmail.com",
  };

  const peopleOpts = [
    { v: "1", l: locale === "en" ? "1 person" : "1 personne" },
    {
      v: "2-couple",
      l: locale === "en" ? "2 people (couple) +50\u20ac" : "2 personnes (couple) +50\u20ac",
    }
  ];

  const inputCls =
    "w-full border-b border-white/10 bg-transparent px-0 py-3 text-sm text-white outline-none transition-colors focus:border-brand-accent";
  const selectCls = inputCls + " appearance-none cursor-pointer";
  const labelCls =
    "mb-2 block text-xs uppercase tracking-menu text-brand-muted";

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-dark">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
      </div>
    );
  }

  if (status === "sent") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-dark px-6">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-brand-accent/30 bg-brand-accent/10">
            <svg
              className="h-8 w-8 text-brand-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mb-3 font-heading text-2xl text-white">
            {locale === "en" ? "Request sent!" : "Demande envoy\u00e9e !"}
          </h2>
          <p className="text-sm text-brand-light/60">{t.sent}</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        textarea:-webkit-autofill,
        select:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px #0a0a0a inset !important;
          -webkit-text-fill-color: #e5e5e5 !important;
          caret-color: #e5e5e5 !important;
        }
      `}</style>
      <main className="min-h-screen bg-brand-dark px-6 pb-20 pt-32">
        <div className="mx-auto max-w-2xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 font-heading text-4xl text-white">
              {t.title}
            </h1>
            <p className="text-sm text-brand-light/60">{t.subtitle}</p>
          </div>

          {status === "error" && (
            <div className="mb-8 rounded border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-400">
              {t.error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="formula" className={labelCls}>
                {t.formule}
              </label>
              <select
                id="formula"
                name="formula"
                required
                defaultValue={selectedPack}
                className={selectCls}
              >
                <option value="" disabled className="bg-brand-dark">
                  {t.selectFormule}
                </option>
                {services.map((s) => (
                  <option key={s._id} value={s._id} className="bg-brand-dark">
                    {localize(s.name, locale)} &ndash; {s.currency} {s.price}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <label htmlFor="date" className={labelCls}>
                  {t.date}
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="people" className={labelCls}>
                  {t.people}
                </label>
                <select
                  id="people"
                  name="people"
                  required
                  defaultValue=""
                  onChange={(e) => setShowCouple(e.target.value === "2-couple")}
                  className={selectCls}
                >
                  <option value="" disabled className="bg-brand-dark">
                    {t.selectOpt}
                  </option>
                  {peopleOpts.map((p) => (
                    <option key={p.v} value={p.v} className="bg-brand-dark">
                      {p.l}
                    </option>
                  ))}
                </select>
                {showCouple && <p className="mt-2 text-xs text-brand-accent/70">{t.coupleNote}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className={labelCls}>
                  {t.firstName}
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="lastName" className={labelCls}>
                  {t.lastName}
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className={labelCls}>
                {t.email}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="phone" className={labelCls}>
                {t.phone}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="message" className={labelCls}>
                {t.message}
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="w-full resize-none border-b border-white/10 bg-transparent px-0 py-3 text-sm text-white outline-none transition-colors focus:border-brand-accent"
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-accent w-full py-4 text-center disabled:opacity-50"
            >
              {status === "sending" ? t.sending : t.submit}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
