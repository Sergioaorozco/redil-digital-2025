import { defineAction } from "astro:actions";
import { signInWithEmailAndPassword, type AuthError } from "firebase/auth";
import { z } from "astro:schema";

import { firebaseApp } from "@/firebase/config";


export const loginUser = defineAction({
  accept: 'form',
  input: z.object({
    email: z.string().email(),
    password: z.string()
  }),
  handler: async ({ email, password}, {cookies}) => {
    // Cookies for Remember Email

    // Logic to login user with firebase
    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseApp.auth,
        email,
        password
      )

      console.log('User logged in:', userCredential);
    } catch (error) {
      const firebaseError = error as AuthError;

      if( firebaseError.code === 'auth/invalid-credential') {
        throw new Error('Verifica tus credenciales e intenta nuevamente.')
      }
      throw new Error('Error en el Servidor, intentalo de nuevo')
    }
  }
})