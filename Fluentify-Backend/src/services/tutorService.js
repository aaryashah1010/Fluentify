import { GoogleGenerativeAI } from '@google/generative-ai';
import chatRepository from '../repositories/chatRepository.js';

class TutorService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  /**
   * Generate system prompt based on user's language and proficiency
   */
  generateSystemPrompt(language, proficiency) {
    return `You are "Fluent," a highly knowledgeable and encouraging multilingual AI language tutor for the Fluentify platform.

YOUR IDENTITY:
- You are an expert polyglot fluent in ALL world languages
- You can teach any language the user wants to learn - from Spanish to Mandarin, Arabic to Japanese, and everything in between
- You adapt to ANY learning scenario or context the user provides
- ${language ? `The user is currently focused on learning ${language} at a ${proficiency} level, but you can help with ANY language they ask about` : 'You can help users learn any language they choose'}

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
- Adapt complexity to ${proficiency ? `${proficiency} level` : 'user needs'}

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

Remember: You're a world-class multilingual tutor ready to help with ANY language learning need!`;
  }

  /**
   * Build conversation context from recent messages
   */
  buildConversationContext(messages) {
    if (!messages || messages.length === 0) {
      return [];
    }

    return messages.map(msg => ({
      role: msg.sender_type === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
  }

  /**
   * Generate streaming AI response
   */
  async generateStreamingResponse(userMessage, sessionId, userId) {
    try {
      // Get user's language info
      const languageInfo = await chatRepository.getUserLanguageInfo(userId);
      
      // Get recent conversation context
      const recentMessages = await chatRepository.getRecentMessages(sessionId, 6);
      
      // Build system prompt
      const systemPrompt = this.generateSystemPrompt(languageInfo.language, languageInfo.proficiency);
      
      // Build conversation history
      const conversationHistory = this.buildConversationContext(recentMessages);
      
      // Prepare the full conversation context
      const contents = [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        },
        ...conversationHistory,
        {
          role: 'user',
          parts: [{ text: userMessage }]
        }
      ];

      // Generate streaming response
      const result = await this.model.generateContentStream({
        contents,
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
        },
      });

      return result.stream;
    } catch (error) {
      console.error('Error generating streaming response:', error);
      throw new Error(`AI service error: ${error.message}`);
    }
  }

  /**
   * Save conversation messages asynchronously
   */
  async saveConversation(sessionId, userId, userMessage, aiResponse) {
    try {
      // Save user message
      await chatRepository.saveMessage(sessionId, userId, 'user', userMessage);
      
      // Save AI response
      await chatRepository.saveMessage(sessionId, userId, 'ai', aiResponse);
      
      console.log(`Conversation saved for session ${sessionId}`);
    } catch (error) {
      console.error('Error saving conversation:', error);
      // Don't throw - this is async cleanup
    }
  }

  /**
   * Create or get chat session
   */
  async getOrCreateSession(userId, sessionId = null) {
    try {
      if (sessionId) {
        // Try to get existing session
        const session = await chatRepository.getSessionById(sessionId, userId);
        if (session) {
          return session;
        }
      }

      // Create new session
      const languageInfo = await chatRepository.getUserLanguageInfo(userId);
      const newSession = await chatRepository.createSession(
        userId, 
        languageInfo.language, 
        languageInfo.proficiency
      );
      
      return newSession;
    } catch (error) {
      console.error('Error getting/creating session:', error);
      throw error;
    }
  }

  /**
   * Get user's chat history
   */
  async getUserChatHistory(userId, limit = 10) {
    try {
      return await chatRepository.getUserSessions(userId, limit);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  }

  /**
   * Validate message content
   */
  validateMessage(message) {
    if (!message || typeof message !== 'string') {
      throw new Error('Message is required and must be a string');
    }

    const trimmed = message.trim();
    if (trimmed.length === 0) {
      throw new Error('Message cannot be empty');
    }

    if (trimmed.length > 2000) {
      throw new Error('Message is too long (max 2000 characters)');
    }

    return trimmed;
  }

  /**
   * Sanitize AI response before sending to frontend
   */
  sanitizeResponse(response) {
    // Basic sanitization - remove potentially harmful content
    return response
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .trim();
  }
}

export default new TutorService();
