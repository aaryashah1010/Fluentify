// @ts-nocheck
import db, { pool } from '../config/db.js';

class ContestRepository {
  /**
   * Admin: Create a new contest
   */
  async adminCreateContest(title, description, startTime, endTime) {
    const result = await db.query(
      `INSERT INTO contests (title, description, start_time, end_time, status, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, 'DRAFT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
       RETURNING *`,
      [title, description, startTime, endTime]
    );
    return result.rows[0];
  }

  /**
   * Admin: Add a question to a contest
   */
  async adminAddQuestion(contestId, questionText, options, correctOptionId) {
    const result = await db.query(
      `INSERT INTO contest_questions (contest_id, question_text, options, correct_option_id, created_at) 
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) 
       RETURNING *`,
      [contestId, questionText, JSON.stringify(options), correctOptionId]
    );
    return result.rows[0];
  }

  /**
   * Admin: Update contest details
   */
  async adminUpdateContest(contestId, updates) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (updates.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(updates.title);
    }
    if (updates.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(updates.description);
    }
    if (updates.start_time !== undefined) {
      fields.push(`start_time = $${paramIndex++}`);
      values.push(updates.start_time);
    }
    if (updates.end_time !== undefined) {
      fields.push(`end_time = $${paramIndex++}`);
      values.push(updates.end_time);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(contestId);

    const result = await db.query(
      `UPDATE contests 
       SET ${fields.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );
    return result.rows[0];
  }

  /**
   * Admin: Publish a contest (change status to PUBLISHED)
   */
  async adminPublishContest(contestId) {
    const result = await db.query(
      `UPDATE contests 
       SET status = 'PUBLISHED', updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [contestId]
    );
    return result.rows[0];
  }

  /**
   * Admin: Get all contests
   */
  async adminGetAllContests() {
    const result = await db.query(
      `SELECT c.*, 
              (SELECT COUNT(*) FROM contest_questions WHERE contest_id = c.id) as question_count,
              (SELECT COUNT(*) FROM contest_scores WHERE contest_id = c.id) as participant_count
       FROM contests c 
       ORDER BY c.created_at DESC`
    );
    return result.rows;
  }

  /**
   * Admin: Get contest by ID with questions
   */
  async adminGetContestById(contestId) {
    const contestResult = await db.query(
      'SELECT * FROM contests WHERE id = $1',
      [contestId]
    );
    
    if (contestResult.rows.length === 0) {
      return null;
    }

    const questionsResult = await db.query(
      'SELECT * FROM contest_questions WHERE contest_id = $1 ORDER BY id',
      [contestId]
    );

    return {
      ...contestResult.rows[0],
      questions: questionsResult.rows
    };
  }

