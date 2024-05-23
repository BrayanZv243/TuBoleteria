import { SessionService } from "../servicios/SessionService.js";
import { CookiesService } from "../servicios/CookiesService.js";

export class SessionComponent extends HTMLElement {

    #sesionService = new SessionService();
    #cookiesService = new CookiesService();

    constructor() {
        super()
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        this.#render(shadow);
        this.#agregarEstilos(shadow);
        this.#agregarJS(shadow);

        // Agregar el controlador de eventos al formulario
        const formulario = shadow.querySelector('form');
        formulario.addEventListener('submit', (event) => this.#handleFormSubmit(event));
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
                                        <h2>Bienvenido a tu boletería</h2>
                                    </div>
                                    <form>
                                        <div class="contenido">
                                        <!-- Todos los elementos del formulario y el botón -->

                                        <input type="email" name="" id="correo" placeholder="Correo" required>

                                        <input type="password" name="" id="contraseña" placeholder="Contraseña" required>

                                        <button type="submit" class="btn-comprar">Iniciar Sesión</button>
                                        <p class="registro">
                                        ¿No tienes cuenta?
                                        <a href="registro.html">Registrate Ahora</a>
                                        </p>
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

    #handleFormSubmit(event) {
        // Prevenir el envío predeterminado del formulario
        event.preventDefault();

        // Obtener los valores del correo y la contraseña
        const correo = this.shadowRoot.querySelector('#correo').value;
        const contraseña = this.shadowRoot.querySelector('#contraseña').value;

        // Llamar a la función #iniciarSesion con los valores
        const data = {
            correo,
            contraseña
        }
        this.#iniciarSesion(data);
    }

    async #iniciarSesion(data) {
        const res = await this.#sesionService.loginUserNormal(data);
        
        if (res && res.token) {
            // Establecemos la cookie con el token.
            this.#cookiesService.setSessionCookie('cookieSesion', res.token);

            // Redireccionamos a la página de inicio.
            window.location.href = "/App Web/index.html"
            
        } else {
            alert(res.mensaje)
        }
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