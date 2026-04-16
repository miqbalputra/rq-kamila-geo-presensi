-- =====================================================
-- DATABASE PRODUKSI: GEO PRESENSI RUMAH QUR'AN KAMILA
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `attendance_logs`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `activity_logs`;
DROP TABLE IF EXISTS `settings`;
DROP TABLE IF EXISTS `holidays`;
DROP TABLE IF EXISTS `jadwal_piket`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Tabel Users (Support Jadwal Individu)
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_guru` varchar(20) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','kepala_sekolah','guru') NOT NULL,
  `nama` varchar(100) NOT NULL,
  `jenis_kelamin` enum('Laki-laki','Perempuan') DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `no_hp` varchar(20) DEFAULT NULL,
  `jabatan` text DEFAULT NULL,
  `tanggal_bertugas` date DEFAULT NULL,
  `tipe_guru` enum('full_time','partime') DEFAULT 'full_time',
  `active_days` varchar(50) DEFAULT '1,2,3,4,5', -- Default Senin-Jumat (1=Mon, 7=Sun)
  `active_days_2` varchar(50) DEFAULT NULL,
  `work_start_time` time DEFAULT '07:30:00',
  `work_end_time` time DEFAULT '15:00:00',
  `work_start_time_2` time DEFAULT NULL,
  `work_end_time_2` time DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data Default (Password: admin123, kepsek123, guru123)
-- Hash: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO `users` (`id`, `username`, `password`, `role`, `nama`, `active_days`, `work_start_time`) VALUES
(1, 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Admin RQ Kamila', '1,2,3,4,5,6', '07:30:00'),
(2, 'kepsek', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'kepala_sekolah', 'Kepala Sekolah', '1,2,3,4,5,6', '07:30:00'),
(3, 'guru1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'guru', 'Budi Santoso', '1,2,3,4,5', '07:30:00');

-- 2. Tabel Settings (RQ Kamila Config)
CREATE TABLE `settings` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `setting_key` varchar(100) NOT NULL,
    `setting_value` text NOT NULL,
    `updated_by` varchar(100) DEFAULT 'system',
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `settings` (`setting_key`, `setting_value`, `updated_by`) VALUES 
('sekolah_nama', 'Rumah Qur\'an Kamila', 'system'),
('jam_masuk_normal', '07:30', 'system'),
('toleransi_terlambat', '15', 'system'),
('radius_gps', '100', 'system'),
('mode_testing', '0', 'system'),
('qr_enabled', '1', 'system'),
('qr_secret', 'KAMILA_SECRET_2026', 'system'),
('sekolah_latitude', '-6.1754', 'system'),
('sekolah_longitude', '106.8272', 'system');

-- 3. Tabel Attendance Logs (Record Presensi)
CREATE TABLE `attendance_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `tanggal` date NOT NULL,
  `status` enum('hadir','hadir_terlambat','hadir_izin_terlambat','izin','sakit') NOT NULL,
  `jam_masuk` time DEFAULT NULL,
  `jam_pulang` time DEFAULT NULL,
  `jam_masuk_2` time DEFAULT NULL,
  `jam_pulang_2` time DEFAULT NULL,
  `jam_hadir` time DEFAULT NULL,
  `jam_izin` time DEFAULT NULL,
  `jam_sakit` time DEFAULT NULL,
  `keterangan` text DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `metode` enum('button','qr_scan','manual') DEFAULT 'button',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_date` (`user_id`, `tanggal`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabel Lainnya (Holidays, Activity, Piket)
CREATE TABLE `holidays` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tanggal` date NOT NULL,
  `nama` varchar(255) NOT NULL,
  `jenis` enum('nasional','cuti_bersama','sekolah') DEFAULT 'nasional',
  PRIMARY KEY (`id`),
  UNIQUE KEY `tanggal` (`tanggal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `waktu` timestamp NOT NULL DEFAULT current_timestamp(),
  `user` varchar(100) NOT NULL,
  `aktivitas` varchar(100) NOT NULL,
  `status` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `jadwal_piket` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` int(11) NOT NULL,
    `nama_guru` varchar(255) NOT NULL,
    `hari` enum('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu') NOT NULL,
    `jam_piket` time DEFAULT '07:00:00',
    `is_active` tinyint(1) DEFAULT 1,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_user_hari` (`user_id`,`hari`),
    CONSTRAINT `fk_piket_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
