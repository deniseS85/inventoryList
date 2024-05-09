<?php
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['productID']) && isset($_POST['imageID'])) {
        $productID = $_POST['productID'];
        $imageID = $_POST['imageID'];

        $conn->autocommit(false);
        // Bildinformationen abrufen
        $stmt_get_image_info = $conn->prepare("SELECT url FROM Images WHERE ID = ?");
        $stmt_get_image_info->bind_param("i", $imageID);
        $stmt_get_image_info->execute();
        $stmt_get_image_info->bind_result($image_url);
        $stmt_get_image_info->fetch();
        $stmt_get_image_info->close();

        // Produkt-Image-ID aktualisieren
        $stmt_update_product = $conn->prepare("UPDATE Products SET image_ID = NULL WHERE ID = ?");
        $stmt_update_product->bind_param("i", $productID);
        $product_updated = $stmt_update_product->execute();
        $stmt_update_product->close();

        // Bild aus Datenbank löschen
        $stmt_delete_image = $conn->prepare("DELETE FROM Images WHERE ID = ?");
        $stmt_delete_image->bind_param("i", $imageID);
        $image_deleted = $stmt_delete_image->execute();
        $stmt_delete_image->close();

        // Bild aus dem Upload-Verzeichnis löschen, wenn es erfolgreich aus der Datenbank gelöscht wurde
        if ($image_deleted && $product_updated) {
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
