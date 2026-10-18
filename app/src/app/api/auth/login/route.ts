import { NextResponse } from "next/server";
import { authRequest, setSessionCookies } from "@/lib/auth-server";
import { validateCredentials } from "@/lib/auth-input";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Ugyldig forespørsel." }, { status: 400 }); }
  const error = validateCredentials(body.email, body.password);
  if (error) return NextResponse.json({ error }, { status: 400 });
  try {
    const upstream = await authRequest("/auth/v1/token?grant_type=password", {
      method: "POST", body: JSON.stringify({ email: String(body.email).trim(), password: body.password }),
    });
    if (!upstream.ok) return NextResponse.json({ error: "Innlogging mislyktes. Kontroller e-post, passord og e-postbekreftelse." }, { status: 401 });
    const session = await upstream.json();
    if (!session.access_token || !session.refresh_token) return NextResponse.json({ error: "Kunne ikke opprette økt." }, { status: 502 });
    const response = NextResponse.json({ ok: true });
    setSessionCookies(response, session);
    return response;
  } catch { return NextResponse.json({ error: "Innlogging er midlertidig utilgjengelig." }, { status: 503 }); }
}
