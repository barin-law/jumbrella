-- ============================================================================
-- JuriMbrella — PostgreSQL Production Database Schema
-- Philippine Electronic Notarial Facility (ENF) Commercial & Technical Engine
-- Compliant with Supreme Court A.M. No. 24-10-14-SC Rules on Electronic Notarization
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
DO $$ BEGIN
  CREATE TYPE enf_role AS ENUM (
    'CLIENT',
    'ENF_OWNER',
    'NOTARY',
    'STAFF',
    'SUPPORT',
    'ENF_MANAGER',
    'FINANCE',
    'ADMIN',
    'SUPER_ADMIN'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE enf_order_status AS ENUM (
    'PENDING_PAYMENT',
    'PAYMENT_SUBMITTED',
    'UNDER_REVIEW',
    'REQUIRES_INFORMATION',
    'PAID',
    'ACTIVATED',
    'REJECTED',
    'CANCELLED',
    'REFUND_PENDING',
    'REFUNDED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE enf_payment_status AS ENUM (
    'PAYMENT_SUBMITTED',
    'UNDER_REVIEW',
    'PAID',
    'REJECTED',
    'REQUIRES_INFORMATION'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE enf_ledger_type AS ENUM (
    'CREDIT',
    'DEBIT',
    'ADJUSTMENT',
    'REFUND',
    'REVERSAL'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. Users Table (Scrypt hashed passwords, unique emails, RBAC)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(64),
  password_hash TEXT NOT NULL,
  salt VARCHAR(64) NOT NULL,
  role enf_role NOT NULL DEFAULT 'ENF_OWNER',
  organization VARCHAR(255),
  professional_info TEXT,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verification_code VARCHAR(16),
  account_status VARCHAR(64) NOT NULL DEFAULT 'PENDING_EMAIL_VERIFICATION',
  reset_token VARCHAR(128),
  reset_token_expires TIMESTAMPTZ,
  two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Sessions Table (Server-side authoritative session storage)
CREATE TABLE IF NOT EXISTS sessions (
  token VARCHAR(128) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role enf_role NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- 3. Commercial Plans Table (Prescribed exact values)
CREATE TABLE IF NOT EXISTS plans (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  tier VARCHAR(64) NOT NULL,
  tier_label VARCHAR(64) NOT NULL,
  price_php NUMERIC(12, 2) NOT NULL,
  credit_amount_php NUMERIC(12, 2) NOT NULL,
  discount_rate NUMERIC(5, 4) NOT NULL,
  base_fee_php NUMERIC(12, 2) NOT NULL DEFAULT 100.00,
  effective_fee_php NUMERIC(12, 2) NOT NULL,
  credits_quantity INTEGER NOT NULL,
  headline TEXT NOT NULL,
  description TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  terms_version VARCHAR(64) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 4. Customer Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY,
  order_number VARCHAR(64) UNIQUE NOT NULL,
  customer_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(64),
  plan_id VARCHAR(64) NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
  plan_name VARCHAR(128) NOT NULL,
  amount_php NUMERIC(12, 2) NOT NULL,
  credit_amount_php NUMERIC(12, 2) NOT NULL,
  discount_rate NUMERIC(5, 4) NOT NULL,
  tier_label VARCHAR(64) NOT NULL,
  base_fee_php NUMERIC(12, 2) NOT NULL,
  effective_fee_php NUMERIC(12, 2) NOT NULL,
  credits_quantity INTEGER NOT NULL,
  payment_ref VARCHAR(64) UNIQUE NOT NULL,
  terms_version VARCHAR(64) NOT NULL,
  status enf_order_status NOT NULL DEFAULT 'PENDING_PAYMENT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  activated_at TIMESTAMPTZ,
  rejection_reason TEXT,
  information_requested TEXT
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_ref ON orders(payment_ref);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- 5. Payment Submissions Table
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  payment_ref VARCHAR(64) NOT NULL,
  customer_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  bank_name VARCHAR(128) NOT NULL,
  transfer_date DATE NOT NULL,
  transfer_time VARCHAR(32) NOT NULL,
  amount_php NUMERIC(12, 2) NOT NULL,
  sender_name VARCHAR(255) NOT NULL,
  bank_transaction_ref VARCHAR(128) NOT NULL,
  proof_file_name VARCHAR(255) NOT NULL,
  proof_file_type VARCHAR(64) NOT NULL,
  proof_file_data_url TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status enf_payment_status NOT NULL DEFAULT 'PAYMENT_SUBMITTED',
  verified_at TIMESTAMPTZ,
  verified_by VARCHAR(255),
  receipt_number VARCHAR(64),
  admin_notes TEXT,
  information_requested TEXT
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- 6. Credit Wallets Table (One wallet per customer)
CREATE TABLE IF NOT EXISTS wallets (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  owner_name VARCHAR(255) NOT NULL,
  owner_email VARCHAR(255) NOT NULL,
  available_balance_php NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  total_purchased_php NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  total_used_php NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  available_credits INTEGER NOT NULL DEFAULT 0,
  credits_used INTEGER NOT NULL DEFAULT 0,
  original_credits INTEGER NOT NULL DEFAULT 0,
  development_tier VARCHAR(64) NOT NULL DEFAULT 'None',
  discount_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.00,
  base_fee_php NUMERIC(12, 2) NOT NULL DEFAULT 100.00,
  effective_technical_fee_php NUMERIC(12, 2) NOT NULL DEFAULT 100.00,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);

-- 7. Credit Ledger Table (Double-entry transaction audit trail)
CREATE TABLE IF NOT EXISTS credit_ledger (
  id VARCHAR(64) PRIMARY KEY,
  wallet_id VARCHAR(64) NOT NULL REFERENCES wallets(id) ON DELETE RESTRICT,
  user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  order_id VARCHAR(64) REFERENCES orders(id) ON DELETE SET NULL,
  type enf_ledger_type NOT NULL,
  amount_php NUMERIC(12, 2) NOT NULL,
  credits_debited INTEGER,
  credits_balance_before INTEGER NOT NULL,
  credits_balance_after INTEGER NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  reference_code VARCHAR(128) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(32) NOT NULL DEFAULT 'COMPLETED',
  actor_email VARCHAR(255),
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_ledger_wallet_id ON credit_ledger(wallet_id);
CREATE INDEX IF NOT EXISTS idx_ledger_user_id ON credit_ledger(user_id);

-- 8. Official Receipts Table
CREATE TABLE IF NOT EXISTS receipts (
  id VARCHAR(64) PRIMARY KEY,
  receipt_number VARCHAR(64) UNIQUE NOT NULL,
  order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  order_number VARCHAR(64) NOT NULL,
  customer_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  plan_name VARCHAR(128) NOT NULL,
  purchase_amount_php NUMERIC(12, 2) NOT NULL,
  payment_ref VARCHAR(64) NOT NULL,
  payment_date TIMESTAMPTZ NOT NULL,
  credits_issued INTEGER NOT NULL,
  discount_rate NUMERIC(5, 4) NOT NULL,
  effective_technical_fee_php NUMERIC(12, 2) NOT NULL,
  payment_status VARCHAR(32) NOT NULL DEFAULT 'PAID',
  verified_by VARCHAR(255) NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_receipts_customer_id ON receipts(customer_id);
CREATE INDEX IF NOT EXISTS idx_receipts_receipt_number ON receipts(receipt_number);

-- 9. Customer Profiles & Facility Configs
CREATE TABLE IF NOT EXISTS customer_profiles (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(64),
  roll_number VARCHAR(64),
  ibp_chapter VARCHAR(128),
  commission_number VARCHAR(64),
  office_name VARCHAR(255),
  office_address TEXT,
  organization_name VARCHAR(255),
  onboarding_step INTEGER NOT NULL DEFAULT 1,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Audit Logs Table (Immutable system audit trail)
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(64) PRIMARY KEY,
  actor_id VARCHAR(64) NOT NULL,
  actor_email VARCHAR(255) NOT NULL,
  actor_role VARCHAR(64) NOT NULL,
  action VARCHAR(128) NOT NULL,
  target_type VARCHAR(64) NOT NULL,
  target_id VARCHAR(128) NOT NULL,
  details JSONB,
  ip_address VARCHAR(64),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);

-- 11. In-App Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(32) NOT NULL DEFAULT 'INFO',
  read BOOLEAN NOT NULL DEFAULT FALSE,
  link VARCHAR(255),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
