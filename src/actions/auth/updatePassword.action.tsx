import { defineAction, ActionError } from "astro:actions";
import { updatePassword, type AuthError } from "firebase/auth";
import { z } from "astro:schema";
import { firebaseApp } from "@/firebase/config";

const user = firebaseApp.auth.currentUser;

export const updatePasswordAction = defineAction({
  accept: 'form',
  input: z.object({
    password: z.string(),
    password_confirmation: z.string()
  }),
  handler: async ({ password, password_confirmation }, { cookies }) => {
    try {
      if (password !== password_confirmation) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: 'Las contraseñas no coinciden'
        })
      }

      await updatePassword(user!, password);

      return {
        success: true,
        user
      }

    } catch (error) {
      const authError = error as AuthError;
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: authError.message || 'Error desconocido al actualizar la contraseña'
      })
    }
  }
})