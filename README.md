# 🏥 JKN DIAL SERVICE SIMULATOR

Aplikasi simulasi USSD JKN berbasis **Expo Go (React Native)** dan **Node.js Backend** dengan Prisma ORM.

## ⚠️ PENTING - PROTOTIPE SIMULASI

**Ini adalah prototipe simulasi USSD yang berjalan melalui WiFi/HTTP.**

- Dial `*354#` hanya memicu request ke server backend internal
- **Untuk implementasi USSD resmi**, kode shortcode `*354#` harus didaftarkan ke operator seluler (Telkomsel, Indosat, XL, dll) melalui **USSD Gateway**
- Saat ini sistem **TIDAK** terhubung dengan USSD operator sesungguhnya
- Aplikasi ini hanya untuk keperluan **demo, development, dan testing**

---

## 📋 Fitur Lengkap

### Menu USSD JKN Mobile

1. **Info Kepesertaan** - Cek status, kelas, FKTP
2. **Tagihan & Iuran** - Lihat tagihan bulanan dan tunggakan
3. **Riwayat Pelayanan** - Riwayat kunjungan FKTP, rujukan, rawat inap
4. **Info Faskes** - Daftar FKTP, RS, Klinik
5. **Perubahan Data** - Update no HP, email, alamat, FKTP
6. **Pengaduan** - Kirim keluhan (max 160 karakter)
7. **SOS** - Nomor darurat, callback request, panduan P3K
8. **Daftar Peserta Baru** - Prapendaftaran peserta JKN
9. **Antrian Faskes** - Ambil nomor antrian, cek status
10. **Konsultasi** - Kirim pertanyaan ke tim JKN

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + Express
- **Prisma ORM** (SQLite)
- **Swagger UI** (API Documentation)
- USSD Session Engine
- API Shoot System (modular)

### Frontend (Mobile)
- **Expo Go** (React Native)
- Dialpad UI
- USSD Popup Modal
- Axios (HTTP Client)

---

## 📁 Struktur Proyek

```
JKNDIALSERVICE/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── swagger.js
│   │   ├── controllers/
│   │   │   └── ussdController.js
│   │   ├── routes/
│   │   │   ├── index.js
│   │   │   └── ussdRoutes.js
│   │   ├── services/
│   │   │   └── ussdEngine.js
│   │   └── index.js
│   ├── .env
│   └── package.json
│
└── mobile/
    ├── components/
    │   ├── Dialpad.js
    │   └── UssdPopup.js
    ├── services/
    │   └── ussdService.js
    ├── App.js
    ├── config.js
    ├── app.json
    └── package.json
```

---

## 🚀 Cara Menjalankan Proyek

### Prerequisites

