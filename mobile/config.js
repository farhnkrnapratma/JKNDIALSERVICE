// ⚠️ GANTI DENGAN IP LOKAL KOMPUTER ANDA
// Cari IP dengan: ipconfig (Windows) atau ifconfig (Mac/Linux)
// Contoh: 192.168.1.100

const API_BASE_URL = 'http://192.168.1.92:3000';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  USSD_ENDPOINT: `${API_BASE_URL}/api/ussd`,
  TIMEOUT: 10000
};

export const USSD_SERVICE_CODE = '*354#';
