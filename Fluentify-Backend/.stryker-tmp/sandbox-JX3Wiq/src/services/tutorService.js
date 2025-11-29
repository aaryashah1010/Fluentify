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
import { GoogleGenerativeAI } from '@google/generative-ai';
import chatRepository from '../repositories/chatRepository.js';
class TutorService {
  constructor(apiKey = process.env.GEMINI_API_KEY) {
    if (stryMutAct_9fa48("3623")) {
      {}
    } else {
      stryCov_9fa48("3623");
      if (stryMutAct_9fa48("3626") ? false : stryMutAct_9fa48("3625") ? true : stryMutAct_9fa48("3624") ? apiKey : (stryCov_9fa48("3624", "3625", "3626"), !apiKey)) {
        if (stryMutAct_9fa48("3627")) {
          {}
        } else {
          stryCov_9fa48("3627");
          throw new Error(stryMutAct_9fa48("3628") ? "" : (stryCov_9fa48("3628"), 'GEMINI_API_KEY is not set in environment variables'));
        }
      }
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel(stryMutAct_9fa48("3629") ? {} : (stryCov_9fa48("3629"), {
        model: stryMutAct_9fa48("3630") ? "" : (stryCov_9fa48("3630"), 'gemini-2.0-flash')
      }));
    }
  }

  /**
   * Generate system prompt based on user's language and proficiency
   */
  generateSystemPrompt(language, proficiency) {
    if (stryMutAct_9fa48("3631")) {
      {}
    } else {
      stryCov_9fa48("3631");
      return stryMutAct_9fa48("3632") ? `` : (stryCov_9fa48("3632"), `You are "Fluent," a highly knowledgeable and encouraging multilingual AI language tutor for the Fluentify platform.

YOUR IDENTITY:
- You are an expert polyglot fluent in ALL world languages
- You can teach any language the user wants to learn - from Spanish to Mandarin, Arabic to Japanese, and everything in between
- You adapt to ANY learning scenario or context the user provides
- ${language ? stryMutAct_9fa48("3633") ? `` : (stryCov_9fa48("3633"), `The user is currently focused on learning ${language} at a ${proficiency} level, but you can help with ANY language they ask about`) : stryMutAct_9fa48("3634") ? "" : (stryCov_9fa48("3634"), 'You can help users learn any language they choose')}

CORE CAPABILITIES:
✅ Teach grammar, vocabulary, and pronunciation for ANY language
✅ Provide translations between ANY language pairs
✅ Explain cultural context and usage nuances across cultures
✅ Create custom practice exercises in ANY language
✅ Help with conversation practice and real-world scenarios
✅ Assist with writing, reading, listening, and speaking skills
✅ Provide phonetic guidance and pronunciation tips
✅ Discuss idioms, slang, and regional variations
✅ Help with language exams and certifications
✅ Support learning for travel, business, academics, or personal interest

RESPONSE STYLE:
- Be encouraging, patient, and celebrate progress
- Keep responses concise (under 200 words) unless explaining complex concepts
- Use **bold** for emphasis and \`backticks\` for specific words/phrases
- Provide practical, real-world examples
- When correcting, be gentle and constructive
- Use Markdown formatting for clarity
- Adapt complexity to ${proficiency ? stryMutAct_9fa48("3635") ? `` : (stryCov_9fa48("3635"), `${proficiency} level`) : stryMutAct_9fa48("3636") ? "" : (stryCov_9fa48("3636"), 'user needs')}

BEHAVIOR:
- If Beginner: Use simple vocabulary, clear explanations, and lots of examples
- If Intermediate: Moderate complexity, assume basic knowledge
- If Advanced: Sophisticated language, focus on nuances and subtleties
- Always ask clarifying questions if the user's request is ambiguous
- Offer to switch languages or topics freely as the user needs

FLEXIBILITY:
- If user asks about a different language, IMMEDIATELY switch and help them
- Support ANY scenario: travel phrases, business meetings, academic papers, casual conversation, technical terms, etc.
- Provide context-specific vocabulary (e.g., medical terms, legal jargon, cooking vocabulary)

Remember: You're a world-class multilingual tutor ready to help with ANY language learning need!`);
    }
  }

