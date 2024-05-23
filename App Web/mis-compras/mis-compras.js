import { PagosService } from "../servicios/PagosService.js";
import { ComprasService } from "../servicios/ComprasService.js";
import { CookiesService } from "../servicios/CookiesService.js";

export class MisComprasComponent extends HTMLElement {

    #comprasServices = new ComprasService();
    #pagosServices = new PagosService();
    #cookiesServices = new CookiesService();

    constructor() {
        super();
        this.idUsuario;
        this.token;
        this.pagos;
        this.compras;
        this.boletos;

        this.total = 0;
        this.subtotal = 0;
    }

    async #obtenerMisPagos() {
        this.pagos = await this.#pagosServices.getPagosPorIdUsuario(this.token, this.idUsuario);
    }

    async #obtenerMisBoletos() {
        // Obtenemos todas las compras.
        this.compras = await this.#comprasServices.getCompras(this.token);


        // Obtenemos todos los boletos que se han comprado.
        this.boletos = await this.#comprasServices.obtenerTodosLosBoletosComprados(this.token);

    }

    #mapearInformacion() {
        const comprasModificadas = this.compras.map(compra => {
            const pagoAsociado = this.compras.find(pago => pago.idPago === compra.idPago);
            const boletosAsociados = this.boletos.filter(chb => chb.idCompra === compra.idCompra);

            // Guardar una copia de idPago_pago antes de eliminarlo
            const idPagoPago = compra.idPago_pago;
            delete compra.idPago_pago;

            // Mapear boletosAsociados para renombrar propiedades
            const boletosModificados = boletosAsociados.map(boleto => {
                const { idBoleto_boleto, ...boletoSinIdBoletoBoleto } = boleto;
                return {
                    ...boletoSinIdBoletoBoleto,
                    boleto: idBoleto_boleto,
                    evento: idBoleto_boleto.idEvento_evento,
                };
            });

            return {
                ...compra,
                pago: {
                    ...pagoAsociado,
                    idPago_pago: idPagoPago, // Restaurar idPago_pago en el objeto pago
                },
                boletos: boletosModificados,
            };
        });


        const comprasFiltradasPorUsuario = comprasModificadas.filter(compra => {
            const idUsuarioEnCompra = compra.pago.idPago_pago.idUsuario; // Ajusta esto según la estructura real de tu objeto pago
            return idUsuarioEnCompra === this.idUsuario;
        });

        return comprasFiltradasPorUsuario;
    }

    #validarSesion() {
        try {
            this.token = this.#cookiesServices.getCookieSession('cookieSesion');
            this.idUsuario = this.#cookiesServices.decodeJwt(this.token).idUsuario;
        } catch (error) {
            alert('No se pudo verificar la sesión, inicie para continuar.');
            window.location.href = "iniciar-sesion.html";
        }
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        this.#validarSesion();
        await this.#obtenerMisPagos();
        await this.#obtenerMisBoletos();
        this.compras = this.#mapearInformacion();
        await this.#render(shadow);
        this.#agregarEstilos(shadow);

        console.log(this.compras)
        this.#handleEvents(shadow);
        

    }

    #handleEvents(shadow){
        const masDetallesCompra = shadow.querySelectorAll('#masDetalles');
        masDetallesCompra.forEach((card)=>{
            const idCompra = card.getAttribute('data-idCompra');
            if (idCompra) card.addEventListener('click', () => this.#handleMasDetalles(idCompra));
        })
        
        
    }

    #handleMasDetalles(idCompra){
        const misComprasDetalles = `mis-compras-detalles.html?idCompra=${encodeURIComponent(idCompra)}`;

        // Abrir una nueva ventana o pestaña con la URL
        window.open(misComprasDetalles);

    }

    async #render(shadow) {
        // Inserta el HTML dentro del Shadow DOM
        shadow.innerHTML = `
<body id="page1">
    <div class="tail-top">
        <div class="tail-bottom">
            <div id="main">
                <div class="container-carrito">
                    <div class="carrito-info-event">
                        ${await this.#cargarMisCompras()}
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
`;
    }

    async #cargarMisCompras() {
        if (this.compras.length == 0) {
            return this.#cargarComprasVacio();
        }

        return this.compras.map((compra) => {
            console.log(compra)
            const pago = compra.pago.idPago_pago;
            return `
                <br><br><br><br>
            <div class="event-container" data-idCompra="${compra.idCompra}" id="masDetalles">
                <div class="image-event">
                    <img src="/App Web/images/${pago.metodo.toLowerCase()}.png" alt="">
                </div>
                <div class="event-details">
                    <div class="column-event">
                        <p>Pagaste: $${pago.monto} MXN</p>
                        <p>Método de Pago: ${pago.metodo}</p>
                        <p>Fecha de Compra: ${this.#formatearFecha(pago.fecha)}</p>
                    </div>
                </div>
            </div>
            <br><br><br><br>`
        }).join('');

    }

    #cargarComprasVacio() {
        return `
            <br><br><br><br><br><br><br>
            <div class="event-container">
                <div class="image-event">
                    <img src="/App Web/images/carrito.png" alt="">
                </div>
                <div class="event-details">
                    <div class="column-event">
                        <p>---------------------------------------</p>
                        <p>¡Aún no tienes compras! :(</p>
                        <p>---------------------------------------</p>
                        
                    </div>
                </div>
            </div>
            <br><br><br><br><br><br><br>
            `
    }

    #formatearFecha(fechaISO) {
        const opciones = { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };

        // Convertir la cadena ISO a un objeto de fecha
        const fecha = new Date(fechaISO);

        // Restar 7 horas
        fecha.setHours(fecha.getHours() + 7);

        // Formatear la fecha según las opciones proporcionadas
        const fechaFormateada = fecha.toLocaleString('es-ES', opciones);

        return fechaFormateada;
    }

    #agregarEstilos(shadow) {
        // "../css/style.css"
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

        shadow.appendChild(link);
        shadow.appendChild(link2);
        shadow.appendChild(link3);
    }
}