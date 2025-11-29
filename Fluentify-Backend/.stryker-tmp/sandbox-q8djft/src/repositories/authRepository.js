// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
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
    if (stryMutAct_9fa48("2057")) {
      {}
    } else {
      stryCov_9fa48("2057");
      // Normalize email to lowercase for consistent comparison
      const normalizedEmail = email ? stryMutAct_9fa48("2059") ? email.toUpperCase().trim() : stryMutAct_9fa48("2058") ? email.toLowerCase() : (stryCov_9fa48("2058", "2059"), email.toLowerCase().trim()) : email;
      const result = await db.query(stryMutAct_9fa48("2060") ? `` : (stryCov_9fa48("2060"), `SELECT l.*, 
       EXISTS(SELECT 1 FROM learner_preferences WHERE learner_id = l.id) as has_preferences 
       FROM learners l 
       WHERE LOWER(l.email) = LOWER($1)`), stryMutAct_9fa48("2061") ? [] : (stryCov_9fa48("2061"), [normalizedEmail]));
      return stryMutAct_9fa48("2064") ? result.rows[0] && null : stryMutAct_9fa48("2063") ? false : stryMutAct_9fa48("2062") ? true : (stryCov_9fa48("2062", "2063", "2064"), result.rows[0] || null);
    }
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
    if (stryMutAct_9fa48("2065")) {
      {}
    } else {
      stryCov_9fa48("2065");
      // Normalize email to lowercase for consistent comparison
      const normalizedEmail = email ? stryMutAct_9fa48("2067") ? email.toUpperCase().trim() : stryMutAct_9fa48("2066") ? email.toLowerCase() : (stryCov_9fa48("2066", "2067"), email.toLowerCase().trim()) : email;
      const result = await db.query(stryMutAct_9fa48("2068") ? "" : (stryCov_9fa48("2068"), 'SELECT * FROM admins WHERE LOWER(email) = LOWER($1)'), stryMutAct_9fa48("2069") ? [] : (stryCov_9fa48("2069"), [normalizedEmail]));
      return stryMutAct_9fa48("2072") ? result.rows[0] && null : stryMutAct_9fa48("2071") ? false : stryMutAct_9fa48("2070") ? true : (stryCov_9fa48("2070", "2071", "2072"), result.rows[0] || null);
    }
  }

  /**
   * Create learner account
   * 
   * FIX: Ensures email is normalized to lowercase before insertion.
   * This guarantees that findLearnerByEmail will always find learners
   * created through this method, regardless of input email case.
   */
  async createLearner(name, email, passwordHash) {
    if (stryMutAct_9fa48("2073")) {
      {}
    } else {
      stryCov_9fa48("2073");
      // Normalize email to lowercase for consistent storage
      const normalizedEmail = email ? stryMutAct_9fa48("2075") ? email.toUpperCase().trim() : stryMutAct_9fa48("2074") ? email.toLowerCase() : (stryCov_9fa48("2074", "2075"), email.toLowerCase().trim()) : email;
      const result = await db.query(stryMutAct_9fa48("2076") ? `` : (stryCov_9fa48("2076"), `INSERT INTO learners (name, email, password_hash, created_at, updated_at) 
       VALUES ($1, $2, $3, NOW(), NOW()) 
       RETURNING *`), stryMutAct_9fa48("2077") ? [] : (stryCov_9fa48("2077"), [name, normalizedEmail, passwordHash]));
      return result.rows[0];
    }
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
    if (stryMutAct_9fa48("2078")) {
      {}
    } else {
      stryCov_9fa48("2078");
      // Normalize email to lowercase for consistent storage
      const normalizedEmail = email ? stryMutAct_9fa48("2080") ? email.toUpperCase().trim() : stryMutAct_9fa48("2079") ? email.toLowerCase() : (stryCov_9fa48("2079", "2080"), email.toLowerCase().trim()) : email;
      const result = await db.query(stryMutAct_9fa48("2081") ? "" : (stryCov_9fa48("2081"), 'INSERT INTO admins (name, email, password_hash, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *'), stryMutAct_9fa48("2082") ? [] : (stryCov_9fa48("2082"), [name, normalizedEmail, passwordHash]));
      return result.rows[0];
    }
  }

  /**
   * Find learner by ID
   */
  async findLearnerById(id) {
    if (stryMutAct_9fa48("2083")) {
      {}
    } else {
      stryCov_9fa48("2083");
      const result = await db.query(stryMutAct_9fa48("2084") ? "" : (stryCov_9fa48("2084"), 'SELECT * FROM learners WHERE id = $1'), stryMutAct_9fa48("2085") ? [] : (stryCov_9fa48("2085"), [id]));
      return stryMutAct_9fa48("2088") ? result.rows[0] && null : stryMutAct_9fa48("2087") ? false : stryMutAct_9fa48("2086") ? true : (stryCov_9fa48("2086", "2087", "2088"), result.rows[0] || null);
    }
  }

  /**
   * Find admin by ID
   */
  async findAdminById(id) {
    if (stryMutAct_9fa48("2089")) {
      {}
    } else {
      stryCov_9fa48("2089");
      const result = await db.query(stryMutAct_9fa48("2090") ? "" : (stryCov_9fa48("2090"), 'SELECT * FROM admins WHERE id = $1'), stryMutAct_9fa48("2091") ? [] : (stryCov_9fa48("2091"), [id]));
      return stryMutAct_9fa48("2094") ? result.rows[0] && null : stryMutAct_9fa48("2093") ? false : stryMutAct_9fa48("2092") ? true : (stryCov_9fa48("2092", "2093", "2094"), result.rows[0] || null);
    }
  }

  /**
   * Begin database transaction
   */
  async beginTransaction() {
    if (stryMutAct_9fa48("2095")) {
      {}
    } else {
      stryCov_9fa48("2095");
      await db.query(stryMutAct_9fa48("2096") ? "" : (stryCov_9fa48("2096"), 'BEGIN'));
    }
  }

  /**
   * Commit database transaction
   */
  async commitTransaction() {
    if (stryMutAct_9fa48("2097")) {
      {}
    } else {
      stryCov_9fa48("2097");
      await db.query(stryMutAct_9fa48("2098") ? "" : (stryCov_9fa48("2098"), 'COMMIT'));
    }
  }

  /**
   * Rollback database transaction
   */
  async rollbackTransaction() {
    if (stryMutAct_9fa48("2099")) {
      {}
    } else {
      stryCov_9fa48("2099");
      await db.query(stryMutAct_9fa48("2100") ? "" : (stryCov_9fa48("2100"), 'ROLLBACK'));
    }
  }

  /**
   * Store OTP code in database
   */
  async storeOTP(email, otpCode, otpType, userType) {
    if (stryMutAct_9fa48("2101")) {
      {}
    } else {
      stryCov_9fa48("2101");
      // Set expiration to 2 minutes from now
      const expiresAt = new Date(stryMutAct_9fa48("2102") ? Date.now() - 2 * 60 * 1000 : (stryCov_9fa48("2102"), Date.now() + (stryMutAct_9fa48("2103") ? 2 * 60 / 1000 : (stryCov_9fa48("2103"), (stryMutAct_9fa48("2104") ? 2 / 60 : (stryCov_9fa48("2104"), 2 * 60)) * 1000))));
      const result = await db.query(stryMutAct_9fa48("2105") ? `` : (stryCov_9fa48("2105"), `INSERT INTO otp_codes (email, otp_code, otp_type, user_type, expires_at, created_at) 
       VALUES (LOWER($1), $2, $3, $4, $5, NOW()) 
       RETURNING *`), stryMutAct_9fa48("2106") ? [] : (stryCov_9fa48("2106"), [email, otpCode, otpType, userType, expiresAt]));
      return result.rows[0];
    }
  }

  /**
   * Get the latest OTP record for cooldown checks
   */
  async getLatestOTP(email, otpType, userType) {
    if (stryMutAct_9fa48("2107")) {
      {}
    } else {
      stryCov_9fa48("2107");
      const result = await db.query(stryMutAct_9fa48("2108") ? `` : (stryCov_9fa48("2108"), `SELECT id, created_at FROM otp_codes
       WHERE LOWER(email) = LOWER($1)
       AND otp_type = $2
       AND user_type = $3
       ORDER BY created_at DESC
       LIMIT 1`), stryMutAct_9fa48("2109") ? [] : (stryCov_9fa48("2109"), [email, otpType, userType]));
      return stryMutAct_9fa48("2112") ? result.rows[0] && null : stryMutAct_9fa48("2111") ? false : stryMutAct_9fa48("2110") ? true : (stryCov_9fa48("2110", "2111", "2112"), result.rows[0] || null);
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(email, otpCode, otpType, userType) {
    if (stryMutAct_9fa48("2113")) {
      {}
    } else {
      stryCov_9fa48("2113");
      const result = await db.query(stryMutAct_9fa48("2114") ? `` : (stryCov_9fa48("2114"), `SELECT * FROM otp_codes 
       WHERE LOWER(email) = LOWER($1)
       AND otp_code = $2 
       AND otp_type = $3 
       AND user_type = $4 
       AND is_used = false 
       AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`), stryMutAct_9fa48("2115") ? [] : (stryCov_9fa48("2115"), [email, otpCode, otpType, userType]));
      return stryMutAct_9fa48("2118") ? result.rows[0] && null : stryMutAct_9fa48("2117") ? false : stryMutAct_9fa48("2116") ? true : (stryCov_9fa48("2116", "2117", "2118"), result.rows[0] || null);
    }
  }

  /**
   * Mark OTP as used
   */
  async markOTPAsUsed(otpId) {
    if (stryMutAct_9fa48("2119")) {
      {}
    } else {
      stryCov_9fa48("2119");
      await db.query(stryMutAct_9fa48("2120") ? "" : (stryCov_9fa48("2120"), 'UPDATE otp_codes SET is_used = true WHERE id = $1'), stryMutAct_9fa48("2121") ? [] : (stryCov_9fa48("2121"), [otpId]));
    }
  }

  /**
   * Delete all OTPs for an email (cleanup)
   */
  async deleteOTPsByEmail(email, otpType, userType) {
    if (stryMutAct_9fa48("2122")) {
      {}
    } else {
      stryCov_9fa48("2122");
      await db.query(stryMutAct_9fa48("2123") ? "" : (stryCov_9fa48("2123"), 'DELETE FROM otp_codes WHERE LOWER(email) = LOWER($1) AND otp_type = $2 AND user_type = $3'), stryMutAct_9fa48("2124") ? [] : (stryCov_9fa48("2124"), [email, otpType, userType]));
    }
  }

  /**
   * Mark learner email as verified
   * 
   * FIX: Normalizes email to ensure it matches the email stored during account creation.
   */
  async markLearnerEmailVerified(email) {
    if (stryMutAct_9fa48("2125")) {
      {}
    } else {
      stryCov_9fa48("2125");
      const normalizedEmail = email ? stryMutAct_9fa48("2127") ? email.toUpperCase().trim() : stryMutAct_9fa48("2126") ? email.toLowerCase() : (stryCov_9fa48("2126", "2127"), email.toLowerCase().trim()) : email;
      const result = await db.query(stryMutAct_9fa48("2128") ? `` : (stryCov_9fa48("2128"), `UPDATE learners 
       SET is_email_verified = true, email_verified_at = NOW(), updated_at = NOW() 
       WHERE LOWER(email) = LOWER($1)
       RETURNING *`), stryMutAct_9fa48("2129") ? [] : (stryCov_9fa48("2129"), [normalizedEmail]));
      return result.rows[0];
    }
  }

  /**
   * Mark admin email as verified
   * 
   * FIX: Normalizes email to ensure it matches the email stored during account creation.
   * This is critical for the verifySignupAdmin flow to work correctly.
   */
  async markAdminEmailVerified(email) {
    if (stryMutAct_9fa48("2130")) {
      {}
    } else {
      stryCov_9fa48("2130");
      const normalizedEmail = email ? stryMutAct_9fa48("2132") ? email.toUpperCase().trim() : stryMutAct_9fa48("2131") ? email.toLowerCase() : (stryCov_9fa48("2131", "2132"), email.toLowerCase().trim()) : email;
      const result = await db.query(stryMutAct_9fa48("2133") ? `` : (stryCov_9fa48("2133"), `UPDATE admins 
       SET is_email_verified = true, email_verified_at = NOW(), updated_at = NOW() 
       WHERE LOWER(email) = LOWER($1)
       RETURNING *`), stryMutAct_9fa48("2134") ? [] : (stryCov_9fa48("2134"), [normalizedEmail]));
      return result.rows[0];
    }
  }

  /**
   * Update learner password
   * 
   * FIX: Normalizes email to ensure it matches the email stored during account creation.
   */
  async updateLearnerPassword(email, passwordHash) {
    if (stryMutAct_9fa48("2135")) {
      {}
    } else {
      stryCov_9fa48("2135");
      const normalizedEmail = email ? stryMutAct_9fa48("2137") ? email.toUpperCase().trim() : stryMutAct_9fa48("2136") ? email.toLowerCase() : (stryCov_9fa48("2136", "2137"), email.toLowerCase().trim()) : email;
      const result = await db.query(stryMutAct_9fa48("2138") ? `` : (stryCov_9fa48("2138"), `UPDATE learners 
       SET password_hash = $1, updated_at = NOW() 
       WHERE LOWER(email) = LOWER($2)
       RETURNING *`), stryMutAct_9fa48("2139") ? [] : (stryCov_9fa48("2139"), [passwordHash, normalizedEmail]));
      return result.rows[0];
    }
  }

  /**
   * Update admin password
   * 
   * FIX: Normalizes email to ensure it matches the email stored during account creation.
   * This ensures password reset works correctly for admins.
   */
  async updateAdminPassword(email, passwordHash) {
    if (stryMutAct_9fa48("2140")) {
      {}
    } else {
      stryCov_9fa48("2140");
      const normalizedEmail = email ? stryMutAct_9fa48("2142") ? email.toUpperCase().trim() : stryMutAct_9fa48("2141") ? email.toLowerCase() : (stryCov_9fa48("2141", "2142"), email.toLowerCase().trim()) : email;
      const result = await db.query(stryMutAct_9fa48("2143") ? `` : (stryCov_9fa48("2143"), `UPDATE admins 
       SET password_hash = $1, updated_at = NOW() 
       WHERE LOWER(email) = LOWER($2)
       RETURNING *`), stryMutAct_9fa48("2144") ? [] : (stryCov_9fa48("2144"), [passwordHash, normalizedEmail]));
      return result.rows[0];
    }
  }

  /**
   * Get full learner profile by ID
   */
  async getFullLearnerProfile(id) {
    if (stryMutAct_9fa48("2145")) {
      {}
    } else {
      stryCov_9fa48("2145");
      const result = await db.query(stryMutAct_9fa48("2146") ? `` : (stryCov_9fa48("2146"), `SELECT id, name, email, contest_name, created_at, updated_at, is_email_verified, email_verified_at
       FROM learners 
       WHERE id = $1`), stryMutAct_9fa48("2147") ? [] : (stryCov_9fa48("2147"), [id]));
      return stryMutAct_9fa48("2150") ? result.rows[0] && null : stryMutAct_9fa48("2149") ? false : stryMutAct_9fa48("2148") ? true : (stryCov_9fa48("2148", "2149", "2150"), result.rows[0] || null);
    }
  }

  /**
   * Get full admin profile by ID
   */
  async getFullAdminProfile(id) {
    if (stryMutAct_9fa48("2151")) {
      {}
    } else {
      stryCov_9fa48("2151");
      const result = await db.query(stryMutAct_9fa48("2152") ? `` : (stryCov_9fa48("2152"), `SELECT id, name, email, created_at, updated_at, is_email_verified, email_verified_at
       FROM admins 
       WHERE id = $1`), stryMutAct_9fa48("2153") ? [] : (stryCov_9fa48("2153"), [id]));
      return stryMutAct_9fa48("2156") ? result.rows[0] && null : stryMutAct_9fa48("2155") ? false : stryMutAct_9fa48("2154") ? true : (stryCov_9fa48("2154", "2155", "2156"), result.rows[0] || null);
    }
  }

  /**
   * Update learner profile (name and contest_name)
   */
  async updateLearnerProfile(id, updates) {
    if (stryMutAct_9fa48("2157")) {
      {}
    } else {
      stryCov_9fa48("2157");
      const {
        name,
        contest_name
      } = updates;

      // Build dynamic query based on provided fields
      const fields = stryMutAct_9fa48("2158") ? ["Stryker was here"] : (stryCov_9fa48("2158"), []);
      const values = stryMutAct_9fa48("2159") ? ["Stryker was here"] : (stryCov_9fa48("2159"), []);
      let paramCount = 1;
      if (stryMutAct_9fa48("2162") ? name === undefined : stryMutAct_9fa48("2161") ? false : stryMutAct_9fa48("2160") ? true : (stryCov_9fa48("2160", "2161", "2162"), name !== undefined)) {
        if (stryMutAct_9fa48("2163")) {
          {}
        } else {
          stryCov_9fa48("2163");
          fields.push(stryMutAct_9fa48("2164") ? `` : (stryCov_9fa48("2164"), `name = $${paramCount}`));
          values.push(name);
          stryMutAct_9fa48("2165") ? paramCount-- : (stryCov_9fa48("2165"), paramCount++);
        }
      }
      if (stryMutAct_9fa48("2168") ? contest_name === undefined : stryMutAct_9fa48("2167") ? false : stryMutAct_9fa48("2166") ? true : (stryCov_9fa48("2166", "2167", "2168"), contest_name !== undefined)) {
        if (stryMutAct_9fa48("2169")) {
          {}
        } else {
          stryCov_9fa48("2169");
          fields.push(stryMutAct_9fa48("2170") ? `` : (stryCov_9fa48("2170"), `contest_name = $${paramCount}`));
          values.push(contest_name);
          stryMutAct_9fa48("2171") ? paramCount-- : (stryCov_9fa48("2171"), paramCount++);
        }
      }
      if (stryMutAct_9fa48("2174") ? fields.length !== 0 : stryMutAct_9fa48("2173") ? false : stryMutAct_9fa48("2172") ? true : (stryCov_9fa48("2172", "2173", "2174"), fields.length === 0)) {
        if (stryMutAct_9fa48("2175")) {
          {}
        } else {
          stryCov_9fa48("2175");
          // No updates provided, just return current profile
          return await this.getFullLearnerProfile(id);
        }
      }
      fields.push(stryMutAct_9fa48("2176") ? `` : (stryCov_9fa48("2176"), `updated_at = NOW()`));
      values.push(id);
      const query = stryMutAct_9fa48("2177") ? `` : (stryCov_9fa48("2177"), `
      UPDATE learners 
      SET ${fields.join(stryMutAct_9fa48("2178") ? "" : (stryCov_9fa48("2178"), ', '))}
      WHERE id = $${paramCount}
      RETURNING id, name, email, contest_name, created_at, updated_at, is_email_verified, email_verified_at
    `);
      const result = await db.query(query, values);
      return result.rows[0];
    }
  }

  /**
   * Update admin profile (name)
   */
  async updateAdminProfile(id, name) {
    if (stryMutAct_9fa48("2179")) {
      {}
    } else {
      stryCov_9fa48("2179");
      const result = await db.query(stryMutAct_9fa48("2180") ? `` : (stryCov_9fa48("2180"), `UPDATE admins 
       SET name = $1, updated_at = NOW() 
       WHERE id = $2
       RETURNING id, name, email, created_at, updated_at, is_email_verified, email_verified_at`), stryMutAct_9fa48("2181") ? [] : (stryCov_9fa48("2181"), [name, id]));
      return result.rows[0];
    }
  }
}
export default new AuthRepository();