# 📱 Presensi RQ Kamila
### Sistem Absensi Guru Berbasis Lokasi (GPS) & QR Code - Rumah Qur'an Kamila

Aplikasi web modern yang dirancang untuk mengelola kehadiran guru secara akurat, transparan, dan real-time. Menggunakan validasi Geofencing (GPS) dan QR Code untuk menjamin kehadiran fisik guru di sekolah.

---

## 🌐 Informasi Akses
*   **Domain Utama:** [https://geo.rq.kelolasekolah.web.id](https://geo.rq.kelolasekolah.web.id)
*   **Halaman Guru:** [https://geo.rq.kelolasekolah.web.id/login](https://geo.rq.kelolasekolah.web.id/login)
*   **Halaman Admin:** [https://geo.rq.kelolasekolah.web.id/admin](https://geo.rq.kelolasekolah.web.id/admin)

---

## 🚀 Fitur Unggulan

### 🏫 Manajemen Kehadiran (Geofencing)
*   **Validasi Radius Sekolah:** Presensi hanya bisa dilakukan jika guru berada dalam radius yang ditentukan (default 20-50m) dari titik koordinat RQ Kamila.
*   **Dual Mode Presensi:** Guru dapat memilih antara menekan tombol **"HADIR"** atau melakukan **"SCAN QR CODE"**.
*   **Jadwal Individu Guru:** Setiap guru memiliki jadwal masuk dan pulang yang berbeda-beda sesuai kebijakan sekolah, lengkap dengan validasi keterlambatan otomatis per guru.
*   **Tipe Guru (Full Time / Part Time):** Mendukung guru tetap yang memerlukan absen masuk/pulang reguler, maupun guru part-time (sekali scan langsung hadir).

### 🏆 Gamifikasi & Leaderboard
*   **Leaderboard Guru:** Pemeringkatan guru paling rajin dan disiplin berdasarkan rumus: **Hadir (50%) + Disiplin/Tepat Waktu (30%) + Jam Kerja/Durasi (20%)**.
*   **Badge Penghargaan:** Pemberian badge otomatis (Juara 1, 2, 3, Excellent, Good) untuk memotivasi kedisiplinan guru.

### 👮 Manajemen Operasional
*   **Jadwal Piket Digital:** Penugasan guru piket harian yang terintegrasi dengan dashboard.
*   **Manajemen Hari Libur:** Kalender libur sekolah (Nasional/Sekolah) yang secara otomatis menonaktifkan fitur presensi.
*   **Dashboard Real-time:** Grafik tren kehadiran, persentase kehadiran harian, dan daftar guru yang belum hadir.

### 📊 Administrasi & Pelaporan
*   **Download Laporan (Excel):** Admin dapat mengunduh laporan kehadiran per periode atau per guru dengan satu klik.
*   **Log Aktivitas:** Rekam jejak digital (Audit Trail) untuk setiap aksi penting di sistem (Login, Tambah/Hapus Guru, Edit Lokasi, dll).

---

## 🛠️ Tech Stack
*   **Frontend:** React.js (Vite), Tailwind CSS, Lucide Icons, Recharts (PWA Ready).
*   **Backend:** PHP API (RESTful).
*   **Database:** MariaDB / MySQL.
*   **Infrastructure:** VPS Managed via Dokploy.

---

## 🆘 Troubleshooting (Masalah Umum)

### 1. Masalah: "Gagal Mendapatkan Lokasi"
*   Pastikan GPS HP Aktif dan dalam mode Google Akurasi Tinggi.
*   Berikan izin (Allow) saat browser meminta akses lokasi.
*   Jika berada di dalam gedung beton yang sangat tebal, geser sedikit ke dekat jendela.

### 2. Masalah: "Anda berada di luar jangkauan"
*   Pastikan berada di area sekolah RQ Kamila.
*   Tunggu 10 detik agar GPS HP mendapatkan koordinat yang lebih presisi.
*   Hubungi Admin jika titik koordinat sekolah perlu dikalibrasi ulang di menu Pengaturan.

---

## 📍 Konfigurasi Sistem
Konfigurasi utama dapat diatur melalui menu **"Pengaturan"** di Dashboard Admin:
*   `radius_gps`: Batas jarak maksimal presensi.
*   `latitude_sekolah` & `longitude_sekolah`: Titik pusat sekolah.
*   `waktu_mulai_presensi_pulang`: Batas awal jam pulang dapat diklik.

---
**Presensi RQ Kamila** - *Membangun Kedisiplinan dengan Teknologi Modern.*
**Versi:** 3.0.0 | **Hak Cipta © 2026** - Rumah Qur'an Kamila
