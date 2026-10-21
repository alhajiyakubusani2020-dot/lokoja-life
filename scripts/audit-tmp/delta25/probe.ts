/**
 * TEAM DELTA (Task 5-d) — chunk probe: attribute first-load chunk content
 * by marker strings, and guard against three.js leaking into first load.
 *
 * Usage: bun scripts/audit-tmp/delta25/probe.ts
 * Reads .next/server/app/index.html script srcs, then scans EACH first-load
 * chunk for the mission markers ('patti', 'engine.io', 'crowther-memorial',
 * 'SAVE_VERSION') plus three.js markers (PerspectiveCamera / WebGLRenderer).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const html = readFileSync(".next/server/app/index.html", "utf8");
const srcs = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]);

const MARKERS = [
  "'patti'",
  "engine.io",
  "crowther-memorial",
  "SAVE_VERSION",
  // Foxtrot-P2 guard: three.js must never ride first load
  "PerspectiveCamera",
  "WebGLRenderer",
];

console.log(`first-load chunks: ${srcs.length}`);
let anyThree = 0;
for (const s of srcs) {
  const p = join(".next", s.replace(/^\/_next\//, "").split("?")[0]);
  let body: string;
  try {
    body = readFileSync(p, "utf8");
  } catch {
    console.log(`  MISSING ${s}`);
    continue;
  }
  const hits: string[] = [];
  for (const m of MARKERS) {
    const n = body.split(m).length - 1;
    if (n > 0) hits.push(`${m}×${n}`);
  }
  if (hits.some((h) => h.startsWith("PerspectiveCamera") || h.startsWith("WebGLRenderer")))
    anyThree++;
  const kb = (body.length / 1024).toFixed(0);
  console.log(`  ${kb.padStart(6)} KB  ${s}${hits.length ? "  → " + hits.join(" ") : ""}`);
}
console.log(anyThree === 0 ? "\nGUARD PASS: zero three.js markers in first-load chunks" : `\nGUARD FAIL: ${anyThree} first-load chunk(s) contain three.js markers`);
