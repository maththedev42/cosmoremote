import { Downloads } from "@/components/landing/downloads";
import { Faq } from "@/components/landing/faq";
import { FeatureBento } from "@/components/landing/feature-bento";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { JsonLd } from "@/components/landing/json-ld";
import { Navbar } from "@/components/landing/navbar";
import { Pricing } from "@/components/landing/pricing";
import { ScreenshotsGallery } from "@/components/landing/screenshots-gallery";
import type { LandingDictionary, Locale } from "@/lib/i18n";

export function LandingPage({ locale, dict }: { locale: Locale; dict: LandingDictionary }) {
  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <JsonLd dict={dict} locale={locale} />
      <Navbar locale={locale} labels={dict.nav} />
      <Hero locale={locale} content={dict.hero} />
      <FeatureBento content={dict.features} />
      <ScreenshotsGallery locale={locale} content={dict.screenshots} />
      <Pricing locale={locale} content={dict.pricing} />
      <Downloads content={dict.downloads} />
      <Faq locale={locale} content={{ ...dict.faq, pricing: dict.pricing }} />
      <Footer locale={locale} content={dict.footer} />
    </main>
  );
}
