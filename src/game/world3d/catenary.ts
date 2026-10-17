/**
 * LOKOJA LIFE — W1: THE CATENARY LAW (pure, headless-safe)
 * --------------------------------------------------------
 * A hanging conductor under its own weight is a catenary, y = a·cosh(x/a)
 * — not a parabola. Given span length L and sag s, the parameter a solves
 *
 *     s = a·(cosh(L / (2a)) − 1)
 *
 * which is strictly decreasing in a, so 48 bisection steps pin it to
 * double precision with zero per-frame cost (module-scope per span).
 * dip(t) then measures the true drop from the chord:
 *
 *     dip(t) = a·cosh(L/(2a)) − a·cosh((t − 0.5)·L/a)
 *
 * — exactly 0 at both ends, exactly s at mid-span. Pure TypeScript: no
 * three.js, no React, no DOM, so bun law suites can verify the equation
 * itself (scripts/test-m23-w1.ts does).
 */

/** solve the catenary parameter a for span L and sag s (bisection) */
export function catenaryA(L: number, s: number): number {
  let lo = 0.05 * L
  let hi = 50 * L
  for (let i = 0; i < 48; i++) {
    const mid = (lo + hi) / 2
    const f = mid * (Math.cosh(L / (2 * mid)) - 1) - s
    if (f > 0) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

/** true catenary dip below the chord at parameter t ∈ [0, 1] */
export function catenaryDip(L: number, s: number, t: number): number {
  const a = catenaryA(L, s)
  return a * Math.cosh(L / (2 * a)) - a * Math.cosh(((t - 0.5) * L) / a)
}
