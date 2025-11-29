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
import db, { pool } from '../config/db.js';
class ContestRepository {
  /**
   * Admin: Create a new contest
   */
  async adminCreateContest(title, description, startTime, endTime) {
    if (stryMutAct_9fa48("2243")) {
      {}
    } else {
      stryCov_9fa48("2243");
      const result = await db.query(stryMutAct_9fa48("2244") ? `` : (stryCov_9fa48("2244"), `INSERT INTO contests (title, description, start_time, end_time, status, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, 'DRAFT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
       RETURNING *`), stryMutAct_9fa48("2245") ? [] : (stryCov_9fa48("2245"), [title, description, startTime, endTime]));
      return result.rows[0];
    }
  }

  /**
   * Admin: Add a question to a contest
   */
  async adminAddQuestion(contestId, questionText, options, correctOptionId) {
    if (stryMutAct_9fa48("2246")) {
      {}
    } else {
      stryCov_9fa48("2246");
      const result = await db.query(stryMutAct_9fa48("2247") ? `` : (stryCov_9fa48("2247"), `INSERT INTO contest_questions (contest_id, question_text, options, correct_option_id, created_at) 
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) 
       RETURNING *`), stryMutAct_9fa48("2248") ? [] : (stryCov_9fa48("2248"), [contestId, questionText, JSON.stringify(options), correctOptionId]));
      return result.rows[0];
    }
  }

  /**
   * Admin: Update contest details
   */
  async adminUpdateContest(contestId, updates) {
    if (stryMutAct_9fa48("2249")) {
      {}
    } else {
      stryCov_9fa48("2249");
      const fields = stryMutAct_9fa48("2250") ? ["Stryker was here"] : (stryCov_9fa48("2250"), []);
      const values = stryMutAct_9fa48("2251") ? ["Stryker was here"] : (stryCov_9fa48("2251"), []);
      let paramIndex = 1;
      if (stryMutAct_9fa48("2254") ? updates.title === undefined : stryMutAct_9fa48("2253") ? false : stryMutAct_9fa48("2252") ? true : (stryCov_9fa48("2252", "2253", "2254"), updates.title !== undefined)) {
        if (stryMutAct_9fa48("2255")) {
          {}
        } else {
          stryCov_9fa48("2255");
          fields.push(stryMutAct_9fa48("2256") ? `` : (stryCov_9fa48("2256"), `title = $${stryMutAct_9fa48("2257") ? paramIndex-- : (stryCov_9fa48("2257"), paramIndex++)}`));
          values.push(updates.title);
        }
      }
      if (stryMutAct_9fa48("2260") ? updates.description === undefined : stryMutAct_9fa48("2259") ? false : stryMutAct_9fa48("2258") ? true : (stryCov_9fa48("2258", "2259", "2260"), updates.description !== undefined)) {
        if (stryMutAct_9fa48("2261")) {
          {}
        } else {
          stryCov_9fa48("2261");
          fields.push(stryMutAct_9fa48("2262") ? `` : (stryCov_9fa48("2262"), `description = $${stryMutAct_9fa48("2263") ? paramIndex-- : (stryCov_9fa48("2263"), paramIndex++)}`));
          values.push(updates.description);
        }
      }
      if (stryMutAct_9fa48("2266") ? updates.start_time === undefined : stryMutAct_9fa48("2265") ? false : stryMutAct_9fa48("2264") ? true : (stryCov_9fa48("2264", "2265", "2266"), updates.start_time !== undefined)) {
        if (stryMutAct_9fa48("2267")) {
          {}
        } else {
          stryCov_9fa48("2267");
          fields.push(stryMutAct_9fa48("2268") ? `` : (stryCov_9fa48("2268"), `start_time = $${stryMutAct_9fa48("2269") ? paramIndex-- : (stryCov_9fa48("2269"), paramIndex++)}`));
          values.push(updates.start_time);
        }
      }
      if (stryMutAct_9fa48("2272") ? updates.end_time === undefined : stryMutAct_9fa48("2271") ? false : stryMutAct_9fa48("2270") ? true : (stryCov_9fa48("2270", "2271", "2272"), updates.end_time !== undefined)) {
        if (stryMutAct_9fa48("2273")) {
          {}
        } else {
          stryCov_9fa48("2273");
          fields.push(stryMutAct_9fa48("2274") ? `` : (stryCov_9fa48("2274"), `end_time = $${stryMutAct_9fa48("2275") ? paramIndex-- : (stryCov_9fa48("2275"), paramIndex++)}`));
          values.push(updates.end_time);
        }
      }
      fields.push(stryMutAct_9fa48("2276") ? `` : (stryCov_9fa48("2276"), `updated_at = CURRENT_TIMESTAMP`));
      values.push(contestId);
      const result = await db.query(stryMutAct_9fa48("2277") ? `` : (stryCov_9fa48("2277"), `UPDATE contests 
       SET ${fields.join(stryMutAct_9fa48("2278") ? "" : (stryCov_9fa48("2278"), ', '))}
       WHERE id = $${paramIndex}
       RETURNING *`), values);
      return result.rows[0];
    }
  }

