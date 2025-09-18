<?php
session_start();
if (!isset($_SESSION['admin_id'])) { header("Location: login.php"); exit; }

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "campus";
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) { die("Connection failed: " . $conn->connect_error); }

$id = intval($_GET['id']);
$admin_id = $_SESSION['admin_id'];

// Only fetch the school if it belongs to the logged-in admin
$result = $conn->query("SELECT * FROM schools WHERE id=$id AND admin_id=$admin_id");
$row = $result->fetch_assoc();

if (!$row) {
    echo "<div style='color:red;text-align:center;margin-top:40px;'>Access denied. You can only edit your own school.</div>";
    $conn->close();
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $location = $_POST['location'];
    $curriculum = $_POST['curriculum'];
    $fees = $_POST['fees'];
    $extra = $_POST['extra_curricular'];
    $facilities = $_POST['facilities'];
    $bus = isset($_POST['has_school_bus']) ? 1 : 0;

    $stmt = $conn->prepare("UPDATE schools SET name=?, location=?, curriculum=?, fees=?, extra_curricular=?, facilities=?, has_school_bus=? WHERE id=?");
    $stmt->bind_param("ssssssii", $name, $location, $curriculum, $fees, $extra, $facilities, $bus, $id);
    $stmt->execute();
    $stmt->close();
    header("Location: admin_schools.php");
    exit;
}

$result = $conn->query("SELECT * FROM schools WHERE id=$id");
$row = $result->fetch_assoc();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Edit School</title>
    <link rel="stylesheet" href="../style/collab.css" />
    <style>
        body { background: #000; color: #fff; font-family: 'Work Sans', sans-serif; }
        .form-container { max-width: 500px; margin: 40px auto; background: #111; padding: 30px; border-radius: 8px; }
        label { display: block; margin-top: 15px; }
        input, select, textarea { width: 100%; padding: 8px; margin-top: 5px; border-radius: 4px; border: 1px solid #333; background: #222; color: #fff; }
        button { margin-top: 20px; background: #ff8000; color: #fff; border: none; padding: 10px 18px; border-radius: 4px; cursor: pointer; }
        button:hover { background: #cc6600; }
    </style>
</head>
<body>
    <div class="form-container">
        <h2>Edit School Details</h2>
        <form method="POST">
            <label>School Name</label>
            <input type="text" name="name" value="<?= htmlspecialchars($row['name']) ?>" required>
            <label>Location</label>
            <input type="text" name="location" value="<?= htmlspecialchars($row['location']) ?>" required>
            <label>Curriculum</label>
            <input type="text" name="curriculum" value="<?= htmlspecialchars($row['curriculum']) ?>" required>
            <label>Fees</label>
            <input type="number" name="fees" value="<?= htmlspecialchars($row['fees']) ?>" required>
            <label>Extra Curricular</label>
            <input type="text" name="extra_curricular" value="<?= htmlspecialchars($row['extra_curricular']) ?>">
            <label>Facilities</label>
            <input type="text" name="facilities" value="<?= htmlspecialchars($row['facilities']) ?>">
            <label>
                <input type="checkbox" name="has_school_bus" <?= $row['has_school_bus'] ? 'checked' : '' ?>> School Bus Available
            </label>
            <button type="submit">Update School</button>
        </form>
    </div>

    <header>
      <!-- Nav Bar -->
      <nav>
        <div class="socials">
          <a href="https://github.com/Stacyy-Were" target="_blank"><i class="fab fa-github"></i></a>
          <a href="https://pin.it/4jJTdSgis" target="_blank"><i class="fab fa-pinterest"></i></a>
          <a href="https://www.instagram.com/stacy_.were" target="_blank"><i class="fab fa-instagram"></i></a>
          <a href="https://wa.me/+254115018697" target="_blank"><i class="fab fa-whatsapp"></i></a>
        </div>
      


      <div class="nav-buttons">
        <a href="index.html" class="active">HOME</a>
        <a href="preferences.html">SCHOOLS</a>
        <a href="contacts.php">CONTACTS</a>
      </div>

      <button class="hamburger" onclick="toggleMenu()" aria-label="Open menu" tabindex="0">
        <i class="fa-solid fa-bars" aria-hidden="true"></i>
      </button>

      <nav class="hamburger-menu" id="hamburger-menu" aria-label="Mobile menu">
        <a href="index.html" class="active">HOME</a>
        <a href="preferences.html">SCHOOLS</a>
        <a href="contacts.php">CONTACTS</a>
      </nav>

      <div class="overlay" onclick="toggleMenu()" tabindex="-1"></div>

      <script>
        function toggleMenu() {
          document.querySelector('.hamburger').classList.toggle('active');
          document.getElementById('hamburger-menu').classList.toggle('active');
          document.querySelector('.overlay').classList.toggle('active');
        }
      </script>
</body>
</html>
<?php $conn->close(); ?>