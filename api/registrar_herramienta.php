<?php
// api/registrar_herramienta.php (CÓDIGO FINAL CORREGIDO PARA ARCHIVOS)
header('Content-Type: application/json');
require 'conexion.php'; 

// 1. Obtener datos de $_POST 
$nombre = $_POST['nombre'] ?? '';
$categoria = $_POST['categoria'] ?? '';
$marca = $_POST['marca'] ?? '';
$modelo = $_POST['modelo'] ?? '';
$descripcion = $_POST['descripcion'] ?? '';
$stock = (int)($_POST['stock'] ?? 0);
$estado = $_POST['estado'] ?? 'Normal'; 
$img = $_POST['img'] ?? 'default.jpg'; 

// 2. Validación
if (empty($nombre) || empty($categoria) || empty($marca) || empty($modelo) || empty($descripcion) || $stock <= 0) 
{
    http_response_code(400);
    echo json_encode(["exito" => false, "mensaje" => "Faltan datos obligatorios o stock inválido."]);
    exit();
}

// 3. Manejo de la subida de la imagen (LA PARTE CLAVE: usando $_FILES)
if (isset($_FILES['imagenFile']) && $_FILES['imagenFile']['error'] === UPLOAD_ERR_OK) {
    
    $fileTmpPath = $_FILES['imagenFile']['tmp_name'];
    $fileName = $_FILES['imagenFile']['name'];
    
    // **Ruta de destino:** Asegúrate de que esta ruta sea correcta
    $destPath = '../imagenespract/' . $fileName; 

    if (move_uploaded_file($fileTmpPath, $destPath)) {
        $img = $fileName; 
    } else {
        echo json_encode(["exito" => false, "mensaje" => "Error al guardar la imagen. Verifique permisos de la carpeta 'imagenespract'."]);
        exit;
    }
}

// 4. Registro en la base de datos
try {
    $sql = "INSERT INTO herramientas (nombre, categoria, marca, modelo, stock, descripcion, img, estado) 
             VALUES (:nombre, :categoria, :marca, :modelo, :stock, :descripcion, :img, :estado)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nombre' => $nombre,
        ':categoria' => $categoria,
        ':marca' => $marca,
        ':modelo' => $modelo,
        ':stock' => $stock,
        ':descripcion' => $descripcion,
        ':img' => $img, 
        ':estado' => $estado
    ]);

    echo json_encode(["exito" => true, "mensaje" => "Herramienta registrada y datos guardados correctamente."]);

} catch (PDOException $e) {
    http_response_code(500); 
    echo json_encode(["exito" => false, "mensaje" => "Error de base de datos al registrar: " . $e->getMessage()]);
}
?>