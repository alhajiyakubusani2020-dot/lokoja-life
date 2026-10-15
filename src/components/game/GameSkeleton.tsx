/**
 * LOKOJA LIFE — M16: THE SILK SKELETON
 * -------------------------------------
 * The branded loading skeleton for every lazy chunk: the app's own
 * cream-and-green dress, breathing blocks only — transform/opacity
 * animations (the device law: no layout thrash on weak phones).
 *
 * THE HONESTY LAW: a skeleton never lies about progress — it shows
 * the shape of the screen that is coming, nothing more.
 */

const breathe = (delay: string) => ({
  animation: `lko-breathe 1.6s ease-in-out ${delay} infinite`,
})

export function GameSkeleton({ label = 'Opening Lokoja…' }: { label?: string }) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#f5edd8]" aria-busy="true" role="status">
      {/* the header bar */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <div className="h-8 w-28 rounded-lg bg-[var(--lko-green-deep)] opacity-90" style={breathe('0s')} />
        <div className="h-8 w-8 rounded-full bg-[var(--lko-green-deep)] opacity-60" style={breathe('0.2s')} />
      </div>
      {/* the hero strip */}
      <div className="px-4">
        <div
          className="h-36 w-full rounded-2xl bg-gradient-to-br from-[#e7dcc0] to-[#ddd0ae]"
          style={breathe('0.1s')}
        />
        <div className="mt-3 h-4 w-3/5 rounded bg-[#e0d4b6]" style={breathe('0.3s')} />
        <div className="mt-2 h-4 w-2/5 rounded bg-[#e0d4b6]" style={breathe('0.5s')} />
      </div>
      {/* the tile rows — the shape of the dashboard to come */}
      <div className="mt-5 grid grid-cols-2 gap-3 px-4">
        {[0.15, 0.35, 0.25, 0.45].map((d, i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-[#e7dcc0]"
            style={breathe(`${d}s`)}
          />
        ))}
      </div>
      <p className="lko-display mt-auto pb-8 text-center text-sm text-[var(--lko-green-deep)] opacity-80">
        {label}
      </p>
      <style>{`@keyframes lko-breathe { 0%,100% { opacity: .45 } 50% { opacity: 1 } }`}</style>
    </div>
  )
}
