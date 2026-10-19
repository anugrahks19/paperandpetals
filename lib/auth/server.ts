import { createNeonAuth } from "@neondatabase/auth/next/server";

let auth: ReturnType<typeof createNeonAuth> | undefined;

export function getAuth() {
  if (!auth) {
    const baseUrl=process.env.NEON_AUTH_BASE_URL;
    const secret=process.env.NEON_AUTH_COOKIE_SECRET;
    if (!baseUrl || !secret) throw new Error("Studio sign-in is not configured.");
    auth=createNeonAuth({ baseUrl, cookies: { secret } });
  }
  return auth;
}
