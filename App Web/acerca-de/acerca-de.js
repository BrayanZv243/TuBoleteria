
export class AcercaDeComponent extends HTMLElement {
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
                <h3>Sobre <span>Nosotros</span></h3>
                <p class="blanco">
                ¡Bienvenido a nuestra fascinante historia en la página "Acerca de Nosotros"!
                En el corazón de nuestra organización, hay una historia vibrante que se ha tejido con pasión, dedicación y la firme creencia de que podemos marcar la diferencia. Desde nuestros humildes comienzos hasta convertirnos en lo que somos hoy, cada paso ha sido un viaje emocionante.
                </p>

                <p class ="blanco">
                Nuestro equipo está formado por individuos apasionados, cada uno contribuyendo con su experiencia única para dar vida a nuestra visión. A través de los años, hemos construido relaciones sólidas con clientesy colaboradores.
                En esta página, también encontrarás una mirada profunda a nuestros valores fundamentales. Creemos en la seguridad de tus boletos, que guían cada decisión y acción que tomamos. Estamos comprometidos con asegurar los mejores eventos al mejor precio.
                </p>

              </div>
            </div>
          </div>
        </div>
        <div class="content">
          <h3>Nuestro <span>Equipaso</span></h3>
          <ul class="list">
            <li>
                <a href="https://www.facebook.com/brayanzavala243" target="_blank">
                    <img src="images/2page-img1.jpg" alt="" width="150px" height="90px"/>
                </a>
                <a href="https://www.facebook.com/brayanzavala243" target="_blank">Brayan Zavala</a><br />
                <p class="blanco">
                    Es la fuerza que detrás de nuestro equipo de desarrollo. Brayan lidera con visión y creatividad. 
                    Especializado en tecnologías de vanguardia, 
                    Brayan ha liderado exitosamente proyectos clave, optimizando la eficiencia y la innovación.
                </p>
            </li>

            <li>
                <a href="https://www.instagram.com/mikeespinozad/" target="_blank">
                    <img src="images/2page-img2.jpg" width="150px" height="90px" alt="" />
                </a>
                <a href="https://www.instagram.com/mikeespinozad/" target="_blank">Miguel Espinoza</a><br />
                <p class="blanco">
                    Es nuestro experto en seguridad informática, encargado de proteger cada línea de código. Con una sólida 
                    formación en ciberseguridad y certificaciones relevantes, Mike garantiza que nuestros sistemas estén a 
                    salvo de amenazas. Su enfoque proactivo y su capacidad para anticipar posibles vulnerabilidades son clave para 
                    mantener la integridad de nuestros servicios.
                </p>

            </li>

            <li>
                <a href="https://www.facebook.com/carlosmanuel.armentaosorio" target="_blank">
                    <img src="images/2page-img3.jpg" alt="" width="150px" height="90px"/>
                </a>
                <a href="https://www.facebook.com/carlosmanuel.armentaosorio" target="_blank">Carlos Armenta</a><br />
                <p class="blanco">
                    Carlos, apasionado por la experiencia del usuario, es nuestro gurú del frontend. Con un ojo agudo para el diseño y una
                    habilidad excepcional para crear interfaces intuitivas, ha elevado la estética y la usabilidad de nuestras aplicaciones. 
                    Su enfoque meticuloso y su amor por los detalles garantizan una experiencia excepcional para nuestros usuarios.
                </p>
            </li>
          </ul>
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