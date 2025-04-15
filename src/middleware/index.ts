import { defineMiddleware } from "astro:middleware";

const privateRoutes = ['/membresia'];

export const onRequest = defineMiddleware(async ({url, request}, next) => {

    if(privateRoutes.includes(url.pathname)){
        return new Response('Autorizacion Requerida', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Secure Area"'
            }
        })
    }
    return next();
})