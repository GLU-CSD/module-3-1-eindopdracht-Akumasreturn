<?php
include 'db.php';

$result = $conn->query("SELECT * FROM products");

if ($result === false) {
    echo json_encode(["error" => "Database query failed."]);
    exit;
}

$products = [];

while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

if (empty($products)) {
    echo json_encode(["message" => "No products found."]);
} else {
    echo json_encode($products);
}
?>
