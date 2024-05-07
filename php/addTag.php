<?php
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
   
    if (isset($data['tagName']) && isset($data['tagColor']) && !empty($data['tagName'])) {
        $tag_name = $data['tagName'];
        $tag_color = $data['tagColor'];
        $stmt = $conn->prepare("INSERT INTO Tags (tag_name, color) VALUES (?, ?)");
        $stmt->bind_param("ss", $tag_name, $tag_color);

        if ($stmt->execute()) {
            echo "Tag erfolgreich hinzugefügt";
        } else {
            echo "Fehler beim Hinzufügen des Tags: " . $stmt->error;
        }
        $stmt->close();
    } else {
        echo "Tagnamenfeld nicht gesetzt";
    }
} else {
    echo "Das Formular wurde nicht gesendet";
}

$conn->close();
?>
