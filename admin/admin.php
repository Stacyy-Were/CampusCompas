<?php
// Connect to the database
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "campus";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle delete request
if (isset($_GET['delete'])) {
    $id = (int) $_GET['delete'];
    $conn->query("DELETE FROM contacts WHERE id = $id");
    header("Location: admin.php");
    exit();
}

// Handle search
$search = $_GET['search'] ?? '';
$sql = "SELECT * FROM contacts WHERE
        full_name LIKE '%$search%' OR
        email LIKE '%$search%' OR
        telephone LIKE '%$search%' OR
        institution LIKE '%$search%'
        ORDER BY id DESC";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Admin Panel - Campus Compass</title>
  <link rel="stylesheet" href="style/index.css">
  <style>
    body {
      font-family: 'Work Sans', sans-serif;
      background-color: rgb(0, 0, 0);
      padding: 30px;
    }
    h2 {
      color: #ff8000;
      text-align: center;  
    }
    .download-btn, .action-btn {
      padding: 8px 14px;
      border-radius: 5px;
      text-decoration: none;
      color: white;
      margin-right: 5px;
    }
    .download-btn { background-color: #ff8000; }
    .download-btn:hover { background-color: #cc6600; }
    .delete-btn { background-color: #dc3545; }
    .edit-btn { background-color: #28a745; }
    .search-bar {
      margin: 20px 0;
    }
    input[type="text"] {
      padding: 8px;
      width: 300px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button[type="submit"] {
      padding: 8px 14px;
      background-color: #ff8000;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button[type="submit"]:hover {
      background-color: #cc6600;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background-color: rgb(0, 0, 0);
      color: white;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    th {
      background-color: #333;
      color: #ff8000;
    }
    a.file-link {
      color: #ff8000;
    }
    a.file-link:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>

  <h2>Registered Institutions</h2>
  <a href="export.php" class="download-btn" target="_blank">📥 Download Excel</a>

  <form method="GET" class="search-bar">
    <input type="text" name="search" placeholder="Search by name, email, school..." value="<?= htmlspecialchars($search) ?>" />
    <button type="submit">Search</button>
  </form>

  <?php if ($result && $result->num_rows > 0): ?>
    <table>
      <thead>
        <tr>
          <th>Full Name</th>
          <th>Email</th>
          <th>Telephone</th>
          <th>Institution</th>
          <th>License File</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <?php while ($row = $result->fetch_assoc()): ?>
          <tr>
            <td><?= htmlspecialchars($row['full_name']) ?></td>
            <td><?= htmlspecialchars($row['email']) ?></td>
            <td><?= htmlspecialchars($row['telephone']) ?></td>
            <td><?= htmlspecialchars($row['institution']) ?></td>
            <td>
              <?php if (!empty($row['license_path']) && file_exists($row['license_path'])): ?>
                <a href="<?= htmlspecialchars($row['license_path']) ?>" target="_blank" class="file-link">View File</a>
              <?php else: ?>
                No file
              <?php endif; ?>
            </td>
            <td>
              <a href="edit.php?id=<?= $row['id'] ?>" class="action-btn edit-btn">Edit</a>
              <a href="admin.php?delete=<?= $row['id'] ?>" class="action-btn delete-btn" onclick="return confirm('Are you sure you want to delete this record?');">Delete</a>
            </td>
          </tr>
        <?php endwhile; ?>
      </tbody>
    </table>
  <?php else: ?>
    <p style="color: white;">No schools have been registered yet.</p>
  <?php endif; ?>

  <?php $conn->close(); ?>

</body>
</html>
