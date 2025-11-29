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
    if (stryMutAct_9fa48("2403")) {
      {}
    } else {
      stryCov_9fa48("2403");
      const result = await db.query(stryMutAct_9fa48("2404") ? `` : (stryCov_9fa48("2404"), `INSERT INTO contests (title, description, start_time, end_time, status, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, 'DRAFT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
       RETURNING *`), stryMutAct_9fa48("2405") ? [] : (stryCov_9fa48("2405"), [title, description, startTime, endTime]));
      return result.rows[0];
    }
  }

  /**
   * Admin: Add a question to a contest
   */
  async adminAddQuestion(contestId, questionText, options, correctOptionId) {
    if (stryMutAct_9fa48("2406")) {
      {}
    } else {
      stryCov_9fa48("2406");
      const result = await db.query(stryMutAct_9fa48("2407") ? `` : (stryCov_9fa48("2407"), `INSERT INTO contest_questions (contest_id, question_text, options, correct_option_id, created_at) 
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) 
       RETURNING *`), stryMutAct_9fa48("2408") ? [] : (stryCov_9fa48("2408"), [contestId, questionText, JSON.stringify(options), correctOptionId]));
      return result.rows[0];
    }
  }

  /**
   * Admin: Update contest details
   */
  async adminUpdateContest(contestId, updates) {
    if (stryMutAct_9fa48("2409")) {
      {}
    } else {
      stryCov_9fa48("2409");
      const fields = stryMutAct_9fa48("2410") ? ["Stryker was here"] : (stryCov_9fa48("2410"), []);
      const values = stryMutAct_9fa48("2411") ? ["Stryker was here"] : (stryCov_9fa48("2411"), []);
      let paramIndex = 1;
      if (stryMutAct_9fa48("2414") ? updates.title === undefined : stryMutAct_9fa48("2413") ? false : stryMutAct_9fa48("2412") ? true : (stryCov_9fa48("2412", "2413", "2414"), updates.title !== undefined)) {
        if (stryMutAct_9fa48("2415")) {
          {}
        } else {
          stryCov_9fa48("2415");
          fields.push(stryMutAct_9fa48("2416") ? `` : (stryCov_9fa48("2416"), `title = $${stryMutAct_9fa48("2417") ? paramIndex-- : (stryCov_9fa48("2417"), paramIndex++)}`));
          values.push(updates.title);
        }
      }
      if (stryMutAct_9fa48("2420") ? updates.description === undefined : stryMutAct_9fa48("2419") ? false : stryMutAct_9fa48("2418") ? true : (stryCov_9fa48("2418", "2419", "2420"), updates.description !== undefined)) {
        if (stryMutAct_9fa48("2421")) {
          {}
        } else {
          stryCov_9fa48("2421");
          fields.push(stryMutAct_9fa48("2422") ? `` : (stryCov_9fa48("2422"), `description = $${stryMutAct_9fa48("2423") ? paramIndex-- : (stryCov_9fa48("2423"), paramIndex++)}`));
          values.push(updates.description);
        }
      }
      if (stryMutAct_9fa48("2426") ? updates.start_time === undefined : stryMutAct_9fa48("2425") ? false : stryMutAct_9fa48("2424") ? true : (stryCov_9fa48("2424", "2425", "2426"), updates.start_time !== undefined)) {
        if (stryMutAct_9fa48("2427")) {
          {}
        } else {
          stryCov_9fa48("2427");
          fields.push(stryMutAct_9fa48("2428") ? `` : (stryCov_9fa48("2428"), `start_time = $${stryMutAct_9fa48("2429") ? paramIndex-- : (stryCov_9fa48("2429"), paramIndex++)}`));
          values.push(updates.start_time);
        }
      }
      if (stryMutAct_9fa48("2432") ? updates.end_time === undefined : stryMutAct_9fa48("2431") ? false : stryMutAct_9fa48("2430") ? true : (stryCov_9fa48("2430", "2431", "2432"), updates.end_time !== undefined)) {
        if (stryMutAct_9fa48("2433")) {
          {}
        } else {
          stryCov_9fa48("2433");
          fields.push(stryMutAct_9fa48("2434") ? `` : (stryCov_9fa48("2434"), `end_time = $${stryMutAct_9fa48("2435") ? paramIndex-- : (stryCov_9fa48("2435"), paramIndex++)}`));
          values.push(updates.end_time);
        }
      }
      fields.push(stryMutAct_9fa48("2436") ? `` : (stryCov_9fa48("2436"), `updated_at = CURRENT_TIMESTAMP`));
      values.push(contestId);
      const result = await db.query(stryMutAct_9fa48("2437") ? `` : (stryCov_9fa48("2437"), `UPDATE contests 
       SET ${fields.join(stryMutAct_9fa48("2438") ? "" : (stryCov_9fa48("2438"), ', '))}
       WHERE id = $${paramIndex}
       RETURNING *`), values);
      return result.rows[0];
    }
  }

  /**
   * Admin: Publish a contest (change status to PUBLISHED)
   */
  async adminPublishContest(contestId) {
    if (stryMutAct_9fa48("2439")) {
      {}
    } else {
      stryCov_9fa48("2439");
      const result = await db.query(stryMutAct_9fa48("2440") ? `` : (stryCov_9fa48("2440"), `UPDATE contests 
       SET status = 'PUBLISHED', updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`), stryMutAct_9fa48("2441") ? [] : (stryCov_9fa48("2441"), [contestId]));
      return result.rows[0];
    }
  }

  /**
   * Admin: Get all contests
   */
  async adminGetAllContests() {
    if (stryMutAct_9fa48("2442")) {
      {}
    } else {
      stryCov_9fa48("2442");
      const result = await db.query(stryMutAct_9fa48("2443") ? `` : (stryCov_9fa48("2443"), `SELECT c.*, 
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
    if (stryMutAct_9fa48("2444")) {
      {}
    } else {
      stryCov_9fa48("2444");
      const contestResult = await db.query(stryMutAct_9fa48("2445") ? "" : (stryCov_9fa48("2445"), 'SELECT * FROM contests WHERE id = $1'), stryMutAct_9fa48("2446") ? [] : (stryCov_9fa48("2446"), [contestId]));
      if (stryMutAct_9fa48("2449") ? contestResult.rows.length !== 0 : stryMutAct_9fa48("2448") ? false : stryMutAct_9fa48("2447") ? true : (stryCov_9fa48("2447", "2448", "2449"), contestResult.rows.length === 0)) {
        if (stryMutAct_9fa48("2450")) {
          {}
        } else {
          stryCov_9fa48("2450");
          return null;
        }
      }
      const questionsResult = await db.query(stryMutAct_9fa48("2451") ? "" : (stryCov_9fa48("2451"), 'SELECT * FROM contest_questions WHERE contest_id = $1 ORDER BY id'), stryMutAct_9fa48("2452") ? [] : (stryCov_9fa48("2452"), [contestId]));
      return stryMutAct_9fa48("2453") ? {} : (stryCov_9fa48("2453"), {
        ...contestResult.rows[0],
        questions: questionsResult.rows
      });
    }
  }

  /**
   * Admin: Update contest status
   */
  async updateContestStatus(contestId, status) {
    if (stryMutAct_9fa48("2454")) {
      {}
    } else {
      stryCov_9fa48("2454");
      const result = await db.query(stryMutAct_9fa48("2455") ? `` : (stryCov_9fa48("2455"), `UPDATE contests 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`), stryMutAct_9fa48("2456") ? [] : (stryCov_9fa48("2456"), [status, contestId]));
      return result.rows[0];
    }
  }

  /**
   * Admin: Delete a contest
   */
  async adminDeleteContest(contestId) {
    if (stryMutAct_9fa48("2457")) {
      {}
    } else {
      stryCov_9fa48("2457");
      const result = await db.query(stryMutAct_9fa48("2458") ? "" : (stryCov_9fa48("2458"), 'DELETE FROM contests WHERE id = $1 RETURNING *'), stryMutAct_9fa48("2459") ? [] : (stryCov_9fa48("2459"), [contestId]));
      return result.rows[0];
    }
  }

  /**
   * Learner: Get available contests (PUBLISHED or ACTIVE)
   */
  async learnerGetAvailableContests(learnerId) {
    if (stryMutAct_9fa48("2460")) {
      {}
    } else {
      stryCov_9fa48("2460");
      const result = await db.query(stryMutAct_9fa48("2461") ? `` : (stryCov_9fa48("2461"), `SELECT c.id, c.title, c.description, c.start_time, c.end_time, c.status, c.reward_points,
              (SELECT COUNT(*) FROM contest_questions WHERE contest_id = c.id) as question_count,
              (SELECT COUNT(*) FROM contest_scores WHERE contest_id = c.id) as participant_count,
              EXISTS(SELECT 1 FROM contest_scores WHERE contest_id = c.id AND learner_id = $1) as has_submitted
       FROM contests c 
       WHERE c.status IN ('PUBLISHED', 'ACTIVE', 'ENDED')
       ORDER BY c.start_time DESC`), stryMutAct_9fa48("2462") ? [] : (stryCov_9fa48("2462"), [learnerId]));
      return result.rows;
    }
  }

  /**
   * Learner: Get contest questions (without correct answers)
   */
  async learnerGetContestQuestions(contestId) {
    if (stryMutAct_9fa48("2463")) {
      {}
    } else {
      stryCov_9fa48("2463");
      const result = await db.query(stryMutAct_9fa48("2464") ? `` : (stryCov_9fa48("2464"), `SELECT id, contest_id, question_text, options, created_at
       FROM contest_questions 
       WHERE contest_id = $1 
       ORDER BY id`), stryMutAct_9fa48("2465") ? [] : (stryCov_9fa48("2465"), [contestId]));
      return result.rows;
    }
  }

  /**
   * Get correct answers for a contest (for scoring)
   */
  async getCorrectAnswers(contestId) {
    if (stryMutAct_9fa48("2466")) {
      {}
    } else {
      stryCov_9fa48("2466");
      const result = await db.query(stryMutAct_9fa48("2467") ? "" : (stryCov_9fa48("2467"), 'SELECT id, correct_option_id FROM contest_questions WHERE contest_id = $1'), stryMutAct_9fa48("2468") ? [] : (stryCov_9fa48("2468"), [contestId]));
      return result.rows;
    }
  }

  /**
   * Check if user has already submitted for a contest
   */
  async hasUserSubmitted(learnerId, contestId) {
    if (stryMutAct_9fa48("2469")) {
      {}
    } else {
      stryCov_9fa48("2469");
      const result = await db.query(stryMutAct_9fa48("2470") ? "" : (stryCov_9fa48("2470"), 'SELECT id FROM contest_scores WHERE learner_id = $1 AND contest_id = $2'), stryMutAct_9fa48("2471") ? [] : (stryCov_9fa48("2471"), [learnerId, contestId]));
      return stryMutAct_9fa48("2475") ? result.rows.length <= 0 : stryMutAct_9fa48("2474") ? result.rows.length >= 0 : stryMutAct_9fa48("2473") ? false : stryMutAct_9fa48("2472") ? true : (stryCov_9fa48("2472", "2473", "2474", "2475"), result.rows.length > 0);
    }
  }

  /**
   * Save contest score
   */
  async saveContestScore(learnerId, contestId, score, timeTakenMs) {
    if (stryMutAct_9fa48("2476")) {
      {}
    } else {
      stryCov_9fa48("2476");
      const result = await db.query(stryMutAct_9fa48("2477") ? `` : (stryCov_9fa48("2477"), `INSERT INTO contest_scores (learner_id, contest_id, score, time_taken_ms, submitted_at) 
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) 
       ON CONFLICT (learner_id, contest_id) 
       DO UPDATE SET score = $3, time_taken_ms = $4, submitted_at = CURRENT_TIMESTAMP
       RETURNING *`), stryMutAct_9fa48("2478") ? [] : (stryCov_9fa48("2478"), [learnerId, contestId, score, timeTakenMs]));
      return result.rows[0];
    }
  }

  /**
   * Save contest submissions (bulk insert)
   */
  async saveContestSubmissions(learnerId, contestId, submissions) {
    if (stryMutAct_9fa48("2479")) {
      {}
    } else {
      stryCov_9fa48("2479");
      const client = await pool.connect();
      try {
        if (stryMutAct_9fa48("2480")) {
          {}
        } else {
          stryCov_9fa48("2480");
          await client.query(stryMutAct_9fa48("2481") ? "" : (stryCov_9fa48("2481"), 'BEGIN'));
          for (const submission of submissions) {
            if (stryMutAct_9fa48("2482")) {
              {}
            } else {
              stryCov_9fa48("2482");
              await client.query(stryMutAct_9fa48("2483") ? `` : (stryCov_9fa48("2483"), `INSERT INTO contest_submissions (learner_id, contest_id, question_id, selected_option_id, is_correct, submitted_at) 
           VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`), stryMutAct_9fa48("2484") ? [] : (stryCov_9fa48("2484"), [learnerId, contestId, submission.question_id, submission.selected_option_id, submission.is_correct]));
            }
          }
          await client.query(stryMutAct_9fa48("2485") ? "" : (stryCov_9fa48("2485"), 'COMMIT'));
        }
      } catch (error) {
        if (stryMutAct_9fa48("2486")) {
          {}
        } else {
          stryCov_9fa48("2486");
          await client.query(stryMutAct_9fa48("2487") ? "" : (stryCov_9fa48("2487"), 'ROLLBACK'));
          throw error;
        }
      } finally {
        if (stryMutAct_9fa48("2488")) {
          {}
        } else {
          stryCov_9fa48("2488");
          client.release();
        }
      }
    }
  }

  /**
   * Get leaderboard for a contest
   */
  async getLeaderboard(contestId) {
    if (stryMutAct_9fa48("2489")) {
      {}
    } else {
      stryCov_9fa48("2489");
      const result = await db.query(stryMutAct_9fa48("2490") ? `` : (stryCov_9fa48("2490"), `SELECT 
        cs.learner_id,
        COALESCE(l.contest_name, l.name) AS display_name,
        cs.score,
        cs.time_taken_ms,
        cs.submitted_at,
        ROW_NUMBER() OVER (ORDER BY cs.score DESC, cs.time_taken_ms ASC) as rank
       FROM contest_scores cs
       JOIN learners l ON l.id = cs.learner_id
       WHERE cs.contest_id = $1
       ORDER BY cs.score DESC, cs.time_taken_ms ASC`), stryMutAct_9fa48("2491") ? [] : (stryCov_9fa48("2491"), [contestId]));
      return result.rows;
    }
  }

  /**
   * Get user's contest result
   */
  async getUserContestResult(learnerId, contestId) {
    if (stryMutAct_9fa48("2492")) {
      {}
    } else {
      stryCov_9fa48("2492");
      const result = await db.query(stryMutAct_9fa48("2493") ? `` : (stryCov_9fa48("2493"), `SELECT 
        cs.score,
        cs.time_taken_ms,
        cs.submitted_at,
        (SELECT COUNT(*) + 1 FROM contest_scores 
         WHERE contest_id = cs.contest_id 
         AND (score > cs.score OR (score = cs.score AND time_taken_ms < cs.time_taken_ms))) as rank,
        (SELECT COUNT(*) FROM contest_scores WHERE contest_id = cs.contest_id) as total_participants
       FROM contest_scores cs
       WHERE cs.learner_id = $1 AND cs.contest_id = $2`), stryMutAct_9fa48("2494") ? [] : (stryCov_9fa48("2494"), [learnerId, contestId]));
      return stryMutAct_9fa48("2497") ? result.rows[0] && null : stryMutAct_9fa48("2496") ? false : stryMutAct_9fa48("2495") ? true : (stryCov_9fa48("2495", "2496", "2497"), result.rows[0] || null);
    }
  }

  /**
   * Get contest by ID (basic info)
   */
  async getContestById(contestId) {
    if (stryMutAct_9fa48("2498")) {
      {}
    } else {
      stryCov_9fa48("2498");
      const result = await db.query(stryMutAct_9fa48("2499") ? "" : (stryCov_9fa48("2499"), 'SELECT * FROM contests WHERE id = $1'), stryMutAct_9fa48("2500") ? [] : (stryCov_9fa48("2500"), [contestId]));
      return stryMutAct_9fa48("2503") ? result.rows[0] && null : stryMutAct_9fa48("2502") ? false : stryMutAct_9fa48("2501") ? true : (stryCov_9fa48("2501", "2502", "2503"), result.rows[0] || null);
    }
  }

  /**
   * Get user's submissions for a contest
   */
  async getUserSubmissions(learnerId, contestId) {
    if (stryMutAct_9fa48("2504")) {
      {}
    } else {
      stryCov_9fa48("2504");
      const result = await db.query(stryMutAct_9fa48("2505") ? `` : (stryCov_9fa48("2505"), `SELECT 
        cs.question_id,
        cs.selected_option_id,
        cs.is_correct,
        cq.question_text,
        cq.options,
        cq.correct_option_id
       FROM contest_submissions cs
       JOIN contest_questions cq ON cq.id = cs.question_id
       WHERE cs.learner_id = $1 AND cs.contest_id = $2
       ORDER BY cs.question_id`), stryMutAct_9fa48("2506") ? [] : (stryCov_9fa48("2506"), [learnerId, contestId]));
      return result.rows;
    }
  }

  /**
   * Get all contests a user has participated in
   */
  async getUserContests(learnerId) {
    if (stryMutAct_9fa48("2507")) {
      {}
    } else {
      stryCov_9fa48("2507");
      const result = await db.query(stryMutAct_9fa48("2508") ? `` : (stryCov_9fa48("2508"), `SELECT 
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
       ORDER BY cs.submitted_at DESC`), stryMutAct_9fa48("2509") ? [] : (stryCov_9fa48("2509"), [learnerId]));
      return result.rows;
    }
  }
}
export default new ContestRepository();