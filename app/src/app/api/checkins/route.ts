import { NextRequest, NextResponse } from "next/server";
import { authRequest } from "@/lib/auth-server";
import { authenticatedUser } from "@/lib/checkin-auth";
import { isDuplicateCheckIn, validMatchId } from "@/lib/checkin-input";

export async function GET(request: NextRequest) {
  try {
    const user = await authenticatedUser(request);
    if (!user) return NextResponse.json({ error: "Logg inn for å se innsjekkinger." }, { status: 401 });
    const query = new URLSearchParams({
      select: "id,created_at,match_id,matches!check_ins_match_id_fkey(start_time,competition,home_club:clubs!matches_home_club_id_fkey(name),away_club:clubs!matches_away_club_id_fkey(name),stadium:stadiums!matches_stadium_id_fkey(name))",
      order: "created_at.desc",
      limit: "50",
    });
    const response = await authRequest(`/rest/v1/check_ins?${query}`, {}, user.token);
    if (!response.ok) return NextResponse.json({ error: "Kunne ikke hente besøkshistorikk." }, { status: 502 });
    return NextResponse.json({ items: await response.json() });
  } catch { return NextResponse.json({ error: "Kunne ikke hente besøkshistorikk." }, { status: 503 }); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticatedUser(request);
    if (!user) return NextResponse.json({ error: "Du må logge inn for å sjekke inn." }, { status: 401 });
    let body: { matchId?: unknown };
    try { body = await request.json(); } catch { return NextResponse.json({ error: "Ugyldig forespørsel." }, { status: 400 }); }
    if (!validMatchId(body.matchId)) return NextResponse.json({ error: "Ugyldig kamp-ID." }, { status: 400 });
    const response = await authRequest("/rest/v1/check_ins", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ user_id: user.id, match_id: body.matchId }),
    }, user.token);
    if (!response.ok) {
      const failure: { code?: string } = await response.json().catch(() => ({}));
      if (isDuplicateCheckIn(failure.code)) return NextResponse.json({ error: "Du har allerede sjekket inn på denne kampen." }, { status: 409 });
      if (response.status === 409 || response.status === 400) return NextResponse.json({ error: "Kampen finnes ikke, eller innsjekkingen er ugyldig." }, { status: 400 });
      return NextResponse.json({ error: "Kunne ikke registrere innsjekkingen." }, { status: 502 });
    }
    const rows = await response.json();
    return NextResponse.json({ item: rows[0] }, { status: 201 });
  } catch { return NextResponse.json({ error: "Innsjekking er midlertidig utilgjengelig." }, { status: 503 }); }
}
