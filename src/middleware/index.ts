import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (request, next) => {
    console.log('middleware');
    return next();
})