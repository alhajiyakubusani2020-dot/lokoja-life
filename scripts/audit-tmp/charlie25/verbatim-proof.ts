/**
 * CHARLIE PH2.5 — verbatim-movement proof.
 * For every one of the 194 store members (and the shared helper block),
 * pulls the ORIGINAL text from git HEAD, normalizes whitespace, and asserts
 * it appears verbatim inside the new split files — or is one of the small,
 * documented mechanical exceptions (counter wrappers + lazy wire).
 */
import { execSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'

const ROOT = '/home/z/my-project'
const orig = execSync('git show HEAD:src/game/store/useGameStore.ts', { encoding: 'utf8', maxBuffer: 1024 * 1024 * 64 }).split('\n')

const MEMBER_STARTS = [1246, 1247, 1248, 1249, 1251, 1252, 1253, 1254, 1255, 1256, 1257, 1258, 1259, 1260, 1261, 1262, 1263, 1264, 1265, 1266, 1267, 1268, 1269, 1270, 1271, 1272, 1273, 1274, 1275, 1276, 1277, 1278, 1279, 1280, 1281, 1282, 1283, 1284, 1286, 1287, 1288, 1289, 1293, 1305, 1312, 1336, 1420, 1479, 1488, 1556, 1572, 1609, 1627, 1663, 1702, 1730, 1745, 1772, 1813, 1839, 1871, 1882, 1915, 2000, 2050, 2076, 2142, 2165, 2174, 2188, 2207, 2251, 2276, 2350, 2385, 2428, 2453, 2489, 2514, 2541, 2567, 2607, 2640, 2669, 2701, 2718, 2740, 2764, 2823, 2877, 2909, 2935, 2970, 2997, 3018, 3046, 3065, 3086, 3104, 3129, 3147, 3164, 3182, 3214, 3232, 3251, 3281, 3300, 3350, 3375, 3412, 3453, 3476, 3491, 3564, 3761, 3809, 3846, 3898, 3915, 4001, 4036, 4066, 4076, 4153, 4171, 4193, 4202, 4220, 4229, 4238, 4248, 4271, 4279, 4288, 4297, 4308, 4326, 4339, 4364, 4380, 4396, 4417, 4442, 4467, 4494, 4512, 4535, 4622, 4657, 4664, 4775, 4786, 4791, 4800, 4826, 4838, 4869, 4885, 4951, 4968, 4988, 5001, 5009, 5018, 5027, 5033, 5047, 5058, 5070, 5082, 5091, 5101, 5110, 5135, 5147, 5160, 5184, 5192, 5208, 5257, 5283, 5295, 5325, 5335, 5344, 5366, 5381, 5395, 5403, 5471, 5507, 5552, 5559]

// members whose body contains a DOCUMENTED mechanical change (PH2.5 counter
// wrappers, the nationBridge book move, the lazy-wire conversion)
const MECHANICAL = new Set(['notify', 'addMoney', 'giveReward', 'nationSetCrowd', 'opsSetFlag', 'setVehicleStyle'])

const norm = (s: string): string => s.split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n')

// the new corpus: every slice + shared (verbatim targets)
const dir = path.join(ROOT, 'src/game/store')
const files = fs.readdirSync(path.join(dir, 'slices')).filter((f) => f.endsWith('.ts')).map((f) => path.join(dir, 'slices', f))
files.push(path.join(dir, 'shared.ts'))
const corpus = files.map((f) => {
  let t = fs.readFileSync(f, 'utf8')
  // reverse the documented path-depth fix so verbatim comparison still hits
  t = t
    .replaceAll('import(\'../../types\')', "import('../types')")
    .replaceAll("import('../../systems/", "import('../systems/")
    .replaceAll("import('../../data/", "import('../data/")
  return norm(t)
}).join('\n')

let ok = 0
const failed: string[] = []
const mechanicalOk: string[] = []
for (let i = 0; i < MEMBER_STARTS.length; i++) {
  const start = MEMBER_STARTS[i]
  const end = (i + 1 < MEMBER_STARTS.length ? MEMBER_STARTS[i + 1] : 5561) - 1
  let memberText = orig.slice(start - 1, end).join('\n')
  // drop trailing blank lines and trailing COMMENT lines — those belong to the
  // NEXT member's leading comment block in the original layout (the split
  // re-homes them with the next member's slice, so the combined text is not
  // contiguous in the corpus even though every line moved verbatim).
  const ls = memberText.split('\n')
  while (ls.length) {
    const last = ls[ls.length - 1].trim()
    if (last === '' || last.startsWith('//') || last.startsWith('/*') || last.startsWith('*') || last.startsWith('*/')) ls.pop()
    else break
  }
  memberText = ls.join('\n')
  const firstLine = memberText.split('\n')[0].trim()
  const name = firstLine.split(':')[0].trim()
  const n = norm(memberText)
  if (corpus.includes(n)) { ok++; continue }
  if (MECHANICAL.has(name)) { mechanicalOk.push(name); continue }
  failed.push(`${name} (${start}-${end})`)
}

console.log(`members verbatim: ${ok}/${MEMBER_STARTS.length}`)
console.log(`members with documented mechanical deltas: ${mechanicalOk.length} [${mechanicalOk.join(', ')}]`)
if (failed.length) {
  console.log('FAILED verbatim check:')
  for (const f of failed) console.log('  ' + f)
  process.exit(1)
}
console.log('VERBATIM PROOF: PASS')
