import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { FIREBASE_API_KEY } from "astro:env/server";
import { getValidSession, setSession } from "@/utils/auth-utils";

export const updateProfileAction = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres")
  }),
  handler: async ({ name }, { cookies }) => {
    // 1. Get a guaranteed valid token (automatically refreshes if needed)
    const { token, user } = await getValidSession(cookies);

    // 2. Call Firebase REST API to update profile
    const updateResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        body: JSON.stringify({
          idToken: token,
          displayName: name,
          returnSecureToken: true
        }),
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const updateData = await updateResponse.json();

    if (!updateResponse.ok) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: updateData.error?.message || 'Error al actualizar el perfil'
      });
    }

    // 3. Update the session cookie with new info
    user.displayName = name;
    // If the API returned a new idToken/refreshToken (it does when returnSecureToken is true)
    if (updateData.idToken) user.idToken = updateData.idToken;
    if (updateData.refreshToken) user.refreshToken = updateData.refreshToken;

    setSession(cookies, user);

    return {
      success: true,
      user: {
        displayName: name,
        email: user.email
      }
    }
  }
})