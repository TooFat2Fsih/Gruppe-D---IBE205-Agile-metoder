import { NextRequest, NextResponse } from "next/server";
import { authRequest, clearSessionCookies, REFRESH_COOKIE, SESSION_COOKIE, setSessionCookies } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  let token = request.cookies.get(SESSION_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!token && !refresh) return NextResponse.json({ user: null }, { status: 401 });
  try {
    let userResponse = token ? await authRequest("/auth/v1/user", {}, token) : null;
    let renewed: { access_token: string; refresh_token: string; expires_in: number } | null = null;
    if ((!userResponse || !userResponse.ok) && refresh) {
      const response = await authRequest("/auth/v1/token?grant_type=refresh_token", { method: "POST", body: JSON.stringify({ refresh_token: refresh }) });
      if (response.ok) {
        renewed = await response.json();
        token = renewed?.access_token;
        userResponse = token ? await authRequest("/auth/v1/user", {}, token) : null;
      }
    }
    if (!userResponse?.ok || !token) {
      const response = NextResponse.json({ user: null }, { status: 401 });
      clearSessionCookies(response);
      return response;
    }
    const user = await userResponse.json();
    const profileResponse = await authRequest(`/rest/v1/users?id=eq.${encodeURIComponent(user.id)}&select=id,name,email,created_at`, {}, token);
    const profiles = profileResponse.ok ? await profileResponse.json() : [];
    const response = NextResponse.json({ user: { id: user.id, email: user.email, profile: profiles[0] ?? null } });
    if (renewed) setSessionCookies(response, renewed);
    return response;
  } catch { return NextResponse.json({ error: "Kunne ikke hente profil." }, { status: 503 }); }
}
