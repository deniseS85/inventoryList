<?php

include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
   
    if (isset($_POST['category-name']) && !empty($_POST['category-name'])) {
        $category_name = $_POST['category-name'];

        $sql = "INSERT INTO Categories (category_name) VALUES ('$category_name')";

        if (mysqli_query($conn, $sql)) {
            echo "Kategorie erfolgreich hinzugefügt";
            header("Location: http://localhost/inventoryList/");
        } else {
            echo "Fehler beim Hinzufügen der Kategorie: " . mysqli_error($conn);
        }
    } else {
        echo "Kategorienamenfeld nicht gesetzt";
    }
} else {
    echo "Das Formular wurde nicht gesendet";
}

mysqli_close($conn);
?>