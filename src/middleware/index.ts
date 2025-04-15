import type { MiddlewareNext } from "astro";
import { defineMiddleware } from "astro:middleware";

const privateRoutes = ['/membresia'];

export const onRequest = defineMiddleware(async ({url, request}, next) => {

    const authHeaders = request.headers.get('Authorization') ?? '';

    if(privateRoutes.includes(url.pathname)){
        return checkLocalAuth(authHeaders, next )
    }
    return next();
})

const checkLocalAuth = ( authHeaders:string, next:MiddlewareNext) => {
    if(authHeaders) {
        const authValue = authHeaders.split(' ').at(-1) ?? 'user:pass';
        const decodedValue = atob(authValue).split(':');
        const [user, pass] = decodedValue;
    
        if(user === 'admin' && pass === '1234') {
            console.log(user, pass);
            return next();
        }
    }

    return new Response('Autorizacion Requerida', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Secure Area"'
        }
    })
}