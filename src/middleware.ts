import { defineMiddleware } from "astro:middleware";
import { firebaseApp } from "./firebase/config";
import { getLatestVideo } from "./utils/youtube";

const isProtectedRoute = ['/miembros(.*)'];
const loggedInRoutes = ['/ingreso'];

export const onRequest = defineMiddleware(async ({ url, locals, redirect }, next) => {
  const user = firebaseApp.auth.currentUser;
  const isLoggedIn = !!user;

  locals.isLoggedIn = isLoggedIn;

  locals.userInfo = isLoggedIn ? {
    userName: user?.displayName,
    userEmail: user?.email,
    userPhoto: user.photoURL
  } : null

  // Fetch global video data (cached)
  const videoData = await getLatestVideo();
  if (videoData) {
    locals.videoId = videoData.videoId;
    locals.videoTitle = videoData.title;
  }

  // Check if no logged user is trying to access a protected route
  if (!isLoggedIn && isProtectedRoute.some(route => url.pathname.match(route))) {
    return redirect('/ingreso');
  }

  if (isLoggedIn && loggedInRoutes.some(route => url.pathname.match(route))) {
    return redirect('/miembros')
  }

  return next();
})