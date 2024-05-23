import { AsientosService } from "../servicios/AsientosService.js";
import { CookiesService } from "../servicios/CookiesService.js";

export class RegistroAsientoComponent extends HTMLElement {

    #asientosService = new AsientosService();
    #cookiesService = new CookiesService();

    constructor() {
        super();
        this.asientos;
        this.token;
    }

    async #validarSesion() {
        try {
            this.token = this.#cookiesService.getCookieSession('cookieSesion');
            this.asientos = await this.#asientosService.getAsientos(this.token);
        } catch (error) {
            console.log(error);
            alert('Hubo un error al cargar los asientos');
            window.location.href = "iniciar-sesion.html";
        }
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        await this.#validarSesion();
        this.#render(shadow);
        this.#agregarEstilos(shadow);
        this.#agregarJS(shadow);
        this.#handlerEvents(shadow);
        
    }

    #handlerEvents(shadow){
        // Agregar el controlador de eventos al formulario
        const formulario = shadow.querySelector('form');
        formulario.addEventListener('submit', (event) => this.#handleFormSubmit(event));
    }

    #render(shadow) {
        // Inserta el HTML dentro del Shadow DOM
        shadow.innerHTML = `
<body id="page1">
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
                                        <h2>Registra tus Asientos</h2>
                                    </div>
                                        <form>
                                            <div class="contenido">
                                                <input type="text" name="" id="fila-asiento" placeholder="Fila" required>
                                                <input type="number" name="" id="fila-numero" placeholder="Número" required>
                                                <select id="asientoTipo">
                                                    <option value="" disabled selected>Selecciona un tipo de asiento</option>
                                                    <option value="NORMAL">NORMAL</option>
                                                    <option value="VIP">VIP</option>
                                                    <option value="VIP+">VIP+</option>
                                                    <option value="ELITE">ELITE</option>
                                                    <option value="PREMIUM">PREMIUM</option>
                                                </select>

                                                <button type="submit" class="btn-comprar">Registrar Asiento</button>

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
</body>
`;
    }

    async #handleFormSubmit(evento) {
        evento.preventDefault();

        // Obtener referencias a los elementos del formulario
        const filaInput = this.shadowRoot.getElementById('fila-asiento');
        const numeroInput = this.shadowRoot.getElementById('fila-numero');
        const tipoAsientoSelect = this.shadowRoot.getElementById('asientoTipo');

        // Obtener los valores de los campos
        const fila = filaInput.value.trim();
        const numero = numeroInput.value.trim();
        const tipo = tipoAsientoSelect.value;

        if (!this.#validarFormulario(fila, numero, tipo)) {
            return;
        }

        const data = {
            tipo,
            filaYNumero: `${fila.toUpperCase()}${numero}`
        }

        const res = await this.#registrarAsiento(data)

        if (res && res.idAsiento) {
            alert('Se registró éxitosamente el asiento.')
            location.reload();
            return;
        }

        console.log(res);
        alert('Ocurrió un error al guardar el asiento');

    }

    async #registrarAsiento(data) {
        return await this.#asientosService.postAsiento(data, this.token);
    }

    #validarFormulario(fila, numero, tipoAsiento) {
        // Validar la fila
        const filaRegex = /^[A-Za-z]{1,2}$/;
        if (!filaRegex.test(fila)) {
            alert('La fila debe contener de 1 a 2 letras (A-Z).');
            return false;
        }

        // Validar el número
        const numeroRegex = /^(?:[1-9]|[1-9][0-9]|99)$/;
        if (!numeroRegex.test(numero)) {
            alert('El número debe ser un valor numérico entre 1 y 99.');
            return false;
        }

        // Validar el tipo de asiento
        if (tipoAsiento === '') {
            alert('Por favor, selecciona un tipo de asiento.');
            return false;
        }

        // Validación adicional para el tipo de asiento seleccionado
        if (tipoAsiento === 'Selecciona un tipo de asiento') {
            alert('Por favor, selecciona un tipo de asiento válido.');
            return false;
        }

        return true;
    }


    #agregarEstilos(shadow) {
        // Agrega estilos específicos al Shadow DOM
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "/App Web/carrito/carrito.css");

        let link2 = document.createElement("link");
        link2.setAttribute("rel", "stylesheet");
        link2.setAttribute("href", "/App Web/css/style.css");

        let link3 = document.createElement("link");
        link3.setAttribute("rel", "stylesheet");
        link3.setAttribute("href", "/App Web/css/ie6.css");

        let link4 = document.createElement("link");
        link4.setAttribute("rel", "stylesheet");
        link4.setAttribute("href", "https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css");

        let link5 = document.createElement("link");
        link5.setAttribute("rel", "stylesheet");
        link5.setAttribute("href", "/App Web/asientos/asientos.css");

        let link6 = document.createElement("link");
        link6.setAttribute("rel", "stylesheet");
        link6.setAttribute("href", "/App Web/sesion/sesion.css");

        shadow.appendChild(link);
        shadow.appendChild(link2);
        shadow.appendChild(link3);
        shadow.appendChild(link4);
        shadow.appendChild(link5);
        shadow.appendChild(link6);

    }

    #agregarJS(shadow) {
        let link = document.createElement("link");
        link.setAttribute("type", "text/javascript");
        link.setAttribute("href", "https://code.jquery.com/jquery-3.2.1.slim.min.js");
        link.setAttribute("integrity", "sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN");
        link.setAttribute("crossorigin", "anonymous");

        let link2 = document.createElement("link");
        link2.setAttribute("type", "text/javascript");
        link2.setAttribute("href", "https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js");
        link2.setAttribute("integrity", "sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q");
        link2.setAttribute("crossorigin", "anonymous");

        let link3 = document.createElement("link");
        link3.setAttribute("type", "text/javascript");
        link3.setAttribute("href", "https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js");
        link3.setAttribute("integrity", "sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl");
        link3.setAttribute("crossorigin", "anonymous");

        shadow.appendChild(link);
        shadow.appendChild(link2);
        shadow.appendChild(link3);

    }
}