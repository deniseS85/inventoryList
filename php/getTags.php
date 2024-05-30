<?php

include 'db_connection.php';

header('Content-Type: application/json');

$sql = "SELECT * FROM Tags";
$result = mysqli_query($conn, $sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => 'Fehler beim Abrufen der Tags: ' . mysqli_error($conn)]);
    exit;
}

$tags = array();

while ($row = mysqli_fetch_assoc($result)) {
    $tags[] = $row;
}

echo json_encode($tags);

mysqli_close($conn);
?>