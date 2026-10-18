import { NextRequest } from "next/server";
import { authRequest, SESSION_COOKIE } from "@/lib/auth-server";

export async function authenticatedUser(request: NextRequest): Promise<{ id: string; token: string } | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const response = await authRequest("/auth/v1/user", {}, token);
  if (!response.ok) return null;
  const user: { id?: string } = await response.json();
  return user.id ? { id: user.id, token } : null;
}
