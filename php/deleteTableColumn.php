<?php
session_start();
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'];

    $sql = "DELETE FROM UserCustomFields WHERE ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo "Datensatz erfolgreich gelöscht";
    } else {
        echo "Fehler beim Löschen des Datensatzes: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Ungültige Anfrage";
}

$conn->close();
?>
