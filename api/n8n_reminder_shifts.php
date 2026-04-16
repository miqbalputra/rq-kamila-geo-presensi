<?php
/**
 * API Endpoint Khusus untuk n8n - Reminder Per Shift
 * Digunakan untuk mengecek guru yang belum presensi berdasarkan Shift 1 atau Shift 2
 */

require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// API Key validation
$valid_api_key = 'n8n_geopresensi_2024_secret_key';
$request_key = $_SERVER['HTTP_X_API_KEY'] ?? $_GET['api_key'] ?? '';

if ($request_key !== $valid_api_key) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

// Ambil parameter shift: 1 atau 2
$shift = isset($_GET['shift']) ? (int)$_GET['shift'] : 1;
$today = date('Y-m-d');
$dayOfWeek = (int)date('N'); // 1 (Senin) - 7 (Minggu)

try {
    // 1. Cek Libur Nasional
    $stmt_h = $pdo->prepare("SELECT * FROM holidays WHERE tanggal = ?");
    $stmt_h->execute([$today]);
    $holiday = $stmt_h->fetch();

    if ($holiday || $dayOfWeek >= 6) {
        echo json_encode([
            'success' => true,
            'is_holiday' => true,
            'message' => $holiday ? 'Hari libur: ' . $holiday['nama'] : 'Hari weekend',
            'data' => []
        ]);
        exit();
    }

    // 2. Query Guru yang belum presensi di Shift tersebut
    // Shift 1: Cek jam_masuk (Sesi Pagi/Utama)
    // Shift 2: Cek jam_masuk_2 (Sesi Sore/Malam)
    
    if ($shift === 1) {
        $query = "
            SELECT u.id, u.nama, u.no_hp
            FROM users u
            LEFT JOIN attendance_logs a ON u.id = a.user_id AND a.tanggal = ?
            WHERE u.role = 'guru' 
            AND (a.jam_masuk IS NULL OR a.id IS NULL)
            AND FIND_IN_SET(?, u.active_days)
            AND u.no_hp IS NOT NULL AND u.no_hp != ''
            ORDER BY u.nama ASC
        ";
    } else {
        $query = "
            SELECT u.id, u.nama, u.no_hp
            FROM users u
            LEFT JOIN attendance_logs a ON u.id = a.user_id AND a.tanggal = ?
            WHERE u.role = 'guru' 
            AND (a.jam_masuk_2 IS NULL OR a.id IS NULL)
            AND FIND_IN_SET(?, u.active_days_2)
            AND u.no_hp IS NOT NULL AND u.no_hp != ''
            AND u.work_start_time_2 IS NOT NULL
            ORDER BY u.nama ASC
        ";
    }

    $stmt = $pdo->prepare($query);
    $stmt->execute([$today, $dayOfWeek]);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Ambil no hp admin untuk alert jika diperlukan
    $stmt_cfg = $pdo->query("SELECT admin_phone FROM webhook_config WHERE id = 1");
    $config = $stmt_cfg->fetch();

    echo json_encode([
        'success' => true,
        'is_holiday' => false,
        'shift' => $shift,
        'tanggal' => $today,
        'total' => count($users),
        'data' => $users,
        'admin_phone' => $config['admin_phone'] ?? ''
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'DB Error: ' . $e->getMessage()]);
}
