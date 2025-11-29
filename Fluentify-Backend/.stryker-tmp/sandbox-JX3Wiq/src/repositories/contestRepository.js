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
    if (stryMutAct_9fa48("2241")) {
      {}
    } else {
      stryCov_9fa48("2241");
      const result = await db.query(stryMutAct_9fa48("2242") ? `` : (stryCov_9fa48("2242"), `INSERT INTO contests (title, description, start_time, end_time, status, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, 'DRAFT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
       RETURNING *`), stryMutAct_9fa48("2243") ? [] : (stryCov_9fa48("2243"), [title, description, startTime, endTime]));
      return result.rows[0];
    }
  }

  /**
   * Admin: Add a question to a contest
   */
  async adminAddQuestion(contestId, questionText, options, correctOptionId) {
    if (stryMutAct_9fa48("2244")) {
      {}
    } else {
      stryCov_9fa48("2244");
      const result = await db.query(stryMutAct_9fa48("2245") ? `` : (stryCov_9fa48("2245"), `INSERT INTO contest_questions (contest_id, question_text, options, correct_option_id, created_at) 
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) 
       RETURNING *`), stryMutAct_9fa48("2246") ? [] : (stryCov_9fa48("2246"), [contestId, questionText, JSON.stringify(options), correctOptionId]));
      return result.rows[0];
    }
  }

  /**
   * Admin: Update contest details
   */
  async adminUpdateContest(contestId, updates) {
    if (stryMutAct_9fa48("2247")) {
      {}
    } else {
      stryCov_9fa48("2247");
      const fields = stryMutAct_9fa48("2248") ? ["Stryker was here"] : (stryCov_9fa48("2248"), []);
      const values = stryMutAct_9fa48("2249") ? ["Stryker was here"] : (stryCov_9fa48("2249"), []);
      let paramIndex = 1;
      if (stryMutAct_9fa48("2252") ? updates.title === undefined : stryMutAct_9fa48("2251") ? false : stryMutAct_9fa48("2250") ? true : (stryCov_9fa48("2250", "2251", "2252"), updates.title !== undefined)) {
        if (stryMutAct_9fa48("2253")) {
          {}
        } else {
          stryCov_9fa48("2253");
          fields.push(stryMutAct_9fa48("2254") ? `` : (stryCov_9fa48("2254"), `title = $${stryMutAct_9fa48("2255") ? paramIndex-- : (stryCov_9fa48("2255"), paramIndex++)}`));
          values.push(updates.title);
        }
      }
      if (stryMutAct_9fa48("2258") ? updates.description === undefined : stryMutAct_9fa48("2257") ? false : stryMutAct_9fa48("2256") ? true : (stryCov_9fa48("2256", "2257", "2258"), updates.description !== undefined)) {
        if (stryMutAct_9fa48("2259")) {
          {}
        } else {
          stryCov_9fa48("2259");
          fields.push(stryMutAct_9fa48("2260") ? `` : (stryCov_9fa48("2260"), `description = $${stryMutAct_9fa48("2261") ? paramIndex-- : (stryCov_9fa48("2261"), paramIndex++)}`));
          values.push(updates.description);
        }
      }
      if (stryMutAct_9fa48("2264") ? updates.start_time === undefined : stryMutAct_9fa48("2263") ? false : stryMutAct_9fa48("2262") ? true : (stryCov_9fa48("2262", "2263", "2264"), updates.start_time !== undefined)) {
        if (stryMutAct_9fa48("2265")) {
          {}
        } else {
          stryCov_9fa48("2265");
          fields.push(stryMutAct_9fa48("2266") ? `` : (stryCov_9fa48("2266"), `start_time = $${stryMutAct_9fa48("2267") ? paramIndex-- : (stryCov_9fa48("2267"), paramIndex++)}`));
          values.push(updates.start_time);
        }
      }
      if (stryMutAct_9fa48("2270") ? updates.end_time === undefined : stryMutAct_9fa48("2269") ? false : stryMutAct_9fa48("2268") ? true : (stryCov_9fa48("2268", "2269", "2270"), updates.end_time !== undefined)) {
        if (stryMutAct_9fa48("2271")) {
          {}
        } else {
          stryCov_9fa48("2271");
          fields.push(stryMutAct_9fa48("2272") ? `` : (stryCov_9fa48("2272"), `end_time = $${stryMutAct_9fa48("2273") ? paramIndex-- : (stryCov_9fa48("2273"), paramIndex++)}`));
          values.push(updates.end_time);
        }
      }
      fields.push(stryMutAct_9fa48("2274") ? `` : (stryCov_9fa48("2274"), `updated_at = CURRENT_TIMESTAMP`));
      values.push(contestId);
      const result = await db.query(stryMutAct_9fa48("2275") ? `` : (stryCov_9fa48("2275"), `UPDATE contests 
       SET ${fields.join(stryMutAct_9fa48("2276") ? "" : (stryCov_9fa48("2276"), ', '))}
       WHERE id = $${paramIndex}
       RETURNING *`), values);
      return result.rows[0];
    }
  }

  /**
   * Admin: Publish a contest (change status to PUBLISHED)
   */
  async adminPublishContest(contestId) {
    if (stryMutAct_9fa48("2277")) {
      {}
    } else {
      stryCov_9fa48("2277");
      const result = await db.query(stryMutAct_9fa48("2278") ? `` : (stryCov_9fa48("2278"), `UPDATE contests 
       SET status = 'PUBLISHED', updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`), stryMutAct_9fa48("2279") ? [] : (stryCov_9fa48("2279"), [contestId]));
      return result.rows[0];
    }
  }

  /**
   * Admin: Get all contests
   */
  async adminGetAllContests() {
    if (stryMutAct_9fa48("2280")) {
      {}
    } else {
      stryCov_9fa48("2280");
      const result = await db.query(stryMutAct_9fa48("2281") ? `` : (stryCov_9fa48("2281"), `SELECT c.*, 
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
    if (stryMutAct_9fa48("2282")) {
      {}
    } else {
      stryCov_9fa48("2282");
      const contestResult = await db.query(stryMutAct_9fa48("2283") ? "" : (stryCov_9fa48("2283"), 'SELECT * FROM contests WHERE id = $1'), stryMutAct_9fa48("2284") ? [] : (stryCov_9fa48("2284"), [contestId]));
      if (stryMutAct_9fa48("2287") ? contestResult.rows.length !== 0 : stryMutAct_9fa48("2286") ? false : stryMutAct_9fa48("2285") ? true : (stryCov_9fa48("2285", "2286", "2287"), contestResult.rows.length === 0)) {
        if (stryMutAct_9fa48("2288")) {
          {}
        } else {
          stryCov_9fa48("2288");
          return null;
        }
      }
      const questionsResult = await db.query(stryMutAct_9fa48("2289") ? "" : (stryCov_9fa48("2289"), 'SELECT * FROM contest_questions WHERE contest_id = $1 ORDER BY id'), stryMutAct_9fa48("2290") ? [] : (stryCov_9fa48("2290"), [contestId]));
      return stryMutAct_9fa48("2291") ? {} : (stryCov_9fa48("2291"), {
        ...contestResult.rows[0],
        questions: questionsResult.rows
      });
    }
  }

  /**
   * Admin: Update contest status
   */
  async updateContestStatus(contestId, status) {
    if (stryMutAct_9fa48("2292")) {
      {}
    } else {
      stryCov_9fa48("2292");
      const result = await db.query(stryMutAct_9fa48("2293") ? `` : (stryCov_9fa48("2293"), `UPDATE contests 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`), stryMutAct_9fa48("2294") ? [] : (stryCov_9fa48("2294"), [status, contestId]));
      return result.rows[0];
    }
  }

  /**
   * Admin: Delete a contest
   */
  async adminDeleteContest(contestId) {
    if (stryMutAct_9fa48("2295")) {
      {}
    } else {
      stryCov_9fa48("2295");
      const result = await db.query(stryMutAct_9fa48("2296") ? "" : (stryCov_9fa48("2296"), 'DELETE FROM contests WHERE id = $1 RETURNING *'), stryMutAct_9fa48("2297") ? [] : (stryCov_9fa48("2297"), [contestId]));
      return result.rows[0];
    }
  }

  /**
   * Learner: Get available contests (PUBLISHED or ACTIVE)
   */
  async learnerGetAvailableContests(learnerId) {
    if (stryMutAct_9fa48("2298")) {
      {}
    } else {
      stryCov_9fa48("2298");
      const result = await db.query(stryMutAct_9fa48("2299") ? `` : (stryCov_9fa48("2299"), `SELECT c.id, c.title, c.description, c.start_time, c.end_time, c.status, c.reward_points,
              (SELECT COUNT(*) FROM contest_questions WHERE contest_id = c.id) as question_count,
              (SELECT COUNT(*) FROM contest_scores WHERE contest_id = c.id) as participant_count,
              EXISTS(SELECT 1 FROM contest_scores WHERE contest_id = c.id AND learner_id = $1) as has_submitted
       FROM contests c 
       WHERE c.status IN ('PUBLISHED', 'ACTIVE', 'ENDED')
       ORDER BY c.start_time DESC`), stryMutAct_9fa48("2300") ? [] : (stryCov_9fa48("2300"), [learnerId]));
      return result.rows;
    }
  }

  /**
   * Learner: Get contest questions (without correct answers)
   */
  async learnerGetContestQuestions(contestId) {
    if (stryMutAct_9fa48("2301")) {
      {}
    } else {
      stryCov_9fa48("2301");
      const result = await db.query(stryMutAct_9fa48("2302") ? `` : (stryCov_9fa48("2302"), `SELECT id, contest_id, question_text, options, created_at
       FROM contest_questions 
       WHERE contest_id = $1 
       ORDER BY id`), stryMutAct_9fa48("2303") ? [] : (stryCov_9fa48("2303"), [contestId]));
      return result.rows;
    }
  }

  /**
   * Get correct answers for a contest (for scoring)
   */
  async getCorrectAnswers(contestId) {
    if (stryMutAct_9fa48("2304")) {
      {}
    } else {
      stryCov_9fa48("2304");
      const result = await db.query(stryMutAct_9fa48("2305") ? "" : (stryCov_9fa48("2305"), 'SELECT id, correct_option_id FROM contest_questions WHERE contest_id = $1'), stryMutAct_9fa48("2306") ? [] : (stryCov_9fa48("2306"), [contestId]));
      return result.rows;
    }
  }

  /**
   * Check if user has already submitted for a contest
   */
  async hasUserSubmitted(learnerId, contestId) {
    if (stryMutAct_9fa48("2307")) {
      {}
    } else {
      stryCov_9fa48("2307");
      const result = await db.query(stryMutAct_9fa48("2308") ? "" : (stryCov_9fa48("2308"), 'SELECT id FROM contest_scores WHERE learner_id = $1 AND contest_id = $2'), stryMutAct_9fa48("2309") ? [] : (stryCov_9fa48("2309"), [learnerId, contestId]));
      return stryMutAct_9fa48("2313") ? result.rows.length <= 0 : stryMutAct_9fa48("2312") ? result.rows.length >= 0 : stryMutAct_9fa48("2311") ? false : stryMutAct_9fa48("2310") ? true : (stryCov_9fa48("2310", "2311", "2312", "2313"), result.rows.length > 0);
    }
  }

  /**
   * Save contest score
   */
  async saveContestScore(learnerId, contestId, score, timeTakenMs) {
    if (stryMutAct_9fa48("2314")) {
      {}
    } else {
      stryCov_9fa48("2314");
      const result = await db.query(stryMutAct_9fa48("2315") ? `` : (stryCov_9fa48("2315"), `INSERT INTO contest_scores (learner_id, contest_id, score, time_taken_ms, submitted_at) 
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) 
       ON CONFLICT (learner_id, contest_id) 
       DO UPDATE SET score = $3, time_taken_ms = $4, submitted_at = CURRENT_TIMESTAMP
       RETURNING *`), stryMutAct_9fa48("2316") ? [] : (stryCov_9fa48("2316"), [learnerId, contestId, score, timeTakenMs]));
      return result.rows[0];
    }
  }

  /**
   * Save contest submissions (bulk insert)
   */
  async saveContestSubmissions(learnerId, contestId, submissions) {
    if (stryMutAct_9fa48("2317")) {
      {}
    } else {
      stryCov_9fa48("2317");
      const client = await pool.connect();
      try {
        if (stryMutAct_9fa48("2318")) {
          {}
        } else {
          stryCov_9fa48("2318");
          await client.query(stryMutAct_9fa48("2319") ? "" : (stryCov_9fa48("2319"), 'BEGIN'));
          for (const submission of submissions) {
            if (stryMutAct_9fa48("2320")) {
              {}
            } else {
              stryCov_9fa48("2320");
              await client.query(stryMutAct_9fa48("2321") ? `` : (stryCov_9fa48("2321"), `INSERT INTO contest_submissions (learner_id, contest_id, question_id, selected_option_id, is_correct, submitted_at) 
           VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`), stryMutAct_9fa48("2322") ? [] : (stryCov_9fa48("2322"), [learnerId, contestId, submission.question_id, submission.selected_option_id, submission.is_correct]));
            }
          }
          await client.query(stryMutAct_9fa48("2323") ? "" : (stryCov_9fa48("2323"), 'COMMIT'));
        }
      } catch (error) {
        if (stryMutAct_9fa48("2324")) {
          {}
        } else {
          stryCov_9fa48("2324");
          await client.query(stryMutAct_9fa48("2325") ? "" : (stryCov_9fa48("2325"), 'ROLLBACK'));
          throw error;
        }
      } finally {
        if (stryMutAct_9fa48("2326")) {
          {}
        } else {
          stryCov_9fa48("2326");
          client.release();
        }
      }
    }
  }

  /**
   * Get leaderboard for a contest
   */
  async getLeaderboard(contestId) {
    if (stryMutAct_9fa48("2327")) {
      {}
    } else {
      stryCov_9fa48("2327");
      const result = await db.query(stryMutAct_9fa48("2328") ? `` : (stryCov_9fa48("2328"), `SELECT 
        cs.learner_id,
        COALESCE(l.contest_name, l.name) AS display_name,
        cs.score,
        cs.time_taken_ms,
        cs.submitted_at,
        ROW_NUMBER() OVER (ORDER BY cs.score DESC, cs.time_taken_ms ASC) as rank
       FROM contest_scores cs
       JOIN learners l ON l.id = cs.learner_id
       WHERE cs.contest_id = $1
       ORDER BY cs.score DESC, cs.time_taken_ms ASC`), stryMutAct_9fa48("2329") ? [] : (stryCov_9fa48("2329"), [contestId]));
      return result.rows;
    }
  }

  /**
   * Get user's contest result
   */
  async getUserContestResult(learnerId, contestId) {
    if (stryMutAct_9fa48("2330")) {
      {}
    } else {
      stryCov_9fa48("2330");
      const result = await db.query(stryMutAct_9fa48("2331") ? `` : (stryCov_9fa48("2331"), `SELECT 
        cs.score,
        cs.time_taken_ms,
        cs.submitted_at,
        (SELECT COUNT(*) + 1 FROM contest_scores 
         WHERE contest_id = cs.contest_id 
         AND (score > cs.score OR (score = cs.score AND time_taken_ms < cs.time_taken_ms))) as rank,
        (SELECT COUNT(*) FROM contest_scores WHERE contest_id = cs.contest_id) as total_participants
       FROM contest_scores cs
       WHERE cs.learner_id = $1 AND cs.contest_id = $2`), stryMutAct_9fa48("2332") ? [] : (stryCov_9fa48("2332"), [learnerId, contestId]));
      return stryMutAct_9fa48("2335") ? result.rows[0] && null : stryMutAct_9fa48("2334") ? false : stryMutAct_9fa48("2333") ? true : (stryCov_9fa48("2333", "2334", "2335"), result.rows[0] || null);
    }
  }

  /**
   * Get contest by ID (basic info)
   */
  async getContestById(contestId) {
    if (stryMutAct_9fa48("2336")) {
      {}
    } else {
      stryCov_9fa48("2336");
      const result = await db.query(stryMutAct_9fa48("2337") ? "" : (stryCov_9fa48("2337"), 'SELECT * FROM contests WHERE id = $1'), stryMutAct_9fa48("2338") ? [] : (stryCov_9fa48("2338"), [contestId]));
      return stryMutAct_9fa48("2341") ? result.rows[0] && null : stryMutAct_9fa48("2340") ? false : stryMutAct_9fa48("2339") ? true : (stryCov_9fa48("2339", "2340", "2341"), result.rows[0] || null);
    }
  }

  /**
   * Get user's submissions for a contest
   */
  async getUserSubmissions(learnerId, contestId) {
    if (stryMutAct_9fa48("2342")) {
      {}
    } else {
      stryCov_9fa48("2342");
      const result = await db.query(stryMutAct_9fa48("2343") ? `` : (stryCov_9fa48("2343"), `SELECT 
        cs.question_id,
        cs.selected_option_id,
        cs.is_correct,
        cq.question_text,
        cq.options,
        cq.correct_option_id
       FROM contest_submissions cs
       JOIN contest_questions cq ON cq.id = cs.question_id
       WHERE cs.learner_id = $1 AND cs.contest_id = $2
       ORDER BY cs.question_id`), stryMutAct_9fa48("2344") ? [] : (stryCov_9fa48("2344"), [learnerId, contestId]));
      return result.rows;
    }
  }

  /**
   * Get all contests a user has participated in
   */
  async getUserContests(learnerId) {
    if (stryMutAct_9fa48("2345")) {
      {}
    } else {
      stryCov_9fa48("2345");
      const result = await db.query(stryMutAct_9fa48("2346") ? `` : (stryCov_9fa48("2346"), `SELECT 
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
       ORDER BY cs.submitted_at DESC`), stryMutAct_9fa48("2347") ? [] : (stryCov_9fa48("2347"), [learnerId]));
      return result.rows;
    }
  }
}
export default new ContestRepository();