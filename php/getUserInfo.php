<?php
session_start();
include 'db_connection.php';

if (!isset($_SESSION['user_id'])) {
    die("Benutzer ist nicht angemeldet.");
}

$user_id = $_SESSION['user_id'];

header('Content-Type: application/json');

$sql = "SELECT * FROM Users WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => 'Fehler beim Abrufen der Kundendaten: ' . $stmt->error]);
    exit;
}

$userData = array();

while ($row = $result->fetch_assoc()) {
    $userData[] = $row;
}

echo json_encode($userData);

$stmt->close();
mysqli_close($conn);
?>
