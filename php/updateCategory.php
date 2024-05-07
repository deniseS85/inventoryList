<?php
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $newCategoryName = $_POST['newCategoryName'];
    $categoryId = $_POST['categoryId'];
    $stmt = $conn->prepare("UPDATE Categories SET category_name = ? WHERE ID = ?");
    $stmt->bind_param("si", $newCategoryName, $categoryId);

    if ($stmt->execute()) {
        echo "Kategorie erfolgreich aktualisiert";
        header("Location: http://localhost/inventoryList/");
    } else {
        echo "Fehler beim Aktualisieren der Kategorie: " . $stmt->error;
    }

    $stmt->close();
    mysqli_close($conn);
}
?>
