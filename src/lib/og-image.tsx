import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { landingData } from "@/generated/landing-data";
import type { Locale } from "@/lib/i18n";
import en from "@/messages/en.json";
import es from "@/messages/es.json";
import ptBR from "@/messages/pt-BR.json";

const dictionaries = {
  en,
  "pt-BR": ptBR,
  es,
} satisfies Record<Locale, typeof en>;

export const ogImageSize = {
  width: 1200,
  height: 630,
};

function getOgScreenshot(locale: Locale) {
  const shots = landingData.screenshots[locale] ?? landingData.screenshots.en;
  return shots.ipad[0] ?? shots.iphone[0] ?? null;
}

async function readScreenshotDataUrl(locale: Locale) {
  const screenshot = getOgScreenshot(locale);

  if (!screenshot) {
    return null;
  }

  const screenshotData = await readFile(
    join(process.cwd(), "public", screenshot.src.replace(/^\//, "")),
    "base64",
  );

  return `data:image/png;base64,${screenshotData}`;
}

export async function renderLandingOgImage(locale: Locale) {
  const dict = dictionaries[locale] ?? dictionaries.en;
  const screenshotSrc = await readScreenshotDataUrl(locale);

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #202020 0%, #122433 52%, #2f2f2f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "Montserrat, Segoe UI, sans-serif",
          position: "relative",
          padding: "64px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at 50% 0%, rgba(52,152,219,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(155,89,182,0.2) 0%, transparent 40%)",
          }}
        />
        <div
          style={{
            width: "610px",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <div
            style={{
              alignSelf: "flex-start",
              border: "1px solid rgba(255,255,255,0.24)",
              borderRadius: 999,
              color: "#d9f1ff",
              fontSize: 24,
              fontWeight: 700,
              padding: "12px 20px",
              background: "rgba(52,152,219,0.22)",
            }}
          >
            {dict.nav.prelaunch}
          </div>
          <div
            style={{
              fontSize: 86,
              fontWeight: 800,
              color: "white",
              marginTop: 34,
              display: "flex",
              alignItems: "center",
              letterSpacing: 0,
              lineHeight: 1,
            }}
          >
            {dict.hero.title}
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 500,
              color: "rgba(255,255,255,0.82)",
              letterSpacing: 0,
              marginTop: 24,
              lineHeight: 1.24,
              display: "flex",
            }}
          >
            {dict.hero.subtitle}
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.68)",
              display: "flex",
              fontSize: 24,
              lineHeight: 1.35,
              marginTop: 22,
              maxWidth: 560,
            }}
          >
            {dict.meta.description}
          </div>
        </div>
        {screenshotSrc ? (
          <div
            style={{
              width: "360px",
              height: "500px",
              borderRadius: 36,
              border: "1px solid rgba(255,255,255,0.22)",
              background: "rgba(255,255,255,0.08)",
              padding: 10,
              boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
              position: "relative",
              overflow: "hidden",
              display: "flex",
            }}
          >
            <img
              src={screenshotSrc}
              alt=""
              width="340"
              height="480"
              style={{
                width: "340px",
                height: "480px",
                objectFit: "cover",
                objectPosition: "top left",
                borderRadius: 28,
              }}
            />
          </div>
        ) : null}
      </div>
    ),
    {
      ...ogImageSize,
    },
  );
}
