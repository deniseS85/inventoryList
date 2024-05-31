<?php
session_start();
include 'db_connection.php';
require 'send_mail.php';

$emailSent = null;

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['forgotEmail'])) {
    $email = $_POST['forgotEmail'];
    $stmt = $conn->prepare("SELECT * FROM Users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        $username = $row['username'];
        $token = bin2hex(random_bytes(32));
        $expiry_date = date("Y-m-d H:i:s", time() + 60 * 30);

        $stmt = $conn->prepare("UPDATE Users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?");
        $stmt->bind_param("sss", $token, $expiry_date, $email);
        $stmt->execute();

        $reset_link = "http://localhost/inventoryList/authentification/resetPasswordForm.php?token=$token&expiry=$expiry_date";

        $emailSent = sendMail($email, $reset_link, $username);
        
        header("Location: http://localhost/inventoryList/?emailSent=" . ($emailSent ? 'true' : 'false'));
        exit();
    } else {
        header("Location: http://localhost/inventoryList/?emailSent=false");
        exit();
    }
}

$stmt->close();
$conn->close();

?>
