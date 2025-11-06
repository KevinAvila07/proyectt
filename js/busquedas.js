// buscador y filtro por categoría
const inputBusqueda = document.getElementById("buscarHerramienta");
const selectCategoria = document.getElementById("filtroCategoria");

function filtrarHerramientas() {
  const texto = inputBusqueda.value.toLowerCase();
  const categoria = selectCategoria.value.toLowerCase();

  const filtrado = herramientas.filter(h => {

    // busca en nombre, descripción, marca y modelo
    const coincideTexto =
      h.nombre.toLowerCase().includes(texto) ||
      h.descripcion.toLowerCase().includes(texto) ||
      (h.marca && h.marca.toLowerCase().includes(texto)) ||
      (h.modelo && h.modelo.toLowerCase().includes(texto));

    // filtra por categoría
    const coincideCategoria = categoria === "" || h.categoria.toLowerCase() === categoria;

    return coincideTexto && coincideCategoria;
  });
  renderHerramientas(filtrado);
}

inputBusqueda.addEventListener("input", filtrarHerramientas);
selectCategoria.addEventListener("change", filtrarHerramientas);

  // modal para ver los detalles de las cartas
  function verDetalles(id){
    const h = herramientas.find(item => item.id_herramienta === id);

   if (!h) { // Agregamos esta verificación
     console.error("Herramienta no encontrada con ID:", id);
     return; // Salimos de la función si no se encuentra
  }

    document.getElementById("detalleNombre").innerText = h.nombre;
    document.getElementById("detalleMarca").innerText = h.marca;
    document.getElementById("detalleModelo").innerText = h.modelo;
    document.getElementById("detalleCategoria").innerText = h.categoria;
    document.getElementById("detalleStock").innerText = h.stock;
    document.getElementById("detalleDesc").innerText = h.descripcion;
    document.getElementById("detalleImg").src = `imagenespract/${h.img}`;
    document.getElementById("modalDetalles").style.display = "flex";
  }
  function cerrarModal(){
    document.getElementById("modalDetalles").style.display = "none";
  }
  
  // mostrar el nombre del la imagen seleccionada para el nuevo registro de la nueva herramienta
const fileInput = document.getElementById("imagen");
const nombreArchivo = document.getElementById("nombreArchivo");

fileInput.addEventListener("change", function() {
  if (fileInput.files.length > 0) {
    nombreArchivo.textContent = fileInput.files[0].name; // muestra el nombre
  } else {
    nombreArchivo.textContent = "Ningún archivo seleccionado";
  }
});


// busqueda y filtro en el inventario tabla
const inputBusquedaInv = document.getElementById("buscarInventario");
const selectCategoriaInv = document.getElementById("filtroInventarioCategoria");

function filtrarInventario() {
  const texto = inputBusquedaInv.value.toLowerCase();
  const categoria = selectCategoriaInv.value.toLowerCase();

  // filtra la lista de herramientas según búsqueda y categoría
  const filtradas = herramientas.filter(h => {
    const coincideTexto =
      h.nombre.toLowerCase().includes(texto) ||
      h.descripcion.toLowerCase().includes(texto) ||
      (h.marca && h.marca.toLowerCase().includes(texto)) ||
      (h.modelo && h.modelo.toLowerCase().includes(texto));

    const coincideCategoria =
      categoria === "" || h.categoria.toLowerCase() === categoria;

    return coincideTexto && coincideCategoria;
  });

  // Renderiza las filas filtradas
  const tbody = document.getElementById("herramientasTableBody");
  tbody.innerHTML = "";
  filtradas.forEach(h => {
    const fila = `
      <tr>
        <td>${h.id_herramienta}</td>
        <td>${h.nombre}</td>
        <td>${h.categoria}</td>
        <td>${h.marca}</td>
        <td>${h.modelo}</td>
        <td>${h.descripcion}</td>
        <td>${h.stock}</td>
        <td>${h.cantidadAfectada || 0}</td>
        <td>${h.estado || "Normal"}</td>
        <td><button onclick="abrirModalEditar(${h.id_herramienta})">Modificar</button></td>
      </tr>`;
    tbody.innerHTML += fila;
  });

  renderHerramientas(filtradas);
}

// lo que se filtra
inputBusquedaInv.addEventListener("input", filtrarInventario);
selectCategoriaInv.addEventListener("change", filtrarInventario);

// =====================
// BUSCADOR DE PRÉSTAMOS
// =====================
const inputBusquedaPrestamo = document.getElementById("buscarPrestamo");
if (inputBusquedaPrestamo) {
  inputBusquedaPrestamo.addEventListener("input", () => {
    const texto = inputBusquedaPrestamo.value.toLowerCase().trim();
    const tabla = document.getElementById("tablaPrestamos");

    if (!tabla) return;

    if (texto === "") {
      actualizarTablaPrestamos();
      return;
    }

    const prestamosFiltrados = prestamos.filter(p =>
      (p.profesor && p.profesor.toLowerCase().includes(texto)) ||
      (p.nombre && p.nombre.toLowerCase().includes(texto)) ||
      (p.curso && p.curso.toLowerCase().includes(texto)) ||
      (p.turno && p.turno.toLowerCase().includes(texto)) ||
      (p.fecha_p && p.fecha_p.toLowerCase().includes(texto))
    );

    tabla.innerHTML = `
      <tr>
        <th>ID Préstamo</th>
        <th>ID Her.</th>
        <th>Nombre</th>
        <th>Cantidad por Devolver</th>
        <th>Profesor</th>
        <th>Curso</th>
        <th>Turno</th>
        <th>Fecha de Retiro</th>
        <th>H de Retiro</th>
        <th>H Lím. Dev.</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    `;

    prestamosFiltrados.forEach(p => {
      tabla.innerHTML += `
        <tr class="${p.estado_p === 'No Devuelto' ? 'No Devuelto' : ''}">
          <td>${p.id_prestamo}</td>
          <td>${p.id_herramienta}</td>
          <td>${p.nombre}</td>
          <td>${p.cantidad}</td>
          <td>${p.profesor}</td>
          <td>${p.curso}</td>
          <td>${p.turno}</td>
          <td>${p.fecha_p}</td>
          <td>${p.horaRetiro}</td>
          <td>${p.horaLimite}</td>
          <td>${p.estado_p}</td>
          <td><button onclick="abrirModalPrestamo(${p.id_prestamo})">Modificar</button></td>
        </tr>
      `;
    });
  });
}

