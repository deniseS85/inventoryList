<?php

include 'db_connection.php';


$sql = "SELECT * FROM Images";
$result = mysqli_query($conn, $sql);

if (!$result) {
    die('Fehler beim Abrufen der Images: ' . mysqli_error($conn));
}

$images = array();

while ($row = mysqli_fetch_assoc($result)) {
    $images[] = $row;
}

echo json_encode($images);

mysqli_close($conn);
?>