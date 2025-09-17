<?php
session_start();
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "campus";
$conn = new mysqli($servername, $username, $password, $dbname);

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $pass = $_POST['password'];
    // 'admin123'
    $sql = "SELECT id, full_name FROM school_admins WHERE email='$email'";
    $result = $conn->query($sql);
    if ($row = $result->fetch_assoc()) {
        if ($pass === "admin123") { 
            $_SESSION['admin_id'] = $row['id'];
            $_SESSION['admin_name'] = $row['full_name'];
            header("Location: admin_schools.php");
            exit;
        }
    }
    $error = "Invalid credentials";
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>School Admin Login</title>
    <link rel="stylesheet" href="../style/collab.css" />
</head>
<body>
    <div class="form-container">
        <h2>School Admin Login</h2>
        <?php if ($error) echo "<div style='color:red;'>$error</div>"; ?>
        <form method="POST">
            <label>Email</label>
            <input type="email" name="email" required>
            <br>
            <label>Password</label>
            <input type="password" name="password" required>
            <br>
            <button type="submit">Login</button>
        </form>
    </div>
</body>
</html>
<?php $conn->close(); ?>