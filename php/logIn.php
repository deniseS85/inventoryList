<?php
session_start();
include 'db_connection.php';

$registered = "false";

if(isset($_COOKIE['login_cookie'])) {
    $stmt = $conn->prepare("SELECT * FROM Users WHERE remember_token = ?");
    $stmt->bind_param("s", $_COOKIE['login_cookie']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $registered = "true";
    } else {
        setcookie("login_cookie", "", time() - 1, "/");
    }
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['email']) && isset($_POST['password']) && !empty($_POST['email']) && !empty($_POST['password'])) {
        $email = $_POST['email'];
        $password = $_POST['password'];

        $stmt = $conn->prepare("SELECT * FROM Users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 1) {
            $user = $result->fetch_assoc();
            if (password_verify($password, $user['password_hash'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $registered = "true";

                if(isset($_POST['rememberMe'])) {
                    $token = bin2hex(random_bytes(16));
                    $stmtUpdate = $conn->prepare("UPDATE Users SET remember_token = ? WHERE email = ?");
                    $stmtUpdate->bind_param("ss", $token, $email);
                    $stmtUpdate->execute();
                    setcookie("login_cookie", $token, time() + (3600*24*360), "/");
                }
            }
        }
    }
}


if ($registered === "true") {
    header("Location: http://localhost/inventoryList/");
    exit;
} else {
    header("Location: http://localhost/inventoryList/?registered=$registered");
    exit;
}
?>
