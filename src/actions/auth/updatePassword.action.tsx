import { defineAction, ActionError } from "astro:actions";
import { updatePassword, type AuthError, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { z } from "astro:schema";
import { firebaseApp } from "@/firebase/config";

export const updatePasswordAction = defineAction({
  accept: 'form',
  input: z.object({
    current_password: z.string(),
    password: z.string(),
    password_confirmation: z.string()
  }),
  handler: async ({ current_password, password, password_confirmation }, { cookies }) => {
    try {
      // Get the current user inside the handler, not at module level
      const user = firebaseApp.auth.currentUser;

      if (!user || !user.email) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: 'Usuario no autenticado'
        });
      }

      if (current_password === password) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: 'Intenta una contraseña diferente a la actual'
        })
      }

      if (password !== password_confirmation) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: 'Las contraseñas no coinciden'
        })
      }

      // Re-authenticate the user before changing password (Firebase security requirement)
      const credential = EmailAuthProvider.credential(user.email, current_password);
      await reauthenticateWithCredential(user, credential);

      // Now update the password
      await updatePassword(user, password);

      return {
        success: true,
        user: {
          displayName: user.displayName,
          email: user.email
        }
      }

    } catch (error) {
      const authError = error as AuthError;

      // Provide better error messages for common cases
      if (authError.code === 'auth/wrong-password') {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: 'La contraseña actual es incorrecta'
        });
      }

      if (authError.code === 'auth/invalid-credential') {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: 'La contraseña actual es incorrecta'
        });
      }

      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: authError.message || 'Error desconocido al actualizar la contraseña'
      })
    }
  }
})