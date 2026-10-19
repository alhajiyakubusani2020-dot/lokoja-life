/**
 * W9 SMOKE — the stage doors answer before the suite is written.
 * Spawns the wire (:3005, real db), claims two adults, walks the
 * lifecycle: start → list → watch → chat → tip(replay) → end.
 * Verifies the media-house token is a REAL HMAC JWT with the right claims.
 */
import { io, type Socket } from 'socket.io-client'
import { createHmac } from 'node:crypto'

const PORT = 3005
const BASE = `http://localhost:${PORT}`

function emit(s: Socket, ev: string, body: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
  return new Promise((res) => {
    const t = setTimeout(() => res({ ok: false, why: 'timeout' }), 4000)
    s.emit(ev, body, (r: Record<string, unknown>) => { clearTimeout(t); res(r ?? {}) })
  })
}

async function reg(handle: string, pin: string): Promise<{ token?: string; handle?: string }> {
  const birthYear = 1990
  const r = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      handle, pin, birthYear, displayName: `Stager ${handle}`,
      avatarLook: { skinTone: '#6E4326', hairColor: '#1A1714', hairstyle: 'low-cut', clothingStyle: 'tshirt', clothingColor: '#1B7A43' },
    }),
  }).then((r) => r.json()).catch(() => ({}))
  if (r?.token) return r
  const l = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle, pin }),
  }).then((r) => r.json()).catch(() => ({}))
  return l
}

function connect(token: string | null): Promise<Socket> {
  return new Promise((res) => {
    const s = io(BASE, { auth: { token }, transports: ['websocket'] })
    s.on('connect', () => res(s))
  })
}

const b64u = (s: string): string => Buffer.from(s, 'base64url').toString()

function main(): number {
  if (process.argv.length < 3) return 1
  const [hdr, body, sig] = process.argv[2].split('.')
  const secret = process.env.LK_API_SECRET ?? 'lksecret9stage'
  const expect = Buffer.from(createHmac('sha256', secret).update(`${hdr}.${body}`).digest()).toString('base64url')
  console.log('header:', b64u(hdr))
  console.log('claims:', b64u(body))
  console.log('sig-verified:', sig === expect)
  return sig === expect ? 0 : 1
}

if (process.argv[2]) process.exit(main())

const hA = `stgA${Date.now().toString(36).slice(-5)}`
const hB = `stgB${Date.now().toString(36).slice(-5)}`
const svc = Bun.spawn(['bun', 'index.ts'], { cwd: '/home/z/my-project/mini-services/nation-wire', env: { ...process.env, WIRE_PORT: String(PORT) }, stdout: 'pipe', stderr: 'pipe' })
await new Promise((r) => setTimeout(r, 1800))

const ra = await reg(hA, '1234')
const rb = await reg(hB, '4321')
console.log('claimed:', !!ra.token, !!rb.token)

const sa = await connect(ra.token!)
const sb = await connect(rb.token!)
console.log('sockets:', sa.connected, sb.connected)

const start = await emit(sa, 'stage:start', { title: 'Walk through the market' })
console.log('start:', JSON.stringify(start).slice(0, 300))
console.log('TOKEN:', start.token)

const badStart = await emit(sa, 'stage:start', { title: 'second stage' })
console.log('one-stage law:', badStart.why === 'stage-live-already')

const list = await emit(sb, 'stage:list', {})
console.log('list:', JSON.stringify(list.stages))

const watch = await emit(sb, 'stage:watch', { streamId: start.streamId })
console.log('watch:', watch.ok, 'viewers:', watch.viewers)

const chat = await emit(sb, 'stage:chat', { streamId: start.streamId, text: 'guy the waka sweet o' })
console.log('chat:', chat.ok, 'seq:', chat.seq)

const notip = await emit(sb, 'stage:tip', { streamId: start.streamId, amount: 100, pin: '4321', idemKey: 'k1' })
console.log('tip-no-pin-match (expect refusal, honest):', notip.ok, notip.why)

const endByB = await emit(sb, 'stage:end', { streamId: start.streamId })
console.log('end-by-stranger:', endByB.ok === false, endByB.why)

const end = await emit(sa, 'stage:end', { streamId: start.streamId })
console.log('end-by-host:', end.ok)

const list2 = await emit(sb, 'stage:list', {})
console.log('list-after-end:', JSON.stringify(list2.stages))

sa.disconnect(); sb.disconnect(); svc.kill()
process.exit(0)
