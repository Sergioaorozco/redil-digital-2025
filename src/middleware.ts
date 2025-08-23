import { defineMiddleware } from "astro:middleware";
import { firebaseApp } from "./firebase/config";

const isProtectedRoute = ['/miembros(.*)'];
const loggedInRoutes = ['/ingreso'];

export const onRequest = defineMiddleware(async ({url, locals, redirect}, next) => {
  const isLoggedIn = !!firebaseApp.auth.currentUser;

  locals.isLoggedIn = isLoggedIn;
  
  // Check if no logged user is trying to access a protected route
  if ( !isLoggedIn && isProtectedRoute.some(route => url.pathname.match(route))) {
    return redirect('/ingreso');
  }

  if (isLoggedIn && loggedInRoutes.some(route => url.pathname.match(route))) {
    return redirect('/miembros')
  }

  return next();
})