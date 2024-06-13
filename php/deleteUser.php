<?php
session_start();
include 'db_connection.php';

$response = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $userId = $_SESSION['user_id'];
    $conn->begin_transaction();

    try {
        $stmt = $conn->prepare("SELECT url FROM Images WHERE user_id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $stmt->bind_result($image_url);

        $image_urls = [];
        while ($stmt->fetch()) {
            $image_urls[] = $image_url;
        }
        $stmt->close();

        $stmt = $conn->prepare("DELETE FROM Products WHERE user_id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $stmt->close();

        $stmt = $conn->prepare("DELETE FROM Categories WHERE user_id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $stmt->close();

        $stmt = $conn->prepare("DELETE FROM Images WHERE user_id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $stmt->close();

        $stmt = $conn->prepare("DELETE FROM Tags WHERE user_id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $stmt->close();

        // Lösche den Benutzer
        $stmt = $conn->prepare("DELETE FROM Users WHERE ID = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $stmt->close();

        foreach ($image_urls as $image_url) {
            $file_path = "uploads/" . $image_url;
            if (file_exists($file_path)) {
                unlink($file_path);
            }
        }

        $conn->commit();

        session_unset();
        session_destroy();
        $response['success'] = "Konto und zugehörige Daten erfolgreich gelöscht.";
    } catch (Exception $e) {
        $conn->rollback();
        $response['error'] = 'Fehler beim Löschen des Kontos: ' . $e->getMessage();
    }

    $conn->close();
} else {
    $response['error'] = "Invalid request method";
}

echo json_encode($response);
?>
