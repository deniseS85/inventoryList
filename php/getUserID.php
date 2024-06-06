<?php
session_start();
include 'db_connection.php';

if (isset($_SESSION['user_id'])) {
    echo $_SESSION['user_id'];
} else {
    echo '0';
}
?>