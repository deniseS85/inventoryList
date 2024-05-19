<?php
include 'db_connection.php';

if(isset($_GET['image_id'])) {
    $image_id = $_GET['image_id'];
    $sql = "SELECT ID FROM Products WHERE Image_ID = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $image_id);
    $stmt->execute();
    
    $result = $stmt->get_result();

    if (!$result) {
        die("Error fetching product: " . $conn->error);
    }

    $product = $result->fetch_assoc();
    $productId = $product['ID'];

    echo json_encode($productId);
} else {
    echo "Image ID not provided";
}

$stmt->close();
mysqli_close($conn);
?>
