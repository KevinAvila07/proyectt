<?php
// api/verificar_vencimiento.php (SCRIPT DE MANTENIMIENTO)
header('Content-Type: application/json');
require 'conexion.php'; 

try {
    // 1. OBTENER PRÉSTAMOS VENCIDOS
    // Buscamos préstamos que estén "Pendiente" y cuya hora límite haya pasado.
    $sqlVencidos = "
        SELECT 
            id_prestamo, id_herramienta, profesor, curso, cantidad, fecha_p 
        FROM prestamos 
        WHERE estado_p = 'Pendiente' 
        AND (
            (fecha_p = CURDATE() AND horaLimite < CURTIME()) OR 
            (fecha_p < CURDATE())
        )
    ";
    
    $stmtVencidos = $pdo->query($sqlVencidos);
    $vencidos = $stmtVencidos->fetchAll(PDO::FETCH_ASSOC);

    if (empty($vencidos)) {
        echo json_encode(['exito' => true, 'mensaje' => 'No hay préstamos vencidos que actualizar.']);
        exit;
    }

    $pdo->beginTransaction();
    $conteoTransferidos = 0;

    // 2. PROCESAR CADA PRÉSTAMO VENCIDO
    foreach ($vencidos as $p) {
        $id_prestamo = $p['id_prestamo'];
        $id_herramienta = $p['id_herramienta'];
        $profesor = $p['profesor'];
        $cantidad = $p['cantidad'];

        // A. Insertar en la tabla 'nodevuelto'
        $sqlInsert = "INSERT INTO nodevuelto (id_prestamo, id_herramienta, profesor, cantidad, fecha_registro) 
                      VALUES (:id_prestamo, :id_herramienta, :profesor, :cantidad, CURDATE())";
        $stmtInsert = $pdo->prepare($sqlInsert);
        $stmtInsert->execute([
            'id_prestamo' => $id_prestamo,
            'id_herramienta' => $id_herramienta,
            'profesor' => $profesor,
            'cantidad' => $cantidad
        ]);

        // B. Actualizar el estado en la tabla 'prestamos'
        $sqlUpdate = "UPDATE prestamos SET estado_p = 'No Devuelto' WHERE id_prestamo = :id_prestamo";
        $stmtUpdate = $pdo->prepare($sqlUpdate);
        $stmtUpdate->execute(['id_prestamo' => $id_prestamo]);
        
        $conteoTransferidos++;
    }

    $pdo->commit();
    echo json_encode(['exito' => true, 'mensaje' => "Éxito: Se marcaron $conteoTransferidos préstamos como No Devuelto."]);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("Error en verificar_vencimiento: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["exito" => false, "mensaje" => "Fallo en la BD: " . $e->getMessage()]);
}
?>