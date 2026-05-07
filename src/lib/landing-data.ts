import { landingData } from "@/generated/landing-data";
import type { Locale } from "@/lib/i18n";

type PricingContentFallback = {
  monthlyValue: number;
  yearlyValue: number;
  freePrice: string;
};

type ScreenshotDevice = "iphone" | "ipad" | "macos" | "android-phone" | "android-tablet";

type ScreenshotEntry = {
  src: string;
  alt: string;
};

type ScreenshotMap = Record<ScreenshotDevice, ScreenshotEntry[]>;
type ReadonlyScreenshotMap = Record<ScreenshotDevice, readonly ScreenshotEntry[]>;

function regionForLocale(locale: Locale) {
  if (locale === "pt-BR") return "pt-BR";
  if (locale === "es") return "es-ES";
  return "en-US";
}

const EMPTY_SCREENSHOTS: ScreenshotMap = {
  iphone: [],
  ipad: [],
  macos: [],
  "android-phone": [],
  "android-tablet": [],
};

export function formatLandingCurrency(value: number, currency: string, locale: Locale) {
  return new Intl.NumberFormat(regionForLocale(locale), {
    style: "currency",
    currency,
  }).format(value);
}

export function getLandingPricing(_locale: Locale, fallback: PricingContentFallback) {
  const root = landingData.pricing;

  return {
    source: root?.source ?? "project",
    currency: root?.currency ?? "USD",
    monthly: root?.monthly ?? fallback.monthlyValue,
    yearly: root?.yearly ?? fallback.yearlyValue,
    lifetime: root?.lifetime ?? null,
    freePrice: fallback.freePrice,
  };
}

export function getLocaleScreenshots(locale: Locale): ReadonlyScreenshotMap {
  return landingData.screenshots[locale] ?? landingData.screenshots.en ?? EMPTY_SCREENSHOTS;
}

export function getLandingSavingsPercent(monthly: number | null, yearly: number | null) {
  if (monthly === null || yearly === null || monthly <= 0) return null;
  const fullMonthly = monthly * 12;
  if (fullMonthly <= yearly) return 0;
  return Math.round(((fullMonthly - yearly) / fullMonthly) * 100);
}

export function formatPricingCopy(template: string, locale: Locale, fallback: PricingContentFallback) {
  const pricing = getLandingPricing(locale, fallback);
  const savings = getLandingSavingsPercent(pricing.monthly, pricing.yearly);
  const replacements: Record<string, string> = {
    "{{monthly_price}}":
      pricing.monthly !== null ? formatLandingCurrency(pricing.monthly, pricing.currency, locale) : "",
    "{{yearly_price}}":
      pricing.yearly !== null ? formatLandingCurrency(pricing.yearly, pricing.currency, locale) : "",
    "{{lifetime_price}}":
      pricing.lifetime !== null ? formatLandingCurrency(pricing.lifetime, pricing.currency, locale) : "",
    "{{yearly_savings}}": savings !== null ? `${savings}%` : "",
  };

  return Object.entries(replacements).reduce(
    (text, [token, value]) => text.replaceAll(token, value),
    template,
  );
}
