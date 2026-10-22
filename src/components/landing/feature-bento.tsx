"use client";

import { motion } from "framer-motion";
import {
  Bolt,
  Cable,
  Copy,
  FolderCog,
  QrCode,
  ServerCog,
  SquareTerminal,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { SectionShell } from "@/components/landing/section-shell";
import { cn } from "@/lib/utils";

type FeatureItem = {
  title: string;
  description: string;
  icon: string;
};

const iconMap: Record<string, LucideIcon> = {
  spark: Bolt,
  stream: Cable,
  qr: QrCode,
  code: SquareTerminal,
  folder: FolderCog,
  copy: Copy,
  status: Wifi,
  server: ServerCog,
};

export function FeatureBento({
  content,
}: {
  content: {
    eyebrow: string;
    title: string;
    description: string;
    items: FeatureItem[];
  };
}) {
  return (
    <SectionShell
      id="features"
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
    >
      <div id="testing" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {content.items.map((item, index) => {
          const Icon = iconMap[item.icon] ?? Bolt;
          const wide = index === 0 || index === 5;
          return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: index * 0.05, duration: 0.35 }}
              className={cn(
                "group rounded-3xl border border-white/14 bg-[linear-gradient(160deg,rgba(255,255,255,0.14),rgba(255,255,255,0.05))] p-5 shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1 hover:border-white/30",
                wide && "sm:col-span-2 lg:col-span-2",
              )}
            >
              {index === 2 ? <div id="web" /> : null}
              {index === 5 ? <div id="pairing" /> : null}
              <div className="mb-4 grid size-12 place-items-center rounded-2xl border border-white/20 bg-[#3498db]/22 text-white transition group-hover:bg-[#9b59b6]/28">
                <Icon className="size-5" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 max-w-prose text-base leading-7 text-white/74">{item.description}</p>
            </motion.article>
          );
        })}
      </div>
    </SectionShell>
  );
}
