<?php
// api/resolver_deuda.php
header('Content-Type: application/json');
require 'conexion.php'; 

date_default_timezone_set('America/Argentina/Buenos_Aires');

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_nodevuelto'], $data['id_prestamo'], $data['id_herramienta'], $data['cantidad_recuperada']) || $data['cantidad_recuperada'] < 0) {
    http_response_code(400);
    echo json_encode(['exito' => false, 'mensaje' => 'Datos incompletos o inválidos.']);
    exit;
}

$id_nodevuelto = $data['id_nodevuelto'];
$id_prestamo = $data['id_prestamo'];
$id_herramienta = $data['id_herramienta'];
$recuperado = (int)$data['cantidad_recuperada'];

$fecha = date('Y-m-d');
$hora = date('H:i:s');

try {
    $pdo->beginTransaction();

    // 1. Si se recuperó alguna cantidad (Devolución Tarde)
    if ($recuperado > 0) {
        // Registrar la devolución en la tabla 'devoluciones'
        $sql_devolucion = "INSERT INTO devoluciones (id_prestamo, cantidad_devuelta, hora, fecha) 
                           VALUES (?, ?, ?, ?)";
        $stmt_devolucion = $pdo->prepare($sql_devolucion);
        $stmt_devolucion->execute([$id_prestamo, $recuperado, $hora, $fecha]);
        
        // Aumentar el Stock
        $sql_stock = "UPDATE herramientas SET stock = stock + ? WHERE id_herramienta = ?";
        $stmt_stock = $pdo->prepare($sql_stock);
        $stmt_stock->execute([$recuperado, $id_herramienta]);
    }

    // 2. Eliminar el registro de deuda de la tabla 'nodevuelto'
    $sql_delete_nodevuelto = "DELETE FROM nodevuelto WHERE id_nodevuelto = ?";
    $stmt_delete_nodevuelto = $pdo->prepare($sql_delete_nodevuelto);
    $stmt_delete_nodevuelto->execute([$id_nodevuelto]);

    // 3. Actualizar el estado del préstamo original en 'prestamos'
    // Se revisa si existen OTRAS deudas pendientes para este préstamo.
    $stmt_check = $pdo->prepare("SELECT COUNT(*) FROM nodevuelto WHERE id_prestamo = ?");
    $stmt_check->execute([$id_prestamo]);
    $deudas_restantes = $stmt_check->fetchColumn();

    $nuevo_estado_prestamo;
    if ($deudas_restantes == 0) {
        // Si no hay más registros en 'nodevuelto' para este préstamo, se considera totalmente resuelto.
        $nuevo_estado_prestamo = ($recuperado > 0) ? 'Devuelto Tarde' : 'Perdido Cerrado';
    } else {
        // Si hay otras deudas (por ejemplo, por una devolución parcial que sigue en nodevuelto), se deja como Parcial Tarde
        $nuevo_estado_prestamo = 'Parcial Tarde';
    }

    // Nota: La cantidad en 'prestamos' ya debería ser 0 si se usó el flujo 'Transferido a No Devuelto'
    $sql_prestamo = "UPDATE prestamos SET estado_p = ? WHERE id_prestamo = ?";
    $stmt_prestamo = $pdo->prepare($sql_prestamo);
    $stmt_prestamo->execute([$nuevo_estado_prestamo, $id_prestamo]);
    
    $pdo->commit();
    echo json_encode(['exito' => true, 'mensaje' => 'Deuda resuelta y registros actualizados.']);

} catch (Exception $e) {
    if ($pdo->inTransaction()) { $pdo->rollBack(); }
    error_log("Fallo al resolver deuda: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['exito' => false, 'mensaje' => 'Error de base de datos al gestionar la deuda: ' . $e->getMessage()]);
}
?>