/**
 * OTP Repository
 * Handles database operations for email verification OTPs
 */

import db from '../config/db.js';

class OTPRepository {
  /**
   * Store OTP for email verification
   */
  async createOTP(email, otp, expiresAt) {
    const result = await db.query(
      `INSERT INTO email_verifications (email, otp, expires_at, created_at, updated_at) 
       VALUES ($1, $2, $3, NOW(), NOW()) 
       RETURNING *`,
      [email, otp, expiresAt]
    );
    return result.rows[0];
  }

  /**
   * Get latest OTP for an email
   */
  async getLatestOTP(email) {
    const result = await db.query(
      `SELECT * FROM email_verifications 
       WHERE email = $1 AND is_verified = FALSE 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [email]
    );
    return result.rows[0] || null;
  }

  /**
   * Verify OTP and mark as verified
   */
  async verifyOTP(email, otp) {
    const result = await db.query(
      `UPDATE email_verifications 
       SET is_verified = TRUE, verified_at = NOW(), updated_at = NOW() 
       WHERE email = $1 AND otp = $2 AND is_verified = FALSE AND expires_at > NOW() 
       RETURNING *`,
      [email, otp]
    );
    return result.rows[0] || null;
  }

  /**
   * Increment OTP verification attempts
   */
  async incrementAttempts(email) {
    const result = await db.query(
      `UPDATE email_verifications 
       SET attempts = attempts + 1, updated_at = NOW() 
       WHERE email = $1 AND is_verified = FALSE 
       ORDER BY created_at DESC 
       LIMIT 1 
       RETURNING *`,
      [email]
    );
    return result.rows[0] || null;
  }

  /**
   * Check if email has been verified
   */
  async isEmailVerified(email) {
    const result = await db.query(
      `SELECT EXISTS(
        SELECT 1 FROM email_verifications 
        WHERE email = $1 AND is_verified = TRUE
      ) as verified`,
      [email]
    );
    return result.rows[0]?.verified || false;
  }

  /**
   * Delete all OTPs for an email (cleanup after successful verification)
   */
  async deleteOTPsForEmail(email) {
    await db.query(
      `DELETE FROM email_verifications WHERE email = $1`,
      [email]
    );
  }

  /**
   * Delete expired OTPs
   */
  async cleanupExpiredOTPs() {
    const result = await db.query(
      `DELETE FROM email_verifications 
       WHERE expires_at < NOW() AND is_verified = FALSE 
       RETURNING *`
    );
    return result.rows.length;
  }

  /**
   * Check if user can request new OTP (rate limiting)
   * Returns true if user can request, false if they need to wait
   */
  async canRequestNewOTP(email) {
    const result = await db.query(
      `SELECT created_at FROM email_verifications 
       WHERE email = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [email]
    );
    
    if (!result.rows[0]) {
      return true; // No previous OTP, can request
    }
    
    const lastOTPTime = new Date(result.rows[0].created_at);
    const now = new Date();
    const diffSeconds = (now - lastOTPTime) / 1000;
    
    // Allow new OTP only if 30 seconds have passed
    return diffSeconds >= 30;
  }

  /**
   * Get time remaining before user can request new OTP
   */
  async getTimeUntilNextOTP(email) {
    const result = await db.query(
      `SELECT created_at FROM email_verifications 
       WHERE email = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [email]
    );
    
    if (!result.rows[0]) {
      return 0;
    }
    
    const lastOTPTime = new Date(result.rows[0].created_at);
    const now = new Date();
    const diffSeconds = Math.floor((now - lastOTPTime) / 1000);
    const waitTime = 30 - diffSeconds; // 30 seconds cooldown
    
    return waitTime > 0 ? waitTime : 0;
  }

  /**
   * Count total OTP requests for an email (within last 24 hours)
   */
  async countOTPRequests(email) {
    const result = await db.query(
      `SELECT COUNT(*) as count FROM email_verifications 
       WHERE email = $1 AND created_at > NOW() - INTERVAL '24 hours'`,
      [email]
    );
    return parseInt(result.rows[0]?.count || 0);
  }

  /**
   * Check if email has exceeded maximum OTP generation limit (3 per day)
   */
  async hasExceededOTPLimit(email) {
    const count = await this.countOTPRequests(email);
    return count >= 3;
  }
}

export default new OTPRepository();
