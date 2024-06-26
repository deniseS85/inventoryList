<?php
session_start();
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_SESSION['user_id']) && isset($_POST['product-name']) && !empty($_POST['product-name'])) {
        $product_name = $_POST['product-name'];
        $product_amount = !empty($_POST['product-amount']) ? $_POST['product-amount'] : 0;
        $product_value = !empty($_POST['product-value']) ? $_POST['product-value'] : 0;
        $product_info = !empty($_POST['product-info']) ? $_POST['product-info'] : '';
        $tag_id = isset($_POST['tag-id']) && !empty($_POST['tag-id']) ? $_POST['tag-id'] : null;
        $image_id = isset($_POST['uploadedImageId']) && !empty($_POST['uploadedImageId']) ? $_POST['uploadedImageId'] : null;
        $category_id = $_POST['category-id'];
        $user_id = $_SESSION['user_id']; 

        $custom_fields = array();
        foreach ($_POST as $key => $value) {
            if (strpos($key, '_value') !== false) {
                $columnID = str_replace('_value', '', $key);
                if (is_numeric($columnID) && !empty($value)) {
                    $custom_fields[$columnID] = $value;
                }
            }
        }

        $json_custom_fields = !empty($custom_fields) ? json_encode($custom_fields) : "{}";
        $stmt = $conn->prepare("INSERT INTO Products (product_name, amount, price, information, category_ID, tag_ID, image_ID, user_id, custom_fields) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sdssiiiss", $product_name, $product_amount, $product_value, $product_info, $category_id, $tag_id, $image_id, $user_id, $json_custom_fields);

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
                'image_ID' => $image_id,
                'user_id' => $user_id,
                'custom_fields' => $custom_fields
            );
            echo json_encode($new_product);
        } else {
            echo "Fehler beim Hinzufügen des Produktes: " . $stmt->error;
        }
        $stmt->close();
    } else {
        echo "Das Formular wurde nicht gesendet oder fehlt der Benutzer-ID oder Produktname";
    }
} else {
    echo "Ungültige Anfragemethode.";
}

$conn->close();
?>
