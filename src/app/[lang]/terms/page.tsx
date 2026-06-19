import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/landing/legal-page";
import { getDictionary, isRoutedLocale, routedLocales, type Locale } from "@/lib/i18n";
import { generateLegalMetadata } from "@/lib/legal";

export function generateStaticParams() {
  return routedLocales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isRoutedLocale(lang)) return {};
  return generateLegalMetadata(lang as Locale, "terms");
}

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isRoutedLocale(lang)) notFound();
  
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return <LegalPage locale={locale} dict={dict} document="terms" />;
}
