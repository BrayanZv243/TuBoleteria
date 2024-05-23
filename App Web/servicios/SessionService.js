import { urlAPILocalHost, urlAPIProduction } from "./EndPointsService.js";

export class SessionService {
    #urlLogin = urlAPIProduction + "/api/login";
    #urlRegisterUsers = urlAPIProduction + "/api/usuarios";

    async loginUserNormal(userData) {
        try {
            let res = await fetch(this.#urlLogin, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            }).catch((err) => console.log(err));
            if (res && res.ok) {
                // La solicitud fue exitosa (código de respuesta 200-299)
                const responseData = await res.json();

                return responseData;
            } else {
                if (res) {
                    // La solicitud no fue exitosa
                    return res.json();
                }
                return null;
            }
        } catch (error) {
            // Manejar errores de red u otros errores
            console.error("Error en la solicitud:", error);
        }
    }

    async registerUserNormal(userData) {
        try {
            let res = await fetch(this.#urlRegisterUsers, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            }).catch((err) => console.log(err));
            if (res && res.ok) {
                // La solicitud fue exitosa (código de respuesta 200-299)
                const responseData = await res.json();

                return responseData;
            } else {
                if (res) {
                    // La solicitud no fue exitosa
                    return res.json();
                }
                return null;
            }
        } catch (error) {
            // Manejar errores de red u otros errores
            console.error("Error en la solicitud:", error);
        }
    }

    getDataToken(token) {
        try {
            // Divide el token en sus partes: encabezado, carga útil y firma.
            const [header, payload, signature] = token.split(".");

            // Decodifica la carga útil (payload) que contiene la información del usuario.
            const decodedPayload = JSON.parse(atob(payload));

            return decodedPayload;
        } catch (error) {
            console.error("Error al decodificar el token:", error);
        }
    }
}
