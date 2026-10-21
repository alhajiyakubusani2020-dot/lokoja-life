// TEAM HOTEL — parse-only check of mini-services/nation-wire/index.ts (no deps resolved)
const src = await Bun.file('/home/z/my-project/mini-services/nation-wire/index.ts').text()
const t = new Bun.Transpiler({ loader: 'ts' })
try {
  t.transformSync(src)
  console.log('PARSE: OK')
} catch (e) {
  console.log('PARSE: FAILED')
  console.log(String((e as Error).message).slice(0, 800))
}
// also confirm the offending line's raw text + that `handle` is used inside the loop
const lines = src.split('\n')
console.log('line553:', JSON.stringify(lines[552]))
console.log('loop body refs:', lines.slice(552, 576).filter((l) => /\bhandle\b/.test(l)).map((l) => l.trim()).slice(0, 6))
