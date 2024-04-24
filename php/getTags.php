<?php

include 'db_connection.php';


$sql = "SELECT * FROM Tags";
$result = mysqli_query($conn, $sql);

if (!$result) {
    die('Fehler beim Abrufen der Tags: ' . mysqli_error($conn));
}

$tags = array();

while ($row = mysqli_fetch_assoc($result)) {
    $tags[] = $row;
}

echo json_encode($tags);

mysqli_close($conn);
?>