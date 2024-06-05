<?php
session_start();
include 'db_connection.php';

if (isset($_COOKIE['login_cookie'])) {
    $token = $_COOKIE['login_cookie'];
    $stmt = $conn->prepare("UPDATE Users SET remember_token = NULL WHERE remember_token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    setcookie("login_cookie", "", time() - 1, "/");
}

session_unset();
session_destroy();


if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
}

header("Location: http://localhost/inventoryList/");
exit;
?>