import Link from "next/link";
import { PUBLIC_CONTACT_EMAIL, PUBLIC_CONTACT_MAILTO } from "@/lib/contact";
import type { Locale } from "@/lib/i18n";

type FooterContent = {
  brand: string;
  tagline: string;
  sectionsLabel: string;
  legalLabel: string;
  links: {
    features: string;
    screenshots: string;
    pricing: string;
    downloads: string;
    faq: string;
  };
  contact: {
    label: string;
  };
  legal: {
    rights: string;
    honesty: string;
    terms: string;
    privacy: string;
  };
};

const localeHref = (locale: Locale) => (locale === "en" ? "/" : `/${locale}`);

export function Footer({
  locale,
  content,
}: {
  locale: Locale;
  content: FooterContent;
}) {
  const links = [
    ["features", content.links.features],
    ["screenshots", content.links.screenshots],
    ["pricing", content.links.pricing],
    ["downloads", content.links.downloads],
    ["faq", content.links.faq],
  ] as const;

  return (
    <footer className="border-t border-white/10 bg-[#202020]/80">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8">
        <div>
          <p className="text-2xl font-semibold text-white">{content.brand}</p>
          <p className="mt-4 max-w-prose text-base leading-7 text-white/72">{content.tagline}</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
              {content.sectionsLabel}
            </p>
            <ul className="mt-4 space-y-3">
              {links.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-sm text-white/78 transition hover:text-white">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
              {content.legalLabel}
            </p>
            <p className="mt-4 text-sm text-white/78">{content.legal.rights}</p>
            <p className="mt-2 text-sm text-white/62">{content.legal.honesty}</p>
            <a
              href={PUBLIC_CONTACT_MAILTO}
              className="mt-4 block text-sm text-white/78 underline underline-offset-4 transition hover:text-white"
            >
              {content.contact.label}: {PUBLIC_CONTACT_EMAIL}
            </a>
            <div className="mt-4 flex items-center gap-4 text-sm text-white/72">
              <Link href={locale === "en" ? "/terms" : `/${locale}/terms`} className="underline underline-offset-4 hover:text-white transition">
                {content.legal.terms}
              </Link>
              <Link href={locale === "en" ? "/privacy" : `/${locale}/privacy`} className="underline underline-offset-4 hover:text-white transition">
                {content.legal.privacy}
              </Link>
            </div>
            <p className="mt-4 text-sm text-white/72">
              <Link href={localeHref(locale)} className="underline underline-offset-4">
                {content.brand}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
