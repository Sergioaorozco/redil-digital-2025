import { defineAction, ActionError } from "astro:actions";
import { signInWithEmailAndPassword, type AuthError } from "firebase/auth";
import { z } from "astro:schema";

import { firebaseApp } from "@/firebase/config";
import { setSession } from "@/utils/auth-utils";

export const loginUser = defineAction({
  accept: 'form',
  input: z.object({
    email: z.string().email(),
    password: z.string()
  }),
  handler: async ({ email: inputEmail, password }, { cookies }) => {
    try {
      const authAction = await signInWithEmailAndPassword(
        firebaseApp.auth,
        inputEmail,
        password
      );

      const user = authAction.user;
      const idToken = await user.getIdToken();

      setSession(cookies, {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName,
        photoURL: user.photoURL,
        refreshToken: user.refreshToken,
        idToken: idToken
      });

    } catch (error) {
      const authError = error as AuthError;
      if (authError.code === 'auth/invalid-credential' || authError.code === 'invalid_type') {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: 'Credenciales inválidas, intenta de nuevo'
        });
      }
      if (authError.code === 'auth/too-many-requests') {
        throw new ActionError({
          code: "TOO_MANY_REQUESTS",
          message: 'Demasiados intentos fallidos, intenta de nuevo más tarde'
        });
      }
      // Optionally, rethrow or handle other errors
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: authError.message || 'Error desconocido al iniciar sesión'
      });
    }
  }
}); 
