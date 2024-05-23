
export class NavBarComponent extends HTMLElement {
    constructor() {
        super()
    }

    #obtenerPaginaActual(){
        let urlActual = new URL(window.location.href);
        let paginaActual = null;
        // Obtener el nombre del archivo (seleccion.html)
        const pathnameArray = urlActual.pathname.split("/");
        const filename = pathnameArray[pathnameArray.length - 1];

        switch(filename){
            case "seleccion.html":
                paginaActual = "seleccion";
                break;
            case "acerca-de.html":
                paginaActual = "acerca-de";
                break;
            case "perfil-usuario.html":
                paginaActual = "mi-perfil";
                break;
            case "contacto.html":
                paginaActual = "contacto";
                break;
            case "index.html":
                paginaActual = "index";
                break;
            case "carrito.html":
                paginaActual = "carrito";
                break;
            default:
                paginaActual = "otra_pagina";
        } 
        
        return paginaActual;
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        const paginaActual = this.#obtenerPaginaActual();

        this.#render(shadow, paginaActual);
        this.#agregarEstilos(shadow);
        this.#agregarJS(shadow);
    }

    #render(shadow, paginaActual) {
        // Aquí se va a insertar todo el HTML
        shadow.innerHTML += `

    <div class="tail-top">
        <div class="tail-bottom">
            <div id="main">
                <div id="header">
                    <div class="row-1">
                        <div class="fleft"><a href="#">Explora el mundo de Boletería</span></a></div>
                    </div>
                    <div class="row-2">
                    
                        <ul>
                            <li><a href="index.html" class="${paginaActual === 'index' ? 'active' : ''}">Inicio</a></li>
                            <li><a href="acerca-de.html" class="${paginaActual === 'acerca-de' ? 'active' : ''}">Acerca de</a></li>
                            <li><a href="perfil-usuario.html"class="${paginaActual === 'mi-perfil' ? 'active' : ''}">Mi Perfil</a></li>
                            <li><a href="contacto.html" class="${paginaActual === 'contacto' ? 'active' : ''}">Contacto</a></li>
                            <li class="last"><a href="carrito.html" class="${paginaActual === 'carrito' ? 'active' : ''}">Carrito Compra</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
        `
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