/**
 * M20 — THE FEATURE FLAGS (the ops switches)
 * -------------------------------------------
 * Device-level ops prefs — they live OUTSIDE the save on their own
 * storage key (the fortress rule: the ops books live beside the life,
 * not inside it). Every M20 system reads its flag through here, so a
 * bad rollout can be darkened from one place without a rebuild.
 *
 * THE DEFAULT-DARK LAW: anything that costs the player anything
 * (telemetry) defaults OFF. Anything that is pure spectacle the
 * player already owns (the crowd sim) defaults ON but is one toggle
 * from dark.
 *
 * THE DEFENSIVE STORAGE LAW: storage is probed, never assumed —
 * private-mode browsers and Bun both read the honest defaults.
 */

export type FlagKey = 'crowdSim' | 'workerSim' | 'telemetryAsk' | 'musicDefault'

export const FLAG_DEFAULTS: Record<FlagKey, boolean> = {
  crowdSim: true,
  workerSim: true,
  /** has the player been offered the telemetry choice (the ask itself, not the answer) */
  telemetryAsk: false,
  musicDefault: false,
}

const FLAGS_KEY = 'lokoja-life:flags'
const MANIFEST_KEY = 'lko:sw-manifest'
const CAP_MANIFEST = 5

/** Probe storage the way save.ts does — a refused store reads defaults. */
function flagsStore(): Storage | null {
  try {
    const probe = '__lko_flags_probe__'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return window.localStorage
  } catch {
    return null
  }
}

export function readFlags(): Record<FlagKey, boolean> {
  const out = { ...FLAG_DEFAULTS }
  const store = flagsStore()
  if (!store) return out
  try {
    const raw = store.getItem(FLAGS_KEY)
    if (!raw) return out
    const parsed = JSON.parse(raw) as Partial<Record<FlagKey, unknown>>
    for (const k of Object.keys(FLAG_DEFAULTS) as FlagKey[]) {
      const v = parsed[k]
      if (typeof v === 'boolean') out[k] = v
    }
  } catch {
    /* a torn flags blob is just defaults — the game never gates on garbage */
  }
  return out
}

export function setFlag(key: FlagKey, value: boolean): Record<FlagKey, boolean> {
  const next = readFlags()
  next[key] = value
  const store = flagsStore()
  if (store) {
    try {
      store.setItem(FLAGS_KEY, JSON.stringify(next))
    } catch {
      /* storage full — the flags stay session-honest, the save never blocks */
    }
  }
  return next
}

/* --------------------------- the deploy manifest ---------------------------- */

/**
 * THE LAST-GOOD BOOK: every boot that sees a deployed shell version
 * records it here (PwaRegister writes; the dashboard reads). The
 * one-command rollback (scripts/ops-rollback.sh) rebuilds the PREVIOUS
 * entry — the book is the honest memory of what shipped, in order.
 */
export interface DeployRow {
  version: string
  at: number
}

export function recordDeploy(version: string): DeployRow[] {
  const v = String(version ?? '').slice(0, 24)
  if (!v) return readManifest()
  const rows = readManifest()
  if (rows[0]?.version === v) return rows // same deploy, no re-record
  const next = [{ version: v, at: Date.now() }, ...rows.filter((r) => r.version !== v)].slice(0, CAP_MANIFEST)
  const store = flagsStore()
  if (store) {
    try {
      store.setItem(MANIFEST_KEY, JSON.stringify(next))
    } catch {
      /* the manifest is a gift, never a gate */
    }
  }
  return next
}

export function readManifest(): DeployRow[] {
  const store = flagsStore()
  if (!store) return []
  try {
    const raw = store.getItem(MANIFEST_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((r): r is DeployRow => !!r && typeof (r as DeployRow).version === 'string')
      .slice(0, CAP_MANIFEST)
  } catch {
    return []
  }
}

/** The previous-good version the rollback command would rebuild. */
export function previousDeploy(): DeployRow | null {
  const rows = readManifest()
  return rows.length >= 2 ? rows[1] : null
}
