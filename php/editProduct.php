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
    
    // Überprüfen, ob ein neues Bild hochgeladen wurde
    if (isset($_FILES['uploadImage']) && $_FILES['uploadImage']['size'] > 0) {
        if ($currentImageURL) {
            $oldImageURL = "uploads/" . basename($currentImageURL);
            if (file_exists($oldImageURL)) {
                unlink($oldImageURL);
            }
        }
    
        // Neues Bild hochladen
        $newImageFileName = $_FILES['uploadImage']['name'];
        $newImageURL = $newImageFileName;
        move_uploaded_file($_FILES['uploadImage']['tmp_name'], "uploads/" . $newImageURL);
        
        // Falls das Produkt bereits ein Bild hatte, aktualisiere den Bild-URL
        if ($currentImageURL) {
            $stmt = $conn->prepare("UPDATE Images SET url = ? WHERE ID = ?");
            $stmt->bind_param("si", $newImageFileName, $imageId);
            $stmt->execute();
            $stmt->close();
        } else {
            // Falls das Produkt kein Bild hatte, füge das neue Bild in die Datenbank ein und hole die zugehörige Image-ID
            $stmt = $conn->prepare("INSERT INTO Images (url) VALUES (?)");
            $stmt->bind_param("s", $newImageFileName);
            $stmt->execute();
            $imageId = (string)$stmt->insert_id;
            $stmt->close();
        }
    } else {
        // Wenn kein neues Bild hochgeladen wurde und das Produkt bereits ein Bild hatte, behalte die aktuelle Image-ID bei
        if ($currentImageURL) {
            $stmt = $conn->prepare("SELECT ID FROM Images WHERE url = ?");
            $stmt->bind_param("s", $currentImageURL);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($row = $result->fetch_assoc()) {
                $imageId = $row['ID'];
            }
            $stmt->close();
        }
    }

    // Das Produkt aktualisieren
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
    }

    $stmt->close();
    mysqli_close($conn);
}
?>
