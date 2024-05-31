<?php
session_start();
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['token']) && isset($_POST['newPassword'])) {
    $token = $_POST['token'];
    $newPassword = password_hash($_POST['newPassword'], PASSWORD_DEFAULT);

    $stmt = $conn->prepare("SELECT * FROM Users WHERE reset_token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $stmt = $conn->prepare("UPDATE Users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ?");
        $stmt->bind_param("ss", $newPassword, $token);
        $stmt->execute();
        header("Location: http://localhost/inventoryList/");
        exit;
    } else {
        echo "Ungültiger oder abgelaufener Token.";
    }
}
?>
