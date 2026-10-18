/**
 * LOKOJA LIFE — M24 W3: THE WORLD NEVER BLINKS (the diegetic law vault)
 * =====================================================================
 * The plan's W3 row: "The diegetic law — phone, map, dashboard become
 * in-world overlays; the 3D city never unmounts after entry."
 *
 * The M24-UI wave already carried the PHONE into the world
 * (WorldPhoneLayer: needs rail + FAB + calls above the living street).
 * This vault pins the REST of the law as pure, headless-testable code:
 *
 *   THE NEVER-BLINK LAW — once a walker ENTERS the world, the world
 *   stays mounted until they return to the Main menu. Every other tab
 *   (home / map / work / bag / profile / phone) opens as an OVERLAY
 *   SHEET above the living street. The street never blinks for chrome.
 *
 *   THE ONE-UNMOUNT LAW — the only lawful unmount of the living world
 *   is the 'menu' intent (Main menu, auto-saves). Not a tab switch,
 *   not a deep-link, not an overlay close — only the menu.
 *
 *   THE N11 GATE — an open overlay may cost at most +3 ms per frame
 *   (the plan's N11: "overlay <= +3ms/frame"). Measured on the REAL
 *   rAF deltas by the witness; the pure verdict here is the law.
 *
 *   THE NO-PAUSE LAW — an overlay NEVER pauses the street. The clock
 *   advances, needs decay, the wire keeps talking: the city keeps
 *   living behind the sheet, exactly like the real Lokoja keeps
 *   living while you read a letter. (Pinned as data: there is no
 *   pause API anywhere in this vault — structurally impossible.)
 *
 *   THE IDENTITY-BLIND LAW — the overlay law is for EVERY walker:
 *   claimed or guest, kid or senator. The verdict never asks who you
 *   are; the walls that DO ask live at the doors (M13/M17 law vaults).
 *
 * Zero imports, zero DOM, zero React — the suite runs it headless and
 * the Dashboard runs the SAME verdict (no copies, no drift).
 */

/** The tabs that open as overlay sheets above the living street. */
export type OverlayTab = 'home' | 'map' | 'work' | 'phone' | 'bag' | 'profile'

export const OVERLAY_TABS: readonly OverlayTab[] = [
  'home',
  'map',
  'work',
  'phone',
  'bag',
  'profile',
]

export function isOverlayTab(t: string): t is OverlayTab {
  return (OVERLAY_TABS as readonly string[]).includes(t)
}

/** The honest label each sheet carries in its header. */
export const OVERLAY_LABELS: Record<OverlayTab, string> = {
  home: 'Your life',
  map: 'The map of Lokoja',
  work: 'Work & hustle',
  phone: 'Your phone',
  bag: 'Your bag',
  profile: 'You',
}

export interface OverlayVerdict {
  /** THE NEVER-BLINK LAW: true for EVERY tab once the walker is in-world. */
  worldMounted: boolean
  /** Pre-entry chrome (header + BottomNav) — the legacy fullscreen tabs. */
  fullscreen: boolean
  /** The sheet above the living street; null = show the street itself. */
  overlay: OverlayTab | null
}

/**
 * THE VERDICT — one function, both worlds:
 *  - before entry, the world mounts ONLY for the world tab (the legacy
 *    behaviour the SILK gates know: a cheap dashboard first, the heavy
 *    3D on demand);
 *  - after entry, the world mounts for EVERY tab — the sheet is the
 *    only thing that changes.
 */
export function overlayVerdict(next: string, inWorld: boolean): OverlayVerdict {
  if (!inWorld) {
    return { worldMounted: next === 'world', fullscreen: true, overlay: null }
  }
  return {
    worldMounted: true,
    fullscreen: false,
    overlay: next === 'world' ? null : isOverlayTab(next) ? next : null,
  }
}

/** What asked the world to unmount? */
export type UnmountIntent = 'menu' | 'overlay' | 'tab'

/**
 * THE ONE-UNMOUNT LAW — only the Main menu may unmount the living
 * world. A tab switch ('tab') and an overlay close ('overlay') never
 * do: the street stays.
 */
export function unmountIntentOk(intent: UnmountIntent): boolean {
  return intent === 'menu'
}

/** N11 — the overlay gate, from the plan's gate table. */
export const N11_OVERLAY_BUDGET_MS = 3

/**
 * THE N11 VERDICT — the overlay's frame cost may exceed the street's
 * own baseline by at most +3 ms. Non-finite or negative inputs refuse
 * (a measurement that lied is a measurement that refuses).
 */
export function overlayCostOk(baselineMs: number, overlayMs: number): boolean {
  if (!Number.isFinite(baselineMs) || !Number.isFinite(overlayMs)) return false
  if (baselineMs < 0 || overlayMs < 0) return false
  return overlayMs - baselineMs <= N11_OVERLAY_BUDGET_MS
}

/**
 * THE NO-PAUSE LAW, pinned as data. There is no pause flag, no pause
 * function, no "resume" anywhere in this vault — an overlay cannot
 * pause the street because the concept does not exist here.
 */
export const NO_PAUSE = true as const
