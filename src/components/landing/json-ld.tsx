import type { LandingDictionary, Locale } from "@/lib/i18n";
import { getLandingPricing } from "@/lib/landing-data";

interface Props {
  dict: LandingDictionary;
  locale: string;
}

export function JsonLd({ dict, locale }: Props) {
  const pricing = dict.pricing;
  // Prices and currency come from the resolved landing pricing (base BRL, with
  // per-locale display currency), never from the message fallbacks: the
  // fallback numbers are BRL amounts and were previously published as USD.
  const resolved = getLandingPricing(locale as Locale, {
    monthlyValue: pricing.monthlyValue,
    yearlyValue: pricing.yearlyValue,
    freePrice: pricing.freePrice,
  });

  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CosmoRemote",
    applicationCategory: "DeveloperApplication",
    operatingSystem: ["iOS", "Android"],
    description: dict.meta.description,
    offers: [
      {
        "@type": "Offer",
        name: pricing.monthlyLabel,
        price: resolved.monthly,
        priceCurrency: resolved.currency,
        description: pricing.monthlyDescription,
      },
      {
        "@type": "Offer",
        name: pricing.yearlyLabel,
        price: resolved.yearly,
        priceCurrency: resolved.currency,
        description: pricing.yearlyDescription,
      },
      {
        "@type": "Offer",
        name: pricing.freeLabel,
        price: "0",
        priceCurrency: resolved.currency,
        description: "Free tier with unlimited messaging, session streaming, and local Tests runs",
      },
    ],
  };

  // FAQ questions exist in the structure but are all empty — skip FAQPage JSON-LD
  // to avoid fabricating structured data

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(softwareApp),
      }}
    />
  );
}
