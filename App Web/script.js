// Aquí van todos los imports de los micro-frontends...

import { HomeComponent } from "./home/home.js";
import { BoleteriaComponent } from "./home/boleteria/boleteria.js";
import { SeleccionComponent } from "./seleccion/seleccion.js";
import { AcercaDeComponent } from "./acerca-de/acerca-de.js";
import { ContactoComponent } from "./contacto/contacto.js";
import { NavBarComponent } from "./navbar/navbar.js";
import { FooterComponent } from "./footer/footer.js";
import { CarritoComponent } from "./carrito/carrito.js";
import { SessionComponent } from "./sesion/sesion.js";
import { RegistroComponent } from "./registro/registro.js";
import { RegistroEventoComponent } from "./registro-evento/registro-evento.js";
import { PerfilUsuarioComponent } from "./perfil-usuario/perfil-usuario.js";
import { AsientoComponent } from "./asientos/asiento.js";
import { RegistroAsientoComponent } from "./asientos/registro-asiento.js";
import { MisComprasComponent } from "./mis-compras/mis-compras.js";
import { MisComprasDetallesComponent } from "./mis-compras/mis-compras-detalles.js";

// Se definen los micro-frontends genéricos.
window.customElements.define('navbar-info', NavBarComponent);
window.customElements.define('footer-info', FooterComponent);

// Home
window.customElements.define('home-info', HomeComponent);
window.customElements.define('boleteria-info', BoleteriaComponent);

// Selección
window.customElements.define('seleccion-info', SeleccionComponent);

// Contacto
window.customElements.define('contacto-info', ContactoComponent);

// Acerca de
window.customElements.define('acerca-info', AcercaDeComponent);

// Carrito 
window.customElements.define('carrito-info', CarritoComponent);

// Iniciar Sesión
window.customElements.define('sesion-info', SessionComponent);

// Registrar Usuario Normal
window.customElements.define('registro-info', RegistroComponent);

// Registrar Evento
window.customElements.define('registro-evento-info', RegistroEventoComponent);

// Perfil Usuario
window.customElements.define('perfil-usuario-info', PerfilUsuarioComponent);

// Asientos
window.customElements.define('asiento-info', AsientoComponent);
window.customElements.define('registro-asiento-info', RegistroAsientoComponent);

// Mis Compras
window.customElements.define('mis-compras-info', MisComprasComponent);
window.customElements.define('mis-compras-detalles-info', MisComprasDetallesComponent);



