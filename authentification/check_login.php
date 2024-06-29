<?php
session_start();
include $_SERVER['DOCUMENT_ROOT'] . '/inventoryList/php/db_connection.php';

$loggedIn = isset($_SESSION['user_id']);
$hasCookie = isset($_COOKIE['login_cookie']);

if (!$loggedIn && $hasCookie) {
    $token = $_COOKIE['login_cookie'];
    $stmt = $conn->prepare("SELECT id FROM Users WHERE remember_token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows == 1) {
        $tokenData = $result->fetch_assoc();
        $_SESSION['user_id'] = $tokenData['id'];

        $stmt = $conn->prepare("SELECT username FROM Users WHERE id = ?");
        $stmt->bind_param("i", $tokenData['id']);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result && $result->num_rows == 1) {
            $user = $result->fetch_assoc();
            $_SESSION['username'] = $user['username'];
        }
    }
}

$loggedIn = isset($_SESSION['user_id']);
if (!$loggedIn) {
    include 'authentification/loginForm.php';
    exit;
}
?>
