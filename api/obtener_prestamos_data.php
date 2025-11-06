<?php
// api/obtener_prestamos_data.php 
header('Content-Type: application/json');
require 'conexion.php'; 

date_default_timezone_set('America/Argentina/Buenos_Aires');

try {
    $pdo->beginTransaction();

    // Solo se marcan los que están 'Pendiente' y cuya hora ya pasó HOY
    $sql_vencidos = "
        SELECT id_prestamo, cantidad, id_herramienta, profesor 
        FROM prestamos 
        WHERE estado_p = 'Pendiente' 
        AND fecha_p = CURRENT_DATE() 
        AND horaLimite < CURRENT_TIME()";

    $stmt_vencidos = $pdo->query($sql_vencidos);
    $vencidos = $stmt_vencidos->fetchAll(PDO::FETCH_ASSOC);

    if (!empty($vencidos)) {
        $fecha_registro = date('Y-m-d');
        $hora_registro = date('H:i:s');

        foreach ($vencidos as $v) {
            // 1. Insertar el pendiente en la tabla 'nodevuelto' (como registro de DEUDA)
            $sql_insert_nodev = "INSERT INTO nodevuelto (id_prestamo, id_herramienta, profesor, cantidad, fecha_registro, hora_registro) 
                                 VALUES (?, ?, ?, ?, ?, ?)";
            $stmt_insert_nodev = $pdo->prepare($sql_insert_nodev);
            $stmt_insert_nodev->execute([$v['id_prestamo'], $v['id_herramienta'], $v['profesor'], $v['cantidad'], $fecha_registro, $hora_registro]);

            // 2. Actualizar el estado del préstamo a 'Vencido' (MANTENIENDO la cantidad pendiente)
            $sql_update_prestamo = "UPDATE prestamos SET estado_p = 'Vencido' WHERE id_prestamo = ?";
            $stmt_update_prestamo = $pdo->prepare($sql_update_prestamo);
            $stmt_update_prestamo->execute([$v['id_prestamo']]);
        }
    }
    
    $pdo->commit();

    
    // 1. OBTENER PRÉSTAMOS PENDIENTES (y actualizados)
    $sqlPrestamos = "
        SELECT 
            p.*, 
            h.nombre,
            h.stock AS stock_actual_herramienta 
        FROM prestamos p 
        JOIN herramientas h ON p.id_herramienta = h.id_herramienta
        ORDER BY p.id_prestamo DESC"; 

    $stmtPrestamos = $pdo->query($sqlPrestamos);
    $prestamos = $stmtPrestamos->fetchAll(PDO::FETCH_ASSOC);

    // 2. OBTENER DEVOLUCIONES
    $sqlDevoluciones = "
        SELECT 
            d.id_devolucion, 
            d.id_prestamo, 
            d.cantidad_devuelta AS cantidad, 
            d.hora, 
            d.fecha, 
            p.profesor, 
            p.id_herramienta
        FROM devoluciones d
        JOIN prestamos p ON d.id_prestamo = p.id_prestamo
        ORDER BY d.id_devolucion DESC"; 

    $stmtDevoluciones = $pdo->query($sqlDevoluciones);
    $devoluciones = $stmtDevoluciones->fetchAll(PDO::FETCH_ASSOC);

    // 3. OBTENER NO DEVUELTOS
    $sqlNoDevuelto = "
        SELECT 
            nd.*, 
            h.nombre 
        FROM nodevuelto nd 
        JOIN herramientas h ON nd.id_herramienta = h.id_herramienta
        ORDER BY nd.id_nodevuelto DESC";

    $stmtNoDevuelto = $pdo->query($sqlNoDevuelto);
    $nodevuelto = $stmtNoDevuelto->fetchAll(PDO::FETCH_ASSOC);

    // Combina los 3 resultados en un único JSON
    echo json_encode([
        'prestamos' => $prestamos,
        'devoluciones' => $devoluciones,
        'nodevuelto' => $nodevuelto
    ]);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(["exito" => false, "mensaje" => "Error de base de datos: " . $e->getMessage()]);
}

?>