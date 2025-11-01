import tutorService from '../services/tutorService.js';
import { ERRORS } from '../utils/error.js';

class TutorController {
  /**
   * Handle streaming chat message
   */
  async sendMessage(req, res, next) {
    try {
      const { message, sessionId } = req.body;
      const userId = req.user.id;

      // Validate message
      const validatedMessage = tutorService.validateMessage(message);

      // Get or create session
      const session = await tutorService.getOrCreateSession(userId, sessionId);

      // Set headers for streaming response
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Transfer-Encoding', 'chunked');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // Send session ID first (for new sessions)
      if (!sessionId) {
        res.write(`SESSION_ID:${session.id}\n`);
      }

      let fullAiResponse = '';

      try {
        // Get streaming response from AI
        const stream = await tutorService.generateStreamingResponse(
          validatedMessage, 
          session.id, 
          userId
        );

        // Stream chunks to client
        for await (const chunk of stream) {
          const chunkText = chunk.text();
          if (chunkText) {
            const sanitizedChunk = tutorService.sanitizeResponse(chunkText);
            fullAiResponse += sanitizedChunk;
            res.write(sanitizedChunk);
          }
        }

        // End the stream
        res.end();

        // Save conversation asynchronously (don't await)
        tutorService.saveConversation(
          session.id, 
          userId, 
          validatedMessage, 
          fullAiResponse
        ).catch(error => {
          console.error('Failed to save conversation:', error);
        });

      } catch (aiError) {
        console.error('AI generation error:', aiError);
        
        // Send error message to client
        const errorMessage = 'I apologize, but I\'m having trouble responding right now. Please try again in a moment.';
        res.write(errorMessage);
        res.end();

        // Still try to save the user message
        tutorService.saveConversation(
          session.id, 
          userId, 
          validatedMessage, 
          errorMessage
        ).catch(error => {
          console.error('Failed to save error conversation:', error);
        });
      }

    } catch (error) {
      console.error('Chat controller error:', error);
      
      // Handle different error types
      if (error.message.includes('Message is required') || 
          error.message.includes('Message cannot be empty') ||
          error.message.includes('Message is too long')) {
        return res.status(400).json({
          success: false,
          error: 'validation_error',
          message: error.message
        });
      }

      if (error.message.includes('AI service error')) {
        return res.status(503).json({
          success: false,
          error: 'ai_failure',
          message: 'Our AI tutor is temporarily unavailable.'
        });
      }

      return next(ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get user's chat history
   */
  async getChatHistory(req, res, next) {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 10;

      const sessions = await tutorService.getUserChatHistory(userId, limit);

      res.json({
        success: true,
        data: {
          sessions
        }
      });

    } catch (error) {
      console.error('Error fetching chat history:', error);
      return next(ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Create a new chat session
   */
  async createSession(req, res, next) {
    try {
      const userId = req.user.id;

      const session = await tutorService.getOrCreateSession(userId);

      res.json({
        success: true,
        data: {
          session
        }
      });

    } catch (error) {
      console.error('Error creating chat session:', error);
      return next(ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Health check for tutor service
   */
  async healthCheck(req, res) {
    try {
      res.json({
        success: true,
        message: 'AI Tutor service is operational',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(503).json({
        success: false,
        error: 'service_unavailable',
        message: 'AI Tutor service is currently unavailable'
      });
    }
  }
}

export default new TutorController();
