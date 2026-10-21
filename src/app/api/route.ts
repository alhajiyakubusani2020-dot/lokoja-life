import { NextResponse } from "next/server";

// The root door is a health ping only — auth-free on purpose (monitors may
// hit it); it carries no game truth. The nation's doors live under /api/*.
export async function GET() {
  return NextResponse.json({ ok: true, service: "lokoja-life", time: new Date().toISOString() });
}