  /**
   * Build conversation context from recent messages
   */
  buildConversationContext(messages) {
    if (stryMutAct_9fa48("3637")) {
      {}
    } else {
      stryCov_9fa48("3637");
      if (stryMutAct_9fa48("3640") ? !messages && messages.length === 0 : stryMutAct_9fa48("3639") ? false : stryMutAct_9fa48("3638") ? true : (stryCov_9fa48("3638", "3639", "3640"), (stryMutAct_9fa48("3641") ? messages : (stryCov_9fa48("3641"), !messages)) || (stryMutAct_9fa48("3643") ? messages.length !== 0 : stryMutAct_9fa48("3642") ? false : (stryCov_9fa48("3642", "3643"), messages.length === 0)))) {
        if (stryMutAct_9fa48("3644")) {
          {}
        } else {
          stryCov_9fa48("3644");
          return stryMutAct_9fa48("3645") ? ["Stryker was here"] : (stryCov_9fa48("3645"), []);
        }
      }
      return messages.map(stryMutAct_9fa48("3646") ? () => undefined : (stryCov_9fa48("3646"), msg => stryMutAct_9fa48("3647") ? {} : (stryCov_9fa48("3647"), {
        role: (stryMutAct_9fa48("3650") ? msg.sender_type !== 'user' : stryMutAct_9fa48("3649") ? false : stryMutAct_9fa48("3648") ? true : (stryCov_9fa48("3648", "3649", "3650"), msg.sender_type === (stryMutAct_9fa48("3651") ? "" : (stryCov_9fa48("3651"), 'user')))) ? stryMutAct_9fa48("3652") ? "" : (stryCov_9fa48("3652"), 'user') : stryMutAct_9fa48("3653") ? "" : (stryCov_9fa48("3653"), 'model'),
        parts: stryMutAct_9fa48("3654") ? [] : (stryCov_9fa48("3654"), [stryMutAct_9fa48("3655") ? {} : (stryCov_9fa48("3655"), {
          text: msg.content
        })])
      })));
    }
  }

  /**
   * Generate streaming AI response
   */
  async generateStreamingResponse(userMessage, sessionId, userId) {
    if (stryMutAct_9fa48("3656")) {
      {}
    } else {
      stryCov_9fa48("3656");
      try {
        if (stryMutAct_9fa48("3657")) {
          {}
        } else {
          stryCov_9fa48("3657");
          // Get user's language info
          const languageInfo = await chatRepository.getUserLanguageInfo(userId);

          // Get recent conversation context
          const recentMessages = await chatRepository.getRecentMessages(sessionId, 6);

          // Build system prompt
          const systemPrompt = this.generateSystemPrompt(languageInfo.language, languageInfo.proficiency);

          // Build conversation history
          const conversationHistory = this.buildConversationContext(recentMessages);

          // Prepare the full conversation context
          const contents = stryMutAct_9fa48("3658") ? [] : (stryCov_9fa48("3658"), [stryMutAct_9fa48("3659") ? {} : (stryCov_9fa48("3659"), {
            role: stryMutAct_9fa48("3660") ? "" : (stryCov_9fa48("3660"), 'user'),
            parts: stryMutAct_9fa48("3661") ? [] : (stryCov_9fa48("3661"), [stryMutAct_9fa48("3662") ? {} : (stryCov_9fa48("3662"), {
              text: systemPrompt
            })])
          }), ...conversationHistory, stryMutAct_9fa48("3663") ? {} : (stryCov_9fa48("3663"), {
            role: stryMutAct_9fa48("3664") ? "" : (stryCov_9fa48("3664"), 'user'),
            parts: stryMutAct_9fa48("3665") ? [] : (stryCov_9fa48("3665"), [stryMutAct_9fa48("3666") ? {} : (stryCov_9fa48("3666"), {
              text: userMessage
            })])
          })]);

          // Generate streaming response
          const result = await this.model.generateContentStream(stryMutAct_9fa48("3667") ? {} : (stryCov_9fa48("3667"), {
            contents,
            generationConfig: stryMutAct_9fa48("3668") ? {} : (stryCov_9fa48("3668"), {
              maxOutputTokens: 1024,
              temperature: 0.7,
              topP: 0.8,
              topK: 40
            })
          }));
          return result.stream;
        }
      } catch (error) {
        if (stryMutAct_9fa48("3669")) {
          {}
        } else {
          stryCov_9fa48("3669");
          console.error(stryMutAct_9fa48("3670") ? "" : (stryCov_9fa48("3670"), 'Error generating streaming response:'), error);
          throw new Error(stryMutAct_9fa48("3671") ? `` : (stryCov_9fa48("3671"), `AI service error: ${error.message}`));
        }
      }
    }
  }

