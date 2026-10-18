"use client";
import { useState } from "react";
export function ShareCheckIn({ checkInId }: { checkInId: string }) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function share() {
    setBusy(true); setStatus("");
    try {
      const response = await fetch("/api/feed", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkInId }),
      });
      const data = await response.json();
      setStatus(response.ok ? "Innsjekkingen er delt i aktivitetsfeeden." : data.error ?? "Deling mislyktes.");
    } catch { setStatus("Kunne ikke kontakte serveren."); }
    finally { setBusy(false); }
  }
  return <div className="mt-2">
    <button type="button" onClick={share} disabled={busy} className="text-sm text-emerald-700 underline disabled:opacity-50">{busy ? "Deler …" : "Del dette besøket i feeden"}</button>
    {status && <p role="status" className="mt-1 text-sm text-slate-600">{status}</p>}
  </div>;
}
