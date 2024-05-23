import { CarritoCompraService } from "../servicios/CarritoCompraService.js";
import { EventosService } from "../servicios/EventosService.js";
import { PagosService } from "../servicios/PagosService.js";
import { BoletosService } from "../servicios/BoletosService.js";
import { CookiesService } from "../servicios/CookiesService.js";

export class CarritoComponent extends HTMLElement {

    #carritoServices = new CarritoCompraService();
    #eventosServices = new EventosService();
    #pagosServices = new PagosService();
    #boletosServices = new BoletosService();
    #cookiesServices = new CookiesService();

    constructor() {
        super();
        this.boletosEnCarrito;
        this.carritoCompra;
        this.idUsuario;
        this.token;

        this.total = 0;
        this.subtotal = 0;
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        this.token = this.#cookiesServices.getCookieSession('cookieSesion');
        this.idUsuario = this.#cookiesServices.decodeJwt(this.token).idUsuario;
        this.carritoCompra = await this.#obtenerCarritoCompraPorIDUsuario();
        this.boletosEnCarrito = await this.#obtenerBoletosEnCarritoCompra();

        await this.#render(shadow);
        this.#agregarEstilos(shadow);
        this.#handlerEvents(shadow);
        
        
    }

    #handlerEvents(shadow){
        // Obtener todos los elementos con la clase 'event-container'
        const cardsEventos = shadow.querySelectorAll('.event-container');
        const cardPagarCarrito = shadow.querySelector('#pagarCarrito');


        // Agregar el evento click a cada elemento
        cardsEventos.forEach(card => {
            card.addEventListener('click', () => {
                // Obtener el idBoleto del atributo data-idboleto
                const idBoleto = card.getAttribute('data-idboleto');

                if (idBoleto) {
                    // Llamar a la función de manejo de clics con el idBoleto
                    const boletos = [{
                        idBoleto: parseInt(idBoleto)
                    }];

                    if (confirm('¿Estás seguro de eliminar el boleto del carrito?')) this.#handleDeleteBoletoDeCarrito(boletos);
                }

                

            });
        });
        const selectElement = cardPagarCarrito.querySelector('select');

        if (selectElement) {
            selectElement.addEventListener('click', (event) => {
                event.stopPropagation(); // Detener la propagación del evento
            });
        }
        if (this.boletosEnCarrito.length != 0) {
            cardPagarCarrito.addEventListener('click', () => this.#handlePagarCarrito(shadow));
        }
    }

