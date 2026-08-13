import type { Metadata } from "next";
import type { LandingDictionary, Locale } from "@/lib/i18n";
import { getCanonicalPath } from "@/lib/i18n";

export function generateLandingMetadata(locale: Locale, dict: LandingDictionary): Metadata {
  const pageTitle = dict.meta.title.trim();
  const titleTemplate = `${pageTitle} | CosmoRemote`;

  return {
    title: { absolute: titleTemplate },
    description: dict.meta.description,
    alternates: {
      canonical: getCanonicalPath(locale),
      languages: {
        "x-default": "/",
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
