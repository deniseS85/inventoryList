<?php
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['product-name']) && !empty($_POST['product-name'])) {
        $product_name = $_POST['product-name'];
        $product_amount = !empty($_POST['product-amount']) ? $_POST['product-amount'] : 0;
        $product_value = !empty($_POST['product-value']) ? $_POST['product-value'] : 0;
        $product_info = !empty($_POST['product-info']) ? $_POST['product-info'] : '';
        $tag_id = isset($_POST['tag-id']) && !empty($_POST['tag-id']) ? $_POST['tag-id'] : null;
        $image_id = isset($_POST['uploadedImageId']) && !empty($_POST['uploadedImageId']) ? $_POST['uploadedImageId'] : null;
        $category_id = $_POST['category-id'];
        $stmt = $conn->prepare("INSERT INTO Products (product_name, amount, price, information, category_ID, tag_ID, image_ID) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sdssiii", $product_name, $product_amount, $product_value, $product_info, $category_id, $tag_id, $image_id);

        if ($stmt->execute()) {
            $new_product_id = $stmt->insert_id;
            $new_product = array(
                'id' => $new_product_id,
                'name' => $product_name,
                'amount' => $product_amount,
                'price' => $product_value,
                'information' => $product_info,
                'category_ID' => $category_id,
                'tag_ID' => $tag_id,
                'image_ID' => $image_id
            );
            echo json_encode($new_product);
        } else {
            echo "Fehler beim Hinzufügen des Produktes: " . $stmt->error;
        }
        $stmt->close();
    } else {
        echo "Das Formular wurde nicht gesendet";
    }
} else {
    echo "Ungültige Anfragemethode.";
}

$conn->close();
?>
