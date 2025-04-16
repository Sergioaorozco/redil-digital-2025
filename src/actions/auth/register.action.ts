import { defineAction } from "astro:actions";
import { z } from "astro:schema";


export const registerUser = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string(),
    email: z.string().email(),
    rememberMe: z.boolean().optional(),
    password: z.string()
  }),
  handler: async ({name, password, email, rememberMe}) => {
    console.log(name, password, email, rememberMe);
    return true;
  }
})