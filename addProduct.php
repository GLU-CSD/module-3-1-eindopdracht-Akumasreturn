<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $mysqli = new mysqli("localhost", "root", "", "testwebshop");

    if ($mysqli->connect_error) {
        die("Connection failed: " . $mysqli->connect_error);
    }

    $name = $mysqli->real_escape_string($_POST["name"]);
    $description = $mysqli->real_escape_string($_POST["description"]);
    $price = $mysqli->real_escape_string($_POST["price"]);
    $image = $mysqli->real_escape_string($_POST["image"]);

    $query = "INSERT INTO products (name, description, price, image) VALUES ('$name', '$description', '$price', '$image')";
    
    if ($mysqli->query($query) === TRUE) {
        echo "Product added successfully!";
    } else {
        echo "Error: " . $mysqli->error;
    }

    $mysqli->close();
}
?>
