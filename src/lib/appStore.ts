// Apple campaign attribution for outbound App Store links.
//
// Every CTA on this site points at the same listing URL, synced from CosmoHQ.
// Until now an install that started here was indistinguishable from someone
// browsing the App Store directly: App Store Connect only reports a campaign
// when the link carries Apple's `pt` (provider) and `ct` (campaign) tokens.
// This module builds those URLs; the token is stamped onto the anchors at
// runtime by AppStoreAttribution, which is why the components can keep their
// plain literal.
//
// The provider token belongs to the CosmoHQ workspace `cosmohq-main` and is
// public by design — it appears in every ad URL we publish.
export const APPLE_PROVIDER_TOKEN = "122879172";

// Traffic that reached the site with no campaign of its own still gets a
// token, so "installed from the website" stays separable from "found us in
// the App Store". Without it those two collapse into one unattributed bucket.
export const DEFAULT_CAMPAIGN_TOKEN = "landing";

export const CAMPAIGN_TOKEN_STORAGE_KEY = "cosmoremote.ct";

// Apple caps `ct` at 40 characters and rejects anything exotic; a token that
// fails validation is dropped silently, taking the attribution with it.
const MAX_TOKEN_LENGTH = 40;

export function sanitizeCampaignToken(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_TOKEN_LENGTH);
}

// Order matters: an explicit `ct` (the tracked links minted in CosmoHQ) beats
// anything else, then whatever this visit already resolved, then UTM tags from
// a campaign that did not go through the shortener.
export function campaignTokenFrom(
  search: string,
  stored?: string | null,
): string {
  const params = new URLSearchParams(search);

  const explicit = sanitizeCampaignToken(params.get("ct"));
  if (explicit) return explicit;

  const remembered = sanitizeCampaignToken(stored);
  if (remembered) return remembered;

  const source = sanitizeCampaignToken(params.get("utm_source"));
  if (source) {
    const campaign = sanitizeCampaignToken(params.get("utm_campaign"));
    return sanitizeCampaignToken(
      campaign ? `web-${source}-${campaign}` : `web-${source}`,
    );
  }

  return DEFAULT_CAMPAIGN_TOKEN;
}

// A storefront-prefixed listing path (the synced URL still hardcodes /br/)
// sends every visitor to the Brazilian storefront. Apple geo-routes a neutral
// /app/<id> URL to the visitor's own store, so drop the country prefix — and
// the slug with it, since /app/<id> is all the store needs. Only
// storefront-prefixed paths are touched; an already neutral URL is returned
// unchanged.
export function neutralizeStorePath(pathname: string): string {
  const prefixed = pathname.match(/^\/[a-z]{2}(\/app\/.*)$/i);
  if (!prefixed) return pathname;
  const idOnly = prefixed[1].match(/^\/app\/(?:.*\/)?(id\d+\/?)$/);
  return idOnly ? `/app/${idOnly[1]}` : prefixed[1];
}

// Idempotent: `set` replaces, so re-stamping an anchor the observer already
// touched produces the same URL instead of a second pair of tokens.
export function withAppleAttribution(href: string, token: string): string {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  if (url.hostname !== "apps.apple.com") return href;

  url.pathname = neutralizeStorePath(url.pathname);

  const ct = sanitizeCampaignToken(token);
  if (!ct) return href;

  url.searchParams.set("pt", APPLE_PROVIDER_TOKEN);
  url.searchParams.set("ct", ct);
  // CosmoRemote is an iPhone app; mt=8 opens the iOS App Store rather than Mac.
  if (!url.searchParams.has("mt")) url.searchParams.set("mt", "8");

  return url.toString();
}
