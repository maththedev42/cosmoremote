"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getHeroScreenshots, getScreenshotDimensions } from "@/lib/screenshots";
import type { Locale } from "@/lib/i18n";

type HeroProps = {
  locale: Locale;
  content: {
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
    secondaryCta: string;
    note: string;
    platforms: string[];
    metrics: Array<{ value: string; label: string }>;
  };
};

export function Hero({ locale, content }: HeroProps) {
  const { primary, secondary } = getHeroScreenshots(locale);

  return (
    <section className="relative overflow-hidden py-12 md:py-18">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(52,152,219,0.35),transparent_48%),radial-gradient(circle_at_84%_4%,rgba(155,89,182,0.26),transparent_45%),radial-gradient(circle_at_50%_92%,rgba(46,204,113,0.2),transparent_42%)]" />

      <div className="relative mx-auto grid w-full max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="order-1"
        >
          <Badge className="border-[#8fd1ff]/35 bg-[#8fd1ff]/15 text-[#d9f1ff]">{content.eyebrow}</Badge>

          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-5xl md:text-6xl">
            {content.title}
            <span className="mt-2 block text-2xl font-medium text-white/86 sm:text-3xl md:text-4xl">
              {content.subtitle}
            </span>
          </h1>

          <p className="mt-5 max-w-prose text-base leading-7 text-white/78 md:text-lg">{content.description}</p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="#screenshots" variant="outline" className="h-12 w-full px-5 text-base sm:w-auto">
              {content.secondaryCta}
            </Button>
          </div>

          <p className="mt-5 flex items-start gap-2 text-sm leading-6 text-white/76">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#2ecc71]" />
            <span>{content.note}</span>
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {content.platforms.map((platform) => (
              <Badge
                key={platform}
                className="min-h-11 border-white/18 bg-white/8 px-4 py-2 text-xs font-semibold tracking-[0.06em] text-white"
              >
                <Smartphone className="size-3.5" />
                {platform}
              </Badge>
            ))}
          </div>

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {content.metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 * (index + 1), duration: 0.4 }}
                className="rounded-2xl border border-white/16 bg-white/8 p-4"
              >
                <p className="text-2xl font-semibold text-white">{metric.value}</p>
                <p className="mt-2 text-sm text-white/70">{metric.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="order-2"
        >
          {primary ? (
            <div className="relative mx-auto w-full max-w-[28rem] lg:max-w-none">
              <div className="overflow-hidden rounded-[1.75rem] border border-white/18 bg-[#1d1d1d] p-2 shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
                <Image
                  src={primary.src}
                  alt={primary.alt}
                  width={getScreenshotDimensions(primary).width}
                  height={getScreenshotDimensions(primary).height}
                  priority
                  className="h-auto w-full rounded-[1.15rem]"
                  sizes="(max-width: 768px) 100vw, 46vw"
                />
              </div>

              {secondary && (
                <div className="absolute -bottom-7 -left-8 hidden w-56 rounded-3xl border border-white/20 bg-[#1d1d1d] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:block lg:w-64">
                  <Image
                    src={secondary.src}
                    alt={secondary.alt}
                    width={getScreenshotDimensions(secondary).width}
                    height={getScreenshotDimensions(secondary).height}
                    className="h-auto w-full rounded-2xl"
                    sizes="(max-width: 1024px) 40vw, 22vw"
                  />
                </div>
              )}
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
