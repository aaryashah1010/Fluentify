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
class ChatRepository {
  /**
   * Create a new chat session
   */
  async createSession(userId, language, proficiencyLevel) {
    if (stryMutAct_9fa48("2180")) {
      {}
    } else {
      stryCov_9fa48("2180");
      const query = stryMutAct_9fa48("2181") ? `` : (stryCov_9fa48("2181"), `
      INSERT INTO chat_sessions (user_id, language, proficiency_level, title)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `);
      const title = stryMutAct_9fa48("2182") ? `` : (stryCov_9fa48("2182"), `${language} Chat Session`);
      const values = stryMutAct_9fa48("2183") ? [] : (stryCov_9fa48("2183"), [userId, language, proficiencyLevel, title]);
      try {
        if (stryMutAct_9fa48("2184")) {
          {}
        } else {
          stryCov_9fa48("2184");
          const result = await db.query(query, values);
          return result.rows[0];
        }
      } catch (error) {
        if (stryMutAct_9fa48("2185")) {
          {}
        } else {
          stryCov_9fa48("2185");
          console.error(stryMutAct_9fa48("2186") ? "" : (stryCov_9fa48("2186"), 'Error creating chat session:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Get recent chat messages for context (last N messages)
   */
  async getRecentMessages(sessionId, limit = 8) {
    if (stryMutAct_9fa48("2187")) {
      {}
    } else {
      stryCov_9fa48("2187");
      const query = stryMutAct_9fa48("2188") ? `` : (stryCov_9fa48("2188"), `
      SELECT id, sender_type, content, created_at
      FROM chat_messages
      WHERE session_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `);
      try {
        if (stryMutAct_9fa48("2189")) {
          {}
        } else {
          stryCov_9fa48("2189");
          const result = await db.query(query, stryMutAct_9fa48("2190") ? [] : (stryCov_9fa48("2190"), [sessionId, limit]));
          // Return in chronological order (oldest first)
          return stryMutAct_9fa48("2191") ? result.rows : (stryCov_9fa48("2191"), result.rows.reverse());
        }
      } catch (error) {
        if (stryMutAct_9fa48("2192")) {
          {}
        } else {
          stryCov_9fa48("2192");
          console.error(stryMutAct_9fa48("2193") ? "" : (stryCov_9fa48("2193"), 'Error fetching recent messages:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Save a chat message
   */
  async saveMessage(sessionId, userId, senderType, content) {
    if (stryMutAct_9fa48("2194")) {
      {}
    } else {
      stryCov_9fa48("2194");
      const query = stryMutAct_9fa48("2195") ? `` : (stryCov_9fa48("2195"), `
      INSERT INTO chat_messages (session_id, user_id, sender_type, content)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `);
      const values = stryMutAct_9fa48("2196") ? [] : (stryCov_9fa48("2196"), [sessionId, userId, senderType, content]);
      try {
        if (stryMutAct_9fa48("2197")) {
          {}
        } else {
          stryCov_9fa48("2197");
          const result = await db.query(query, values);
          return result.rows[0];
        }
      } catch (error) {
        if (stryMutAct_9fa48("2198")) {
          {}
        } else {
          stryCov_9fa48("2198");
          console.error(stryMutAct_9fa48("2199") ? "" : (stryCov_9fa48("2199"), 'Error saving chat message:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Get user's chat sessions
   */
  async getUserSessions(userId, limit = 10) {
    if (stryMutAct_9fa48("2200")) {
      {}
    } else {
      stryCov_9fa48("2200");
      const query = stryMutAct_9fa48("2201") ? `` : (stryCov_9fa48("2201"), `
      SELECT id, title, language, proficiency_level, message_count, 
             last_activity, created_at
      FROM chat_sessions
      WHERE user_id = $1
      ORDER BY last_activity DESC
      LIMIT $2
    `);
      try {
        if (stryMutAct_9fa48("2202")) {
          {}
        } else {
          stryCov_9fa48("2202");
          const result = await db.query(query, stryMutAct_9fa48("2203") ? [] : (stryCov_9fa48("2203"), [userId, limit]));
          return result.rows;
        }
      } catch (error) {
        if (stryMutAct_9fa48("2204")) {
          {}
        } else {
          stryCov_9fa48("2204");
          console.error(stryMutAct_9fa48("2205") ? "" : (stryCov_9fa48("2205"), 'Error fetching user sessions:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Get session by ID with user validation
   */
  async getSessionById(sessionId, userId) {
    if (stryMutAct_9fa48("2206")) {
      {}
    } else {
      stryCov_9fa48("2206");
      const query = stryMutAct_9fa48("2207") ? `` : (stryCov_9fa48("2207"), `
      SELECT * FROM chat_sessions
      WHERE id = $1 AND user_id = $2
    `);
      try {
        if (stryMutAct_9fa48("2208")) {
          {}
        } else {
          stryCov_9fa48("2208");
          const result = await db.query(query, stryMutAct_9fa48("2209") ? [] : (stryCov_9fa48("2209"), [sessionId, userId]));
          return result.rows[0];
        }
      } catch (error) {
        if (stryMutAct_9fa48("2210")) {
          {}
        } else {
          stryCov_9fa48("2210");
          console.error(stryMutAct_9fa48("2211") ? "" : (stryCov_9fa48("2211"), 'Error fetching session:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Get user's current language and proficiency from preferences
   */
  async getUserLanguageInfo(userId) {
    if (stryMutAct_9fa48("2212")) {
      {}
    } else {
      stryCov_9fa48("2212");
      const query = stryMutAct_9fa48("2213") ? `` : (stryCov_9fa48("2213"), `
      SELECT language, expected_duration
      FROM learner_preferences
      WHERE learner_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `);
      try {
        if (stryMutAct_9fa48("2214")) {
          {}
        } else {
          stryCov_9fa48("2214");
          const result = await db.query(query, stryMutAct_9fa48("2215") ? [] : (stryCov_9fa48("2215"), [userId]));
          if (stryMutAct_9fa48("2219") ? result.rows.length <= 0 : stryMutAct_9fa48("2218") ? result.rows.length >= 0 : stryMutAct_9fa48("2217") ? false : stryMutAct_9fa48("2216") ? true : (stryCov_9fa48("2216", "2217", "2218", "2219"), result.rows.length > 0)) {
            if (stryMutAct_9fa48("2220")) {
              {}
            } else {
              stryCov_9fa48("2220");
              const pref = result.rows[0];
              // Map duration to proficiency level
              const proficiencyMap = stryMutAct_9fa48("2221") ? {} : (stryCov_9fa48("2221"), {
                '1 month': stryMutAct_9fa48("2222") ? "" : (stryCov_9fa48("2222"), 'Beginner'),
                '3 months': stryMutAct_9fa48("2223") ? "" : (stryCov_9fa48("2223"), 'Beginner'),
                '6 months': stryMutAct_9fa48("2224") ? "" : (stryCov_9fa48("2224"), 'Intermediate'),
                '1 year': stryMutAct_9fa48("2225") ? "" : (stryCov_9fa48("2225"), 'Advanced')
              });
              return stryMutAct_9fa48("2226") ? {} : (stryCov_9fa48("2226"), {
                language: pref.language,
                proficiency: stryMutAct_9fa48("2229") ? proficiencyMap[pref.expected_duration] && 'Beginner' : stryMutAct_9fa48("2228") ? false : stryMutAct_9fa48("2227") ? true : (stryCov_9fa48("2227", "2228", "2229"), proficiencyMap[pref.expected_duration] || (stryMutAct_9fa48("2230") ? "" : (stryCov_9fa48("2230"), 'Beginner')))
              });
            }
          }

          // Default if no preferences found
          return stryMutAct_9fa48("2231") ? {} : (stryCov_9fa48("2231"), {
            language: stryMutAct_9fa48("2232") ? "" : (stryCov_9fa48("2232"), 'English'),
            proficiency: stryMutAct_9fa48("2233") ? "" : (stryCov_9fa48("2233"), 'Beginner')
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("2234")) {
          {}
        } else {
          stryCov_9fa48("2234");
          console.error(stryMutAct_9fa48("2235") ? "" : (stryCov_9fa48("2235"), 'Error fetching user language info:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Delete old chat sessions (cleanup)
   */
  async deleteOldSessions(daysOld = 30) {
    if (stryMutAct_9fa48("2236")) {
      {}
    } else {
      stryCov_9fa48("2236");
      const query = stryMutAct_9fa48("2237") ? `` : (stryCov_9fa48("2237"), `
      DELETE FROM chat_sessions
      WHERE last_activity < NOW() - INTERVAL '${daysOld} days'
    `);
      try {
        if (stryMutAct_9fa48("2238")) {
          {}
        } else {
          stryCov_9fa48("2238");
          const result = await db.query(query);
          return result.rowCount;
        }
      } catch (error) {
        if (stryMutAct_9fa48("2239")) {
          {}
        } else {
          stryCov_9fa48("2239");
          console.error(stryMutAct_9fa48("2240") ? "" : (stryCov_9fa48("2240"), 'Error deleting old sessions:'), error);
          throw error;
        }
      }
    }
  }
}
export default new ChatRepository();