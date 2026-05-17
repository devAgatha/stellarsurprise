# StellarSurprise Architecture

## Flow

```
User creates gift → Paystack/Stripe payment → USDC locked in Soroban escrow
                                                      │
                                              Cron job checks unlock_at
                                                      │
                                              Gift status → "unlocked"
                                                      │
                                              Recipient claims → USDC sent
```

## Components

- **Next.js App** — frontend + API routes
- **gift.service** — CRUD for gifts in PostgreSQL
- **claim.service** — verifies unlock time, triggers USDC transfer
- **scheduler** — cron job that flips `locked` → `unlocked`
- **Soroban escrow** — on-chain time-lock record (1 gift = 1 contract entry)
- **PostgreSQL** — off-chain gift metadata
- **Redis** — OTP cache, job queue

## API Routes

| Method | Path | Description |
|---|---|---|
| GET | `/api/gifts` | List sender's gifts |
| POST | `/api/gifts` | Create a gift |
| GET | `/api/gifts/:id` | Get gift details |
| POST | `/api/gifts/:id/claim` | Claim an unlocked gift |
| POST | `/api/payments/paystack` | Paystack webhook |
| POST | `/api/cron/unlock` | Unlock scheduler (cron) |
