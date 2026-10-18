/** probe: does a socket connect THROUGH the gateway :81 and register presence? */
import { io } from 'socket.io-client'

const stamp = Date.now().toString(36).slice(-5)
const A = `gw_${stamp}`

async function reg() {
  const r = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: A, pin: '1357', contact: `${A}@lokoja.ng`, ageBand: 'adult' }),
  })
  return (await r.json()) as { token?: string }
}

const { token } = await reg()
console.log('token:', !!token)

const s = io('http://localhost:81/?XTransformPort=3003', {
  transports: ['websocket', 'polling'],
  reconnection: false,
  timeout: 6000,
  auth: token ? { token } : {},
})
s.on('connect', () => {
  console.log('CONNECTED via gateway, id:', s.id)
  s.emit('hello', { street: 'gateway-street', status: 'hustling' }, (r: unknown) => {
    console.log('hello ack:', JSON.stringify(r).slice(0, 200))
    setTimeout(async () => {
      const h = await (await fetch('http://localhost:3003/health')).json()
      console.log('wire health online:', h.online)
      s.disconnect()
      process.exit(0)
    }, 400)
  })
})
s.on('connect_error', (e) => {
  console.log('CONNECT ERROR:', String(e).slice(0, 200))
  process.exit(1)
})
setTimeout(() => {
  console.log('TIMEOUT — never connected')
  process.exit(1)
}, 8000)
