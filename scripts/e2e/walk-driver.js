/** E2E driver: walk the player to the classroom door via the test hook (bang-bang nav) */
window.__walkTo = async function(target, opts = {}) {
  const { timeout = 30000, reach = 2.2 } = opts
  const t0 = Date.now()
  let bestDir = null
  let bestDist = Infinity
  while (Date.now() - t0 < timeout) {
    const p = window.__lkl.pos()
    const dx = target.x - p.x
    const dz = target.z - p.z
    const dist = Math.hypot(dx, dz)
    if (dist < reach) {
      window.__lkl.stick(0, 0)
      return { ok: true, dist, pos: p }
    }
    // try the 8 stick directions, keep the one that shrinks the distance
    if (bestDir === null) {
      const cands = []
      for (let a = 0; a < 8; a++) {
        const ang = (a / 8) * Math.PI * 2
        cands.push([Math.sin(ang), -Math.cos(ang), ang]) // stick x,y pairs
      }
      // probe each briefly
      let bd = Infinity
      let bc = null
      const p0 = window.__lkl.pos()
      for (const [sx, sy] of cands) {
        window.__lkl.stick(sx, sy)
        await new Promise((r) => setTimeout(r, 420))
        const p1 = window.__lkl.pos()
        const d1 = Math.hypot(target.x - p1.x, target.z - p1.z)
        const d0 = Math.hypot(target.x - p0.x, target.z - p0.z)
        if (d1 < bd) {
          bd = d1
          bc = [sx, sy]
        }
        if (d1 < reach) break
      }
      bestDir = bc
      bestDist = bd
    }
    window.__lkl.stick(bestDir[0], bestDir[1])
    await new Promise((r) => setTimeout(r, 700))
    const p2 = window.__lkl.pos()
    const d2 = Math.hypot(target.x - p2.x, target.z - p2.z)
    if (d2 < reach) {
      window.__lkl.stick(0, 0)
      return { ok: true, dist: d2, pos: p2 }
    }
    if (d2 > bestDist + 0.5) bestDir = null // lost the way — re-probe
    else bestDist = Math.min(bestDist, d2)
  }
  window.__lkl.stick(0, 0)
  return { ok: false }
}