"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage(""); setBusy(true);
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const result = await response.json();
      if (!response.ok) { setMessage(result.error ?? "Noe gikk galt."); return; }
      if (result.confirmationRequired) { setMessage("Sjekk e-posten din for å bekrefte kontoen før du logger inn."); return; }
      router.push("/profil"); router.refresh();
    } catch { setMessage("Kunne ikke kontakte serveren."); }
    finally { setBusy(false); }
  }
  return <main className="mx-auto max-w-md px-5 py-12">
    <Link href="/" className="text-emerald-700 underline">← Kampoversikt</Link>
    <h1 className="mt-8 text-3xl font-bold">{mode === "login" ? "Logg inn" : "Opprett bruker"}</h1>
    <p className="mt-2 text-slate-600">Stadionhopper · Delivery 3-prototype</p>
    <form onSubmit={submit} className="mt-7 space-y-4">
      {mode === "signup" && <label className="block">Visningsnavn<input className="mt-1 w-full rounded-lg border p-3" value={name} onChange={e => setName(e.target.value)} maxLength={80} autoComplete="name" required /></label>}
      <label className="block">E-post<input className="mt-1 w-full rounded-lg border p-3" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required /></label>
      <label className="block">Passord<input className="mt-1 w-full rounded-lg border p-3" type="password" minLength={6} value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} required /></label>
      {message && <p role="status" className="rounded-lg bg-amber-50 p-3 text-amber-900">{message}</p>}
      <button disabled={busy} className="w-full rounded-lg bg-emerald-700 p-3 font-semibold text-white disabled:opacity-50">{busy ? "Vennligst vent …" : mode === "login" ? "Logg inn" : "Registrer"}</button>
    </form>
    <button className="mt-5 text-emerald-700 underline" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage(""); }}>{mode === "login" ? "Ny bruker? Registrer deg" : "Har du konto? Logg inn"}</button>
  </main>;
}
