  let herramientasRotas = [];
  let herramientas = [];

  async function cargarHerramientasDesdeBD() {
    try {
        const respuesta = await fetch('api/obtener_herramientas.php');
        
        // Verifica si la conexión fue exitosa
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        
        // El script PHP devuelve un array JSON de herramientas
        herramientas = await respuesta.json(); 
        
        // Llama a las funciones de renderizado
        renderHerramientas(herramientas);
        actualizarDashboard(); 
        
    } catch (error) {
        console.error("Fallo al obtener herramientas desde la BD:", error);
    }
}
  
//CARTAS DE HERRAMIENTAS DEL INICIO
const contenedor = document.getElementById("listaHerramientas");

function renderHerramientas(lista){
    const fragment = document.createDocumentFragment();
    lista.forEach((h, index)=>{
        const card = document.createElement("div");
        card.className = "tool-card";
        card.innerHTML = `
            <img src="imagenespract/${h.img}" alt="${h.nombre}">
            <h4>${h.nombre}</h4>
            <p><strong>Marca:</strong> ${h.marca || "N/A"}</p>
            <p>${h.categoria}</p>
            <button onclick="verDetalles(${h.id_herramienta})">Ver más</button>
        `;
        fragment.appendChild(card);
    });
    contenedor.innerHTML = "";
    contenedor.appendChild(fragment);
}

  // Registro de nuevas herramientas 
document.getElementById("formAgregar").addEventListener("submit", async function(e) {
  e.preventDefault();
  
  const nombre = document.getElementById("nombre").value;
  const categoria = document.getElementById("categoria").value;
  const marca = document.getElementById("marca").value;
  const modelo = document.getElementById("modelo").value;
  const stock = parseInt(document.getElementById("stock").value);
  const descripcion = document.getElementById("descripcion").value;
  const imagen = document.getElementById("imagen").value;

      // toma la imagen de la herramienta
  let imgUrl = "placeholder.jpg"; // por si no sube nada
  if(fileInput.files.length > 0){
    imgUrl = URL.createObjectURL(fileInput.files[0]);
  }

const nuevaHerramienta = {
    nombre: nombre,
    categoria: categoria,
    marca: marca,
    modelo: modelo,
    stock: stock,
    descripcion: descripcion,
    img: imagen,
    estado: "Normal" // El estado inicial
  };


  try {
    const respuesta = await fetch('api/registrar_herramienta.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaHerramienta)
    });

    const resultado = await respuesta.json();

    if (resultado.exito) {
      alert("Herramienta registrada correctamente.");
      document.getElementById("formRegistroHerramienta").reset();
      await cargarHerramientasDesdeBD(); // Recarga la lista desde la BD
      cerrarModalRegistro();
    } else {
      alert("Error al registrar: " + resultado.mensaje);
    }
  } catch (error) {
    console.error('Error de conexión:', error);
    alert('No se pudo conectar con el servidor.');
  }
});

// ejecuta el color correcto al abrir el modal
// ejecuta el color correcto al abrir el modal
function abrirModalEditar(id){
  const h = herramientas.find(h => h.id_herramienta === id);
  if(!h) return;

  document.getElementById("editId").value = h.id_herramienta;
  document.getElementById("editNombre").value = h.nombre;
  document.getElementById('editMarca').value = h.marca;
  document.getElementById('editModelo').value = h.modelo;
  document.getElementById("editDescripcion").value = h.descripcion;
  document.getElementById("editStock").value = h.stock;
  document.getElementById("editEstadoHerramienta").value = h.estado || "Normal";

    // **<-- CORRECCIÓN CLAVE: Cargar la Cantidad Afectada -->**
    // Si la herramienta está marcada como rota/desaparecida, cargamos la cantidad afectada guardada.
    const cantidadAfectadaGuardada = h.cantidadAfectada || 0;
    document.getElementById("editCantidadRota").value = cantidadAfectadaGuardada;
    
    // Si el stock total es un campo oculto, debes cargarlo también
    // document.getElementById("editStockTotalHidden").value = h.stock_total_inicial; 
    // NOTA: Si 'stock' en la BD es el stock total, usa ese valor para la edición del stock base.
    
   const selectCat = document.getElementById("editCategoria");
  for (let i = 0; i < selectCat.options.length; i++) {
    if (selectCat.options[i].value === h.categoria) {
       selectCat.selectedIndex = i;
      break;
    }
  }

  document.getElementById("modalEditar").style.display = "flex";
  actualizarColorModal(); // Esto ahora mostrará/ocultará el campo de cantidad según el estado cargado.
}

