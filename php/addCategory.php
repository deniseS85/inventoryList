<?php
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['category-name']) && !empty($_POST['category-name'])) {
        $category_name = $_POST['category-name'];
        $stmt = $conn->prepare("INSERT INTO Categories (category_name) VALUES (?)");
        $stmt->bind_param("s", $category_name);

        if ($stmt->execute()) {
            echo "Kategorie erfolgreich hinzugefügt";
            header("Location: http://localhost/inventoryList/");
        } else {
            echo "Fehler beim Hinzufügen der Kategorie: " . $stmt->error;
        }
        $stmt->close();
    } else {
        echo "Kategorienamenfeld nicht gesetzt";
    }
} else {
    echo "Das Formular wurde nicht gesendet";
}

mysqli_close($conn);
?>
