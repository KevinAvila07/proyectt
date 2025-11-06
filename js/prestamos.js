let prestamos = [];
let devoluciones = [];
let nodevuelto = [];
// Asegúrate de que tienes una variable global 'herramientas' cargada desde herramientas.js

// EN JS/PRESTAMOS.JS

async function cargarPrestamosDesdeBD() {
    try {
        const resp = await fetch('api/obtener_prestamos_data.php');
        if (!resp.ok) throw new Error('Error al cargar préstamos/devoluciones. Estado: ' + resp.status);
        
        const data = await resp.json(); 
        
        // Asigna los datos obtenidos a las variables globales
        prestamos = data.prestamos || []; 
        devoluciones = data.devoluciones || [];
        nodevuelto = data.nodevuelto || []; // <-- ¡ARRAY LLENO!

        // Llama a las funciones de renderizado UNA VEZ QUE LOS DATOS ESTÁN LISTOS
          actualizarTablaPrestamos(); 
          actualizarDashboard(); 
          generarHistorialDevoluciones(); // <-- CORREGIDA
          mostrarNoDevueltas(); 
          //mostrarHerramientasAfectadas(); // <-- ¡NUEVA LLAMADA!
    } catch (error) {
        console.error("Fallo al obtener datos de préstamos:", error);
    }
}


// registro de préstamos
document.getElementById("formPrestamo").addEventListener("submit", async function(e) { 
    e.preventDefault();

    // 1. Obtener valores del formulario (debes asegurar que estos IDs existen)
    const nombreHerramienta = document.getElementById("herramientaInput").value.trim();
    const cantidad = parseInt(document.getElementById("cantidad").value);
    const profesor = document.getElementById("profesor").value.trim();
    const curso = document.getElementById("curso").value.trim();
    const turno = document.getElementById("turno").value;
    
    // Asume que tienes un array global 'herramientas' cargado
    const herramientaSeleccionada = herramientas.find(h => h.nombre === nombreHerramienta);

    if (!herramientaSeleccionada) {
        alert("Seleccione una herramienta válida.");
        return;
    }
    if (isNaN(cantidad) || cantidad <= 0 || cantidad > herramientaSeleccionada.stock) {
        alert(`Cantidad inválida. Stock disponible: ${herramientaSeleccionada.stock}`);
        return;
    }
    if (!profesor || !curso || !turno) {
        alert("Debe completar todos los campos obligatorios.");
        return;
    }

    const horaRetiro = new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
    
    const datosPrestamo = {
        id_herramienta: herramientaSeleccionada.id_herramienta,
        cantidad: cantidad,
        profesor: profesor,
        curso: curso,
        turno: turno,
        horaRetiro: horaRetiro
    };

    try {
        const respuesta = await fetch('api/registrar_prestamos.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosPrestamo)
        });

        const resultado = await respuesta.json();

        if (resultado.exito) {
            alert("✅ ¡Préstamo registrado correctamente y stock actualizado!");
            
            // Recargar datos después del éxito para que aparezca en la tabla
            await cargarHerramientasDesdeBD(); 
            await cargarPrestamosDesdeBD();  
            
            document.getElementById("formPrestamo").reset(); 
            cerrarModalPrestamo(); // Asumiendo que esta función también cierra el modal de REGISTRO
        } else {
            // Esto mostrará el error de la BD si 'registrar_prestamos.php' falló
            alert("❌ Error al registrar el préstamo: " + resultado.mensaje); 
        }
    } catch (error) {
        console.error('Error de conexión o servidor:', error);
        alert('🚨 No se pudo conectar con el servidor para registrar el préstamo.');
    }
});

