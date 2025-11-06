<?php
header('Content-Type: application/json');
require 'conexion.php'; // Incluye el script de conexión $pdo

try {
    
    $sql = "
        SELECT 
            h.id_herramienta, 
            h.nombre, 
            h.categoria, 
            h.marca, 
            h.modelo, 
            h.descripcion,
            h.stock,
            h.cantidadAfectada,
            h.img,
            -- Lógica de conexión:
            CASE 
                WHEN hr.id_herramienta IS NOT NULL THEN 'No-Funciona' -- Si hay registro en rotas
                ELSE h.estado -- Si no hay registro en rotas
            END AS estado 
        FROM 
            herramientas h
        LEFT JOIN 
            herramientasrotas hr ON h.id_herramienta = hr.id_herramienta
        ORDER BY 
            h.id_herramienta;
    ";

    $stmt = $pdo->query($sql);
    $herramientas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Devuelve los datos en formato JSON
    echo json_encode($herramientas);

} catch (PDOException $e) {
    http_response_code(500);
    error_log("Error al obtener herramientas: " . $e->getMessage());
    echo json_encode(["error" => "Error al obtener herramientas: " . $e->getMessage()]);
}
?>