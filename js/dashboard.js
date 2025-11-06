//alerta, stock, herramientas prestadas
function actualizarDashboard() {
// Total de herramientas prestadas (cantidad que todavía falta devolver)
const prestamosPendientes = prestamos.reduce((acc, p) => acc + p.cantidad, 0); 

    // b) La deuda total actual (que se muestra en "Herramientas No Devueltas")
    const deudaTotal = nodevuelto.reduce((acc, n) => acc + parseInt(n.cantidad), 0); 
    
    const totalPrestadas = prestamosPendientes + deudaTotal;
    
    // Total stock disponible
    const totalStock = herramientas.reduce((acc, h) => acc + h.stock, 0);

    document.getElementById("prestadasCount").textContent = totalPrestadas;
    document.getElementById("stockCount").textContent = totalStock;

    // 2. 🚨 CÁLCULO DE ALERTAS (CORRECCIÓN CLAVE)
    // Utilizamos la 'deudaTotal' recién calculada, que es el array OFICIAL de deudas.
    const vencidas = deudaTotal; 
    const alerta = document.getElementById("alertaPendientes");

    if (vencidas > 0) {
        alerta.innerHTML = `<strong>Importante:</strong> ${vencidas} herramienta${vencidas > 1 ? 's' : ''} no han sido devueltas.`;
        alerta.classList.remove("alerta-ok");
        alerta.classList.add("alerta-pendiente");
    } else {
        alerta.innerHTML = `<strong>Todo en orden:</strong> No hay herramientas pendientes de devolución.`;
        alerta.classList.remove("alerta-pendiente");
        alerta.classList.add("alerta-ok");
    }
}

