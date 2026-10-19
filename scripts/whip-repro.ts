/**
 * WHIP REPRO — the minimal in-browser WHIP publish against the /rt chain,
 * reading the RESPONSE BODY of the refusal. The stagenet flow, nothing else.
 */
import { chromium } from 'playwright'
import { createHmac } from 'node:crypto'

const SECRET = process.env.LK_API_SECRET ?? 'lkstage9loopback9secret9keys9w9x9'
const b64u = (b: Buffer | string): string => Buffer.from(b).toString('base64url')
const now = Math.floor(Date.now() / 1000)
const header = b64u(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
const body = b64u(JSON.stringify({ iss: 'devkey', sub: 'repro', exp: now + 3600, video: { room: 'stg-repro1', roomJoin: true, canPublish: true, canSubscribe: true, canPublishData: false, hidden: false, recorder: false } }))
const sig = b64u(createHmac('sha256', SECRET).update(`${header}.${body}`).digest())
const TOKEN = `${header}.${body}.${sig}`

const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
const page = await browser.newPage()
await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 30_000 })

const out = await page.evaluate(async (token: string) => {
  const c = document.createElement('canvas')
  c.width = 640
  c.height = 360
  const ctx = c.getContext('2d')
  if (ctx) { ctx.fillStyle = '#1B7A43'; ctx.fillRect(0, 0, 640, 360); ctx.fillStyle = '#fff'; ctx.font = '40px sans-serif'; ctx.fillText('REPRO', 260, 190) }
  const st = c.captureStream(0)
  const track = st.getVideoTracks()[0]
  const settings = track.getSettings?.() ?? {}
  const pc = new RTCPeerConnection({ iceServers: [] })
  pc.addTrack(track, st)
  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)
  await new Promise<void>((res) => {
    if (pc.iceGatheringState === 'complete') return res()
    const t = setTimeout(res, 1500)
    pc.addEventListener('icegatheringstatechange', () => { if (pc.iceGatheringState === 'complete') { clearTimeout(t); res() } })
  })
  const target = new URLSearchParams(location.search).get('t') ?? '/rt/whip/stg-repro1'
  const r = await fetch(target, {
    method: 'POST',
    headers: { 'Content-Type': 'application/sdp', Authorization: `Bearer ${token}` },
    body: pc.localDescription!.sdp!,
  })
  const bodyText = await r.text()
  const mLines = (pc.localDescription!.sdp ?? '').split('\n').filter((l) => l.startsWith('m=')).join(' | ')
  return { status: r.status, body: bodyText.slice(0, 500), settings: JSON.stringify(settings), mLines }
}, TOKEN)

console.log(JSON.stringify(out, null, 2))
await browser.close()
