import db from '../config/db.js';

class ChatRepository {
  /**
   * Create a new chat session
   */
  async createSession(userId, language, proficiencyLevel) {
    const query = `
      INSERT INTO chat_sessions (user_id, language, proficiency_level, title)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const title = `${language} Chat Session`;
    const values = [userId, language, proficiencyLevel, title];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }
  }

  /**
   * Get recent chat messages for context (last N messages)
   */
  async getRecentMessages(sessionId, limit = 8) {
    const query = `
      SELECT id, sender_type, content, created_at
      FROM chat_messages
      WHERE session_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `;
    
    try {
      const result = await db.query(query, [sessionId, limit]);
      // Return in chronological order (oldest first)
      return result.rows.reverse();
    } catch (error) {
      console.error('Error fetching recent messages:', error);
      throw error;
    }
  }

  /**
   * Save a chat message
   */
  async saveMessage(sessionId, userId, senderType, content) {
    const query = `
      INSERT INTO chat_messages (session_id, user_id, sender_type, content)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [sessionId, userId, senderType, content];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error saving chat message:', error);
      throw error;
    }
  }

  /**
   * Get user's chat sessions
   */
  async getUserSessions(userId, limit = 10) {
    const query = `
      SELECT id, title, language, proficiency_level, message_count, 
             last_activity, created_at
      FROM chat_sessions
      WHERE user_id = $1
      ORDER BY last_activity DESC
      LIMIT $2
    `;
    
    try {
      const result = await db.query(query, [userId, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      throw error;
    }
  }

  /**
   * Get session by ID with user validation
   */
  async getSessionById(sessionId, userId) {
    const query = `
      SELECT * FROM chat_sessions
      WHERE id = $1 AND user_id = $2
    `;
    
    try {
      const result = await db.query(query, [sessionId, userId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching session:', error);
      throw error;
    }
  }

  /**
   * Get user's current language and proficiency from preferences
   */
  async getUserLanguageInfo(userId) {
    const query = `
      SELECT language, expected_duration
      FROM learner_preferences
      WHERE learner_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    try {
      const result = await db.query(query, [userId]);
      if (result.rows.length > 0) {
        const pref = result.rows[0];
        // Map duration to proficiency level
        const proficiencyMap = {
          '1 month': 'Beginner',
          '3 months': 'Beginner',
          '6 months': 'Intermediate',
          '1 year': 'Advanced'
        };
        
        return {
          language: pref.language,
          proficiency: proficiencyMap[pref.expected_duration] || 'Beginner'
        };
      }
      
      // Default if no preferences found
      return {
        language: 'English',
        proficiency: 'Beginner'
      };
    } catch (error) {
      console.error('Error fetching user language info:', error);
      throw error;
    }
  }

  /**
   * Delete old chat sessions (cleanup)
   */
  async deleteOldSessions(daysOld = 30) {
    const query = `
      DELETE FROM chat_sessions
      WHERE last_activity < NOW() - INTERVAL '${daysOld} days'
    `;
    
    try {
      const result = await db.query(query);
      return result.rowCount;
    } catch (error) {
      console.error('Error deleting old sessions:', error);
      throw error;
    }
  }
}

export default new ChatRepository();
