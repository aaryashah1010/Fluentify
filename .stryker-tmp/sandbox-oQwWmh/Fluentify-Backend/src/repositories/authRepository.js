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
    if (stryMutAct_9fa48("2217")) {
      {}
    } else {
      stryCov_9fa48("2217");
      // Normalize email to lowercase for consistent comparison
      const normalizedEmail = email ? stryMutAct_9fa48("2219") ? email.toUpperCase().trim() : stryMutAct_9fa48("2218") ? email.toLowerCase() : (stryCov_9fa48("2218", "2219"), email.toLowerCase().trim()) : email;
      const result = await db.query(stryMutAct_9fa48("2220") ? `` : (stryCov_9fa48("2220"), `SELECT l.*, 
       EXISTS(SELECT 1 FROM learner_preferences WHERE learner_id = l.id) as has_preferences 
       FROM learners l 
       WHERE LOWER(l.email) = LOWER($1)`), stryMutAct_9fa48("2221") ? [] : (stryCov_9fa48("2221"), [normalizedEmail]));
      return stryMutAct_9fa48("2224") ? result.rows[0] && null : stryMutAct_9fa48("2223") ? false : stryMutAct_9fa48("2222") ? true : (stryCov_9fa48("2222", "2223", "2224"), result.rows[0] || null);
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
    if (stryMutAct_9fa48("2225")) {
      {}
    } else {
      stryCov_9fa48("2225");
      // Normalize email to lowercase for consistent comparison
      const normalizedEmail = email ? stryMutAct_9fa48("2227") ? email.toUpperCase().trim() : stryMutAct_9fa48("2226") ? email.toLowerCase() : (stryCov_9fa48("2226", "2227"), email.toLowerCase().trim()) : email;
      const result = await db.query(stryMutAct_9fa48("2228") ? "" : (stryCov_9fa48("2228"), 'SELECT * FROM admins WHERE LOWER(email) = LOWER($1)'), stryMutAct_9fa48("2229") ? [] : (stryCov_9fa48("2229"), [normalizedEmail]));
      return stryMutAct_9fa48("2232") ? result.rows[0] && null : stryMutAct_9fa48("2231") ? false : stryMutAct_9fa48("2230") ? true : (stryCov_9fa48("2230", "2231", "2232"), result.rows[0] || null);
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
    if (stryMutAct_9fa48("2233")) {
      {}
    } else {
      stryCov_9fa48("2233");
      // Normalize email to lowercase for consistent storage
      const normalizedEmail = email ? stryMutAct_9fa48("2235") ? email.toUpperCase().trim() : stryMutAct_9fa48("2234") ? email.toLowerCase() : (stryCov_9fa48("2234", "2235"), email.toLowerCase().trim()) : email;
      const result = await db.query(stryMutAct_9fa48("2236") ? `` : (stryCov_9fa48("2236"), `INSERT INTO learners (name, email, password_hash, created_at, updated_at) 
       VALUES ($1, $2, $3, NOW(), NOW()) 
       RETURNING *`), stryMutAct_9fa48("2237") ? [] : (stryCov_9fa48("2237"), [name, normalizedEmail, passwordHash]));
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
    if (stryMutAct_9fa48("2238")) {
      {}
    } else {
      stryCov_9fa48("2238");
      // Normalize email to lowercase for consistent storage
      const normalizedEmail = email ? stryMutAct_9fa48("2240") ? email.toUpperCase().trim() : stryMutAct_9fa48("2239") ? email.toLowerCase() : (stryCov_9fa48("2239", "2240"), email.toLowerCase().trim()) : email;
      const result = await db.query(stryMutAct_9fa48("2241") ? "" : (stryCov_9fa48("2241"), 'INSERT INTO admins (name, email, password_hash, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *'), stryMutAct_9fa48("2242") ? [] : (stryCov_9fa48("2242"), [name, normalizedEmail, passwordHash]));
      return result.rows[0];
    }
  }

  /**
   * Find learner by ID
   */
  async findLearnerById(id) {
    if (stryMutAct_9fa48("2243")) {
      {}
    } else {
      stryCov_9fa48("2243");
      const result = await db.query(stryMutAct_9fa48("2244") ? "" : (stryCov_9fa48("2244"), 'SELECT * FROM learners WHERE id = $1'), stryMutAct_9fa48("2245") ? [] : (stryCov_9fa48("2245"), [id]));
      return stryMutAct_9fa48("2248") ? result.rows[0] && null : stryMutAct_9fa48("2247") ? false : stryMutAct_9fa48("2246") ? true : (stryCov_9fa48("2246", "2247", "2248"), result.rows[0] || null);
    }
  }

  /**
   * Find admin by ID
   */
  async findAdminById(id) {
    if (stryMutAct_9fa48("2249")) {
      {}
    } else {
      stryCov_9fa48("2249");
      const result = await db.query(stryMutAct_9fa48("2250") ? "" : (stryCov_9fa48("2250"), 'SELECT * FROM admins WHERE id = $1'), stryMutAct_9fa48("2251") ? [] : (stryCov_9fa48("2251"), [id]));
      return stryMutAct_9fa48("2254") ? result.rows[0] && null : stryMutAct_9fa48("2253") ? false : stryMutAct_9fa48("2252") ? true : (stryCov_9fa48("2252", "2253", "2254"), result.rows[0] || null);
    }
  }

  /**
   * Begin database transaction
   */
  async beginTransaction() {
    if (stryMutAct_9fa48("2255")) {
      {}
    } else {
      stryCov_9fa48("2255");
      await db.query(stryMutAct_9fa48("2256") ? "" : (stryCov_9fa48("2256"), 'BEGIN'));
    }
  }

  /**
   * Commit database transaction
   */
  async commitTransaction() {
    if (stryMutAct_9fa48("2257")) {
      {}
    } else {
      stryCov_9fa48("2257");
      await db.query(stryMutAct_9fa48("2258") ? "" : (stryCov_9fa48("2258"), 'COMMIT'));
    }
  }

  /**
   * Rollback database transaction
   */
  async rollbackTransaction() {
    if (stryMutAct_9fa48("2259")) {
      {}
    } else {
      stryCov_9fa48("2259");
      await db.query(stryMutAct_9fa48("2260") ? "" : (stryCov_9fa48("2260"), 'ROLLBACK'));
    }
  }

  /**
   * Store OTP code in database
   */
  async storeOTP(email, otpCode, otpType, userType) {
    if (stryMutAct_9fa48("2261")) {
      {}
    } else {
      stryCov_9fa48("2261");
      // Set expiration to 2 minutes from now
      const expiresAt = new Date(stryMutAct_9fa48("2262") ? Date.now() - 2 * 60 * 1000 : (stryCov_9fa48("2262"), Date.now() + (stryMutAct_9fa48("2263") ? 2 * 60 / 1000 : (stryCov_9fa48("2263"), (stryMutAct_9fa48("2264") ? 2 / 60 : (stryCov_9fa48("2264"), 2 * 60)) * 1000))));
      const result = await db.query(stryMutAct_9fa48("2265") ? `` : (stryCov_9fa48("2265"), `INSERT INTO otp_codes (email, otp_code, otp_type, user_type, expires_at, created_at) 
       VALUES (LOWER($1), $2, $3, $4, $5, NOW()) 
       RETURNING *`), stryMutAct_9fa48("2266") ? [] : (stryCov_9fa48("2266"), [email, otpCode, otpType, userType, expiresAt]));
      return result.rows[0];
    }
  }

  /**
   * Get the latest OTP record for cooldown checks
   */
  async getLatestOTP(email, otpType, userType) {
    if (stryMutAct_9fa48("2267")) {
      {}
    } else {
      stryCov_9fa48("2267");
      const result = await db.query(stryMutAct_9fa48("2268") ? `` : (stryCov_9fa48("2268"), `SELECT id, created_at FROM otp_codes
       WHERE LOWER(email) = LOWER($1)
       AND otp_type = $2
       AND user_type = $3
       ORDER BY created_at DESC
       LIMIT 1`), stryMutAct_9fa48("2269") ? [] : (stryCov_9fa48("2269"), [email, otpType, userType]));
      return stryMutAct_9fa48("2272") ? result.rows[0] && null : stryMutAct_9fa48("2271") ? false : stryMutAct_9fa48("2270") ? true : (stryCov_9fa48("2270", "2271", "2272"), result.rows[0] || null);
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(email, otpCode, otpType, userType) {
    if (stryMutAct_9fa48("2273")) {
      {}
    } else {
      stryCov_9fa48("2273");
      const result = await db.query(stryMutAct_9fa48("2274") ? `` : (stryCov_9fa48("2274"), `SELECT * FROM otp_codes 
       WHERE LOWER(email) = LOWER($1)
       AND otp_code = $2 
       AND otp_type = $3 
       AND user_type = $4 
       AND is_used = false 
       AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`), stryMutAct_9fa48("2275") ? [] : (stryCov_9fa48("2275"), [email, otpCode, otpType, userType]));
      return stryMutAct_9fa48("2278") ? result.rows[0] && null : stryMutAct_9fa48("2277") ? false : stryMutAct_9fa48("2276") ? true : (stryCov_9fa48("2276", "2277", "2278"), result.rows[0] || null);
    }
  }

  /**
   * Mark OTP as used
   */
  async markOTPAsUsed(otpId) {
    if (stryMutAct_9fa48("2279")) {
      {}
    } else {
      stryCov_9fa48("2279");
      await db.query(stryMutAct_9fa48("2280") ? "" : (stryCov_9fa48("2280"), 'UPDATE otp_codes SET is_used = true WHERE id = $1'), stryMutAct_9fa48("2281") ? [] : (stryCov_9fa48("2281"), [otpId]));
    }
  }

  /**
   * Delete all OTPs for an email (cleanup)
   */
  async deleteOTPsByEmail(email, otpType, userType) {
    if (stryMutAct_9fa48("2282")) {
      {}
    } else {
      stryCov_9fa48("2282");
      await db.query(stryMutAct_9fa48("2283") ? "" : (stryCov_9fa48("2283"), 'DELETE FROM otp_codes WHERE LOWER(email) = LOWER($1) AND otp_type = $2 AND user_type = $3'), stryMutAct_9fa48("2284") ? [] : (stryCov_9fa48("2284"), [email, otpType, userType]));
    }
  }

  /**
   * Mark learner email as verified
   * 
   * FIX: Normalizes email to ensure it matches the email stored during account creation.
   */
  async markLearnerEmailVerified(email) {
    if (stryMutAct_9fa48("2285")) {
      {}
    } else {
      stryCov_9fa48("2285");
      const normalizedEmail = email ? stryMutAct_9fa48("2287") ? email.toUpperCase().trim() : stryMutAct_9fa48("2286") ? email.toLowerCase() : (stryCov_9fa48("2286", "2287"), email.toLowerCase().trim()) : email;
      const result = await db.query(stryMutAct_9fa48("2288") ? `` : (stryCov_9fa48("2288"), `UPDATE learners 
       SET is_email_verified = true, email_verified_at = NOW(), updated_at = NOW() 
       WHERE LOWER(email) = LOWER($1)
       RETURNING *`), stryMutAct_9fa48("2289") ? [] : (stryCov_9fa48("2289"), [normalizedEmail]));
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
    if (stryMutAct_9fa48("2290")) {
      {}
    } else {
      stryCov_9fa48("2290");
      const normalizedEmail = email ? stryMutAct_9fa48("2292") ? email.toUpperCase().trim() : stryMutAct_9fa48("2291") ? email.toLowerCase() : (stryCov_9fa48("2291", "2292"), email.toLowerCase().trim()) : email;
      const result = await db.query(stryMutAct_9fa48("2293") ? `` : (stryCov_9fa48("2293"), `UPDATE admins 
       SET is_email_verified = true, email_verified_at = NOW(), updated_at = NOW() 
       WHERE LOWER(email) = LOWER($1)
       RETURNING *`), stryMutAct_9fa48("2294") ? [] : (stryCov_9fa48("2294"), [normalizedEmail]));
      return result.rows[0];
    }
  }

  /**
   * Update learner password
   * 
   * FIX: Normalizes email to ensure it matches the email stored during account creation.
   */
  async updateLearnerPassword(email, passwordHash) {
    if (stryMutAct_9fa48("2295")) {
      {}
    } else {
      stryCov_9fa48("2295");
      const normalizedEmail = email ? stryMutAct_9fa48("2297") ? email.toUpperCase().trim() : stryMutAct_9fa48("2296") ? email.toLowerCase() : (stryCov_9fa48("2296", "2297"), email.toLowerCase().trim()) : email;
      const result = await db.query(stryMutAct_9fa48("2298") ? `` : (stryCov_9fa48("2298"), `UPDATE learners 
       SET password_hash = $1, updated_at = NOW() 
       WHERE LOWER(email) = LOWER($2)
       RETURNING *`), stryMutAct_9fa48("2299") ? [] : (stryCov_9fa48("2299"), [passwordHash, normalizedEmail]));
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
    if (stryMutAct_9fa48("2300")) {
      {}
    } else {
      stryCov_9fa48("2300");
      const normalizedEmail = email ? stryMutAct_9fa48("2302") ? email.toUpperCase().trim() : stryMutAct_9fa48("2301") ? email.toLowerCase() : (stryCov_9fa48("2301", "2302"), email.toLowerCase().trim()) : email;
      const result = await db.query(stryMutAct_9fa48("2303") ? `` : (stryCov_9fa48("2303"), `UPDATE admins 
       SET password_hash = $1, updated_at = NOW() 
       WHERE LOWER(email) = LOWER($2)
       RETURNING *`), stryMutAct_9fa48("2304") ? [] : (stryCov_9fa48("2304"), [passwordHash, normalizedEmail]));
      return result.rows[0];
    }
  }

  /**
   * Get full learner profile by ID
   */
  async getFullLearnerProfile(id) {
    if (stryMutAct_9fa48("2305")) {
      {}
    } else {
      stryCov_9fa48("2305");
      const result = await db.query(stryMutAct_9fa48("2306") ? `` : (stryCov_9fa48("2306"), `SELECT id, name, email, contest_name, created_at, updated_at, is_email_verified, email_verified_at
       FROM learners 
       WHERE id = $1`), stryMutAct_9fa48("2307") ? [] : (stryCov_9fa48("2307"), [id]));
      return stryMutAct_9fa48("2310") ? result.rows[0] && null : stryMutAct_9fa48("2309") ? false : stryMutAct_9fa48("2308") ? true : (stryCov_9fa48("2308", "2309", "2310"), result.rows[0] || null);
    }
  }

  /**
   * Get full admin profile by ID
   */
  async getFullAdminProfile(id) {
    if (stryMutAct_9fa48("2311")) {
      {}
    } else {
      stryCov_9fa48("2311");
      const result = await db.query(stryMutAct_9fa48("2312") ? `` : (stryCov_9fa48("2312"), `SELECT id, name, email, created_at, updated_at, is_email_verified, email_verified_at
       FROM admins 
       WHERE id = $1`), stryMutAct_9fa48("2313") ? [] : (stryCov_9fa48("2313"), [id]));
      return stryMutAct_9fa48("2316") ? result.rows[0] && null : stryMutAct_9fa48("2315") ? false : stryMutAct_9fa48("2314") ? true : (stryCov_9fa48("2314", "2315", "2316"), result.rows[0] || null);
    }
  }

  /**
   * Update learner profile (name and contest_name)
   */
  async updateLearnerProfile(id, updates) {
    if (stryMutAct_9fa48("2317")) {
      {}
    } else {
      stryCov_9fa48("2317");
      const {
        name,
        contest_name
      } = updates;

      // Build dynamic query based on provided fields
      const fields = stryMutAct_9fa48("2318") ? ["Stryker was here"] : (stryCov_9fa48("2318"), []);
      const values = stryMutAct_9fa48("2319") ? ["Stryker was here"] : (stryCov_9fa48("2319"), []);
      let paramCount = 1;
      if (stryMutAct_9fa48("2322") ? name === undefined : stryMutAct_9fa48("2321") ? false : stryMutAct_9fa48("2320") ? true : (stryCov_9fa48("2320", "2321", "2322"), name !== undefined)) {
        if (stryMutAct_9fa48("2323")) {
          {}
        } else {
          stryCov_9fa48("2323");
          fields.push(stryMutAct_9fa48("2324") ? `` : (stryCov_9fa48("2324"), `name = $${paramCount}`));
          values.push(name);
          stryMutAct_9fa48("2325") ? paramCount-- : (stryCov_9fa48("2325"), paramCount++);
        }
      }
      if (stryMutAct_9fa48("2328") ? contest_name === undefined : stryMutAct_9fa48("2327") ? false : stryMutAct_9fa48("2326") ? true : (stryCov_9fa48("2326", "2327", "2328"), contest_name !== undefined)) {
        if (stryMutAct_9fa48("2329")) {
          {}
        } else {
          stryCov_9fa48("2329");
          fields.push(stryMutAct_9fa48("2330") ? `` : (stryCov_9fa48("2330"), `contest_name = $${paramCount}`));
          values.push(contest_name);
          stryMutAct_9fa48("2331") ? paramCount-- : (stryCov_9fa48("2331"), paramCount++);
        }
      }
      if (stryMutAct_9fa48("2334") ? fields.length !== 0 : stryMutAct_9fa48("2333") ? false : stryMutAct_9fa48("2332") ? true : (stryCov_9fa48("2332", "2333", "2334"), fields.length === 0)) {
        if (stryMutAct_9fa48("2335")) {
          {}
        } else {
          stryCov_9fa48("2335");
          // No updates provided, just return current profile
          return await this.getFullLearnerProfile(id);
        }
      }
      fields.push(stryMutAct_9fa48("2336") ? `` : (stryCov_9fa48("2336"), `updated_at = NOW()`));
      values.push(id);
      const query = stryMutAct_9fa48("2337") ? `` : (stryCov_9fa48("2337"), `
      UPDATE learners 
      SET ${fields.join(stryMutAct_9fa48("2338") ? "" : (stryCov_9fa48("2338"), ', '))}
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
    if (stryMutAct_9fa48("2339")) {
      {}
    } else {
      stryCov_9fa48("2339");
      const result = await db.query(stryMutAct_9fa48("2340") ? `` : (stryCov_9fa48("2340"), `UPDATE admins 
       SET name = $1, updated_at = NOW() 
       WHERE id = $2
       RETURNING id, name, email, created_at, updated_at, is_email_verified, email_verified_at`), stryMutAct_9fa48("2341") ? [] : (stryCov_9fa48("2341"), [name, id]));
      return result.rows[0];
    }
  }
}
export default new AuthRepository();