// oculta el modal de edición (lo cierra visualmente)
function cerrarModalEditar(){
  document.getElementById("modalEditar").style.display = "none";
}

// editar herramienta 
// En herramientas.js

function actualizarTablaHerramientas(){
  const tbody = document.getElementById("herramientasTableBody");
  tbody.innerHTML = ""; 

  herramientas.forEach(h => {
    const estadoHerramienta = h.estado ? h.estado : "Normal";
    let estadoClase = "";
    
    if (estadoHerramienta === "No-Funciona" || estadoHerramienta === "Desaparecida") {
        estadoClase = "alerta-inventario-afectado";
    }
    
    const fila = `
      <tr class="${estadoClase}"> 
        <td>${h.id_herramienta}</td>
        <td>${h.nombre}</td>
        <td>${h.categoria}</td>
        <td>${h.marca}</td>
        <td>${h.modelo}</td>
        <td>${h.descripcion}</td>
        <td>${h.stock}</td>
        <td>${h.cantidadAfectada || 0}</td>
        <td>${estadoHerramienta}</td>
        <td><button onclick="abrirModalEditar(${h.id_herramienta})">Modificar</button></td>
      </tr>`;
    tbody.innerHTML += fila;
  });
}

// como se ve el modal según estado de herramienta
const modalEditar = document.getElementById("modalEditar");
const botonModificar = document.querySelector("#formEditar button[type='submit']");
const selectEstado = document.getElementById("editEstadoHerramienta");

function actualizarColorModal() {
  const grupoCantidad = document.getElementById("grupoCantidadRota");
  const labelCantidad = document.getElementById("labelCantidadRota");

  if (selectEstado.value === "No-Funciona" || selectEstado.value === "Desaparecida") {
    modalEditar.style.background = "rgba(255, 0, 0, 0.15)";
    botonModificar.style.background = "darkred";
    grupoCantidad.classList.remove("hidden");
    labelCantidad.textContent =
      selectEstado.value === "Desaparecida"
        ? "Cantidad desaparecida:"
        : "Cantidad rota:";
  } else {
    modalEditar.style.background = "";
    botonModificar.style.background = "";
    grupoCantidad.classList.add("hidden");
  }
}


if (selectEstado) {
  selectEstado.addEventListener("change", actualizarColorModal);
}



// permite editar los datos de una herramienta y que los cambios se reflejen inmediatamente en la interfaz.
document.getElementById("formEditar").addEventListener("submit", async e => {
  e.preventDefault();

  const id = parseInt(document.getElementById("editId").value);
  const nombre = document.getElementById("editNombre").value;
  const categoria = document.getElementById("editCategoria").value;
  const marca = document.getElementById("editMarca").value;
  const modelo = document.getElementById("editModelo").value;
  const descripcion = document.getElementById("editDescripcion").value;
  const stockBase = parseInt(document.getElementById("editStock").value); // Stock Total o Base
  const estadoHerramienta = document.getElementById("editEstadoHerramienta").value;
  const cantidadAfectada = parseInt(document.getElementById("editCantidadRota").value) || 0;

    // Calculamos el STOCK DISPONIBLE (Stock Base - Cantidad Afectada)
    let stockFinal = stockBase;
    if (estadoHerramienta === "No-Funciona" || estadoHerramienta === "Desaparecida") {
        stockFinal = stockBase - cantidadAfectada;
    }
    
    if (stockFinal < 0) {
        alert("Error: El stock disponible no puede ser negativo. Revisa la Cantidad Rota/Desaparecida.");
        return;
    }

  const datosModificados = {
    id_herramienta: id,
    nombre: nombre,
    categoria: categoria,
    marca: marca,
    modelo: modelo,
    descripcion: descripcion,
    stock: stockFinal, // Enviamos el stock DISPONIBLE
    estado: estadoHerramienta,
    // Estos campos son útiles para la lógica local y futura API:
    cantidadRota: estadoHerramienta === "No-Funciona" ? cantidadAfectada : 0,
    cantidadDesaparecida: estadoHerramienta === "Desaparecida" ? cantidadAfectada : 0,
    cantidadAfectada: cantidadAfectada // Total afectado
  };

  try {
    const respuesta = await fetch('api/modificar_herramienta.php', { // <-- ASUMIMOS ESTE ARCHIVO PHP
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosModificados)
    });

    const resultado = await respuesta.json();

    if (resultado.exito) {
      alert("Herramienta modificada correctamente.");
      await cargarHerramientasDesdeBD(); // **Recargar TODO para actualizar todas las vistas**
      cerrarModalEditar();
    } else {
     alert("Error al modificar: " + resultado.mensaje);
    }
  } catch (error) {
    console.error('Error de conexión o servidor:', error);
    alert('No se pudo conectar con el servidor.');
  }
});


