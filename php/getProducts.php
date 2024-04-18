<?php

include 'db_connection.php';

if(isset($_GET['category_id'])) {
    $category_id = $_GET['category_id'];

    $sql = "SELECT * FROM Products WHERE category_ID = $category_id";
    
    $result = mysqli_query($conn, $sql);

    if (!$result) {
        die("Error fetching products: " . mysqli_error($conn));
    }

    $products = array();

    while ($row = mysqli_fetch_assoc($result)) {
        $product = array(
            'id' => $row['ID'],
            'name' => $row['product_name'],
            'amount' => $row['amount'],
            'price' => $row['price'],
            'information' => $row['information'],
            'category_ID' => $row['category_ID']
        );
        $products[] = $product;
    }

    echo json_encode($products);
} else {
    echo "Category ID not provided";
}

mysqli_close($conn);
?>
