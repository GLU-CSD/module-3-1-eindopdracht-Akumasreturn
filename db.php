<?php

if ($_SERVER['SERVER_NAME'] == "localhost"){
$host = "localhost";
$user = "root"; 
$pass = ""; 
$db = "testwebshop";
} else {
$host = "localhost";
$user = "u230039_webshop";
$pass = "vKZrLbQtcq9RyMdkpfhm"; 
$db = "u230039_webshop";
 }
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
