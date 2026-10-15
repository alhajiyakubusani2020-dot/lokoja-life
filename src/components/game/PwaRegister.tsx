'use client'

/**
 * LOKOJA LIFE — M16: THE SILK REGISTER
 * -------------------------------------
 * Mounts the service worker the polite way: after the page is
 * interactive, on idle, so the registration never competes with the
 * first paint (the 3-second law applies to the worker too).
 *
 * THE UPDATE LAW: when a new worker is waiting, we do NOT force a
 * hard reload mid-life — the new version takes the wheel on the next
 * boot (a game session is minutes, not hours; the strand sweep on
 * activate keeps every old cache honest).
 */

import { useEffect } from 'react'

type SilkyWindow = Window & {
  workbox?: unknown
  __lkoSwRegistered?: boolean
}

export function PwaRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return
    const w = window as SilkyWindow
    if (w.__lkoSwRegistered) return
    w.__lkoSwRegistered = true

    const register = () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
        // a refused worker is a silent downgrade to the normal web —
        // the game still runs; offline-first is a gift, not a gate
        w.__lkoSwRegistered = false
      })
    }

    // idle-register: the shell paints first, the worker joins after
    const idle = (window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
    }).requestIdleCallback
    if (typeof idle === 'function') {
      idle(register, { timeout: 4000 })
    } else {
      const t = window.setTimeout(register, 1500)
      return () => window.clearTimeout(t)
    }
  }, [])

  return null
}
