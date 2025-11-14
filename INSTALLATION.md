# 🚀 PANDUAN LENGKAP - JKN USSD SIMULATOR

## 📋 Checklist Pre-Flight

Sebelum memulai, pastikan:

- [ ] Node.js v16+ terinstall
- [ ] npm atau yarn terinstall
- [ ] Expo Go app terinstall di smartphone
- [ ] Komputer dan smartphone terhubung WiFi yang sama
- [ ] Text editor (VS Code recommended)

---

## 🎯 Step-by-Step Installation

### STEP 1: Clone/Download Project

```bash
# Jika dari Git
git clone <repository-url>
cd JKNDIALSERVICE

# Atau extract ZIP ke folder JKNDIALSERVICE
```

### STEP 2: Setup Backend

```bash
# 1. Masuk ke folder backend
cd backend

# 2. Install dependencies (tunggu sampai selesai)
npm install

# 3. Generate Prisma Client
npx prisma generate

# 4. Buat database dan tabel
npx prisma migrate dev --name init

# 5. Isi database dengan data dummy
npm run prisma:seed

# Output yang diharapkan:
# ✅ Database seeded successfully!
```

### STEP 3: Jalankan Backend

```bash
# Masih di folder backend
npm run dev

# Output yang diharapkan:
# 🚀 JKN USSD Backend Server Started!
# 📍 Local: http://localhost:3000
# 📍 Network: http://0.0.0.0:3000
# 📚 API Docs: http://localhost:3000/api/docs
```

**JANGAN TUTUP TERMINAL INI!** Backend harus tetap running.

### STEP 4: Cek IP Komputer

Buka terminal BARU (jangan tutup yang backend):

**Windows:**
```bash
ipconfig
```
Cari `IPv4 Address` di WiFi adapter, contoh: `192.168.1.100`

**Mac/Linux:**
```bash
ifconfig
# atau
ip addr
```
Cari IP yang dimulai `192.168.x.x` atau `10.0.x.x`

**CATAT IP INI!** Contoh: `192.168.1.100`

### STEP 5: Setup Mobile App

```bash
# Di terminal baru, masuk ke folder mobile
cd mobile

# Install dependencies
npm install

# Tunggu sampai selesai...
```

### STEP 6: Update IP Backend

Buka file `mobile/config.js` dengan text editor:

```javascript
// GANTI IP INI dengan IP komputer Anda dari Step 4
const API_BASE_URL = 'http://192.168.1.100:3000';
```

**Contoh:**
- Jika IP Anda `192.168.43.1`, ganti jadi `http://192.168.43.1:3000`
- Jika IP Anda `10.0.0.5`, ganti jadi `http://10.0.0.5:3000`

**SAVE FILE!**

### STEP 7: Jalankan Expo

```bash
# Masih di folder mobile
npm start

# Atau
npx expo start
```

Browser akan terbuka otomatis dengan QR code.

### STEP 8: Scan QR Code

1. Buka **Expo Go** di smartphone
2. **Android:** Tekan "Scan QR Code" di tab Projects
3. **iOS:** Buka Camera app, scan QR code
4. Tunggu app loading (pertama kali agak lama)

### STEP 9: Testing

1. App terbuka di smartphone
2. Ketik `*354#` di dialpad
3. Tekan tombol **CALL**
4. Popup USSD muncul dengan menu JKN
5. Pilih menu `1` (Info Kepesertaan)
6. Masukkan NIK: `3201234567890001`
7. Data peserta muncul ✅

---

## 🧪 Test Data

### NIK Peserta untuk Testing

| NIK | Nama | Status |
|-----|------|--------|
| `3201234567890001` | Budi Santoso | Aktif |
| `3201234567890002` | Siti Aminah | Aktif |
| `3201234567890003` | Ahmad Hidayat | NonAktif |

### Kode Faskes

| Kode | Nama |
|------|------|
| `PKM-BGR-001` | Puskesmas Cibinong |
| `PKM-BGR-002` | Puskesmas Ciawi |
| `RS-BGR-001` | RS PMI Bogor |

---

## 🔧 Troubleshooting

### Problem 1: "Cannot connect to server"

**Penyebab:**
- Backend tidak running
- IP salah di config.js
- WiFi berbeda
- Firewall block port 3000

**Solusi:**

1. **Cek backend running:**
   ```bash
   # Lihat terminal backend, harus ada:
   # 🚀 JKN USSD Backend Server Started!
   ```

2. **Test backend dari browser:**
   ```
   Buka: http://localhost:3000
   Harus muncul JSON response
   ```

3. **Test backend dari smartphone:**
   ```
   Buka browser di smartphone
   Ketik: http://192.168.1.100:3000 (ganti dengan IP Anda)
   Harus muncul JSON response
   ```
   
   Jika tidak muncul → **IP salah atau firewall block**

4. **Matikan Firewall (sementara):**
   - Windows: Settings → Firewall → Turn off
   - Mac: System Preferences → Security → Firewall → Off
   - Jangan lupa nyalakan lagi setelah testing

### Problem 2: "Prisma Client not generated"

**Solusi:**
```bash
cd backend
npx prisma generate
npm run dev
```

### Problem 3: "Database not found"

