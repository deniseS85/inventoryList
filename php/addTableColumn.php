<?php
session_start();
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $columnName = $_POST['column-name'];
    $columnType = $_POST['column_type'];
    $userId = $_SESSION['user_id'];

    switch ($columnType) {
        case 'VARCHAR':
            $sql = "INSERT INTO UserCustomFields (user_id, field_name, field_value_varchar) VALUES (?, ?, '')";
            break;
        case 'INT':
            $sql = "INSERT INTO UserCustomFields (user_id, field_name, field_value_int) VALUES (?, ?, 0)";
            break;
        case 'DATE':
            $sql = "INSERT INTO UserCustomFields (user_id, field_name, field_value_date) VALUES (?, ?, '1970-01-01')";
            break;
        default:
            echo "Ungültiger Datentyp ausgewählt.";
            exit;
    }
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("is", $userId, $columnName);

    if ($stmt->execute()) {
        echo "Datensatz erfolgreich hinzugefügt";
    } else {
        echo "Fehler beim Hinzufügen der benutzerdefinierten Spalte: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Ungültige Anfrage";
}

$conn->close();
?>

