(function () {
  const defaultTitle = document.title;
  const hiddenTitles = [
    "No te vayas, volve a conocernos | CODIL",
    "Tu sonrisa te espera en CODIL",
  ];
  let titleInterval = null;
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const onVisible = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(onVisible, {
    threshold: 0.16,
    rootMargin: "0px 0px -5% 0px",
  });

  items.forEach((item) => observer.observe(item));

  const modal = document.getElementById("obras-modal");
  const openModalBtn = document.getElementById("open-obras-modal");
  const closeModalBtn = document.getElementById("close-obras-modal");
  const menuToggle = document.getElementById("menu-toggle");
  const mainMenu = document.getElementById("main-menu");
  if (menuToggle && mainMenu) {
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
  }

  if (!modal || !openModalBtn || !closeModalBtn) return;

  const openModal = () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  openModalBtn.addEventListener("click", openModal);
  closeModalBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      let i = 0;
      document.title = hiddenTitles[i];
      titleInterval = window.setInterval(() => {
        i = (i + 1) % hiddenTitles.length;
        document.title = hiddenTitles[i];
      }, 1000);
      return;
    }

    if (titleInterval) {
      window.clearInterval(titleInterval);
      titleInterval = null;
    }
    document.title = defaultTitle;
  });
})();
