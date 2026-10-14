export type DemoMatch = {
  id: string;
  homeClub: string;
  awayClub: string;
  stadium: string;
  kickoffLabel: string;
};

// Presentation-only seed content. NOT fetched from a live database or API.
export const demoMatches: DemoMatch[] = [
  { id: "demo-1", homeClub: "Hjemmelag", awayClub: "Bortelag", stadium: "Eksempel stadion", kickoffLabel: "Tidspunkt kommer" },
];

export function formatMatchTitle(match: Pick<DemoMatch, "homeClub" | "awayClub">): string {
  return `${match.homeClub} – ${match.awayClub}`;
}
