const t = new Bun.Transpiler({ loader: 'ts' })
const src = await Bun.file('/home/z/my-project/mini-services/nation-wire/index.ts').text()
const lines = src.split('\n')
const slice = lines.slice(551, 576).join('\n')
try {
  t.transformSync(slice)
  console.log('SLICE 552-576: PARSE OK ?!')
} catch (e) {
  console.log('SLICE 552-576: parse error ->', String((e as Error).message).split('\n').slice(0, 4).join(' | '))
}
// Triple-check the whole file again, scanning for ANY presence loop variants
try {
  const out = t.transformSync(src)
  console.log('FULL FILE: parse OK, bytes out =', out.length)
} catch (e) {
  console.log('FULL FILE: parse error ->', String((e as Error).message).split('\n').slice(0, 6).join(' | '))
}
// grep all `for (` lines mentioning presence
lines.forEach((l, i) => { if (/for \(const .*presence/.test(l)) console.log(`L${i + 1}:`, JSON.stringify(l)) })
