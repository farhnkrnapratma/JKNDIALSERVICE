# Backend README

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npm run prisma:seed
```

### 3. Run Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Available Scripts

- `npm start` - Run server
- `npm run dev` - Run with nodemon (auto-reload)
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with dummy data
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Environment Variables

Create `.env` file:

```env
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
```

## Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check
- `POST /api/ussd` - Main USSD endpoint
- `GET /api/ussd/test` - Test endpoint
- `GET /api/docs` - Swagger documentation

## Database Schema

### Models
- `UserSession` - Track user sessions
- `UssdMenuLog` - Log USSD interactions
- `Peserta` - JKN participants data
- `Tagihan` - Billing information
- `Riwayat` - Service history
- `Faskes` - Health facilities
- `Antrian` - Queue management
- `Pengaduan` - Complaints
- `Konsultasi` - Consultations
- `PendaftaranBaru` - New registrations

## Testing

Test USSD endpoint with curl:

```bash
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test123",
    "serviceCode": "*354#",
    "phoneNumber": "081234567890",
    "text": ""
  }'
```

## Prisma Studio

View and edit database:

```bash
npm run prisma:studio
```

Open browser: http://localhost:5555
