//  Sugerencias de herramientas cuando en prestamos
const herramientaInput = document.getElementById("herramientaInput");
const sugerenciasHerramientas = document.getElementById("sugerenciasHerramientas");

if (herramientaInput && sugerenciasHerramientas) {
  herramientaInput.addEventListener("input", function () {
    const texto = this.value.toLowerCase().trim();
    sugerenciasHerramientas.innerHTML = "";

    if (texto === "") {
      sugerenciasHerramientas.style.display = "none";
      return;
    }

    const coincidencias = herramientas.filter(h =>
      h.nombre.toLowerCase().includes(texto)
    );

    if (coincidencias.length === 0) {
      sugerenciasHerramientas.style.display = "none";
      return;
    }

    coincidencias.forEach(h => {
      const div = document.createElement("div");
      div.className = "sugerencia";
      div.textContent = h.nombre;
      div.addEventListener("click", () => {
        herramientaInput.value = h.nombre;
        sugerenciasHerramientas.style.display = "none";
      });
      sugerenciasHerramientas.appendChild(div);
    });

    sugerenciasHerramientas.style.display = "block";
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#herramientaInput") && !e.target.closest("#sugerenciasHerramientas")) {
      sugerenciasHerramientas.style.display = "none";
    }
  });
}



