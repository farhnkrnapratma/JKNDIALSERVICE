# JKN Dial Service Prototype

Aplikasi simulasi USSD JKN berbasis React Native (Expo Go) dan Node.js untuk testing dan development konsep USSD JKN Mobile.

## Disclaimer

Ini adalah prototipe simulasi USSD yang berjalan melalui HTTP, bukan USSD operator GSM resmi. Prototipe ini ditujukan untuk keperluan development, testing, dan demonstrasi konsep. Implementasi USSD production membutuhkan registrasi shortcode ke operator seluler, USSD Gateway, dan integrasi dengan API JKN resmi.

---

## Quick Start

### Prerequisites

- Node.js v16 atau lebih tinggi
- npm
- Expo Go app di smartphone (Android/iOS)
- Komputer dan smartphone terhubung ke WiFi yang sama

### Backend Setup

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

### Mobile App Setup

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
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema (10 models)
│   │   ├── seed.js             # Database seeder
│   │   └── migrations/         # Database migrations
│   ├── src/
│   │   ├── config/             # Database and Swagger configuration
│   │   ├── controllers/        # Request handlers
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic (USSD engine)
│   │   ├── shoot/              # Troubleshooting utilities
│   │   └── index.js            # Application entry point
│   └── package.json
│
└── mobile/
    ├── components/
    │   ├── Dialpad.js          # Telephone dialpad UI
    │   └── UssdPopup.js        # USSD modal popup
    ├── services/
    │   └── ussdService.js      # API communication layer
    ├── App.js                  # Main application component
    └── config.js               # Backend URL configuration
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

## API Examples

### 1. Main Menu

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

### 2. Info Kepesertaan

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

### 3. Tagihan & Iuran

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

### 4. Daftar Peserta Baru

Request pendaftaran peserta baru (full flow):

```bash
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_007",
    "serviceCode": "*354#",
    "phoneNumber": "081234567890",
    "text": "8*3201234567890999*3201012345678999*John Doe*Bogor*1"
  }'
```

Response:
```json
{
  "sessionId": "session_007",
  "response": "END Prapendaftaran berhasil!\nNIK: 3201234567890999\nNama: John Doe\n\nLengkapi dokumen di kantor BPJS terdekat dalam 14 hari."
}
```

### USSD Response Format

- `CON <message>` - Continue session (memerlukan input user)
- `END <message>` - End session (menutup popup USSD)

Input user dipisahkan dengan asterisk (*). Contoh: `1*3201234567890001` berarti pilih menu 1, input NIK 3201234567890001.

---

## Development Tools

### Prisma Studio

GUI untuk viewing dan editing database:

```bash
cd backend
npm run prisma:studio
```

Akses di `http://localhost:5555`

### Swagger API Documentation

Dokumentasi interaktif untuk testing API:

Akses di `http://localhost:3000/api/docs`

### Available Scripts

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

### Cannot Connect to Server

**Masalah:** Mobile app tidak dapat terhubung ke backend.

**Solusi:**
1. Pastikan backend running dengan `npm run dev`
2. Verifikasi IP address di `mobile/config.js` sudah benar
3. Test endpoint dari browser smartphone: `http://192.168.1.100:3000/health`
4. Pastikan komputer dan smartphone di WiFi yang sama
5. Matikan firewall yang memblokir port 3000

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

---

## License

PROPRIETARY LICENSE

Copyright (c) 2025 Global Palvion. All Rights Reserved.

This software and associated documentation files are proprietary and confidential property of Global Palvion. Unauthorized copying, distribution, modification, or use of this software is strictly prohibited without explicit written permission from Global Palvion.

For licensing inquiries, contact:
- Email: zainahmadfahrezi@gmail.com
- Developer: Global Palvion Development Team

See the LICENSE file for complete terms and conditions.
 
