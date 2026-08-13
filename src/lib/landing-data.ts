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
type LandingCurrency = "BRL" | "EUR" | "USD";

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

const DISPLAY_CURRENCY_BY_LOCALE: Record<Locale, LandingCurrency> = {
  en: "USD",
  "pt-BR": "BRL",
  es: "EUR",
};

const FALLBACK_BRL_RATES: Record<LandingCurrency, number> = {
  BRL: 1,
  USD: 0.2035,
  EUR: 0.17303,
};

const FALLBACK_LOCALIZED_PRICES: Partial<Record<LandingCurrency, { monthly?: number; yearly?: number; lifetime?: number | null }>> = {
  USD: { monthly: 2.99, yearly: 29.99 },
  EUR: { monthly: 2.99, yearly: 34.99 },
};

export function formatLandingCurrency(value: number, currency: string, locale: Locale) {
  return new Intl.NumberFormat(regionForLocale(locale), {
    style: "currency",
    currency,
  }).format(value);
}

function convertPrice(value: number | null, rate: number) {
  if (value === null) return null;
  return Number((value * rate).toFixed(2));
}

export function getLandingPricing(locale: Locale, fallback: PricingContentFallback) {
  const root = landingData.pricing;
  const baseCurrency = (root?.currency ?? "BRL") as LandingCurrency;
  const displayCurrency = DISPLAY_CURRENCY_BY_LOCALE[locale] ?? baseCurrency;
  const localizedPrices = {
    ...FALLBACK_LOCALIZED_PRICES,
    ...(root?.localizedPrices ?? {}),
  } as Partial<Record<LandingCurrency, { monthly?: number; yearly?: number; lifetime?: number | null }>>;
  const explicitPrices = localizedPrices[displayCurrency];
  const rates = { ...FALLBACK_BRL_RATES, ...(root?.rates ?? {}) } as Record<LandingCurrency, number>;
  const rate = displayCurrency === baseCurrency ? 1 : rates[displayCurrency] ?? 1;
  const monthly = root?.monthly ?? fallback.monthlyValue;
  const yearly = root?.yearly ?? fallback.yearlyValue;
  const lifetime = root?.lifetime ?? null;

  return {
    source: root?.source ?? "project",
    baseCurrency,
    currency: displayCurrency,
    monthly: explicitPrices?.monthly ?? convertPrice(monthly, rate),
    yearly: explicitPrices?.yearly ?? convertPrice(yearly, rate),
    lifetime: explicitPrices?.lifetime ?? convertPrice(lifetime, rate),
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
