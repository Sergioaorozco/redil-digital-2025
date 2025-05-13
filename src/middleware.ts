import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server'

const isProtectedRoute = createRouteMatcher(['/miembro'])

export const onRequest = clerkMiddleware((auth, context) => {
  const { userId } = auth()

  if (!userId && isProtectedRoute(context.request)) {
    return context.redirect('ingreso');
  }

})