// =====================
// HERRAMIENTAS ROTAS
// =====================
function mostrarHerramientasRotas() {
  const contenedor = document.getElementById("contenidoRoto");
  const rotas = herramientas.filter(h => h.estado === "No-Funciona" || h.estado === "Desaparecida");

  if (rotas.length === 0) {
    contenedor.innerHTML = "<p><b>No hay herramientas rotas ni desaparecidas.</b></p>";
    return;
  }

  let tabla = `
    <table class="tabla-estilo">
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Categoría</th>
        <th>Marca</th>
        <th>Modelo</th>
        <th>Estado</th>
        <th>Cantidad afectada</th>
        <th>Descripción</th>
      </tr>`;

  rotas.forEach(h => {
    const cantidad = h.cantidadAfectada || 0;

    tabla += `
      <tr>
        <td>${h.id_herramienta}</td>
        <td>${h.nombre}</td>
        <td>${h.categoria}</td>
        <td>${h.marca}</td>
        <td>${h.modelo}</td>
        <td>${h.estado}</td>
        <td>${cantidad}</td>
        <td>${h.descripcion}</td>
      </tr>`;
  });

  tabla += "</table>";
  contenedor.innerHTML = tabla;
}

actualizarTablaHerramientas(); // Para la vista de Inventario
mostrarHerramientasRotas(); // Si ya tenías esta llamada

// ===================================
// REGISTRAR NUEVA HERRAMIENTA (AJAX CON FILE UPLOAD)
// ===================================

document.getElementById("formAgregar").addEventListener("submit", async function(e) {
    e.preventDefault();

    // 1. Creamos el objeto FormData a partir del formulario. 
    // Esto adjunta automáticamente todos los campos y el archivo.
    const formData = new FormData(this); // 'this' apunta al formulario formAgregar

    // 2. Obtenemos el nombre del archivo para asegurarlo en la BD
    const imgFile = document.getElementById("imagen").files[0];
    const imgName = imgFile ? imgFile.name : 'default.jpg'; 
    
    // Aseguramos que 'img' tenga el nombre final correcto
    formData.set('img', imgName); 
    
    // 3. Validación de Stock
    const stock = parseInt(document.getElementById("stock").value);
    if (isNaN(stock) || stock <= 0) {
        alert("¡Error! El Stock inicial debe ser un número positivo.");
        return;
    }

    try {
        // IMPORTANTE: Al usar FormData, NO incluimos el header 'Content-Type: application/json'
        const respuesta = await fetch('api/registrar_herramienta.php', {
            method: 'POST',
            body: formData // Enviamos FormData directamente
        });
        
        // Verificamos si la respuesta falló (e.g., código 400 o 500)
        if (!respuesta.ok) {
            // Aquí puedes leer la respuesta de texto para ver el error HTML/PHP que rompe el JSON
            const errorText = await respuesta.text();
            console.error('Error del Servidor (no JSON):', errorText);
            alert("Error: El servidor devolvió un error de formato o código. Revisa la consola para el error PHP.");
            return;
        }

        const resultado = await respuesta.json();

        if (resultado.exito) {
            alert(resultado.mensaje);
            this.reset();
            await cargarHerramientasDesdeBD(); // Recargar la lista
            // Si tienes una función cerrarModalRegistro(), úsala aquí:
            // cerrarModalRegistro(); 
        } else {
            alert("Error al registrar: " + resultado.mensaje); 
        }

    } catch (error) {
        console.error('Error al intentar registrar la herramienta o fallo al parsear JSON:', error);
        alert("Ocurrió un error en la conexión o el servidor. Revisa la consola para más detalles.");
    }
});

cargarHerramientasDesdeBD();