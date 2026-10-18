import { NextResponse } from "next/server";

export const SESSION_COOKIE = "stadionhopper_access";
export const REFRESH_COOKIE = "stadionhopper_refresh";

export function authConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  return url && key ? { url, key } : null;
}

export async function authRequest(path: string, init: RequestInit = {}, token?: string) {
  const config = authConfig();
  if (!config) throw new Error("Supabase is not configured");
  return fetch(new URL(path, config.url), {
    ...init,
    headers: {
      apikey: config.key,
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });
}

export function setSessionCookies(response: NextResponse, session: { access_token: string; refresh_token: string; expires_in: number }) {
  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };
  response.cookies.set(SESSION_COOKIE, session.access_token, { ...options, maxAge: session.expires_in });
  response.cookies.set(REFRESH_COOKIE, session.refresh_token, { ...options, maxAge: 60 * 60 * 24 * 30 });
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.delete(SESSION_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
}
