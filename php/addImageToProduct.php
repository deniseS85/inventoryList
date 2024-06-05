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
        die(json_encode(array('success' => false, 'message' => 'Benutzer ist nicht angemeldet.')));
    }

    if (isset($_POST['productID']) && isset($_POST['imageID'])) {
        $productID = $_POST['productID'];
        $imageID = $_POST['imageID'];

        // Sicherheitsüberprüfung für den Bild-Upload
        if (!isset($_POST['uploadedImageId']) && !isset($_FILES['uploadImage'])) {
            die(json_encode(array('success' => false, 'message' => 'Bilddatei wurde nicht hochgeladen.')));
        }

        // Überprüfen, ob es sich um ein neues Bild handelt
        if (isset($_POST['uploadedImageId'])) {
            // Neues Bild: Generieren Sie einen eindeutigen Namen und fügen Sie es in die Tabelle "Images" ein
            $new_image_name = getGUID() . '.jpg';
            $stmt_insert_image = $conn->prepare("INSERT INTO Images (url, user_id) VALUES (?, ?)");
            $stmt_insert_image->bind_param("si", $new_image_name, $_SESSION['user_id']);
            if ($stmt_insert_image->execute()) {
                $inserted_image_id = $stmt_insert_image->insert_id;
            } else {
                die(json_encode(array('success' => false, 'message' => 'Fehler beim Hochladen des Bildes.')));
            }
            $stmt_insert_image->close();
        } else {
            // Bild aktualisieren
            $inserted_image_id = $imageID;
        }

        // Bild-ID in die Tabelle "Products" aktualisieren
        $stmt_update_product = $conn->prepare("UPDATE Products SET image_ID = ?, user_id = ? WHERE ID = ?");
        $stmt_update_product->bind_param("iii", $inserted_image_id, $_SESSION['user_id'], $productID);

        if ($stmt_update_product->execute()) {
            // Erfolgreich aktualisiert, zusätzliche Verarbeitung...
            die(json_encode(array('success' => true, 'message' => 'Bild erfolgreich aktualisiert')));
        } else {
            die(json_encode(array('success' => false, 'message' => 'Fehler beim Aktualisieren des Bildes.')));
        }
        $stmt_update_product->close();
    } else {
        die(json_encode(array('success' => false, 'message' => 'productID oder imageID fehlt')));
    }
} else {
    die(json_encode(array('success' => false, 'message' => 'Ungültige Anfrage-Methode')));
}
?>
