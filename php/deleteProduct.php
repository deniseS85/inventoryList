<?php
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['ID'])) {
        $productID = $data['ID'];

        $conn->autocommit(false);

         // Bildinformationen abrufen
        $stmt_get_image_info = $conn->prepare("SELECT ID, url FROM Images WHERE ID IN (SELECT image_ID FROM Products WHERE ID = ?)");
        $stmt_get_image_info->bind_param("i", $productID);
        $stmt_get_image_info->execute();
        $stmt_get_image_info->bind_result($imageID, $image_url);
        $stmt_get_image_info->fetch();
        $stmt_get_image_info->close();
         
        // Produkt löschen
        $stmt_delete_product = $conn->prepare("DELETE FROM Products WHERE ID = ?");
        $stmt_delete_product->bind_param("i", $productID);
        $product_deleted = $stmt_delete_product->execute();
        $stmt_delete_product->close();

        // Bild des Produkts löschen
        $stmt_delete_image = $conn->prepare("DELETE FROM Images WHERE ID = ?");
        $stmt_delete_image->bind_param("i", $imageID);
        $image_deleted = $stmt_delete_image->execute();
        $stmt_delete_image->close();
       
        // Bild aus dem Upload-Verzeichnis löschen, wenn es erfolgreich aus der Datenbank gelöscht wurde
        if ($image_deleted && $product_deleted) {
            $file_path = "uploads/" . $image_url;
            if (file_exists($file_path)) {
                unlink($file_path);
            }

            $conn->commit();
            echo "Image and associated product deleted successfully";
        } else {
            $conn->rollback(); 
            echo "Error deleting image or associated product";
        }

        $conn->autocommit(true);
    } else {
        echo "Product-ID oder Image-ID nicht gesetzt";
    }
}

mysqli_close($conn);
?>