  /**
   * Save conversation messages asynchronously
   */
  async saveConversation(sessionId, userId, userMessage, aiResponse) {
    if (stryMutAct_9fa48("3672")) {
      {}
    } else {
      stryCov_9fa48("3672");
      try {
        if (stryMutAct_9fa48("3673")) {
          {}
        } else {
          stryCov_9fa48("3673");
          // Save user message
          await chatRepository.saveMessage(sessionId, userId, stryMutAct_9fa48("3674") ? "" : (stryCov_9fa48("3674"), 'user'), userMessage);

          // Save AI response
          await chatRepository.saveMessage(sessionId, userId, stryMutAct_9fa48("3675") ? "" : (stryCov_9fa48("3675"), 'ai'), aiResponse);
          console.log(stryMutAct_9fa48("3676") ? `` : (stryCov_9fa48("3676"), `Conversation saved for session ${sessionId}`));
        }
      } catch (error) {
        if (stryMutAct_9fa48("3677")) {
          {}
        } else {
          stryCov_9fa48("3677");
          console.error(stryMutAct_9fa48("3678") ? "" : (stryCov_9fa48("3678"), 'Error saving conversation:'), error);
          // Don't throw - this is async cleanup
        }
      }
    }
  }

  /**
   * Create or get chat session
   */
  async getOrCreateSession(userId, sessionId = null) {
    if (stryMutAct_9fa48("3679")) {
      {}
    } else {
      stryCov_9fa48("3679");
      try {
        if (stryMutAct_9fa48("3680")) {
          {}
        } else {
          stryCov_9fa48("3680");
          if (stryMutAct_9fa48("3682") ? false : stryMutAct_9fa48("3681") ? true : (stryCov_9fa48("3681", "3682"), sessionId)) {
            if (stryMutAct_9fa48("3683")) {
              {}
            } else {
              stryCov_9fa48("3683");
              // Try to get existing session
              const session = await chatRepository.getSessionById(sessionId, userId);
              if (stryMutAct_9fa48("3685") ? false : stryMutAct_9fa48("3684") ? true : (stryCov_9fa48("3684", "3685"), session)) {
                if (stryMutAct_9fa48("3686")) {
                  {}
                } else {
                  stryCov_9fa48("3686");
                  return session;
                }
              }
            }
          }

          // Create new session
          const languageInfo = await chatRepository.getUserLanguageInfo(userId);
          const newSession = await chatRepository.createSession(userId, languageInfo.language, languageInfo.proficiency);
          return newSession;
        }
      } catch (error) {
        if (stryMutAct_9fa48("3687")) {
          {}
        } else {
          stryCov_9fa48("3687");
          console.error(stryMutAct_9fa48("3688") ? "" : (stryCov_9fa48("3688"), 'Error getting/creating session:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Get user's chat history
   */
  async getUserChatHistory(userId, limit = 10) {
    if (stryMutAct_9fa48("3689")) {
      {}
    } else {
      stryCov_9fa48("3689");
      try {
        if (stryMutAct_9fa48("3690")) {
          {}
        } else {
          stryCov_9fa48("3690");
          return await chatRepository.getUserSessions(userId, limit);
        }
      } catch (error) {
        if (stryMutAct_9fa48("3691")) {
          {}
        } else {
          stryCov_9fa48("3691");
          console.error(stryMutAct_9fa48("3692") ? "" : (stryCov_9fa48("3692"), 'Error fetching chat history:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Validate message content
   */
  validateMessage(message) {
    if (stryMutAct_9fa48("3693")) {
      {}
    } else {
      stryCov_9fa48("3693");
      if (stryMutAct_9fa48("3696") ? !message && typeof message !== 'string' : stryMutAct_9fa48("3695") ? false : stryMutAct_9fa48("3694") ? true : (stryCov_9fa48("3694", "3695", "3696"), (stryMutAct_9fa48("3697") ? message : (stryCov_9fa48("3697"), !message)) || (stryMutAct_9fa48("3699") ? typeof message === 'string' : stryMutAct_9fa48("3698") ? false : (stryCov_9fa48("3698", "3699"), typeof message !== (stryMutAct_9fa48("3700") ? "" : (stryCov_9fa48("3700"), 'string')))))) {
        if (stryMutAct_9fa48("3701")) {
          {}
        } else {
          stryCov_9fa48("3701");
          throw new Error(stryMutAct_9fa48("3702") ? "" : (stryCov_9fa48("3702"), 'Message is required and must be a string'));
        }
      }
      const trimmed = stryMutAct_9fa48("3703") ? message : (stryCov_9fa48("3703"), message.trim());
      if (stryMutAct_9fa48("3706") ? trimmed.length !== 0 : stryMutAct_9fa48("3705") ? false : stryMutAct_9fa48("3704") ? true : (stryCov_9fa48("3704", "3705", "3706"), trimmed.length === 0)) {
        if (stryMutAct_9fa48("3707")) {
          {}
        } else {
          stryCov_9fa48("3707");
          throw new Error(stryMutAct_9fa48("3708") ? "" : (stryCov_9fa48("3708"), 'Message cannot be empty'));
        }
      }
      if (stryMutAct_9fa48("3712") ? trimmed.length <= 2000 : stryMutAct_9fa48("3711") ? trimmed.length >= 2000 : stryMutAct_9fa48("3710") ? false : stryMutAct_9fa48("3709") ? true : (stryCov_9fa48("3709", "3710", "3711", "3712"), trimmed.length > 2000)) {
        if (stryMutAct_9fa48("3713")) {
          {}
        } else {
          stryCov_9fa48("3713");
          throw new Error(stryMutAct_9fa48("3714") ? "" : (stryCov_9fa48("3714"), 'Message is too long (max 2000 characters)'));
        }
      }
      return trimmed;
    }
  }

  /**
   * Sanitize AI response before sending to frontend
   */
  sanitizeResponse(response) {
    if (stryMutAct_9fa48("3715")) {
      {}
    } else {
      stryCov_9fa48("3715");
      // Basic sanitization - remove potentially harmful content
      return stryMutAct_9fa48("3716") ? response.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') : (stryCov_9fa48("3716"), response.replace(stryMutAct_9fa48("3722") ? /<script\b[^<]*(?:(?!<\/script>)<[<]*)*<\/script>/gi : stryMutAct_9fa48("3721") ? /<script\b[^<]*(?:(?!<\/script>)<[^<])*<\/script>/gi : stryMutAct_9fa48("3720") ? /<script\b[^<]*(?:(?=<\/script>)<[^<]*)*<\/script>/gi : stryMutAct_9fa48("3719") ? /<script\b[^<]*(?:(?!<\/script>)<[^<]*)<\/script>/gi : stryMutAct_9fa48("3718") ? /<script\b[<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi : stryMutAct_9fa48("3717") ? /<script\b[^<](?:(?!<\/script>)<[^<]*)*<\/script>/gi : (stryCov_9fa48("3717", "3718", "3719", "3720", "3721", "3722"), /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi), stryMutAct_9fa48("3723") ? "Stryker was here!" : (stryCov_9fa48("3723"), '')).replace(stryMutAct_9fa48("3729") ? /<iframe\b[^<]*(?:(?!<\/iframe>)<[<]*)*<\/iframe>/gi : stryMutAct_9fa48("3728") ? /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<])*<\/iframe>/gi : stryMutAct_9fa48("3727") ? /<iframe\b[^<]*(?:(?=<\/iframe>)<[^<]*)*<\/iframe>/gi : stryMutAct_9fa48("3726") ? /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)<\/iframe>/gi : stryMutAct_9fa48("3725") ? /<iframe\b[<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi : stryMutAct_9fa48("3724") ? /<iframe\b[^<](?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi : (stryCov_9fa48("3724", "3725", "3726", "3727", "3728", "3729"), /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi), stryMutAct_9fa48("3730") ? "Stryker was here!" : (stryCov_9fa48("3730"), '')).trim());
    }
  }
}
const tutorService = new TutorService();
export default tutorService;
export { TutorService };