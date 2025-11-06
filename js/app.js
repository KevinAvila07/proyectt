let historialDevoluciones = [];

function showView(viewId) {
  // Oculta todas las secciones
  ["dashboard", "prestamos", "devoluciones", "inventario", "nodevuelto", "roto"].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  
  // Muestra la sección solicitada
  document.getElementById(viewId).classList.remove('hidden');
  
  // Manejo de estilos de navegación
  const links = document.querySelectorAll('nav a');
 links.forEach(link => link.classList.remove('active'));
    links.forEach(link => {
      if(link.getAttribute('onclick')?.includes(viewId)) link.classList.add('active');
 });
 
 // Lógica específica para cada vista
 if (viewId === "devoluciones") {
     generarHistorialDevoluciones();
    }

    if (viewId === "nodevuelto") {
       cargarPrestamosDesdeBD(); 
    }

    if (viewId === "roto") {
      mostrarHerramientasRotas();
    }
  
   // Añadir esta condición para cargar la tabla de Inventario
 if (viewId === "inventario") {
 actualizarTablaHerramientas(); 
}
}

window.addEventListener("load", () => {
// Estas funciones llamarán a PHP, cargarán los datos y luego renderizarán las vistas
 cargarHerramientasDesdeBD();
 cargarPrestamosDesdeBD();
});
