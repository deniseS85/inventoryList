<?php
session_start();
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['token'])) {
    $token = $_POST['token'];

    $stmt = $conn->prepare("UPDATE Users SET remember_token = ? WHERE id = ?");
    $stmt->bind_param("si", $token, $_SESSION['user_id']);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo "Remember token set successfully";
    } else {
        echo "Failed to set remember token";
    }
} else {
    echo "Invalid request";
}
?>