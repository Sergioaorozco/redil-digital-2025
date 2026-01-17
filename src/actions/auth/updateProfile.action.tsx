import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { FIREBASE_API_KEY } from "astro:env/server";

export const updateProfileAction = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string()
  }),
  handler: async ({ name }, { cookies }) => {
    try {
      // 1. Get tokens from cookies
      const sessionCookie = cookies.get('session');
      const tokenCookie = cookies.get('__session');

      if (!sessionCookie?.value || !tokenCookie?.value) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: 'Sesión expirada o no válida'
        });
      }

      const sessionData = JSON.parse(sessionCookie.value);
      let idToken = tokenCookie.value;

      // 2. Call Firebase REST API to update profile
      // documentation: https://firebase.google.com/docs/reference/rest/auth#section-update-profile
      const updateResponse = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY}`,
        {
          method: 'POST',
          body: JSON.stringify({
            idToken,
            displayName: name,
            returnSecureToken: true
          }),
          headers: { 'Content-Type': 'application/json' }
        }
      );

      let updateData = await updateResponse.json();

      // 3. Handle Token Expiry (often the cause of the "5 minute" or auth issues)
      if (!updateResponse.ok && updateData.error?.message === 'TOKEN_EXPIRED') {
        // Try to refresh the token
        const refreshResponse = await fetch(
          `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`,
          {
            method: 'POST',
            body: new URLSearchParams({
              grant_type: 'refresh_token',
              refresh_token: sessionData.refreshToken
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }
        );

        if (!refreshResponse.ok) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: 'Tu sesión ha expirado, por favor inicia sesión de nuevo'
          });
        }

        const refreshData = await refreshResponse.json();
        idToken = refreshData.id_token;

        // Try update again with new token
        const retryResponse = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY}`,
          {
            method: 'POST',
            body: JSON.stringify({
              idToken,
              displayName: name,
              returnSecureToken: true
            }),
            headers: { 'Content-Type': 'application/json' }
          }
        );

        updateData = await retryResponse.json();
        if (!retryResponse.ok) {
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: updateData.error?.message || 'Error al actualizar el perfil'
          });
        }

        // Update the token cookie
        cookies.set('__session', idToken, {
          path: '/',
          httpOnly: true,
          secure: true,
          maxAge: 60 * 60 * 24 * 5,
        });
      } else if (!updateResponse.ok) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: updateData.error?.message || 'Error al actualizar el perfil'
        });
      }

      // 4. Update the session cookie so the new name persists
      sessionData.displayName = name;
      cookies.set('session', JSON.stringify(sessionData), {
        path: '/',
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 5,
      });

      return {
        success: true,
        user: {
          displayName: name,
          email: sessionData.email
        }
      }

    } catch (error) {
      if (error instanceof ActionError) throw error;
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : 'Error desconocido al actualizar el perfil'
      })
    }
  }
})