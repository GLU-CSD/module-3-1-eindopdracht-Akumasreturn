<?php
session_start();

if (!isset($_SESSION["username"])) {
    header("Location: login.html");
    exit();
}

$mysqli = new mysqli("localhost", "root", "", "webshoptest");

if ($mysqli->connect_error) {
    die("Database connection failed");
}

$username = $_SESSION["username"];
$query = "SELECT role FROM users WHERE username = ?";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user || $user["role"] !== "admin") {
    die("Access Denied. You are not an admin.");
} else {
    echo "Welcome, Admin!";
}

$mysqli->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Panel</title>
</head>
<body>
    <h1>Admin Panel</h1>
    <p>Welcome, <?php echo htmlspecialchars($username); ?>!</p>
    <form action="addProduct.php" method="POST">
        <input type="text" name="name" placeholder="Product Name" required>
        <textarea name="description" placeholder="Product Description" required></textarea>
        <input type="number" name="price" placeholder="Price" step="0.01" required>
        <input type="text" name="image" placeholder="Image URL" required>
        <button type="submit">Add Product</button>
    </form>
</body>
</html>
