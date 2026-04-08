(function () {
  const target = document.getElementById("site-header");
  if (!target) return;

  const isTurnosPage = /turnos\.html$/i.test(window.location.pathname);
  const base = isTurnosPage ? "index.html" : "";

  target.innerHTML = `
    <div class="topbar">
      <div class="container">
        <div>Urgencias y turnos: <strong>(0381) 232-2272</strong></div>
        <div>WhatsApp: <a href="https://wa.me/5493815316345?text=Hola%20CODIL%2C%20quiero%20consultar%20por%20un%20turno.">+54 9 381 531-6345</a> | San Miguel de Tucuman</div>
      </div>
    </div>
    <header class="site-header">
      <div class="container header-wrap">
        <a class="brand" href="${base}#inicio" aria-label="CODIL Inicio">
          <img src="images/codil_logo.png" alt="Logo CODIL Centro Odontologico Integral Lencina">
        </a>
        <button id="menu-toggle" class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-menu" aria-label="Abrir menu">
          <span></span><span></span><span></span>
        </button>
        <div id="main-menu" class="header-menu">
          <nav>
            <a href="${base}#inicio">Inicio</a>
            <a href="${base}#servicios">Servicios</a>
            <a href="${base}#equipo">Equipo</a>
            <a href="${base}#coberturas">Coberturas</a>
            <a href="${base}#contacto">Contacto</a>
          </nav>
          <div class="social-links" aria-label="Redes sociales CODIL">
            <a href="https://www.facebook.com/CODILTUC" target="_blank" rel="noopener noreferrer" aria-label="Facebook CODIL">Facebook</a>
            <a href="https://www.instagram.com/codiltuc/" target="_blank" rel="noopener noreferrer" aria-label="Instagram CODIL">Instagram</a>
          </div>
          <a href="turnos.html" class="btn btn-primary">Pedir turno</a>
        </div>
      </div>
    </header>
  `;

  const menuToggle = document.getElementById("menu-toggle");
  const mainMenu = document.getElementById("main-menu");
  if (!menuToggle || !mainMenu) return;

  const closeMenu = () => {
    mainMenu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = mainMenu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
})();
