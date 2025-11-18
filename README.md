# JKN Dial Service Prototype

Aplikasi simulasi USSD JKN berbasis React Native (Expo Go) dan Node.js untuk testing dan development konsep USSD JKN Mobile.

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
- Komputer dan smartphone terhubung ke WiFi yang sama

### Automated Setup (Recommended)

Skrip automasi akan otomatis mendeteksi IP lokal, mengkonfigurasi aplikasi, dan menjalankan backend + mobile sekaligus.

**Linux/Mac:**
```bash
./start-dev.sh
```

**Windows PowerShell:**
```powershell
.\start-dev.ps1
```

**Skrip akan:**
1. Mendeteksi IP lokal otomatis
2. Mengupdate `mobile/config.js` dengan IP yang terdeteksi
3. Menginstall dependencies (jika belum)
4. Setup database Prisma (jika belum)
5. Menjalankan backend dan mobile development server

**Setelah QR code muncul:**
1. Buka Expo Go app di smartphone
2. Scan QR code
3. Tunggu app terbuka
4. Ketik `*354#` dan tekan CALL

**Catatan:** Tekan `Ctrl+C` untuk menghentikan semua services. Konfigurasi akan otomatis dikembalikan ke default.

### Test Your Setup

Verifikasi bahwa semua sudah terkonfigurasi dengan benar:

```bash
./test-setup.sh
```

Script akan mengecek:
- Node.js dan npm installation
- Backend dan mobile dependencies
- Database setup
- IP detection
- Backend server responsiveness

---

### Manual Setup

Jika Anda ingin setup secara manual:

#### Backend Setup

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

Server akan berjalan di `http://localhost:3000`. Endpoints yang tersedia:

- `GET /` - Root endpoint
- `GET /health` - Health check
- `POST /api/ussd` - Main USSD endpoint
- `GET /api/ussd/test` - Test endpoint
- `GET /api/docs` - Swagger API documentation

Environment variables (`.env`):
```env
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
```

#### Mobile App Setup

Cari IP komputer Anda terlebih dahulu:

**Windows:**
```bash
ipconfig
```

**Mac/Linux:**
```bash
hostname -I
# atau
ip addr show
```

Catat IP address (contoh: `192.168.1.100`), kemudian setup mobile app:

```bash
cd mobile
npm install
```

Edit file `mobile/config.js` dan ganti dengan IP komputer Anda:
```javascript
const API_BASE_URL = 'http://192.168.1.100:3000'; // Sesuaikan dengan IP Anda
```

Jalankan Expo development server:
```bash
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
7. **SOS** - Nomor darurat, callback request, dan panduan pertolongan pertama
8. **Daftar Peserta Baru** - Prapendaftaran peserta JKN baru
9. **Antrian Faskes** - Ambil nomor antrian dan cek status
10. **Konsultasi** - Kirim pertanyaan ke tim JKN

---

## Technology Stack

**Backend:**
- Node.js + Express.js v4.21
- Prisma ORM v5.22 (SQLite untuk development)
- Swagger UI untuk dokumentasi API
- Custom USSD session engine

**Mobile:**
- Expo SDK 54 (React Native)
- React v19.1 + React Native v0.81.5
- Axios HTTP client
- Custom dialpad dan USSD popup components

---

## Project Structure

```
JKNDIALSERVICE/
  backend/
    prisma/
      schema.prisma       # Database schema (10 models)
      seed.js             # Database seeder
      migrations/         # Database migrations
    src/
      config/             # Database and Swagger configuration
      controllers/        # Request handlers
      routes/             # API routes
      services/           # Business logic (USSD engine)
      shoot/              # Troubleshooting utilities
      index.js            # Application entry point
    package.json

  mobile/
    components/
      Dialpad.js          # Telephone dialpad UI
      UssdPopup.js        # USSD modal popup
    services/
      ussdService.js      # API communication layer
    App.js                # Main application component
    config.js             # Backend URL configuration

  start-dev.sh            # Linux/Mac automation script
  start-dev.ps1           # Windows PowerShell script
  test-setup.sh           # Environment test script
  README.md               # This file
