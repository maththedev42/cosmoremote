import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import type { LandingDictionary, Locale } from "@/lib/i18n";
import { legalContent } from "@/lib/legal";

type LegalPageProps = {
  locale: Locale;
  dict: LandingDictionary;
  document: "privacy" | "terms";
};

export function LegalPage({ locale, dict, document }: LegalPageProps) {
  const content = legalContent[locale][document];

  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <Navbar locale={locale} labels={dict.nav} />

      <section className="border-b border-white/10 bg-[#202020]">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#23C7D9]">
            {content.eyebrow}
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-5 text-base leading-7 text-white/72 sm:text-lg">
            {content.description}
          </p>
        </div>
      </section>

      <article className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
        <p className="text-sm font-medium text-white/58">{content.lastUpdated}</p>

        <div className="mt-10 space-y-12">
          {content.sections.map((section) => (
            <section key={section.title} className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                {section.title}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-base leading-8 text-white/72">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>

      <Footer locale={locale} content={dict.footer} />
    </main>
  );
}
