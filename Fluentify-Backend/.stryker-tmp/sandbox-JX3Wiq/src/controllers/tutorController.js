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
import tutorService from '../services/tutorService.js';
import { ERRORS } from '../utils/error.js';
class TutorController {
  /**
   * Handle streaming chat message
   */
  async sendMessage(req, res, next) {
    if (stryMutAct_9fa48("1738")) {
      {}
    } else {
      stryCov_9fa48("1738");
      try {
        if (stryMutAct_9fa48("1739")) {
          {}
        } else {
          stryCov_9fa48("1739");
          const {
            message,
            sessionId
          } = req.body;
          const userId = req.user.id;

          // Validate message
          const validatedMessage = tutorService.validateMessage(message);

          // Get or create session
          const session = await tutorService.getOrCreateSession(userId, sessionId);

          // Set headers for streaming response
          res.setHeader(stryMutAct_9fa48("1740") ? "" : (stryCov_9fa48("1740"), 'Content-Type'), stryMutAct_9fa48("1741") ? "" : (stryCov_9fa48("1741"), 'text/plain; charset=utf-8'));
          res.setHeader(stryMutAct_9fa48("1742") ? "" : (stryCov_9fa48("1742"), 'Transfer-Encoding'), stryMutAct_9fa48("1743") ? "" : (stryCov_9fa48("1743"), 'chunked'));
          res.setHeader(stryMutAct_9fa48("1744") ? "" : (stryCov_9fa48("1744"), 'Cache-Control'), stryMutAct_9fa48("1745") ? "" : (stryCov_9fa48("1745"), 'no-cache'));
          res.setHeader(stryMutAct_9fa48("1746") ? "" : (stryCov_9fa48("1746"), 'Connection'), stryMutAct_9fa48("1747") ? "" : (stryCov_9fa48("1747"), 'keep-alive'));

          // Send session ID first (for new sessions)
          if (stryMutAct_9fa48("1750") ? false : stryMutAct_9fa48("1749") ? true : stryMutAct_9fa48("1748") ? sessionId : (stryCov_9fa48("1748", "1749", "1750"), !sessionId)) {
            if (stryMutAct_9fa48("1751")) {
              {}
            } else {
              stryCov_9fa48("1751");
              res.write(stryMutAct_9fa48("1752") ? `` : (stryCov_9fa48("1752"), `SESSION_ID:${session.id}\n`));
            }
          }
          let fullAiResponse = stryMutAct_9fa48("1753") ? "Stryker was here!" : (stryCov_9fa48("1753"), '');
          try {
            if (stryMutAct_9fa48("1754")) {
              {}
            } else {
              stryCov_9fa48("1754");
              // Get streaming response from AI
              const stream = await tutorService.generateStreamingResponse(validatedMessage, session.id, userId);

              // Stream chunks to client
              for await (const chunk of stream) {
                if (stryMutAct_9fa48("1755")) {
                  {}
                } else {
                  stryCov_9fa48("1755");
                  const chunkText = chunk.text();
                  if (stryMutAct_9fa48("1757") ? false : stryMutAct_9fa48("1756") ? true : (stryCov_9fa48("1756", "1757"), chunkText)) {
                    if (stryMutAct_9fa48("1758")) {
                      {}
                    } else {
                      stryCov_9fa48("1758");
                      const sanitizedChunk = tutorService.sanitizeResponse(chunkText);
                      stryMutAct_9fa48("1759") ? fullAiResponse -= sanitizedChunk : (stryCov_9fa48("1759"), fullAiResponse += sanitizedChunk);
                      res.write(sanitizedChunk);
                    }
                  }
                }
              }

              // End the stream
              res.end();

              // Save conversation asynchronously (don't await)
              tutorService.saveConversation(session.id, userId, validatedMessage, fullAiResponse).catch(error => {
                if (stryMutAct_9fa48("1760")) {
                  {}
                } else {
                  stryCov_9fa48("1760");
                  console.error(stryMutAct_9fa48("1761") ? "" : (stryCov_9fa48("1761"), 'Failed to save conversation:'), error);
                }
              });
            }
          } catch (aiError) {
            if (stryMutAct_9fa48("1762")) {
              {}
            } else {
              stryCov_9fa48("1762");
              console.error(stryMutAct_9fa48("1763") ? "" : (stryCov_9fa48("1763"), 'AI generation error:'), aiError);

              // Send error message to client
              const errorMessage = stryMutAct_9fa48("1764") ? "" : (stryCov_9fa48("1764"), 'I apologize, but I\'m having trouble responding right now. Please try again in a moment.');
              res.write(errorMessage);
              res.end();

              // Still try to save the user message
              tutorService.saveConversation(session.id, userId, validatedMessage, errorMessage).catch(error => {
                if (stryMutAct_9fa48("1765")) {
                  {}
                } else {
                  stryCov_9fa48("1765");
                  console.error(stryMutAct_9fa48("1766") ? "" : (stryCov_9fa48("1766"), 'Failed to save error conversation:'), error);
                }
              });
            }
          }
        }
      } catch (error) {
        if (stryMutAct_9fa48("1767")) {
          {}
        } else {
          stryCov_9fa48("1767");
          console.error(stryMutAct_9fa48("1768") ? "" : (stryCov_9fa48("1768"), 'Chat controller error:'), error);

          // Handle different error types
          if (stryMutAct_9fa48("1771") ? (error.message.includes('Message is required') || error.message.includes('Message cannot be empty')) && error.message.includes('Message is too long') : stryMutAct_9fa48("1770") ? false : stryMutAct_9fa48("1769") ? true : (stryCov_9fa48("1769", "1770", "1771"), (stryMutAct_9fa48("1773") ? error.message.includes('Message is required') && error.message.includes('Message cannot be empty') : stryMutAct_9fa48("1772") ? false : (stryCov_9fa48("1772", "1773"), error.message.includes(stryMutAct_9fa48("1774") ? "" : (stryCov_9fa48("1774"), 'Message is required')) || error.message.includes(stryMutAct_9fa48("1775") ? "" : (stryCov_9fa48("1775"), 'Message cannot be empty')))) || error.message.includes(stryMutAct_9fa48("1776") ? "" : (stryCov_9fa48("1776"), 'Message is too long')))) {
            if (stryMutAct_9fa48("1777")) {
              {}
            } else {
              stryCov_9fa48("1777");
              return res.status(400).json(stryMutAct_9fa48("1778") ? {} : (stryCov_9fa48("1778"), {
                success: stryMutAct_9fa48("1779") ? true : (stryCov_9fa48("1779"), false),
                error: stryMutAct_9fa48("1780") ? "" : (stryCov_9fa48("1780"), 'validation_error'),
                message: error.message
              }));
            }
          }
          if (stryMutAct_9fa48("1782") ? false : stryMutAct_9fa48("1781") ? true : (stryCov_9fa48("1781", "1782"), error.message.includes(stryMutAct_9fa48("1783") ? "" : (stryCov_9fa48("1783"), 'AI service error')))) {
            if (stryMutAct_9fa48("1784")) {
              {}
            } else {
              stryCov_9fa48("1784");
              return res.status(503).json(stryMutAct_9fa48("1785") ? {} : (stryCov_9fa48("1785"), {
                success: stryMutAct_9fa48("1786") ? true : (stryCov_9fa48("1786"), false),
                error: stryMutAct_9fa48("1787") ? "" : (stryCov_9fa48("1787"), 'ai_failure'),
                message: stryMutAct_9fa48("1788") ? "" : (stryCov_9fa48("1788"), 'Our AI tutor is temporarily unavailable.')
              }));
            }
          }
          return next(ERRORS.INTERNAL_SERVER_ERROR);
        }
      }
    }
  }

