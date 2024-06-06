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
    if (isset($_SESSION['user_id']) && isset($_FILES['uploadImage'])) {
        $user_id = $_SESSION['user_id'];
        $file_name = $_FILES["uploadImage"]["name"];
        $target_dir = "uploads/";
        $file_extension = pathinfo($file_name, PATHINFO_EXTENSION);
        $new_file_name = getGUID() . '.' . $file_extension;
        $target_file = $target_dir . basename($new_file_name);
        $uploadOk = 1;
        $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

        $check = getimagesize($_FILES["uploadImage"]["tmp_name"]);
        if ($check === false) {
            die("Error: File is not an image.");
        }

        if (file_exists($target_file)) {
            die("Error: Sorry, file already exists.");
        }

        if ($_FILES["uploadImage"]["size"] > 500000) {
            die("Error: Sorry, your file is too large.");
        }

        if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
            && $imageFileType != "gif") {
            die("Error: Sorry, only JPG, JPEG, PNG & GIF files are allowed.");
        }

        if ($uploadOk == 1) {
            if (move_uploaded_file($_FILES["uploadImage"]["tmp_name"], $target_file)) {
                $image_url = $new_file_name; 
                $stmt = $conn->prepare("INSERT INTO Images (url, user_id) VALUES (?, ?)");
                $stmt->bind_param("si", $image_url, $user_id);

                if ($stmt->execute()) {
                    $image_id = $stmt->insert_id;
                    echo $image_id;
                } else {
                    die("Error: " . $stmt->error);
                }
                $stmt->close();
            } else {
                die("Error: Sorry, there was an error uploading your file.");
            }
        } else {
            die("Error: Sorry, your file was not uploaded.");
        }
    } else {
        die("Error: File not found.");
    }
} else {
    die("Error: Invalid request method.");
}

$conn->close();
?>
