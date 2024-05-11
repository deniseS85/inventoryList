<?php
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $productId = $_POST['product-id'];
    $productName = $_POST['product-name'];
    $productAmount = $_POST['product-amount'];
    $productValue = str_replace('.', ',', $_POST['product-value']);
    $productInfo = $_POST['product-info'];
    $categoryId = $_POST['category-id'];

    $stmt = $conn->prepare("UPDATE Products SET product_name = ?, amount = ?, price = ?, information = ? WHERE ID = ?");
    $stmt->bind_param("sdssi", $productName, $productAmount, $productValue, $productInfo, $productId);

    if ($stmt->execute()) {
        $updatedProduct = array(
            'id' => $productId,
            'categoryId' => $categoryId,
            'name' => $productName,
            'amount' => $productAmount,
            'price' => $productValue,
            'information' => $productInfo
        );
        echo json_encode($updatedProduct);
    } else {
        echo "Fehler beim Aktualisieren des Produkts: " . $stmt->error;
    }

    $stmt->close();
    mysqli_close($conn);
}
?>
