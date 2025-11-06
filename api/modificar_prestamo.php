<?php
// api/modificar_prestamo.php 
header('Content-Type: application/json');

// Incluye el archivo de conexión (asume que 'conexion.php' usa PDO y define $pdo)
require 'conexion.php'; 

date_default_timezone_set('America/Argentina/Buenos_Aires');

// 1. Decodificar los datos JSON
$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data['id_prestamo'], $data['cantidad_devuelta'], $data['nuevo_estado'], $data['id_herramienta'], $data['profesor']) ||
    $data['cantidad_devuelta'] < 0
) {
    echo json_encode(['exito' => false, 'mensaje' => 'Datos incompletos o inválidos.']);
    exit;
}

$id_prestamo = $data['id_prestamo'];
$devuelto = (int)$data['cantidad_devuelta']; // Cantidad devuelta AHORA
$nuevo_estado = $data['nuevo_estado'];
$id_herramienta = $data['id_herramienta'];
$profesor = $data['profesor'];

// Obtener la fecha y hora actual para el registro de la devolución/no devuelto
$fecha = date('Y-m-d');
$hora = date('H:i:s');

try {
    // 1. INICIAR TRANSACCIÓN PDO
    $pdo->beginTransaction();

    // --- 2. Obtener la cantidad actual pendiente del préstamo ---
    $sql_get_cantidad = "SELECT cantidad FROM prestamos WHERE id_prestamo = ?";
    $stmt_get_cantidad = $pdo->prepare($sql_get_cantidad);
    $stmt_get_cantidad->execute([$id_prestamo]);
    $prestamo_actual = $stmt_get_cantidad->fetch(PDO::FETCH_ASSOC);

    if (!$prestamo_actual) {
        throw new Exception("Préstamo no encontrado.");
    }

    $cantidad_anterior = (int)$prestamo_actual['cantidad'];

    // Validar si la cantidad devuelta es mayor a la pendiente
    if ($devuelto > $cantidad_anterior) {
        throw new Exception("La cantidad devuelta ($devuelto) excede la pendiente ($cantidad_anterior).");
    }

    // Calcular la cantidad restante
    $nueva_cantidad_pendiente = $cantidad_anterior - $devuelto;
    $estado_final = $nuevo_estado;

    // --- 3. Registro de Devolución (solo si hubo una devolución parcial o total) ---
    if ($devuelto > 0) {
        $sql_devolucion = "INSERT INTO devoluciones (id_prestamo, cantidad_devuelta, hora, fecha) 
                           VALUES (?, ?, ?, ?)";
        $stmt_devolucion = $pdo->prepare($sql_devolucion);
        $stmt_devolucion->execute([$id_prestamo, $devuelto, $hora, $fecha]);
    }

    // --- 4. LÓGICA CLAVE: Transferir a nodevuelto si el estado es 'No Devuelto' ---
    if ($nuevo_estado === 'No Devuelto' && $nueva_cantidad_pendiente > 0) {
        
        $cantidad_a_nodevuelto = $nueva_cantidad_pendiente;

        // A. Insertar en la tabla 'nodevuelto'
        $sql_nodevuelto = "INSERT INTO nodevuelto (id_prestamo, id_herramienta, profesor, cantidad, fecha_registro) 
                           VALUES (?, ?, ?, ?, ?)";
        $stmt_nodevuelto = $pdo->prepare($sql_nodevuelto);
        $stmt_nodevuelto->execute([
            $id_prestamo, 
            $id_herramienta, 
            $profesor, 
            $cantidad_a_nodevuelto, 
            $fecha
        ]);
        
        // B. Cerrar el préstamo original en la tabla 'prestamos'
        // Lo ponemos en 0 y asignamos el estado 'Transferido a No Devuelto' para que no siga apareciendo como pendiente.
        $nueva_cantidad_pendiente = 0;
        $estado_final = "Transferido a No Devuelto"; 
        
    } else {
    // Si no se está cerrando manualmente como deuda:
    
    // 1. Obtener el estado original para ver si estaba vencido
    $stmt_original = $pdo->prepare("SELECT estado_p FROM prestamos WHERE id_prestamo = ?");
    $stmt_original->execute([$id_prestamo]);
    $estado_p_original = $stmt_original->fetchColumn();

    if ($nueva_cantidad_pendiente <= 0) {
        // Devolución Total
        $estado_final = ($estado_p_original === 'Vencido') ? "Devuelto Tarde" : "Devuelto";
    } else {
        // Devolución Parcial
        $estado_final = ($estado_p_original === 'Vencido' || $estado_p_original === 'Parcial Tarde') ? "Parcial Tarde" : "Parcial";
    }
}



    // --- 5. Actualizar el Préstamo en la tabla 'prestamos' ---
    // Usamos $estado_final y $nueva_cantidad_pendiente actualizados.
    $sql_prestamo = "UPDATE prestamos SET cantidad = ?, estado_p = ? WHERE id_prestamo = ?";
    $stmt_prestamo = $pdo->prepare($sql_prestamo);
    $stmt_prestamo->execute([$nueva_cantidad_pendiente, $estado_final, $id_prestamo]);
    
    // --- 6. Actualizar el Inventario (Aumentar el Stock solo por lo que SÍ fue devuelto) ---
    if ($devuelto > 0) {
        $sql_stock = "UPDATE herramientas SET stock = stock + ? WHERE id_herramienta = ?";
        $stmt_stock = $pdo->prepare($sql_stock);
        $stmt_stock->execute([$devuelto, $id_herramienta]);
    }
    
    // 7. CONFIRMAR TRANSACCIÓN
    $pdo->commit();

    echo json_encode(['exito' => true, 'mensaje' => 'Préstamo y stock actualizados con éxito.']);

} catch (Exception $e) {
    // Si algo falla, revertir la transacción
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("Fallo al modificar préstamo: " . $e->getMessage());
    echo json_encode(['exito' => false, 'mensaje' => 'Fallo al actualizar en la base de datos: ' . $e->getMessage()]);
}
?>