  /**
   * Admin: Update contest status
   */
  async updateContestStatus(contestId, status) {
    const result = await db.query(
      `UPDATE contests 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [status, contestId]
    );
    return result.rows[0];
  }

  /**
   * Admin: Delete a contest
   */
  async adminDeleteContest(contestId) {
    const result = await db.query(
      'DELETE FROM contests WHERE id = $1 RETURNING *',
      [contestId]
    );
    return result.rows[0];
  }

  /**
   * Learner: Get available contests (PUBLISHED or ACTIVE)
   */
  async learnerGetAvailableContests(learnerId) {
    const result = await db.query(
      `SELECT c.id, c.title, c.description, c.start_time, c.end_time, c.status, c.reward_points,
              (SELECT COUNT(*) FROM contest_questions WHERE contest_id = c.id) as question_count,
              (SELECT COUNT(*) FROM contest_scores WHERE contest_id = c.id) as participant_count,
              EXISTS(SELECT 1 FROM contest_scores WHERE contest_id = c.id AND learner_id = $1) as has_submitted
       FROM contests c 
       WHERE c.status IN ('PUBLISHED', 'ACTIVE', 'ENDED')
       ORDER BY c.start_time DESC`,
      [learnerId]
    );
    return result.rows;
  }

  /**
   * Learner: Get contest questions (without correct answers)
   */
  async learnerGetContestQuestions(contestId) {
    const result = await db.query(
      `SELECT id, contest_id, question_text, options, created_at
       FROM contest_questions 
       WHERE contest_id = $1 
       ORDER BY id`,
      [contestId]
    );
    return result.rows;
  }

  /**
   * Get correct answers for a contest (for scoring)
   */
  async getCorrectAnswers(contestId) {
    const result = await db.query(
      'SELECT id, correct_option_id FROM contest_questions WHERE contest_id = $1',
      [contestId]
    );
    return result.rows;
  }

  /**
   * Check if user has already submitted for a contest
   */
  async hasUserSubmitted(learnerId, contestId) {
    const result = await db.query(
      'SELECT id FROM contest_scores WHERE learner_id = $1 AND contest_id = $2',
      [learnerId, contestId]
    );
    return result.rows.length > 0;
  }

  /**
   * Save contest score
   */
  async saveContestScore(learnerId, contestId, score, timeTakenMs) {
    const result = await db.query(
      `INSERT INTO contest_scores (learner_id, contest_id, score, time_taken_ms, submitted_at) 
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) 
       ON CONFLICT (learner_id, contest_id) 
       DO UPDATE SET score = $3, time_taken_ms = $4, submitted_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [learnerId, contestId, score, timeTakenMs]
    );
    return result.rows[0];
  }

  /**
   * Save contest submissions (bulk insert)
   */
  async saveContestSubmissions(learnerId, contestId, submissions) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      for (const submission of submissions) {
        await client.query(
          `INSERT INTO contest_submissions (learner_id, contest_id, question_id, selected_option_id, is_correct, submitted_at) 
           VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
          [learnerId, contestId, submission.question_id, submission.selected_option_id, submission.is_correct]
        );
      }
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get leaderboard for a contest
   */
  async getLeaderboard(contestId) {
    const result = await db.query(
      `SELECT 
        cs.learner_id,
        COALESCE(l.contest_name, l.name) AS display_name,
        cs.score,
        cs.time_taken_ms,
        cs.submitted_at,
        ROW_NUMBER() OVER (ORDER BY cs.score DESC, cs.time_taken_ms ASC) as rank
       FROM contest_scores cs
       JOIN learners l ON l.id = cs.learner_id
       WHERE cs.contest_id = $1
       ORDER BY cs.score DESC, cs.time_taken_ms ASC`,
      [contestId]
    );
    return result.rows;
  }

  /**
   * Get user's contest result
   */
  async getUserContestResult(learnerId, contestId) {
    const result = await db.query(
      `SELECT 
        cs.score,
        cs.time_taken_ms,
        cs.submitted_at,
        (SELECT COUNT(*) + 1 FROM contest_scores 
         WHERE contest_id = cs.contest_id 
         AND (score > cs.score OR (score = cs.score AND time_taken_ms < cs.time_taken_ms))) as rank,
        (SELECT COUNT(*) FROM contest_scores WHERE contest_id = cs.contest_id) as total_participants
       FROM contest_scores cs
       WHERE cs.learner_id = $1 AND cs.contest_id = $2`,
      [learnerId, contestId]
    );
    return result.rows[0] || null;
  }

  /**
   * Get contest by ID (basic info)
   */
  async getContestById(contestId) {
    const result = await db.query(
      'SELECT * FROM contests WHERE id = $1',
      [contestId]
    );
    return result.rows[0] || null;
  }

  /**
   * Get user's submissions for a contest
   */
  async getUserSubmissions(learnerId, contestId) {
    const result = await db.query(
      `SELECT 
        cs.question_id,
        cs.selected_option_id,
        cs.is_correct,
        cq.question_text,
        cq.options,
        cq.correct_option_id
       FROM contest_submissions cs
       JOIN contest_questions cq ON cq.id = cs.question_id
       WHERE cs.learner_id = $1 AND cs.contest_id = $2
       ORDER BY cs.question_id`,
      [learnerId, contestId]
    );
    return result.rows;
  }

  /**
   * Get all contests a user has participated in
   */
  async getUserContests(learnerId) {
    const result = await db.query(
      `SELECT 
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
       ORDER BY cs.submitted_at DESC`,
      [learnerId]
    );
    return result.rows;
  }
}

export default new ContestRepository();
