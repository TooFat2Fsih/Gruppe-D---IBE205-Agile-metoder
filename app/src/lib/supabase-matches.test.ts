import { describe, expect, it } from "vitest";
import { mapMatchRow } from "./supabase-matches";

describe("mapMatchRow", () => {
  it("resolves clubs and stadium from match relationships", () => {
    const item = mapMatchRow({
      id: "match-1",
      start_time: "2026-11-15T15:00:00Z",
      status: "scheduled",
      competition: null,
      home_club: { name: "Hjemmelag" },
      away_club: { name: "Bortelag" },
      stadium: { name: "Eksempel stadion" },
    });
    expect(item.homeClub).toBe("Hjemmelag");
    expect(item.stadium).toBe("Eksempel stadion");
  });

  it("rejects incomplete relationships", () => {
    expect(() => mapMatchRow({
      id: "match-1",
      start_time: "2026-11-15T15:00:00Z",
      status: "scheduled",
      competition: null,
      home_club: null,
      away_club: { name: "Bortelag" },
      stadium: { name: "Eksempel stadion" },
    })).toThrow("Missing match relationship");
  });
});
