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
  constructor() {
    if (stryMutAct_9fa48("3969")) {
      {}
    } else {
      stryCov_9fa48("3969");
      if (stryMutAct_9fa48("3972") ? false : stryMutAct_9fa48("3971") ? true : stryMutAct_9fa48("3970") ? process.env.GEMINI_API_KEY : (stryCov_9fa48("3970", "3971", "3972"), !process.env.GEMINI_API_KEY)) {
        if (stryMutAct_9fa48("3973")) {
          {}
        } else {
          stryCov_9fa48("3973");
          throw new Error(stryMutAct_9fa48("3974") ? "" : (stryCov_9fa48("3974"), 'GEMINI_API_KEY is not set in environment variables'));
        }
      }
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel(stryMutAct_9fa48("3975") ? {} : (stryCov_9fa48("3975"), {
        model: stryMutAct_9fa48("3976") ? "" : (stryCov_9fa48("3976"), 'gemini-2.0-flash')
      }));
    }
  }

  /**
   * Generate system prompt based on user's language and proficiency
   */
  generateSystemPrompt(language, proficiency) {
    if (stryMutAct_9fa48("3977")) {
      {}
    } else {
      stryCov_9fa48("3977");
      return stryMutAct_9fa48("3978") ? `` : (stryCov_9fa48("3978"), `You are "Fluent," a highly knowledgeable and encouraging multilingual AI language tutor for the Fluentify platform.

YOUR IDENTITY:
- You are an expert polyglot fluent in ALL world languages
- You can teach any language the user wants to learn - from Spanish to Mandarin, Arabic to Japanese, and everything in between
- You adapt to ANY learning scenario or context the user provides
- ${language ? stryMutAct_9fa48("3979") ? `` : (stryCov_9fa48("3979"), `The user is currently focused on learning ${language} at a ${proficiency} level, but you can help with ANY language they ask about`) : stryMutAct_9fa48("3980") ? "" : (stryCov_9fa48("3980"), 'You can help users learn any language they choose')}

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
- Adapt complexity to ${proficiency ? stryMutAct_9fa48("3981") ? `` : (stryCov_9fa48("3981"), `${proficiency} level`) : stryMutAct_9fa48("3982") ? "" : (stryCov_9fa48("3982"), 'user needs')}

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
    if (stryMutAct_9fa48("3983")) {
      {}
    } else {
      stryCov_9fa48("3983");
      if (stryMutAct_9fa48("3986") ? !messages && messages.length === 0 : stryMutAct_9fa48("3985") ? false : stryMutAct_9fa48("3984") ? true : (stryCov_9fa48("3984", "3985", "3986"), (stryMutAct_9fa48("3987") ? messages : (stryCov_9fa48("3987"), !messages)) || (stryMutAct_9fa48("3989") ? messages.length !== 0 : stryMutAct_9fa48("3988") ? false : (stryCov_9fa48("3988", "3989"), messages.length === 0)))) {
        if (stryMutAct_9fa48("3990")) {
          {}
        } else {
          stryCov_9fa48("3990");
          return stryMutAct_9fa48("3991") ? ["Stryker was here"] : (stryCov_9fa48("3991"), []);
        }
      }
      return messages.map(stryMutAct_9fa48("3992") ? () => undefined : (stryCov_9fa48("3992"), msg => stryMutAct_9fa48("3993") ? {} : (stryCov_9fa48("3993"), {
        role: (stryMutAct_9fa48("3996") ? msg.sender_type !== 'user' : stryMutAct_9fa48("3995") ? false : stryMutAct_9fa48("3994") ? true : (stryCov_9fa48("3994", "3995", "3996"), msg.sender_type === (stryMutAct_9fa48("3997") ? "" : (stryCov_9fa48("3997"), 'user')))) ? stryMutAct_9fa48("3998") ? "" : (stryCov_9fa48("3998"), 'user') : stryMutAct_9fa48("3999") ? "" : (stryCov_9fa48("3999"), 'model'),
        parts: stryMutAct_9fa48("4000") ? [] : (stryCov_9fa48("4000"), [stryMutAct_9fa48("4001") ? {} : (stryCov_9fa48("4001"), {
          text: msg.content
        })])
      })));
    }
  }

  /**
   * Generate streaming AI response
   */
  async generateStreamingResponse(userMessage, sessionId, userId) {
    if (stryMutAct_9fa48("4002")) {
      {}
    } else {
      stryCov_9fa48("4002");
      try {
        if (stryMutAct_9fa48("4003")) {
          {}
        } else {
          stryCov_9fa48("4003");
          // Get user's language info
          const languageInfo = await chatRepository.getUserLanguageInfo(userId);

          // Get recent conversation context
          const recentMessages = await chatRepository.getRecentMessages(sessionId, 6);

          // Build system prompt
          const systemPrompt = this.generateSystemPrompt(languageInfo.language, languageInfo.proficiency);

          // Build conversation history
          const conversationHistory = this.buildConversationContext(recentMessages);

          // Prepare the full conversation context
          const contents = stryMutAct_9fa48("4004") ? [] : (stryCov_9fa48("4004"), [stryMutAct_9fa48("4005") ? {} : (stryCov_9fa48("4005"), {
            role: stryMutAct_9fa48("4006") ? "" : (stryCov_9fa48("4006"), 'user'),
            parts: stryMutAct_9fa48("4007") ? [] : (stryCov_9fa48("4007"), [stryMutAct_9fa48("4008") ? {} : (stryCov_9fa48("4008"), {
              text: systemPrompt
            })])
          }), ...conversationHistory, stryMutAct_9fa48("4009") ? {} : (stryCov_9fa48("4009"), {
            role: stryMutAct_9fa48("4010") ? "" : (stryCov_9fa48("4010"), 'user'),
            parts: stryMutAct_9fa48("4011") ? [] : (stryCov_9fa48("4011"), [stryMutAct_9fa48("4012") ? {} : (stryCov_9fa48("4012"), {
              text: userMessage
            })])
          })]);

          // Generate streaming response
          const result = await this.model.generateContentStream(stryMutAct_9fa48("4013") ? {} : (stryCov_9fa48("4013"), {
            contents,
            generationConfig: stryMutAct_9fa48("4014") ? {} : (stryCov_9fa48("4014"), {
              maxOutputTokens: 1024,
              temperature: 0.7,
              topP: 0.8,
              topK: 40
            })
          }));
          return result.stream;
        }
      } catch (error) {
        if (stryMutAct_9fa48("4015")) {
          {}
        } else {
          stryCov_9fa48("4015");
          console.error(stryMutAct_9fa48("4016") ? "" : (stryCov_9fa48("4016"), 'Error generating streaming response:'), error);
          throw new Error(stryMutAct_9fa48("4017") ? `` : (stryCov_9fa48("4017"), `AI service error: ${error.message}`));
        }
      }
    }
  }

  /**
   * Save conversation messages asynchronously
   */
  async saveConversation(sessionId, userId, userMessage, aiResponse) {
    if (stryMutAct_9fa48("4018")) {
      {}
    } else {
      stryCov_9fa48("4018");
      try {
        if (stryMutAct_9fa48("4019")) {
          {}
        } else {
          stryCov_9fa48("4019");
          // Save user message
          await chatRepository.saveMessage(sessionId, userId, stryMutAct_9fa48("4020") ? "" : (stryCov_9fa48("4020"), 'user'), userMessage);

          // Save AI response
          await chatRepository.saveMessage(sessionId, userId, stryMutAct_9fa48("4021") ? "" : (stryCov_9fa48("4021"), 'ai'), aiResponse);
          console.log(stryMutAct_9fa48("4022") ? `` : (stryCov_9fa48("4022"), `Conversation saved for session ${sessionId}`));
        }
      } catch (error) {
        if (stryMutAct_9fa48("4023")) {
          {}
        } else {
          stryCov_9fa48("4023");
          console.error(stryMutAct_9fa48("4024") ? "" : (stryCov_9fa48("4024"), 'Error saving conversation:'), error);
          // Don't throw - this is async cleanup
        }
      }
    }
  }

  /**
   * Create or get chat session
   */
  async getOrCreateSession(userId, sessionId = null) {
    if (stryMutAct_9fa48("4025")) {
      {}
    } else {
      stryCov_9fa48("4025");
      try {
        if (stryMutAct_9fa48("4026")) {
          {}
        } else {
          stryCov_9fa48("4026");
          if (stryMutAct_9fa48("4028") ? false : stryMutAct_9fa48("4027") ? true : (stryCov_9fa48("4027", "4028"), sessionId)) {
            if (stryMutAct_9fa48("4029")) {
              {}
            } else {
              stryCov_9fa48("4029");
              // Try to get existing session
              const session = await chatRepository.getSessionById(sessionId, userId);
              if (stryMutAct_9fa48("4031") ? false : stryMutAct_9fa48("4030") ? true : (stryCov_9fa48("4030", "4031"), session)) {
                if (stryMutAct_9fa48("4032")) {
                  {}
                } else {
                  stryCov_9fa48("4032");
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
        if (stryMutAct_9fa48("4033")) {
          {}
        } else {
          stryCov_9fa48("4033");
          console.error(stryMutAct_9fa48("4034") ? "" : (stryCov_9fa48("4034"), 'Error getting/creating session:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Get user's chat history
   */
  async getUserChatHistory(userId, limit = 10) {
    if (stryMutAct_9fa48("4035")) {
      {}
    } else {
      stryCov_9fa48("4035");
      try {
        if (stryMutAct_9fa48("4036")) {
          {}
        } else {
          stryCov_9fa48("4036");
          return await chatRepository.getUserSessions(userId, limit);
        }
      } catch (error) {
        if (stryMutAct_9fa48("4037")) {
          {}
        } else {
          stryCov_9fa48("4037");
          console.error(stryMutAct_9fa48("4038") ? "" : (stryCov_9fa48("4038"), 'Error fetching chat history:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Validate message content
   */
  validateMessage(message) {
    if (stryMutAct_9fa48("4039")) {
      {}
    } else {
      stryCov_9fa48("4039");
      if (stryMutAct_9fa48("4042") ? !message && typeof message !== 'string' : stryMutAct_9fa48("4041") ? false : stryMutAct_9fa48("4040") ? true : (stryCov_9fa48("4040", "4041", "4042"), (stryMutAct_9fa48("4043") ? message : (stryCov_9fa48("4043"), !message)) || (stryMutAct_9fa48("4045") ? typeof message === 'string' : stryMutAct_9fa48("4044") ? false : (stryCov_9fa48("4044", "4045"), typeof message !== (stryMutAct_9fa48("4046") ? "" : (stryCov_9fa48("4046"), 'string')))))) {
        if (stryMutAct_9fa48("4047")) {
          {}
        } else {
          stryCov_9fa48("4047");
          throw new Error(stryMutAct_9fa48("4048") ? "" : (stryCov_9fa48("4048"), 'Message is required and must be a string'));
        }
      }
      const trimmed = stryMutAct_9fa48("4049") ? message : (stryCov_9fa48("4049"), message.trim());
      if (stryMutAct_9fa48("4052") ? trimmed.length !== 0 : stryMutAct_9fa48("4051") ? false : stryMutAct_9fa48("4050") ? true : (stryCov_9fa48("4050", "4051", "4052"), trimmed.length === 0)) {
        if (stryMutAct_9fa48("4053")) {
          {}
        } else {
          stryCov_9fa48("4053");
          throw new Error(stryMutAct_9fa48("4054") ? "" : (stryCov_9fa48("4054"), 'Message cannot be empty'));
        }
      }
      if (stryMutAct_9fa48("4058") ? trimmed.length <= 2000 : stryMutAct_9fa48("4057") ? trimmed.length >= 2000 : stryMutAct_9fa48("4056") ? false : stryMutAct_9fa48("4055") ? true : (stryCov_9fa48("4055", "4056", "4057", "4058"), trimmed.length > 2000)) {
        if (stryMutAct_9fa48("4059")) {
          {}
        } else {
          stryCov_9fa48("4059");
          throw new Error(stryMutAct_9fa48("4060") ? "" : (stryCov_9fa48("4060"), 'Message is too long (max 2000 characters)'));
        }
      }
      return trimmed;
    }
  }

  /**
   * Sanitize AI response before sending to frontend
   */
  sanitizeResponse(response) {
    if (stryMutAct_9fa48("4061")) {
      {}
    } else {
      stryCov_9fa48("4061");
      // Basic sanitization - remove potentially harmful content
      return stryMutAct_9fa48("4062") ? response.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') : (stryCov_9fa48("4062"), response.replace(stryMutAct_9fa48("4068") ? /<script\b[^<]*(?:(?!<\/script>)<[<]*)*<\/script>/gi : stryMutAct_9fa48("4067") ? /<script\b[^<]*(?:(?!<\/script>)<[^<])*<\/script>/gi : stryMutAct_9fa48("4066") ? /<script\b[^<]*(?:(?=<\/script>)<[^<]*)*<\/script>/gi : stryMutAct_9fa48("4065") ? /<script\b[^<]*(?:(?!<\/script>)<[^<]*)<\/script>/gi : stryMutAct_9fa48("4064") ? /<script\b[<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi : stryMutAct_9fa48("4063") ? /<script\b[^<](?:(?!<\/script>)<[^<]*)*<\/script>/gi : (stryCov_9fa48("4063", "4064", "4065", "4066", "4067", "4068"), /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi), stryMutAct_9fa48("4069") ? "Stryker was here!" : (stryCov_9fa48("4069"), '')).replace(stryMutAct_9fa48("4075") ? /<iframe\b[^<]*(?:(?!<\/iframe>)<[<]*)*<\/iframe>/gi : stryMutAct_9fa48("4074") ? /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<])*<\/iframe>/gi : stryMutAct_9fa48("4073") ? /<iframe\b[^<]*(?:(?=<\/iframe>)<[^<]*)*<\/iframe>/gi : stryMutAct_9fa48("4072") ? /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)<\/iframe>/gi : stryMutAct_9fa48("4071") ? /<iframe\b[<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi : stryMutAct_9fa48("4070") ? /<iframe\b[^<](?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi : (stryCov_9fa48("4070", "4071", "4072", "4073", "4074", "4075"), /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi), stryMutAct_9fa48("4076") ? "Stryker was here!" : (stryCov_9fa48("4076"), '')).trim());
    }
  }
}
export default new TutorService();