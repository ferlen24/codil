(function () {
  const form = document.getElementById("turno-form");
  const diaInput = document.getElementById("dia");
  const fechaInput = document.getElementById("fecha");
  const horaSelect = document.getElementById("hora");
  const estado = document.getElementById("estado");
  const prevMesBtn = document.getElementById("prev-mes");
  const nextMesBtn = document.getElementById("next-mes");
  const mesActual = document.getElementById("mes-actual");
  const calendarGrid = document.getElementById("calendar-grid");
  const fechaSeleccionada = document.getElementById("fecha-seleccionada");

  const horarios = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00",
  ];
  // Titulo para el tab de la pagina
  const defaultTitle = document.title;
  const hiddenTitles = [
    "No te vayas, volve a conocernos | CODIL",
    "Tu sonrisa te espera en CODIL",
  ];
  let titleInterval = null;

  const hoy = new Date();
  let mesVista = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  fechaInput.min = yyyy + "-" + mm + "-" + dd;

  const cargarHorarios = () => {
    horaSelect.innerHTML = "";
    if (!fechaInput.value) {
      horaSelect.innerHTML = "<option value=''>Selecciona primero una fecha</option>";
      return;
    }
    horaSelect.innerHTML = "<option value=''>Seleccionar horario</option>";
    horarios.forEach((h) => {
      const opt = document.createElement("option");
      opt.value = h;
      opt.textContent = h + " hs";
      horaSelect.appendChild(opt);
    });
  };

  const toISODate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + d;
  };

  const actualizarTextoFecha = () => {
    if (!fechaInput.value) {
      fechaSeleccionada.textContent = "Fecha seleccionada: ninguna";
      return;
    }
    const [y, m, d] = fechaInput.value.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    const legible = new Intl.DateTimeFormat("es-AR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
    fechaSeleccionada.textContent = "Fecha seleccionada: " + legible;
  };

  const renderCalendario = () => {
    const year = mesVista.getFullYear();
    const month = mesVista.getMonth();
    const inicioMes = new Date(year, month, 1);
    const finMes = new Date(year, month + 1, 0);
    const offset = (inicioMes.getDay() + 6) % 7;
    const total = finMes.getDate();
    const formatter = new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric" });

    mesActual.textContent = formatter.format(inicioMes);
    calendarGrid.innerHTML = "";

    for (let i = 0; i < offset; i++) {
      const empty = document.createElement("span");
      empty.className = "calendar-empty";
      calendarGrid.appendChild(empty);
    }

    for (let day = 1; day <= total; day++) {
      const date = new Date(year, month, day);
      const iso = toISODate(date);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "day-btn";
      btn.textContent = String(day);
      btn.dataset.date = iso;

      if (iso < fechaInput.min || isWeekend) {
        btn.disabled = true;
      }
      if (fechaInput.value === iso) {
        btn.classList.add("selected");
      }
      btn.addEventListener("click", () => {
        fechaInput.value = iso;
        diaInput.value = new Intl.DateTimeFormat("es-AR", { weekday: "long" }).format(date);
        cargarHorarios();
        renderCalendario();
        actualizarTextoFecha();
      });
      calendarGrid.appendChild(btn);
    }
  };

  fechaInput.addEventListener("change", cargarHorarios);
  fechaInput.addEventListener("change", renderCalendario);
  fechaInput.addEventListener("change", actualizarTextoFecha);
  prevMesBtn.addEventListener("click", () => {
    mesVista = new Date(mesVista.getFullYear(), mesVista.getMonth() - 1, 1);
    renderCalendario();
  });
  nextMesBtn.addEventListener("click", () => {
    mesVista = new Date(mesVista.getFullYear(), mesVista.getMonth() + 1, 1);
    renderCalendario();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!fechaInput.value) {
      estado.textContent = "Selecciona una fecha en el calendario para continuar.";
      estado.classList.add("error");
      return;
    }
    if (!form.checkValidity()) {
      estado.textContent = "Completa los campos obligatorios para continuar.";
      estado.classList.add("error");
      return;
    }

    const data = new FormData(form);
    const nombre = (data.get("nombre") || "").toString().trim();
    const dni = (data.get("dni") || "").toString().trim();
    const telefono = (data.get("telefono") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const cobertura = (data.get("cobertura") || "").toString().trim();
    const motivo = (data.get("motivo") || "").toString().trim();
    const hora = (data.get("hora") || "").toString().trim();

    const fechaLegible = fechaInput.value
      ? new Intl.DateTimeFormat("es-AR", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(fechaInput.value + "T00:00:00"))
      : "Sin fecha";

    const mensaje = [
      "Hola CODIL, quiero solicitar un turno.",
      "",
      "*Datos del paciente*",
      "Nombre: " + nombre,
      "DNI: " + dni,
      "Telefono: " + telefono,
      "Email: " + email,
      "Cobertura: " + (cobertura || "Sin especificar"),
      "",
      "*Turno solicitado*",
      "Fecha: " + fechaLegible,
      "Hora: " + hora + " hs",
      "Motivo: " + (motivo || "Sin especificar"),
    ].join("\n");

    const waUrl = "https://wa.me/5493815316345?text=" + encodeURIComponent(mensaje);
    window.open(waUrl, "_blank", "noopener");

    estado.textContent = "Se abrio WhatsApp con tu solicitud cargada.";
    estado.classList.remove("error");
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

  renderCalendario();
  actualizarTextoFecha();
})();
