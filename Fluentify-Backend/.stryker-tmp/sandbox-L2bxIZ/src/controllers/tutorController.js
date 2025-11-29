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
    if (stryMutAct_9fa48("1740")) {
      {}
    } else {
      stryCov_9fa48("1740");
      try {
        if (stryMutAct_9fa48("1741")) {
          {}
        } else {
          stryCov_9fa48("1741");
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
          res.setHeader(stryMutAct_9fa48("1742") ? "" : (stryCov_9fa48("1742"), 'Content-Type'), stryMutAct_9fa48("1743") ? "" : (stryCov_9fa48("1743"), 'text/plain; charset=utf-8'));
          res.setHeader(stryMutAct_9fa48("1744") ? "" : (stryCov_9fa48("1744"), 'Transfer-Encoding'), stryMutAct_9fa48("1745") ? "" : (stryCov_9fa48("1745"), 'chunked'));
          res.setHeader(stryMutAct_9fa48("1746") ? "" : (stryCov_9fa48("1746"), 'Cache-Control'), stryMutAct_9fa48("1747") ? "" : (stryCov_9fa48("1747"), 'no-cache'));
          res.setHeader(stryMutAct_9fa48("1748") ? "" : (stryCov_9fa48("1748"), 'Connection'), stryMutAct_9fa48("1749") ? "" : (stryCov_9fa48("1749"), 'keep-alive'));

          // Send session ID first (for new sessions)
          if (stryMutAct_9fa48("1752") ? false : stryMutAct_9fa48("1751") ? true : stryMutAct_9fa48("1750") ? sessionId : (stryCov_9fa48("1750", "1751", "1752"), !sessionId)) {
            if (stryMutAct_9fa48("1753")) {
              {}
            } else {
              stryCov_9fa48("1753");
              res.write(stryMutAct_9fa48("1754") ? `` : (stryCov_9fa48("1754"), `SESSION_ID:${session.id}\n`));
            }
          }
          let fullAiResponse = stryMutAct_9fa48("1755") ? "Stryker was here!" : (stryCov_9fa48("1755"), '');
          try {
            if (stryMutAct_9fa48("1756")) {
              {}
            } else {
              stryCov_9fa48("1756");
              // Get streaming response from AI
              const stream = await tutorService.generateStreamingResponse(validatedMessage, session.id, userId);

              // Stream chunks to client
              for await (const chunk of stream) {
                if (stryMutAct_9fa48("1757")) {
                  {}
                } else {
                  stryCov_9fa48("1757");
                  const chunkText = chunk.text();
                  if (stryMutAct_9fa48("1759") ? false : stryMutAct_9fa48("1758") ? true : (stryCov_9fa48("1758", "1759"), chunkText)) {
                    if (stryMutAct_9fa48("1760")) {
                      {}
                    } else {
                      stryCov_9fa48("1760");
                      const sanitizedChunk = tutorService.sanitizeResponse(chunkText);
                      stryMutAct_9fa48("1761") ? fullAiResponse -= sanitizedChunk : (stryCov_9fa48("1761"), fullAiResponse += sanitizedChunk);
                      res.write(sanitizedChunk);
                    }
                  }
                }
              }

              // End the stream
              res.end();

              // Save conversation asynchronously (don't await)
              tutorService.saveConversation(session.id, userId, validatedMessage, fullAiResponse).catch(error => {
                if (stryMutAct_9fa48("1762")) {
                  {}
                } else {
                  stryCov_9fa48("1762");
                  console.error(stryMutAct_9fa48("1763") ? "" : (stryCov_9fa48("1763"), 'Failed to save conversation:'), error);
                }
              });
            }
          } catch (aiError) {
            if (stryMutAct_9fa48("1764")) {
              {}
            } else {
              stryCov_9fa48("1764");
              console.error(stryMutAct_9fa48("1765") ? "" : (stryCov_9fa48("1765"), 'AI generation error:'), aiError);

              // Send error message to client
              const errorMessage = stryMutAct_9fa48("1766") ? "" : (stryCov_9fa48("1766"), 'I apologize, but I\'m having trouble responding right now. Please try again in a moment.');
              res.write(errorMessage);
              res.end();

              // Still try to save the user message
              tutorService.saveConversation(session.id, userId, validatedMessage, errorMessage).catch(error => {
                if (stryMutAct_9fa48("1767")) {
                  {}
                } else {
                  stryCov_9fa48("1767");
                  console.error(stryMutAct_9fa48("1768") ? "" : (stryCov_9fa48("1768"), 'Failed to save error conversation:'), error);
                }
              });
            }
          }
        }
      } catch (error) {
        if (stryMutAct_9fa48("1769")) {
          {}
        } else {
          stryCov_9fa48("1769");
          console.error(stryMutAct_9fa48("1770") ? "" : (stryCov_9fa48("1770"), 'Chat controller error:'), error);

          // Handle different error types
          if (stryMutAct_9fa48("1773") ? (error.message.includes('Message is required') || error.message.includes('Message cannot be empty')) && error.message.includes('Message is too long') : stryMutAct_9fa48("1772") ? false : stryMutAct_9fa48("1771") ? true : (stryCov_9fa48("1771", "1772", "1773"), (stryMutAct_9fa48("1775") ? error.message.includes('Message is required') && error.message.includes('Message cannot be empty') : stryMutAct_9fa48("1774") ? false : (stryCov_9fa48("1774", "1775"), error.message.includes(stryMutAct_9fa48("1776") ? "" : (stryCov_9fa48("1776"), 'Message is required')) || error.message.includes(stryMutAct_9fa48("1777") ? "" : (stryCov_9fa48("1777"), 'Message cannot be empty')))) || error.message.includes(stryMutAct_9fa48("1778") ? "" : (stryCov_9fa48("1778"), 'Message is too long')))) {
            if (stryMutAct_9fa48("1779")) {
              {}
            } else {
              stryCov_9fa48("1779");
              return res.status(400).json(stryMutAct_9fa48("1780") ? {} : (stryCov_9fa48("1780"), {
                success: stryMutAct_9fa48("1781") ? true : (stryCov_9fa48("1781"), false),
                error: stryMutAct_9fa48("1782") ? "" : (stryCov_9fa48("1782"), 'validation_error'),
                message: error.message
              }));
            }
          }
          if (stryMutAct_9fa48("1784") ? false : stryMutAct_9fa48("1783") ? true : (stryCov_9fa48("1783", "1784"), error.message.includes(stryMutAct_9fa48("1785") ? "" : (stryCov_9fa48("1785"), 'AI service error')))) {
            if (stryMutAct_9fa48("1786")) {
              {}
            } else {
              stryCov_9fa48("1786");
              return res.status(503).json(stryMutAct_9fa48("1787") ? {} : (stryCov_9fa48("1787"), {
                success: stryMutAct_9fa48("1788") ? true : (stryCov_9fa48("1788"), false),
                error: stryMutAct_9fa48("1789") ? "" : (stryCov_9fa48("1789"), 'ai_failure'),
                message: stryMutAct_9fa48("1790") ? "" : (stryCov_9fa48("1790"), 'Our AI tutor is temporarily unavailable.')
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
    if (stryMutAct_9fa48("1791")) {
      {}
    } else {
      stryCov_9fa48("1791");
      try {
        if (stryMutAct_9fa48("1792")) {
          {}
        } else {
          stryCov_9fa48("1792");
          const userId = req.user.id;
          const limit = stryMutAct_9fa48("1795") ? parseInt(req.query.limit) && 10 : stryMutAct_9fa48("1794") ? false : stryMutAct_9fa48("1793") ? true : (stryCov_9fa48("1793", "1794", "1795"), parseInt(req.query.limit) || 10);
          const sessions = await tutorService.getUserChatHistory(userId, limit);
          res.json(stryMutAct_9fa48("1796") ? {} : (stryCov_9fa48("1796"), {
            success: stryMutAct_9fa48("1797") ? false : (stryCov_9fa48("1797"), true),
            data: stryMutAct_9fa48("1798") ? {} : (stryCov_9fa48("1798"), {
              sessions
            })
          }));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1799")) {
          {}
        } else {
          stryCov_9fa48("1799");
          console.error(stryMutAct_9fa48("1800") ? "" : (stryCov_9fa48("1800"), 'Error fetching chat history:'), error);
          return next(ERRORS.INTERNAL_SERVER_ERROR);
        }
      }
    }
  }

  /**
   * Create a new chat session
   */
  async createSession(req, res, next) {
    if (stryMutAct_9fa48("1801")) {
      {}
    } else {
      stryCov_9fa48("1801");
      try {
        if (stryMutAct_9fa48("1802")) {
          {}
        } else {
          stryCov_9fa48("1802");
          const userId = req.user.id;
          const session = await tutorService.getOrCreateSession(userId);
          res.json(stryMutAct_9fa48("1803") ? {} : (stryCov_9fa48("1803"), {
            success: stryMutAct_9fa48("1804") ? false : (stryCov_9fa48("1804"), true),
            data: stryMutAct_9fa48("1805") ? {} : (stryCov_9fa48("1805"), {
              session
            })
          }));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1806")) {
          {}
        } else {
          stryCov_9fa48("1806");
          console.error(stryMutAct_9fa48("1807") ? "" : (stryCov_9fa48("1807"), 'Error creating chat session:'), error);
          return next(ERRORS.INTERNAL_SERVER_ERROR);
        }
      }
    }
  }

  /**
   * Health check for tutor service
   */
  async healthCheck(req, res) {
    if (stryMutAct_9fa48("1808")) {
      {}
    } else {
      stryCov_9fa48("1808");
      try {
        if (stryMutAct_9fa48("1809")) {
          {}
        } else {
          stryCov_9fa48("1809");
          res.json(stryMutAct_9fa48("1810") ? {} : (stryCov_9fa48("1810"), {
            success: stryMutAct_9fa48("1811") ? false : (stryCov_9fa48("1811"), true),
            message: stryMutAct_9fa48("1812") ? "" : (stryCov_9fa48("1812"), 'AI Tutor service is operational'),
            timestamp: new Date().toISOString()
          }));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1813")) {
          {}
        } else {
          stryCov_9fa48("1813");
          res.status(503).json(stryMutAct_9fa48("1814") ? {} : (stryCov_9fa48("1814"), {
            success: stryMutAct_9fa48("1815") ? true : (stryCov_9fa48("1815"), false),
            error: stryMutAct_9fa48("1816") ? "" : (stryCov_9fa48("1816"), 'service_unavailable'),
            message: stryMutAct_9fa48("1817") ? "" : (stryCov_9fa48("1817"), 'AI Tutor service is currently unavailable')
          }));
        }
      }
    }
  }
}
export default new TutorController();