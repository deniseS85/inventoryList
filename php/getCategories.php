<?php

include 'db_connection.php';

$sql = "SELECT * FROM Categories";
$result = mysqli_query($conn, $sql);

if (!$result) {
  die("Error fetching categories: " . mysqli_error($conn));
}

$categories = array();

while ($row = mysqli_fetch_assoc($result)) {
    $category = array(
      'id' => $row['ID'],
      'name' => $row['category_name']
    );
    $categories[] = $category;
  }

echo json_encode($categories);

mysqli_close($conn);
?>