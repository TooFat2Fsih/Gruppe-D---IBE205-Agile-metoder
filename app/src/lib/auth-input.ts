export function validateCredentials(email: unknown, password: unknown): string | null {
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Oppgi en gyldig e-postadresse.";
  if (typeof password !== "string" || password.length < 6) return "Passordet må ha minst seks tegn.";
  return null;
}
export function safeDisplayName(name: unknown, email: string): string {
  if (typeof name === "string" && name.trim().length > 0) return name.trim().slice(0, 80);
  return email.split("@")[0].slice(0, 80);
}
