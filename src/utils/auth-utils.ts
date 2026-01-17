import { ActionError } from "astro:actions";
import type { AstroCookies } from "astro";
import { FIREBASE_API_KEY } from "astro:env/server";

export interface SessionData {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  refreshToken: string;
  idToken: string;
}

const COOKIE_NAME = 'auth_session';

/**
 * Gets a valid ID token. If the current one is expired or invalid, 
 * it attempts a silent refresh using the refreshToken.
 * If everything fails, it throws a clear UNAUTHORIZED error.
 */
export async function getValidSession(cookies: AstroCookies): Promise<{ token: string; user: SessionData }> {
  const cookie = cookies.get(COOKIE_NAME);

  if (!cookie?.value) {
    throw new ActionError({ code: "UNAUTHORIZED", message: "No hay sesión activa" });
  }

  let session: SessionData;
  try {
    session = JSON.parse(cookie.value);
  } catch {
    cookies.delete(COOKIE_NAME, { path: '/' });
    throw new ActionError({ code: "UNAUTHORIZED", message: "Sesión corrupta" });
  }

  // Helper to update the cookie
  const updateCookie = (data: SessionData) => {
    cookies.set(COOKIE_NAME, JSON.stringify(data), {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 5, // 5 days
    });
  };

  // 1. Try to verify the token by doing a small request (like getting account info)
  // This is better than manually checking expiration dates
  const checkResponse = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
    {
      method: 'POST',
      body: JSON.stringify({ idToken: session.idToken }),
      headers: { 'Content-Type': 'application/json' }
    }
  );

  if (checkResponse.ok) {
    return { token: session.idToken, user: session };
  }

  // 2. If not OK, attempt silent refresh
  console.log("[Auth] Token invalid/expired, refreshing...");
  const refreshResponse = await fetch(
    `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`,
    {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: session.refreshToken
      }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  );

  if (!refreshResponse.ok) {
    cookies.delete(COOKIE_NAME, { path: '/' });
    throw new ActionError({ code: "UNAUTHORIZED", message: "La sesión ha expirado" });
  }

  const refreshData = await refreshResponse.json();

  // 3. Update session with new tokens
  session.idToken = refreshData.id_token;
  session.refreshToken = refreshData.refresh_token;

  updateCookie(session);
  console.log("[Auth] Session refreshed successfully");

  return { token: session.idToken, user: session };
}

/**
 * Persists a new session (e.g., after login)
 */
export function setSession(cookies: AstroCookies, data: SessionData) {
  cookies.set(COOKIE_NAME, JSON.stringify(data), {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 5,
  });
}
