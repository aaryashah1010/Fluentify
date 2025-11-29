// @ts-nocheck
import { jest } from '@jest/globals';

async function importTutorWithEnv(key='test-key'){
  jest.resetModules();
  if (key === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = key;
  const genModel = { generateContentStream: jest.fn() };
  const GoogleGenerativeAI = jest.fn().mockImplementation(() => ({ getGenerativeModel: () => genModel }));
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
  return { service: mod.default, genModel, mockChatRepo };
}

describe('tutorService', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('constructor throws without GEMINI_API_KEY', async () => {
    jest.resetModules(); delete process.env.GEMINI_API_KEY;
    await expect(import('../../services/tutorService.js')).rejects.toThrow('GEMINI_API_KEY');
  });

  it('generateSystemPrompt adapts language/proficiency and fallback', async () => {
    const { service } = await importTutorWithEnv();
    const p1 = service.generateSystemPrompt('Spanish', 'Beginner');
    expect(p1).toContain('Spanish'); expect(p1).toContain('Beginner');
    const p2 = service.generateSystemPrompt('', '');
    expect(p2).toContain('help users learn any language');
  });

  it('buildConversationContext maps roles and returns [] for empty', async () => {
    const { service } = await importTutorWithEnv();
    expect(service.buildConversationContext([])).toEqual([]);
    const msgs = service.buildConversationContext([{ sender_type:'user', content:'hi' }, { sender_type:'ai', content:'yo' }]);
    expect(msgs[0].role).toBe('user'); expect(msgs[1].role).toBe('model');
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

    it('wraps error message on failure', async () => {
      const { service, genModel, mockChatRepo } = await importTutorWithEnv();
      mockChatRepo.getUserLanguageInfo.mockResolvedValueOnce({ language:'English', proficiency:'Beginner' });
      mockChatRepo.getRecentMessages.mockResolvedValueOnce([]);
      genModel.generateContentStream.mockRejectedValueOnce(new Error('down'));
      await expect(service.generateStreamingResponse('Hello', 1, 2)).rejects.toThrow('AI service error: down');
    });
  });

  describe('saveConversation', () => {
    it('saves user and ai messages and ignores errors', async () => {
      const { service, mockChatRepo } = await importTutorWithEnv();
      await service.saveConversation(9, 2, 'hi', 'hello');
      expect(mockChatRepo.saveMessage).toHaveBeenCalledTimes(2);
      mockChatRepo.saveMessage.mockRejectedValueOnce(new Error('db'));
      await service.saveConversation(9, 2, 'hi', 'hello');
      // no throw
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
    });
  });

  describe('validateMessage', () => {
    it('validates message content and throws on invalid', async () => {
      const { service } = await importTutorWithEnv();
      expect(() => service.validateMessage()).toThrow('Message is required');
      expect(() => service.validateMessage('   ')).toThrow('Message cannot be empty');
      expect(() => service.validateMessage('x'.repeat(2001))).toThrow('too long');
      expect(service.validateMessage(' ok ')).toBe('ok');
    });
  });

  it('sanitizeResponse removes script/iframe and trims', async () => {
    const { service } = await importTutorWithEnv();
    const dirty = ' <script>alert(1)</script>Hi<iframe src=x></iframe> ';
    expect(service.sanitizeResponse(dirty)).toBe('Hi');
  });
});
