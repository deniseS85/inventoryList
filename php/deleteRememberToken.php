<?php
session_start();
include 'db_connection.php';

if (isset($_COOKIE['login_cookie'])) {
    $token = $_COOKIE['login_cookie'];

    $stmt = $conn->prepare("UPDATE Users SET remember_token = NULL WHERE remember_token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();

    setcookie("login_cookie", "", time() - 1, "/");
    echo "Remember token deleted";
} else {
    echo "No remember token found";
}
?>
