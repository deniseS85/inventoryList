<?php

include 'db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data["ID"])) {
  $category_id = $data["ID"];

  $delete_sql = "DELETE FROM Categories WHERE ID = $category_id";

  if (mysqli_query($conn, $delete_sql)) {
      echo "Category deleted successfully";
  } else {
      echo "Error deleting category: " . mysqli_error($conn);
  }
} else {
  echo "Kategorie-ID nicht gesetzt";
}

mysqli_close($conn);
?>