- **Node.js** v16+ ([Download](https://nodejs.org))
- **npm** atau **yarn**
- **Expo Go** app di smartphone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Komputer dan smartphone terhubung ke **WiFi yang sama**

---

### 1️⃣ Setup Backend

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Jalankan migration database
npx prisma migrate dev --name init

# Seed database dengan data dummy
npm run prisma:seed

# Jalankan server
npm run dev
```

Server akan berjalan di:
- **Local**: `http://localhost:3000`
- **Network**: `http://0.0.0.0:3000`
- **API Docs**: `http://localhost:3000/api/docs`

#### Cek IP Komputer Anda

**Windows:**
```bash
ipconfig
```
Cari `IPv4 Address` di adapter WiFi (contoh: `192.168.1.100`)

**Mac/Linux:**
```bash
ifconfig
# atau
ip addr
```

---

### 2️⃣ Setup Mobile App

```bash
# Masuk ke folder mobile
cd mobile

# Install dependencies
npm install
```

#### ⚠️ PENTING: Update IP Backend

Edit file `mobile/config.js`:

```javascript
const API_BASE_URL = 'http://192.168.1.100:3000'; // GANTI dengan IP komputer Anda
```

#### Jalankan Expo

```bash
npm start
# atau
npx expo start
```

#### Scan QR Code

1. Buka **Expo Go** di smartphone
2. Scan QR code yang muncul di terminal/browser
3. Tunggu app loading
4. App siap digunakan!

---

## 📱 Cara Menggunakan App

1. Ketik `*354#` di dialpad
2. Tekan tombol **CALL**
3. Popup USSD akan muncul dengan menu utama
4. Pilih menu dengan mengetik angka (1-10)
5. Ikuti instruksi di setiap menu
6. Popup akan otomatis menutup jika menerima response `END`

### Contoh Flow

```
Dial: *354#
↓
Menu Utama
1. Info Kepesertaan
2. Tagihan & Iuran
...
↓
Input: 1
↓
Masukkan NIK: 3201234567890001
↓
Response:
Nama: Budi Santoso
Status: Aktif
Kelas: Kelas III
FKTP: Puskesmas Cibinong
```

---

## 🗄️ Database Dummy Data

Database di-seed dengan data contoh:

### Peserta
- **NIK**: `3201234567890001` - Budi Santoso (Aktif)
- **NIK**: `3201234567890002` - Siti Aminah (Aktif)
- **NIK**: `3201234567890003` - Ahmad Hidayat (NonAktif)
- **NIK**: `1671122812030001` - Zain Ahmad Fahrezi (Aktif)

### Faskes
- Puskesmas Cibinong (PKM-BGR-001)
- Puskesmas Ciawi (PKM-BGR-002)
- RS PMI Bogor (RS-BGR-001)
- RSUD Kota Bogor (RS-BGR-002)
- Klinik Pratama Sehat (KLN-BGR-001)
- Klinik Opina (KLN-OPI-001)

---

## 📚 API Documentation (Swagger)

Buka browser: `http://localhost:3000/api/docs`

### Endpoints

#### POST `/api/ussd`
**Request Body:**
```json
{
  "sessionId": "session_123456",
  "serviceCode": "*354#",
  "phoneNumber": "081234567890",
  "text": "1*3201234567890001"
}
```

**Response:**
```json
{
  "sessionId": "session_123456",
  "response": "END Nama: Budi Santoso\nStatus: Aktif\nKelas: Kelas III"
}
```

#### GET `/api/ussd/test`
Test endpoint untuk cek API status.

---

## 🔧 Troubleshooting

### 1. **Error: Cannot connect to server**

**Solusi:**
- Pastikan backend sudah running (`npm run dev`)
- Cek IP di `mobile/config.js` sudah benar
- Pastikan komputer dan smartphone terhubung WiFi yang sama
- Matikan firewall/antivirus yang block port 3000

### 2. **Prisma Error: Database not found**

**Solusi:**
```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
npm run prisma:seed
```

### 3. **Expo Error: Metro bundler failed**

**Solusi:**
```bash
cd mobile
rm -rf node_modules
npm install
npx expo start --clear
```

### 4. **USSD Popup tidak muncul**

**Solusi:**
- Check console di Expo untuk error message
- Pastikan input dimulai dengan `*` (USSD code)
- Cek network request di browser DevTools

---

## 🚀 Roadmap Implementasi USSD Operator

Untuk menjadikan ini USSD resmi:

### 1. **Daftarkan Shortcode ke Operator**
- Hubungi operator (Telkomsel, Indosat, XL)
- Ajukan shortcode `*354#`
- Kontrak & biaya bulanan

### 2. **Integrasi USSD Gateway**
- Gunakan USSD Gateway provider (Nexmo, Twilio, dll)
- Update backend untuk terima request dari gateway
- Format response sesuai spesifikasi operator

### 3. **Integrasi API JKN Resmi**
- Daftarkan aplikasi ke BPJS Kesehatan
- Dapatkan API Key & Secret
- Implementasi autentikasi OAuth2
- Ganti dummy data dengan API call real-time

### 4. **Security & Compliance**
- Implementasi SSL/TLS
- Enkripsi data sensitif (NIK, No HP)
- Audit logging
- Compliance dengan UU Perlindungan Data Pribadi

### 5. **Scalability**
- Deploy ke cloud (AWS, Azure, GCP)
- Load balancer
- Redis untuk session management
- Database migration ke PostgreSQL/MySQL

---

## 📝 Catatan Developer

### Session Management
- Session ID di-generate di client
- Backend stateless (tidak simpan session di memory)
- Session log tersimpan di database untuk tracking

### USSD Response Format
- `CON <message>` = Continue session (butuh input user)
- `END <message>` = End session (close popup)

### Input Format
- User input dipisahkan dengan `*`
- Contoh: `1*3201234567890001` = menu 1, NIK 3201234567890001

---

## 🤝 Kontribusi

Proyek ini adalah prototipe simulasi untuk tujuan pembelajaran dan development.

Untuk kontribusi:
1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## 📄 License

MIT License - Bebas digunakan untuk keperluan edukasi dan development.

---

## 📞 Support

Untuk pertanyaan dan issue:
- Buka **Issues** di GitHub repository
- Email: support@jkn.go.id (simulasi)

---

## ✅ Checklist Deployment

- [ ] Backend running di `http://0.0.0.0:3000`
- [ ] Database ter-seed dengan data dummy
- [ ] IP komputer sudah diupdate di `mobile/config.js`
- [ ] Komputer dan smartphone terhubung WiFi yang sama
- [ ] Expo Go terinstall di smartphone
- [ ] QR code berhasil di-scan
- [ ] App berjalan dan bisa dial `*354#`
- [ ] Popup USSD muncul dan responsif

---

**Selamat mencoba! 🎉**

*JKN Dial Service Simulator v1.0*
*Prototipe Simulasi USSD - Future-Ready untuk Operator & API JKN*
