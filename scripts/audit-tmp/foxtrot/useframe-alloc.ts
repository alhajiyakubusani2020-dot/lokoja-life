// Foxtrot audit: find allocations inside useFrame callback bodies (brace-matched)
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["src/components/game", "src/game", "src/app"];
const FILES: string[] = [];
function walk(dir: string) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?)$/.test(e) && !/\.test\.|\.e2e\./.test(e)) FILES.push(p);
  }
}
ROOTS.forEach((r) => walk(join(process.cwd(), r)));

const ALLOC =
  /new\s+(THREE\.)?(Vector3|Vector2|Color|Quaternion|Euler|Matrix4|Box3|Raycaster|Group|Object3D|Fog|PlaneGeometry|BoxGeometry|SphereGeometry|CylinderGeometry|TorusGeometry|CircleGeometry|BufferGeometry|MeshStandardMaterial|MeshBasicMaterial|MeshLambertMaterial|MeshPhysicalMaterial|ShaderMaterial|PointLight|DirectionalLight|SpotLight|AmbientLight|HemisphereLight|Mesh|SkinnedMesh)\b/g;

const results: { file: string; line: number; alloc: string; kind: string }[] = [];
let totalUseFrame = 0;

for (const f of FILES) {
  const src = readFileSync(f, "utf8");
  const lines = src.split("\n");
  let idx = 0;
  while (true) {
    const m = /useFrame\(/.exec(src.slice(idx));
    if (!m) break;
    const callStart = idx + m.index;
    totalUseFrame++;
    // find opening paren then brace-match the callback
    let i = callStart + "useFrame(".length;
    while (i < src.length && src[i] !== "(" && src[i] !== ")") {
      if (src[i] === "{") break; // arrow with block starts later
      i++;
    }
    // find first { after the callback starts
    let openBrace = src.indexOf("{", callStart);
    if (openBrace === -1) { idx = callStart + 8; continue; }
    let depth = 0, j = openBrace, end = -1;
    for (; j < src.length; j++) {
      const c = src[j];
      if (c === "{") depth++;
      else if (c === "}") { depth--; if (depth === 0) { end = j; break; } }
      else if (c === '"' || c === "'" || c === "`") {
        const q = c; j++;
        while (j < src.length && src[j] !== q) { if (src[j] === "\\") j++; j++; }
      } else if (c === "/" && src[j + 1] === "/") {
        while (j < src.length && src[j] !== "\n") j++;
      } else if (c === "/" && src[j + 1] === "*") {
        j += 2; while (j < src.length && !(src[j] === "*" && src[j + 1] === "/")) j++;
      }
    }
    if (end === -1) { idx = callStart + 8; continue; }
    const body = src.slice(openBrace, end);
    let am: RegExpExecArray | null;
    ALLOC.lastIndex = 0;
    while ((am = ALLOC.exec(body))) {
      const before = body.slice(0, am.index);
      const lineNo = before.split("\n").length;
      const kind = /Geometry|Material|Light|Mesh\b|Group|Object3D/.test(am[0]) ? "HEAVY" : "light";
      results.push({ file: f.replace(process.cwd() + "/", ""), line: src.slice(0, openBrace).split("\n").length + lineNo - 1, alloc: am[0].trim(), kind });
    }
    idx = callStart + 8;
  }
}

const byFile = new Map<string, number>();
for (const r of results) byFile.set(r.file, (byFile.get(r.file) ?? 0) + 1);
console.log(`useFrame( call sites: ${totalUseFrame}`);
console.log(`allocations inside useFrame bodies: ${results.length} (HEAVY: ${results.filter((r) => r.kind === "HEAVY").length})`);
console.log("\nTop files by allocation count:");
[...byFile.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([f, n]) => console.log(`  ${n}\t${f}`));
console.log("\nAll allocation sites:");
for (const r of results) console.log(`  ${r.file}:${r.line}  [${r.kind}]  ${r.alloc}`);
