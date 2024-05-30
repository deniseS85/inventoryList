<?php
include 'db_connection.php';

$response = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $productID = isset($_POST['productID']) ? intval($_POST['productID']) : null;
    $tagID = isset($_POST['tagID']) ? intval($_POST['tagID']) : null;

    if ($productID !== null && $tagID !== null) {
        $conn->autocommit(false);

        $stmt_get_category = $conn->prepare("SELECT category_ID FROM Products WHERE ID = ?");
        $stmt_get_category->bind_param("i", $productID);
        $stmt_get_category->execute();
        $stmt_get_category->bind_result($category_ID);
        $stmt_get_category->fetch();
        $stmt_get_category->close();

        $stmt_update_product = $conn->prepare("UPDATE Products SET tag_ID = NULL WHERE tag_ID = ?");
        $stmt_update_product->bind_param("i", $tagID);
        $product_updated = $stmt_update_product->execute();
        $stmt_update_product->close();

        $stmt_delete_tag = $conn->prepare("DELETE FROM Tags WHERE ID = ?");
        $stmt_delete_tag->bind_param("i", $tagID);
        $tag_deleted = $stmt_delete_tag->execute();
        $stmt_delete_tag->close();

        if ($tag_deleted && $product_updated) {
            $conn->commit();
            $response['success'] = "Tag and associated products updated successfully";
        } else {
            $conn->rollback();
            $response['error'] = "Error deleting tag or updating associated products";
        }
        $response['category_ID'] = $category_ID;
    } else {
        $response['error'] = "Product-ID or Tag-ID not set";
    }
} else {
    $response['error'] = "Invalid request method";
}

echo json_encode($response);
mysqli_close($conn);
?>