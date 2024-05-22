<?php
include 'db_connection.php';

$response = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $productID = isset($_POST['productID']) ? intval($_POST['productID']) : null;
    $imageID = isset($_POST['imageID']) ? intval($_POST['imageID']) : null;

    if ($productID !== null && $imageID !== null) {
        $conn->autocommit(false);

        $stmt_get_category = $conn->prepare("SELECT category_ID FROM Products WHERE ID = ?");
        $stmt_get_category->bind_param("i", $productID);
        $stmt_get_category->execute();
        $stmt_get_category->bind_result($category_ID);
        $stmt_get_category->fetch();
        $stmt_get_category->close();

        $stmt_get_image_info = $conn->prepare("SELECT url FROM Images WHERE ID = ?");
        $stmt_get_image_info->bind_param("i", $imageID);
        $stmt_get_image_info->execute();
        $stmt_get_image_info->bind_result($image_url);
        $stmt_get_image_info->fetch();
        $stmt_get_image_info->close();

        if (!$image_url) {
            $conn->rollback();
            $response['error'] = "Image not found";
        } else {
            $stmt_update_product = $conn->prepare("UPDATE Products SET image_ID = NULL WHERE ID = ?");
            $stmt_update_product->bind_param("i", $productID);
            $product_updated = $stmt_update_product->execute();
            $stmt_update_product->close();

            $stmt_delete_image = $conn->prepare("DELETE FROM Images WHERE ID = ?");
            $stmt_delete_image->bind_param("i", $imageID);
            $image_deleted = $stmt_delete_image->execute();
            $stmt_delete_image->close();

            if ($image_deleted && $product_updated) {
                $file_path = "uploads/" . $image_url;
                if (file_exists($file_path)) {
                    unlink($file_path);
                }

                $conn->commit();
                $response['success'] = "Image and associated product deleted successfully";
            } else {
                $conn->rollback();
                $response['error'] = "Error deleting image or associated product";
            }
        }

        $conn->autocommit(true);
        $response['category_ID'] = $category_ID;
    } else {
        $response['error'] = "Product-ID or Image-ID not set";
    }
} else {
    $response['error'] = "Invalid request method";
}

echo json_encode($response);
mysqli_close($conn);
?>