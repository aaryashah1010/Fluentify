import { jest } from '@jest/globals';

async function importTutorWithEnv(key='test-key'){
  jest.resetModules();
  if (key === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = key;
  const genModel = { generateContentStream: jest.fn() };
  const getGenerativeModel = jest.fn().mockReturnValue(genModel);
  const GoogleGenerativeAI = jest.fn().mockImplementation(() => ({ getGenerativeModel }));
  await jest.unstable_mockModule('@google/generative-ai', () => ({ GoogleGenerativeAI }));

  const mockChatRepo = {
    getUserLanguageInfo: jest.fn(),
    getRecentMessages: jest.fn(),
    saveMessage: jest.fn(),
    getSessionById: jest.fn(),
    createSession: jest.fn(),
    getUserSessions: jest.fn(),
  };
  await jest.unstable_mockModule('../../repositories/chatRepository.js', () => ({ default: mockChatRepo }));
  const mod = await import('../../services/tutorService.js');
  return { service: mod.default, genModel, mockChatRepo, GoogleGenerativeAI, getGenerativeModel };
}

describe('tutorService', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockClear();
    consoleLogSpy.mockClear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  it('constructs service when GEMINI_API_KEY is set', async () => {
    const { service, genModel, GoogleGenerativeAI, getGenerativeModel } = await importTutorWithEnv('key-123');
    // Constructor should have created a model using GoogleGenerativeAI
    expect(service).toBeDefined();
    expect(service.model).toBe(genModel);
    expect(GoogleGenerativeAI).toHaveBeenCalledWith('key-123');
    expect(getGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-2.0-flash' });
  });

  it('throws if GEMINI_API_KEY is missing', async () => {
    jest.resetModules();
    const originalKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    await expect(import('../../services/tutorService.js')).rejects.toThrow('GEMINI_API_KEY is not set in environment variables');

    if (originalKey !== undefined) {
      process.env.GEMINI_API_KEY = originalKey;
    }
  });

  it('generateSystemPrompt adapts language/proficiency and fallback', async () => {
    const { service } = await importTutorWithEnv();
    const p1 = service.generateSystemPrompt('Spanish', 'Beginner');
    expect(p1).toContain('Spanish');
    expect(p1).toContain('Beginner');
    expect(p1).toContain('Adapt complexity to Beginner level');
    const p2 = service.generateSystemPrompt('', '');
    expect(p2).toContain('help users learn any language');
    expect(p2).toContain('Adapt complexity to user needs');
  });

  it('buildConversationContext maps roles and returns [] for empty', async () => {
    const { service } = await importTutorWithEnv();
    expect(service.buildConversationContext()).toEqual([]);
    const msgs = service.buildConversationContext([{ sender_type:'user', content:'hi' }, { sender_type:'ai', content:'yo' }]);
    expect(msgs[0]).toEqual({ role: 'user', parts: [{ text: 'hi' }] });
    expect(msgs[1]).toEqual({ role: 'model', parts: [{ text: 'yo' }] });
  });

  describe('generateStreamingResponse', () => {
    it('returns stream on success', async () => {
      const { service, genModel, mockChatRepo } = await importTutorWithEnv();
      mockChatRepo.getUserLanguageInfo.mockResolvedValueOnce({ language:'English', proficiency:'Beginner' });
      mockChatRepo.getRecentMessages.mockResolvedValueOnce([]);
      const streamObj = { on: jest.fn() };
      genModel.generateContentStream.mockResolvedValueOnce({ stream: streamObj });
      const stream = await service.generateStreamingResponse('Hello', 1, 2);
      expect(stream).toBe(streamObj);
    });

    it('passes system prompt, history, and user message to model with config', async () => {
      const { service, genModel, mockChatRepo } = await importTutorWithEnv();
      mockChatRepo.getUserLanguageInfo.mockResolvedValueOnce({ language:'French', proficiency:'Intermediate' });
      mockChatRepo.getRecentMessages.mockResolvedValueOnce([
        { sender_type:'user', content:'previous user' },
        { sender_type:'ai', content:'previous ai' },
      ]);
      const streamObj = { on: jest.fn() };
      genModel.generateContentStream.mockResolvedValueOnce({ stream: streamObj });

      await service.generateStreamingResponse('Current question', 10, 20);

      const callArg = genModel.generateContentStream.mock.calls[0][0];
      expect(callArg.contents[0].parts[0].text).toContain('French');
      expect(callArg.contents[1]).toEqual({ role: 'user', parts: [{ text: 'previous user' }] });
      expect(callArg.contents[2]).toEqual({ role: 'model', parts: [{ text: 'previous ai' }] });
      expect(callArg.contents[3]).toEqual({ role: 'user', parts: [{ text: 'Current question' }] });
      expect(callArg.generationConfig).toEqual({
        maxOutputTokens: 1024,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      });
    });

    it('wraps error message on failure', async () => {
      const { service, genModel, mockChatRepo } = await importTutorWithEnv();
      mockChatRepo.getUserLanguageInfo.mockResolvedValueOnce({ language:'English', proficiency:'Beginner' });
      mockChatRepo.getRecentMessages.mockResolvedValueOnce([]);
      genModel.generateContentStream.mockRejectedValueOnce(new Error('down'));
      await expect(service.generateStreamingResponse('Hello', 1, 2)).rejects.toThrow('AI service error: down');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error generating streaming response:', expect.any(Error));
    });
  });

  describe('saveConversation', () => {
    it('saves user and ai messages and ignores errors', async () => {
      const { service, mockChatRepo } = await importTutorWithEnv();
      await service.saveConversation(9, 2, 'hi', 'hello');
      expect(mockChatRepo.saveMessage).toHaveBeenCalledTimes(2);
      expect(mockChatRepo.saveMessage).toHaveBeenNthCalledWith(1, 9, 2, 'user', 'hi');
      expect(mockChatRepo.saveMessage).toHaveBeenNthCalledWith(2, 9, 2, 'ai', 'hello');
      expect(consoleLogSpy).toHaveBeenCalledWith('Conversation saved for session 9');
      mockChatRepo.saveMessage.mockRejectedValueOnce(new Error('db'));
      await service.saveConversation(9, 2, 'hi', 'hello');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error saving conversation:', expect.any(Error));
    });
  });

  describe('getOrCreateSession', () => {
    it('returns existing session by id', async () => {
      const { service, mockChatRepo } = await importTutorWithEnv();
      mockChatRepo.getSessionById.mockResolvedValueOnce({ id: 5 });
      const s = await service.getOrCreateSession(2, 5);
      expect(s).toEqual({ id:5 });
    });
    it('creates when no existing session', async () => {
      const { service, mockChatRepo } = await importTutorWithEnv();
      mockChatRepo.getSessionById.mockResolvedValueOnce(null);
      mockChatRepo.getUserLanguageInfo.mockResolvedValueOnce({ language:'English', proficiency:'Beginner' });
      mockChatRepo.createSession.mockResolvedValueOnce({ id: 7 });
      const s = await service.getOrCreateSession(2, 99);
      expect(s).toEqual({ id:7 });
    });

    it('creates new session when sessionId is omitted (default path)', async () => {
      const { service, mockChatRepo } = await importTutorWithEnv();
      mockChatRepo.getUserLanguageInfo.mockResolvedValueOnce({ language:'English', proficiency:'Beginner' });
      mockChatRepo.createSession.mockResolvedValueOnce({ id: 8 });

      const s = await service.getOrCreateSession(3);
      expect(mockChatRepo.getSessionById).not.toHaveBeenCalled();
      expect(mockChatRepo.createSession).toHaveBeenCalledWith(3, 'English', 'Beginner');
      expect(s).toEqual({ id: 8 });
    });
    it('propagates errors', async () => {
      const { service, mockChatRepo } = await importTutorWithEnv();
      mockChatRepo.getSessionById.mockRejectedValueOnce(new Error('fail'));
      await expect(service.getOrCreateSession(1, 2)).rejects.toThrow('fail');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting/creating session:', expect.any(Error));
    });
  });

  describe('getUserChatHistory', () => {
    it('returns sessions', async () => {
      const { service, mockChatRepo } = await importTutorWithEnv();
      mockChatRepo.getUserSessions.mockResolvedValueOnce([{ id:1 }]);
      const r = await service.getUserChatHistory(9, 5);
      expect(r).toEqual([{ id:1 }]);
    });

    it('uses default limit when only userId is provided', async () => {
      const { service, mockChatRepo } = await importTutorWithEnv();
      mockChatRepo.getUserSessions.mockResolvedValueOnce([{ id: 2 }]);
      const r = await service.getUserChatHistory(4);
      expect(mockChatRepo.getUserSessions).toHaveBeenCalledWith(4, 10);
      expect(r).toEqual([{ id: 2 }]);
    });
    it('propagates error', async () => {
      const { service, mockChatRepo } = await importTutorWithEnv();
      mockChatRepo.getUserSessions.mockRejectedValueOnce(new Error('oops'));
      await expect(service.getUserChatHistory(9, 5)).rejects.toThrow('oops');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching chat history:', expect.any(Error));
    });
  });

  describe('validateMessage', () => {
    it('validates message content and throws on invalid', async () => {
      const { service } = await importTutorWithEnv();
      expect(() => service.validateMessage()).toThrow('Message is required and must be a string');
      expect(() => service.validateMessage(123)).toThrow('Message is required and must be a string');
      expect(() => service.validateMessage('   ')).toThrow('Message cannot be empty');
      expect(() => service.validateMessage('x'.repeat(2001))).toThrow('Message is too long (max 2000 characters)');
      expect(service.validateMessage(' ok ')).toBe('ok');
      const exactlyLimit = 'y'.repeat(2000);
      expect(service.validateMessage(exactlyLimit)).toHaveLength(2000);
    });
  });

  it('sanitizeResponse removes script/iframe and trims', async () => {
    const { service } = await importTutorWithEnv();
    const dirty = ' <script>alert(1)</script>Hi<iframe src=x></iframe> ';
    expect(service.sanitizeResponse(dirty)).toBe('Hi');
  });
});
