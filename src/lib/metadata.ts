import type { Metadata } from "next";
import type { LandingDictionary, Locale } from "@/lib/i18n";
import { getCanonicalPath } from "@/lib/i18n";

export function generateLandingMetadata(locale: Locale, dict: LandingDictionary): Metadata {
  const pageTitle = dict.meta.title.trim();
  const title = pageTitle.toLowerCase() === "cosmoremote"
    ? { absolute: pageTitle }
    : pageTitle;

  return {
    title,
    description: dict.meta.description,
    alternates: {
      canonical: getCanonicalPath(locale),
      languages: {
        en: "/",
        "pt-BR": "/pt-BR",
        es: "/es",
      },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      type: "website",
      locale,
      url: getCanonicalPath(locale),
      siteName: "CosmoRemote",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
  };
}
