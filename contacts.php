<?php
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

// Handle search filter
$search = "";
if (isset($_GET['search'])) {
    $search = $conn->real_escape_string($_GET['search']);
    $sql = "SELECT s.name, s.location, a.full_name, a.telephone, a.email
            FROM schools s
            JOIN school_admins a ON s.admin_id = a.id
            WHERE s.name LIKE '%$search%' OR s.location LIKE '%$search%'";
} else {
    $sql = "SELECT s.name, s.location, a.full_name, a.telephone, a.email
            FROM schools s
            JOIN school_admins a ON s.admin_id = a.id";
}
$result = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Campus Compas | School Contacts</title>
    <link rel="stylesheet" href="style/collab.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
    <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;600&display=swap" rel="stylesheet">
    <style>
        body { background: #000; color: #fff; font-family: 'Work Sans', sans-serif; }
        nav { display: flex; justify-content: space-between; padding: 12px 20px; background: #111; align-items: center; }
        nav .socials a { color: #fff; margin-right: 12px; font-size: 1.2em; }
        nav .brand { font-size: 1.3em; font-weight: bold; color: #f783ac; }
        nav .nav-buttons a { margin-left: 18px; text-decoration: none; color: #fff; }
        nav .nav-buttons a.active { color: #f783ac; font-weight: bold; }

        .contacts-container { max-width: 900px; margin: 40px auto; background: #111; padding: 30px; border-radius: 12px; }
        h2 { color: #f783ac; text-align: center; margin-bottom: 30px; }
        form { text-align: center; margin-bottom: 20px; }
        input[type="text"] { padding: 8px 12px; border-radius: 6px; border: none; width: 60%; max-width: 400px; }
        button { padding: 8px 14px; border: none; border-radius: 6px; margin-left: 8px; background: #f783ac; color: #000; font-weight: bold; cursor: pointer; }
        button:hover { background: #ff99bb; }

        .school-card { background: #222; border-radius: 8px; margin-bottom: 18px; padding: 18px 24px; box-shadow: 0 2px 8px #0004; transition: transform 0.2s; }
        .school-card:hover { transform: scale(1.02); box-shadow: 0 4px 16px #ff800033; }
        .school-title { font-size: 1.3em; color: #f783ac; margin-bottom: 6px; }
        .school-details { margin-bottom: 8px; }
        .contact-links a { color: #fff; margin-right: 18px; text-decoration: none; font-size: 1.1em; transition: color 0.2s; }
        .contact-links a:hover { color: #f783ac; }
        .location-link { color: #28a745; }
        @media (max-width: 600px) {
            .contacts-container { padding: 10px; }
            .school-card { padding: 12px; }
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
        <div class="brand">Campus Compas</div>
        <div class="nav-buttons">
            <a href="index.html">HOME</a>
            <a href="preferences.html">SCHOOLS</a>
            <a href="contacts.php" class="active">CONTACTS</a>
        </div>
    </nav>

    <div class="contacts-container">
        <h2>School Contacts</h2>

        
        <form method="GET" action="contacts.php">
            <input type="text" name="search" placeholder="Search school or location..." value="<?= htmlspecialchars($search) ?>">
            <button type="submit"><i class="fa fa-search"></i> Search</button>
        </form>

        <?php if ($result && $result->num_rows > 0): ?>
            <?php while($row = $result->fetch_assoc()): ?>
                <div class="school-card">
                    <div class="school-title"><?= htmlspecialchars($row['name']) ?></div>
                    <div class="school-details"><i class="fa fa-map-marker-alt"></i> <?= htmlspecialchars($row['location']) ?></div>
                    <div class="school-details"><i class="fa fa-user"></i> <?= htmlspecialchars($row['full_name']) ?></div>
                    <div class="contact-links">
                        <a href="tel:<?= htmlspecialchars($row['telephone']) ?>"><i class="fa fa-phone"></i> <?= htmlspecialchars($row['telephone']) ?></a>
                        <a href="mailto:<?= htmlspecialchars($row['email']) ?>"><i class="fa fa-envelope"></i> Email</a>
                        <a class="location-link" href="https://maps.google.com/?q=<?= urlencode($row['name'].' '.$row['location']) ?>" target="_blank"><i class="fa fa-location-arrow"></i> Location</a>
                    </div>
                </div>
            <?php endwhile; ?>
        <?php else: ?>
            <p style="text-align:center;">No schools found.</p>
        <?php endif; ?>
    </div>
</body>
</html>
<?php $conn->close(); ?>
