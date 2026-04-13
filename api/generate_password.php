<?php
/**
 * Script untuk Generate Password Hash
 * Akses: https://sistemflow.biz.id/api/generate_password.php
 */

// Password yang ingin di-hash
$passwords = [
    'admin123' => '',
    'kepsek123' => '',
    'guru123' => '',
    'password' => ''
];

echo "<h2>Password Hash Generator</h2>";
echo "<table border='1' cellpadding='10' style='border-collapse: collapse;'>";
echo "<tr><th>Password</th><th>Hash (untuk database)</th></tr>";

foreach ($passwords as $password => $hash) {
    $hash = password_hash($password, PASSWORD_DEFAULT);
    echo "<tr>";
    echo "<td><strong>$password</strong></td>";
    echo "<td><code>$hash</code></td>";
    echo "</tr>";
}

echo "</table>";

echo "<hr>";
echo "<h3>SQL Query untuk Update Password:</h3>";
echo "<pre>";
echo "-- Update Password Admin (admin123)\n";
echo "UPDATE users SET password = '" . password_hash('admin123', PASSWORD_DEFAULT) . "' WHERE username = 'admin';\n\n";

echo "-- Update Password Kepala Sekolah (kepsek123)\n";
echo "UPDATE users SET password = '" . password_hash('kepsek123', PASSWORD_DEFAULT) . "' WHERE username = 'kepsek';\n\n";

echo "-- Update Password Semua Guru (guru123)\n";
echo "UPDATE users SET password = '" . password_hash('guru123', PASSWORD_DEFAULT) . "' WHERE role = 'guru';\n";
echo "</pre>";

echo "<hr>";
echo "<h3>Cara Menggunakan:</h3>";
echo "<ol>";
echo "<li>Copy salah satu SQL query di atas</li>";
echo "<li>Buka phpMyAdmin</li>";
echo "<li>Pilih database Anda</li>";
echo "<li>Klik tab 'SQL'</li>";
echo "<li>Paste query dan klik 'Go'</li>";
echo "</ol>";
?>
