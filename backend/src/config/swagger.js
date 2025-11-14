const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'JKN USSD Simulator API',
      version: '1.0.0',
      description: `
# JKN Dial Service Simulator API

Backend API untuk simulasi USSD JKN Mobile.

## ⚠️ PENTING - Prototipe Simulasi

Ini adalah **prototipe simulasi USSD** yang berjalan melalui WiFi/HTTP.
- Dial *354# hanya memicu request ke server backend internal
- Untuk implementasi USSD resmi, kode harus didaftarkan ke operator seluler melalui USSD Gateway
- Saat ini sistem tidak terhubung dengan USSD operator sesungguhnya

## Fitur

- ✅ Info Kepesertaan
- ✅ Tagihan & Iuran  
- ✅ Riwayat Pelayanan
- ✅ Info Faskes
- ✅ Perubahan Data
- ✅ Pengaduan
- ✅ SOS
- ✅ Daftar Peserta Baru
- ✅ Antrian Faskes
- ✅ Konsultasi

## Tech Stack

- Node.js + Express
- Prisma ORM
- SQLite Database
- Swagger Documentation
      `,
      contact: {
        name: 'API Support',
        email: 'support@jkn.go.id'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'http://{LOCAL_IP}:3000',
        description: 'WiFi Local Network (for Expo Go)',
        variables: {
          LOCAL_IP: {
            default: '192.168.1.100',
            description: 'Your computer local IP address'
          }
        }
      }
    ],
    tags: [
      {
        name: 'USSD',
        description: 'USSD endpoints'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
