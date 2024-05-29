<?php
include 'db_connection.php';

$registered = "false";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['signupFirstName'], $_POST['signupEmail'], $_POST['signupPassword'])) {
        $signupFirstName = $_POST['signupFirstName'];
        $signupEmail = $_POST['signupEmail'];
        $signupPassword = $_POST['signupPassword'];
        $hashedPassword = password_hash($signupPassword, PASSWORD_DEFAULT);
        $registrationDate = date("Y-m-d H:i:s");

        $stmt = $conn->prepare("SELECT * FROM Users WHERE email = ?");
        $stmt->bind_param("s", $signupEmail);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Benutzer ist bereits registriert
            $registered = "already";
        } else {
            // Benutzer ist nicht registriert, fahre mit der Registrierung fort
            $stmt = $conn->prepare("INSERT INTO Users (username, email, password_hash, registration_date) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $signupFirstName, $signupEmail, $hashedPassword, $registrationDate);
            $stmt->execute();
            // Registrierung erfolgreich
            $registered = "true";
        }
    }
}

if ($registered === "true") {
    echo '<script>window.location.replace("http://localhost/inventoryList/?registered=success");</script>';
    exit;
} elseif ($registered === "already") {
    header("Location: http://localhost/inventoryList/?registered=already");
    exit;
}
?>
