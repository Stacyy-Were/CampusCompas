<?php
session_start();
if (!isset($_SESSION['admin_id'])) { header("Location: login.php"); exit; }

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "campus";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $location = $_POST['location'];
    $curriculum = $_POST['curriculum'];
    $fees = $_POST['fees'];
    $extra = $_POST['extra_curricular'];
    $facilities = $_POST['facilities'];
    $bus = isset($_POST['has_school_bus']) ? 1 : 0;
    $admin_id = $_SESSION['admin_id'];

    $stmt = $conn->prepare("INSERT INTO schools (admin_id, name, location, curriculum, fees, extra_curricular, facilities, has_school_bus) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issssssi", $admin_id, $name, $location, $curriculum, $fees, $extra, $facilities, $bus);
    $stmt->execute();
    $stmt->close();
    header("Location: admin_schools.php");
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Add School</title>
    <link rel="stylesheet" href="../style/collab.css" />
</head>
<body>
    <div class="form-container">
        <h2>Add New School</h2>
        <form method="POST">
            <label>School Name</label>
            <input type="text" name="name" required>
            <br>

            <label>Location</label>
            <input type="text" name="location" required>
            <br>

            <label>Curriculum</label>
            <input type="text" name="curriculum" required>
            <br>

            <label>Fees</label>
            <input type="number" name="fees" required>
            <br>

            <label>Extra Curricular</label>
            <input type="text" name="extra_curricular">
            <br>

            <label>Facilities</label>
            <input type="text" name="facilities">
            <br>
            
            <label>
                <input type="checkbox" name="has_school_bus"> School Bus Available
            </label>
            <br>

            <button type="submit">Add School</button>
        </form>
    </div>
</body>
</html>
<?php $conn->close(); ?>