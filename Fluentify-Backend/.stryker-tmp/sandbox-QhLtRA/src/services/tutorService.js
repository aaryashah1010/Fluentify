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
    if (stryMutAct_9fa48("1067")) {
      {}
    } else {
      stryCov_9fa48("1067");
      if (stryMutAct_9fa48("1070") ? false : stryMutAct_9fa48("1069") ? true : stryMutAct_9fa48("1068") ? apiKey : (stryCov_9fa48("1068", "1069", "1070"), !apiKey)) {
        if (stryMutAct_9fa48("1071")) {
          {}
        } else {
          stryCov_9fa48("1071");
          throw new Error(stryMutAct_9fa48("1072") ? "" : (stryCov_9fa48("1072"), 'GEMINI_API_KEY is not set in environment variables'));
        }
      }
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel(stryMutAct_9fa48("1073") ? {} : (stryCov_9fa48("1073"), {
        model: stryMutAct_9fa48("1074") ? "" : (stryCov_9fa48("1074"), 'gemini-2.0-flash')
      }));
    }
  }

  /**
   * Generate system prompt based on user's language and proficiency
   */
  generateSystemPrompt(language, proficiency) {
    if (stryMutAct_9fa48("1075")) {
      {}
    } else {
      stryCov_9fa48("1075");
      return stryMutAct_9fa48("1076") ? `` : (stryCov_9fa48("1076"), `You are "Fluent," a highly knowledgeable and encouraging multilingual AI language tutor for the Fluentify platform.

YOUR IDENTITY:
- You are an expert polyglot fluent in ALL world languages
- You can teach any language the user wants to learn - from Spanish to Mandarin, Arabic to Japanese, and everything in between
- You adapt to ANY learning scenario or context the user provides
- ${language ? stryMutAct_9fa48("1077") ? `` : (stryCov_9fa48("1077"), `The user is currently focused on learning ${language} at a ${proficiency} level, but you can help with ANY language they ask about`) : stryMutAct_9fa48("1078") ? "" : (stryCov_9fa48("1078"), 'You can help users learn any language they choose')}

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
- Adapt complexity to ${proficiency ? stryMutAct_9fa48("1079") ? `` : (stryCov_9fa48("1079"), `${proficiency} level`) : stryMutAct_9fa48("1080") ? "" : (stryCov_9fa48("1080"), 'user needs')}

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
    if (stryMutAct_9fa48("1081")) {
      {}
    } else {
      stryCov_9fa48("1081");
      if (stryMutAct_9fa48("1084") ? !messages && messages.length === 0 : stryMutAct_9fa48("1083") ? false : stryMutAct_9fa48("1082") ? true : (stryCov_9fa48("1082", "1083", "1084"), (stryMutAct_9fa48("1085") ? messages : (stryCov_9fa48("1085"), !messages)) || (stryMutAct_9fa48("1087") ? messages.length !== 0 : stryMutAct_9fa48("1086") ? false : (stryCov_9fa48("1086", "1087"), messages.length === 0)))) {
        if (stryMutAct_9fa48("1088")) {
          {}
        } else {
          stryCov_9fa48("1088");
          return stryMutAct_9fa48("1089") ? ["Stryker was here"] : (stryCov_9fa48("1089"), []);
        }
      }
      return messages.map(stryMutAct_9fa48("1090") ? () => undefined : (stryCov_9fa48("1090"), msg => stryMutAct_9fa48("1091") ? {} : (stryCov_9fa48("1091"), {
        role: (stryMutAct_9fa48("1094") ? msg.sender_type !== 'user' : stryMutAct_9fa48("1093") ? false : stryMutAct_9fa48("1092") ? true : (stryCov_9fa48("1092", "1093", "1094"), msg.sender_type === (stryMutAct_9fa48("1095") ? "" : (stryCov_9fa48("1095"), 'user')))) ? stryMutAct_9fa48("1096") ? "" : (stryCov_9fa48("1096"), 'user') : stryMutAct_9fa48("1097") ? "" : (stryCov_9fa48("1097"), 'model'),
        parts: stryMutAct_9fa48("1098") ? [] : (stryCov_9fa48("1098"), [stryMutAct_9fa48("1099") ? {} : (stryCov_9fa48("1099"), {
          text: msg.content
        })])
      })));
    }
  }

  /**
   * Generate streaming AI response
   */
  async generateStreamingResponse(userMessage, sessionId, userId) {
    if (stryMutAct_9fa48("1100")) {
      {}
    } else {
      stryCov_9fa48("1100");
      try {
        if (stryMutAct_9fa48("1101")) {
          {}
        } else {
          stryCov_9fa48("1101");
          // Get user's language info
          const languageInfo = await chatRepository.getUserLanguageInfo(userId);

          // Get recent conversation context
          const recentMessages = await chatRepository.getRecentMessages(sessionId, 6);

          // Build system prompt
          const systemPrompt = this.generateSystemPrompt(languageInfo.language, languageInfo.proficiency);

          // Build conversation history
          const conversationHistory = this.buildConversationContext(recentMessages);

          // Prepare the full conversation context
          const contents = stryMutAct_9fa48("1102") ? [] : (stryCov_9fa48("1102"), [stryMutAct_9fa48("1103") ? {} : (stryCov_9fa48("1103"), {
            role: stryMutAct_9fa48("1104") ? "" : (stryCov_9fa48("1104"), 'user'),
            parts: stryMutAct_9fa48("1105") ? [] : (stryCov_9fa48("1105"), [stryMutAct_9fa48("1106") ? {} : (stryCov_9fa48("1106"), {
              text: systemPrompt
            })])
          }), ...conversationHistory, stryMutAct_9fa48("1107") ? {} : (stryCov_9fa48("1107"), {
            role: stryMutAct_9fa48("1108") ? "" : (stryCov_9fa48("1108"), 'user'),
            parts: stryMutAct_9fa48("1109") ? [] : (stryCov_9fa48("1109"), [stryMutAct_9fa48("1110") ? {} : (stryCov_9fa48("1110"), {
              text: userMessage
            })])
          })]);

          // Generate streaming response
          const result = await this.model.generateContentStream(stryMutAct_9fa48("1111") ? {} : (stryCov_9fa48("1111"), {
            contents,
            generationConfig: stryMutAct_9fa48("1112") ? {} : (stryCov_9fa48("1112"), {
              maxOutputTokens: 1024,
              temperature: 0.7,
              topP: 0.8,
              topK: 40
            })
          }));
          return result.stream;
        }
      } catch (error) {
        if (stryMutAct_9fa48("1113")) {
          {}
        } else {
          stryCov_9fa48("1113");
          console.error(stryMutAct_9fa48("1114") ? "" : (stryCov_9fa48("1114"), 'Error generating streaming response:'), error);
          throw new Error(stryMutAct_9fa48("1115") ? `` : (stryCov_9fa48("1115"), `AI service error: ${error.message}`));
        }
      }
    }
  }

  /**
   * Save conversation messages asynchronously
   */
  async saveConversation(sessionId, userId, userMessage, aiResponse) {
    if (stryMutAct_9fa48("1116")) {
      {}
    } else {
      stryCov_9fa48("1116");
      try {
        if (stryMutAct_9fa48("1117")) {
          {}
        } else {
          stryCov_9fa48("1117");
          // Save user message
          await chatRepository.saveMessage(sessionId, userId, stryMutAct_9fa48("1118") ? "" : (stryCov_9fa48("1118"), 'user'), userMessage);

          // Save AI response
          await chatRepository.saveMessage(sessionId, userId, stryMutAct_9fa48("1119") ? "" : (stryCov_9fa48("1119"), 'ai'), aiResponse);
          console.log(stryMutAct_9fa48("1120") ? `` : (stryCov_9fa48("1120"), `Conversation saved for session ${sessionId}`));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1121")) {
          {}
        } else {
          stryCov_9fa48("1121");
          console.error(stryMutAct_9fa48("1122") ? "" : (stryCov_9fa48("1122"), 'Error saving conversation:'), error);
          // Don't throw - this is async cleanup
        }
      }
    }
  }

  /**
   * Create or get chat session
   */
  async getOrCreateSession(userId, sessionId = null) {
    if (stryMutAct_9fa48("1123")) {
      {}
    } else {
      stryCov_9fa48("1123");
      try {
        if (stryMutAct_9fa48("1124")) {
          {}
        } else {
          stryCov_9fa48("1124");
          if (stryMutAct_9fa48("1126") ? false : stryMutAct_9fa48("1125") ? true : (stryCov_9fa48("1125", "1126"), sessionId)) {
            if (stryMutAct_9fa48("1127")) {
              {}
            } else {
              stryCov_9fa48("1127");
              // Try to get existing session
              const session = await chatRepository.getSessionById(sessionId, userId);
              if (stryMutAct_9fa48("1129") ? false : stryMutAct_9fa48("1128") ? true : (stryCov_9fa48("1128", "1129"), session)) {
                if (stryMutAct_9fa48("1130")) {
                  {}
                } else {
                  stryCov_9fa48("1130");
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
        if (stryMutAct_9fa48("1131")) {
          {}
        } else {
          stryCov_9fa48("1131");
          console.error(stryMutAct_9fa48("1132") ? "" : (stryCov_9fa48("1132"), 'Error getting/creating session:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Get user's chat history
   */
  async getUserChatHistory(userId, limit = 10) {
    if (stryMutAct_9fa48("1133")) {
      {}
    } else {
      stryCov_9fa48("1133");
      try {
        if (stryMutAct_9fa48("1134")) {
          {}
        } else {
          stryCov_9fa48("1134");
          return await chatRepository.getUserSessions(userId, limit);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1135")) {
          {}
        } else {
          stryCov_9fa48("1135");
          console.error(stryMutAct_9fa48("1136") ? "" : (stryCov_9fa48("1136"), 'Error fetching chat history:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Validate message content
   */
  validateMessage(message) {
    if (stryMutAct_9fa48("1137")) {
      {}
    } else {
      stryCov_9fa48("1137");
      if (stryMutAct_9fa48("1140") ? !message && typeof message !== 'string' : stryMutAct_9fa48("1139") ? false : stryMutAct_9fa48("1138") ? true : (stryCov_9fa48("1138", "1139", "1140"), (stryMutAct_9fa48("1141") ? message : (stryCov_9fa48("1141"), !message)) || (stryMutAct_9fa48("1143") ? typeof message === 'string' : stryMutAct_9fa48("1142") ? false : (stryCov_9fa48("1142", "1143"), typeof message !== (stryMutAct_9fa48("1144") ? "" : (stryCov_9fa48("1144"), 'string')))))) {
        if (stryMutAct_9fa48("1145")) {
          {}
        } else {
          stryCov_9fa48("1145");
          throw new Error(stryMutAct_9fa48("1146") ? "" : (stryCov_9fa48("1146"), 'Message is required and must be a string'));
        }
      }
      const trimmed = stryMutAct_9fa48("1147") ? message : (stryCov_9fa48("1147"), message.trim());
      if (stryMutAct_9fa48("1150") ? trimmed.length !== 0 : stryMutAct_9fa48("1149") ? false : stryMutAct_9fa48("1148") ? true : (stryCov_9fa48("1148", "1149", "1150"), trimmed.length === 0)) {
        if (stryMutAct_9fa48("1151")) {
          {}
        } else {
          stryCov_9fa48("1151");
          throw new Error(stryMutAct_9fa48("1152") ? "" : (stryCov_9fa48("1152"), 'Message cannot be empty'));
        }
      }
      if (stryMutAct_9fa48("1156") ? trimmed.length <= 2000 : stryMutAct_9fa48("1155") ? trimmed.length >= 2000 : stryMutAct_9fa48("1154") ? false : stryMutAct_9fa48("1153") ? true : (stryCov_9fa48("1153", "1154", "1155", "1156"), trimmed.length > 2000)) {
        if (stryMutAct_9fa48("1157")) {
          {}
        } else {
          stryCov_9fa48("1157");
          throw new Error(stryMutAct_9fa48("1158") ? "" : (stryCov_9fa48("1158"), 'Message is too long (max 2000 characters)'));
        }
      }
      return trimmed;
    }
  }

  /**
   * Sanitize AI response before sending to frontend
   */
  sanitizeResponse(response) {
    if (stryMutAct_9fa48("1159")) {
      {}
    } else {
      stryCov_9fa48("1159");
      // Basic sanitization - remove potentially harmful content
      return stryMutAct_9fa48("1160") ? response.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') : (stryCov_9fa48("1160"), response.replace(stryMutAct_9fa48("1166") ? /<script\b[^<]*(?:(?!<\/script>)<[<]*)*<\/script>/gi : stryMutAct_9fa48("1165") ? /<script\b[^<]*(?:(?!<\/script>)<[^<])*<\/script>/gi : stryMutAct_9fa48("1164") ? /<script\b[^<]*(?:(?=<\/script>)<[^<]*)*<\/script>/gi : stryMutAct_9fa48("1163") ? /<script\b[^<]*(?:(?!<\/script>)<[^<]*)<\/script>/gi : stryMutAct_9fa48("1162") ? /<script\b[<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi : stryMutAct_9fa48("1161") ? /<script\b[^<](?:(?!<\/script>)<[^<]*)*<\/script>/gi : (stryCov_9fa48("1161", "1162", "1163", "1164", "1165", "1166"), /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi), stryMutAct_9fa48("1167") ? "Stryker was here!" : (stryCov_9fa48("1167"), '')).replace(stryMutAct_9fa48("1173") ? /<iframe\b[^<]*(?:(?!<\/iframe>)<[<]*)*<\/iframe>/gi : stryMutAct_9fa48("1172") ? /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<])*<\/iframe>/gi : stryMutAct_9fa48("1171") ? /<iframe\b[^<]*(?:(?=<\/iframe>)<[^<]*)*<\/iframe>/gi : stryMutAct_9fa48("1170") ? /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)<\/iframe>/gi : stryMutAct_9fa48("1169") ? /<iframe\b[<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi : stryMutAct_9fa48("1168") ? /<iframe\b[^<](?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi : (stryCov_9fa48("1168", "1169", "1170", "1171", "1172", "1173"), /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi), stryMutAct_9fa48("1174") ? "Stryker was here!" : (stryCov_9fa48("1174"), '')).trim());
    }
  }
}
const tutorService = new TutorService();
export default tutorService;
export { TutorService };