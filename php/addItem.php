<?php

include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
   
    if (isset($_POST['product-name']) && !empty($_POST['product-name'])) {
        $product_name = $_POST['product-name'];
        $product_amount = !empty($_POST['product-amount']) ? $_POST['product-amount'] : 0;
        $product_value = !empty($_POST['product-value']) ? $_POST['product-value'] : 0;
        $product_info = !empty($_POST['product-info']) ? $_POST['product-info'] : '';
        $category_id = $_POST['category-id'];

        $sql = "INSERT INTO Products (product_name, amount, price, information, category_ID) VALUES ('$product_name', '$product_amount', '$product_value', '$product_info', '$category_id')";

        if (mysqli_query($conn, $sql)) {
            $new_product_id = mysqli_insert_id($conn);
            $new_product = array(
                'id' => $new_product_id,
                'name' => $product_name,
                'amount' => $product_amount,
                'price' => $product_value,
                'information' => $product_info,
                'category_ID' => $category_id 
            );
            echo json_encode($new_product);
        } else {
            echo "Fehler beim Hinzufügen des Produktes: " . mysqli_error($conn);
        }
    } 
} else {
    echo "Das Formular wurde nicht gesendet";
}

mysqli_close($conn);
?>