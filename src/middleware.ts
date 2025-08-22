import { defineMiddleware } from "astro:middleware";

const isProtectedRoute = ['/miembros(.*)'];

export const onRequest = defineMiddleware(async ({url, locals, redirect}, next) => {

  // Check if no logged user is trying to access a protected route
  if ( isProtectedRoute.some(route => url.pathname.match(route))) {
    return redirect('/ingreso');
  }

  return next();
})