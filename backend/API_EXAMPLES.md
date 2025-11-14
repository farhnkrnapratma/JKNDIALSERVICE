# API Examples

Contoh request dan response untuk testing.

## 1. Main Menu (Empty Input)

**Request:**
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

**Response:**
```json
{
  "sessionId": "session_001",
  "response": "CON Selamat datang di JKN Mobile\n1. Info Kepesertaan\n2. Tagihan & Iuran\n3. Riwayat Pelayanan\n4. Info Faskes\n5. Perubahan Data\n6. Pengaduan\n7. SOS\n8. Daftar Peserta Baru\n9. Antrian Faskes\n10. Konsultasi\n0. Keluar"
}
```

---

## 2. Info Kepesertaan

**Request (Menu 1):**
```bash
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_001",
    "serviceCode": "*354#",
    "phoneNumber": "081234567890",
    "text": "1"
  }'
```

**Response:**
```json
{
  "sessionId": "session_001",
  "response": "CON Info Kepesertaan\nMasukkan NIK Anda:"
}
```

**Request (Input NIK):**
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

**Response:**
```json
{
  "sessionId": "session_001",
  "response": "END Info Kepesertaan\nNama: Budi Santoso\nNIK: 3201234567890001\nStatus: Aktif\nKelas: Kelas III\nFKTP: Puskesmas Cibinong\nNo. HP: 081234567890"
}
```

---

## 3. Tagihan & Iuran

**Request:**
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

**Response:**
```json
{
  "sessionId": "session_002",
  "response": "END Tagihan Budi Santoso\nBulan: 2025-01\nIuran: Rp 42,000\nTunggakan: Rp 0\nDenda: Rp 0\nTotal: Rp 42,000"
}
```

---

## 4. Riwayat Pelayanan

**Request:**
```bash
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_003",
    "serviceCode": "*354#",
    "phoneNumber": "081234567890",
    "text": "3*3201234567890001"
  }'
```

**Response:**
```json
{
  "sessionId": "session_003",
  "response": "END Riwayat Pelayanan:\n\n1. 2025-01-10\nFKTP - Puskesmas Cibinong\nPemeriksaan kesehatan umum\n\n2. 2024-12-15\nRujukan - RS PMI Bogor\nRujukan ke RS untuk pemeriksaan lanjutan\n\n"
}
```

---

## 5. Info Faskes

**Request (Pilih FKTP):**
```bash
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_004",
    "serviceCode": "*354#",
    "phoneNumber": "081234567890",
    "text": "4*1"
  }'
```

**Response:**
```json
{
  "sessionId": "session_004",
  "response": "END Daftar FKTP:\n\n1. Puskesmas Cibinong\nJl. Tegar Beriman No. 1\nTelp: 021-87654321\n\n2. Puskesmas Ciawi\nJl. Raya Ciawi No. 100\nTelp: 0251-123456\n\n"
}
```

---

## 6. Pengaduan

**Request:**
```bash
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_005",
    "serviceCode": "*354#",
    "phoneNumber": "081234567890",
    "text": "6*Pelayanan di puskesmas sangat lambat"
  }'
```

**Response:**
```json
{
  "sessionId": "session_005",
  "response": "END Pengaduan Anda telah diterima.\nNomor tiket akan dikirim via SMS.\nTerima kasih."
}
```

---

## 7. SOS

**Request:**
```bash
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_006",
    "serviceCode": "*354#",
    "phoneNumber": "081234567890",
    "text": "7*1"
  }'
```

**Response:**
```json
{
  "sessionId": "session_006",
  "response": "END Nomor Darurat JKN:\nCall Center: 1500-400\nAmbulans: 119\nIGD Terdekat: 118\n\nTetap tenang dan ikuti instruksi petugas."
}
```

---

## 8. Daftar Peserta Baru

**Request (Full Flow):**
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

**Response:**
```json
{
  "sessionId": "session_007",
  "response": "END Prapendaftaran berhasil!\nNIK: 3201234567890999\nNama: John Doe\n\nLengkapi dokumen di kantor BPJS terdekat dalam 14 hari."
}
```

---

## 9. Antrian Faskes

**Request (Ambil Antrian):**
```bash
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_008",
    "serviceCode": "*354#",
    "phoneNumber": "081234567890",
    "text": "9*1*1*3201234567890001"
  }'
```

**Response:**
```json
{
  "sessionId": "session_008",
  "response": "END Nomor antrian berhasil diambil!\nPuskesmas Cibinong\nNo. Antrian: A042\nTanggal: 2025-01-15\nEstimasi: 30 menit\n\nHarap datang tepat waktu."
}
```

---

## 10. Konsultasi

**Request:**
```bash
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_009",
    "serviceCode": "*354#",
    "phoneNumber": "081234567890",
    "text": "10*Bagaimana cara mengajukan klaim rawat inap?"
  }'
```

**Response:**
```json
{
  "sessionId": "session_009",
  "response": "END Pertanyaan Anda telah diterima.\nTim JKN akan menjawab melalui SMS dalam 1x24 jam.\nTerima kasih."
}
```

---

## Postman Collection

Import ke Postman untuk testing:

1. Buka Postman
2. Import → Raw text
3. Copy-paste salah satu request di atas
4. Save as collection
5. Test semua endpoints

## Testing Script

Atau gunakan script bash:

```bash
#!/bin/bash
# test_ussd.sh

BASE_URL="http://localhost:3000/api/ussd"

# Test 1: Main Menu
echo "Test 1: Main Menu"
curl -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test1","text":""}' | jq

# Test 2: Info Kepesertaan
echo "\nTest 2: Info Kepesertaan"
curl -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test2","text":"1*3201234567890001"}' | jq

# Add more tests...
```

Run:
```bash
chmod +x test_ussd.sh
./test_ussd.sh
```
