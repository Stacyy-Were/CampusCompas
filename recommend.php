<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "campus";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get user preferences from POST
$min_fees = $_POST['min_fees'] ?? '';
$max_fees = $_POST['max_fees'] ?? '';
$location = $_POST['preferred_location'] ?? '';
$curriculum = $_POST['preferred_curriculum'] ?? [];
$extra_curricular = $_POST['extra_curricular'] ?? [];
$facilities = $_POST['facilities'] ?? [];
$needs_bus = $_POST['needs_school_bus'] ?? '';

// Build SQL query
$sql = "SELECT * FROM schools WHERE 1=1";
if ($min_fees !== '') {
    $sql .= " AND fees >= " . intval($min_fees);
}
if ($max_fees !== '') {
    $sql .= " AND fees <= " . intval($max_fees);
}
if ($location !== '') {
    $sql .= " AND location LIKE '%" . $conn->real_escape_string($location) . "%'";
}
if (!empty($curriculum)) {
    $curriculum_list = array_map(function($c) use ($conn) {
        return "'" . $conn->real_escape_string($c) . "'";
    }, $curriculum);
    $sql .= " AND curriculum IN (" . implode(',', $curriculum_list) . ")";
}
if ($needs_bus !== '') {
    $sql .= " AND has_school_bus = " . intval($needs_bus);
}
if (!empty($extra_curricular)) {
    foreach ($extra_curricular as $activity) {
        $sql .= " AND extra_curricular LIKE '%" . $conn->real_escape_string($activity) . "%'";
    }
}
if (!empty($facilities)) {
    foreach ($facilities as $facility) {
        $sql .= " AND facilities LIKE '%" . $conn->real_escape_string($facility) . "%'";
    }
}

$result = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Recommended Schools</title>
    <link rel="stylesheet" href="style/collab.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
    <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;600&display=swap" rel="stylesheet">
    <style>
        body {
            background: black;
            color: #d6336c;
            font-family: 'Work Sans', sans-serif;
        }
        .form-container {
            max-width: 950px;
            margin: 40px auto;
            background: #ffe3ec;
            padding: 36px;
            border-radius: 16px;
            box-shadow: 0 4px 24px #d6336c22;
        }
        h2 {
            color: #d6336c;
            text-align: center;
            margin-bottom: 30px;
            font-weight: 700;
        }
        h3 {
            color: #ae3ec9;
            margin-top: 30px;
        }
        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px #d6336c22;
        }
        th, td {
            padding: 14px 10px;
            text-align: left;
        }
        th {
            background: #f783ac;
            color: #fff;
            font-weight: 600;
            border-bottom: 2px solid #d6336c;
        }
        tr {
            transition: background 0.2s;
        }
        tr:hover {
            background: #ffe3ec;
        }
        td {
            border-bottom: 1px solid #f783ac33;
        }
        .no-results {
            color: #ae3ec9;
            font-size: 1.1em;
            margin: 30px 0 10px 0;
            text-align: center;
        }
        a {
            color: #d6336c;
            text-decoration: none;
            font-weight: 600;
        }
        a:hover {
            color: #ae3ec9;
            text-decoration: underline;
        }
        .back-link {
            display: inline-block;
            margin-top: 28px;
            padding: 10px 22px;
            background: #f783ac;
            color: #fff;
            border-radius: 8px;
            font-weight: 600;
            transition: background 0.2s;
        }
        .back-link:hover {
            background: #d6336c;
            color: #fff;
        }
    </style>
</head>
<body>
    <nav>
        <div class="socials">
            <a href="https://github.com/Stacyy-Were" target="_blank"><i class="fab fa-github"></i></a>
            <a href="https://pin.it/4jJTdSgis" target="_blank"><i class="fab fa-pinterest"></i></a>
            <a href="https://www.instagram.com/stacy_.were" target="_blank"><i class="fab fa-instagram"></i></a>
            <a href="https://wa.me/+254115018697" target="_blank"><i class="fab fa-whatsapp"></i></a>
        </div>
        <div class="brand">Campus Compass</div>
        <div class="nav-buttons">
            <a href="index.html">HOME</a>
            <a href="preferences.html">SCHOOLS</a>
            <a href="contacts.php">CONTACTS</a>
        </div>
    </nav>
    <div class="form-container">
        <h2>Recommended Schools</h2>
        <?php if ($result && $result->num_rows > 0): ?>
            <table>
                <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Curriculum</th>
                    <th>Fees</th>
                    <th>Extra Curricular</th>
                    <th>Facilities</th>
                    <th>School Bus</th>
                </tr>
                <?php while($row = $result->fetch_assoc()): ?>
                <tr>
                    <td>
                        <a href="contacts.php?id=<?php echo $row['id']; ?>">
                            <?php echo htmlspecialchars($row['name']); ?>
                        </a>
                    </td>
                    <td><?php echo htmlspecialchars($row['location']); ?></td>
                    <td><?php echo htmlspecialchars($row['curriculum']); ?></td>
                    <td><?php echo htmlspecialchars($row['fees']); ?></td>
                    <td><?php echo htmlspecialchars($row['extra_curricular']); ?></td>
                    <td><?php echo htmlspecialchars($row['facilities']); ?></td>
                    <td><?php echo $row['has_school_bus'] ? 'Yes' : 'No'; ?></td>
                </tr>
                <?php endwhile; ?>
            </table>
        <?php else: ?>
            <div class="no-results">No schools match your preferences.</div>
            <h3>Here are some alternative schools you might consider:</h3>
            <table>
                <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Curriculum</th>
                    <th>Fees</th>
                    <th>Extra Curricular</th>
                    <th>Facilities</th>
                    <th>School Bus</th>
                </tr>
                <?php
                $alt_sql = "SELECT * FROM schools ORDER BY RAND() LIMIT 5";
                $alt_result = $conn->query($alt_sql);
                while($alt_row = $alt_result->fetch_assoc()): ?>
                <tr>
                    <td>
                        <a href="contacts.php?id=<?php echo $alt_row['id']; ?>">
                            <?php echo htmlspecialchars($alt_row['name']); ?>
                        </a>
                    </td>
                    <td><?php echo htmlspecialchars($alt_row['location']); ?></td>
                    <td><?php echo htmlspecialchars($alt_row['curriculum']); ?></td>
                    <td><?php echo htmlspecialchars($alt_row['fees']); ?></td>
                    <td><?php echo htmlspecialchars($alt_row['extra_curricular']); ?></td>
                    <td><?php echo htmlspecialchars($alt_row['facilities']); ?></td>
                    <td><?php echo $alt_row['has_school_bus'] ? 'Yes' : 'No'; ?></td>
                </tr>
                <?php endwhile; ?>
            </table>
        <?php endif; ?>
        <a href="preferences.html" class="back-link">Back to Preferences</a>
    </div>
</body>
</html>
<?php
$conn->close();
?>