    async #obtenerBoletosEnCarritoCompra() {
        return await this.#carritoServices.getBoletosDeUnCarritoCompra(this.token, this.carritoCompra.idCarrito_Compra);
    }

    async #obtenerCarritoCompraPorIDUsuario() {
        return await this.#carritoServices.getCarritoCompraPorIDUsuario(this.token, this.idUsuario);
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
                        ${await this.#cargarEventosEnCarrito()}
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
`;
    }

    async #cargarEventosEnCarrito() {
        if(this.boletosEnCarrito.length == 0){
            return this.#cargarCarroVacio();
        }

        let htmlCarritoBoletos = await Promise.all(this.boletosEnCarrito.map(async (boleto) => {
            const evento = await this.#obtenerEventoPorID(boleto.idBoleto_boleto.idEvento);
            const boletosDeEvento = await this.#boletosServices.getBoletosPorIdEvento(this.token, evento.idEvento)

            const { boletosDisponibles, boletosVendidos } = boletosDeEvento.reduce((result, boleto) => {
                if (boleto.estado === 'DISPONIBLE') {
                    result.boletosDisponibles.push(boleto);
                } else if (boleto.estado === 'VENDIDO') {
                    result.boletosVendidos.push(boleto);
                }
                return result;
            }, { boletosDisponibles: [], boletosVendidos: [] });
            
            
            return `<br><br><br><br>
            <div class="event-container" data-idboleto="${boleto.idBoleto}">
                <div class="image-event">
                    <img src="/App Web/images/eventos/${evento.nombreImagen}" alt="">
                </div>
                <div class="event-details">
                    <div class="column-event">
                        <p>${evento.nombre}</p>
                        <p>${this.#formatearFecha(evento.fecha)}</p>
                        <p>${evento.lugar}</p>
                    </div>
                    <div class="column-event">
                        <p>BOLETOS DISPONIBLES: ${boletosDisponibles.length}</p>
                        <p>BOLETOS VENDIDOS: ${boletosVendidos.length}</p>
                        <p>PRECIO: $${boleto.idBoleto_boleto.precio} MXN</p>
                    </div>
                </div>
            </div>`;
        }));

        this.subtotal = parseFloat(this.boletosEnCarrito.reduce((acumulador, boleto) => acumulador + parseFloat(boleto.idBoleto_boleto.precio), 0)).toFixed(2);
        const iva = parseFloat((this.subtotal * 0.16)).toFixed(2);
        this.total = parseFloat((parseFloat(this.subtotal) + parseFloat(iva))).toFixed(2);
        // Agregamos la tarjeta para pagar
        htmlCarritoBoletos += `
            <br><br><br><br><br><br><br>
            <div class="event-container" id="pagarCarrito">
                <div class="image-event">
                    <img src="/App Web/images/icono-boleteria2.png" alt="">
                </div>
                <div class="event-details">
                    <div class="column-event">
                        <p>SUBTOTAL: $${this.subtotal} MXN</p>
                        <p>IVA (16%): $${iva} MXN</p>
                        <p>TOTAL: $${this.total} MXN</p>
                        <select id="metodoPago">
                            <option selected value="0">Método de pago</option>
                            <option value="BBVA">BBVA</option>
                            <option value="BANCO AZTECA">Banco Azteca</option>
                            <option value="BANORTE">Banorte</option>
                            <option value="HSBC">HSBC</option>
                            <option value="SANTANDER">Santander</option>
                            <option value="PAYPAL">PayPal</option>
                        </select>
                    </div>
                </div>
            </div>
            <br><br><br><br><br><br><br>
            `;

        return htmlCarritoBoletos;
    }

    #cargarCarroVacio(){
        return `
            <br><br><br><br><br><br><br>
            <div class="event-container">
                <div class="image-event">
                    <img src="/App Web/images/carrito.png" alt="">
                </div>
                <div class="event-details">
                    <div class="column-event">
                        <p>---------------------------------------</p>
                        <p>¡Tú carrito está vacío! :(</p>
                        <p>---------------------------------------</p>
                        
                    </div>
                </div>
            </div>
            <br><br><br><br><br><br><br>
            `
    }

    async #handlePagarCarrito(shadow) {
        const metodoPago = shadow.querySelector('#metodoPago').value;

        if (metodoPago == '0') {
            alert('Seleccione un método de pago, por favor.');
            return;
        }

        let confirmacion = confirm(`Estás a punto de realizar el pago de tu carrito, con método de pago ${metodoPago}`);

        if (!confirmacion) return;

        const boletosMapeados = this.#mapearBoletos(this.boletosEnCarrito);

        const pago = {
            idUsuario: this.idUsuario,
            metodo: metodoPago,
            fecha: this.#formatLocalDate(new Date()),
            boletos: boletosMapeados
        }


        const res = await this.#pagosServices.postPago(this.token, pago);

        if(res && res.idPago){
            console.log(res);
            alert('¡Gracias por su compra! :)');
            // Redirigimos a mis compras...

            window.location.href = "mis-compras.html";
            return;
        } 

        alert('Uno de tus boletos en tu carrito ya ha sido vendido. Te lo ganaron miapa :(')
    }

    #formatLocalDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    #mapearBoletos(boletos){
        const boletosTransformados = boletos.map(boletoOriginal => {
            const { idBoleto_boleto } = boletoOriginal;
            return {
                idBoleto: idBoleto_boleto.idBoleto,
                idEvento: idBoleto_boleto.idEvento,
                idAsiento: idBoleto_boleto.idAsiento,
                precio: parseFloat(idBoleto_boleto.precio), // Convertir a centavos
                estado: idBoleto_boleto.estado
            };
        });

        return boletosTransformados;
    }

    async #handleDeleteBoletoDeCarrito(boletos) {
        const res = await this.#carritoServices.deleteACarritoCompra(this.token, this.carritoCompra.idCarrito_Compra, boletos);

        if (res) {
            console.log(res);
            alert(res.message);
            location.reload();
        }
    }

    async #obtenerEventoPorID(idEvento) {
        return await this.#eventosServices.getEventoPorID(this.token, idEvento);
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