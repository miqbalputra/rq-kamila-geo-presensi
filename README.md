# 📱 Presensi RQ Kamila 
### Sistem Absensi Guru Berbasis Lokasi (GPS) & QR Code - Rumah Qur'an Kamila

Aplikasi web modern yang dirancang untuk mengelola kehadiran guru secara akurat, transparan, dan real-time. Menggunakan validasi Geofencing (GPS) dan QR Code untuk menjamin kehadiran fisik guru di sekolah.

---

## 🌐 Informasi Akses
*   **Domain Utama:** [https://geo.rq.kelolasekolah.web.id](https://geo.rq.kelolasekolah.web.id)
*   **Halaman Guru:** [https://geo.rq.kelolasekolah.web.id/login](https://geo.rq.kelolasekolah.web.id/login)
*   **Halaman Admin:** [https://geo.rq.kelolasekolah.web.id/admin](https://geo.rq.kelolasekolah.web.id/admin)

---

## 🚀 Fitur Unggulan Terbaru (v3.5)

### 🌓 Split Shift & Dual Session (NEW)
*   **Dukungan Sesi Ganda:** Guru dapat memiliki dua jadwal kerja dalam satu hari (misal: Sesi Pagi & Sesi Malam).
*   **Jadwal Hari Fleksibel:** Shift ke-2 dapat diatur aktif pada hari-hari tertentu saja, berbeda dengan hari kerja utama.
*   **Smart QR Scan:** Sistem otomatis mendeteksi sesi mana yang sedang di-scan (Masuk 1, Pulang 1, Masuk 2, atau Pulang 2).

### 📍 Geofencing Fleksibel
*   **Saklar Posisi Guru:** Admin dapat mengaktifkan/menonaktifkan titik koordinat khusus untuk **Pos Guru Laki-laki** dan **Pos Guru Perempuan**.
*   **Fallback Lokasi Pusat:** Jika pos khusus dimatikan, sistem otomatis beralih menggunakan koordinat **Pusat Sekolah**.

### 🤒 Manajemen Izin Mandiri
*   **Self-Reporting:** Guru kini dapat melaporkan status **Sakit** atau **Izin** secara mandiri langsung dari aplikasi tanpa menunggu input admin.
*   **Validasi Keamanan:** Guru hanya diizinkan menginput data untuk dirinya sendiri dengan proteksi session sisi server.

### 🏆 Gamifikasi & Leaderboard
*   **Leaderboard Dinamis:** Pemeringkatan guru berdasarkan rumus: **Hadir (50%) + Disiplin (30%) + Jam Kerja (20%)**.
*   **Badge Penghargaan:** Pemberian badge otomatis (Juara 1, 2, 3, Excellent, Good) di dashboard guru.

---

## 🛠️ Tech Stack & Security
*   **Frontend:** React.js (Vite), Tailwind CSS, Lucide Icons.
*   **Backend:** PHP API (RESTful) dengan proteksi JWT-less session.
*   **Database:** MariaDB / MySQL.
*   **Security:** Wajib menggunakan **HTTPS** untuk akses Geolocation API di browser mobile.

---

## 🆘 Troubleshooting (Masalah Umum)

### 1. Masalah: "Menunggu Koordinat GPS..."
*   **Solusi:** Pastikan Anda mengakses menggunakan protokol **HTTPS**. Browser modern memblokir akses GPS pada koneksi HTTP biasa.
*   **Browser:** Gunakan Google Chrome atau Safari versi terbaru.

### 2. Masalah: "Gagal Menyimpan (Forbidden)"
*   **Solusi:** Pastikan guru menginput tanggal yang benar. Sistem melarang penginputan data untuk user ID lain.

---

## 📍 Konfigurasi Sistem (Admin Only)
Pengaturan utama di menu **"Lokasi & Geofence"**:
*   `radius_gps`: Toleransi jarak (meter).
*   `lokasi_laki_enabled` / `lokasi_perempuan_enabled`: Saklar pos khusus gender.
*   `latitude` & `longitude`: Titik koordinat pusat dan pos-pos guru.

---
**Presensi RQ Kamila** - *Membangun Kedisiplinan dengan Teknologi Modern.*
**Versi:** 3.5.0 | **Hak Cipta © 2026** - SistemFlow.com
