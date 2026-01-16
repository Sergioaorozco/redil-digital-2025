import { defineAction, ActionError } from "astro:actions";
import { updateProfile, type AuthError } from "firebase/auth";
import { z } from "astro:schema";
import { firebaseApp } from "@/firebase/config";

export const updateProfileAction = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string()
  }),
  handler: async ({ name }, { cookies }) => {
    try {
      // Get the current user inside the handler, not at module level
      const user = firebaseApp.auth.currentUser;

      if (!user) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: 'Usuario no autenticado'
        });
      }

      await updateProfile(user, {
        displayName: name,
      })

      // Is it possible to re-authenticate the user?
      await user.reload();

      return {
        success: true,
        user: {
          displayName: user.displayName,
          email: user.email
        }
      }

    } catch (error) {
      const authError = error as AuthError;
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: authError.message || 'Error desconocido al actualizar el perfil'
      })
    }
  }
})