  /**
   * Admin: Publish a contest (change status to PUBLISHED)
   */
  async adminPublishContest(contestId) {
    if (stryMutAct_9fa48("2279")) {
      {}
    } else {
      stryCov_9fa48("2279");
      const result = await db.query(stryMutAct_9fa48("2280") ? `` : (stryCov_9fa48("2280"), `UPDATE contests 
       SET status = 'PUBLISHED', updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`), stryMutAct_9fa48("2281") ? [] : (stryCov_9fa48("2281"), [contestId]));
      return result.rows[0];
    }
  }

  /**
   * Admin: Get all contests
   */
  async adminGetAllContests() {
    if (stryMutAct_9fa48("2282")) {
      {}
    } else {
      stryCov_9fa48("2282");
      const result = await db.query(stryMutAct_9fa48("2283") ? `` : (stryCov_9fa48("2283"), `SELECT c.*, 
              (SELECT COUNT(*) FROM contest_questions WHERE contest_id = c.id) as question_count,
              (SELECT COUNT(*) FROM contest_scores WHERE contest_id = c.id) as participant_count
       FROM contests c 
       ORDER BY c.created_at DESC`));
      return result.rows;
    }
  }

  /**
   * Admin: Get contest by ID with questions
   */
  async adminGetContestById(contestId) {
    if (stryMutAct_9fa48("2284")) {
      {}
    } else {
      stryCov_9fa48("2284");
      const contestResult = await db.query(stryMutAct_9fa48("2285") ? "" : (stryCov_9fa48("2285"), 'SELECT * FROM contests WHERE id = $1'), stryMutAct_9fa48("2286") ? [] : (stryCov_9fa48("2286"), [contestId]));
      if (stryMutAct_9fa48("2289") ? contestResult.rows.length !== 0 : stryMutAct_9fa48("2288") ? false : stryMutAct_9fa48("2287") ? true : (stryCov_9fa48("2287", "2288", "2289"), contestResult.rows.length === 0)) {
        if (stryMutAct_9fa48("2290")) {
          {}
        } else {
          stryCov_9fa48("2290");
          return null;
        }
      }
      const questionsResult = await db.query(stryMutAct_9fa48("2291") ? "" : (stryCov_9fa48("2291"), 'SELECT * FROM contest_questions WHERE contest_id = $1 ORDER BY id'), stryMutAct_9fa48("2292") ? [] : (stryCov_9fa48("2292"), [contestId]));
      return stryMutAct_9fa48("2293") ? {} : (stryCov_9fa48("2293"), {
        ...contestResult.rows[0],
        questions: questionsResult.rows
      });
    }
  }

