-- Email Verification and OTP Management Tables

-- Table to store email verification OTPs
CREATE TABLE IF NOT EXISTS email_verifications (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON email_verifications(email);
CREATE INDEX IF NOT EXISTS idx_email_verifications_expires_at ON email_verifications(expires_at);

-- Add email_verified column to learners table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'learners' AND column_name = 'email_verified'
  ) THEN
    ALTER TABLE learners ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Add email_verified column to admins table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admins' AND column_name = 'email_verified'
  ) THEN
    ALTER TABLE admins ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Function to clean up expired OTPs (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM email_verifications 
  WHERE expires_at < NOW() AND is_verified = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a scheduled job to clean up expired OTPs
-- This can be done using pg_cron extension or application-level cron job
COMMENT ON FUNCTION cleanup_expired_otps() IS 'Removes expired and unverified OTP records';
