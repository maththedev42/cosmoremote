import type { Locale } from "@/lib/i18n";
import { getLocaleScreenshots } from "@/lib/landing-data";

export type ScreenshotDevice = "iphone" | "ipad";

export type ScreenshotAsset = {
  src: string;
  alt: string;
  device: ScreenshotDevice;
};

const screenshotDimensions = {
  iphone: { width: 1284, height: 2778 },
  ipad: { width: 2048, height: 2732 },
} satisfies Record<ScreenshotDevice, { width: number; height: number }>;

export function getScreenshotDimensions(asset: Pick<ScreenshotAsset, "device">) {
  return screenshotDimensions[asset.device];
}

export function getScreenshotsForLocale(locale: Locale) {
  const shots = getLocaleScreenshots(locale);
  return {
    iphone: shots.iphone.map((item) => ({ ...item, device: "iphone" as const })),
    ipad: shots.ipad.map((item) => ({ ...item, device: "ipad" as const })),
  };
}

export function getHeroScreenshots(locale: Locale) {
  const shots = getScreenshotsForLocale(locale);
  const primary = shots.iphone[0] ?? shots.ipad[0] ?? null;
  const secondary = shots.ipad[0] ?? shots.iphone[1] ?? null;

  return { primary, secondary };
}

export function getGalleryScreenshots(locale: Locale) {
  const shots = getScreenshotsForLocale(locale);
  return [...shots.iphone, ...shots.ipad];
}
