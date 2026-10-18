/** quick probe: voice:join raw acks on :3006 */
import { io, type Socket } from 'socket.io-client'

const WIRE = 'http://localhost:3006'

function connect(token: string | null): Promise<Socket> {
  return new Promise((resolve, reject) => {
    const s: Socket = io(WIRE, { transports: ['websocket'], reconnection: false, timeout: 4000, auth: token ? { token } : {} })
    s.on('connect', () => resolve(s))
    s.on('connect_error', reject)
    setTimeout(() => reject(new Error('timeout')), 5000)
  })
}

function emit(s: Socket, ev: string, body: unknown): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve({ ackTimeout: true }), 3000)
    s.emit(ev, body, (r: Record<string, unknown>) => { clearTimeout(t); resolve(r ?? {}) })
  })
}

const stamp = Date.now().toString(36).slice(-6)
const A = `probe_a_${stamp}`
const B = `probe_b_${stamp}`

async function reg(handle: string) {
  const r = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle, pin: '1234', contact: `${handle}@lokoja.ng`, ageBand: 'adult' }),
  })
  return (await r.json()) as { token?: string }
}

const svc = Bun.spawn(['bun', 'index.ts'], { cwd: '/home/z/my-project/mini-services/nation-wire', env: { ...process.env, WIRE_PORT: '3006' }, stdout: 'inherit', stderr: 'inherit' })
await new Promise((r) => setTimeout(r, 1500))

const ta = (await reg(A)).token!
const tb = (await reg(B)).token!
const sa = await connect(ta)
const sb = await connect(tb)
console.log('hello A:', await emit(sa, 'hello', { street: 'patti' }))
console.log('hello B:', await emit(sb, 'hello', { street: 'patti' }))
console.log('voice:join A:', await emit(sa, 'voice:join', {}))
console.log('voice:join B:', await emit(sb, 'voice:join', {}))
console.log('pv:offer A→B:', await emit(sa, 'pv:offer', { to: B, sdp: 'v=0\r\nx=1\r\n' }))
sb.on('wire:pv', (p: unknown) => console.log('B got wire:pv:', JSON.stringify(p)))
sb.on('wire:voice', (p: unknown) => console.log('B got wire:voice:', JSON.stringify(p)))
sa.on('wire:voice', (p: unknown) => console.log('A got wire:voice:', JSON.stringify(p)))
await new Promise((r) => setTimeout(r, 800))
console.log('voice:leave A:', await emit(sa, 'voice:leave', {}))
await new Promise((r) => setTimeout(r, 400))
sa.disconnect(); sb.disconnect(); svc.kill()
process.exit(0)
