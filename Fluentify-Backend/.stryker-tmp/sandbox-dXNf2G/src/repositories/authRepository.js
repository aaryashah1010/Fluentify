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
    if (stryMutAct_9fa48("2055")) {
      {}
    } else {
      stryCov_9fa48("2055");
      // Normalize email to lowercase for consistent comparison
      const normalizedEmail = email ? stryMutAct_9fa48("2057") ? email.toUpperCase().trim() : stryMutAct_9fa48("2056") ? email.toLowerCase() : (stryCov_9fa48("2056", "2057"), email.toLowerCase().trim()) : email;
      const result = await db.query(stryMutAct_9fa48("2058") ? `` : (stryCov_9fa48("2058"), `SELECT l.*, 
       EXISTS(SELECT 1 FROM learner_preferences WHERE learner_id = l.id) as has_preferences 
       FROM learners l 
       WHERE LOWER(l.email) = LOWER($1)`), stryMutAct_9fa48("2059") ? [] : (stryCov_9fa48("2059"), [normalizedEmail]));
      return stryMutAct_9fa48("2062") ? result.rows[0] && null : stryMutAct_9fa48("2061") ? false : stryMutAct_9fa48("2060") ? true : (stryCov_9fa48("2060", "2061", "2062"), result.rows[0] || null);
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
    if (stryMutAct_9fa48("2063")) {
      {}
    } else {
      stryCov_9fa48("2063");
      // Normalize email to lowercase for consistent comparison
      const normalizedEmail = email ? stryMutAct_9fa48("2065") ? email.toUpperCase().trim() : stryMutAct_9fa48("2064") ? email.toLowerCase() : (stryCov_9fa48("2064", "2065"), email.toLowerCase().trim()) : email;
      const result = await db.query(stryMutAct_9fa48("2066") ? "" : (stryCov_9fa48("2066"), 'SELECT * FROM admins WHERE LOWER(email) = LOWER($1)'), stryMutAct_9fa48("2067") ? [] : (stryCov_9fa48("2067"), [normalizedEmail]));
      return stryMutAct_9fa48("2070") ? result.rows[0] && null : stryMutAct_9fa48("2069") ? false : stryMutAct_9fa48("2068") ? true : (stryCov_9fa48("2068", "2069", "2070"), result.rows[0] || null);
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
    if (stryMutAct_9fa48("2071")) {
      {}
    } else {
      stryCov_9fa48("2071");
      // Normalize email to lowercase for consistent storage
      const normalizedEmail = email ? stryMutAct_9fa48("2073") ? email.toUpperCase().trim() : stryMutAct_9fa48("2072") ? email.toLowerCase() : (stryCov_9fa48("2072", "2073"), email.toLowerCase().trim()) : email;
      const result = await db.query(stryMutAct_9fa48("2074") ? `` : (stryCov_9fa48("2074"), `INSERT INTO learners (name, email, password_hash, created_at, updated_at) 
       VALUES ($1, $2, $3, NOW(), NOW()) 
       RETURNING *`), stryMutAct_9fa48("2075") ? [] : (stryCov_9fa48("2075"), [name, normalizedEmail, passwordHash]));
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
    if (stryMutAct_9fa48("2076")) {
      {}
    } else {
      stryCov_9fa48("2076");
      // Normalize email to lowercase for consistent storage
      const normalizedEmail = email ? stryMutAct_9fa48("2078") ? email.toUpperCase().trim() : stryMutAct_9fa48("2077") ? email.toLowerCase() : (stryCov_9fa48("2077", "2078"), email.toLowerCase().trim()) : email;
      const result = await db.query(stryMutAct_9fa48("2079") ? "" : (stryCov_9fa48("2079"), 'INSERT INTO admins (name, email, password_hash, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *'), stryMutAct_9fa48("2080") ? [] : (stryCov_9fa48("2080"), [name, normalizedEmail, passwordHash]));
      return result.rows[0];
    }
  }

  /**
   * Find learner by ID
   */
  async findLearnerById(id) {
    if (stryMutAct_9fa48("2081")) {
      {}
    } else {
      stryCov_9fa48("2081");
      const result = await db.query(stryMutAct_9fa48("2082") ? "" : (stryCov_9fa48("2082"), 'SELECT * FROM learners WHERE id = $1'), stryMutAct_9fa48("2083") ? [] : (stryCov_9fa48("2083"), [id]));
      return stryMutAct_9fa48("2086") ? result.rows[0] && null : stryMutAct_9fa48("2085") ? false : stryMutAct_9fa48("2084") ? true : (stryCov_9fa48("2084", "2085", "2086"), result.rows[0] || null);
    }
  }

  /**
   * Find admin by ID
   */
  async findAdminById(id) {
    if (stryMutAct_9fa48("2087")) {
      {}
    } else {
      stryCov_9fa48("2087");
      const result = await db.query(stryMutAct_9fa48("2088") ? "" : (stryCov_9fa48("2088"), 'SELECT * FROM admins WHERE id = $1'), stryMutAct_9fa48("2089") ? [] : (stryCov_9fa48("2089"), [id]));
      return stryMutAct_9fa48("2092") ? result.rows[0] && null : stryMutAct_9fa48("2091") ? false : stryMutAct_9fa48("2090") ? true : (stryCov_9fa48("2090", "2091", "2092"), result.rows[0] || null);
    }
  }

  /**
   * Begin database transaction
   */
  async beginTransaction() {
    if (stryMutAct_9fa48("2093")) {
      {}
    } else {
      stryCov_9fa48("2093");
      await db.query(stryMutAct_9fa48("2094") ? "" : (stryCov_9fa48("2094"), 'BEGIN'));
    }
  }

  /**
   * Commit database transaction
   */
  async commitTransaction() {
    if (stryMutAct_9fa48("2095")) {
      {}
    } else {
      stryCov_9fa48("2095");
      await db.query(stryMutAct_9fa48("2096") ? "" : (stryCov_9fa48("2096"), 'COMMIT'));
    }
  }

  /**
   * Rollback database transaction
   */
  async rollbackTransaction() {
    if (stryMutAct_9fa48("2097")) {
      {}
    } else {
      stryCov_9fa48("2097");
      await db.query(stryMutAct_9fa48("2098") ? "" : (stryCov_9fa48("2098"), 'ROLLBACK'));
    }
  }

  /**
   * Store OTP code in database
   */
  async storeOTP(email, otpCode, otpType, userType) {
    if (stryMutAct_9fa48("2099")) {
      {}
    } else {
      stryCov_9fa48("2099");
      // Set expiration to 2 minutes from now
      const expiresAt = new Date(stryMutAct_9fa48("2100") ? Date.now() - 2 * 60 * 1000 : (stryCov_9fa48("2100"), Date.now() + (stryMutAct_9fa48("2101") ? 2 * 60 / 1000 : (stryCov_9fa48("2101"), (stryMutAct_9fa48("2102") ? 2 / 60 : (stryCov_9fa48("2102"), 2 * 60)) * 1000))));
      const result = await db.query(stryMutAct_9fa48("2103") ? `` : (stryCov_9fa48("2103"), `INSERT INTO otp_codes (email, otp_code, otp_type, user_type, expires_at, created_at) 
       VALUES (LOWER($1), $2, $3, $4, $5, NOW()) 
       RETURNING *`), stryMutAct_9fa48("2104") ? [] : (stryCov_9fa48("2104"), [email, otpCode, otpType, userType, expiresAt]));
      return result.rows[0];
    }
  }

  /**
   * Get the latest OTP record for cooldown checks
   */
  async getLatestOTP(email, otpType, userType) {
    if (stryMutAct_9fa48("2105")) {
      {}
    } else {
      stryCov_9fa48("2105");
      const result = await db.query(stryMutAct_9fa48("2106") ? `` : (stryCov_9fa48("2106"), `SELECT id, created_at FROM otp_codes
       WHERE LOWER(email) = LOWER($1)
       AND otp_type = $2
       AND user_type = $3
       ORDER BY created_at DESC
       LIMIT 1`), stryMutAct_9fa48("2107") ? [] : (stryCov_9fa48("2107"), [email, otpType, userType]));
      return stryMutAct_9fa48("2110") ? result.rows[0] && null : stryMutAct_9fa48("2109") ? false : stryMutAct_9fa48("2108") ? true : (stryCov_9fa48("2108", "2109", "2110"), result.rows[0] || null);
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(email, otpCode, otpType, userType) {
    if (stryMutAct_9fa48("2111")) {
      {}
    } else {
      stryCov_9fa48("2111");
      const result = await db.query(stryMutAct_9fa48("2112") ? `` : (stryCov_9fa48("2112"), `SELECT * FROM otp_codes 
       WHERE LOWER(email) = LOWER($1)
       AND otp_code = $2 
       AND otp_type = $3 
       AND user_type = $4 
       AND is_used = false 
       AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`), stryMutAct_9fa48("2113") ? [] : (stryCov_9fa48("2113"), [email, otpCode, otpType, userType]));
      return stryMutAct_9fa48("2116") ? result.rows[0] && null : stryMutAct_9fa48("2115") ? false : stryMutAct_9fa48("2114") ? true : (stryCov_9fa48("2114", "2115", "2116"), result.rows[0] || null);
    }
  }

  /**
   * Mark OTP as used
   */
  async markOTPAsUsed(otpId) {
    if (stryMutAct_9fa48("2117")) {
      {}
    } else {
      stryCov_9fa48("2117");
      await db.query(stryMutAct_9fa48("2118") ? "" : (stryCov_9fa48("2118"), 'UPDATE otp_codes SET is_used = true WHERE id = $1'), stryMutAct_9fa48("2119") ? [] : (stryCov_9fa48("2119"), [otpId]));
    }
  }

  /**
   * Delete all OTPs for an email (cleanup)
   */
  async deleteOTPsByEmail(email, otpType, userType) {
    if (stryMutAct_9fa48("2120")) {
      {}
    } else {
      stryCov_9fa48("2120");
      await db.query(stryMutAct_9fa48("2121") ? "" : (stryCov_9fa48("2121"), 'DELETE FROM otp_codes WHERE LOWER(email) = LOWER($1) AND otp_type = $2 AND user_type = $3'), stryMutAct_9fa48("2122") ? [] : (stryCov_9fa48("2122"), [email, otpType, userType]));
    }
  }

  /**
   * Mark learner email as verified
   * 
   * FIX: Normalizes email to ensure it matches the email stored during account creation.
   */
  async markLearnerEmailVerified(email) {
    if (stryMutAct_9fa48("2123")) {
      {}
    } else {
      stryCov_9fa48("2123");
      const normalizedEmail = email ? stryMutAct_9fa48("2125") ? email.toUpperCase().trim() : stryMutAct_9fa48("2124") ? email.toLowerCase() : (stryCov_9fa48("2124", "2125"), email.toLowerCase().trim()) : email;
      const result = await db.query(stryMutAct_9fa48("2126") ? `` : (stryCov_9fa48("2126"), `UPDATE learners 
       SET is_email_verified = true, email_verified_at = NOW(), updated_at = NOW() 
       WHERE LOWER(email) = LOWER($1)
       RETURNING *`), stryMutAct_9fa48("2127") ? [] : (stryCov_9fa48("2127"), [normalizedEmail]));
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
    if (stryMutAct_9fa48("2128")) {
      {}
    } else {
      stryCov_9fa48("2128");
      const normalizedEmail = email ? stryMutAct_9fa48("2130") ? email.toUpperCase().trim() : stryMutAct_9fa48("2129") ? email.toLowerCase() : (stryCov_9fa48("2129", "2130"), email.toLowerCase().trim()) : email;
      const result = await db.query(stryMutAct_9fa48("2131") ? `` : (stryCov_9fa48("2131"), `UPDATE admins 
       SET is_email_verified = true, email_verified_at = NOW(), updated_at = NOW() 
       WHERE LOWER(email) = LOWER($1)
       RETURNING *`), stryMutAct_9fa48("2132") ? [] : (stryCov_9fa48("2132"), [normalizedEmail]));
      return result.rows[0];
    }
  }

  /**
   * Update learner password
   * 
   * FIX: Normalizes email to ensure it matches the email stored during account creation.
   */
  async updateLearnerPassword(email, passwordHash) {
    if (stryMutAct_9fa48("2133")) {
      {}
    } else {
      stryCov_9fa48("2133");
      const normalizedEmail = email ? stryMutAct_9fa48("2135") ? email.toUpperCase().trim() : stryMutAct_9fa48("2134") ? email.toLowerCase() : (stryCov_9fa48("2134", "2135"), email.toLowerCase().trim()) : email;
      const result = await db.query(stryMutAct_9fa48("2136") ? `` : (stryCov_9fa48("2136"), `UPDATE learners 
       SET password_hash = $1, updated_at = NOW() 
       WHERE LOWER(email) = LOWER($2)
       RETURNING *`), stryMutAct_9fa48("2137") ? [] : (stryCov_9fa48("2137"), [passwordHash, normalizedEmail]));
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
    if (stryMutAct_9fa48("2138")) {
      {}
    } else {
      stryCov_9fa48("2138");
      const normalizedEmail = email ? stryMutAct_9fa48("2140") ? email.toUpperCase().trim() : stryMutAct_9fa48("2139") ? email.toLowerCase() : (stryCov_9fa48("2139", "2140"), email.toLowerCase().trim()) : email;
      const result = await db.query(stryMutAct_9fa48("2141") ? `` : (stryCov_9fa48("2141"), `UPDATE admins 
       SET password_hash = $1, updated_at = NOW() 
       WHERE LOWER(email) = LOWER($2)
       RETURNING *`), stryMutAct_9fa48("2142") ? [] : (stryCov_9fa48("2142"), [passwordHash, normalizedEmail]));
      return result.rows[0];
    }
  }

  /**
   * Get full learner profile by ID
   */
  async getFullLearnerProfile(id) {
    if (stryMutAct_9fa48("2143")) {
      {}
    } else {
      stryCov_9fa48("2143");
      const result = await db.query(stryMutAct_9fa48("2144") ? `` : (stryCov_9fa48("2144"), `SELECT id, name, email, contest_name, created_at, updated_at, is_email_verified, email_verified_at
       FROM learners 
       WHERE id = $1`), stryMutAct_9fa48("2145") ? [] : (stryCov_9fa48("2145"), [id]));
      return stryMutAct_9fa48("2148") ? result.rows[0] && null : stryMutAct_9fa48("2147") ? false : stryMutAct_9fa48("2146") ? true : (stryCov_9fa48("2146", "2147", "2148"), result.rows[0] || null);
    }
  }

  /**
   * Get full admin profile by ID
   */
  async getFullAdminProfile(id) {
    if (stryMutAct_9fa48("2149")) {
      {}
    } else {
      stryCov_9fa48("2149");
      const result = await db.query(stryMutAct_9fa48("2150") ? `` : (stryCov_9fa48("2150"), `SELECT id, name, email, created_at, updated_at, is_email_verified, email_verified_at
       FROM admins 
       WHERE id = $1`), stryMutAct_9fa48("2151") ? [] : (stryCov_9fa48("2151"), [id]));
      return stryMutAct_9fa48("2154") ? result.rows[0] && null : stryMutAct_9fa48("2153") ? false : stryMutAct_9fa48("2152") ? true : (stryCov_9fa48("2152", "2153", "2154"), result.rows[0] || null);
    }
  }

  /**
   * Update learner profile (name and contest_name)
   */
  async updateLearnerProfile(id, updates) {
    if (stryMutAct_9fa48("2155")) {
      {}
    } else {
      stryCov_9fa48("2155");
      const {
        name,
        contest_name
      } = updates;

      // Build dynamic query based on provided fields
      const fields = stryMutAct_9fa48("2156") ? ["Stryker was here"] : (stryCov_9fa48("2156"), []);
      const values = stryMutAct_9fa48("2157") ? ["Stryker was here"] : (stryCov_9fa48("2157"), []);
      let paramCount = 1;
      if (stryMutAct_9fa48("2160") ? name === undefined : stryMutAct_9fa48("2159") ? false : stryMutAct_9fa48("2158") ? true : (stryCov_9fa48("2158", "2159", "2160"), name !== undefined)) {
        if (stryMutAct_9fa48("2161")) {
          {}
        } else {
          stryCov_9fa48("2161");
          fields.push(stryMutAct_9fa48("2162") ? `` : (stryCov_9fa48("2162"), `name = $${paramCount}`));
          values.push(name);
          stryMutAct_9fa48("2163") ? paramCount-- : (stryCov_9fa48("2163"), paramCount++);
        }
      }
      if (stryMutAct_9fa48("2166") ? contest_name === undefined : stryMutAct_9fa48("2165") ? false : stryMutAct_9fa48("2164") ? true : (stryCov_9fa48("2164", "2165", "2166"), contest_name !== undefined)) {
        if (stryMutAct_9fa48("2167")) {
          {}
        } else {
          stryCov_9fa48("2167");
          fields.push(stryMutAct_9fa48("2168") ? `` : (stryCov_9fa48("2168"), `contest_name = $${paramCount}`));
          values.push(contest_name);
          stryMutAct_9fa48("2169") ? paramCount-- : (stryCov_9fa48("2169"), paramCount++);
        }
      }
      if (stryMutAct_9fa48("2172") ? fields.length !== 0 : stryMutAct_9fa48("2171") ? false : stryMutAct_9fa48("2170") ? true : (stryCov_9fa48("2170", "2171", "2172"), fields.length === 0)) {
        if (stryMutAct_9fa48("2173")) {
          {}
        } else {
          stryCov_9fa48("2173");
          // No updates provided, just return current profile
          return await this.getFullLearnerProfile(id);
        }
      }
      fields.push(stryMutAct_9fa48("2174") ? `` : (stryCov_9fa48("2174"), `updated_at = NOW()`));
      values.push(id);
      const query = stryMutAct_9fa48("2175") ? `` : (stryCov_9fa48("2175"), `
      UPDATE learners 
      SET ${fields.join(stryMutAct_9fa48("2176") ? "" : (stryCov_9fa48("2176"), ', '))}
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
    if (stryMutAct_9fa48("2177")) {
      {}
    } else {
      stryCov_9fa48("2177");
      const result = await db.query(stryMutAct_9fa48("2178") ? `` : (stryCov_9fa48("2178"), `UPDATE admins 
       SET name = $1, updated_at = NOW() 
       WHERE id = $2
       RETURNING id, name, email, created_at, updated_at, is_email_verified, email_verified_at`), stryMutAct_9fa48("2179") ? [] : (stryCov_9fa48("2179"), [name, id]));
      return result.rows[0];
    }
  }
}
export default new AuthRepository();