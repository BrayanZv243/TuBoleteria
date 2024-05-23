import { EventosService } from "../../servicios/EventosService.js";
import { SessionService } from "../../servicios/SessionService.js";
import { BoletosService } from "../../servicios/BoletosService.js";
import { CookiesService } from "../../servicios/CookiesService.js";

export class BoleteriaComponent extends HTMLElement {
    #eventosServices = new EventosService();
    #sessionService = new SessionService();
    #boletosService = new BoletosService();
    #cookiesService = new CookiesService();

    constructor() {
        super();
        this.eventos = [];
        this.boletos = [];
        this.tipoUsuario;
        this.isAdmin = false;
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        // Obtenemos la cookie con el token y lo validamos
        const token = this.#cookiesService.getCookieSession("cookieSesion");

        // Para validar se hace la petición a los eventos

        await this.#obtenerEventos(token);
        await this.#obtenerBoletos(token);
        this.#mapearBoletosAEventos();
        // Obtenemos el tipo de usuario para asignar los botones.
        this.tipoUsuario = this.#sessionService.getDataToken(token).rol;
        this.#render(shadow);
        this.#handlerEliminarEventos(shadow, token);
        this.#agregarEstilos(shadow);
        this.#agregarJS(shadow);
    }

    #handlerEliminarEventos(shadow, token) {
        // Agregar el controlador de eventos a los enlaces de eliminación
        const enlacesEliminar = shadow.querySelectorAll(".eliminarEvento");
        enlacesEliminar.forEach((enlaceEliminar) => {
            enlaceEliminar.addEventListener("click", (event) => {
                event.preventDefault(); // Evita la navegación estándar del enlace
                const idEvento = enlaceEliminar.getAttribute("data-idevento");
                this.#eliminarEvento(idEvento, token);
            });
        });
    }

    async #obtenerEventos(token) {
        const res = await this.#eventosServices.getEventos(token);
        if (res && !res.mensaje) {
            this.eventos = res;
        } else {
            // Si no es un token válido, lo redireccionamos al login.
            window.location.href = "/App Web/iniciar-sesion.html";
        }
    }

    async #eliminarEvento(idEvento, token) {
        // Pregunta al usuario si realmente desea eliminar los boletos
        const confirmacion = window.confirm(
            "¿Estás seguro de que deseas eliminar todos los boletos para este evento?"
        );

        if (!confirmacion) return null;

        // Preguntamos a la BD si ese evento ya ha vendido boletos.

        const boletosDeEvento =
            await this.#boletosService.getBoletosPorIdEvento(
                token,
                parseInt(idEvento)
            );

        const hasBoletosVendidos = boletosDeEvento.find(
            (boleto) => boleto.estado == "VENDIDO"
        );

        // Si ya ha vendido boletos, no se podrá eliminar.
        if (hasBoletosVendidos) {
            alert(
                "Ese evento ya ha vendido boletos, no se puede eliminar, se eliminará automáticamente cuando la fecha de estreno pase."
            );
            return;
        }

        // Primero eliminamos los boletos.
        const resBoletos = await this.#boletosService.deleteBoletosPorIdEvento(
            token,
            idEvento
        );

        if (resBoletos.statusCode != 200) {
            // Obtenemos todos los datos del evento seleccionado a eliminar.

            const eventoSeleccionado = this.eventos.find(
                (evento) => evento.idEvento === parseInt(idEvento)
            );
            console.log(eventoSeleccionado);
            const res = await this.#eventosServices.deleteEvento(
                eventoSeleccionado,
                token
            );

            alert("Evento eliminado correctamente.");
        } else {
            console.log(res);
        }
    }

    async #obtenerBoletos(token) {
        const res = await this.#boletosService.getBoletos(token);
        if (res && !res.mensaje) {
            this.boletos = res;
        } else {
            // Si no es un token válido, lo redireccionamos al login.
            window.location.href = "/App Web/iniciar-sesion.html";
        }
    }

    #mapearBoletosAEventos() {
        // Mapa para almacenar información de boletos por idEvento
        const boletosPorEvento = {};

        // Iterar sobre la lista de boletos y asignar la información al mapa
        this.boletos.forEach((boleto) => {
            const idEvento = boleto.idEvento;

            // Verificar si ya hay un objeto de boleto para este idEvento
            if (!boletosPorEvento.hasOwnProperty(idEvento)) {
                boletosPorEvento[idEvento] = [];
            }

            // Agregar el boleto al arreglo asociado al idEvento
            boletosPorEvento[idEvento].push({
                idBoleto: boleto.idBoleto,
                precio: boleto.precio,
            });
        });

        // Actualizar el array de eventos con la información de boletos
        this.eventos.forEach((evento) => {
            const idEvento = evento.idEvento;

            // Verificar si hay información de boletos asociada a este idEvento en el mapa
            if (boletosPorEvento.hasOwnProperty(idEvento)) {
                // Agregar el campo 'boleto' al objeto de evento
                evento.boleto = boletosPorEvento[idEvento];
            }
        });
    }

    #render(shadow) {
        this.isAdmin = this.tipoUsuario == "ADMIN";

        const botones = `
                    <div class="admin">
                        <div class="btn-admin">
                          <a href="registro-evento.html" class="link2">
                            <span><span>Agregar Evento</span></span>
                          </a>
                      </div>'

                      <div class="btn-admin">
                          <a href="asiento.html" class="link2">
                            <span><span>Agregar Asientos</span></span>
                          </a>
                      </div>'
                    </div>
                    `;
        const contenidoExtra = this.isAdmin ? botones : "";

        // Aquí se va a insertar todo el HTML
        shadow.innerHTML += `
            
<body id="page1">
<!-- START PAGE SOURCE -->
<div class="tail-top">
  <div class="tail-bottom">
    <div id="main">
      <div id="content">
        <div class="content">
            <h3>Explora los <span>Eventos</span></h3>
          <ul class="movies">
            ${this.#cargarEventosEnDOM()}
          </ul>
          ${contenidoExtra}
        </div>
      </div>
    </div>
  </div>
</div>
<!-- END PAGE SOURCE -->
</body>
</html>
        `;
    }

    #cargarEventosEnDOM() {
        let HTMLEvento = ``;

        this.eventos.forEach((evento) => {
            const encodedEvento = encodeURIComponent(JSON.stringify(evento));

            // Verifica si hay boletos disponibles
            const boletosDisponibles = this.boletos.filter(
                (boleto) =>
                    boleto.idEvento === evento.idEvento &&
                    boleto.estado === "DISPONIBLE"
            );

            try {
                HTMLEvento += `
            <div class="evento">
              <li>
                <div class="evento-data">
                  <h4>${evento.nombre}</h4>
                      ${
                          this.isAdmin
                              ? `<a href="registro-evento.html?evento=${encodedEvento}"><img class="img-icono" src="/App Web/images/editEvento.png"></a>`
                              : ""
                      }
                      ${
                          this.isAdmin
                              ? `<a href="" data-idevento="${evento.idEvento}" class="eliminarEvento"><img class="img-icono" src="/App Web/images/trash-icon.png"></a>`
                              : ""
                      }
                </div>
                
                <img class="img-evento" src="./images/eventos/${
                    evento.nombreImagen
                }" alt="imagen-evento"/>
                  <p class="blanco">${evento.lugar} - ${this.#formatearFecha(
                    evento.fecha
                )}</p>
                  <p class="blanco">Precio: $${
                      evento.boleto[0].precio
                  } MXN - Boletos Restantes: ${boletosDisponibles.length}</p>

                <div class="wrapper">
                  ${
                      boletosDisponibles.length > 0
                          ? `<a href='/App Web/seleccion.html?idEvento=${evento.idEvento}&nombre=${evento.nombre}&img=${evento.nombreImagen}' class="link2"><span><span>Añadir al carrito</span></span></a>`
                          : ""
                  }
                </div>              
              </li>
            </div>
        
        `;
            } catch (error) {
                console.log(error);
            }
        });

        return HTMLEvento;
    }

    #formatearFecha(fechaISO) {
        const opciones = {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        };

        // Convertir la cadena ISO a un objeto de fecha
        const fecha = new Date(fechaISO);

        // Restar 7 horas
        fecha.setHours(fecha.getHours() + 7);

        // Formatear la fecha según las opciones proporcionadas
        const fechaFormateada = fecha.toLocaleString("es-ES", opciones);

        return fechaFormateada;
    }

    // Se agregan los estilos al HTML.
    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "/App Web/home/home.css");

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

    #agregarJS(shadow) {
        let link = document.createElement("link");
        link.setAttribute("type", "text/javascript");
        link.setAttribute("href", "/App Web/js/jquery-1.4.2.min.js");

        let link2 = document.createElement("link");
        link2.setAttribute("type", "text/javascript");
        link2.setAttribute("href", "/App Web/js/cufon-yui.js");

        let link3 = document.createElement("link");
        link3.setAttribute("type", "text/javascript");
        link3.setAttribute("href", "/App Web/js/cufon-replace.js");

        let link4 = document.createElement("link");
        link4.setAttribute("type", "text/javascript");
        link4.setAttribute("href", "/App Web/js/Gill_Sans_400.font.js");

        let link5 = document.createElement("link");
        link5.setAttribute("type", "text/javascript");
        link5.setAttribute("href", "/App Web/js/script.js");

        let link6 = document.createElement("link");
        link6.setAttribute("type", "text/javascript");
        link6.setAttribute("href", "/App Web/js/ie_png.js");

        shadow.appendChild(link);
        shadow.appendChild(link2);
        shadow.appendChild(link3);
        shadow.appendChild(link4);
        shadow.appendChild(link5);
        shadow.appendChild(link6);
    }
}
