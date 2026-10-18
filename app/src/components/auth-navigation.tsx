"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export function AuthNavigation() {
  const router = useRouter();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then(r => { if (active) setSignedIn(r.ok); })
      .catch(() => { if (active) setSignedIn(false); });
    return () => { active = false; };
  }, []);
  async function logout() {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (response.ok) { setSignedIn(false); router.refresh(); }
  }
  return <nav aria-label="Brukermeny" className="flex flex-wrap gap-4 text-sm">
    {signedIn === null && <span className="text-slate-500">Sjekker innlogging …</span>}
    {signedIn === false && <Link href="/login" className="text-emerald-700 underline">Logg inn</Link>}
    {signedIn === true && <>
      <Link href="/profil" className="text-emerald-700 underline">Min profil</Link>
      <button type="button" onClick={logout} className="text-emerald-700 underline">Logg ut</button>
    </>}
  </nav>;
}
