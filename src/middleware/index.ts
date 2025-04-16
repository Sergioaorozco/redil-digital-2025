import { defineMiddleware } from "astro:middleware";

const privateRoutes = ['/membresia'];

export const onRequest = defineMiddleware(async ({url, request}, next) => {
    return next();
})