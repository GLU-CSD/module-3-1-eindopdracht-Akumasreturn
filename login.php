<?php
session_start();
include "db.php"; // Ensure this file correctly connects to your database

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "Invalid request method.";
    exit();
}

$username = trim($_POST["username"]);
$password = trim($_POST["password"]);

if (empty($username) || empty($password)) {
    echo "Username or password cannot be empty.";
    exit();
}

//Check if the database connection is working
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Prepare statement to prevent SQL injection
$stmt = $conn->prepare("SELECT username, password, role FROM users WHERE username=?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    echo "Invalid username or password.";
    exit();
}

// Verify password
if (!password_verify($password, $user["password"])) {
    echo "Invalid username or password.";
    exit();
}

// Store user session
$_SESSION["username"] = $user["username"];
$_SESSION["role"] = $user["role"]; // Admin role handling

echo json_encode(["success" => true, "role" => $user["role"]]);


$conn->close();
?>
