"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Activity = { id: string; user_id: string; text: string; created_at: string };
export function ActivityFeed() {
  const [items, setItems] = useState<Activity[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "login" | "error">("loading");
  useEffect(() => {
    fetch("/api/feed", { cache: "no-store" })
      .then(async r => {
        if (r.status === 401) { setStatus("login"); return null; }
        if (!r.ok) throw new Error("feed");
        return r.json();
      })
      .then(data => { if (data) { setItems(data.items); setStatus("ready"); } })
      .catch(() => setStatus("error"));
  }, []);
  return <section className="mt-10 border-t pt-6" aria-labelledby="feed-heading">
    <h2 id="feed-heading" className="text-xl font-semibold">Aktivitetsfeed</h2>
    <p className="mt-2 text-sm text-slate-600">Her vises innsjekkinger som supportere selv velger å dele. Ingen e-postadresser vises.</p>
    {status === "loading" && <p className="mt-3">Henter aktivitet …</p>}
    {status === "login" && <p className="mt-3"><Link href="/login" className="text-emerald-700 underline">Logg inn</Link> for å se aktivitet.</p>}
    {status === "error" && <p role="alert" className="mt-3">Kunne ikke hente aktivitet.</p>}
    {status === "ready" && items.length === 0 && <p className="mt-3">Ingen delte stadionbesøk ennå.</p>}
    {status === "ready" && <ul className="mt-4 space-y-3">{items.map(item => <li key={item.id} className="rounded-xl border p-4">
      <p className="font-medium">Supporter · {item.text}</p>
      <p className="mt-1 text-xs text-slate-500">{new Date(item.created_at).toLocaleString("nb-NO", { timeZone: "Europe/Oslo" })}</p>
    </li>)}</ul>}
  </section>;
}
