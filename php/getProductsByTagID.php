<?php

include 'db_connection.php';

if(isset($_GET['tag_id'])) {
    $tag_id = $_GET['tag_id'];
    $sql = "SELECT ID FROM Products WHERE tag_ID = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $tag_id);
    $stmt->execute();
    
    $result = $stmt->get_result();

    if (!$result) {
        die("Error fetching product: " . $conn->error);
    }

    $productIDs = [];
    while ($row = $result->fetch_assoc()) {
        $productIDs[] = $row['ID'];
    }

    echo json_encode($productIDs);
} else {
    echo "Tag ID not provided";
}

$stmt->close();
mysqli_close($conn);
?>
