# StellarSurprise 🎁

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Build](https://github.com/yourorg/stellarsurprise/actions/workflows/ci.yml/badge.svg)](https://github.com/yourorg/stellarsurprise/actions/workflows/ci.yml)
[![Stellar](https://img.shields.io/badge/Stellar-Testnet-blue)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Soroban-Smart%20Contracts-purple)](https://soroban.stellar.org)

**StellarSurprise** is a full-stack gifting platform that enables users to send cash gifts that remain completely hidden until a predetermined unlock date and time. Built on the Stellar blockchain, StellarSurprise transforms digital money transfers into memorable surprise experiences.

---

## What is StellarSurprise?

Send money that stays completely hidden until a surprise unlock date. Perfect for:
- Birthdays, anniversaries, and holidays where surprise is key
- Valentine's Day, graduations, and surprise celebrations
- Any occasion where the timing of the gift matters as much as the gift itself

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js App                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Public Pages│  │  API Routes  │  │  Server Services │  │
│  │  /send       │  │  /api/gifts  │  │  gift.service    │  │
│  │  /dashboard  │  │  /api/auth   │  │  claim.service   │  │
│  │  /auth/login │  │  /api/cron   │  │  scheduler       │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
   Paystack / Stripe    PostgreSQL DB         Stellar Network
   (fiat on-ramp)       (gift records)        (USDC + Soroban)
                                                    │
                                          ┌─────────────────┐
                                          │  Escrow Contract │
                                          │  (Soroban/Rust)  │
                                          │  Time-locked USDC│
                                          └─────────────────┘
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Next.js Route Handlers, server services |
| Blockchain | Stellar, Soroban smart contracts (Rust) |
| Stablecoin | USDC on Stellar |
| Payments | Paystack (NGN), Stripe (international) |
| Database | PostgreSQL |
| Cache/Queue | Redis |

## Quick Start

### Docker (Recommended)

```bash
git clone https://github.com/yourorg/stellarsurprise.git
cd stellarsurprise
cp .env.example .env.local
docker-compose up
```

App: http://localhost:3000

### Manual

```bash
npm install
createdb stellarsurprise
psql stellarsurprise < migrations/001_init.sql
cp .env.example .env.local
npm run dev
```

## Smart Contract

```bash
npm run contract:build
npm run contract:test
STELLAR_NETWORK=testnet npm run contract:deploy
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). We welcome all contributions!

## License

MIT © 2026 StellarSurprise Contributors
