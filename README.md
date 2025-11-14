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
ip route
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

### Web Dashboard Setup (Optional)

Dashboard untuk monitoring data secara real-time:

```bash
cd dashboard
npm install
npm run dev
```

Dashboard akan berjalan di `http://localhost:5173` dan memerlukan backend aktif di port 3000.

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
- Node.js + Express.js v4.18
- Prisma ORM v5.22 (SQLite untuk development, PostgreSQL untuk production)
- Swagger UI untuk dokumentasi API
- Custom USSD session engine

**Mobile:**
- Expo SDK 54 (React Native)
- React v19.1 + React Native v0.81
- Axios HTTP client
- Custom dialpad dan USSD popup components

**Web Dashboard:**
- React v19.2 + Vite v7.2
- React Router v6.26
- Real-time data fetching dari backend API

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
│   │   └── index.js            # Application entry point
│   └── package.json
│
├── mobile/
│   ├── components/
│   │   ├── Dialpad.js          # Telephone dialpad UI
│   │   └── UssdPopup.js        # USSD modal popup
│   ├── services/
│   │   └── ussdService.js      # API communication layer
│   ├── App.js                  # Main application component
│   └── config.js               # Backend URL configuration
│
└── dashboard/
    ├── src/
    │   ├── pages/              # Dashboard pages
    │   └── App.jsx             # Main app with routing
    └── vite.config.js          # Vite configuration
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
- `3201234567890003` - Ahmad Hidayat (Status: NonAktif, Kelas: I)
- `1671122812030001` - Zain Ahmad Fahrezi (Status: Aktif, Kelas: III)

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

**Dashboard:**
- `npm run dev` - Start development server
- `npm run build` - Build untuk production
- `npm run preview` - Preview production build

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

## Production Deployment

### Roadmap ke Production USSD

Implementasi USSD operator resmi memerlukan langkah-langkah berikut:

1. **Registrasi Shortcode**
   - BPJS mendaftarkan shortcode `*354#` ke operator seluler (Telkomsel, XL, Indosat, dll)
   - Negosiasi biaya setup dan sewa bulanan per operator
   - Kontrak dan legal agreement dengan setiap operator

2. **USSD Gateway Setup**
   - Install USSD Gateway: Kannel, Jasmin, atau vendor telco (Infobip, Vonage)
   - Konfigurasi koneksi ke operator via SMPP/SS7/HTTP protocol
   - Mapping shortcode `*354#` ke backend server

3. **Backend Integration**
   - Update backend untuk menerima request dari USSD Gateway
   - Implementasi session management dengan Redis untuk high traffic
   - Rate limiting dan load balancing

4. **API JKN Integration**
   - Integrasikan dengan API JKN resmi (mengganti dummy data)
   - Implementasi OAuth2 authentication
   - Error handling dan fallback mechanism

5. **Security & Compliance**
   - Implementasi SSL/TLS untuk semua komunikasi
   - Enkripsi data sensitif (NIK, nomor HP, data kesehatan)
   - Audit logging untuk semua transaksi USSD
   - Compliance dengan UU Perlindungan Data Pribadi (UU PDP)
   - Penetration testing sebelum go-live

6. **Infrastructure**
   - Deploy ke cloud provider (AWS, Azure, GCP)
   - Setup load balancer untuk distribusi traffic
   - Redis cluster untuk session management
   - Database migration ke PostgreSQL/MySQL
   - Auto-scaling untuk handle high concurrent users

7. **Monitoring & Maintenance**
   - Setup monitoring: Prometheus, Grafana, ELK Stack
   - 24/7 monitoring dan alerting
   - Incident response team
   - Regular security updates

### Backend Deployment Options

**VPS Deployment (DigitalOcean, AWS EC2, Azure VM):**

```bash
# System setup
sudo apt update && sudo apt upgrade -y
sudo apt install nodejs npm
sudo npm install -g pm2

# Application setup
git clone <repository-url>
cd backend
npm install
npx prisma generate
npx prisma migrate deploy

# Start with PM2
pm2 start src/index.js --name jkn-ussd
pm2 startup
pm2 save
```

Setup Nginx sebagai reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Platform-as-a-Service (Railway, Heroku, Render):**

1. Push code ke GitHub repository
2. Connect repository di platform dashboard
3. Set environment variables:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `PORT` (default: 3000)
   - `NODE_ENV=production`
4. Deploy akan berjalan otomatis

**Note:** SQLite tidak disarankan untuk production. Migrate ke PostgreSQL atau MySQL untuk production deployment.

### Database Migration ke PostgreSQL

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Install PostgreSQL driver:
```bash
npm install pg
```

Run migration:
```bash
npx prisma migrate deploy
```

---

## Contributing

Kontribusi sangat diterima. Untuk berkontribusi:

1. Fork repository ini
2. Create feature branch: `git checkout -b feature/NamaFitur`
3. Commit changes: `git commit -m 'Menambahkan fitur X'`
4. Push ke branch: `git push origin feature/NamaFitur`
5. Submit Pull Request

Guidelines:
- Ikuti code style yang ada
- Tambahkan tests untuk fitur baru
- Update dokumentasi jika diperlukan
- Pastikan semua tests pass sebelum submit PR

---

## License

PROPRIETARY LICENSE

Copyright (c) 2025 Global Palvion. All Rights Reserved.

This software and associated documentation files are proprietary and confidential property of Global Palvion. Unauthorized copying, distribution, modification, or use of this software is strictly prohibited without explicit written permission from Global Palvion.

For licensing inquiries, contact:
- Email: zainahmadfahrezi@gmail.com
- Developer: Global Palvion Development Team

See the LICENSE file for complete terms and conditions.
 
