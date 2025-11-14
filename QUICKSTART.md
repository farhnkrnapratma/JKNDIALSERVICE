# 🚀 QUICK START - JKN USSD SIMULATOR

## 📱 Cara Cepat Menjalankan Aplikasi

### ⏱️ Total waktu: ~10 menit

---

## 1️⃣ BACKEND (Terminal 1)

```bash
# Masuk folder backend
cd backend

# Install (1x saja)
npm install

# Setup database (1x saja)
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed

# Jalankan server
npm run dev
```

✅ **Server jalan di:** `http://localhost:3000`
✅ **API Docs:** `http://localhost:3000/api/docs`

**JANGAN TUTUP TERMINAL INI!**

---

## 2️⃣ CEK IP KOMPUTER (Terminal 2)

**Windows:**
```bash
ipconfig
```
👉 Cari `IPv4 Address` → Contoh: `192.168.1.100`

**Mac/Linux:**
```bash
ifconfig
```
👉 Cari IP `192.168.x.x`

**CATAT IP INI!**

---

## 3️⃣ UPDATE CONFIG MOBILE

Buka file: `mobile/config.js`

```javascript
// GANTI IP INI!
const API_BASE_URL = 'http://192.168.1.100:3000';
```

**SAVE FILE!**

---

## 4️⃣ MOBILE APP (Terminal 3)

```bash
# Masuk folder mobile
cd mobile

# Install (1x saja)
npm install

# Jalankan Expo
npm start
```

✅ **QR Code muncul di terminal/browser**

---

## 5️⃣ SCAN QR CODE

1. Download **Expo Go** di smartphone:
   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS](https://apps.apple.com/app/expo-go/id982107779)

2. Buka **Expo Go** app

3. Scan **QR Code** yang muncul di terminal

4. Tunggu app loading (pertama kali ~30 detik)

---

## 6️⃣ TEST APLIKASI

1. Ketik: `*354#`
2. Tekan: **CALL** (tombol hijau)
3. Popup USSD muncul
4. Pilih menu: `1`
5. Masukkan NIK: `3201234567890001`
6. Data peserta muncul! ✅

---

## 🎯 Test Data

### NIK Peserta
- `3201234567890001` (Budi Santoso - Aktif)
- `3201234567890002` (Siti Aminah - Aktif)
- `3201234567890003` (Ahmad Hidayat - NonAktif)
- `1671122812030001` (Zain Ahmad Fahrezi - Aktif)

### Kode Faskes
- `PKM-BGR-001` (Puskesmas Cibinong)
- `PKM-BGR-002` (Puskesmas Ciawi)
- `RS-BGR-001` (RS PMI Bogor)
- `KLN-OPI-001` (Klinik Opina)

---

## 🐛 Troubleshooting Cepat

### "Cannot connect to server"

**Cek 1:** Backend running?
```bash
curl http://localhost:3000/health
```
Harus keluar JSON.

**Cek 2:** IP benar?
- Buka browser di smartphone
- Ketik: `http://192.168.1.100:3000` (ganti IP Anda)
- Harus keluar JSON

**Cek 3:** WiFi sama?
- Komputer dan smartphone HARUS WiFi yang sama!

**Cek 4:** Firewall?
- Windows: Matikan firewall sementara
- Mac: System Preferences → Firewall → Off

---

### "Prisma error"

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

---

### "Expo error"

```bash
cd mobile
rm -rf node_modules
npm install
npx expo start --clear
```

---

## 📚 Dokumentasi Lengkap

Baca file-file ini untuk detail:

- **README.md** - Overview proyek
- **INSTALLATION.md** - Panduan lengkap instalasi
- **API_EXAMPLES.md** - Contoh API request
- **DEPLOYMENT.md** - Deploy ke production
- **PROJECT_COMPLETE.md** - Checklist lengkap

---

## 🎓 Video Tutorial

### Backend Setup (5 menit)
1. Install dependencies
2. Setup database
3. Seed data
4. Run server

### Mobile Setup (3 menit)
1. Install dependencies
2. Update IP config
3. Run Expo
4. Scan QR

### Testing (2 menit)
1. Dial `*354#`
2. Test semua menu
3. Check responses

---

## ✅ Checklist Sukses

- [ ] Backend running tanpa error
- [ ] Browser bisa buka `http://localhost:3000`
- [ ] IP komputer sudah dicatat
- [ ] File `mobile/config.js` sudah diupdate
- [ ] Expo Go terinstall di smartphone
- [ ] QR code berhasil di-scan
- [ ] App terbuka di smartphone
- [ ] Dial `*354#` → popup muncul
- [ ] Input NIK → data muncul

**Semua ✅ = SUKSES! 🎉**

---

## 🏆 Flow Testing

### Test 1: Info Kepesertaan
```
*354# → Call → 1 → 3201234567890001 → Data muncul
```

### Test 2: Tagihan
```
*354# → Call → 2 → 3201234567890001 → Tagihan muncul
```

### Test 3: Riwayat
```
*354# → Call → 3 → 3201234567890001 → Riwayat muncul
```

### Test 4: Info Faskes
```
*354# → Call → 4 → 1 → Daftar FKTP muncul
```

### Test 5: Pendaftaran Baru
```
*354# → Call → 8 → [NIK] → [KK] → [Nama] → [Domisili] → 1 → Berhasil
```

---

## 💡 Tips

1. **Backend error?** Lihat terminal backend untuk error message
2. **Mobile error?** Shake smartphone → Show Dev Menu → Reload
3. **Stuck?** Restart backend: Ctrl+C → `npm run dev`
4. **Database issue?** `npx prisma studio` untuk lihat data

---

## 📞 Need Help?

1. Baca error message di terminal
2. Check `INSTALLATION.md` untuk troubleshooting detail
3. Test backend dengan curl/browser
4. Pastikan WiFi sama
5. Restart semua (backend + Expo)

---

## 🎉 SUCCESS!

Jika semua berjalan lancar:

✅ Backend API running
✅ Mobile app loaded
✅ USSD popup works
✅ Data dari database muncul

**SELAMAT! Proyek berhasil! 🚀**

---

**Next Steps:**
- Explore semua 10 menu
- Lihat API Docs: `http://localhost:3000/api/docs`
- Buka Prisma Studio: `npx prisma studio` di folder backend
- Custom logic di `backend/src/services/ussdEngine.js`
- Custom UI di `mobile/App.js`

---

*JKN Dial Service Simulator*
*Prototipe Simulasi USSD via WiFi*
*Bukan USSD Operator Sesungguhnya*
