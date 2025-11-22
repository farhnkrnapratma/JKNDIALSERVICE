# JKN Dial Service Prototype

Aplikasi simulasi USSD JKN berbasis React Native (Expo Go) menggunakan JSON-based data.

## Disclaimer

Ini adalah prototipe simulasi USSD yang berjalan melalui HTTP, bukan USSD operator GSM resmi. Prototipe ini ditujukan untuk keperluan development, testing, dan demonstrasi konsep. Implementasi USSD production membutuhkan registrasi shortcode ke operator seluler, USSD Gateway, dan integrasi dengan API JKN resmi.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Fitur](#fitur)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Test Data](#test-data)
- [API Documentation](#api-documentation)
- [Development Guide](#development-guide)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Quick Start

### Prerequisites

- Node.js v16 atau lebih tinggi
- npm
- Expo Go app di smartphone (Android/iOS)

### Automated Setup (Recommended - Linux/Mac/Windows)

Skrip automasi akan otomatis menginstall dependencies dan menjalankan aplikasi mobile.

**Linux/Mac:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

**Windows PowerShell:**
```powershell
.\start-dev.ps1
```

**Skrip akan:**
1. Menginstall dependencies (jika belum)
2. Menjalankan Expo development server
3. Menampilkan QR code untuk scan di Expo Go

**Setelah QR code muncul:**
1. Buka Expo Go app di smartphone
2. Scan QR code
3. Tunggu app terbuka
4. Ketik `*354#` dan tekan CALL

**Catatan:** Tekan `Ctrl+C` untuk menghentikan aplikasi.

### Manual Setup

Jika Anda ingin setup secara manual:

#### Mobile App Setup

```bash
cd mobile
npm install
npm start
```

Scan QR code dengan Expo Go app di smartphone. Setelah app terbuka, ketik `*354#` kemudian tekan tombol CALL untuk memulai simulasi USSD.

---

## Fitur

Aplikasi menyediakan 10 menu USSD:

1. **Info Kepesertaan** - Melihat status kepesertaan, kelas perawatan, dan FKTP
2. **Tagihan & Iuran** - Cek tagihan bulanan dan tunggakan
3. **Riwayat Pelayanan** - Riwayat kunjungan FKTP, rujukan, dan rawat inap
4. **Info Faskes** - Daftar fasilitas kesehatan (FKTP, Rumah Sakit, Klinik)
5. **Perubahan Data** - Update nomor telepon, email, alamat, dan FKTP
6. **Pengaduan** - Kirim keluhan dengan maksimal 160 karakter
7. **Layanan Darurat** - Nomor darurat, callback request, dan panduan pertolongan pertama
8. **Daftar Peserta Baru** - Prapendaftaran peserta JKN baru
9. **Antrian Faskes** - Ambil nomor antrian dan cek status
10. **Konsultasi** - Kirim pertanyaan ke tim JKN

---

## Technology Stack

**Mobile:**
- Expo SDK 54 (React Native)
- React v19.1 + React Native v0.81.5
- Axios HTTP client (untuk UI reference, tidak digunakan)
- USSD Engine (JSON-based)
- Custom dialpad dan USSD popup components

**Data Storage:**
- JSON files di `mobile/data/` (peserta, tagihan, riwayat, faskes)
- In-memory storage untuk antrian, pengaduan, konsultasi, pendaftaran

---

## Project Structure

```
JKNDIALSERVICE/
  mobile/
    components/
      Dialpad.js          # Telephone dialpad UI
      UssdPopup.js        # USSD modal popup
    services/
      ussdService.js      # USSD request handler
      ussdEngine.js        # USSD processing logic engine
    data/                 # JSON data files
      peserta.json        # Peserta JKN data
      tagihan.json        # Billing data
      riwayat.json        # Service history
      faskes.json         # Healthcare facilities
    App.js                # Main application component
    config.js             # Configuration (mode lokal)

  start-dev.sh            # Linux/Mac automation script
  start-dev.ps1           # Windows PowerShell script
  README.md               # This file
```

---

## Data Structure

Data tersimpan dalam file JSON lokal di `mobile/data/`:

**peserta.json** - Data peserta JKN
- nik, nama, status, kelas, fktp, noHP, email, alamat, noKK

**tagihan.json** - Data tagihan dan iuran bulanan
- nik, bulan, jumlah, tunggakan, denda

**riwayat.json** - Riwayat pelayanan kesehatan
- nik, tanggal, jenis, detail, faskes

**faskes.json** - Data fasilitas kesehatan
- kode, nama, jenis, kabupaten, kecamatan, alamat, telp, kuotaHari

**In-Memory Storage** (tersimpan saat app berjalan):
- Antrian, Pengaduan, Konsultasi, Pendaftaran Baru

---

## Test Data

Aplikasi sudah dilengkapi dengan test data:

**NIK Peserta:**
- `3201234567890001` - Budi Santoso (Status: Aktif, Kelas: III)
- `3201234567890002` - Siti Aminah (Status: Aktif, Kelas: II)
- `3201234567890003` - Ahmad Hidayat (Status: NonAktif, Kelas: III)
- `1671122812030001` - Zain Ahmad Fahrezi (Status: Aktif, Kelas: II)

**Kode Faskes:**
- `PKM-BGR-001` - Puskesmas Cibinong
- `PKM-BGR-002` - Puskesmas Ciawi
- `RS-BGR-001` - RS PMI Bogor
- `RS-BGR-002` - RSUD Kota Bogor
- `KLN-BGR-001` - Klinik Pratama Sehat
- `KLN-OPI-001` - Klinik Opina

---

## API Documentation (USSD Protocol)

### USSD Response Format

- `CON <message>` - Continue session (memerlukan input user)
- `END <message>` - End session (menutup popup USSD)

Input user dipisahkan dengan asterisk (*). Contoh: `1*3201234567890001` berarti pilih menu 1, input NIK 3201234567890001.

### USSD Menu Flow

**Main Menu (Input: ""):**
```
1. Info Kepesertaan
2. Tagihan & Iuran
3. Riwayat Pelayanan
4. Info Faskes
5. Perubahan Data
6. Pengaduan
7. Layanan Darurat
8. Daftar Peserta Baru
9. Antrian Faskes
10. Konsultasi
0. Keluar
```

---

## Development Guide

### Automation Scripts

Skrip untuk memudahkan development:

**Linux/Mac:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

**Windows:**
```powershell
.\start-dev.ps1
```

**Fitur skrip:**
- Install dependencies otomatis
- Jalankan Expo development server
- Aplikasi berjalan dengan data JSON lokal

### Manual Development

#### Mobile Only

```bash
cd mobile
npm install
npm start
```

Scan QR code dengan Expo Go app. Aplikasi akan berjalan dengan data JSON lokal.

### Testing

#### Test di Smartphone

1. Buka Expo Go app
2. Scan QR code dari terminal
3. Tunggu app terbuka
4. Ketik `*354#` dan tekan CALL untuk memulai USSD

#### Test NIK

Gunakan salah satu NIK test yang tersedia:
- `3201234567890001` - Budi Santoso
- `3201234567890002` - Siti Aminah
- `3201234567890003` - Ahmad Hidayat
- `1671122812030001` - Zain Ahmad Fahrezi

### Available Scripts

**Mobile:**
- `npm start` - Start Expo development server
- `npm run android` - Open di Android emulator
- `npm run ios` - Open di iOS simulator
- `npm run web` - Open di web browser

### Modifying JSON Data

Untuk menambah atau memodifikasi data, edit file JSON di `mobile/data/`:

1. **peserta.json** - Tambah/edit peserta
2. **tagihan.json** - Tambah/edit tagihan
3. **riwayat.json** - Tambah/edit riwayat
4. **faskes.json** - Tambah/edit fasilitas kesehatan

Restart aplikasi untuk melihat perubahan.

---

## Troubleshooting

### Automation Script Issues

**Masalah (Linux/Mac):** Permission denied.

**Solusi:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

**Masalah (Windows):** Script execution policy error.

**Solusi:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\start-dev.ps1
```

### Expo Metro Bundler Error

**Masalah:** Expo app crash atau tidak loading.

**Solusi:**
```bash
cd mobile
rm -rf node_modules
npm install
npx expo start --clear
```

### USSD Popup Not Showing

**Masalah:** Popup USSD tidak muncul setelah dial.

**Solusi:**
1. Pastikan input dimulai dengan asterisk (*) untuk trigger USSD
2. Check console log di Expo untuk error messages
3. Verifikasi format input dengan contoh NIK test: `*354#` -> `1*3201234567890001`

### Clear Metro Cache (Mobile)

```bash
cd mobile
npx expo start --clear
```

### Reinstall Dependencies

**Mobile:**
```bash
cd mobile
rm -rf node_modules package-lock.json
npm install
```

---

## Performance Tips

### Mobile

- Clear Metro cache jika app lambat: `npx expo start --clear`
- Gunakan `npm run web` untuk debug di browser
- Check network tab di Expo DevTools

### Mode Lokal

- Aplikasi berjalan 100% dengan data JSON lokal tanpa ketergantungan server
- Data dimuat dari JSON files di startup
- Perubahan data tersimpan di memory (akan hilang jika app restart)

---

## Best Practices

1. **Always use automation scripts** untuk development
2. **Modifikasi JSON files** untuk menambah/edit test data
3. **Test dengan NIK test** sebelum production
4. **Monitor app logs** di Expo terminal untuk troubleshooting
5. **Keep data sync** antara JSON files di `mobile/data/`

---

## License

PROPRIETARY LICENSE

Copyright (c) 2025 Global Palvion. All Rights Reserved.

This software and associated documentation files are proprietary and confidential property of Global Palvion. Unauthorized copying, distribution, modification, or use of this software is strictly prohibited without explicit written permission from Global Palvion.

For licensing inquiries, contact:
- Email: zainahmadfahrezi@gmail.com
- Developer: Global Palvion Development Team

See the LICENSE file for complete terms and conditions.
