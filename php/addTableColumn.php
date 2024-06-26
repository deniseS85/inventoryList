<?php
session_start();
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $columnName = $_POST['column-name'];
    $columnType = $_POST['column_type'];
    $userId = $_SESSION['user_id'];

    $sqlInsert = "INSERT INTO UserCustomFields (user_id, field_name, field_type) VALUES (?, ?, ?)";
    
    $stmtInsert = $conn->prepare($sqlInsert);
    $stmtInsert->bind_param("iss", $userId, $columnName, $columnType);

    if ($stmtInsert->execute()) {
        echo "Benutzerdefiniertes Feld erfolgreich hinzugefügt.";
    } else {
        echo "Fehler beim Hinzufügen des benutzerdefinierten Feldes: " . $stmtInsert->error;
    }

    $stmtInsert->close();
    $conn->close();
} else {
    echo "Ungültige Anfrage";
}
?>
