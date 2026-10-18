import { NextResponse } from "next/server";
import { authRequest, setSessionCookies } from "@/lib/auth-server";
import { safeDisplayName, validateCredentials } from "@/lib/auth-input";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Ugyldig forespørsel." }, { status: 400 }); }
  const error = validateCredentials(body.email, body.password);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const email = String(body.email).trim();
  try {
    const upstream = await authRequest("/auth/v1/signup", {
      method: "POST",
      body: JSON.stringify({ email, password: body.password, data: { display_name: safeDisplayName(body.name, email) } }),
    });
    if (!upstream.ok) return NextResponse.json({ error: "Kunne ikke registrere bruker. Prøv en annen e-postadresse." }, { status: 400 });
    const session = await upstream.json();
    if (session.access_token && session.refresh_token) {
      const response = NextResponse.json({ ok: true, confirmationRequired: false });
      setSessionCookies(response, session);
      return response;
    }
    return NextResponse.json({ ok: true, confirmationRequired: true });
  } catch { return NextResponse.json({ error: "Registrering er midlertidig utilgjengelig." }, { status: 503 }); }
}
