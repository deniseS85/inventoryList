<?php
session_start();
include 'db_connection.php';

header('Content-Type: application/json');
$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    if ($data === null || !isset($data['tagName']) || !isset($data['tagColor']) || empty($data['tagName'])) {
        $response['success'] = false;
        $response['message'] = "Ungültige JSON-Daten";
        echo json_encode($response);
        exit;
    }

    if (!isset($_SESSION['user_id'])) {
        $response['success'] = false;
        $response['message'] = "Benutzer ist nicht angemeldet.";
        echo json_encode($response);
        exit;
    }

    $tag_name = $data['tagName'];
    $tag_color = $data['tagColor'];
    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare("INSERT INTO Tags (tag_name, color, user_id) VALUES (?, ?, ?)");
    $stmt->bind_param("ssi", $tag_name, $tag_color, $user_id);

    if ($stmt->execute()) {
        $newTagID = $stmt->insert_id; 
        $response['success'] = true;
        $response['id'] = $newTagID;
        $response['message'] = "Tag erfolgreich hinzugefügt";
    } else {
        $response['success'] = false;
        $response['message'] = "Fehler beim Hinzufügen des Tags: " . $stmt->error;
    }
    $stmt->close();
} else {
    $response['success'] = false;
    $response['message'] = "Das Formular wurde nicht gesendet";
}

$conn->close();
echo json_encode($response);
?>
