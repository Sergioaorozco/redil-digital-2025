import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

const privateRoutes = createRouteMatcher(['/miembro/(.*)']);

export const onRequest = clerkMiddleware((auth, context) => {

  const { userId, redirectToSignIn, } = auth()

  if(!userId && privateRoutes(context.request)){
    return redirectToSignIn();
  }

});
