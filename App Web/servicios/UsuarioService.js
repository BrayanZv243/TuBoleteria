import { urlAPILocalHost, urlAPIProduction } from "./EndPointsService.js";

export class UsuariosService {
    #urlUsuarios = urlAPIProduction + "/api/usuarios";

    async getUsuarios(token) {
        try {
            let res = await fetch(this.#urlUsuarios, {
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

    async getUsuarioPorID(token, idUsuario) {
        try {
            let res = await fetch(`${this.#urlUsuarios}/${idUsuario}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }).catch((err) => {
                return err;
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
            return error;
        }
    }

    async putUsuario(token, idUsuario, datosActualizados) {
        try {
            const res = await fetch(`${this.#urlUsuarios}/${idUsuario}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datosActualizados),
            });
            if (res && res.ok) {
                // La solicitud fue exitosa (código de respuesta 200-299)
                const responseData = await res.json();
                return responseData;
            } else {
                // La solicitud no fue exitosa
                const errorData = await res.json();
                console.error("Error en la solicitud:", errorData);
                return errorData;
            }
        } catch (error) {
            // Manejar errores de red u otros errores
            console.error("Error en la solicitud:", error);
            return error;
        }
    }

    async deleteUsuario(token, idUsuario) {
        try {
            const res = await fetch(`${this.#urlUsuarios}/${idUsuario}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (res && res.ok) {
                // La solicitud fue exitosa (código de respuesta 200-299)
                const responseData = await res.json();
                return responseData;
            } else {
                // La solicitud no fue exitosa
                const errorData = await res.json();
                console.error("Error en la solicitud:", errorData);
                return errorData;
            }
        } catch (error) {
            // Manejar errores de red u otros errores
            console.error("Error en la solicitud:", error);
            return error;
        }
    }
}
