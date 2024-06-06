<?php
session_start();
include 'db_connection.php';

function getGUID(){
    if (function_exists('com_create_guid')){
        return com_create_guid();
    }
    else {
        mt_srand((double)microtime()*10000);
        $charid = strtoupper(md5(uniqid(rand(), true)));
        $hyphen = chr(45);
        $uuid = chr(123)
            .substr($charid, 0, 8).$hyphen
            .substr($charid, 8, 4).$hyphen
            .substr($charid,12, 4).$hyphen
            .substr($charid,16, 4).$hyphen
            .substr($charid,20,12)
            .chr(125);
        return $uuid;
    }
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!isset($_SESSION['user_id'])) {
        die("Benutzer ist nicht angemeldet.");
    }
    $productId = $_POST['product-id'];
    $productName = $_POST['product-name'];
    $productAmount = $_POST['product-amount'];
    $productValue = str_replace('.', ',', $_POST['product-value']);
    $productInfo = $_POST['product-info'];
    $tagId = isset($_POST['tag-id']) && !empty($_POST['tag-id']) ? $_POST['tag-id'] : null;
    $imageId = isset($_POST['image-id']) && !empty($_POST['image-id']) ? $_POST['image-id'] : null;    
    $categoryId = $_POST['category-id'];
    $currentImageURL = isset($_POST['current-image-url']) && !empty($_POST['current-image-url']) ? $_POST['current-image-url'] : null;
    $imageToRemove = isset($_POST['imageToRemove']) && $_POST['imageToRemove'] === 'true';
    $newImageURL = null;

    // Überprüfen, ob ein neues Bild hochgeladen wurde
    if (isset($_FILES['uploadImage']) && $_FILES['uploadImage']['size'] > 0) {
        if ($currentImageURL) {
            $oldImageURL = "uploads/" . basename($currentImageURL);
            if (file_exists($oldImageURL)) {
                unlink($oldImageURL);
            }
        }
    
        // Neuen Bildnamen generieren
        $newImageFileName = getGUID() . '.jpg'; // Hier wird die GUID als Dateiname verwendet
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
            $stmt = $conn->prepare("INSERT INTO Images (url, user_id) VALUES (?, ?)");
            $stmt->bind_param("si", $newImageFileName, $_SESSION['user_id']);
            $stmt->execute();
            $imageId = $stmt->insert_id;
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
    // Bild löschen, wenn zur Löschung vorgemerkt
    if ($imageToRemove && $currentImageURL) {
        $conn->begin_transaction();
        // Aktualisieren des Produkt-Eintrags, setzen Sie image_ID auf NULL
        $stmt = $conn->prepare("UPDATE Products SET product_name = ?, amount = ?, price = ?, information = ?, tag_ID = ?, image_ID = NULL WHERE ID = ?");
        $stmt->bind_param("sdssii", $productName, $productAmount, $productValue, $productInfo, $tagId, $productId);
        $product_updated = $stmt->execute();
        $stmt->close();
    
        // Löschen des Bild-Eintrags
        $stmt = $conn->prepare("DELETE FROM Images WHERE ID = ?");
        $stmt->bind_param("i", $imageId);
        $image_deleted = $stmt->execute();
        $stmt->close();
    
        if ($product_updated && $image_deleted) {
            $oldImageURL = "uploads/" . basename($currentImageURL);
            if (file_exists($oldImageURL)) {
                unlink($oldImageURL);
            }
            $conn->commit();
            $updatedProduct = array(
                'id' => $productId,
                'categoryId' => $categoryId,
                'name' => $productName,
                'amount' => $productAmount,
                'price' => $productValue,
                'information' => $productInfo,
                'tag_ID' => $tagId,
                'image_ID' => null,
                'imageUrl' => null
            );
            echo json_encode($updatedProduct);
            exit;
        } else {
            $conn->rollback();
            echo json_encode(array('error' => 'Error deleting image or associated product'));
            exit;
        }
    }

    // Das Produkt aktualisieren
    $stmt = $conn->prepare("UPDATE Products SET product_name = ?, amount = ?, price = ?, information = ?, tag_ID = ?, image_ID = ? WHERE ID = ?");
    $stmt->bind_param("sdssiii", $productName, $productAmount, $productValue, $productInfo, $tagId, $imageId, $productId);

    if ($stmt->execute()) {
        // Setze die imageUrl basierend auf dem aktuellen Bild
        $imageUrl = $newImageURL ? $newImageURL : $currentImageURL;
        $imageId = strval($imageId);
        
        $updatedProduct = array(
            'id' => $productId,
            'categoryId' => $categoryId,
            'name' => $productName,
            'amount' => $productAmount,
            'price' => $productValue,
            'information' => $productInfo,
            'tag_ID' => $tagId,
            'image_ID' => $imageId,
            'imageUrl' => $imageUrl
        );
        echo json_encode($updatedProduct);
    } else {
        echo json_encode(array('error' => 'Error updating product: ' . $conn->error));
    }

    $stmt->close();
    mysqli_close($conn);
}
?>
