"use client";
import { useState } from "react";
import Link from "next/link";

export function CheckInButton({ matchId }: { matchId: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);
  async function checkIn() {
    setBusy(true); setMessage(""); setNeedsLogin(false);
    try {
      const response = await fetch("/api/checkins", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ matchId }),
      });
      const data = await response.json();
      if (response.status === 401) setNeedsLogin(true);
      setMessage(response.ok ? "Innsjekking registrert! Se Min profil for besøkshistorikk." : data.error ?? "Noe gikk galt.");
    } catch { setMessage("Kunne ikke kontakte serveren."); }
    finally { setBusy(false); }
  }
  return <div className="mt-4 space-y-2">
    <button type="button" disabled={busy} onClick={checkIn} className="rounded-lg bg-emerald-700 px-4 py-2 text-white disabled:opacity-50">{busy ? "Registrerer …" : "Sjekk inn på kampen"}</button>
    {message && <p role="status" className="text-sm text-slate-700">{message} {needsLogin && <Link className="text-emerald-700 underline" href="/login">Logg inn</Link>}</p>}
  </div>;
}
