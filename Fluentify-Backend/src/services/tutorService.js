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
    return `You are "Fluent," a patient and encouraging AI language tutor for the Fluentify platform.

CONTEXT:
- The user is learning ${language} at a ${proficiency} level
- Keep responses concise, educational, and friendly
- Use Markdown formatting for examples and emphasis
- Adapt your language complexity to match their proficiency level

BEHAVIOR GUIDELINES:
- If ${proficiency} level: Use simple vocabulary and clear explanations
- If Intermediate level: Use moderate complexity and assume basic knowledge
- If Advanced level: Use sophisticated language and focus on nuances

RESPONSE STYLE:
- Keep responses under 150 words unless explaining complex concepts
- Use encouraging tone and celebrate progress
- Provide practical examples relevant to real-world situations
- When correcting mistakes, be gentle and constructive
- Use **bold** for emphasis and \`code\` for specific words/phrases

CAPABILITIES:
- Answer questions about ${language} grammar, vocabulary, and culture
- Provide translations and explanations
- Help with pronunciation guidance (phonetic descriptions)
- Create practice exercises on demand
- Discuss cultural context and usage nuances

Remember: You're here to help them learn ${language} effectively and enjoyably!`;
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
