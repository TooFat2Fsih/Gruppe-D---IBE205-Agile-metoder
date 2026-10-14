// Read-only server-side Supabase PostgREST integration. No auth or writes yet.
// The anon/publishable key is subject to RLS; never use a service-role key here.
export type StadiumMatch = {
  id: string;
  startTime: string;
  status: string;
  competition: string | null;
  homeClub: string;
  awayClub: string;
  stadium: string;
};

type MatchRow = {
  id: string;
  start_time: string;
  status: string;
  competition: string | null;
  home_club: { name: string } | null;
  away_club: { name: string } | null;
  stadium: { name: string } | null;
};

export type MatchResult =
  | { kind: "unconfigured" }
  | { kind: "ready"; items: StadiumMatch[] }
  | { kind: "error" };

export function mapMatchRow(row: MatchRow): StadiumMatch {
  if (!row.home_club || !row.away_club || !row.stadium) {
    throw new Error("Missing match relationship");
  }
  return {
    id: row.id,
    startTime: row.start_time,
    status: row.status,
    competition: row.competition,
    homeClub: row.home_club.name,
    awayClub: row.away_club.name,
    stadium: row.stadium.name,
  };
}

export async function loadMatches(): Promise<MatchResult> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return { kind: "unconfigured" };
  try {
    const endpoint = new URL("/rest/v1/matches", url);
    endpoint.searchParams.set(
      "select",
      "id,start_time,status,competition,home_club:clubs!matches_home_club_id_fkey(name),away_club:clubs!matches_away_club_id_fkey(name),stadium:stadiums!matches_stadium_id_fkey(name)",
    );
    endpoint.searchParams.set("order", "start_time.asc");
    endpoint.searchParams.set("limit", "20");
    const response = await fetch(endpoint.toString(), {
      headers: { apikey: key },
      cache: "no-store",
    });
    if (!response.ok) return { kind: "error" };
    const rows: MatchRow[] = await response.json();
    return { kind: "ready", items: rows.map(mapMatchRow) };
  } catch {
    return { kind: "error" };
  }
}
