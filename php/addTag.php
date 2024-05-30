<?php
include 'db_connection.php';

header('Content-Type: application/json');
$response = array();


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
   
    if (isset($data['tagName']) && isset($data['tagColor']) && !empty($data['tagName'])) {
        $tag_name = $data['tagName'];
        $tag_color = $data['tagColor'];
        $stmt = $conn->prepare("INSERT INTO Tags (tag_name, color) VALUES (?, ?)");
        $stmt->bind_param("ss", $tag_name, $tag_color);

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
        $response['message'] = "Tagnamenfeld nicht gesetzt";
    }
} else {
    $response['success'] = false;
    $response['message'] = "Das Formular wurde nicht gesendet";
}

$conn->close();
echo json_encode($response);
?>
