<?php
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Trim and sanitize inputs
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    // Simple password complexity check (minimum 8 characters)
    if (strlen($password) < 8) {
        echo "Password must be at least 8 characters long.";
        exit();
    }

    // Hash the password for security
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Check if username already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo "Username already exists. Choose a different one.";
    } else {
        // Insert new user
        $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        $stmt->bind_param("ss", $username, $hashedPassword);

        if ($stmt->execute()) {
            // Optionally auto-login the user
            session_start();
            $_SESSION['username'] = $username;
            $_SESSION['role'] = 'user'; // Default user role, adjust as necessary

            echo "Registration successful! You are now logged in.";
        } else {
            echo "Error: Could not register. Please try again later.";
        }
    }

    $stmt->close();
}
?>
