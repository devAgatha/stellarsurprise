CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) NOT NULL UNIQUE,
  stellar_address VARCHAR(60),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE gifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES users(id),
  recipient_phone VARCHAR(20) NOT NULL,
  amount_usd DECIMAL(12,2) NOT NULL,
  message TEXT,
  unlock_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  stellar_tx_hash VARCHAR(64),
  escrow_contract_id VARCHAR(60),
  payment_reference VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  claimed_at TIMESTAMPTZ
);

CREATE INDEX idx_gifts_sender ON gifts(sender_id);
CREATE INDEX idx_gifts_recipient ON gifts(recipient_phone);
CREATE INDEX idx_gifts_unlock ON gifts(unlock_at) WHERE status = 'locked';
