<?php
session_start();
include 'db_connection.php';

if (isset($_SESSION['user_id'])) {
    $userId = $_SESSION['user_id'];
    
    $sql = "SELECT * FROM UserCustomFields WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    $columns = array();

    while ($row = $result->fetch_assoc()) {
        $columns[] = $row;
    }

    echo json_encode($columns);

    $stmt->close();
} 

$conn->close();
?>
