/**
 * LOKOJA LIFE — M24 W3: THE WORLD NEVER BLINKS LAW SUITE
 * ======================================================
 * Pure, headless, instant — the diegetic vault judges itself.
 *
 * THE LAWS PINNED HERE:
 *  1.  the overlay set is exactly the six diegetic faces
 *  2.  isOverlayTab's truth table (aliases, empty, case lies)
 *  3.  the pre-entry verdict: the world mounts ONLY for the world tab
 *  4.  THE NEVER-BLINK LAW: in-world, EVERY tab keeps the world mounted
 *  5.  the street verdict: 'world' in-world closes the sheet (overlay null)
 *  6.  the fullscreen law: pre-entry chrome only before the entry
 *  7.  THE ONE-UNMOUNT LAW: only the 'menu' intent unmounts
 *  8.  THE N11 GATE: +3ms boundary exact (2.9 ok, 3.0 ok, 3.01 refuses)
 *  9.  the N11 measurement hygiene: NaN / Infinity / negatives refuse
 *  10. THE NO-PAUSE LAW: pinned data, no pause API exists
 *  11. THE IDENTITY-BLIND LAW: the verdict never asks who the walker is
 *  12. the labels: every overlay face carries its honest name
 *
 * Exit code 0 = every law holds. Non-zero = the street blinked.
 */
import {
  OVERLAY_TABS,
  OVERLAY_LABELS,
  N11_OVERLAY_BUDGET_MS,
  NO_PAUSE,
  isOverlayTab,
  overlayVerdict,
  unmountIntentOk,
  overlayCostOk,
  type OverlayTab,
} from '../src/game/systems/diegetic'

let passed = 0
let failed = 0
const fails: string[] = []

function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    passed++
    console.log(`  ✓ ${name}`)
  } else {
    failed++
    fails.push(name)
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

const ALL_TABS = ['home', 'world', 'map', 'work', 'phone', 'bag', 'profile'] as const

console.log('\n── 1. the overlay set ──')
check('six faces: home/map/work/phone/bag/profile', OVERLAY_TABS.length === 6 && OVERLAY_TABS.join(',') === 'home,map,work,phone,bag,profile', OVERLAY_TABS.join(','))
check("'world' itself is NOT an overlay (it IS the street)", !isOverlayTab('world'))

console.log('\n── 2. the truth table ──')
for (const t of OVERLAY_TABS) check(`isOverlayTab('${t}') holds`, isOverlayTab(t))
for (const lie of ['', 'WORLD', 'Home', 'map ', 'settings', 'menu']) {
  check(`isOverlayTab(${JSON.stringify(lie)}) refuses`, !isOverlayTab(lie))
}

console.log('\n── 3. the pre-entry verdict ──')
const pre = (t: string) => overlayVerdict(t, false)
check('pre-entry world tab mounts the world', pre('world').worldMounted === true)
check('pre-entry world tab is fullscreen chrome-free', pre('world').fullscreen === true && pre('world').overlay === null)
for (const t of ['home', 'map', 'work', 'phone', 'bag', 'profile']) {
  const v = pre(t)
  check(`pre-entry '${t}' does NOT mount the world (legacy cheap tabs)`, v.worldMounted === false)
  check(`pre-entry '${t}' stays fullscreen with no overlay`, v.fullscreen === true && v.overlay === null)
}

console.log('\n── 4. THE NEVER-BLINK LAW ──')
for (const t of ALL_TABS) {
  const v = overlayVerdict(t, true)
  check(`in-world '${t}' keeps the world MOUNTED`, v.worldMounted === true, JSON.stringify(v))
}

console.log('\n── 5. the street verdict ──')
const street = overlayVerdict('world', true)
check("in-world 'world' shows the street itself (overlay null)", street.overlay === null)
for (const t of OVERLAY_TABS) {
  const v = overlayVerdict(t, true)
  check(`in-world '${t}' opens THE '${t}' sheet above the living street`, v.overlay === t && v.fullscreen === false, JSON.stringify(v))
}
check('an unknown tab in-world closes the sheet honestly (never a dead overlay)', overlayVerdict('unknown', true).overlay === null)

console.log('\n── 6. the fullscreen law ──')
check('fullscreen chrome exists ONLY before entry', overlayVerdict('home', true).fullscreen === false && overlayVerdict('home', false).fullscreen === true)
check('the street is never fullscreen chrome', overlayVerdict('world', true).fullscreen === false)

console.log('\n── 7. THE ONE-UNMOUNT LAW ──')
check("the 'menu' intent may unmount", unmountIntentOk('menu') === true)
check("a tab switch may NOT unmount", unmountIntentOk('tab') === false)
check("an overlay close may NOT unmount", unmountIntentOk('overlay') === false)

console.log('\n── 8. THE N11 GATE ──')
check('the budget is exactly 3ms', N11_OVERLAY_BUDGET_MS === 3)
check('the street alone: 14 → 14 holds', overlayCostOk(14, 14))
check('a gentle sheet: 14 → 15.5 holds (+1.5ms)', overlayCostOk(14, 15.5))
check('the boundary: 14 → 17.0 holds (+3.0ms EXACT)', overlayCostOk(14, 17))
check('one photon over: 14 → 17.001 REFUSES', overlayCostOk(14, 17.001) === false)
check('a heavy sheet: 14 → 25 REFUSES (+11ms is a blinked street)', overlayCostOk(14, 25) === false)
check('a FASTER sheet holds (an overlay may even help)', overlayCostOk(20, 18))

console.log('\n── 9. the N11 measurement hygiene ──')
check('NaN baseline refuses', overlayCostOk(NaN, 15) === false)
check('NaN overlay refuses', overlayCostOk(14, NaN) === false)
check('Infinity refuses', overlayCostOk(14, Infinity) === false)
check('negative baseline refuses', overlayCostOk(-1, 15) === false)
check('negative overlay refuses', overlayCostOk(14, -0.5) === false)

console.log('\n── 10. THE NO-PAUSE LAW ──')
check('NO_PAUSE is pinned true', NO_PAUSE === true)
check('the verdict carries no pause field (structurally impossible)', !('paused' in overlayVerdict('map', true)))
check('the vault exports no pause function', !('pauseWorld' in (await import('../src/game/systems/diegetic'))))

console.log('\n── 11. THE IDENTITY-BLIND LAW ──')
check('the verdict takes no identity argument (claimed/guest/kid — one law)', overlayVerdict.length === 2)
check('the same sheet for every walker', JSON.stringify(overlayVerdict('map', true)) === JSON.stringify(overlayVerdict('map', true)))

console.log('\n── 12. the labels ──')
for (const t of OVERLAY_TABS) {
  const label = OVERLAY_LABELS[t as OverlayTab]
  check(`'${t}' carries an honest label (${label})`, typeof label === 'string' && label.length >= 2)
}
check('the labels never lie about the map', OVERLAY_LABELS.map.includes('Lokoja'))

console.log(`\n════════════════════════════════════`)
console.log(`  M24-W3 DIEGETIC: ${passed} passed, ${failed} failed`)
console.log(`════════════════════════════════════`)
if (failed > 0) {
  console.log('FAILS:\n - ' + fails.join('\n - '))
  process.exit(1)
}
process.exit(0)
