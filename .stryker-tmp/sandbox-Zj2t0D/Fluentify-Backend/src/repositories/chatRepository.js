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
    if (stryMutAct_9fa48("2342")) {
      {}
    } else {
      stryCov_9fa48("2342");
      const query = stryMutAct_9fa48("2343") ? `` : (stryCov_9fa48("2343"), `
      INSERT INTO chat_sessions (user_id, language, proficiency_level, title)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `);
      const title = stryMutAct_9fa48("2344") ? `` : (stryCov_9fa48("2344"), `${language} Chat Session`);
      const values = stryMutAct_9fa48("2345") ? [] : (stryCov_9fa48("2345"), [userId, language, proficiencyLevel, title]);
      try {
        if (stryMutAct_9fa48("2346")) {
          {}
        } else {
          stryCov_9fa48("2346");
          const result = await db.query(query, values);
          return result.rows[0];
        }
      } catch (error) {
        if (stryMutAct_9fa48("2347")) {
          {}
        } else {
          stryCov_9fa48("2347");
          console.error(stryMutAct_9fa48("2348") ? "" : (stryCov_9fa48("2348"), 'Error creating chat session:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Get recent chat messages for context (last N messages)
   */
  async getRecentMessages(sessionId, limit = 8) {
    if (stryMutAct_9fa48("2349")) {
      {}
    } else {
      stryCov_9fa48("2349");
      const query = stryMutAct_9fa48("2350") ? `` : (stryCov_9fa48("2350"), `
      SELECT id, sender_type, content, created_at
      FROM chat_messages
      WHERE session_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `);
      try {
        if (stryMutAct_9fa48("2351")) {
          {}
        } else {
          stryCov_9fa48("2351");
          const result = await db.query(query, stryMutAct_9fa48("2352") ? [] : (stryCov_9fa48("2352"), [sessionId, limit]));
          // Return in chronological order (oldest first)
          return stryMutAct_9fa48("2353") ? result.rows : (stryCov_9fa48("2353"), result.rows.reverse());
        }
      } catch (error) {
        if (stryMutAct_9fa48("2354")) {
          {}
        } else {
          stryCov_9fa48("2354");
          console.error(stryMutAct_9fa48("2355") ? "" : (stryCov_9fa48("2355"), 'Error fetching recent messages:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Save a chat message
   */
  async saveMessage(sessionId, userId, senderType, content) {
    if (stryMutAct_9fa48("2356")) {
      {}
    } else {
      stryCov_9fa48("2356");
      const query = stryMutAct_9fa48("2357") ? `` : (stryCov_9fa48("2357"), `
      INSERT INTO chat_messages (session_id, user_id, sender_type, content)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `);
      const values = stryMutAct_9fa48("2358") ? [] : (stryCov_9fa48("2358"), [sessionId, userId, senderType, content]);
      try {
        if (stryMutAct_9fa48("2359")) {
          {}
        } else {
          stryCov_9fa48("2359");
          const result = await db.query(query, values);
          return result.rows[0];
        }
      } catch (error) {
        if (stryMutAct_9fa48("2360")) {
          {}
        } else {
          stryCov_9fa48("2360");
          console.error(stryMutAct_9fa48("2361") ? "" : (stryCov_9fa48("2361"), 'Error saving chat message:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Get user's chat sessions
   */
  async getUserSessions(userId, limit = 10) {
    if (stryMutAct_9fa48("2362")) {
      {}
    } else {
      stryCov_9fa48("2362");
      const query = stryMutAct_9fa48("2363") ? `` : (stryCov_9fa48("2363"), `
      SELECT id, title, language, proficiency_level, message_count, 
             last_activity, created_at
      FROM chat_sessions
      WHERE user_id = $1
      ORDER BY last_activity DESC
      LIMIT $2
    `);
      try {
        if (stryMutAct_9fa48("2364")) {
          {}
        } else {
          stryCov_9fa48("2364");
          const result = await db.query(query, stryMutAct_9fa48("2365") ? [] : (stryCov_9fa48("2365"), [userId, limit]));
          return result.rows;
        }
      } catch (error) {
        if (stryMutAct_9fa48("2366")) {
          {}
        } else {
          stryCov_9fa48("2366");
          console.error(stryMutAct_9fa48("2367") ? "" : (stryCov_9fa48("2367"), 'Error fetching user sessions:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Get session by ID with user validation
   */
  async getSessionById(sessionId, userId) {
    if (stryMutAct_9fa48("2368")) {
      {}
    } else {
      stryCov_9fa48("2368");
      const query = stryMutAct_9fa48("2369") ? `` : (stryCov_9fa48("2369"), `
      SELECT * FROM chat_sessions
      WHERE id = $1 AND user_id = $2
    `);
      try {
        if (stryMutAct_9fa48("2370")) {
          {}
        } else {
          stryCov_9fa48("2370");
          const result = await db.query(query, stryMutAct_9fa48("2371") ? [] : (stryCov_9fa48("2371"), [sessionId, userId]));
          return result.rows[0];
        }
      } catch (error) {
        if (stryMutAct_9fa48("2372")) {
          {}
        } else {
          stryCov_9fa48("2372");
          console.error(stryMutAct_9fa48("2373") ? "" : (stryCov_9fa48("2373"), 'Error fetching session:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Get user's current language and proficiency from preferences
   */
  async getUserLanguageInfo(userId) {
    if (stryMutAct_9fa48("2374")) {
      {}
    } else {
      stryCov_9fa48("2374");
      const query = stryMutAct_9fa48("2375") ? `` : (stryCov_9fa48("2375"), `
      SELECT language, expected_duration
      FROM learner_preferences
      WHERE learner_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `);
      try {
        if (stryMutAct_9fa48("2376")) {
          {}
        } else {
          stryCov_9fa48("2376");
          const result = await db.query(query, stryMutAct_9fa48("2377") ? [] : (stryCov_9fa48("2377"), [userId]));
          if (stryMutAct_9fa48("2381") ? result.rows.length <= 0 : stryMutAct_9fa48("2380") ? result.rows.length >= 0 : stryMutAct_9fa48("2379") ? false : stryMutAct_9fa48("2378") ? true : (stryCov_9fa48("2378", "2379", "2380", "2381"), result.rows.length > 0)) {
            if (stryMutAct_9fa48("2382")) {
              {}
            } else {
              stryCov_9fa48("2382");
              const pref = result.rows[0];
              // Map duration to proficiency level
              const proficiencyMap = stryMutAct_9fa48("2383") ? {} : (stryCov_9fa48("2383"), {
                '1 month': stryMutAct_9fa48("2384") ? "" : (stryCov_9fa48("2384"), 'Beginner'),
                '3 months': stryMutAct_9fa48("2385") ? "" : (stryCov_9fa48("2385"), 'Beginner'),
                '6 months': stryMutAct_9fa48("2386") ? "" : (stryCov_9fa48("2386"), 'Intermediate'),
                '1 year': stryMutAct_9fa48("2387") ? "" : (stryCov_9fa48("2387"), 'Advanced')
              });
              return stryMutAct_9fa48("2388") ? {} : (stryCov_9fa48("2388"), {
                language: pref.language,
                proficiency: stryMutAct_9fa48("2391") ? proficiencyMap[pref.expected_duration] && 'Beginner' : stryMutAct_9fa48("2390") ? false : stryMutAct_9fa48("2389") ? true : (stryCov_9fa48("2389", "2390", "2391"), proficiencyMap[pref.expected_duration] || (stryMutAct_9fa48("2392") ? "" : (stryCov_9fa48("2392"), 'Beginner')))
              });
            }
          }

          // Default if no preferences found
          return stryMutAct_9fa48("2393") ? {} : (stryCov_9fa48("2393"), {
            language: stryMutAct_9fa48("2394") ? "" : (stryCov_9fa48("2394"), 'English'),
            proficiency: stryMutAct_9fa48("2395") ? "" : (stryCov_9fa48("2395"), 'Beginner')
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("2396")) {
          {}
        } else {
          stryCov_9fa48("2396");
          console.error(stryMutAct_9fa48("2397") ? "" : (stryCov_9fa48("2397"), 'Error fetching user language info:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Delete old chat sessions (cleanup)
   */
  async deleteOldSessions(daysOld = 30) {
    if (stryMutAct_9fa48("2398")) {
      {}
    } else {
      stryCov_9fa48("2398");
      const query = stryMutAct_9fa48("2399") ? `` : (stryCov_9fa48("2399"), `
      DELETE FROM chat_sessions
      WHERE last_activity < NOW() - INTERVAL '${daysOld} days'
    `);
      try {
        if (stryMutAct_9fa48("2400")) {
          {}
        } else {
          stryCov_9fa48("2400");
          const result = await db.query(query);
          return result.rowCount;
        }
      } catch (error) {
        if (stryMutAct_9fa48("2401")) {
          {}
        } else {
          stryCov_9fa48("2401");
          console.error(stryMutAct_9fa48("2402") ? "" : (stryCov_9fa48("2402"), 'Error deleting old sessions:'), error);
          throw error;
        }
      }
    }
  }
}
export default new ChatRepository();