  /**
   * Get user's chat history
   */
  async getChatHistory(req, res, next) {
    if (stryMutAct_9fa48("1789")) {
      {}
    } else {
      stryCov_9fa48("1789");
      try {
        if (stryMutAct_9fa48("1790")) {
          {}
        } else {
          stryCov_9fa48("1790");
          const userId = req.user.id;
          const limit = stryMutAct_9fa48("1793") ? parseInt(req.query.limit) && 10 : stryMutAct_9fa48("1792") ? false : stryMutAct_9fa48("1791") ? true : (stryCov_9fa48("1791", "1792", "1793"), parseInt(req.query.limit) || 10);
          const sessions = await tutorService.getUserChatHistory(userId, limit);
          res.json(stryMutAct_9fa48("1794") ? {} : (stryCov_9fa48("1794"), {
            success: stryMutAct_9fa48("1795") ? false : (stryCov_9fa48("1795"), true),
            data: stryMutAct_9fa48("1796") ? {} : (stryCov_9fa48("1796"), {
              sessions
            })
          }));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1797")) {
          {}
        } else {
          stryCov_9fa48("1797");
          console.error(stryMutAct_9fa48("1798") ? "" : (stryCov_9fa48("1798"), 'Error fetching chat history:'), error);
          return next(ERRORS.INTERNAL_SERVER_ERROR);
        }
      }
    }
  }

  /**
   * Create a new chat session
   */
  async createSession(req, res, next) {
    if (stryMutAct_9fa48("1799")) {
      {}
    } else {
      stryCov_9fa48("1799");
      try {
        if (stryMutAct_9fa48("1800")) {
          {}
        } else {
          stryCov_9fa48("1800");
          const userId = req.user.id;
          const session = await tutorService.getOrCreateSession(userId);
          res.json(stryMutAct_9fa48("1801") ? {} : (stryCov_9fa48("1801"), {
            success: stryMutAct_9fa48("1802") ? false : (stryCov_9fa48("1802"), true),
            data: stryMutAct_9fa48("1803") ? {} : (stryCov_9fa48("1803"), {
              session
            })
          }));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1804")) {
          {}
        } else {
          stryCov_9fa48("1804");
          console.error(stryMutAct_9fa48("1805") ? "" : (stryCov_9fa48("1805"), 'Error creating chat session:'), error);
          return next(ERRORS.INTERNAL_SERVER_ERROR);
        }
      }
    }
  }

  /**
   * Health check for tutor service
   */
  async healthCheck(req, res) {
    if (stryMutAct_9fa48("1806")) {
      {}
    } else {
      stryCov_9fa48("1806");
      try {
        if (stryMutAct_9fa48("1807")) {
          {}
        } else {
          stryCov_9fa48("1807");
          res.json(stryMutAct_9fa48("1808") ? {} : (stryCov_9fa48("1808"), {
            success: stryMutAct_9fa48("1809") ? false : (stryCov_9fa48("1809"), true),
            message: stryMutAct_9fa48("1810") ? "" : (stryCov_9fa48("1810"), 'AI Tutor service is operational'),
            timestamp: new Date().toISOString()
          }));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1811")) {
          {}
        } else {
          stryCov_9fa48("1811");
          res.status(503).json(stryMutAct_9fa48("1812") ? {} : (stryCov_9fa48("1812"), {
            success: stryMutAct_9fa48("1813") ? true : (stryCov_9fa48("1813"), false),
            error: stryMutAct_9fa48("1814") ? "" : (stryCov_9fa48("1814"), 'service_unavailable'),
            message: stryMutAct_9fa48("1815") ? "" : (stryCov_9fa48("1815"), 'AI Tutor service is currently unavailable')
          }));
        }
      }
    }
  }
}
export default new TutorController();