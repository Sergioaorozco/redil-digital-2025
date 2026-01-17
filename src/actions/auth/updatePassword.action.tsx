import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { FIREBASE_API_KEY } from "astro:env/server";

export const updatePasswordAction = defineAction({
  accept: 'form',
  input: z.object({
    current_password: z.string(),
    password: z.string(),
    password_confirmation: z.string()
  }),
  handler: async ({ current_password, password, password_confirmation }, { cookies }) => {
    try {
      const sessionCookie = cookies.get('session');
      if (!sessionCookie?.value) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: 'Sesión expirada'
        });
      }

      const sessionData = JSON.parse(sessionCookie.value);
      const email = sessionData.email;

      // 1. Re-authenticate using the current password (Firebase requirement for sensitive ops)
      // we do this via the signInWithPassword REST API
      const authResponse = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
        {
          method: 'POST',
          body: JSON.stringify({
            email,
            password: current_password,
            returnSecureToken: true
          }),
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const authData = await authResponse.json();

      if (!authResponse.ok) {
        if (authData.error?.message === 'INVALID_PASSWORD' || authData.error?.message === 'INVALID_LOGIN_CREDENTIALS') {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: 'La contraseña actual es incorrecta'
          });
        }
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: authData.error?.message || 'Error al verificar la contraseña'
        });
      }

      const freshIdToken = authData.idToken;

      // 2. Validation
      if (current_password === password) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: 'Intenta una contraseña diferente a la actual'
        });
      }

      if (password !== password_confirmation) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: 'Las contraseñas no coinciden'
        });
      }

      // 3. Update the password
      const updateResponse = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY}`,
        {
          method: 'POST',
          body: JSON.stringify({
            idToken: freshIdToken,
            password,
            returnSecureToken: true
          }),
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const updateData = await updateResponse.json();

      if (!updateResponse.ok) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: updateData.error?.message || 'Error al actualizar la contraseña'
        });
      }

      // 4. Update cookies with new tokens
      cookies.set('__session', updateData.idToken, {
        path: '/',
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 5,
      });

      sessionData.refreshToken = updateData.refreshToken;
      cookies.set('session', JSON.stringify(sessionData), {
        path: '/',
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 5,
      });

      return {
        success: true,
        user: {
          displayName: sessionData.displayName,
          email: sessionData.email
        }
      }

    } catch (error) {
      if (error instanceof ActionError) throw error;
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : 'Error desconocido al actualizar la contraseña'
      })
    }
  }
})