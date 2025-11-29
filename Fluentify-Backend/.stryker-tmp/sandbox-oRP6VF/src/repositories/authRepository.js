// @ts-nocheck
import db from '../config/db.js';

class AuthRepository {
  /**
   * Find learner by email
   * 
   * FIX: Ensures case-insensitive email lookup by normalizing email to lowercase
   * before querying. This ensures consistency with createLearner which stores
   * emails in lowercase.
   */
  async findLearnerByEmail(email) {
    // Normalize email to lowercase for consistent comparison
    const normalizedEmail = email ? email.toLowerCase().trim() : email;
    const result = await db.query(
      `SELECT l.*, 
       EXISTS(SELECT 1 FROM learner_preferences WHERE learner_id = l.id) as has_preferences 
       FROM learners l 
       WHERE LOWER(l.email) = LOWER($1)`,
      [normalizedEmail]
    );
    return result.rows[0] || null;
  }

  /**
   * Find admin by email
   * 
   * FIX: Ensures case-insensitive email lookup by normalizing email to lowercase
   * before querying. This ensures consistency with createAdmin which stores
   * emails in lowercase. Previously, this could fail if email case didn't match
   * exactly between signup and login attempts.
   */
  async findAdminByEmail(email) {
    // Normalize email to lowercase for consistent comparison
    const normalizedEmail = email ? email.toLowerCase().trim() : email;
    const result = await db.query(
      'SELECT * FROM admins WHERE LOWER(email) = LOWER($1)',
      [normalizedEmail]
    );
    return result.rows[0] || null;
  }

  /**
   * Create learner account
   * 
   * FIX: Ensures email is normalized to lowercase before insertion.
   * This guarantees that findLearnerByEmail will always find learners
   * created through this method, regardless of input email case.
   */
  async createLearner(name, email, passwordHash) {
    // Normalize email to lowercase for consistent storage
    const normalizedEmail = email ? email.toLowerCase().trim() : email;
    const result = await db.query(
      `INSERT INTO learners (name, email, password_hash, created_at, updated_at) 
       VALUES ($1, $2, $3, NOW(), NOW()) 
       RETURNING *`,
      [name, normalizedEmail, passwordHash]
    );
    return result.rows[0];
  }

  /**
   * Create admin account
   * 
   * FIX: Ensures email is normalized to lowercase before insertion.
   * This guarantees that findAdminByEmail will always find admins
   * created through this method, regardless of input email case.
   * Previously, inconsistent email normalization could cause admins
   * to be created but not found during login.
   */
  async createAdmin(name, email, passwordHash) {
    // Normalize email to lowercase for consistent storage
    const normalizedEmail = email ? email.toLowerCase().trim() : email;
    const result = await db.query(
      'INSERT INTO admins (name, email, password_hash, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
      [name, normalizedEmail, passwordHash]
    );
    return result.rows[0];
  }

