-- FIX: Standalone migration to create otp_codes table if it doesn't exist
-- This file can be run manually if the automatic migration didn't execute.
-- 
-- Problem: "relation 'otp_codes' does not exist" error occurs when:
--   - Database was initialized before this migration existed
--   - Docker volume already existed when migration was added
--   - Migration script failed silently
--
-- Solution: Run this file manually via:
--   Option 1: psql -U postgres -d fluentify -f src/database/05-fix-otp-codes.sql
--   Option 2: docker exec -i fluentify-postgres psql -U postgres -d fluentify < src/database/05-fix-otp-codes.sql
--   Option 3: Use the migration script: node scripts/runAuthMigration.js
--
-- Required fields as per specification:
--   - id: Primary key (SERIAL, auto-increment)
--   - email: User email address (VARCHAR(100))
--   - otp_code: The OTP code (VARCHAR(6))
--   - expires_at: Expiration timestamp (TIMESTAMP)
--   - created_at: Creation timestamp with default NOW() (TIMESTAMP)

-- Add email verification columns if they don't exist (for complete migration)
ALTER TABLE learners 
ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP;

ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP;

-- Create OTP codes table
CREATE TABLE IF NOT EXISTS otp_codes (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  otp_type VARCHAR(20) NOT NULL, -- 'signup' or 'password_reset'
  user_type VARCHAR(20) NOT NULL, -- 'learner' or 'admin'
  is_used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster OTP lookups
CREATE INDEX IF NOT EXISTS idx_otp_email ON otp_codes(email);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON otp_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_otp_lookup ON otp_codes(email, otp_code, otp_type, user_type, is_used);

-- Function to clean up expired OTPs (optional, for maintenance)
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void AS $$
BEGIN
    DELETE FROM otp_codes WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Verify table was created
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'otp_codes') THEN
        RAISE NOTICE '✅ otp_codes table created successfully!';
    ELSE
        RAISE EXCEPTION '❌ Failed to create otp_codes table';
    END IF;
END $$;

