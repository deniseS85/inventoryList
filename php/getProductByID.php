<?php

include 'db_connection.php';

if(isset($_GET['product_id'])) {
    $product_id = $_GET['product_id'];

    $sql = "SELECT * FROM Products WHERE ID = $product_id";
    
    $result = mysqli_query($conn, $sql);

    if (!$result) {
        die("Error fetching product: " . mysqli_error($conn));
    }

    $product = mysqli_fetch_assoc($result);

    echo json_encode($product);
} else {
    echo "Product ID not provided";
}

mysqli_close($conn);
?>