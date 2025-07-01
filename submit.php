<?php
// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "campus";  

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize and retrieve form data
        $full_name = $_POST['full_name'] ?? '';
        $email = $_POST['email'] ?? '';
        $telephone = $_POST['telephone'] ?? '';
        $institution = $_POST['institution'] ?? '';


    // Handle file upload
    $license_path = "";
    if (isset($_FILES['license']) && $_FILES['license']['error'] === UPLOAD_ERR_OK) {
        $license_name = basename($_FILES['license']['name']);
        $license_tmp = $_FILES['license']['tmp_name'];
        $license_path = "uploads/" . $license_name;

        // Move file to uploads folder
        move_uploaded_file($license_tmp, $license_path);
    }

    // Create uploads folder if it doesn't exist
    if (!is_dir('uploads')) {
        mkdir('uploads', 0755, true);
    }

    // Prepare the SQL query
    $stmt = $conn->prepare("INSERT INTO contacts (full_name, email, telephone, institution, license_path) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $full_name, $email, $telephone, $institution, $license_path);

    // Execute and check
    if ($stmt->execute()) {
        echo "You have been successfully added!";
    } else {
        echo "Error: " . $stmt->error;
    }

    // Close connection
    $stmt->close();
    $conn->close();
}
?>
