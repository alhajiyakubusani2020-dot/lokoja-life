// Does the transpiler actually catch bad syntax? control test + exact file slice.
const t = new Bun.Transpiler({ loader: 'ts' })
const bad = 'const m = new Map()\nfor (const andle, p] of m) { console.log(p) }\n'
try {
  t.transformSync(bad)
  console.log('CONTROL bad snippet: PARSE OK (transpiler not catching!)')
} catch (e) {
  console.log('CONTROL bad snippet: FAILED as expected ->', String((e as Error).message).split('\n')[0])
}
const src = await Bun.file('/home/z/my-project/mini-services/nation-wire/index.ts').text()
const lines = src.split('\n')
console.log('lines total:', lines.length)
for (let i = 550; i < 560; i++) console.log(`L${i + 1}:`, JSON.stringify(lines[i]))
// exact extract of the loop line
const loopLine = lines.findIndex((l) => l.includes('of presence)'))
console.log('loop line number:', loopLine + 1, JSON.stringify(lines[loopLine]))
