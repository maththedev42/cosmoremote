import type { Metadata } from "next";
import { LegalPage } from "@/components/landing/legal-page";
import { getDictionary, defaultLocale } from "@/lib/i18n";
import { generateLegalMetadata } from "@/lib/legal";

export async function generateMetadata(): Promise<Metadata> {
  return generateLegalMetadata(defaultLocale, "privacy");
}

export default async function PrivacyPage() {
  const dict = await getDictionary(defaultLocale);

  return <LegalPage locale={defaultLocale} dict={dict} document="privacy" />;
}
