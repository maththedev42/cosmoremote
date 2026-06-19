import { Apple, ArrowUpRight, Smartphone, Tablet } from "lucide-react";
import { SectionShell } from "@/components/landing/section-shell";
import { Badge } from "@/components/ui/badge";

type DownloadCard = {
  platform: string;
  title: string;
  status: string;
  note: string;
  available?: boolean;
  href?: string;
  cta?: string;
};

type DownloadContent = {
  eyebrow: string;
  title: string;
  description: string;
  comingSoon: string;
  cards: DownloadCard[];
};

const iconMap = {
  iphone: Apple,
  ipad: Tablet,
  android: Smartphone,
} as const;

export function Downloads({ content }: { content: DownloadContent }) {
  return (
    <SectionShell
      id="downloads"
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {content.cards.map((card) => {
          const Icon = iconMap[card.platform as keyof typeof iconMap] ?? Smartphone;
          const isLive = Boolean(card.available && card.href);

          const inner = (
            <>
              <div className="flex items-center justify-between gap-3">
                <div className="grid size-12 place-items-center rounded-2xl border border-white/16 bg-white/10 text-white">
                  <Icon className="size-6" strokeWidth={2} />
                </div>
                <Badge
                  className={
                    card.available
                      ? "border-emerald-200/30 bg-emerald-200/15 text-emerald-100"
                      : "border-amber-200/30 bg-amber-200/15 text-amber-100"
                  }
                >
                  {card.status}
                </Badge>
              </div>

              <h3 className="mt-5 text-2xl font-semibold text-white">{card.title}</h3>
              <p className="mt-3 max-w-prose text-base leading-7 text-white/75">{card.note}</p>

              {isLive ? (
                <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors group-hover:border-white/40 group-hover:bg-white/15">
                  {card.cta ?? "Open in App Store"}
                  <ArrowUpRight className="size-4" strokeWidth={2.5} />
                </span>
              ) : null}
            </>
          );

          const baseClass =
            "block rounded-3xl border border-white/14 bg-white/8 p-6 shadow-[var(--shadow-card)]";

          if (isLive) {
            return (
              <a
                key={card.title}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group ${baseClass} transition-colors hover:border-white/30 hover:bg-white/12`}
              >
                {inner}
              </a>
            );
          }

          return (
            <article key={card.title} className={baseClass}>
              {inner}
            </article>
          );
        })}
      </div>

      <div className="mt-6 rounded-3xl border border-white/14 bg-[linear-gradient(120deg,rgba(52,152,219,0.22),rgba(46,204,113,0.12),rgba(255,255,255,0.08))] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d4f1ff]">{content.comingSoon}</p>
        <p className="mt-3 max-w-prose text-base leading-7 text-white/78">{content.description}</p>
      </div>
    </SectionShell>
  );
}
