export class CookiesService {
    constructor() {}

    getCookieSession(cookieName) {
        const name = cookieName + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(";");

        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i].trim();
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }

        return null;
    }

    decodeJwt(token) {
        // Dividir el token en partes (encabezado, payload, firma)
        var parts = token.split(".");
        var decodedPayload = null;

        if (parts.length === 3) {
            // Decodificar la parte de carga útil (payload)
            var payload = parts[1];
            decodedPayload = JSON.parse(atob(payload));
        }

        return decodedPayload;
    }

    setSessionCookie(name, value) {
        document.cookie = `${name}=${encodeURIComponent(value)};path=/`;
    }

    eliminarCookie(nombreCookie) {
        // Establece la fecha de expiración en el pasado
        document.cookie = `${nombreCookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}
