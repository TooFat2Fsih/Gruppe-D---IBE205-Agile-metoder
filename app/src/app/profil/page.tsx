"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Profile = { user: { id: string; email: string; profile: { name: string; created_at: string } | null } | null };
export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<Profile | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then(async r => { if (!r.ok) throw new Error(r.status === 401 ? "Du må logge inn for å se profilen." : "Kunne ikke hente profilen."); return r.json(); })
      .then(setData).catch(e => setError(e.message));
  }, []);
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); router.refresh(); }
  return <main className="mx-auto max-w-2xl px-5 py-12">
    <Link href="/" className="text-emerald-700 underline">← Kampoversikt</Link>
    <h1 className="mt-8 text-3xl font-bold">Min profil</h1>
    {error && <p role="alert" className="mt-6">{error} <Link href="/login" className="text-emerald-700 underline">Logg inn</Link></p>}
    {!data && !error && <p className="mt-6">Henter profil …</p>}
    {data?.user && <section className="mt-6 space-y-3 rounded-xl border p-6">
      <p><strong>Navn:</strong> {data.user.profile?.name ?? "Profil opprettes ved registrering"}</p>
      <p><strong>E-post:</strong> {data.user.email}</p>
      <p className="text-sm text-slate-500">Innsjekking og besøkshistorikk kommer i neste del av sprinten.</p>
      <button onClick={logout} className="rounded-lg bg-slate-900 px-4 py-2 text-white">Logg ut</button>
    </section>}
  </main>;
}
