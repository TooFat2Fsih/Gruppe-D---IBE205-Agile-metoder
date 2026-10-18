import { NextRequest, NextResponse } from "next/server";
import { authenticatedUser } from "@/lib/checkin-auth";
import { authRequest } from "@/lib/auth-server";
import { duplicateFeedPost, FEED_ACTIVITY_TEXT, validCheckInId } from "@/lib/feed-input";

export async function GET(request: NextRequest) {
  try {
    const user = await authenticatedUser(request);
    if (!user) return NextResponse.json({ error: "Logg inn for å se aktivitetsfeeden." }, { status: 401 });
    const query = new URLSearchParams({ select: "id,user_id,text,created_at", order: "created_at.desc", limit: "30" });
    const response = await authRequest(`/rest/v1/posts?${query}`, {}, user.token);
    if (!response.ok) return NextResponse.json({ error: "Kunne ikke hente feed." }, { status: 502 });
    return NextResponse.json({ items: await response.json() });
  } catch { return NextResponse.json({ error: "Feeden er midlertidig utilgjengelig." }, { status: 503 }); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticatedUser(request);
    if (!user) return NextResponse.json({ error: "Du må logge inn." }, { status: 401 });
    let body: { checkInId?: unknown };
    try { body = await request.json(); } catch { return NextResponse.json({ error: "Ugyldig forespørsel." }, { status: 400 }); }
    if (!validCheckInId(body.checkInId)) return NextResponse.json({ error: "Ugyldig innsjekking." }, { status: 400 });
    const response = await authRequest("/rest/v1/posts", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ user_id: user.id, check_in_id: body.checkInId, text: FEED_ACTIVITY_TEXT }),
    }, user.token);
    if (!response.ok) {
      const failure: { code?: string } = await response.json().catch(() => ({}));
      if (duplicateFeedPost(failure.code)) return NextResponse.json({ error: "Denne innsjekkingen er allerede delt." }, { status: 409 });
      return NextResponse.json({ error: "Kunne ikke dele innsjekkingen. Du kan bare dele egne innsjekkinger." }, { status: 403 });
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch { return NextResponse.json({ error: "Deling er midlertidig utilgjengelig." }, { status: 503 }); }
}
