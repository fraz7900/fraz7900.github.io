#!/usr/bin/env node
// Fails when the static export still contains placeholder content (elements marked
// data-to-confirm). Run after `npm run build`; the Pages deploy workflow runs it too.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const OUT_DIR = new URL("../out/", import.meta.url).pathname;
const MARKER = /data-to-confirm="([^"]+)"/g;

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return name.endsWith(".html") ? [path] : [];
  });
}

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
const unique = [...new Set(findings)];

if (unique.length > 0) {
  console.error(`Not ready to publish: ${unique.length} placeholder(s) still marked "to confirm":`);
  for (const finding of unique) console.error(`  - ${finding}`);
  process.exit(1);
}
console.log(`Publish-ready: no placeholders in ${files.length} pages.`);
