<?php
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['productID']) && isset($_POST['imageID'])) {
        $productID = $_POST['productID'];
        $imageID = $_POST['imageID'];

        // Überprüfen, ob es sich um ein neues Bild handelt
        if (isset($_POST['uploadedImageId'])) {
            // Neues Bild: Einfügen in die Tabelle "Images"
            $sql_insert_image = "INSERT INTO Images (url) VALUES (?)";
            $stmt_insert_image = $conn->prepare($sql_insert_image);
            $stmt_insert_image->bind_param("s", $imageID);
            $stmt_insert_image->execute();
            $inserted_image_id = $stmt_insert_image->insert_id;
            $stmt_insert_image->close();
        } else {
            // Bild aktualisieren
            $inserted_image_id = $imageID;
        }

        // Bild-ID in die Tabelle "Products" aktualisieren
        $sql_update_product = "UPDATE products SET image_ID = ? WHERE ID = ?";
        $stmt_update_product = $conn->prepare($sql_update_product);
        $stmt_update_product->bind_param("ii", $inserted_image_id, $productID);

        if ($stmt_update_product->execute()) {
            // Jetzt die category_ID abrufen
            $sql_get_category = "SELECT category_ID FROM products WHERE ID = ?";
            $stmt_get_category = $conn->prepare($sql_get_category);
            $stmt_get_category->bind_param("i", $productID);
            $stmt_get_category->execute();
            $stmt_get_category->bind_result($categoryID);
            $stmt_get_category->fetch();
            $stmt_get_category->close();

            // URL des hochgeladenen Bildes abrufen
            $sql_get_image_url = "SELECT url FROM Images WHERE ID = ?";
            $stmt_get_image_url = $conn->prepare($sql_get_image_url);
            $stmt_get_image_url->bind_param("i", $inserted_image_id);
            $stmt_get_image_url->execute();
            $stmt_get_image_url->bind_result($imageUrl);
            $stmt_get_image_url->fetch();
            $stmt_get_image_url->close();

            // Hier haben Sie die category_ID und die URL des Bildes, die Sie verwenden können

            $response = array('success' => true, 'message' => 'Bild erfolgreich aktualisiert', 'categoryID' => $categoryID, 'imageURL' => $imageUrl);
            echo json_encode($response);
        } else {
            $response = array('success' => false, 'message' => 'Fehler beim Aktualisieren des Bildes');
            echo json_encode($response);
        }
        $stmt_update_product->close();
        $conn->close();
    } else {
        $response = array('success' => false, 'message' => 'productID oder imageID fehlt');
        echo json_encode($response);
    }
} else {
    $response = array('success' => false, 'message' => 'Keine POST-Anfrage');
    echo json_encode($response);
}
?>
