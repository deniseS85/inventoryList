<?php
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $newCategoryName = $_POST['newCategoryName'];
    $categoryId = $_POST['categoryId'];

    
    $sql = "UPDATE Categories SET category_name='$newCategoryName' WHERE ID=$categoryId";

    if (mysqli_query($conn, $sql)) {
        echo "Kategorie erfolgreich aktualisiert";
        header("Location: http://localhost/inventoryList/");
    } else {
        echo "Fehler beim Aktualisieren der Kategorie: " . mysqli_error($conn);
    }

    mysqli_close($conn);
}
?>