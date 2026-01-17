import { NextResponse, type NextRequest } from 'next/server'

// Enkel in-memory rate limit (funkar ok på Vercel men är inte “perfekt” över alla instanser)
// Vill du ha robust: Upstash Redis. Men detta stoppar mycket skräp direkt.
const hits = new Map<string, { count: number; resetAt: number }>()
function rateLimit(ip: string, limit = 10, windowMs = 60_000) {
  const now = Date.now()
  const entry = hits.get(ip)
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + windowMs })
    return { ok: true }
  }
  entry.count += 1
  if (entry.count > limit) return { ok: false }
  return { ok: true }
}

type ClientPayload = {
  form: string
  submissionData: Array<{ field: string; value: unknown }>
  // bot-skydd
  hp?: string // honeypot
  ts?: number // timestamp när form renderades
  // (valfritt) turnstileToken?: string
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  // Rate limit
  const rl = rateLimit(ip)
  if (!rl.ok) {
    return NextResponse.json({ message: 'Too many requests' }, { status: 429 })
  }

  const body = (await req.json()) as ClientPayload

  // Honeypot: om ifylld => bot
  if (typeof body.hp === 'string' && body.hp.trim().length > 0) {
    // “Tyst” OK för att inte ge signal till botar
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  // Timing: blocka super-snabba submits (t.ex. < 2.5s)
  if (typeof body.ts === 'number') {
    const elapsed = Date.now() - body.ts
    if (elapsed < 2500) {
      return NextResponse.json({ message: 'Invalid submission' }, { status: 400 })
    }
  }

  // Valfritt: blocka om för många länkar i meddelandet etc.
  // const msg = String(body.submissionData.find(x => x.field === 'message')?.value ?? '')
  // if ((msg.match(/https?:\/\//g) ?? []).length > 2) { ... }

  // Skicka vidare till Payload
  const payloadURL = process.env.PAYLOAD_PUBLIC_SERVER_URL ?? process.env.NEXT_PUBLIC_SITE_URL
  if (!payloadURL) {
    return NextResponse.json({ message: 'Server misconfigured' }, { status: 500 })
  }

  const forward = await fetch(`${payloadURL}/api/form-submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Viktigt: skicka bara det Payload förväntar sig
    body: JSON.stringify({
      form: body.form,
      submissionData: body.submissionData,
    }),
  })

  const res = await forward.json().catch(() => ({}))
  return NextResponse.json(res, { status: forward.status })
}