function actualizarTablaPrestamos() {
    const tabla = document.getElementById("tablaPrestamos");

    if (!prestamos || prestamos.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="12" style="text-align:center; padding:12px;">
                    <b>No hay préstamos registrados.</b>
                </td>
            </tr>
        `;
        return;
    }
    
    let tablaHTML = `
        <thead>
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
        </thead>
        <tbody>
    `;

    let totalPrestadas = 0;

    prestamos.slice().reverse().forEach(p => {
        // --- LÓGICA DE CLASE/COLOR ---
        // Blindamos la clase para que no se rompa si el estado no existe (aunque ya está en la BD)
        const estado = p.estado_p ? p.estado_p : 'Desconocido'; 
        
        const estadoClase = 
            estado === 'Vencido' || estado === 'Parcial Tarde' ? 'alerta-vencido' :
            estado === 'Transferido a No Devuelto' ? 'alerta-nodevuelto-cerrado' : ''; 
            
        // --- LÓGICA DEL BOTÓN DE ACCIÓN ---
        let accionButton;
        if (estado === 'Devuelto' || estado === 'Devuelto Tarde' || p.cantidad <= 0) {
            accionButton = '<button disabled style="background: var(--hit-gray);">Cerrado</button>';
        } else if (estado === 'Transferido a No Devuelto') {
            // Asegúrate de que 'gestionarDevolucionTardia' existe o usa 'prepararModalDeuda' si es para gestionar la deuda.
            accionButton = `<button onclick="prepararModalDeuda(${p.id_prestamo})" class="btn-rojo">Gestionar No Dev.</button>`;
        } else {
            accionButton = `<button onclick="abrirModalPrestamo(${p.id_prestamo})">Modificar</button>`;
        }

        // --- CONCATENACIÓN DE LA FILA ---
        tablaHTML += `
            <tr class="${estadoClase}">
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
                <td>${estado}</td>
                <td>${accionButton}</td>
            </tr>
        `;

        // Lógica de contadores 
        if (estado === "Pendiente" || estado === "Vencido" || estado === "Parcial" || estado === "Parcial Tarde") { 
            totalPrestadas += p.cantidad;
        }
    });

    tablaHTML += `</tbody>`;

    // 3. ACTUALIZACIÓN FINAL: Asignamos toda la cadena HTML al DOM (solo una vez)
    tabla.innerHTML = tablaHTML;
}

function abrirModalPrestamo(id) {
    const p = prestamos.find(pr => pr.id_prestamo === id);
    if (!p) return;

    document.getElementById("modId").value = p.id_prestamo;
    document.getElementById("modCantidadTotal").innerText = p.cantidad;
    document.getElementById("modCantidadDevuelta").value = 0; 
    document.getElementById("modEstado").value = p.estado_p;

    document.getElementById("modalPrestamo").style.display = "flex";
}

function cerrarModalPrestamo() {
    document.getElementById("modalPrestamo").style.display = "none";
}

function abrirModalResolverDeuda(id_nodevuelto) {
    document.getElementById("modalResolverDeuda").style.display = "flex";
    // Llenar el modal se hará en la función resolverDeuda o una similar.
}

function cerrarModalResolverDeuda() {
    document.getElementById("modalResolverDeuda").style.display = "none";
    document.getElementById("formResolverDeuda").reset();
}

// LÓGICA DE MODIFICACIÓN / DEVOLUCIÓN (con llamada a BD)
document.getElementById("formModificarPrestamo").addEventListener("submit", async e => {
    e.preventDefault();
  
    const id = parseInt(document.getElementById("modId").value);
    const devuelto = parseInt(document.getElementById("modCantidadDevuelta").value);
    const estado_p = document.getElementById("modEstado").value;

    const p = prestamos.find(pr => pr.id_prestamo === id);
    if (!p) {
        alert("Error: no se encontró el préstamo seleccionado.");
        return;
    }

    if (isNaN(devuelto) || devuelto < 0) {
        alert("Ingrese una cantidad válida.");
        return;
    }

    if (devuelto > p.cantidad) {
        alert(`No puede devolver más de lo que falta por devolver. Cantidad restante: ${p.cantidad}.`);
        return;
    }

    // --- Lógica de Envío a la Base de Datos (DB) ---
    const datosModificacion = {
        id_prestamo: id,
        cantidad_devuelta: devuelto,
        nuevo_estado: estado_p, 
        id_herramienta: p.id_herramienta,
        profesor: p.profesor 
    };

    try {
        const respuesta = await fetch('api/modificar_prestamo.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosModificacion)
        });
        
        if (!respuesta.ok) {
             throw new Error(`Error en la respuesta del servidor: ${respuesta.status} ${respuesta.statusText}`);
        }

        const resultado = await respuesta.json();

        if (resultado.exito) {
            alert("✅ ¡Préstamo Modificado correctamente y base de datos actualizada!");
            
            // Recarga completa para refrescar tablas y el array nodevuelto
            await cargarHerramientasDesdeBD(); 
            await cargarPrestamosDesdeBD(); 
            
            cerrarModalPrestamo(); 
        } else {
            alert("❌ Error al modificar el préstamo: " + resultado.mensaje);
        }
    } catch (error) {
        console.error('Error de conexión o servidor:', error);
        alert('🚨 No se pudo conectar con el servidor para guardar los cambios o hubo un error interno. Revisa la consola.');
    }
});


// DEVOLUCIONES
function generarHistorialDevoluciones(listaDevoluciones = devoluciones) {
    const contenedor = document.getElementById("contenidoDevoluciones");

    // Usa la lista que recibe como argumento o el array global
    if (listaDevoluciones.length === 0) { 
        contenedor.innerHTML = "<p><b>No hay herramientas devueltas registradas que coincidan con la búsqueda.</b></p>";
        return;
    }

    let tabla = `
        <table class="tabla-estilo">
            <tr>
                <th>ID Devolución</th>
                <th>ID Préstamo</th>
                <th>Profesor</th>
                <th>ID Herramienta</th>
                <th>Herramienta</th>
                <th>Cantidad Devuelta</th>
                <th>Fecha</th>
                <th>Hora</th>
            </tr>`;

    listaDevoluciones.forEach(d => {
        const h = herramientas.find(hh => hh.id_herramienta === d.id_herramienta); 
        tabla += `
            <tr>
                <td>${d.id_devolucion}</td>
                <td>${d.id_prestamo}</td>
                <td>${d.profesor}</td>
                <td>${d.id_herramienta}</td>
                <td>${h ? h.nombre : "Desconocida"}</td>
                <td>${d.cantidad}</td>
                <td>${d.fecha}</td>
                <td>${d.hora}</td>
            </tr>`;
    });

    tabla += "</table>";
    contenedor.innerHTML = tabla;
}

// En prestamos.js

function filtrarDevoluciones() {
    const textoBusqueda = document.getElementById("filtroTextoDevoluciones").value.toLowerCase().trim();
    const fechaBusqueda = document.getElementById("filtroFechaDevolucion").value; // Formato YYYY-MM-DD
    
    // Usamos el array global
    let resultados = devoluciones;

    // 1. Filtrar por texto (Nombre, Profesor)
    if (textoBusqueda) {
        resultados = resultados.filter(d => {
            // Necesitamos el nombre de la herramienta. Usamos el array 'herramientas'
            const h = herramientas.find(hh => hh.id_herramienta === d.id_herramienta);
            const nombreHerramienta = h ? h.nombre.toLowerCase() : '';

            // Filtrar por Nombre de Herramienta O Profesor
            return d.profesor.toLowerCase().includes(textoBusqueda) || 
                   nombreHerramienta.includes(textoBusqueda);
        });
    }

    // 2. Filtrar por fecha
    if (fechaBusqueda) {
        resultados = resultados.filter(d => d.fecha === fechaBusqueda);
    }
    
    // 3. Renderizar la tabla con los resultados filtrados
    generarHistorialDevoluciones(resultados);
}


// HERRAMIENTAS NO DEVUELTAS (EL BLOQUE QUE FALTABA) 💡
function mostrarNoDevueltas() {
    const contenedor = document.getElementById("contenidoNoDevuelto"); 

    if (!nodevuelto || nodevuelto.length === 0) {
        contenedor.innerHTML = "<p><b>No hay herramientas marcadas como No Devueltas.</b></p>";
        return;
    }

    let tabla = `
        <table class="tabla-estilo">
            <thead>
                <tr>
                    <th>ID No Dev.</th>
                    <th>ID Préstamo</th>
                    <th>Herramienta</th>
                    <th>Profesor</th>
                    <th>Cantidad Pendiente</th>
                    <th>Fecha Registro No Dev.</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>`;

    // Iterar sobre el array global 'nodevuelto'
    nodevuelto.forEach(n => {
        // La función 'prepararModalDeuda' usa el ID del registro de deuda (n.id_nodevuelto)
        tabla += `
            <tr>
                <td>${n.id_nodevuelto}</td>
                <td>${n.id_prestamo}</td>
                <td>${n.nombre}</td> 
                <td>${n.profesor}</td>
                <td>${n.cantidad}</td>
                <td>${n.fecha_registro}</td>
                <td>
                    <button class="btn-rojo" onclick="prepararModalDeuda(${n.id_nodevuelto})">Gestionar</button>
                </td>
            </tr>`;
    });

    tabla += "</tbody></table>";
    contenedor.innerHTML = tabla;
}

// Listener para el formulario de resolución de deuda
document.getElementById("formResolverDeuda").addEventListener("submit", async e => {
    e.preventDefault();

    const id_nodevuelto = parseInt(document.getElementById("deudaIdNodevuelto").value);
    const id_prestamo = parseInt(document.getElementById("deudaIdPrestamoHidden").value);
    const id_herramienta = parseInt(document.getElementById("deudaIdHerramientaHidden").value);
    const cantidad_recuperada = parseInt(document.getElementById("deudaCantidadRecuperada").value);
    const cantidad_pendiente = parseInt(document.getElementById("deudaCantidadPendiente").innerText);

    if (isNaN(cantidad_recuperada) || cantidad_recuperada < 0 || cantidad_recuperada > cantidad_pendiente) {
        alert(`Cantidad inválida. Debe ser entre 0 y ${cantidad_pendiente}.`);
        return;
    }

    // Llama a la API con los datos recogidos del modal
    await ejecutarResolucionDeudaAPI(id_nodevuelto, id_prestamo, id_herramienta, cantidad_recuperada);
    
    // Cierra el modal después de intentar el envío
    cerrarModalResolverDeuda();
});

async function ejecutarResolucionDeudaAPI(id_nodevuelto, id_prestamo, id_herramienta, cantidad_recuperada) {
    const datosResolucion = {
        id_nodevuelto: id_nodevuelto,
        id_prestamo: id_prestamo,
        id_herramienta: id_herramienta,
        cantidad_recuperada: cantidad_recuperada
    };

    try {
        const respuesta = await fetch('api/resolver_deuda.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosResolucion)
        });
        
        const resultado = await respuesta.json();

        if (resultado.exito) {
            alert(`✅ Deuda resuelta. Cantidad devuelta/recuperada: ${cantidad_recuperada}.`);
            // Recargar todo para que desaparezca de No Devuelto y se actualice el estado
            await cargarHerramientasDesdeBD(); 
            await cargarPrestamosDesdeBD(); 
        } else {
            alert("❌ Error al resolver la deuda: " + resultado.mensaje);
        }
    } catch (error) {
        console.error('Error de conexión o servidor:', error);
        alert('🚨 No se pudo conectar con el servidor para guardar los cambios.');
    }
}

// Función intermedia para cargar datos en el modal y abrirlo
function prepararModalDeuda(id_nodevuelto) {
    const deuda = nodevuelto.find(n => n.id_nodevuelto === id_nodevuelto);
    if (!deuda) return alert("Error: No se encontró el registro de deuda.");
    
    // Rellenar los campos del modal con los datos de la deuda
    document.getElementById("deudaIdPrestamo").innerText = deuda.id_prestamo;
    document.getElementById("deudaNombreHerramienta").innerText = deuda.nombre;
    document.getElementById("deudaProfesor").innerText = deuda.profesor;
    document.getElementById("deudaCantidadPendiente").innerText = deuda.cantidad;
    
    // Campos ocultos para enviar a PHP
    document.getElementById("deudaIdNodevuelto").value = deuda.id_nodevuelto;
    document.getElementById("deudaIdPrestamoHidden").value = deuda.id_prestamo;
    document.getElementById("deudaIdHerramientaHidden").value = deuda.id_herramienta;
    
    // Establecer el máximo en el input numérico
    document.getElementById("deudaCantidadRecuperada").max = deuda.cantidad;
    document.getElementById("deudaCantidadRecuperada").value = deuda.cantidad; // Sugerir devolución total
    
    abrirModalResolverDeuda();
}

// NUEVA FUNCIÓN: Inicializa los listeners de búsqueda de devoluciones.
function inicializarListenersDevoluciones() {
    const inputBusqueda = document.getElementById('filtroTextoDevoluciones');
    const inputFecha = document.getElementById('filtroFechaDevolucion');

    // Aquí se añaden los listeners (con remoción previa defensiva)
    if (inputBusqueda) {
        inputBusqueda.removeEventListener('keyup', filtrarDevoluciones);
        inputBusqueda.addEventListener('keyup', filtrarDevoluciones);
    }
    
    if (inputFecha) {
        inputFecha.removeEventListener('change', filtrarDevoluciones);
        inputFecha.addEventListener('change', filtrarDevoluciones);
    }
}