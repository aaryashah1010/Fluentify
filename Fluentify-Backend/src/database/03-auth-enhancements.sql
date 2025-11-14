-- Add email verification status to learners table
ALTER TABLE learners 
ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP;

-- Add email verification status to admins table
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP;

-- FIX: Create OTP table for email verification and password reset
-- This table stores OTP codes for signup verification and password reset functionality.
-- Required fields:
--   - id: Primary key (auto-increment)
--   - email: User email address (VARCHAR(100))
--   - otp_code: The 6-digit OTP code (VARCHAR(6))
--   - expires_at: Expiration timestamp (TIMESTAMP)
--   - created_at: Creation timestamp with default NOW() (TIMESTAMP)
-- Additional fields for functionality:
--   - otp_type: Type of OTP ('signup' or 'password_reset')
--   - user_type: User role ('learner' or 'admin')
--   - is_used: Flag to prevent OTP reuse (BOOLEAN)
--
-- NOTE: If you get "relation 'otp_codes' does not exist" error, this migration
-- may not have run. Solutions:
--   1. If using Docker: Reset database volume (docker-compose down -v && docker-compose up)
--   2. Run manually: Execute this SQL file or use scripts/runAuthMigration.js
--   3. Or run the standalone fix: src/database/05-fix-otp-codes.sql
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
