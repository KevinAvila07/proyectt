<?php
$host = 'localhost'; // O la IP de tu servidor de BD
$usuario = 'root';   // El usuario de tu BD (cambiar por seguridad)
$contrasena = '';    // La contraseña de tu BD (cambiar por seguridad)
$base_de_datos = 'panol'; // Nombre de la BD de tu panol.sql

try {
    $pdo = new PDO("mysql:host=$host;dbname=$base_de_datos;charset=utf8", $usuario, $contrasena);
    // Establecer el modo de error de PDO a excepción
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Si la conexión falla, muestra un error y detén el script
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión a la base de datos: " . $e->getMessage()]);
    exit();
}
?>