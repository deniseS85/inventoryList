<?php
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
    if (isset($_POST['productID']) && isset($_POST['imageID'])) {
        $productID = $_POST['productID'];
        $imageID = $_POST['imageID'];

        // Überprüfen, ob es sich um ein neues Bild handelt
        if (isset($_POST['uploadedImageId'])) {
            // Neues Bild: Generieren Sie einen eindeutigen Namen und fügen Sie es in die Tabelle "Images" ein
            $new_image_name = getGUID() . '.jpg'; // Sie können die Dateierweiterung entsprechend anpassen
            $stmt_insert_image = $conn->prepare("INSERT INTO Images (url) VALUES (?)");
            $stmt_insert_image->bind_param("s", $new_image_name);
            $stmt_insert_image->execute();
            $inserted_image_id = $stmt_insert_image->insert_id;
            $stmt_insert_image->close();
        } else {
            // Bild aktualisieren
            $inserted_image_id = $imageID;
        }

        // Bild-ID in die Tabelle "Products" aktualisieren
        $stmt_update_product = $conn->prepare("UPDATE Products SET image_ID = ? WHERE ID = ?");
        $stmt_update_product->bind_param("ii", $inserted_image_id, $productID);

        if ($stmt_update_product->execute()) {
            // Jetzt die category_ID abrufen
            $stmt_get_category = $conn->prepare("SELECT category_ID FROM Products WHERE ID = ?");
            $stmt_get_category->bind_param("i", $productID);
            $stmt_get_category->execute();
            $stmt_get_category->bind_result($categoryID);
            $stmt_get_category->fetch();
            $stmt_get_category->close();

            // URL des hochgeladenen Bildes abrufen
            $stmt_get_image_url = $conn->prepare("SELECT url FROM Images WHERE ID = ?");
            $stmt_get_image_url->bind_param("i", $inserted_image_id);
            $stmt_get_image_url->execute();
            $stmt_get_image_url->bind_result($imageUrl);
            $stmt_get_image_url->fetch();
            $stmt_get_image_url->close();

            $response = array('success' => true, 'message' => 'Bild erfolgreich aktualisiert', 'categoryID' => $categoryID, 'imageURL' => $imageUrl, 'imageID' => $inserted_image_id);
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