```

---

## Database Schema

Database menggunakan 10 models:

- **UserSession** - Session tracking untuk USSD interactions
- **UssdMenuLog** - Log semua USSD menu interactions
- **Peserta** - Data peserta JKN (NIK, nama, status, kelas, FKTP)
- **Tagihan** - Data tagihan dan iuran bulanan
- **Riwayat** - Riwayat pelayanan kesehatan
- **Faskes** - Data fasilitas kesehatan (FKTP, RS, Klinik)
- **Antrian** - Management antrian online
- **Pengaduan** - Data pengaduan peserta
- **Konsultasi** - Data konsultasi dan pertanyaan
- **PendaftaranBaru** - Data prapendaftaran peserta baru

---

## Test Data

Database telah di-seed dengan data dummy untuk testing:

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

## API Documentation

### API Examples

#### 1. Main Menu

Request menu utama USSD:

```bash
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_001",
    "serviceCode": "*354#",
    "phoneNumber": "081234567890",
    "text": ""
  }'
```

Response:
```json
{
  "sessionId": "session_001",
  "response": "CON Selamat datang di JKN Mobile\n1. Info Kepesertaan\n2. Tagihan & Iuran\n3. Riwayat Pelayanan\n4. Info Faskes\n5. Perubahan Data\n6. Pengaduan\n7. SOS\n8. Daftar Peserta Baru\n9. Antrian Faskes\n10. Konsultasi\n0. Keluar"
}
```

#### 2. Info Kepesertaan

Request info kepesertaan dengan NIK:

```bash
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_001",
    "serviceCode": "*354#",
    "phoneNumber": "081234567890",
    "text": "1*3201234567890001"
  }'
```

Response:
```json
{
  "sessionId": "session_001",
  "response": "END Info Kepesertaan\nNama: Budi Santoso\nNIK: 3201234567890001\nStatus: Aktif\nKelas: Kelas III\nFKTP: Puskesmas Cibinong\nNo. HP: 081234567890"
}
```

#### 3. Tagihan & Iuran

```bash
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_002",
    "serviceCode": "*354#",
    "phoneNumber": "081234567890",
    "text": "2*3201234567890001"
  }'
```

Response:
```json
{
  "sessionId": "session_002",
  "response": "END Tagihan Budi Santoso\nBulan: 2025-01\nIuran: Rp 42,000\nTunggakan: Rp 0\nDenda: Rp 0\nTotal: Rp 42,000"
}
```

### USSD Response Format

- `CON <message>` - Continue session (memerlukan input user)
- `END <message>` - End session (menutup popup USSD)

Input user dipisahkan dengan asterisk (*). Contoh: `1*3201234567890001` berarti pilih menu 1, input NIK 3201234567890001.

### Swagger Documentation

Dokumentasi interaktif tersedia di: `http://localhost:3000/api/docs`

---

## Development Guide

### Automation Scripts

Skrip untuk memudahkan development dengan auto-detect IP dan setup otomatis:

**Linux/Mac:**
```bash
./start-dev.sh
```

**Windows:**
```powershell
.\start-dev.ps1
```

**Fitur skrip:**
- Auto-detect IP lokal
- Update konfigurasi mobile otomatis
- Install dependencies jika belum ada
- Setup database Prisma otomatis
- Jalankan backend + mobile sekaligus
- Restore konfigurasi saat exit (Ctrl+C)

### Manual Development

#### Backend Only

```bash
cd backend
npm run dev
```

Backend akan berjalan di `http://localhost:3000`

#### Mobile Only

```bash
cd mobile
npm start
```

**Catatan:** Pastikan `mobile/config.js` sudah diupdate dengan IP backend yang benar.

### Testing

#### API Testing dengan cURL

**Health Check:**
```bash
curl http://localhost:3000/health
```

**USSD Main Menu:**
```bash
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test_001",
    "serviceCode": "*354#",
    "phoneNumber": "081234567890",
    "text": ""
  }'
```

**Info Kepesertaan:**
```bash
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test_002",
    "serviceCode": "*354#",
    "phoneNumber": "081234567890",
    "text": "1*3201234567890001"
  }'
```

#### Testing dari Smartphone

1. Pastikan backend running
2. Buka browser smartphone, akses: `http://YOUR_IP:3000/health`
3. Jika sukses, buka Expo Go app
4. Scan QR code
5. Ketik `*354#` dan tekan CALL

### Database Management

#### Prisma Studio

GUI untuk view dan edit database:

```bash
cd backend
npm run prisma:studio
```

Akses: `http://localhost:5555`

#### Reset Database

```bash
cd backend
rm prisma/dev.db
npx prisma migrate dev --name init
npm run prisma:seed
```

#### Add New Migration

```bash
cd backend
npx prisma migrate dev --name your_migration_name
```

