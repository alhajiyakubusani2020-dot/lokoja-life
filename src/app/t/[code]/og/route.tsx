import { ImageResponse } from 'next/og'
import { decodeTeleport, postcardFor } from '@/game/systems/teleport'

/**
 * M15 — THE OG CARD IMAGE (/t/[code]/og)
 * ----------------------------------------
 * The 1200×630 card the link previews render — it looks like a
 * screenshot of the moment: green Lokoja sky, the sender's headline,
 * the street + day + level chips, the signed-code strip. Rendered
 * server-side from the SAME pure decoder the game verifies with —
 * a broken code renders the honest broken card.
 */

export const contentType = 'image/png'

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const dec = decodeTeleport(code)
  const nairaSafe = (s: string): string => s.replace(/₦/g, 'NGN ')

  if (!dec.ok) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b3d23', color: '#fff8e6',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ fontSize: 72, display: 'flex' }}>📩</div>
          <div style={{ fontSize: 48, fontWeight: 700, marginTop: 24, display: 'flex' }}>A broken postcard</div>
          <div style={{ fontSize: 26, opacity: 0.75, marginTop: 12, display: 'flex' }}>
            The code no survive the road — get a fresh one inside
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 40, letterSpacing: 4, opacity: 0.6, display: 'flex' }}>
            LOKOJA LIFE
          </div>
        </div>
      ),
      { width: 1200, height: 630 },
    )
  }

  const card = postcardFor(dec.moment)
  const chips = card.chips
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          backgroundColor: '#0b3d23', color: '#ffffff', fontFamily: 'sans-serif', padding: 56,
        }}
      >
        {/* sky strip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 6, opacity: 0.7, display: 'flex' }}>
            LOKOJA LIFE · SIGNED POSTCARD
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, opacity: 0.7, display: 'flex' }}>Day {dec.moment.day}</div>
        </div>

        {/* the headline — reads like a screenshot of the moment */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 30, fontWeight: 600, opacity: 0.85, display: 'flex' }}>
            {nairaSafe(card.body).slice(0, 90)}
          </div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.1, marginTop: 18, display: 'flex' }}>
            {nairaSafe(card.title)}
          </div>
        </div>

        {/* the chips */}
        <div style={{ display: 'flex', gap: 16 }}>
          {chips.map((c) => (
            <div
              key={c.label}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 18, padding: '14px 26px',
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2, opacity: 0.65, display: 'flex' }}>
                {c.label.toUpperCase()}
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, marginTop: 4, display: 'flex' }}>
                {nairaSafe(c.value).slice(0, 18)}
              </div>
            </div>
          ))}
        </div>

        {/* the code strip */}
        <div style={{ marginTop: 28, fontSize: 16, fontFamily: 'monospace', opacity: 0.5, display: 'flex' }}>
          {code.slice(0, 72)}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
