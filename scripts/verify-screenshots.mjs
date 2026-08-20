#!/usr/bin/env node
// Verifies that every "src" referenced by landing/src/generated/landing-data.ts
// exists under landing/public. Exits 1 and prints any missing files. Repeatable —
// run before committing any landing screenshot change (the owner commits the
// atomic screenshot swap):
//   node landing/scripts/verify-screenshots.mjs
import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");
const dataPath = join(repoRoot, "landing", "src", "generated", "landing-data.ts");
const publicDir = join(repoRoot, "landing", "public");

const source = readFileSync(dataPath, "utf8");
const srcs = [...source.matchAll(/"src"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);

if (srcs.length === 0) {
  console.error("verify-screenshots: no \"src\" entries found in landing-data.ts — the generated format may have changed; update this check.");
  process.exit(1);
}

const missing = [];
for (const src of srcs) {
  const rel = src.replace(/^\//, "");
  if (!existsSync(join(publicDir, rel))) missing.push(src);
}

if (missing.length > 0) {
  console.error(`verify-screenshots: ${missing.length} referenced screenshot(s) missing under landing/public:`);
  for (const m of missing) console.error(`  MISSING  ${m}`);
  process.exit(1);
}

console.log(`verify-screenshots: OK — all ${srcs.length} referenced screenshots exist under landing/public.`);
