import { EventosService } from "../servicios/EventosService.js";
import { AsientosService } from "../servicios/AsientosService.js";
import { BoletosService } from "../servicios/BoletosService.js";
import { CookiesService } from "../servicios/CookiesService.js";

export class RegistroEventoComponent extends HTMLElement {

    #eventoServicio = new EventosService();
    #asientosService = new AsientosService();
    #boletosService = new BoletosService();
    #cookiesService = new CookiesService();


    constructor() {
        super()
        this.token;
        this.asientos = [];
        this.isActualizando = false;
        this.evento;
    }


    async #getAsientos(token) {
        this.asientos = await this.#asientosService.getAsientos(token);
        if (this.asientos.mensaje && this.asientos.statusCode === 403) {
            window.location.href = "/App Web/iniciar-sesion.html"
        }
    }

    #obtenerEventoPorURI() {
        const urlParams = new URLSearchParams(window.location.search);
        const informacionRecibida = urlParams.get('evento');
        const evento = JSON.parse(decodeURIComponent(informacionRecibida));
        return evento;
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        this.token = this.#cookiesService.getCookieSession('cookieSesion');

        this.#getAsientos(this.token)
            .then(() => {
                this.evento = this.#obtenerEventoPorURI();
                this.isActualizando = this.evento != null;
                this.#render(shadow);
                if (this.isActualizando) {
                    this.#llenarCamposActualizando(this.evento);
                }
                this.#agregarEstilos(shadow);
                // Agregar el controlador de eventos al formulario
                const registrarEvento = shadow.querySelector('#miFormulario');
                registrarEvento.addEventListener('submit', (event) => {
                    event.preventDefault(); // Evita la recarga automática de la página
                    event.stopPropagation();
                    this.#handleFormSubmit(event);
                });

            })
            .catch((err) => {
                console.log(err);
            });
    }

    #llenarCamposActualizando(evento) {
        // Obtener los valores del formulario
        this.shadowRoot.querySelector('#nombre-evento').value = evento.nombre;
        this.shadowRoot.querySelector('#lugar-evento').value = evento.lugar;
        const select = this.shadowRoot.getElementById("tipo-evento");
        const opcionPreseleccionada = select.querySelector(`option[value="${evento.tipo}"]`);
        opcionPreseleccionada ? opcionPreseleccionada.selected = true : false;

        const fechaEvento = new Date(evento.fecha);
        fechaEvento.setHours(fechaEvento.getHours() + 7);
        const formatoFecha = `${fechaEvento.getFullYear()}-${('0' + (fechaEvento.getMonth() + 1)).slice(-2)}-${('0' + fechaEvento.getDate()).slice(-2)}T${('0' + fechaEvento.getHours()).slice(-2)}:${('0' + fechaEvento.getMinutes()).slice(-2)}`;

        this.shadowRoot.querySelector('#fecha-evento').value = formatoFecha;

        this.shadowRoot.querySelector('#boletos-evento').value = evento.numBoletosDisponibles;

        this.shadowRoot.querySelector('#precio-boleto-evento').value = evento.boleto[0].precio;
    }

    #render(shadow) {
        // Aquí se va a insertar todo el HTML

        shadow.innerHTML += `
            
  <body id="page4">
    <!-- START PAGE SOURCE -->
    <div class="tail-top">
        <div class="tail-bottom">
            <div id="main">
                <div id="content">
                    <div class="line-hor"></div>
                    <div class="box">
                        <div class="border-right">
                            <div class="border-left">
                                <div class="caja">
                                    <div class="bienvenida">
                                        <img src="/App Web/images/icono-boleteria2.png" class="icono">
                                        <h2>${this.isActualizando ? 'Actualiza' : 'Registra'} tu evento</h2>
                                    </div>
                                        <form id="miFormulario">
                                            <div class="contenido">
                                                <input type="text" name="" id="nombre-evento" placeholder="Nombre" required>
                                                <input type="text" name="" id="lugar-evento" placeholder="Lugar" required>
                                                <select id="tipo-evento" name="tipoEvento">
                                                    <option value="CONCIERTO">Concierto</option>
                                                    <option value="DEPORTE">Deporte</option>
                                                    <option value="CONFERENCIA">Conferencia</option>
                                                    <option value="ARTE Y CULTURA">Arte y Cultura</option>
                                                    <option value="ENTRETENIMIENTO">Entretenimiento en Vivo</option>
                                                </select>
                                                <label for="fechaEvento" class="registro">Fecha del Evento:</label>
                                                <input type="datetime-local" id="fecha-evento" name="fecha-evento" required>

                                                <input type="number" name="" id="boletos-evento" placeholder="Boletos a Vender (MAX:${this.asientos.length})" required ${this.isActualizando ? 'disabled' : ''} min="0" max="${this.asientos.length}">
                                                <input type="number" name="" id="precio-boleto-evento" placeholder="Precio del Boleto MXN" required }>

                                                <label for="imagen" class="registro">Selecciona una imagen:</label>
                                                <input type="file" id="imagen-evento" name="imagen" accept="image/*" required>
                                                <button type="submit" id="registrarEvento" class="btn-comprar">${this.isActualizando ? 'Actualizar' : 'Registrar'} Evento</button>
                                            </div>
                                        </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- END PAGE SOURCE -->
</body>
        `
    }

    async #handleFormSubmit(event) {
        // Obtener los valores del formulario
        const nombre = this.shadowRoot.querySelector('#nombre-evento').value;
        const lugar = this.shadowRoot.querySelector('#lugar-evento').value;
        const tipo = this.shadowRoot.querySelector('#tipo-evento').value;
        const fechaInput = this.shadowRoot.querySelector('#fecha-evento').value;
        const numBoletosDisponibles = parseInt(this.shadowRoot.querySelector('#boletos-evento').value, 10);

        const precioBoleto = parseInt(this.shadowRoot.querySelector('#precio-boleto-evento').value, 10);

        // Obtener el archivo de imagen
        const imagenInput = this.shadowRoot.querySelector('#imagen-evento');
        const img = imagenInput.files[0];

        if (!img) {
            alert('Seleccione un archivo');
            return;
        }

        if (parseFloat(precioBoleto) < 0) {
            alert('Precio de boleto inválido.');
            return;
        }

        const nombreImagen = img.name;
        const formData = new FormData();

        formData.append('image', img);

        // Convertir la cadena de fecha a un objeto de fecha
        const fechaOriginal = new Date(fechaInput);

        // Restar 7 horas para mysql
        fechaOriginal.setHours(fechaOriginal.getHours() - 7);

        // Obtener la cadena de la nueva fecha en formato 'yyyy-MM-ddThh:mm'
        const fecha = this.#formatLocalDate(fechaOriginal);

        const data = {
            nombre,
            lugar,
            tipo,
            fecha,
            nombreImagen
        }

        if (!this.isActualizando) {
            const idEvento = await this.#registrarEvento(data, formData);
            if (!idEvento) return;
            const res = await this.#registrarBoletos(idEvento, precioBoleto, numBoletosDisponibles)
            if (!res && !res.idEvento) {
                console.log(res)
                alert('Ocurrió un error inesperado.');
                return;
            }
            alert('Se registró el evento y sus boletos correctamente.');
            window.location.href = "index.html";
        } else {
            // Obtenemos el nombre de la imagen a eliminar.
            const nombreImagenEliminar = this.#obtenerEventoPorURI().nombreImagen;

            const evento = await this.#actualizarEvento(this.evento.idEvento, data, formData, nombreImagenEliminar);
            const res = await this.#actualizarBoletos(this.evento.idEvento, this.evento.boleto[0].idBoleto, precioBoleto)

            if (res.status == 200) {
                alert('Se actualizó el evento correctamente');
                window.location.href = 'index.html';
            }

        }

    }

    #formatLocalDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    async #registrarEvento(data, formData) {

        const res = await this.#eventoServicio.postEvento(data, formData, this.token);
        const json = JSON.stringify(res);
        const evento = JSON.parse(json);

        if (res && res.status) {
            alert(res.message);
            return;
        }

        if (res && res.statusCode == 403) {
            window.location.href = "/App Web/iniciar-sesion.html"
            return;
        }

        return evento.idEvento;
    }

    async #actualizarEvento(idEvento, eventoData, formData, nombreImagenEliminar) {
        const res = await this.#eventoServicio.putEvento(idEvento, eventoData, formData, this.token, nombreImagenEliminar);
        const json = JSON.stringify(res);
        const evento = JSON.parse(json);

        if (res && res.status != 200) {
            alert(res.message);
            return;
        }

        return evento.idEvento;
    }

    async #registrarBoletos(idEvento, precio, numBoletosDisponibles) {
        return await this.#boletosService.postBoleto(this.token, idEvento, precio, this.asientos, numBoletosDisponibles);
    }

    async #actualizarBoletos(idEvento, idBoleto, precio) {
        return await this.#boletosService.putBoleto(idEvento, this.token, idBoleto, precio);
    }

    // Se agregan los estilos al HTML.
    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "/App Web/sesion/sesion.css");

        let link2 = document.createElement("link");
        link2.setAttribute("rel", "stylesheet");
        link2.setAttribute("href", "/App Web/css/style.css");

        let link3 = document.createElement("link");
        link3.setAttribute("rel", "stylesheet");
        link3.setAttribute("href", "/App Web/css/ie6.css");


        shadow.appendChild(link);
        shadow.appendChild(link2);
        shadow.appendChild(link3);

    }
}