### Available Scripts

**Root Directory:**
- `./start-dev.sh` (Linux/Mac) - Start development environment
- `.\start-dev.ps1` (Windows) - Start development environment
- `./test-setup.sh` - Test environment setup

**Backend:**
- `npm start` - Run production server
- `npm run dev` - Run development server dengan auto-reload
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database dengan dummy data
- `npm run prisma:studio` - Open Prisma Studio

**Mobile:**
- `npm start` - Start Expo development server
- `npm run android` - Open di Android emulator
- `npm run ios` - Open di iOS simulator
- `npm run web` - Open di web browser

---

## Troubleshooting

### Automation Script Issues

**Masalah:** Skrip automasi gagal mendeteksi IP.

**Solusi:**
1. Pastikan komputer terhubung ke jaringan WiFi/LAN
2. Jalankan manual setup dan cek IP dengan `ipconfig` (Windows) atau `hostname -I` (Linux/Mac)
3. Edit `mobile/config.js` secara manual jika perlu

**Masalah (Windows):** Script execution policy error.

**Solusi:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Masalah (Linux/Mac):** Permission denied.

**Solusi:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

### Cannot Connect to Server

**Masalah:** Mobile app tidak dapat terhubung ke backend.

**Solusi:**
1. Pastikan backend running dengan `npm run dev` atau gunakan `./start-dev.sh`
2. Verifikasi IP address di `mobile/config.js` sudah benar
3. Test endpoint dari browser smartphone: `http://YOUR_IP:3000/health`
4. Pastikan komputer dan smartphone di WiFi yang sama
5. Matikan firewall yang memblokir port 3000

**Windows Firewall:**
```powershell
New-NetFirewallRule -DisplayName "Node.js" -Direction Inbound -Program "C:\Program Files\nodejs\node.exe" -Action Allow
```

**Linux Firewall (ufw):**
```bash
sudo ufw allow 3000/tcp
sudo ufw allow 8081/tcp
```

**Mac:**
System Preferences > Security & Privacy > Firewall > Firewall Options > Allow Node.js

### Port Already in Use

**Backend (Port 3000):**
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

**Expo (Port 8081):**
```bash
# Linux/Mac
lsof -ti:8081 | xargs kill -9

# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 8081).OwningProcess | Stop-Process
```

### Prisma Database Error

**Masalah:** Error terkait Prisma Client atau database.

**Solusi:**
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
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
3. Verifikasi network request berhasil ke backend
4. Test dengan curl untuk memastikan backend response correct

### IP Detection Fails

Jika skrip automasi gagal detect IP:

1. **Manual Check IP:**
   ```bash
   # Linux/Mac
   hostname -I
   
   # Windows
   ipconfig
   ```

2. **Manual Update Config:**
   Edit `mobile/config.js`:
   ```javascript
   const API_BASE_URL = 'http://YOUR_IP_HERE:3000';
   ```

### Clear Metro Cache (Mobile)

```bash
cd mobile
npx expo start --clear
```

### Reinstall Dependencies

**Backend:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

**Mobile:**
```bash
cd mobile
rm -rf node_modules package-lock.json
npm install
```

---

## Performance Tips

### Backend

- Use `NODE_ENV=production` untuk production builds
- Enable compression (sudah aktif)
- Monitor logs di `backend/logs/`

### Mobile

- Clear Metro cache jika app lambat: `npx expo start --clear`
- Gunakan `npm run web` untuk debug di browser
- Check network tab di Expo DevTools

---

## Best Practices

1. **Always use automation scripts** untuk development
2. **Never commit** `mobile/config.js.backup` atau `.env` files
3. **Test API endpoints** dengan cURL sebelum test di mobile
4. **Use Prisma Studio** untuk debug database issues
5. **Check Swagger docs** di `http://localhost:3000/api/docs`
6. **Monitor logs** di `backend/logs/` untuk troubleshooting
7. **Keep phone and computer** on same WiFi network

---

## License

PROPRIETARY LICENSE

Copyright (c) 2025 Global Palvion. All Rights Reserved.

This software and associated documentation files are proprietary and confidential property of Global Palvion. Unauthorized copying, distribution, modification, or use of this software is strictly prohibited without explicit written permission from Global Palvion.

For licensing inquiries, contact:
- Email: zainahmadfahrezi@gmail.com
- Developer: Global Palvion Development Team

See the LICENSE file for complete terms and conditions.
