import { ogImageSize, renderLandingOgImage } from "@/lib/og-image";

export const dynamic = "force-static";
export const runtime = "nodejs";
export const alt = "CosmoRemote";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
  return renderLandingOgImage("en");
}
