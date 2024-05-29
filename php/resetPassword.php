<?php
session_start();
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['forgotEmail'])) {
    $email = $_POST['forgotEmail'];
    $stmt = $conn->prepare("SELECT * FROM Users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $token = bin2hex(random_bytes(32));

        $stmt = $conn->prepare("UPDATE Users SET reset_token = ? WHERE email = ?");
        $stmt->bind_param("ss", $token, $email);
        $stmt->execute();

        $reset_link = "http://localhost/inventoryList/authentification/resetPasswordForm.php?token=$token";
        header("Location: $reset_link");
        exit;
    } else {
        $forgot_error = "Benutzer mit dieser E-Mail-Adresse nicht gefunden.";
        echo $forgot_error;
    }
}
?>