"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionShell } from "@/components/landing/section-shell";
import { getGalleryScreenshots, getScreenshotDimensions } from "@/lib/screenshots";
import type { Locale } from "@/lib/i18n";

export function ScreenshotsGallery({
  locale,
  content,
}: {
  locale: Locale;
  content: {
    eyebrow: string;
    title: string;
    description: string;
    items: Array<{ title: string; caption: string; variant: string }>;
  };
}) {
  const shots = getGalleryScreenshots(locale);

  if (shots.length === 0) {
    return null;
  }

  const cards = shots.map((shot, index) => {
    const copy = content.items[index % Math.max(content.items.length, 1)];

    return {
      ...shot,
      title: copy?.title ?? "CosmoRemote",
      caption: copy?.caption ?? "",
      key: `${shot.src}-${index}`,
    };
  });

  return (
    <SectionShell
      id="screenshots"
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card, index) => (
          <motion.figure
            key={card.key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delay: 0.06 * index, duration: 0.4 }}
            className="overflow-hidden rounded-3xl border border-white/14 bg-white/8 shadow-[var(--shadow-card)]"
          >
            <div className="border-b border-white/10 p-2">
              <Image
                src={card.src}
                alt={card.alt}
                width={getScreenshotDimensions(card).width}
                height={getScreenshotDimensions(card).height}
                className="h-auto w-full rounded-2xl"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
            </div>
            <figcaption className="p-4 sm:p-5">
              <h3 className="text-base font-semibold text-white sm:text-lg">{card.title}</h3>
              <p className="mt-2 max-w-prose text-sm leading-6 text-white/72">{card.caption}</p>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </SectionShell>
  );
}
