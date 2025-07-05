<?php
// Database connection but this was for xampp/phpmyadmin and exports the db contacts as excel files 
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "campus";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set headers to force download as CSV
header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="school_registrations.csv"');

// Open output stream
$output = fopen("php://output", "w");

// Output column headings
fputcsv($output, ['Full Name', 'Email', 'Telephone', 'Institution', 'License Path']);

// Fetch and format rows
$sql = "SELECT full_name, email, telephone, institution, license_path FROM contacts";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Excel to treat telephone as text
        $telephone = '="' . $row['telephone'] . '"';

        fputcsv($output, [
            $row['full_name'],
            $row['email'],
            $telephone,
            $row['institution'],
            $row['license_path']
        ]);
    }
}

fclose($output);
$conn->close();
exit();
?>
