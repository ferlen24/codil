(function () {
  const form = document.getElementById("turno-form");
  const fechaInput = document.getElementById("fecha");
  const horaSelect = document.getElementById("hora");
  const estado = document.getElementById("estado");
  const prevMesBtn = document.getElementById("prev-mes");
  const nextMesBtn = document.getElementById("next-mes");
  const mesActual = document.getElementById("mes-actual");
  const calendarGrid = document.getElementById("calendar-grid");

  const horarios = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00",
  ];

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
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "day-btn";
      btn.textContent = String(day);
      btn.dataset.date = iso;

      if (iso < fechaInput.min) {
        btn.disabled = true;
      }
      if (fechaInput.value === iso) {
        btn.classList.add("selected");
      }
      btn.addEventListener("click", () => {
        fechaInput.value = iso;
        cargarHorarios();
        renderCalendario();
      });
      calendarGrid.appendChild(btn);
    }
  };

  fechaInput.addEventListener("change", cargarHorarios);
  fechaInput.addEventListener("change", renderCalendario);
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
    if (!form.checkValidity()) {
      estado.textContent = "Completa los campos obligatorios para continuar.";
      estado.classList.add("error");
      return;
    }
    estado.textContent = "Solicitud enviada (maqueta). Te contactaremos para confirmar el turno.";
    estado.classList.remove("error");
    form.reset();
    cargarHorarios();
    mesVista = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    renderCalendario();
  });

  renderCalendario();
})();
