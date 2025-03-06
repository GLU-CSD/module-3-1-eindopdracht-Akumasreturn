<?php
session_start();

// Ensure user is logged in
if (!isset($_SESSION["username"]) || !isset($_SESSION["role"])) {
    echo json_encode(["role" => "guest"]);
    exit();
}

// Send back the stored role
echo json_encode(["username" => $_SESSION["username"], "role" => $_SESSION["role"]]);
?>
