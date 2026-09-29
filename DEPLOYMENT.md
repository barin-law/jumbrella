# JuriMbrella — Production Deployment & Architecture Guide

This guide details the deployment, configuration, database migration, and security procedures for the **JuriMbrella Philippine Electronic Notarization (ENF) Commercial Platform**.

---

## 1. System Architecture Overview

JuriMbrella implements a decoupled, production-grade architecture:

1. **Frontend**: Static React Single Page Application (Vite + Tailwind CSS).
   - Hosted on GitHub Pages: `https://barin-law.github.io/jumbrella/`
   - Configured with `base: '/jumbrella/'`.
   - Communicates with the backend API via HTTPS.
2. **Backend**: Dedicated Node.js Express HTTPS API Server.
   - Hosted on Cloud Run / AWS ECS / Render / VPS.
   - Listens on `0.0.0.0:3000` (or `PORT`).
   - Serves authoritative `/api/*` endpoints.
3. **Database**: PostgreSQL Persistent Relational Database (or transactional container storage).
   - Enforces unique constraints, foreign keys, and atomic financial transactions.

---

## 2. Environment Variables Configuration

Copy `.env.example` to `.env` on your production server. **Never commit `.env` or production credentials to source control.**

| Variable | Description | Example / Recommended Value |
|---|---|---|
| `PORT` | Listening port for Express API | `3000` |
| `NODE_ENV` | Runtime environment | `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/jurimbrella_prod?sslmode=require` |
| `VITE_API_BASE_URL` | Public HTTPS URL of the backend API (built into frontend bundle) | `https://api.jurimbrella.ph` |
| `CORS_ORIGIN` | Allowed frontend origin for authenticated requests | `https://barin-law.github.io` |
| `ADMIN_SETUP_TOKEN` | Secret master token to provision the initial Super Administrator | High-entropy random 32-character string |
| `SESSION_SECRET` | Secret key for cryptographic signing | High-entropy random string |
| `SMTP_HOST` | Outgoing email server | `smtp.sendgrid.net` |
| `SMTP_PORT` | Outgoing email port | `587` |
| `SMTP_USER` | SMTP username | `apikey` |
| `SMTP_PASS` | SMTP secret key / password | SendGrid / Postmark API key |
| `FILE_STORAGE_BUCKET` | AWS S3 or Google Cloud Storage bucket for proof & documents | `jurimbrella-vault-prod` |

---

## 3. Database Setup & PostgreSQL Migration

### Step 1: Initialize Database Schema
Execute `server/schema.sql` against your target PostgreSQL database:

```bash
psql "$DATABASE_URL" -f server/schema.sql
```

The schema defines:
- `users`: With Scrypt password hashing (`crypto.scryptSync(password, salt, 64)`).
- `sessions`: Authoritative 32-byte tokens with timestamps and expiration.
- `plans`: Prescribed Supreme Court development plans (₱20K, ₱50K, ₱100K).
- `orders`: Persistent orders with unique `ENF-ORD-2026-XXXXXX` references.
- `payments`: Bank remittance submissions and file metadata.
- `wallets`: Prepaid notarial credit wallets with active balances.
- `credit_ledger`: Double-entry audit records with pre- and post-balances.
- `receipts`: Official Receipts (`JM-OR-2026-XXXXXX`).
- `audit_logs`: Immutable security and financial audit trail.

### Step 2: Migrate Development Data (Optional)
If migrating existing development data from `.data/jurimbrella_db.json`:

```bash
# Generate SQL migration file
npx tsx server/migrate.ts

# Apply generated SQL file
psql "$DATABASE_URL" -f server/migration_data.sql
```

---

## 4. Frontend Deployment (GitHub Pages)

The frontend is built and deployed as static assets to GitHub Pages.

```bash
# 1. Install dependencies
npm ci

# 2. Build for production with GitHub Pages subpath
npm run build

# 3. Output artifacts generated in dist/
# - dist/index.html
# - dist/404.html (for client-side routing)
# - dist/.nojekyll (disables Jekyll processing)
```

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically builds and publishes the `dist/` directory to GitHub Pages.

To connect the GitHub Pages frontend to your dedicated HTTPS API:
Set `VITE_API_BASE_URL=https://api.yourdomain.com` in your repository secrets or build environment.

---

## 5. Backend Deployment (HTTPS Dedicated Server)

### Run with Node.js / Docker
```bash
# 1. Install production dependencies
npm ci --omit=dev

# 2. Start the server
npm run start
```

### Systemd / Process Manager (PM2)
```bash
pm2 start server.ts --name jurimbrella-api --interpreter ./node_modules/.bin/tsx
```

---

## 6. First Administrator Provisioning (Security Procedure)

To prevent hardcoded administrator credentials in production:

1. Deploy the backend with `ADMIN_SETUP_TOKEN=<your-secret-setup-token>` configured in `.env`.
2. Send an initial provisioning request:

```bash
curl -X POST https://api.jurimbrella.ph/api/auth/setup-admin \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Executive Director",
    "email": "director@jurimbrella.ph",
    "password": "<strong-random-password-min-10-chars>",
    "confirmPassword": "<strong-random-password-min-10-chars>",
    "adminSetupToken": "<your-secret-setup-token>"
  }'
```

3. The endpoint provisions the primary `SUPER_ADMIN` account with Scrypt password hashing and immediately invalidates any pre-existing temporary sessions.
4. After initial setup, remove or rotate `ADMIN_SETUP_TOKEN`.

---

## 7. Health Check & Monitoring

A lightweight, unauthenticated health check endpoint is provided:

```http
GET /api/health
```

**Response (HTTP 200 OK):**
```json
{
  "status": "ok",
  "service": "JuriMbrella API Server",
  "database": "connected",
  "version": "2026.1-AM241014",
  "timestamp": "2026-09-29T15:00:00.000Z"
}
```

This endpoint exposes no sensitive environment variables, filesystem paths, or credentials and is safe for load balancer health probes.

---

## 8. Backup & Disaster Recovery Procedures

1. **Daily Database Backup**:
   ```bash
   pg_dump "$DATABASE_URL" -Fc -f "jurimbrella_backup_$(date +%Y%m%d_%H%M%S).dump"
   ```
2. **Encrypted Storage**:
   Upload backup files to an off-site, immutable cloud storage bucket with 30-day lifecycle retention.
3. **Database Restore**:
   ```bash
   pg_restore -d "$DATABASE_URL" --clean --no-acl --no-owner jurimbrella_backup_<date>.dump
   ```
4. **Rollback Strategy**:
   - Frontend: Re-deploy previous commit via GitHub Actions.
   - Backend: Re-deploy previous container image tag.
