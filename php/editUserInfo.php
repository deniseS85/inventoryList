<?php
session_start();
include 'db_connection.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $requestData = json_decode(file_get_contents("php://input"));
    $element = $requestData->element;
    $newValue = $requestData->newValue;

    if ($element === '.username') {
        $userId = $_SESSION['user_id'];
        $stmt = $conn->prepare("UPDATE Users SET username = ? WHERE ID = ?");
        $stmt->bind_param("si", $newValue, $userId);

        if ($stmt->execute()) {
            $_SESSION['username'] = $newValue;
            echo json_encode(array('success' => true, 'message' => 'Benutzername erfolgreich aktualisiert'));
        } else {
            echo json_encode(array('success' => false, 'message' => 'Fehler beim Aktualisieren des Benutzernamens: ' . $stmt->error));
        }
        $stmt->close();
    } elseif ($element === '.email') {
        $userId = $_SESSION['user_id'];
        $stmt = $conn->prepare("UPDATE Users SET email = ? WHERE ID = ?");
        $stmt->bind_param("si", $newValue, $userId);

        if ($stmt->execute()) {
            echo json_encode(array('success' => true, 'message' => 'E-Mail-Adresse erfolgreich aktualisiert'));
        } else {
            echo json_encode(array('success' => false, 'message' => 'Fehler beim Aktualisieren der E-Mail-Adresse: ' . $stmt->error));
        }
        $stmt->close();
    } else {
        echo json_encode(array('success' => false, 'message' => 'Ungültiges Element zum Aktualisieren'));
        exit;
    }

    mysqli_close($conn);
}
?>
