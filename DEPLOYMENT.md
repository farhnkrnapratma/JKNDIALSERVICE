# 🚀 DEPLOYMENT GUIDE

Panduan deployment untuk production.

## ⚠️ CATATAN

Deployment ini untuk **backend API** dan **database**.
Mobile app tetap menggunakan **Expo Go** (tidak perlu deploy).

---

## 🎯 Deployment Options

### Option 1: VPS (DigitalOcean, AWS EC2, Azure VM)

Cocok untuk: Full control, custom configuration

### Option 2: Platform-as-a-Service (Heroku, Railway, Render)

Cocok untuk: Quick deployment, minimal configuration

### Option 3: Serverless (AWS Lambda, Vercel, Netlify Functions)

Cocok untuk: Auto-scaling, pay-per-use

---

## 📦 Option 1: VPS Deployment

### Prerequisites
- Ubuntu 20.04+ server
- Domain name (optional)
- SSH access

### Step 1: Setup Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 16+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Install certbot (SSL)
sudo apt install -y certbot python3-certbot-nginx
```

### Step 2: Clone & Setup

```bash
# Clone project
git clone <your-repo-url>
cd JKNDIALSERVICE/backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
nano .env
```

Edit `.env`:
```env
DATABASE_URL="file:./prod.db"
PORT=3000
NODE_ENV=production
```

### Step 3: Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database
npm run prisma:seed
```

### Step 4: Start with PM2

```bash
# Start app
pm2 start src/index.js --name jkn-ussd

# Save PM2 config
pm2 save

# Auto-start on reboot
pm2 startup
```

### Step 5: Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/jkn-ussd
```

Add:
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

Enable:
```bash
sudo ln -s /etc/nginx/sites-available/jkn-ussd /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: SSL Certificate

```bash
sudo certbot --nginx -d your-domain.com
```

### Step 7: Update Mobile Config

Edit `mobile/config.js`:
```javascript
const API_BASE_URL = 'https://your-domain.com';
```

---

## 📦 Option 2: Railway Deployment

### Step 1: Prepare Project

Create `Procfile`:
```
web: npm start
```

Create `railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Step 2: Deploy

1. Push code ke GitHub
2. Go to https://railway.app
3. New Project → Deploy from GitHub
4. Select repository
5. Add environment variables:
   ```
   DATABASE_URL=file:./prod.db
   PORT=3000
   NODE_ENV=production
   ```
6. Deploy

### Step 3: Get URL

Railway akan generate URL: `https://jkn-ussd-production.up.railway.app`

Update `mobile/config.js` dengan URL tersebut.

---

## 📦 Option 3: Heroku Deployment

### Step 1: Install Heroku CLI

```bash
npm install -g heroku
heroku login
```

### Step 2: Create Heroku App

```bash
cd backend
heroku create jkn-ussd-api
```

### Step 3: Add Buildpack

```bash
heroku buildpacks:set heroku/nodejs
```

### Step 4: Setup Database

Heroku tidak support SQLite di production. Migrate ke PostgreSQL:

```bash
# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Update prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# Install PostgreSQL client
npm install pg
```

### Step 5: Deploy

```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy

# Seed database
heroku run npm run prisma:seed
```

### Step 6: Get URL

```bash
heroku open
```

---

## 🔒 Security Checklist

- [ ] Use HTTPS (SSL certificate)
- [ ] Set strong JWT secret
- [ ] Enable rate limiting
- [ ] Validate all inputs
- [ ] Sanitize SQL queries (Prisma does this)
- [ ] Use environment variables for secrets
- [ ] Enable CORS properly
- [ ] Setup firewall rules
- [ ] Regular security updates
- [ ] Backup database regularly

### Rate Limiting

Install:
```bash
npm install express-rate-limit
```

Add to `src/index.js`:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 📊 Monitoring

### PM2 Monitoring

```bash
# View logs
pm2 logs jkn-ussd

# Monitor CPU/Memory
pm2 monit

# View status
pm2 status
```

### Setup Logging

Install Winston:
```bash
npm install winston
```

Add logger:
```javascript
// src/config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

module.exports = logger;
```

---

## 🔄 Backup Strategy

### Database Backup

```bash
# Manual backup
cp backend/dev.db backend/backups/backup-$(date +%Y%m%d).db

# Automated backup (cron)
crontab -e
```

Add:
```
0 2 * * * cd /path/to/backend && cp dev.db backups/backup-$(date +\%Y\%m\%d).db
```

### Cloud Backup

Setup S3/Cloud Storage for automated backups.

---

## 📱 Mobile App Update

After backend deployed, update mobile app:

1. Edit `mobile/config.js`:
   ```javascript
   const API_BASE_URL = 'https://your-production-url.com';
   ```

2. Republish ke Expo:
   ```bash
   cd mobile
   npx expo publish
   ```

3. Users akan auto-update saat buka app.

---

## ✅ Pre-Launch Checklist

Backend:
- [ ] All endpoints tested
- [ ] Database migrated & seeded
- [ ] SSL certificate active
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Backup strategy setup
- [ ] PM2/Process manager running
- [ ] Environment variables set

Mobile:
- [ ] API URL updated to production
- [ ] Error handling tested
- [ ] Loading states work
- [ ] Network errors handled
- [ ] Published to Expo

Documentation:
- [ ] API docs accessible
- [ ] README updated
- [ ] Deployment docs complete

---

## 🐛 Debugging Production Issues

### Check Logs

```bash
# PM2 logs
pm2 logs jkn-ussd --lines 100

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Test API

```bash
# Health check
curl https://your-domain.com/health

# USSD test
curl -X POST https://your-domain.com/api/ussd \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","text":""}'
```

### Database Check

```bash
# Connect to production
cd backend
npx prisma studio
```

---

## 📈 Scaling

### Horizontal Scaling

Use load balancer with multiple instances:

```
┌─────────────┐
│Load Balancer│
└──────┬──────┘
       │
   ┌───┴───┐
   │       │
┌──▼──┐ ┌──▼──┐
│App 1│ │App 2│
└──┬──┘ └──┬──┘
   │       │
   └───┬───┘
       │
  ┌────▼────┐
  │Database │
  └─────────┘
```

### Vertical Scaling

Upgrade server resources:
- More CPU cores
- More RAM
- Faster SSD

---

## 🌐 CDN & Performance

### Use CDN for API

- Cloudflare
- AWS CloudFront
- Fastly

### Caching Strategy

```javascript
// Add Redis caching
const redis = require('redis');
const client = redis.createClient();

// Cache USSD responses
app.use('/api/ussd', async (req, res, next) => {
  const key = `ussd:${req.body.sessionId}`;
  const cached = await client.get(key);
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  next();
});
```

---

## 📞 Support

Production issues? Check:
1. Server logs
2. Database connection
3. Network/Firewall
4. SSL certificate expiry
5. Disk space

---

**Good luck with deployment! 🚀**
