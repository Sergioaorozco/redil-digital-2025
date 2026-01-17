import { defineMiddleware } from "astro:middleware";
import { firebaseApp } from "./firebase/config";
import { getLatestVideo } from "./utils/youtube";

const isProtectedRoute = ['/miembros(.*)'];
const loggedInRoutes = ['/ingreso'];

export const onRequest = defineMiddleware(async ({ url, locals, redirect, cookies }, next) => {
  // Check for session cookie
  const sessionCookie = cookies.get('auth_session');
  let user = null;

  if (sessionCookie?.value) {
    try {
      user = JSON.parse(sessionCookie.value);
    } catch (e) {
      // Invalid cookie
    }
  }

  const isLoggedIn = !!user;

  locals.isLoggedIn = isLoggedIn;

  locals.userInfo = isLoggedIn ? {
    userName: user?.displayName,
    userEmail: user?.email,
    userPhoto: user?.photoURL
  } : null

  // Only fetch YouTube data on pages that display it (skip /miembros/* for speed)
  const shouldFetchVideo = !url.pathname.startsWith('/miembros');

  if (shouldFetchVideo) {
    // 1. Try to get from Cookie first (Fastest! ⚡)
    const cachedCookie = cookies.get('yt_latest_video');
    let foundInCookie = false;

    if (cachedCookie?.value) {
      try {
        const cachedData = JSON.parse(cachedCookie.value);
        if (cachedData.videoId && cachedData.title) {
          locals.videoId = cachedData.videoId;
          locals.videoTitle = cachedData.title;
          foundInCookie = true;
        }
      } catch (e) {
        // Cookie invalid, ignore
      }
    }

    // 2. If not in cookie, fetch from API (or memory cache)
    if (!foundInCookie) {
      const videoData = await getLatestVideo();
      if (videoData) {
        locals.videoId = videoData.videoId;
        locals.videoTitle = videoData.title;

        // Cache in cookie for 1 hour
        cookies.set('yt_latest_video', JSON.stringify(videoData), {
          path: '/',
          maxAge: 3600, // 1 hour duration
          sameSite: 'lax'
        });
      }
    }
  } else {
    // Set fallback for member pages (not displayed anyway)
    locals.videoId = 'd0HIs_vBf30'; // fallback
    locals.videoTitle = '';
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