import { UsuariosService } from "../servicios/UsuarioService.js";
import { CookiesService } from "../servicios/CookiesService.js";

export class PerfilUsuarioComponent extends HTMLElement {

    #usuarioService = new UsuariosService();
    #cookiesService = new CookiesService();

    constructor() {
        super()
        this.token;
        this.usuario;
    }

    // Obtiene los datos del usuario.
    async #getDataUser() {
        try {
            this.token = this.#cookiesService.getCookieSession('cookieSesion');
            // Obtenemos los datos del usuario con su ID dado su token en la cookie.
            this.usuario = await this.#usuarioService.getUsuarioPorID(this.token, this.#cookiesService.decodeJwt(this.token).idUsuario);
        } catch (error) {
            // Ocurrió un error al obtener los datos del usuario, se le pide que favor inicie sesión de nuevo
            alert('Sesión expirada, inicie sesión de nuevo por favor.');
            window.location.href = "iniciar-sesion.html"
        }
    }

    #handleEvents(shadow) {
        const actualizarCuenta = shadow.querySelector('#miFormulario');
        actualizarCuenta.addEventListener('submit', (event) => this.#handleActualizarCuenta(event));
                
        const cerrarSesion = shadow.querySelector('#cerrarSesion');
        cerrarSesion.addEventListener('click', (event) => this.#handleCerrarSesion(event));

        const eliminarCuenta = shadow.querySelector('#eliminarCuenta');
        eliminarCuenta.addEventListener('click', (event) => this.#handleEliminarCuenta(event));

        const misCompras = shadow.querySelector('#misCompras');
        misCompras.addEventListener('click', (event) =>  this.#handleVerMisCompras(event));
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        await this.#getDataUser();
        this.#render(shadow, this.usuario);
        this.#agregarEstilos(shadow);
        this.#handleEvents(shadow);
    }

    #render(shadow, usuario) {
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
                                        <h2>Bienvenido a tu Perfil, ${usuario.nombre}</h2>
                                        <button type="button" id="misCompras" class="btn-comprar">Ver mis compras</button>

                                    </div>
                                        <form id="miFormulario">
                                            <div class="contenido">
                                                <input type="text" name="" id="nombreUsuario" placeholder="Nombre" value="${usuario.nombre}" required>
                                                <input type="text" name="" id="apellidoUsuario" placeholder="Apellido" value="${usuario.apellido}" required>
                                                <input type="number" name="" id="edadUsuario" placeholder="Edad" value="${usuario.edad}" required>
                                                <input type="number" name="" id="telefonoUsuario" placeholder="Teléfono" value="${usuario.telefono}" required>
                                                <input type="email" name="" id="correo" placeholder="Correo Email" value="${usuario.correo}" required>
                                                <input type="password" name="" id="contraseñaAntigua" placeholder="Contraseña Antigua" required>
                                                <input type="password" name="" id="contraseña" placeholder="Nueva Contraseña" required>
                                                <input type="password" name="" id="contraseñaConfirmar" placeholder="Confirmar nueva Contraseña" required>
                                                
                                                <button type="submit" id="actualizarUsuario" class="btn-comprar">Actualizar Cuenta</button>
                                                <button type="button" id="cerrarSesion" class="btn-comprar">Cerrar Sesión</button>
                                                <button type="button" id="eliminarCuenta" class="btn-eliminar">Eliminar Cuenta</button>

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

    #handleVerMisCompras(event) {
        // Redireccionamos a la página de mis compras.
        window.location.href = "mis-compras.html";
    }

    #handleCerrarSesion(event) {
        const confirmacion = confirm('¿Estás seguro de cerrar la sesión?');

        if (!confirmacion) return;

        // Eliminamos la cookie con el token.
        this.#cookiesService.eliminarCookie('cookieSesion');

        // Redireccionamos al inicio de sesión.
        window.location.href = "iniciar-sesion.html";
    }

    async #handleActualizarCuenta(event) {
        event.preventDefault();

        const nombre = this.shadowRoot.getElementById('nombreUsuario').value;
        const apellido = this.shadowRoot.getElementById('apellidoUsuario').value;
        const edad = this.shadowRoot.getElementById('edadUsuario').value;
        const telefono = this.shadowRoot.getElementById('telefonoUsuario').value;
        const correo = this.shadowRoot.getElementById('correo').value;
        const contraseñaAntigua = this.shadowRoot.getElementById('contraseñaAntigua').value;
        const nuevaContraseña = this.shadowRoot.getElementById('contraseña').value;

        if (!this.#validarFormulario()) {
            return;
        }

        const data = {
            nombre,
            apellido,
            edad,
            telefono,
            correo,
            contraseñaAntigua,
            nuevaContraseña
        }

        const res = await this.#actualizarUsuario(this.usuario.idUsuario, data);

        if (res && res.message) {
            alert(res.message);
            return;
        }
        location.reload();
    }

    async #handleEliminarCuenta(event) {
        var confirmacion1 = confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible");

        if (!confirmacion1) {
            // El usuario hizo clic en "Cancelar" en la primera confirmación
            alert("Sabía decisión caballero");
            return;
        }

        var confirmacion2 = confirm("¡¿ESTÁS REALMENTE SEGURO?! ¡ES IRREVERSIBLE DE VERDAD!");
        if (!confirmacion2) {
            // El usuario hizo clic en "Cancelar" en la segunda confirmación
            alert("Sabía decisión caballero");
            return;
        }

        var confirmacion3 = confirm("NO ES BROMA, NO HAY VUELTA ATRÁS AL ELIMINAR TU CUENTA");

        if (confirmacion3) {
            // El usuario ha confirmado eliminar la cuenta
            const res = this.#eliminarUsuario(this.usuario.idUsuario);
            if (!res && res.message) {
                alert(res.message);
                return;
            }

            alert('Se eliminó tu cuenta, Esperamos verte de nuevo algún día :(');

            // Eliminamos la cookie con el token JWT.
            this.#cookiesService.eliminarCookie('cookieSesion');

            // Redireccionamos al login
            window.location.href = "iniciar-sesion.html"

        } else {
            // El usuario hizo clic en "Cancelar" en la tercera confirmación
            alert("Sabía decisión caballero");
        }
    }

    async #eliminarUsuario(idUsuario) {
        const res = await this.#usuarioService.deleteUsuario(this.token, idUsuario);
        const json = JSON.stringify(res);
        const evento = JSON.parse(json);

        if (evento && evento.status == 'fail') {
            alert(evento.message);
            return;
        }
        if (res && res.statusCode == 403) {
            window.location.href = "/App Web/iniciar-sesion.html"
            return;
        }

        return res;

    }

    async #actualizarUsuario(idUsuario, dataUpdate) {
        const res = await this.#usuarioService.putUsuario(this.token, idUsuario, dataUpdate);
        const json = JSON.stringify(res);
        const evento = JSON.parse(json);

        if (evento && evento.status == 'fail') {
            alert(evento.message);
            return;
        }
        if (res && res.statusCode == 403) {
            window.location.href = "/App Web/iniciar-sesion.html"
            return;
        }

        if (res && res.statusCode == 400) {
            alert('Bad Request');
            return;
        }

        if(res && res.statusCode == 500){
            alert('Error en el servidor.');
            return;
        }

        console.log(res);

        return res;

    }

    #validarFormulario() {
        // Obtener referencias a los elementos del formulario
        const nombreUsuario = this.shadowRoot.getElementById('nombreUsuario').value;
        const apellidoUsuario = this.shadowRoot.getElementById('apellidoUsuario').value;
        const edadUsuario = this.shadowRoot.getElementById('edadUsuario').value;
        const telefonoUsuario = this.shadowRoot.getElementById('telefonoUsuario').value;
        const correo = this.shadowRoot.getElementById('correo').value;
        const contraseña = this.shadowRoot.getElementById('contraseña').value;
        const contraseñaConfirmar = this.shadowRoot.getElementById('contraseñaConfirmar').value;

        // Realizar validaciones
        if (!nombreUsuario.trim()) {
            alert('Por favor, ingrese un nombre válido.');
            return false;
        }

        if (!/^[A-Za-z]+$/.test(nombreUsuario.trim())) {
            alert('El nombre debe contener solo letras.');
            return false;
        }

        if (!apellidoUsuario.trim()) {
            alert('Por favor, ingrese un apellido válido.');
            return false;
        }

        if (!/^[A-Za-z]+$/.test(apellidoUsuario.trim())) {
            alert('El apellido debe contener solo letras.');
            return false;
        }

        if (isNaN(edadUsuario) || edadUsuario <= 0) {
            alert('Por favor, ingrese una edad válida.');
            return false;
        }

        if (!Number.isInteger(Number(edadUsuario))) {
            alert('La edad debe ser un número entero.');
            return false;
        }

        if (isNaN(telefonoUsuario) || telefonoUsuario <= 0 || telefonoUsuario.length !== 10) {
            alert('Por favor, ingrese un número de teléfono válido de 10 dígitos.');
            return false;
        }

        if (!correo.trim() || !/\S+@\S+\.\S+/.test(correo)) {
            alert('Por favor, ingrese un correo electrónico válido.');
            return false;
        }

        if (contraseña.length < 8) {
            alert('La contraseña debe tener al menos 8 caracteres.');
            return false;
        }

        if (contraseña !== contraseñaConfirmar) {
            alert('Las contraseñas no coinciden.');
            return false;
        }

        return true;
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