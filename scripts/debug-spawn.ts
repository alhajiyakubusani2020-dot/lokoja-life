const svc = Bun.spawn(['bun', 'index.ts'], {
  cwd: '/home/z/my-project/mini-services/nation-wire',
  env: { ...process.env, WIRE_PORT: '3004' },
  stdout: 'pipe',
  stderr: 'pipe',
})
console.log('spawned pid', svc.pid)
const t = setTimeout(() => {
  console.log('child still alive?', svc.signalCode)
  svc.kill()
  process.exit(0)
}, 3000)
for (let i = 0; i < 20; i++) {
  try {
    const r = await fetch('http://localhost:3004/health')
    const j = (await r.json()) as { ok: boolean }
    console.log('HEALTH OK', j)
    clearTimeout(t)
    svc.kill()
    process.exit(0)
  } catch (e) {
    console.log(`poll ${i} failed:`, (e as Error).message?.slice(0, 60))
  }
  await new Promise((r) => setTimeout(r, 150))
}
clearTimeout(t)
console.log('NEVER CAME UP; signalCode:', svc.signalCode)
try {
  console.log('stdout:', await new Response(svc.stdout).text())
  console.log('stderr:', await new Response(svc.stderr).text())
} catch { /* noop */ }
svc.kill()

export {}
