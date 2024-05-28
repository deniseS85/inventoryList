<?php
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['signupFirstName'], $_POST['signupEmail'], $_POST['signupPassword'])) {
        $signupFirstName = $_POST['signupFirstName'];
        $signupEmail = $_POST['signupEmail'];
        $signupPassword = $_POST['signupPassword'];
        $hashedPassword = password_hash($signupPassword, PASSWORD_DEFAULT);
        $registrationDate = date("Y-m-d H:i:s");

        $stmt = $conn->prepare("INSERT INTO Users (username, email, password_hash, registration_date) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $signupFirstName, $signupEmail, $hashedPassword, $registrationDate);
        $stmt->execute();
        
        header("Location: http://localhost/inventoryList/");
        exit;
    }
}
?>
