<?php
// Prevent caching so updates show immediately
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 1 Jan 2000 00:00:00 GMT");

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "campus";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query with LEFT JOIN so schools always show even if admin is missing
$sql = "
    SELECT schools.*, school_admins.full_name 
    FROM schools 
    LEFT JOIN school_admins ON schools.admin_id = school_admins.id
";
$result = $conn->query($sql);

// Debug if query fails
if (!$result) {
    die("Query error: " . $conn->error);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Admin Panel - Edit Schools</title>
    <link rel="stylesheet" href="../style/collab.css" />
    <style>
        body { background: #000; color: #fff; font-family: 'Work Sans', sans-serif; }
        h2 { color: #ff8000; text-align: center; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; background: #000; color: #fff; }
        th, td { border: 1px solid #444; padding: 12px; text-align: left; }
        th { background: #222; color: #ff8000; }
        tr:nth-child(even) { background: #111; }
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
        <?php if ($result->num_rows > 0): ?>
            <?php while($row = $result->fetch_assoc()): ?>
            <tr>
                <td><?= htmlspecialchars($row['name']) ?></td>
                <td><?= htmlspecialchars($row['full_name'] ?? 'No Admin Assigned') ?></td>
                <td><?= htmlspecialchars($row['location']) ?></td>
                <td><?= htmlspecialchars($row['curriculum']) ?></td>
                <td><?= htmlspecialchars($row['fees']) ?></td>
                <td><?= htmlspecialchars($row['extra_curricular']) ?></td>
                <td><?= htmlspecialchars($row['facilities']) ?></td>
                <td><?= !empty($row['has_school_bus']) && $row['has_school_bus'] ? 'Yes' : 'No' ?></td>
                <td>
                    <a href="edit_school.php?id=<?= $row['id'] ?>" class="edit-btn">Edit</a>
                </td>
            </tr>
            <?php endwhile; ?>
        <?php else: ?>
            <tr><td colspan="9" style="text-align:center;">No schools found.</td></tr>
        <?php endif; ?>
    </table>
</body>
</html>
<?php $conn->close(); ?>