  /**
   * Admin: Update contest status
   */
  async updateContestStatus(contestId, status) {
    if (stryMutAct_9fa48("2294")) {
      {}
    } else {
      stryCov_9fa48("2294");
      const result = await db.query(stryMutAct_9fa48("2295") ? `` : (stryCov_9fa48("2295"), `UPDATE contests 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`), stryMutAct_9fa48("2296") ? [] : (stryCov_9fa48("2296"), [status, contestId]));
      return result.rows[0];
    }
  }

  /**
   * Admin: Delete a contest
   */
  async adminDeleteContest(contestId) {
    if (stryMutAct_9fa48("2297")) {
      {}
    } else {
      stryCov_9fa48("2297");
      const result = await db.query(stryMutAct_9fa48("2298") ? "" : (stryCov_9fa48("2298"), 'DELETE FROM contests WHERE id = $1 RETURNING *'), stryMutAct_9fa48("2299") ? [] : (stryCov_9fa48("2299"), [contestId]));
      return result.rows[0];
    }
  }

  /**
   * Learner: Get available contests (PUBLISHED or ACTIVE)
   */
  async learnerGetAvailableContests(learnerId) {
    if (stryMutAct_9fa48("2300")) {
      {}
    } else {
      stryCov_9fa48("2300");
      const result = await db.query(stryMutAct_9fa48("2301") ? `` : (stryCov_9fa48("2301"), `SELECT c.id, c.title, c.description, c.start_time, c.end_time, c.status, c.reward_points,
              (SELECT COUNT(*) FROM contest_questions WHERE contest_id = c.id) as question_count,
              (SELECT COUNT(*) FROM contest_scores WHERE contest_id = c.id) as participant_count,
              EXISTS(SELECT 1 FROM contest_scores WHERE contest_id = c.id AND learner_id = $1) as has_submitted
       FROM contests c 
       WHERE c.status IN ('PUBLISHED', 'ACTIVE', 'ENDED')
       ORDER BY c.start_time DESC`), stryMutAct_9fa48("2302") ? [] : (stryCov_9fa48("2302"), [learnerId]));
      return result.rows;
    }
  }

  /**
   * Learner: Get contest questions (without correct answers)
   */
  async learnerGetContestQuestions(contestId) {
    if (stryMutAct_9fa48("2303")) {
      {}
    } else {
      stryCov_9fa48("2303");
      const result = await db.query(stryMutAct_9fa48("2304") ? `` : (stryCov_9fa48("2304"), `SELECT id, contest_id, question_text, options, created_at
       FROM contest_questions 
       WHERE contest_id = $1 
       ORDER BY id`), stryMutAct_9fa48("2305") ? [] : (stryCov_9fa48("2305"), [contestId]));
      return result.rows;
    }
  }

  /**
   * Get correct answers for a contest (for scoring)
   */
  async getCorrectAnswers(contestId) {
    if (stryMutAct_9fa48("2306")) {
      {}
    } else {
      stryCov_9fa48("2306");
      const result = await db.query(stryMutAct_9fa48("2307") ? "" : (stryCov_9fa48("2307"), 'SELECT id, correct_option_id FROM contest_questions WHERE contest_id = $1'), stryMutAct_9fa48("2308") ? [] : (stryCov_9fa48("2308"), [contestId]));
      return result.rows;
    }
  }

  /**
   * Check if user has already submitted for a contest
   */
  async hasUserSubmitted(learnerId, contestId) {
    if (stryMutAct_9fa48("2309")) {
      {}
    } else {
      stryCov_9fa48("2309");
      const result = await db.query(stryMutAct_9fa48("2310") ? "" : (stryCov_9fa48("2310"), 'SELECT id FROM contest_scores WHERE learner_id = $1 AND contest_id = $2'), stryMutAct_9fa48("2311") ? [] : (stryCov_9fa48("2311"), [learnerId, contestId]));
      return stryMutAct_9fa48("2315") ? result.rows.length <= 0 : stryMutAct_9fa48("2314") ? result.rows.length >= 0 : stryMutAct_9fa48("2313") ? false : stryMutAct_9fa48("2312") ? true : (stryCov_9fa48("2312", "2313", "2314", "2315"), result.rows.length > 0);
    }
  }

