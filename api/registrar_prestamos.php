<?php
// api/registrar_prestamos.php (CÓDIGO CORREGIDO)
header('Content-Type: application/json');
require 'conexion.php'; 

// 1. Obtener datos del JSON enviado por JavaScript
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Validar que se recibieron los datos esperados
if (!isset($data['id_herramienta'], $data['cantidad'], $data['profesor'], $data['curso'], $data['turno'], $data['horaRetiro'])) {
    echo json_encode(["exito" => false, "mensaje" => "Faltan datos requeridos (ID Herramienta, Cantidad, Profesor, Curso, Turno, Hora Retiro)."]);
    exit;
}

$id_herramienta = $data['id_herramienta'];
$cantidad = $data['cantidad'];
$profesor = $data['profesor'];
$curso = $data['curso'];
$turno = $data['turno'];
$horaRetiro = $data['horaRetiro'];

// Variables generadas por el servidor
$fecha_p = date('Y-m-d');
$horaLimite = null; // Usar null si no se puede determinar la hora límite

switch ($turno) {
    case 'Mañana':
        $horaLimite = '11:30:00'; 
        break;
    case 'Tarde':
        $horaLimite = '16:30:00'; 
        break;
    case 'Noche':
        $horaLimite = '20:30:00'; 
        break;
    default:
        // Si el turno no coincide, puedes asignar un valor por defecto o lanzar un error.
        // Por ahora, lo dejamos en null y dejamos que la BD maneje el valor DEFAULT.
        // Si la columna 'horaLimite' en la BD es NOT NULL, debes asignar un valor.
        $horaLimite = '18:00:00'; // Valor por defecto si el turno no coincide
}

$estado_p = "Pendiente";

try {
    // 1. INICIAR TRANSACCIÓN
    $pdo->beginTransaction();

    // 2. INSERTAR el nuevo préstamo en la tabla 'prestamos'
    $sqlInsert = "INSERT INTO prestamos (id_herramienta, profesor, curso, turno, cantidad, fecha_p, horaRetiro, horaLimite, estado_p) 
                  VALUES (:id_herramienta, :profesor, :curso, :turno, :cantidad, :fecha_p, :horaRetiro, :horaLimite, :estado_p)";
    
    $stmt = $pdo->prepare($sqlInsert);
    $stmt->execute([
        'id_herramienta' => $id_herramienta,
        'profesor' => $profesor,
        'curso' => $curso,
        'turno' => $turno,
        'cantidad' => $cantidad,
        'fecha_p' => $fecha_p,
        'horaRetiro' => $horaRetiro,
        'horaLimite' => $horaLimite, // Ahora siempre tiene un valor
        'estado_p' => $estado_p
    ]);
    
    // 3. ACTUALIZAR el stock de la herramienta en la tabla 'herramientas'
    $sqlUpdate = "UPDATE herramientas SET stock = stock - :cantidad WHERE id_herramienta = :id_herramienta";
    
    $stmt = $pdo->prepare($sqlUpdate);
    $stmt->execute([
        'cantidad' => $cantidad,
        'id_herramienta' => $id_herramienta
    ]);

    // 4. CONFIRMAR TRANSACCIÓN
    $pdo->commit();

    // 5. RESPUESTA EXITOSA a JavaScript
    echo json_encode(["exito" => true, "mensaje" => "Préstamo registrado correctamente."]);

} catch (PDOException $e) {
    // Si algo falló, deshacer los cambios
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    // El mensaje de error ahora incluye detalles del fallo de PDO
    error_log("Error al registrar préstamo: " . $e->getMessage());
    echo json_encode(["exito" => false, "mensaje" => "Fallo en la base de datos al registrar: " . $e->getMessage()]);
}
?>