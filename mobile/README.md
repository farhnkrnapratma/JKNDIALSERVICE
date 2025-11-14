# Mobile App README

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Backend URL

**⚠️ PENTING:** Edit `config.js` dan ganti IP dengan IP komputer Anda.

Cari IP komputer:
- Windows: `ipconfig`
- Mac/Linux: `ifconfig`

```javascript
// config.js
const API_BASE_URL = 'http://192.168.1.100:3000'; // GANTI DENGAN IP ANDA
```

### 3. Run Expo

```bash
npm start
```

### 4. Open in Expo Go

1. Install **Expo Go** di smartphone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
2. Scan QR code yang muncul
3. App akan loading di smartphone

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Open in Android emulator
- `npm run ios` - Open in iOS simulator
- `npm run web` - Open in web browser

## Components

### Dialpad.js
Komponen dialpad dengan tombol 0-9, *, #, Call, Backspace

### UssdPopup.js
Modal popup USSD yang menampilkan response CON/END

## Services

### ussdService.js
- `generateSessionId()` - Generate unique session ID
- `sendUssdRequest()` - Send HTTP request ke backend
- `parseUssdResponse()` - Parse response CON/END

## Usage

1. Ketik `*354#` di dialpad
2. Tekan **CALL**
3. Popup USSD muncul
4. Pilih menu dengan angka
5. Input data sesuai instruksi

## Troubleshooting

### Cannot connect to server

1. Pastikan backend running
2. Cek IP di `config.js`
3. Pastikan WiFi sama dengan komputer
4. Matikan firewall yang block port 3000

### App crashes

```bash
# Clear cache
npx expo start --clear

# Reinstall dependencies
rm -rf node_modules
npm install
```

## Network Requirements

- Smartphone dan komputer harus di **WiFi yang sama**
- Backend harus accessible dari smartphone
- Firewall tidak memblock port 3000