  /**
   * Save contest score
   */
  async saveContestScore(learnerId, contestId, score, timeTakenMs) {
    if (stryMutAct_9fa48("2316")) {
      {}
    } else {
      stryCov_9fa48("2316");
      const result = await db.query(stryMutAct_9fa48("2317") ? `` : (stryCov_9fa48("2317"), `INSERT INTO contest_scores (learner_id, contest_id, score, time_taken_ms, submitted_at) 
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) 
       ON CONFLICT (learner_id, contest_id) 
       DO UPDATE SET score = $3, time_taken_ms = $4, submitted_at = CURRENT_TIMESTAMP
       RETURNING *`), stryMutAct_9fa48("2318") ? [] : (stryCov_9fa48("2318"), [learnerId, contestId, score, timeTakenMs]));
      return result.rows[0];
    }
  }

  /**
   * Save contest submissions (bulk insert)
   */
  async saveContestSubmissions(learnerId, contestId, submissions) {
    if (stryMutAct_9fa48("2319")) {
      {}
    } else {
      stryCov_9fa48("2319");
      const client = await pool.connect();
      try {
        if (stryMutAct_9fa48("2320")) {
          {}
        } else {
          stryCov_9fa48("2320");
          await client.query(stryMutAct_9fa48("2321") ? "" : (stryCov_9fa48("2321"), 'BEGIN'));
          for (const submission of submissions) {
            if (stryMutAct_9fa48("2322")) {
              {}
            } else {
              stryCov_9fa48("2322");
              await client.query(stryMutAct_9fa48("2323") ? `` : (stryCov_9fa48("2323"), `INSERT INTO contest_submissions (learner_id, contest_id, question_id, selected_option_id, is_correct, submitted_at) 
           VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`), stryMutAct_9fa48("2324") ? [] : (stryCov_9fa48("2324"), [learnerId, contestId, submission.question_id, submission.selected_option_id, submission.is_correct]));
            }
          }
          await client.query(stryMutAct_9fa48("2325") ? "" : (stryCov_9fa48("2325"), 'COMMIT'));
        }
      } catch (error) {
        if (stryMutAct_9fa48("2326")) {
          {}
        } else {
          stryCov_9fa48("2326");
          await client.query(stryMutAct_9fa48("2327") ? "" : (stryCov_9fa48("2327"), 'ROLLBACK'));
          throw error;
        }
      } finally {
        if (stryMutAct_9fa48("2328")) {
          {}
        } else {
          stryCov_9fa48("2328");
          client.release();
        }
      }
    }
  }

  /**
   * Get leaderboard for a contest
   */
  async getLeaderboard(contestId) {
    if (stryMutAct_9fa48("2329")) {
      {}
    } else {
      stryCov_9fa48("2329");
      const result = await db.query(stryMutAct_9fa48("2330") ? `` : (stryCov_9fa48("2330"), `SELECT 
        cs.learner_id,
        COALESCE(l.contest_name, l.name) AS display_name,
        cs.score,
        cs.time_taken_ms,
        cs.submitted_at,
        ROW_NUMBER() OVER (ORDER BY cs.score DESC, cs.time_taken_ms ASC) as rank
       FROM contest_scores cs
       JOIN learners l ON l.id = cs.learner_id
       WHERE cs.contest_id = $1
       ORDER BY cs.score DESC, cs.time_taken_ms ASC`), stryMutAct_9fa48("2331") ? [] : (stryCov_9fa48("2331"), [contestId]));
      return result.rows;
    }
  }

