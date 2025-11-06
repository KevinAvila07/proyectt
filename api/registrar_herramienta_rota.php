<?php
// api/registrar_herramienta_rota.php
header('Content-Type: application/json');
require 'conexion.php'; // Incluye el script de conexión $pdo

// 1. Decodificar los datos JSON enviados desde el frontend
$data = json_decode(file_get_contents("php://input"), true);

// Validar datos mínimos
if (!isset($data['id_herramienta'], $data['cantidad_afectada'])) {
    http_response_code(400);
    echo json_encode(['exito' => false, 'mensaje' => 'Datos incompletos para registrar la herramienta rota.']);
    exit;
}

$id_herramienta = $data['id_herramienta'];
$cantidad_afectada = (int)$data['cantidad_afectada'];

if ($cantidad_afectada <= 0) {
    http_response_code(400);
    echo json_encode(['exito' => false, 'mensaje' => 'La cantidad afectada debe ser positiva.']);
    exit;
}

try {
    // Iniciar una transacción para asegurar que ambas operaciones (INSERT y UPDATE) se completen o ninguna lo haga.
    $pdo->beginTransaction();

    // 2. Insertar el registro en la tabla herramientasrotas
    // (Asumimos que solo se registra la existencia del problema, sin cantidad específica en esta tabla)
    $sql_insert = "INSERT INTO herramientasrotas (id_herramienta) VALUES (:id_herramienta)";
    $stmt_insert = $pdo->prepare($sql_insert);
    $stmt_insert->execute([':id_herramienta' => $id_herramienta]);

    // 3. Actualizar el stock/cantidadAfectada en la tabla herramientas principal
    // Aquí puedes elegir una de estas dos lógicas:
    
    // Lógica A: Reducir el stock disponible. (Si la cantidad afectada ya no se considera 'usable')
    $sql_update = "UPDATE herramientas 
                   SET stock = stock - :cantidad_afectada, 
                       estado = 'No-Funciona' 
                   WHERE id_herramienta = :id_herramienta AND stock >= :cantidad_afectada";
    
    // Lógica B: Solo actualizar cantidadAfectada (si el stock se reduce en otro flujo)
    /*
    $sql_update = "UPDATE herramientas 
                   SET cantidadAfectada = cantidadAfectada + :cantidad_afectada,
                       estado = 'No-Funciona'
                   WHERE id_herramienta = :id_herramienta";
    */

    $stmt_update = $pdo->prepare($sql_update);
    $stmt_update->execute([
        ':cantidad_afectada' => $cantidad_afectada,
        ':id_herramienta' => $id_herramienta
    ]);

    // Verificar si la actualización afectó alguna fila (solo para Lógica A si quieres ser estricto)
    if ($stmt_update->rowCount() === 0) {
        // Podría ser que el stock era insuficiente.
        $pdo->rollBack();
        http_response_code(409); // Conflict
        echo json_encode(['exito' => false, 'mensaje' => 'Error: Stock insuficiente o ID de herramienta no existe.']);
        exit;
    }
    
    // 4. Confirmar la transacción
    $pdo->commit();

    echo json_encode([
        'exito' => true, 
        'mensaje' => "Herramienta ID $id_herramienta registrada como rota y stock actualizado."
    ]);

} catch (PDOException $e) {
    // Si algo falló, revertir la transacción
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    error_log("Error de transacción al registrar herramienta rota: " . $e->getMessage());
    echo json_encode(['exito' => false, 'mensaje' => 'Error de base de datos: ' . $e->getMessage()]);
}

?>