#!/usr/bin/env node
// Fails when the static export still contains placeholder content (elements marked
// data-to-confirm). Run after `npm run build`; the Pages deploy workflow runs it too.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const OUT_DIR = new URL("../out/", import.meta.url).pathname;
const MARKER = /data-to-confirm="([^"]+)"/g;
// Development-only story fixtures must never reach any built file (HTML, JS chunks or RSC payloads).
const FIXTURE_MARKER = "DEV-FIXTURE-MARKER";

function filesWith(dir, extensions) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return filesWith(path, extensions);
    return extensions.some((ext) => name.endsWith(ext)) ? [path] : [];
  });
}
const htmlFiles = (dir) => filesWith(dir, [".html"]);

let files;
try {
  files = htmlFiles(OUT_DIR);
} catch (error) {
  console.error(`check-publish-ready: cannot read ${OUT_DIR}. Run "npm run build" first. (${error.message})`);
  process.exit(2);
}

const findings = files.flatMap((file) =>
  [...readFileSync(file, "utf8").matchAll(MARKER)].map((match) => `${relative(OUT_DIR, file)}: ${match[1]}`),
);
const fixtureHits = filesWith(OUT_DIR, [".html", ".js", ".txt", ".json"]).filter((file) =>
  readFileSync(file, "utf8").includes(FIXTURE_MARKER),
);
for (const file of fixtureHits) findings.push(`${relative(OUT_DIR, file)}: development story fixture`);
const unique = [...new Set(findings)];

if (unique.length > 0) {
  console.error(`Not ready to publish: ${unique.length} placeholder(s) still marked "to confirm":`);
  for (const finding of unique) console.error(`  - ${finding}`);
  process.exit(1);
}
console.log(`Publish-ready: no placeholders in ${files.length} pages.`);
