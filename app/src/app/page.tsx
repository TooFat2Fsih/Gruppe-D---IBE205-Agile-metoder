import { demoMatches, formatMatchTitle } from "@/lib/matches";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
      <header className="mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-700">Stadionhopper</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Oppdag lokal fotball</h1>
        <p className="mt-4 max-w-xl text-slate-600">Dette er den første kjørbare prosjektstrukturen. Kampene under er kun demonstrasjonsdata.</p>
      </header>
      <section aria-labelledby="matches-heading" className="space-y-4">
        <h2 id="matches-heading" className="text-xl font-semibold">Eksempel på kampoversikt</h2>
        {demoMatches.map((match) => (
          <article key={match.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">{formatMatchTitle(match)}</h3>
            <p className="mt-2 text-slate-600">{match.stadium} · {match.kickoffLabel}</p>
            <p className="mt-4 text-sm text-amber-800">Check-in, innlogging og besøkshistorikk er ikke implementert ennå.</p>
          </article>
        ))}
      </section>
      <footer className="mt-10 border-t border-slate-200 pt-5 text-sm text-slate-500">IBE205 · Teknisk oppstart · Ikke en ferdig applikasjon</footer>
    </main>
  );
}
