import type { Metadata } from 'next'
import { decodeTeleport, postcardFor } from '@/game/systems/teleport'

/**
 * M15 — THE POSTCARD PAGE (/t/[code])
 * ------------------------------------
 * A signed teleport code gets its own page whose OG cards look like a
 * screenshot of the moment: the sender's name, the day, the street,
 * the ghost walk. WhatsApp/X/Telegram read these meta tags when the
 * link is pasted — the awareness war starts at the link preview.
 * A broken code gets the honest card — never a fake moment.
 */

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params
  const dec = decodeTeleport(code)
  if (!dec.ok) {
    return {
      title: 'A broken postcard — Lokoja Life',
      description: 'This teleport code no survive the road. Open the game and collect a fresh one.',
    }
  }
  const card = postcardFor(dec.moment)
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  return {
    title: `${card.title} — Lokoja Life`,
    description: card.body,
    openGraph: {
      title: card.title,
      description: card.body,
      siteName: 'Lokoja Life',
      type: 'website',
      images: [{ url: `${base}/t/${encodeURIComponent(code)}/og`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: card.title,
      description: card.body,
    },
  }
}

export default async function TeleportPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const dec = decodeTeleport(code)
  if (!dec.ok) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#0b3d23] p-6">
        <div className="w-full max-w-sm rounded-3xl bg-[#fff8e6] p-6 text-center shadow-2xl">
          <p className="text-4xl" aria-hidden>📩</p>
          <h1 className="lko-display mt-3 text-xl text-[#4a3200]">This postcard don break</h1>
          <p className="mt-2 text-sm font-semibold text-[#6b5416]">
            The code cut off for road (or somebody don edit am). Open the game — collect a fresh postcard from the City Pulse.
          </p>
          <a
            href="/"
            className="lko-press mt-5 inline-block rounded-xl bg-[#146b3a] px-5 py-2.5 text-sm font-extrabold text-white"
          >
            Open Lokoja Life
          </a>
        </div>
      </main>
    )
  }
  const card = postcardFor(dec.moment)
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#0b3d23] p-6">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-[#f7f4ec] shadow-2xl" data-testid="postcard-page">
        <div className="bg-gradient-to-b from-[#146b3a] to-[#0d4d2a] p-5 text-white">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/60">
            Lokoja Life · signed postcard
          </p>
          <h1 className="lko-display mt-1 text-2xl leading-tight">{card.title}</h1>
        </div>
        <div className="p-5">
          <p className="text-sm font-semibold text-[#3f4a42]">{card.body}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {card.chips.map((c) => (
              <div key={c.label} className="rounded-xl bg-white p-2.5 text-center shadow-sm">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#6b7a70]">{c.label}</p>
                <p className="lko-num text-sm font-extrabold text-[#146b3a]">{c.value}</p>
              </div>
            ))}
          </div>
          <a
            href={`/?t=${encodeURIComponent(code)}`}
            data-testid="postcard-arrive"
            className="lko-press mt-5 block rounded-xl bg-[#146b3a] px-5 py-3 text-center text-sm font-extrabold text-white"
          >
            Enter Lokoja at this moment →
          </a>
          <p className="mt-3 text-center text-[10px] font-semibold text-[#6b7a70]">
            The postcard lands you on {card.chips[1]?.value ?? 'the street'} — no fare, no download, no account to start.
          </p>
        </div>
      </div>
    </main>
  )
}
