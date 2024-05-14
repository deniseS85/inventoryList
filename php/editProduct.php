<?php
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $productId = $_POST['product-id'];
    $productName = $_POST['product-name'];
    $productAmount = $_POST['product-amount'];
    $productValue = str_replace('.', ',', $_POST['product-value']);
    $productInfo = $_POST['product-info'];
    $tagId = isset($_POST['tag-id']) && !empty($_POST['tag-id']) ? $_POST['tag-id'] : null;
    $imageId = isset($_POST['image-id']) && !empty($_POST['image-id']) ? $_POST['image-id'] : null;    
    $categoryId = $_POST['category-id'];
    $currentImageURL = isset($_POST['current-image-url']) && !empty($_POST['current-image-url']) ? $_POST['current-image-url'] : null;
    
    if (isset($_FILES['uploadImage']) && $_FILES['uploadImage']['size'] > 0) {
        if ($currentImageURL) {
            $oldImageURL = "uploads/" . basename($currentImageURL);
            if (file_exists($oldImageURL)) {
                unlink($oldImageURL);
            }
        }

        $newImageFileName = $_FILES['uploadImage']['name'];
        $newImageURL = "uploads/" . $newImageFileName;
        move_uploaded_file($_FILES['uploadImage']['tmp_name'], $newImageURL);

        if ($imageId && ($newImageFileName || $currentImageURL)) {
            $stmt = $conn->prepare("UPDATE Images SET url = ? WHERE ID = ?");
            $stmt->bind_param("si", $newImageFileName, $imageId);
            $stmt->execute();
            $stmt->close();
        }
    } else {
        $newImageFileName = $currentImageURL ? basename($currentImageURL) : null;
        $newImageURL = $currentImageURL;
    }   

    $stmt = $conn->prepare("UPDATE Products SET product_name = ?, amount = ?, price = ?, information = ?, tag_ID = ?, image_ID = ? WHERE ID = ?");
    $stmt->bind_param("sdssiii", $productName, $productAmount, $productValue, $productInfo, $tagId, $imageId, $productId);

    if ($stmt->execute()) {
        $updatedProduct = array(
            'id' => $productId,
            'categoryId' => $categoryId,
            'name' => $productName,
            'amount' => $productAmount,
            'price' => $productValue,
            'information' => $productInfo,
            'tagID' => $tagId,
            'imageID' => $imageId,
            'imageUrl' => $newImageURL
        );
        echo json_encode($updatedProduct);
    } else {
        $errorResponse = array(
            'error' => "Fehler beim Aktualisieren des Produkts: " . $stmt->error
        );
        echo json_encode($errorResponse);
    }

    $stmt->close();
    mysqli_close($conn);
}
?>
