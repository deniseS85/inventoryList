<?php
session_start();
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_SESSION['user_id']) && isset($_POST['category-name']) && !empty($_POST['category-name'])) {
        $category_name = $_POST['category-name'];
        $user_id = $_SESSION['user_id'];
        $stmt = $conn->prepare("INSERT INTO Categories (category_name, user_id) VALUES (?, ?)");
        $stmt->bind_param("si", $category_name, $user_id);

        if ($stmt->execute()) {
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