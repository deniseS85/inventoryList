<?php
include 'db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data["ID"])) {
    $category_id = $data["ID"];
    $conn->autocommit(false);

    $stmt_products = $conn->prepare("DELETE FROM Products WHERE category_ID = ?");
    $stmt_products->bind_param("i", $category_id);
    $products_deleted = $stmt_products->execute();
    $stmt_products->close();

    $stmt_category = $conn->prepare("DELETE FROM Categories WHERE ID = ?");
    $stmt_category->bind_param("i", $category_id);
    $category_deleted = $stmt_category->execute();
    $stmt_category->close();

    if ($products_deleted && $category_deleted) {
        $conn->commit();
        echo "Category and associated products deleted successfully";
    } else {
        $conn->rollback();
        echo "Error deleting category or associated products";
    }

    $conn->autocommit(true);
} else {
    echo "Kategorie-ID nicht gesetzt";
}

mysqli_close($conn);

?>
