# Payment Failure Investigation Backend

Initial Express.js + TypeScript backend for the payment-failure investigation agent.

## Folder Structure

- `src/app.ts`: Express application setup and middleware configuration.
- `src/server.ts`: Server entry point, loading env vars and starting the HTTP server.
- `src/routes/`: Route definitions connecting HTTP endpoints to controllers.
- `src/controllers/`: Controllers handling HTTP request validation and response mapping.
- `src/services/`: Business logic, containing placeholders for the future Agent integration.

## How to Install

```bash
npm install
```

## How to Run Locally

For development (uses `tsx` for hot-reloading/direct execution):
```bash
npm run dev
```

To build for production:
```bash
npm run build
```

To start production build:
```bash
npm start
```

## How to Test

### 1. Health Check
```bash
curl http://localhost:5000/health
```
Expected output:
```json
{"success":true,"status":"ok"}
```

### 2. Start Investigation
```bash
curl -X POST http://localhost:5000/api/investigations \
  -H "Content-Type: application/json" \
  -d '{"transactionId": "TXN-1001"}'
```
Expected output:
```json
{"success":true,"transactionId":"TXN-1001","message":"Investigation request received"}
```
