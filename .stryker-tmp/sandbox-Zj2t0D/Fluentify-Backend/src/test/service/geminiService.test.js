// @ts-nocheck
import { jest } from '@jest/globals';

// Helpers to (re)import geminiService with env and mocks
async function importGeminiWithEnv(key = 'test-key') {
  jest.resetModules();
  if (key === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = key;

  // fresh mocks per import
  const genModelMock = { generateContent: jest.fn() };
  const GoogleGenerativeAI = jest.fn().mockImplementation(() => ({
    getGenerativeModel: () => genModelMock,
  }));
  await jest.unstable_mockModule('@google/generative-ai', () => ({ GoogleGenerativeAI }));
  const mod = await import('../../services/geminiService.js');
  return { service: mod.default, genModelMock };
}

describe('geminiService', () => {
  beforeEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('constructor throws when GEMINI_API_KEY missing', async () => {
    jest.resetModules();
    delete process.env.GEMINI_API_KEY;
    await expect(import('../../services/geminiService.js')).rejects.toThrow('GEMINI_API_KEY');
  });

  describe('parseJSON', () => {
    it('parses valid JSON with code fences', async () => {
      const { service } = await importGeminiWithEnv();
      const text = '```json\n{ "units": [] }\n```';
      expect(service.parseJSON(text)).toEqual({ units: [] });
    });

    it('parses valid JSON without code fences but with surrounding text', async () => {
      const { service } = await importGeminiWithEnv();
      const text = 'Here is the data: { "id": 1 } hope this helps.';
      expect(service.parseJSON(text)).toEqual({ id: 1 });
    });

    it('repairs common JSON issues (trailing commas, newlines)', async () => {
      const { service } = await importGeminiWithEnv();
      const text = '{\n  "units": [\n    {"id":1,}\n  ]\n}';
      const res = service.parseJSON(text);
      expect(res.units[0].id).toBe(1);
    });

    it('repairs unescaped newlines in strings', async () => {
      const { service } = await importGeminiWithEnv();
      // A string with a real newline inside, which is invalid JSON
      const text = '{"description": "Line 1\nLine 2"}'; 
      const res = service.parseJSON(text);
      // The regex `replace(/([^\\])\n/g, '$1 ')` replaces newline with space
      expect(res.description).toBe("Line 1 Line 2");
    });

    it('auto-closes JSON on second attempt using error position', async () => {
      const { service } = await importGeminiWithEnv();
      // Missing closing brackets, JSON.parse will throw with position
      const broken = '{"a": { "b": [1, 2, 3 }'; 
      const res = service.parseJSON(broken);
      // Expect it to close the array and the two objects
      expect(res.a.b).toHaveLength(3);
    });

    it('throws second error if position extraction fails during auto-close attempt', async () => {
      const { service } = await importGeminiWithEnv();
      const brokenJson = '{ "test": "fail" }'; // Actually valid, but we will force mock failure
      
      // We spy on JSON.parse to simulate a specific failure sequence
      const jsonSpy = jest.spyOn(JSON, 'parse');
      
      // 1. First parse attempts extraction: Fail
      jsonSpy.mockImplementationOnce(() => { throw new Error('First syntax error'); });
      // 2. Second parse attempts "fixed" json: Fail with an error that lacks a position number
      jsonSpy.mockImplementationOnce(() => { throw new Error('Syntax error: Unexpected token (no position)'); });

      expect(() => service.parseJSON(brokenJson)).toThrow('Syntax error: Unexpected token (no position)');
    });

    it('attempts fallback manual extraction if regex match fails', async () => {
      const { service } = await importGeminiWithEnv();
      // Force String.prototype.match to return null once, while the text still
      // contains a valid JSON object. This drives parseJSON into the manual
      // extraction branch (startIdx/endIdx) that builds jsonMatch via substring.
      const text = 'prefix { "a": 1 } suffix';
      const matchSpy = jest.spyOn(String.prototype, 'match').mockImplementationOnce(() => null);

      const res = service.parseJSON(text);
      expect(res).toEqual({ a: 1 });

      matchSpy.mockRestore();
    });

    it('throws when no valid JSON found even after manual extraction check', async () => {
      const { service } = await importGeminiWithEnv();
      // Input with braces that are in the wrong order to fail validation
      expect(() => service.parseJSON('} {')).toThrow('No valid JSON found');
    });

    it('enters auto-close branch using error position and ultimately throws wrapped error', async () => {
      const { service } = await importGeminiWithEnv();
      const broken = '{"items": [1, 2, 3,'; // clearly incomplete JSON with unmatched [ and {

      const realParse = JSON.parse;
      const jsonSpy = jest.spyOn(JSON, 'parse').mockImplementation((input) => {
        const call = jsonSpy.mock.calls.length;
        if (call === 0) {
          // First parse attempt behaves normally and throws
          return realParse(input);
        }
        if (call === 1) {
          // Second parse (fixedJson) fails with position information
          throw new Error('Unexpected token } in JSON at position 10');
        }
        // Any subsequent parse attempts use the real implementation
        return realParse(input);
      });

      expect(() => service.parseJSON(broken)).toThrow(/Failed to parse JSON:/);

      jsonSpy.mockRestore();
    });
  });

  describe('generateCourseOutline', () => {
    it('returns parsed outline', async () => {
      const { service, genModelMock } = await importGeminiWithEnv();
      genModelMock.generateContent.mockResolvedValueOnce({
        response: Promise.resolve({ text: () => '{"units":[{"id":1,"title":"U1","description":"d","difficulty":"Beginner","estimatedTime":"3-4 hours","lessonCount":1,"topics":["t"]}]}' })
      });
      const outline = await service.generateCourseOutline('English', '3 months', 'Beginner');
      expect(outline.units.length).toBe(1);
    });

    it('uses default expertise parameter when not provided', async () => {
      const { service, genModelMock } = await importGeminiWithEnv();
      genModelMock.generateContent.mockResolvedValueOnce({
        response: Promise.resolve({ text: () => '{"units":[]}' })
      });

      const outline = await service.generateCourseOutline('English', '3 months');

      expect(outline.units).toEqual([]);
      expect(genModelMock.generateContent).toHaveBeenCalledTimes(1);
    });
  });

  describe('retryWithBackoff', () => {
    it('retries on 429 status code and succeeds', async () => {
      jest.useFakeTimers();
      const { service, genModelMock } = await importGeminiWithEnv();
      const rateErr = Object.assign(new Error('Rate Limit'), { status: 429 });
      
      // Fail once, then succeed
      genModelMock.generateContent
        .mockRejectedValueOnce(rateErr)
        .mockResolvedValueOnce({ response: Promise.resolve({ text: () => '{"success":true}' }) });

      const p = service.generateUnit('Eng', { title: 'T', description: 'D', difficulty: 'B', topics: [], lessonCount: 1 }, 1);
      
      // Advance timer for the backoff
      await jest.advanceTimersByTimeAsync(2000); 
      
      const res = await p;
      expect(res.success).toBe(true);
    });

    it('retries on error message containing "Too Many Requests" (without status code)', async () => {
      jest.useFakeTimers();
      const { service, genModelMock } = await importGeminiWithEnv();
      const msgErr = new Error('Error: 429 Too Many Requests');
      
      genModelMock.generateContent
        .mockRejectedValueOnce(msgErr)
        .mockResolvedValueOnce({ response: Promise.resolve({ text: () => '{"success":true}' }) });

      const p = service.generateUnit('Eng', { title: 'T', description: 'D', difficulty: 'B', topics: [], lessonCount: 1 }, 1);
      await jest.advanceTimersByTimeAsync(2000);
      const res = await p;
      expect(res.success).toBe(true);
    });

    it('throws immediately on non-rate-limit error', async () => {
      const { service, genModelMock } = await importGeminiWithEnv();
      genModelMock.generateContent.mockRejectedValueOnce(new Error('boom'));
      await expect(service.generateUnit('Eng', { title: 'T', description: 'D', difficulty: 'B', topics: [], lessonCount: 1 }, 1)).rejects.toThrow('boom');
    });

    it('throws the last error if maxRetries are exhausted', async () => {
      const { service } = await importGeminiWithEnv();
      const rateErr = Object.assign(new Error('Persistent Rate Limit'), { status: 429 });

      const fn = jest.fn().mockRejectedValue(rateErr);

      const timeoutSpy = jest
        .spyOn(global, 'setTimeout')
        .mockImplementation((cb, ms) => {
          cb();
          return 0;
        });

      await expect(service.retryWithBackoff(fn, 3, 10)).rejects.toThrow('Persistent Rate Limit');
      expect(fn).toHaveBeenCalledTimes(3);

      timeoutSpy.mockRestore();
    });
  });

  describe('generateCourse', () => {
    it('combines outline and units into structured course with correct metadata defaults', async () => {
      const { service } = await importGeminiWithEnv();
      
      // Mock Outline: 1 unit
      jest.spyOn(service, 'generateCourseOutline').mockResolvedValueOnce({ 
        units: [ { title: 'U', description: 'd', difficulty: 'Beginner', estimatedTime: '10 min', lessonCount: 1, topics: ['t'] } ] 
      });
      
      // Mock Unit Generation: Return unit with invalid estimatedTime to trigger the || 150 branch
      jest.spyOn(service, 'generateUnit').mockResolvedValueOnce({ 
        id: 1, 
        estimatedTime: 'Unknown', // This will fail parseInt
        lessons: [ { id: 1 } ] 
      });

      const data = await service.generateCourse('English', '4w', 'Beginner');
      
      expect(data.course.units.length).toBe(1);
      expect(data.metadata.totalLessons).toBe(1);
      // Check if fallback time (150) was used because parseInt('Unknown') is NaN
      expect(data.metadata.estimatedTotalTime).toBe(150); 
    });

    it('handles empty course outline gracefully', async () => {
      const { service } = await importGeminiWithEnv();
      
      jest.spyOn(service, 'generateCourseOutline').mockResolvedValueOnce({ units: [] });
      
      const data = await service.generateCourse('English', '1w');
      expect(data.course.units).toHaveLength(0);
      expect(data.metadata.totalLessons).toBe(0);
    });

    it('wraps and rethrows errors', async () => {
      const { service } = await importGeminiWithEnv();
      jest.spyOn(service, 'generateCourseOutline').mockRejectedValueOnce(new Error('NOPE'));
      await expect(service.generateCourse('English', '4w')).rejects.toThrow('Failed to generate course content: NOPE');
    });
  });

  describe('generateExercises', () => {
    it('retries on 429 and returns parsed exercises', async () => {
      jest.useFakeTimers();
      const { service, genModelMock } = await importGeminiWithEnv();
      const rateErr = Object.assign(new Error('429'), { status: 429 });
      genModelMock.generateContent
        .mockRejectedValueOnce(rateErr)
        .mockResolvedValueOnce({ response: Promise.resolve({ text: () => '{"exercises":[{"type":"multiple_choice","question":"q","options":["a","b","c","d"],"correctAnswer":0,"explanation":"e"}]}' }) });
      const p = service.generateExercises('L1', 'vocabulary', 'English');
      await jest.advanceTimersByTimeAsync(2000);
      const ex = await p;
      expect(ex.exercises).toHaveLength(1);
    });

    it('wraps error with message on failure', async () => {
      const { service, genModelMock } = await importGeminiWithEnv();
      genModelMock.generateContent.mockRejectedValueOnce(new Error('fail'));
      await expect(service.generateExercises('L1','vocabulary','English')).rejects.toThrow('Failed to generate exercises');
    });
  });

  it('createCoursePrompt includes language and duration', async () => {
    const { service } = await importGeminiWithEnv();
    const prompt = service.createCoursePrompt('Spanish', '6 months');
    expect(prompt).toContain('Spanish');
    expect(prompt).toContain('6 months');
  });
});