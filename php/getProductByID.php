<?php

include 'db_connection.php';

header('Content-Type: application/json');

if (isset($_GET['product_id'])) {
    $product_id = intval($_GET['product_id']);

    $sql = "SELECT * FROM Products WHERE ID = $product_id";
    $result = mysqli_query($conn, $sql);

    if (!$result) {
        echo json_encode(['error' => "Error fetching product: " . mysqli_error($conn)]);
        exit;
    }

    $product = mysqli_fetch_assoc($result);

    if ($product) {
        $product_data = array(
            'id' => $product['ID'],
            'name' => $product['product_name'],
            'amount' => $product['amount'],
            'price' => $product['price'],
            'information' => $product['information'],
            'categoryId' => $product['category_ID'],
            'tag_ID' => $product['tag_ID'],
            'image_ID' => $product['image_ID']
        );
        echo json_encode($product_data);
    } else {
        echo json_encode(['error' => 'Product not found']);
    }
} else {
    echo json_encode(['error' => 'Product ID not provided']);
}

mysqli_close($conn);
?>
