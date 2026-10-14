import { loadMatches } from "@/lib/supabase-matches";

export default async function HomePage() {
  const result = await loadMatches();
  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
      <header className="mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-700">Stadionhopper</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Oppdag lokal fotball</h1>
        <p className="mt-4 max-w-xl text-slate-600">Første steg mot en kampoversikt koblet til database.</p>
      </header>
      <section aria-labelledby="matches-heading" className="space-y-4">
        <h2 id="matches-heading" className="text-xl font-semibold">Kampoversikt</h2>
        {result.kind === "unconfigured" && (
          <p className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-amber-900">
            Databasen er ikke konfigurert ennå. Se app/README.md for oppsett. Ingen virkelige kamper vises.
          </p>
        )}
        {result.kind === "error" && (
          <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-5 text-red-900">
            Kunne ikke hente kampdata. Kontroller Supabase-tilkoblingen og RLS-reglene.
          </p>
        )}
        {result.kind === "ready" && result.items.length === 0 && <p>Ingen kamper registrert i databasen.</p>}
        {result.kind === "ready" && result.items.map((match) => (
          <article key={match.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">{match.homeClub} – {match.awayClub}</h3>
            <p className="mt-2 text-slate-600">{match.stadium} · {new Date(match.startTime).toLocaleString("nb-NO", { timeZone: "Europe/Oslo" })}</p>
            <p className="mt-2 text-sm text-slate-500">{match.competition ?? "Kamp"}</p>
          </article>
        ))}
      </section>
      <footer className="mt-10 border-t border-slate-200 pt-5 text-sm text-slate-500">IBE205 · Databasegrunnlag · Check-in er ikke implementert</footer>
    </main>
  );
}
