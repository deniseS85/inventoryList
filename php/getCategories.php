<?php
session_start();
include 'db_connection.php';

if (!isset($_SESSION['user_id'])) {
  die("Benutzer ist nicht angemeldet.");
}

$user_id = $_SESSION['user_id'];
$sql = "SELECT * FROM Categories WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if (!$result) {
  die("Fehler beim Abrufen der Kategorien: " . mysqli_error($conn));
}

$categories = array();

while ($row = mysqli_fetch_assoc($result)) {
    $category = array(
      'id' => $row['ID'],
      'name' => $row['category_name']
    );
    $categories[] = $category;
  }

echo json_encode($categories);

$stmt->close();
mysqli_close($conn);
?>