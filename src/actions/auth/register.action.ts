import { defineAction } from "astro:actions";
import { z } from "astro:schema";


export const loginUser= defineAction({
  accept: 'form',
  input: z.object({
    name: z.string(),
    email: z.string().email().optional(),
    remember_me: z.boolean().optional(),
    password: z.string()
  }),
  handler: async ({name, password, email, remember_me}, {cookies}) => {
    if(remember_me) {
      cookies.set('name', name, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        path: '/'
      });
    } else {
      cookies.delete('name', {
        path: '/',
      });
    }
    return { status: 'success', message: 'Ingreso Correcto'};
  }
})