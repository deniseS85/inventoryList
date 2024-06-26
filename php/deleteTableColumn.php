<?php
session_start();
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'];

    $sqlDeleteCustomField = "DELETE FROM UserCustomFields WHERE ID = ?";
    $stmtDeleteCustomField = $conn->prepare($sqlDeleteCustomField);
    $stmtDeleteCustomField->bind_param("i", $id);

    if ($stmtDeleteCustomField->execute()) {
        $sqlSelectProducts = "SELECT ID, custom_fields FROM Products WHERE custom_fields IS NOT NULL";
        $result = $conn->query($sqlSelectProducts);

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $productId = $row['ID'];
                $customFields = json_decode($row['custom_fields'], true);

                if (isset($customFields[$id])) {
                    unset($customFields[$id]);
                    $updatedCustomFields = json_encode($customFields);

                    $sqlUpdateProducts = "UPDATE Products SET custom_fields = ? WHERE ID = ?";
                    $stmtUpdateProducts = $conn->prepare($sqlUpdateProducts);
                    $stmtUpdateProducts->bind_param("si", $updatedCustomFields, $productId);

                    if ($stmtUpdateProducts->execute()) {
                        echo "Benutzerdefiniertes Feld erfolgreich gelöscht und in Products aktualisiert";
                    } else {
                        echo "Fehler beim Aktualisieren der Products-Tabelle: " . $stmtUpdateProducts->error;
                    }

                    $stmtUpdateProducts->close();
                }
            }
        } else {
            echo "Keine Produkte gefunden, die custom_fields enthalten";
        }

        $result->close();
    } else {
        echo "Fehler beim Löschen des Datensatzes in UserCustomFields: " . $stmtDeleteCustomField->error;
    }

    $stmtDeleteCustomField->close();
} else {
    echo "Ungültige Anfrage";
}

$conn->close();
?>
