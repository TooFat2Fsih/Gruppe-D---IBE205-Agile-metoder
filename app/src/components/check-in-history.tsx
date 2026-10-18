"use client";
import { useEffect, useState } from "react";

type HistoryItem = {
  id: string;
  created_at: string;
  matches: {
    start_time: string;
    competition: string | null;
    home_club: { name: string } | null;
    away_club: { name: string } | null;
    stadium: { name: string } | null;
  } | null;
};
export function CheckInHistory() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  useEffect(() => {
    fetch("/api/checkins", { cache: "no-store" })
      .then(async r => { if (!r.ok) throw new Error("Failed"); return r.json(); })
      .then(data => { setItems(data.items); setState("ready"); })
      .catch(() => setState("error"));
  }, []);
  return <section className="mt-8">
    <h2 className="text-xl font-semibold">Min besøkshistorikk</h2>
    {state === "loading" && <p className="mt-3">Henter innsjekkinger …</p>}
    {state === "error" && <p role="alert" className="mt-3">Kunne ikke hente innsjekkinger. Prøv å logge inn på nytt.</p>}
    {state === "ready" && items.length === 0 && <p className="mt-3 text-slate-600">Du har ikke registrert noen stadionbesøk ennå.</p>}
    {state === "ready" && <ul className="mt-4 space-y-3">{items.map(item => <li key={item.id} className="rounded-xl border p-4">
      <p className="font-semibold">{item.matches?.home_club?.name ?? "Hjemmelag"} – {item.matches?.away_club?.name ?? "Bortelag"}</p>
      <p className="text-sm text-slate-600">{item.matches?.stadium?.name ?? "Ukjent stadion"} · {item.matches?.start_time ? new Date(item.matches.start_time).toLocaleString("nb-NO", { timeZone: "Europe/Oslo" }) : "Ukjent dato"}</p>
      <p className="text-xs text-slate-500">Innsjekket {new Date(item.created_at).toLocaleString("nb-NO", { timeZone: "Europe/Oslo" })}</p>
    </li>)}</ul>}
  </section>;
}