**Solusi:**
```bash
cd backend
npx prisma migrate dev --name init
npm run prisma:seed
```

### Problem 4: Expo QR Code tidak bisa di-scan

**Solusi:**

1. **Pastikan di WiFi yang sama:**
   - Cek WiFi di komputer
   - Cek WiFi di smartphone
   - Harus nama WiFi yang sama!

2. **Gunakan Tunnel:**
   ```bash
   npx expo start --tunnel
   ```
   Scan QR code yang baru

3. **Manual URL:**
   - Di Expo Go, tekan "Enter URL manually"
   - Ketik: `exp://192.168.1.100:8081` (ganti IP)

### Problem 5: App crash / blank screen

**Solusi:**
```bash
cd mobile

# Clear cache
npx expo start --clear

# Atau reinstall
rm -rf node_modules
npm install
npx expo start
```

---

## 📊 Architecture Flow

```
┌─────────────┐         WiFi         ┌─────────────┐
│             │ ◄─────────────────► │             │
│  Smartphone │    HTTP Request     │  Backend    │
│  (Expo Go)  │                     │  (Node.js)  │
│             │ ◄─────────────────► │             │
└─────────────┘   JSON Response     └─────────────┘
                                           │
                                           ▼
                                    ┌─────────────┐
                                    │   SQLite    │
                                    │  Database   │
                                    └─────────────┘
```

---

## 🎬 Demo Flow

### Scenario 1: Cek Info Kepesertaan

1. Dial: `*354#` → Call
2. Pilih: `1` (Info Kepesertaan)
3. Input NIK: `3201234567890001`
4. Result: Data Budi Santoso muncul

### Scenario 2: Cek Tagihan

1. Dial: `*354#` → Call
2. Pilih: `2` (Tagihan & Iuran)
3. Input NIK: `3201234567890001`
4. Result: Tagihan bulan ini + tunggakan

### Scenario 3: Daftar Peserta Baru

1. Dial: `*354#` → Call
2. Pilih: `8` (Daftar Peserta Baru)
3. Input NIK: `3201234567890999`
4. Input KK: `3201012345678999`
5. Input Nama: `John Doe`
6. Input Domisili: `Bogor`
7. Pilih FKTP: `1`
8. Result: Prapendaftaran berhasil

---

## 📱 Screenshot Checklist

Untuk memastikan app berjalan:

- [ ] Dialpad muncul dengan angka 0-9, *, #
- [ ] Input text field ada di atas dialpad
- [ ] Header "JKN USSD Simulator" terlihat
- [ ] Tombol Call berwarna hijau
- [ ] Dial `*354#` → Popup USSD muncul
- [ ] Menu 1-10 terlihat di popup
- [ ] Input menu → Response muncul
- [ ] Tombol Cancel/Send berfungsi

---

## 🌐 Network Debugging

### Test Koneksi Backend

**Dari komputer:**
```bash
# Test dengan curl
curl http://localhost:3000/health

# Expected output:
# {"status":"OK","timestamp":"...","service":"JKN USSD Backend"}
```

**Dari smartphone browser:**
```
http://192.168.1.100:3000/health
```
Harus muncul JSON yang sama.

### Test USSD Endpoint

```bash
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test123",
    "serviceCode": "*354#",
    "phoneNumber": "081234567890",
    "text": ""
  }'

# Expected output:
# {"sessionId":"test123","response":"CON Selamat datang di JKN Mobile\n1. Info Kepesertaan\n..."}
```

---

## 🎓 Learning Resources

### Video Tutorial (Soon)
- [ ] Part 1: Setup & Installation
- [ ] Part 2: Backend Deep Dive
- [ ] Part 3: Mobile App Development
- [ ] Part 4: USSD Logic Engine
- [ ] Part 5: Deployment & Production

### Documentation
- Prisma: https://www.prisma.io/docs
- Express: https://expressjs.com
- Expo: https://docs.expo.dev
- React Native: https://reactnative.dev

---

## 🚀 Next Steps

Setelah berhasil running:

1. **Explore API Docs:** http://localhost:3000/api/docs
2. **Coba semua menu USSD** (1-10)
3. **Lihat database:** `npm run prisma:studio` di backend
4. **Custom backend logic:** Edit `src/services/ussdEngine.js`
5. **Custom UI:** Edit `mobile/App.js` dan components

---

## 📞 Support

Jika masih ada masalah:

1. **Baca error message** di terminal backend
2. **Baca error message** di Expo console (smartphone)
3. **Check WiFi** (komputer dan smartphone sama)
4. **Check IP** di config.js
5. **Restart backend** (Ctrl+C, npm run dev lagi)
6. **Restart Expo** (Ctrl+C, npm start lagi)

---

## ✅ Success Indicators

App berhasil jika:

✅ Backend running tanpa error
✅ Swagger docs accessible
✅ Expo QR berhasil di-scan
✅ App terbuka di smartphone
✅ Dial `*354#` → Popup muncul
✅ Input menu → Response sesuai
✅ Database bisa dilihat di Prisma Studio

---

**Happy Coding! 🎉**

*JKN Dial Service Simulator*
*Developed with ❤️ for Indonesian Healthcare*
