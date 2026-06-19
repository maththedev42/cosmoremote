"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { SectionShell } from "@/components/landing/section-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { formatLandingCurrency, getLandingPricing, getLandingSavingsPercent } from "@/lib/landing-data";

type PricingContent = {
  eyebrow: string;
  title: string;
  description: string;
  monthlyLabel: string;
  yearlyLabel: string;
  monthlyValue: number;
  yearlyValue: number;
  freeLabel: string;
  freePrice: string;
  trialLabel: string;
  cadenceMonthly: string;
  cadenceYearly: string;
  cadenceFree: string;
  saveTemplate: string;
  toggleMonthly: string;
  toggleYearly: string;
  ctaFree: string;
  ctaPro: string;
  monthlyDescription: string;
  yearlyDescription: string;
  yearlyHighlight: string;
  yearlyComparisonTemplate: string;
  cards: {
    free: string[];
    premium: string[];
  };
};

export function Pricing({ locale, content }: { locale: Locale; content: PricingContent }) {
  const pricing = getLandingPricing(locale, content);

  const savePercent = useMemo(
    () => getLandingSavingsPercent(pricing.monthly, pricing.yearly) ?? 0,
    [pricing.monthly, pricing.yearly],
  );

  const monthlyPriceLabel =
    pricing.monthly !== null ? formatLandingCurrency(pricing.monthly, pricing.currency, locale) : content.freePrice;
  const yearlyPriceLabel =
    pricing.yearly !== null ? formatLandingCurrency(pricing.yearly, pricing.currency, locale) : content.freePrice;
  const freePriceLabel = formatLandingCurrency(0, pricing.currency, locale);
  const yearlyComparison =
    pricing.monthly !== null && pricing.yearly !== null
      ? content.yearlyComparisonTemplate
          .replace("{monthlyTotal}", formatLandingCurrency(pricing.monthly * 12, pricing.currency, locale))
          .replace("{yearly}", yearlyPriceLabel)
      : null;

  return (
    <SectionShell
      id="pricing"
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <article className="rounded-3xl border border-white/14 bg-white/8 p-6 shadow-[var(--shadow-card)]">
          <p className="text-lg font-semibold text-white">{content.freeLabel}</p>
          <div className="mt-4 flex items-end gap-2">
            <p className="text-4xl font-semibold text-white">{freePriceLabel}</p>
            <span className="pb-1 text-sm text-white/70">{content.cadenceFree}</span>
          </div>
          <ul className="mt-5 space-y-3">
            {content.cards.free.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-white/78">
                <Check className="mt-0.5 size-4 shrink-0 text-[#2ecc71]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Button href="#downloads" variant="outline" className="mt-6 h-11 w-full text-sm">
            {content.ctaFree}
          </Button>
        </article>

        <article className="rounded-3xl border border-white/14 bg-white/8 p-6 shadow-[var(--shadow-card)]">
          <p className="text-lg font-semibold text-white">{content.monthlyLabel}</p>
          <div className="mt-4 flex items-end gap-2">
            <p className="text-4xl font-semibold text-white">{monthlyPriceLabel}</p>
            <span className="pb-1 text-sm text-white/70">{content.cadenceMonthly}</span>
          </div>
          <p className="mt-2 text-sm font-medium text-[#d4f1ff]">{content.trialLabel}</p>
          <p className="mt-3 text-sm leading-6 text-white/72">{content.monthlyDescription}</p>
          <ul className="mt-5 space-y-3">
            {content.cards.premium.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-white/78">
                <Check className="mt-0.5 size-4 shrink-0 text-[#2ecc71]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Button href="#downloads" variant="outline" className="mt-6 h-11 w-full text-sm">
            {content.ctaPro}
          </Button>
        </article>

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-3xl border border-[#3498db]/50 bg-[linear-gradient(180deg,rgba(52,152,219,0.24),rgba(155,89,182,0.22),rgba(255,255,255,0.08))] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.3)]"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-semibold text-white">{content.yearlyLabel}</p>
            {savePercent > 0 ? (
              <Badge className="border-[#2ecc71]/35 bg-[#2ecc71]/15 text-[#dbffeb]">
                <Sparkles className="size-3.5" />
                {content.saveTemplate.replace("{percent}", String(savePercent))}
              </Badge>
            ) : null}
          </div>

          <div className="mt-4 flex items-end gap-2">
            <p className="text-4xl font-semibold text-white">{yearlyPriceLabel}</p>
            <span className="pb-1 text-sm text-white/74">{content.cadenceYearly}</span>
          </div>

          <p className="mt-2 text-sm font-medium text-[#e7fff0]">{content.trialLabel}</p>
          <p className="mt-3 text-sm leading-6 text-white/82">{content.yearlyDescription}</p>

          {yearlyComparison ? (
            <p className="mt-3 text-xs leading-5 text-white/60">{yearlyComparison}</p>
          ) : null}

          <ul className="mt-5 space-y-3">
            {content.cards.premium.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-white/86">
                <Check className="mt-0.5 size-4 shrink-0 text-[#2ecc71]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Button href="#downloads" className="mt-6 h-11 w-full text-sm">
            {content.ctaPro}
          </Button>
        </motion.article>
      </div>
    </SectionShell>
  );
}