  /**
   * Get user's contest result
   */
  async getUserContestResult(learnerId, contestId) {
    if (stryMutAct_9fa48("2332")) {
      {}
    } else {
      stryCov_9fa48("2332");
      const result = await db.query(stryMutAct_9fa48("2333") ? `` : (stryCov_9fa48("2333"), `SELECT 
        cs.score,
        cs.time_taken_ms,
        cs.submitted_at,
        (SELECT COUNT(*) + 1 FROM contest_scores 
         WHERE contest_id = cs.contest_id 
         AND (score > cs.score OR (score = cs.score AND time_taken_ms < cs.time_taken_ms))) as rank,
        (SELECT COUNT(*) FROM contest_scores WHERE contest_id = cs.contest_id) as total_participants
       FROM contest_scores cs
       WHERE cs.learner_id = $1 AND cs.contest_id = $2`), stryMutAct_9fa48("2334") ? [] : (stryCov_9fa48("2334"), [learnerId, contestId]));
      return stryMutAct_9fa48("2337") ? result.rows[0] && null : stryMutAct_9fa48("2336") ? false : stryMutAct_9fa48("2335") ? true : (stryCov_9fa48("2335", "2336", "2337"), result.rows[0] || null);
    }
  }

  /**
   * Get contest by ID (basic info)
   */
  async getContestById(contestId) {
    if (stryMutAct_9fa48("2338")) {
      {}
    } else {
      stryCov_9fa48("2338");
      const result = await db.query(stryMutAct_9fa48("2339") ? "" : (stryCov_9fa48("2339"), 'SELECT * FROM contests WHERE id = $1'), stryMutAct_9fa48("2340") ? [] : (stryCov_9fa48("2340"), [contestId]));
      return stryMutAct_9fa48("2343") ? result.rows[0] && null : stryMutAct_9fa48("2342") ? false : stryMutAct_9fa48("2341") ? true : (stryCov_9fa48("2341", "2342", "2343"), result.rows[0] || null);
    }
  }

  /**
   * Get user's submissions for a contest
   */
  async getUserSubmissions(learnerId, contestId) {
    if (stryMutAct_9fa48("2344")) {
      {}
    } else {
      stryCov_9fa48("2344");
      const result = await db.query(stryMutAct_9fa48("2345") ? `` : (stryCov_9fa48("2345"), `SELECT 
        cs.question_id,
        cs.selected_option_id,
        cs.is_correct,
        cq.question_text,
        cq.options,
        cq.correct_option_id
       FROM contest_submissions cs
       JOIN contest_questions cq ON cq.id = cs.question_id
       WHERE cs.learner_id = $1 AND cs.contest_id = $2
       ORDER BY cs.question_id`), stryMutAct_9fa48("2346") ? [] : (stryCov_9fa48("2346"), [learnerId, contestId]));
      return result.rows;
    }
  }

  /**
   * Get all contests a user has participated in
   */
  async getUserContests(learnerId) {
    if (stryMutAct_9fa48("2347")) {
      {}
    } else {
      stryCov_9fa48("2347");
      const result = await db.query(stryMutAct_9fa48("2348") ? `` : (stryCov_9fa48("2348"), `SELECT 
        c.id,
        c.title,
        c.description,
        c.start_time,
        c.end_time,
        c.status,
        cs.score,
        cs.time_taken_ms,
        cs.submitted_at,
        (SELECT COUNT(*) + 1 FROM contest_scores 
         WHERE contest_id = cs.contest_id 
         AND (score > cs.score OR (score = cs.score AND time_taken_ms < cs.time_taken_ms))) as rank,
        (SELECT COUNT(*) FROM contest_scores WHERE contest_id = cs.contest_id) as total_participants
       FROM contest_scores cs
       JOIN contests c ON c.id = cs.contest_id
       WHERE cs.learner_id = $1
       ORDER BY cs.submitted_at DESC`), stryMutAct_9fa48("2349") ? [] : (stryCov_9fa48("2349"), [learnerId]));
      return result.rows;
    }
  }
}
export default new ContestRepository();