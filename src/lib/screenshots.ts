import type { Locale } from "@/lib/i18n";
import { getLocaleScreenshots } from "@/lib/landing-data";

export type ScreenshotDevice = "iphone" | "ipad" | "android-phone" | "android-tablet";

export type ScreenshotAsset = {
  src: string;
  alt: string;
  device: ScreenshotDevice;
  width?: number;
  height?: number;
};

const screenshotDimensions = {
  iphone: { width: 1284, height: 2778 },
  ipad: { width: 2048, height: 2732 },
  "android-phone": { width: 1080, height: 2400 },
  "android-tablet": { width: 1600, height: 2560 },
} satisfies Record<ScreenshotDevice, { width: number; height: number }>;

export function getScreenshotDimensions(asset: Pick<ScreenshotAsset, "device" | "width" | "height">) {
  if ("width" in asset && "height" in asset && asset.width && asset.height) {
    return { width: asset.width, height: asset.height };
  }

  return screenshotDimensions[asset.device];
}

export function getScreenshotsForLocale(locale: Locale) {
  const shots = getLocaleScreenshots(locale);
  return {
    iphone: shots.iphone.map((item) => ({ ...item, device: "iphone" as const })),
    ipad: shots.ipad.map((item) => ({ ...item, device: "ipad" as const })),
    androidPhone: shots["android-phone"].map((item) => ({ ...item, device: "android-phone" as const })),
    androidTablet: shots["android-tablet"].map((item) => ({ ...item, device: "android-tablet" as const })),
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
  return [...shots.iphone, ...shots.ipad, ...shots.androidPhone, ...shots.androidTablet];
}
