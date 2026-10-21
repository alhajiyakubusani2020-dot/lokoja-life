// Foxtrot: measure real First Load JS of the prerendered main route (" /")
// by summing every <script src> + <link rel=stylesheet> in .next/server/app/index.html
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const html = readFileSync(".next/server/app/index.html", "utf8");
const srcs = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]);
const css = [...html.matchAll(/<link[^>]+href="([^"]+\.css[^"]*)"/g)].map((m) => m[1]);

let raw = 0, gz = 0;
console.log("scripts:");
for (const s of srcs) {
  const p = join(".next", s.replace(/^\/_next\//, ""));
  let size = -1, gzsize = -1;
  try {
    size = statSync(p).size;
    gzsize = parseInt(execSync(`gzip -c "${p}" | wc -c`).toString().trim(), 10);
  } catch { /* missing */ }
  raw += Math.max(0, size); gz += Math.max(0, gzsize);
  console.log(`  ${String(size).padStart(9)} raw ${String(gzsize).padStart(9)} gz  ${s}`);
}
let craw = 0, cgz = 0;
console.log("css:");
for (const s of css) {
  const p = join(".next", s.replace(/^\/_next\//, "").split("?")[0]);
  let size = -1, gzsize = -1;
  try {
    size = statSync(p).size;
    gzsize = parseInt(execSync(`gzip -c "${p}" | wc -c`).toString().trim(), 10);
  } catch { /* missing */ }
  craw += Math.max(0, size); cgz += Math.max(0, gzsize);
  console.log(`  ${String(size).padStart(9)} raw ${String(gzsize).padStart(9)} gz  ${s}`);
}
console.log(`\nTOTAL first-load JS: ${raw} bytes raw, ${gz} bytes gzip (${(gz / 1024).toFixed(1)} KB)`);
console.log(`TOTAL css: ${craw} raw, ${cgz} gzip (${(cgz / 1024).toFixed(1)} KB)`);
// inline script bodies count
const inline = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)];
const inlineBytes = inline.reduce((a, m) => a + m[1].length, 0);
console.log(`inline <script> bodies: ${inline.length} totaling ${inlineBytes} bytes`);
// also count preload/modulepreload
const pre = [...html.matchAll(/<link[^>]+rel="(preload|modulepreload)"[^>]+href="([^"]+)"/g)];
console.log(`preload/modulepreload links: ${pre.length}`);
