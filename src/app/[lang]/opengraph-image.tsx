import { ogImageSize, renderLandingOgImage } from "@/lib/og-image";
import { isRoutedLocale, routedLocales, type Locale } from "@/lib/i18n";

export const dynamic = "force-static";
export const runtime = "nodejs";
export const alt = "CosmoRemote";
export const size = ogImageSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return routedLocales.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (isRoutedLocale(lang) ? lang : "en") as Locale;

  return renderLandingOgImage(locale);
}
