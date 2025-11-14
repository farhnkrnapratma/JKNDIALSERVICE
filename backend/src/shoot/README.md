# API SHOOT SYSTEM

Modular API layer untuk integrasi dengan service eksternal.

## Overview

API Shoot System adalah layer abstraksi untuk:
- Integrasi dengan BPJS/JKN API resmi
- Integrasi dengan USSD Gateway operator
- Third-party services (SMS, Email, Payment, etc)

## Structure

```
backend/src/shoot/
├── jkn/
│   ├── kepesertaan.js
│   ├── tagihan.js
│   └── faskes.js
├── gateway/
│   └── ussdGateway.js
└── index.js
```

## Future Implementation

### 1. JKN API Integration

```javascript
// shoot/jkn/kepesertaan.js
const getKepesertaanFromJKN = async (nik) => {
  // TODO: Implement real JKN API call
  const response = await fetch('https://api.bpjs-kesehatan.go.id/kepesertaan', {
    headers: {
      'X-API-Key': process.env.JKN_API_KEY
    }
  });
  return response.json();
};
```

### 2. USSD Gateway Integration

```javascript
// shoot/gateway/ussdGateway.js
const sendToUSSDGateway = async (phoneNumber, message) => {
  // TODO: Implement USSD Gateway
  // Provider: Nexmo, Twilio, atau operator langsung
  const response = await fetch('https://ussd-gateway.operator.com/send', {
    method: 'POST',
    body: JSON.stringify({
      shortcode: '*354#',
      phoneNumber,
      message
    })
  });
  return response.json();
};
```

### 3. SMS Notification

```javascript
// shoot/notification/sms.js
const sendSMS = async (phoneNumber, message) => {
  // TODO: Implement SMS gateway
  // Provider: Twilio, Vonage, local SMS gateway
};
```

## Current Implementation

Saat ini menggunakan **dummy data** dari database lokal.

## Migration Path

1. **Phase 1 (Current):** Dummy data + Local database
2. **Phase 2:** Integrate JKN Mock API
3. **Phase 3:** Integrate JKN Production API
4. **Phase 4:** Integrate USSD Gateway operator
5. **Phase 5:** Full production with monitoring

## Configuration

```env
# .env
JKN_API_KEY=your_api_key
JKN_API_SECRET=your_api_secret
JKN_API_URL=https://api.bpjs-kesehatan.go.id

USSD_GATEWAY_URL=https://ussd-gateway.operator.com
USSD_GATEWAY_TOKEN=your_gateway_token
USSD_SHORTCODE=*354#
```

## Testing

Test API shoot with mock data:

```bash
npm test -- shoot/jkn
```

## Documentation

Full API Shoot documentation: `/api/docs`
