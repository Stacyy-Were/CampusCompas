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
    $full_name = $_POST['full_name'] ?? '';
    $email = $_POST['email'] ?? '';
    $telephone = $_POST['telephone'] ?? '';
    $institution = $_POST['institution'] ?? '';

    $license_path = "";

    if (isset($_FILES['license']) && $_FILES['license']['error'] === UPLOAD_ERR_OK) {
        // Ensure uploads folder exists
        if (!is_dir('uploads')) {
            mkdir('uploads', 0755, true);
        }

        $license_name = basename($_FILES['license']['name']);
        $file_extension = strtolower(pathinfo($license_name, PATHINFO_EXTENSION));
        $file_size = $_FILES['license']['size'];
        $allowed_types = ['pdf', 'jpg', 'jpeg', 'png'];
        $max_file_size = 5 * 1024 * 1024; //the 5mb limit

        // Allow only these extensions
        $allowed_extensions = ['pdf', 'jpg', 'jpeg', 'png'];

        if (!in_array($file_extension, $allowed_types)) {
            die("Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed.");
        }
        if ($file_size > $max_file_size) {
            die("File too large. Maximum file size is 5MB.");
        }

        // Generate a unique name for the file to avoid conflicts
        // Use uniqid() to create a unique name based on the current time in microseconds
        $unique_name = uniqid("license_", true) . "." . $file_extension;
        $license_path = "uploads/" . $unique_name;

        move_uploaded_file($_FILES['license']['tmp_name'], $license_path);
    }

    $stmt = $conn->prepare("INSERT INTO contacts (full_name, email, telephone, institution, license_path) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $full_name, $email, $telephone, $institution, $license_path);

    if ($stmt->execute()) {
        header("Location: success.html");
        exit();
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();

}
