import { AsientosService } from "../servicios/AsientosService.js";
import { CookiesService } from "../servicios/CookiesService.js";

export class AsientoComponent extends HTMLElement {

    #asientosService = new AsientosService();
    #cookiesService = new CookiesService();

    constructor() {
        super();
        this.asientos;
        this.token;
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        this.token = this.#cookiesService.getCookieSession('cookieSesion');
        try {
            this.asientos = await this.#asientosService.getAsientos(this.token);
        } catch (error) {
            console.log(error);
            alert('Hubo un error al cargar los asientos');
            window.location.href = "iniciar-sesion.html";
        }
        this.#render(shadow);
        this.#agregarEstilos(shadow);
        this.#agregarJS(shadow);

        // Agregar el controlador de eventos a los botones eliminar
        shadow.querySelectorAll('.btn-danger').forEach(btn => {
            btn.addEventListener('click', (event) => this.#eliminarAsiento(event));
        });


    }

    #render(shadow) {
        // Inserta el HTML dentro del Shadow DOM
        shadow.innerHTML = `
<body id="page1">
    <div class="tail-top">
        <div class="tail-bottom">
            <div id="main">
                <div class="tabla-asientos">
                <table class="table table-dark">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Fila</th>
                        <th scope="col">Número</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Acción</th>
                        </tr>
                    </thead>
                    ${this.#cargarAsientosEnTabla()}
                </table>
                </div>
                
            </div>
        </div>
    </div>
</body>
`;
    }

    #cargarAsientosEnTabla() {
        // Utilizamos el método map para crear un array de strings HTML
        const filasHTML = this.asientos.map((asiento, index) => {
            return `
            <tr>
                <th scope="row">${index + 1}</th>
                <td>${this.#separarFilaYNumero(asiento.filaYNumero).fila}</td>
                <td>${this.#separarFilaYNumero(asiento.filaYNumero).numero}</td>
                <td>${asiento.tipo}</td>
                <td><button type="button" class="btn btn-danger" data-id="${asiento.idAsiento}">Eliminar</button></td>
            </tr>
        `;
        });

        // Concatenamos los strings HTML y los devolvemos
        return filasHTML.join('');
    }

    async #eliminarAsiento(evento) {
        var confirmacion = confirm("¿Estás seguro de que quieres eliminar el asiento? Esta acción es irreversible");

        if (!confirmacion) return;

        const idAsiento = evento.target.dataset.id;

        const res = await this.#asientosService.deleteAsiento(idAsiento, this.token);

        if (res && res.idAsiento) {
            alert('Se eliminó éxitosamente el asiento.')
            location.reload();
            return;
        }

        console.log(res);
        alert(res.message);
    }


    // Función para separar la fila y el número
    #separarFilaYNumero(cadena) {
        // Encuentra la posición del primer número en la cadena
        const indiceNumero = cadena.search(/\d/);

        // Separa la cadena en Fila y Número
        const fila = cadena.substring(0, indiceNumero);
        const numero = cadena.substring(indiceNumero);

        return { fila, numero };
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