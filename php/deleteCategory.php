<?php
include 'db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data["ID"])) {
    $category_id = $data["ID"];
    $conn->autocommit(false);

    // Get Image IDs and file paths of products to be deleted
    $stmt_get_image_info = $conn->prepare("SELECT id, url FROM Images WHERE id IN (SELECT image_ID FROM Products WHERE category_ID = ?)");
    $stmt_get_image_info->bind_param("i", $category_id);
    $stmt_get_image_info->execute();
    $result = $stmt_get_image_info->get_result();
    
    // Store image IDs and file paths in arrays
    $image_info = [];
    while ($row = $result->fetch_assoc()) {
        $image_info[] = array("id" => $row['id'], "url" => $row['url']);
    }
    $stmt_get_image_info->close();

    // Delete products
    $stmt_products = $conn->prepare("DELETE FROM Products WHERE category_ID = ?");
    $stmt_products->bind_param("i", $category_id);
    $products_deleted = $stmt_products->execute();
    $stmt_products->close();

    // Delete category
    $stmt_category = $conn->prepare("DELETE FROM Categories WHERE ID = ?");
    $stmt_category->bind_param("i", $category_id);
    $category_deleted = $stmt_category->execute();
    $stmt_category->close();

    // Delete associated images from database and files from server
    $stmt_delete_images = $conn->prepare("DELETE FROM Images WHERE id = ?");
    $stmt_delete_images->bind_param("i", $image_id);
    foreach ($image_info as $image) {
        $image_id = $image['id'];
        $stmt_delete_images->execute();
        // Delete file from file 'uploads'
        $file_path = "uploads/" . $image['url'];
        if (file_exists($file_path)) {
            unlink($file_path);
        }
    }
    $stmt_delete_images->close();

    if ($products_deleted && $category_deleted) {
        $conn->commit();
        echo "Category, associated products, and images deleted successfully";
    } else {
        $conn->rollback();
        echo "Error deleting category, associated products, or images";
    }

    $conn->autocommit(true);
} else {
    echo "Kategorie-ID nicht gesetzt";
}

mysqli_close($conn);
?>
