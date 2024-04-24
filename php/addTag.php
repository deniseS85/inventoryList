<?php

include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
   
    if (isset($_POST['tag-name']) && isset($_POST['tag-color']) && !empty($_POST['tag-name'])) {
        $tag_name = $_POST['tag-name'];
        $tag_color = $_POST['tag-color'];

        $sql = "INSERT INTO Tags (tag_name, color) VALUES ('$tag_name', '$tag_color')";

        if (mysqli_query($conn, $sql)) {
            echo "Tag erfolgreich hinzugefügt";
            
        } else {
            echo "Fehler beim Hinzufügen des Tags: " . mysqli_error($conn);
        }
    } else {
        echo "Tagnamenfeld nicht gesetzt";
    }
} else {
    echo "Das Formular wurde nicht gesendet";
}

mysqli_close($conn);
?>