import { AsientosService } from "../servicios/AsientosService.js";
import { BoletosService } from "../servicios/BoletosService.js";
import { CarritoCompraService } from "../servicios/CarritoCompraService.js";
import { CookiesService } from "../servicios/CookiesService.js";

export class SeleccionComponent extends HTMLElement {

    #asientosService = new AsientosService();
    #boletosService = new BoletosService();
    #carritoCompraService = new CarritoCompraService();
    #cookiesService = new CookiesService();

    constructor() {
        super()
        this.token;
        this.asiento;
        this.boleto;

        this.idEvento;
        this.idAsiento = ""; // Variable para almacenar la fila seleccionada.
        this.idBoleto = ""; // Variable para almacenar el tipo de boleto seleccionado.
        this.precioSeleccionado; // Variable para almacenar el precio de boleto seleccionado.
    }

    // Este método se encargará de obtener el evento seleccionado.
    #obtenerEvento() {
        let urlActual = new URL(window.location.href);

        // Obtener parámetros de la URL
        let idEvento = urlActual.searchParams.get("idEvento");

        let nombreEvento = urlActual.searchParams.get("nombre");

        let img = urlActual.searchParams.get("img");

        this.idEvento = idEvento;
        return { idEvento, nombreEvento, img };
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        const { nombreEvento, img } = this.#obtenerEvento();
        this.token = this.#cookiesService.getCookieSession('cookieSesion');
        try {
            this.asientos = await this.#asientosService.getAsientos(this.token);
            this.boletos = await this.#boletosService.getBoletos(this.token);
        } catch (error) {
            console.log(error);
            alert('Ocurrió un error al obtener los boletos, Inicie sesión otra vez por favor.');
            window.location.href = "iniciar-sesion.html";
        }

        this.#render(shadow, nombreEvento, img);
        this.#agregarEstilos(shadow);

        await this.#cargarBoletosDisponibles();

        // Agregar manejador de eventos al botón "Añadir al Carrito"
        const btnAgregarCarrito = this.shadowRoot.querySelector('.btn-comprar');
        btnAgregarCarrito.addEventListener('click', () => this.#agregarAlCarrito());
    }

    #render(shadow, nombreEvento, img) {
        // Aquí se va a insertar todo el HTML
        shadow.innerHTML += `
            
  <body id="page4">
    <!-- START PAGE SOURCE -->
    <div class="tail-top">
        <div class="tail-bottom">
            <div id="main">
                <div id="header">
                    <div class="row-1">
                        <div class="fleft"><a href="#">Selecciona tus <span>Boletos</span></a></div>

                    </div>

                </div>
                <div id="content">
                    <div class="line-hor"></div>
                    <div class="box">
                        <div class="border-right">
                            <div class="border-left">
                                <div class="caja-img">
                                    <img src="/App Web/images/asientos.png" alt="" class="img-asientos" />
                                </div>
                                
                                <div class="caja">

                                    <div class="eventoData">
                                        <img src="/App Web/images/eventos/${img}">
                                        <h3><span>${nombreEvento ? nombreEvento : "Nombre Evento"}</span></h3>
                                    </div>
                                    

                                    <div class="contenido">
                                        <!-- Todos los elementos del formulario y el botón -->
                                        <p class="parrafo">Boletos Disponibles</p>

                                        <select id="filaYNumero" name="fila">
                                            <option selected value="0">Fila</option>
                                        </select>
                                        <input type="text" disabled name="" id="tipoBoleto" placeholder="Tipo de Boleto" required>
                                        <input type="text" disabled name="" id="precioBoleto" placeholder="Precio del Boleto" required>


                                        <button type="button" class="btn-comprar">Añadir al Carrito</button>
                                    </div>
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

    async #cargarBoletosDisponibles() {
        const filaYNumero = this.shadowRoot.getElementById('filaYNumero');
        const tipoBoleto = this.shadowRoot.getElementById('tipoBoleto');
        const precioBoleto = this.shadowRoot.getElementById('precioBoleto');

        // Filtrar los asientos disponibles del evento seleccionado (con boletos en estado "DISPONIBLE")
        const asientosDisponibles = this.asientos.filter(asiento => {
            const boletoAsociado = this.boletos.find(boleto => boleto.idAsiento === asiento.idAsiento && boleto.idEvento === parseInt(this.idEvento));
            return boletoAsociado && boletoAsociado.estado === 'DISPONIBLE';
        });

        // Extraer filas únicas de los asientos disponibles
        const filasDisponibles = [...new Set(asientosDisponibles.map(asiento => asiento.filaYNumero))];

        // Crear opciones dinámicamente y agregarlas al select
        filasDisponibles.forEach(fila => {
            const option = document.createElement('option');
            option.value = fila;
            option.text = fila;
            filaYNumero.appendChild(option);
        });

        // Añadir evento change al select
        filaYNumero.addEventListener('change', (event) => {
            const filaYNumeroSeleccionado = event.target.value;

            // Encontrar el asiento correspondiente
            const asientoSeleccionado = asientosDisponibles.find(asiento => asiento.filaYNumero === filaYNumeroSeleccionado);

            // Encontrar el boleto asociado al asiento
            const boletoAsociado = this.boletos.find(boleto => boleto.idAsiento === asientoSeleccionado.idAsiento && boleto.idEvento === parseInt(this.idEvento));
            
            // Actualizar los campos del formulario
            tipoBoleto.value = boletoAsociado.idAsiento_asiento.tipo;
            precioBoleto.value = `$${boletoAsociado.precio} MXN`;

            this.idAsiento = boletoAsociado.idAsiento;
            this.idBoleto = boletoAsociado.idBoleto;
            this.precioSeleccionado = boletoAsociado.precio;
        });
    }


    async #agregarAlCarrito() {

        

        // Verificar si se han seleccionado los datos necesarios
        if (!this.idAsiento || !this.idBoleto || !this.precioSeleccionado) {
            alert('Seleccione una fila y un tipo de boleto antes de agregar al carrito.');
            return;
        }

        // Crear un objeto boleto con los datos seleccionados
        const boletoSeleccionado = {
            idBoleto: this.idBoleto,
            idAsiento: this.idAsiento,
            precio: parseInt(this.precioSeleccionado)
        };

        const idBoleto = boletoSeleccionado.idBoleto;
        const boletos = [{
            idBoleto
        }]

        // Primero obtenemos el id del usuario para poder obtener su carrito de compra.
        const idUsuario = this.#cookiesService.decodeJwt(this.token).idUsuario;
        
        // Obtenemos su carrito de compra.
        const idCC = await this.#carritoCompraService.getCarritoCompraPorIDUsuario(this.token, idUsuario);
        
        const res = await this.#carritoCompraService.agregarBoletosACarritoCompra(this.token, idCC.idCarrito_Compra, boletos)
        
        if (res && res.message == 'Boletos Agregados con éxito'){
            alert(res.message);
            window.location.href = "carrito.html"
            return;
        }
        console.log(res);
        alert(res.message);

        // Limpiar las variables después de agregar al carrito si es necesario
        this.filaSeleccionada = "";
        this.tipoBoletoSeleccionado = "";
        this.precioSeleccionado = "";
    }



    // Se agregan los estilos al HTML.
    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "/App Web/seleccion/seleccion.css");

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