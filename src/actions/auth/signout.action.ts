import { defineAction, ActionError } from "astro:actions";
import { firebaseApp } from "@/firebase/config";
import { signOut } from "firebase/auth";

const auth = firebaseApp.auth;

export const signOutAction = defineAction({
  handler: async (_, { cookies }) => {
    try {
      await signOut(auth);

      // Clear cookies
      cookies.delete('session', { path: '/' });
      cookies.delete('__session', { path: '/' });

      return { success: true };
    } catch (error) {
      console.error("Error signing out:", error);
      throw new ActionError({
        message: "Error signing out. Please try again.",
        code: "CONFLICT"
      });
    }
  }
})