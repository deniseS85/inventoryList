<?php
session_start();
include 'db_connection.php';

header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if (!isset($_SESSION['user_id'])) {
            throw new Exception('User not logged in.');
        }
        
        $userId = $_SESSION['user_id'];
        $input = json_decode(file_get_contents('php://input'), true);
        
        if ($input === null || !isset($input['currentPassword']) || !isset($input['newPassword'])) {
            throw new Exception('Invalid input data.');
        }

        $currentPassword = $input['currentPassword'];
        $newPassword = $input['newPassword'];
        $stmt = $conn->prepare("SELECT password_hash FROM Users WHERE ID = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $user = $stmt->get_result()->fetch_assoc();

        if (!$user || !password_verify($currentPassword, $user['password_hash'])) {
            throw new Exception('Current password is incorrect.');
        }

        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        $updateStmt = $conn->prepare("UPDATE Users SET password_hash = ? WHERE ID = ?");
        $updateStmt->bind_param("si", $hashedPassword, $userId);
        $updateStmt->execute();

        if ($updateStmt->affected_rows > 0) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to update password.']);
        }

        $stmt->close();
        $updateStmt->close();
        mysqli_close($conn);
    } else {
        throw new Exception('Invalid request method.');
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($updateStmt)) {
        $updateStmt->close();
    }
    mysqli_close($conn);
}
?>
