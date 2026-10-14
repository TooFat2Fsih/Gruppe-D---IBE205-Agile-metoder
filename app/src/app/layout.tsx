import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stadionhopper | Lokal fotball",
  description: "Et prosjekt for å oppdage lokale fotballkamper og registrere stadionbesøk.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="nb"><body>{children}</body></html>;
}
