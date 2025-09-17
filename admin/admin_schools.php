<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "campus";
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) { die("Connection failed: " . $conn->connect_error); }

$result = $conn->query("SELECT schools.*, school_admins.full_name FROM schools JOIN school_admins ON schools.admin_id = school_admins.id");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Admin Panel - Edit Schools</title>
    <link rel="stylesheet" href="../style/collab.css" />
    <style>
        body { background: #000; color: #fff; font-family: 'Work Sans', sans-serif; }
        h2 { color: #ff8000; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; background: #000; color: #fff; }
        th, td { border: 1px solid #ddd; padding: 12px; }
        th { background: #333; color: #ff8000; }
        a.edit-btn { background: #28a745; color: #fff; padding: 6px 12px; border-radius: 4px; text-decoration: none; }
        a.edit-btn:hover { background: #218838; }
    </style>
</head>
<body>
    <h2>Registered Schools</h2>
    <table>
        <tr>
            <th>School Name</th>
            <th>Admin</th>
            <th>Location</th>
            <th>Curriculum</th>
            <th>Fees</th>
            <th>Extra Curricular</th>
            <th>Facilities</th>
            <th>School Bus</th>
            <th>Actions</th>
        </tr>
        <?php while($row = $result->fetch_assoc()): ?>
        <tr>
            <td><?= htmlspecialchars($row['name']) ?></td>
            <td><?= htmlspecialchars($row['full_name']) ?></td>
            <td><?= htmlspecialchars($row['location']) ?></td>
            <td><?= htmlspecialchars($row['curriculum']) ?></td>
            <td><?= htmlspecialchars($row['fees']) ?></td>
            <td><?= htmlspecialchars($row['extra_curricular']) ?></td>
            <td><?= htmlspecialchars($row['facilities']) ?></td>
            <td><?= $row['has_school_bus'] ? 'Yes' : 'No' ?></td>
            <td>
                <a href="edit_school.php?id=<?= $row['id'] ?>" class="edit-btn">Edit</a>
            </td>
        </tr>
        <?php endwhile; ?>
    </table>
</body>
</html>
<?php $conn->close(); ?>