import { defineAction, ActionError } from "astro:actions";
import { updateProfile, type AuthError } from "firebase/auth";
import { z } from "astro:schema";
import { firebaseApp } from "@/firebase/config";

const user = firebaseApp.auth.currentUser;

export const updateProfileAction = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string()
  }),
  handler: async ({ name }, { cookies }) => {
    try {
      await updateProfile(user!, {
        displayName: name,
      })

      return {
        success: true,
        user
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