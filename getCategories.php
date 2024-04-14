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

// SQL-Abfrage zum Abrufen aller Kategorien
$sql = "SELECT category_name FROM Categories";
$result = mysqli_query($conn, $sql);

if (!$result) {
  die("Error fetching categories: " . mysqli_error($conn));
}

// Array zum Speichern der Kategorien
$categories = array();

// Alle Kategorien aus dem Abfrageergebnis holen
while ($row = mysqli_fetch_assoc($result)) {
  $categories[] = $row['category_name'];
}

// JSON-Ausgabe der Kategorien
echo json_encode($categories);

// Verbindung zur Datenbank schließen
mysqli_close($conn);
?>