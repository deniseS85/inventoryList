<?php
// Stellen Sie eine Verbindung zur Datenbank her
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "InventoryList";

$conn = mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

// Überprüfen Sie, ob das Formular gesendet wurde
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Überprüfen Sie, ob das Formularfeld für den Kategorienamen gesetzt ist
    if (isset($_POST['category-name']) && !empty($_POST['category-name'])) {
        $category_name = $_POST['category-name'];

        // Führen Sie die SQL-Abfrage zum Einfügen der Kategorie durch
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

// Schließen Sie die Verbindung zur Datenbank
mysqli_close($conn);
?>