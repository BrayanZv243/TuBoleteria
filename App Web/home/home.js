export class HomeComponent extends HTMLElement {

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
<!-- START PAGE SOURCE -->
<div class="tail-top">
  <div class="tail-bottom">
    <div id="main">
      <div id="content">
        <div id="slogan">
          <div class="image png"></div>
          <div class="inside">
            <h2>Estamos rompiendo<span>Todos los limites</span></h2>
            <p>Compra tus boletos de tu evento favorito, aquí y ahora a un muy buen precio.</p>
            <div class="wrapper"><a href="#" class="link1"><span><span>Leer más</span></span></a></div>
          </div>
        </div>
        <div class="box">
          <div class="border-right">
            <div class="border-left">
              <div class="inner">
                <h3>Bienvenido <b>a tu</b> <span>Boletería</span></h3>
                <p class="blanco">¡Bienvenido a nuestro mundo de emociones y entretenimiento! Estamos encantados de darte la bienvenida a Boletería, el destino perfecto para los amantes de la música, los apasionados del deporte y todos aquellos que buscan vivir experiencias inolvidables.</p>
                <div class="img-box1"><img src="./images/1page-img1.jpg" alt="" /><p class="blanco">En Boletería, no solo vendemos boletos; creamos la puerta de entrada a momentos que perdurarán en tu memoria. Imagina disfrutar de los mejores conciertos con tus artistas favoritos, vivir la intensidad de los partidos más emocionantes o sumergirte en eventos culturales que despiertan todos tus sentidos.</p></div>
                <p class="blanco">Descubre una amplia gama de eventos para todos los gustos y edades. Desde conciertos de tus artistas preferidos hasta partidos apasionantes de los deportes más emocionantes, tenemos boletos para satisfacer todos los intereses.</p>
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
</html>
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