
export class ContactoComponent extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        this.#render(shadow);
        this.#agregarEstilos(shadow);
        this.#agregarJS(shadow);
    }

    #render(shadow) {
        // Aquí se va a insertar todo el HTML
        shadow.innerHTML += `
<body id="page1">
    <div class="tail-top">
        <div class="tail-bottom">
            <div id="main">
                <div id="content">
        <div class="line-hor"></div>
        <div class="box">
          <div class="border-right">
            <div class="border-left">
              <div class="inner">
                <h3>Nuestro <span>Contacto</span></h3>
                <div class="address">
                  <div class="fleft"><span>CP:</span><p class="blanco">85154</p>
                    <span>País:</span><p class="blanco">México</p>
                    <span>Teléfono:</span><p class="blanco">644 159 6164</p>
                    <span></span></div>
                  
                    <p class="blanco">¡Bienvenido a nuestra página de contacto! Estamos encantados de que estés aquí. En Boletería, valoramos tu retroalimentación, preguntas y comentarios. Ya sea que estés interesado en nuestros boletos, tengas alguna consulta o simplemente quieras saludarnos, estamos aquí para ayudarte.

Nuestra misión es brindar un servicio excepcional, y tu opinión es fundamental para lograrlo. Utiliza nuestro formulario de contacto para enviarnos un mensaje directo, o encuentra nuestra información de contacto detallada a continuación. Nos esforzamos por responder a todas las consultas de manera oportuna.

¡Gracias por elegir Boletería! Estamos emocionados de conectarnos contigo.</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content">
          <h3>Formulario de <span>Contacto</span></h3>
          <form id="contacts-form" action="#">
            <fieldset>
              <div class="field">
                <label>Tu hermoso nombre:</label>
                <input type="text" value="" style="color: black;"/>
              </div>
              <div class="field">
                <label>Tu hermoso E-mail:</label>
                <input type="text" value="" style="color: black;"/>
              </div>
              
              <div class="field">
                <label>Tu hermoso mensajito:</label>
                <textarea cols="1" rows="1"></textarea>
              </div>
              <div class="wrapper"> <a href="#" class="link2"> <span> <span>¡Enviar mi mensajito!</span> </span> </a> </div>
            </fieldset>
          </form>
        </div>
      </div>
            </div>
        </div>
    </div>
</body>
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