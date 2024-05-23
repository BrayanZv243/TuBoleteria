import { urlAPILocalHost, urlAPIProduction } from "./EndPointsService.js";

export class CarritoCompraService {
    #urlCarritoCompra = urlAPIProduction + "/api/carrito-compras";

    async getCarritoCompraPorIDUsuario(token, idUsuario) {
        try {
            let res = await fetch(
                `${this.#urlCarritoCompra}/usuario/${idUsuario}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            ).catch((err) => {
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

    async getBoletosDeUnCarritoCompra(token, idCarritoCompra) {
        try {
            let res = await fetch(
                `${this.#urlCarritoCompra}/${idCarritoCompra}/boletos`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            ).catch((err) => {
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

    async agregarBoletosACarritoCompra(token, idCarritoCompra, boletos) {
        try {
            const requestOptions = {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(boletos),
            };

            // Enviar información del boleto
            const res = await fetch(
                `${this.#urlCarritoCompra}/${idCarritoCompra}/boletos`,
                requestOptions
            );
            if (res.ok) {
                // La información del boleto se envió correctamente
                return await res.json();
            } else {
                // La información del boleto no se envió correctamente
                const error = await res.json();
                return error;
            }
        } catch (error) {
            // Manejar errores de red u otros errores
            console.error("Error en la solicitud:", error);
        }
    }

    async deleteACarritoCompra(token, idCarritoCompra, boletos) {
        try {
            const requestOptions = {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(boletos),
            };

            // Enviar información del boleto
            const res = await fetch(
                `${this.#urlCarritoCompra}/${idCarritoCompra}/boletos`,
                requestOptions
            );
            if (res.ok) {
                // La información del boleto se envió correctamente
                return await res.json();
            } else {
                // La información del boleto no se envió correctamente
                const error = await res.json();
                return error;
            }
        } catch (error) {
            // Manejar errores de red u otros errores
            console.error("Error en la solicitud:", error);
        }
    }
}
