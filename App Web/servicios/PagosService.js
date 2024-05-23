import { urlAPILocalHost, urlAPIProduction } from "./EndPointsService.js";

export class PagosService {
    #urlPagos = urlAPIProduction + "/api/pagos";

    async getPagos(token) {
        try {
            let res = await fetch(this.#urlPagos, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }).catch((err) => {
                return null;
            });

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
            return null;
        }
    }

    async postPago(token, pago) {
        try {
            const requestOptions = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(pago),
            };

            // Enviar información del boleto
            const res = await fetch(this.#urlPagos, requestOptions);
            if (res.ok) {
                // La información del boleto se envió correctamente
                return await res.json();
            } else {
                // La información del boleto no se envió correctamente
                const error = await res.json();
                console.log(error);
                return error;
            }
        } catch (error) {
            // Manejar errores de red u otros errores
            console.error("Error en la solicitud:", error);
            return error;
        }
    }

    async getPagosPorIdUsuario(token, idUsuario) {
        try {
            let res = await fetch(`${this.#urlPagos}/usuario/${idUsuario}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }).catch((err) => {
                console.log(err);
                return null;
            });

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
            return null;
        }
    }
}