  /**
   * Find learner by ID
   */
  async findLearnerById(id) {
    const result = await db.query(
      'SELECT * FROM learners WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Find admin by ID
   */
  async findAdminById(id) {
    const result = await db.query(
      'SELECT * FROM admins WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Begin database transaction
   */
  async beginTransaction() {
    await db.query('BEGIN');
  }

  /**
   * Commit database transaction
   */
  async commitTransaction() {
    await db.query('COMMIT');
  }

  /**
   * Rollback database transaction
   */
  async rollbackTransaction() {
    await db.query('ROLLBACK');
  }

  /**
   * Store OTP code in database
   */
  async storeOTP(email, otpCode, otpType, userType) {
    // Set expiration to 2 minutes from now
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
    
    const result = await db.query(
      `INSERT INTO otp_codes (email, otp_code, otp_type, user_type, expires_at, created_at) 
       VALUES (LOWER($1), $2, $3, $4, $5, NOW()) 
       RETURNING *`,
      [email, otpCode, otpType, userType, expiresAt]
    );
    return result.rows[0];
  }

  /**
   * Get the latest OTP record for cooldown checks
   */
  async getLatestOTP(email, otpType, userType) {
    const result = await db.query(
      `SELECT id, created_at FROM otp_codes
       WHERE LOWER(email) = LOWER($1)
       AND otp_type = $2
       AND user_type = $3
       ORDER BY created_at DESC
       LIMIT 1`,
      [email, otpType, userType]
    );
    return result.rows[0] || null;
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(email, otpCode, otpType, userType) {
    const result = await db.query(
      `SELECT * FROM otp_codes 
       WHERE LOWER(email) = LOWER($1)
       AND otp_code = $2 
       AND otp_type = $3 
       AND user_type = $4 
       AND is_used = false 
       AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [email, otpCode, otpType, userType]
    );
    return result.rows[0] || null;
  }

  /**
   * Mark OTP as used
   */
  async markOTPAsUsed(otpId) {
    await db.query(
      'UPDATE otp_codes SET is_used = true WHERE id = $1',
      [otpId]
    );
  }

  /**
   * Delete all OTPs for an email (cleanup)
   */
  async deleteOTPsByEmail(email, otpType, userType) {
    await db.query(
      'DELETE FROM otp_codes WHERE LOWER(email) = LOWER($1) AND otp_type = $2 AND user_type = $3',
      [email, otpType, userType]
    );
  }

  /**
   * Mark learner email as verified
   * 
   * FIX: Normalizes email to ensure it matches the email stored during account creation.
   */
  async markLearnerEmailVerified(email) {
    const normalizedEmail = email ? email.toLowerCase().trim() : email;
    const result = await db.query(
      `UPDATE learners 
       SET is_email_verified = true, email_verified_at = NOW(), updated_at = NOW() 
       WHERE LOWER(email) = LOWER($1)
       RETURNING *`,
      [normalizedEmail]
    );
    return result.rows[0];
  }

  /**
   * Mark admin email as verified
   * 
   * FIX: Normalizes email to ensure it matches the email stored during account creation.
   * This is critical for the verifySignupAdmin flow to work correctly.
   */
  async markAdminEmailVerified(email) {
    const normalizedEmail = email ? email.toLowerCase().trim() : email;
    const result = await db.query(
      `UPDATE admins 
       SET is_email_verified = true, email_verified_at = NOW(), updated_at = NOW() 
       WHERE LOWER(email) = LOWER($1)
       RETURNING *`,
      [normalizedEmail]
    );
    return result.rows[0];
  }

  /**
   * Update learner password
   * 
   * FIX: Normalizes email to ensure it matches the email stored during account creation.
   */
  async updateLearnerPassword(email, passwordHash) {
    const normalizedEmail = email ? email.toLowerCase().trim() : email;
    const result = await db.query(
      `UPDATE learners 
       SET password_hash = $1, updated_at = NOW() 
       WHERE LOWER(email) = LOWER($2)
       RETURNING *`,
      [passwordHash, normalizedEmail]
    );
    return result.rows[0];
  }

  /**
   * Update admin password
   * 
   * FIX: Normalizes email to ensure it matches the email stored during account creation.
   * This ensures password reset works correctly for admins.
   */
  async updateAdminPassword(email, passwordHash) {
    const normalizedEmail = email ? email.toLowerCase().trim() : email;
    const result = await db.query(
      `UPDATE admins 
       SET password_hash = $1, updated_at = NOW() 
       WHERE LOWER(email) = LOWER($2)
       RETURNING *`,
      [passwordHash, normalizedEmail]
    );
    return result.rows[0];
  }

  /**
   * Get full learner profile by ID
   */
  async getFullLearnerProfile(id) {
    const result = await db.query(
      `SELECT id, name, email, contest_name, created_at, updated_at, is_email_verified, email_verified_at
       FROM learners 
       WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Get full admin profile by ID
   */
  async getFullAdminProfile(id) {
    const result = await db.query(
      `SELECT id, name, email, created_at, updated_at, is_email_verified, email_verified_at
       FROM admins 
       WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Update learner profile (name and contest_name)
   */
  async updateLearnerProfile(id, updates) {
    const { name, contest_name } = updates;
    
    // Build dynamic query based on provided fields
    const fields = [];
    const values = [];
    let paramCount = 1;
    
    if (name !== undefined) {
      fields.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }
    
    if (contest_name !== undefined) {
      fields.push(`contest_name = $${paramCount}`);
      values.push(contest_name);
      paramCount++;
    }
    
    if (fields.length === 0) {
      // No updates provided, just return current profile
      return await this.getFullLearnerProfile(id);
    }
    
    fields.push(`updated_at = NOW()`);
    values.push(id);
    
    const query = `
      UPDATE learners 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, email, contest_name, created_at, updated_at, is_email_verified, email_verified_at
    `;
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Update admin profile (name)
   */
  async updateAdminProfile(id, name) {
    const result = await db.query(
      `UPDATE admins 
       SET name = $1, updated_at = NOW() 
       WHERE id = $2
       RETURNING id, name, email, created_at, updated_at, is_email_verified, email_verified_at`,
      [name, id]
    );
    return result.rows[0];
  }
}

export default new AuthRepository();
