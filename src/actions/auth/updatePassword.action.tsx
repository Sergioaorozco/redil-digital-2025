import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { FIREBASE_API_KEY } from "astro:env/server";
import { getValidSession, setSession } from "@/utils/auth-utils";

export const updatePasswordAction = defineAction({
  accept: 'form',
  input: z.object({
    current_password: z.string(),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    password_confirmation: z.string(),
  })
    .refine((data) => data.password === data.password_confirmation, {
      message: "Las contraseñas no coinciden",
      path: ["password_confirmation"],
    })
    .refine((data) => data.password !== data.current_password, {
      message: "Por favor, elige una contraseña diferente a la actual",
      path: ["password"],
    }),
  handler: async ({ current_password, password }, { cookies }) => {
    // 1. Get valid session
    const { user } = await getValidSession(cookies);

    // 2. Re-authenticate to get a fresh token for sensitive operation
    const authResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        body: JSON.stringify({
          email: user.email,
          password: current_password,
          returnSecureToken: true
        }),
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const authData = await authResponse.json();

    if (!authResponse.ok) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: 'La contraseña actual es incorrecta'
      });
    }

    // 3. Update password using the fresh token
    const idToken = authData.idToken;
    const updateResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        body: JSON.stringify({
          idToken,
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

    // 4. Update session with new tokens
    user.idToken = updateData.idToken;
    user.refreshToken = updateData.refreshToken;
    setSession(cookies, user);

    return { success: true };
  }
});