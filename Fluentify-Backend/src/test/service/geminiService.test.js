import { jest } from '@jest/globals';

// Helpers to (re)import geminiService with env and mocks
async function importGeminiWithEnv(key = 'test-key') {
  jest.resetModules();
  if (key === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = key;

  // fresh mocks per import
  const genModelMock = { generateContent: jest.fn() };
  const getGenerativeModel = jest.fn().mockReturnValue(genModelMock);
  const GoogleGenerativeAI = jest.fn().mockImplementation(() => ({
    getGenerativeModel,
  }));
  await jest.unstable_mockModule('@google/generative-ai', () => ({ GoogleGenerativeAI }));
  const mod = await import('../../services/geminiService.js');
  return { service: mod.default, genModelMock, GoogleGenerativeAI, getGenerativeModel };
}

const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('geminiService', () => {
  beforeEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    consoleLogSpy.mockClear();
    consoleWarnSpy.mockClear();
    consoleErrorSpy.mockClear();
  });

  it('constructor throws when GEMINI_API_KEY missing', async () => {
    jest.resetModules();
    delete process.env.GEMINI_API_KEY;
    await expect(import('../../services/geminiService.js')).rejects.toThrow('GEMINI_API_KEY');
  });

  it('initializes GoogleGenerativeAI with key and gemini-2.0-flash model', async () => {
    const { service, getGenerativeModel, GoogleGenerativeAI } = await importGeminiWithEnv('abc123');
    expect(service).toBeDefined();
    expect(GoogleGenerativeAI).toHaveBeenCalledWith('abc123');
    expect(getGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-2.0-flash' });
  });

  describe('parseJSON', () => {
    it('parses valid JSON with code fences', async () => {
      const { service } = await importGeminiWithEnv();
      const text = '```json\n{ "units": [] }\n```';
      expect(service.parseJSON(text)).toEqual({ units: [] });
      expect(consoleLogSpy).toHaveBeenCalledWith('Response length:', text.length, 'characters');
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
      expect(consoleErrorSpy).toHaveBeenCalledWith('JSON parse error:', expect.any(String));
    });

    it('repairs unescaped newlines in strings', async () => {
      const { service } = await importGeminiWithEnv();
      // A string with a real newline inside, which is invalid JSON
      const text = '{"description": "Line 1\nLine 2"}'; 
      const res = service.parseJSON(text);
      // The regex `replace(/([^\\])\n/g, '$1 ')` replaces newline with space
      expect(res.description).toBe("Line 1 Line 2");
    });

    it('handles code fences even when ```json marker is not followed by a newline', async () => {
      const { service } = await importGeminiWithEnv();
      const text = '```json{"value":3}\n```';
      expect(service.parseJSON(text)).toEqual({ value: 3 });
    });

    it('removes code fences using exact regex replacements and trims the cleaned text', async () => {
      const { service } = await importGeminiWithEnv();
      const text = '   ```json\n{ "value": 2 }```   ';

      const originalReplace = String.prototype.replace;
      const originalTrim = String.prototype.trim;
      const replaceCalls = [];
      let trimCalled = false;

      String.prototype.replace = function(pattern, replacement) {
        if (this.includes('```')) {
          replaceCalls.push({
            pattern: pattern instanceof RegExp ? pattern.source : pattern,
            replacement,
          });
        }
        return originalReplace.call(this, pattern, replacement);
      };

      String.prototype.trim = function() {
        if (this.includes('```json') || this.startsWith('{')) {
          trimCalled = true;
        }
        return originalTrim.call(this);
      };

      try {
        expect(service.parseJSON(text)).toEqual({ value: 2 });
      } finally {
        String.prototype.replace = originalReplace;
        String.prototype.trim = originalTrim;
      }

      expect(replaceCalls).toEqual(expect.arrayContaining([
        { pattern: '```json\\n?', replacement: '' },
        { pattern: '```', replacement: '' },
      ]));
      expect(trimCalled).toBe(true);
    });

    it('uses the /\{[\\s\\S]*\}/ regex before manual extraction', async () => {
      const { service } = await importGeminiWithEnv();
      const text = 'PREFIX { "id": 9 } SUFFIX';

      const originalMatch = String.prototype.match;
      const seenSources = [];
      String.prototype.match = function(regex) {
        if (regex instanceof RegExp) {
          seenSources.push(regex.source);
        }
        return originalMatch.call(this, regex);
      };

      try {
        expect(service.parseJSON(text)).toEqual({ id: 9 });
      } finally {
        String.prototype.match = originalMatch;
      }

      expect(seenSources).toContain('\\{[\\s\\S]*\\}');
    });

    it('skips manual extraction when the regex already finds JSON', async () => {
      const { service } = await importGeminiWithEnv();
      const text = '{ "ok": true }';

      const originalSubstring = String.prototype.substring;
      let substringCalls = 0;
      String.prototype.substring = function(start, end) {
        if (this.includes('"ok"')) {
          substringCalls += 1;
        }
        return originalSubstring.call(this, start, end);
      };

      try {
        expect(service.parseJSON(text)).toEqual({ ok: true });
      } finally {
        String.prototype.substring = originalSubstring;
      }

      expect(substringCalls).toBe(0);
    });

    it('attempts fallback manual extraction if regex match fails', async () => {
      const { service } = await importGeminiWithEnv();
      const text = 'prefix { "a": 1 } suffix';
      const startIdx = text.indexOf('{');
      const endIdx = text.lastIndexOf('}');

      const originalMatch = String.prototype.match;
      const originalSubstring = String.prototype.substring;
      const substringCalls = [];

      String.prototype.match = function(regex) {
        if (regex instanceof RegExp && regex.source === '\\{[\\s\\S]*\\}') {
          return null;
        }
        return originalMatch.call(this, regex);
      };

      String.prototype.substring = function(start, end) {
        if (this.includes('"a"')) {
          substringCalls.push({ start, end });
        }
        return originalSubstring.call(this, start, end);
      };

      try {
        const res = service.parseJSON(text);
        expect(res).toEqual({ a: 1 });
      } finally {
        String.prototype.match = originalMatch;
        String.prototype.substring = originalSubstring;
      }

      expect(substringCalls).toHaveLength(1);
      expect(substringCalls[0]).toEqual({ start: startIdx, end: endIdx + 1 });
    });

    it('throws when no valid JSON found even after manual extraction check', async () => {
      const { service } = await importGeminiWithEnv();
      // Input with braces that are in the wrong order to fail validation
      expect(() => service.parseJSON('} {')).toThrow('No valid JSON found');
    });

    it('treats missing brace/bracket counts as zero when match returns null', async () => {
      const { service } = await importGeminiWithEnv();
      const broken = '{"__FORCE_NULL__": {"list": [1, 2, 3 }';

      const originalMatch = String.prototype.match;
      let nullHits = 0;
      String.prototype.match = function(regex) {
        if (
          regex instanceof RegExp &&
          (regex.source === '\\{' || regex.source === '\\[') &&
          this.includes('__FORCE_NULL__')
        ) {
          nullHits += 1;
          return null;
        }
        return originalMatch.call(this, regex);
      };

      try {
        expect(() => service.parseJSON(broken)).toThrow(/Failed to parse JSON/);
        expect(nullHits).toBeGreaterThan(0);
      } finally {
        String.prototype.match = originalMatch;
      }
    });

    it('logs raw response preview capped at 500 characters when parsing ultimately fails', async () => {
      const { service } = await importGeminiWithEnv();
      const text = 'x'.repeat(600);
      consoleErrorSpy.mockClear();

      expect(() => service.parseJSON(text)).toThrow(/Failed to parse JSON/);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error parsing JSON:', expect.any(Error));
      const rawCall = consoleErrorSpy.mock.calls.find(([msg]) => msg === 'Raw response:');
      expect(rawCall).toBeDefined();
      expect(rawCall[1]).toHaveLength(500);
      expect(rawCall[1]).toBe(text.substring(0, 500));
    });

    it('auto-closes JSON on second attempt using error position', async () => {
      const { service } = await importGeminiWithEnv();
      const broken = '{"items": [1, 2, 3,'; // clearly incomplete JSON with unmatched [ and {

      const realParse = JSON.parse;
      let callCount = 0;
      const jsonSpy = jest.spyOn(JSON, 'parse').mockImplementation((input) => {
        if (callCount === 0) {
          callCount += 1;
          // First parse attempt behaves normally and throws
          return realParse(input);
        }
        if (callCount === 1) {
          callCount += 1;
          // Second parse (fixedJson) fails with position information
          throw new Error('Unexpected token } in JSON at position 10');
        }
        return realParse(input);
      });

      try {
        expect(() => service.parseJSON(broken)).toThrow(/Failed to parse JSON:/);
      } finally {
        jsonSpy.mockRestore();
      }
    });

    it('auto-close gracefully handles missing brace counts when regex match returns null', async () => {
      const { service } = await importGeminiWithEnv();
      const broken = '{"outer": {"inner": 1},';

      const originalMatch = String.prototype.match;
      let injected = false;
      String.prototype.match = function(regex) {
        if (!injected && regex instanceof RegExp && regex.source === '\\{') {
          injected = true;
          return null;
        }
        return originalMatch.call(this, regex);
      };

      try {
        expect(() => service.parseJSON(broken)).toThrow(/Failed to parse JSON/);
      } finally {
        String.prototype.match = originalMatch;
      }
    });

    it('auto-close gracefully handles missing bracket counts when regex match returns null', async () => {
      const { service } = await importGeminiWithEnv();
      const broken = '{"outer": {"inner": {"value": 1}},';

      const originalMatch = String.prototype.match;
      let injected = false;
      String.prototype.match = function(regex) {
        if (!injected && regex instanceof RegExp && regex.source === '\\[') {
          injected = true;
          return null;
        }
        return originalMatch.call(this, regex);
      };

      try {
        const result = service.parseJSON(broken);
        expect(result.outer.inner.value).toBe(1);
        expect(injected).toBe(true);
      } finally {
        String.prototype.match = originalMatch;
      }
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
      expect(genModelMock.generateContent).toHaveBeenCalledWith(expect.objectContaining({
        contents: [{ role: 'user', parts: [{ text: expect.stringContaining('Generate a comprehensive, in-depth course outline') }] }],
        generationConfig: { maxOutputTokens: 2048, temperature: 0.7 },
      }));
    });

    it('uses default expertise parameter when not provided', async () => {
      const { service, genModelMock } = await importGeminiWithEnv();
      genModelMock.generateContent.mockResolvedValueOnce({
        response: Promise.resolve({ text: () => '{"units":[]}' })
      });

      const outline = await service.generateCourseOutline('English', '3 months');

      expect(outline.units).toEqual([]);
      expect(genModelMock.generateContent).toHaveBeenCalledTimes(1);
      const callArg = genModelMock.generateContent.mock.calls[0][0];
      const prompt = callArg.contents[0].parts[0].text;
      expect(prompt).toContain("User's Current Level: Beginner");
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

    it('logs human readable delay when retrying on rate limit', async () => {
      jest.useFakeTimers();
      const { service } = await importGeminiWithEnv();
      let attempts = 0;
      const fn = jest.fn().mockImplementation(() => {
        if (attempts === 0) {
          attempts++;
          const err = Object.assign(new Error('Too Many Requests'), { status: 429 });
          throw err;
        }
        return 'ok';
      });

      const promise = service.retryWithBackoff(fn, 2, 2000);
      await jest.advanceTimersByTimeAsync(2000);
      const result = await promise;
      expect(result).toBe('ok');
      expect(consoleWarnSpy).toHaveBeenCalledWith('⏳ Rate limit hit. Retrying in 2s... (Attempt 1/2)');
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

      const delays = [];
      const timeoutSpy = jest
        .spyOn(global, 'setTimeout')
        .mockImplementation((cb, ms) => {
          delays.push(ms);
          cb();
          return 0;
        });

      await expect(service.retryWithBackoff(fn, 3, 10)).rejects.toThrow('Persistent Rate Limit');
      expect(fn).toHaveBeenCalledTimes(3);
      expect(delays).toEqual([10, 20, 40]);

      timeoutSpy.mockRestore();
    });

    it('rethrows errors without message without crashing optional chaining', async () => {
      const { service } = await importGeminiWithEnv();
      const err = { status: 500 };
      await expect(service.retryWithBackoff(() => Promise.reject(err), 1)).rejects.toBe(err);
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
      expect(data.course.title).toBe('English Learning Journey');
      expect(data.course.version).toBe('1.0');
      expect(data.course.totalLessons).toBe(1);
      expect(data.metadata.totalLessons).toBe(1);
      // Check if fallback time (150) was used because parseInt('Unknown') is NaN
      expect(data.metadata.estimatedTotalTime).toBe(150); 
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Generating course for: English, Duration: 4w, Expertise: Beginner');
      expect(consoleLogSpy).toHaveBeenCalledWith('Step 1: Generating course outline...');
      expect(consoleLogSpy).toHaveBeenCalledWith('Step 2: Generating 1 units...');
      expect(consoleLogSpy).toHaveBeenCalledWith('  Generating Unit 1: U...');
      expect(consoleLogSpy).toHaveBeenCalledWith('Course generation complete!');
      expect(consoleLogSpy).toHaveBeenCalledWith('Total: 1 units, 1 lessons');
    });

    it('handles empty course outline gracefully', async () => {
      const { service } = await importGeminiWithEnv();
      
      jest.spyOn(service, 'generateCourseOutline').mockResolvedValueOnce({ units: [] });
      
      const data = await service.generateCourse('English', '1w');
      expect(data.course.units).toHaveLength(0);
      expect(data.metadata.totalLessons).toBe(0);
      // Default expertise should be "Beginner" when omitted
      expect(service.generateCourseOutline).toHaveBeenCalledWith('English', '1w', 'Beginner');
    });

    it('wraps and rethrows errors', async () => {
      const { service } = await importGeminiWithEnv();
      jest.spyOn(service, 'generateCourseOutline').mockRejectedValueOnce(new Error('NOPE'));
      await expect(service.generateCourse('English', '4w')).rejects.toThrow('Failed to generate course content: NOPE');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error generating course:', expect.any(Error));
    });

    it('passes sequential unit indexes to generateUnit based on outline order', async () => {
      const { service } = await importGeminiWithEnv();

      jest.spyOn(service, 'generateCourseOutline').mockResolvedValueOnce({
        units: [
          { title: 'Unit A', description: 'd', difficulty: 'Beginner', estimatedTime: '10', lessonCount: 1, topics: [] },
          { title: 'Unit B', description: 'd', difficulty: 'Intermediate', estimatedTime: '20', lessonCount: 2, topics: [] },
        ],
      });

      const generateUnitSpy = jest.spyOn(service, 'generateUnit')
        .mockImplementation(async (_lang, outline, unitNumber) => ({
          id: unitNumber,
          title: outline.title,
          lessons: [],
        }));

      await service.generateCourse('English', '4w', 'Beginner');

      expect(generateUnitSpy).toHaveBeenCalledTimes(2);
      expect(generateUnitSpy.mock.calls[0][2]).toBe(1);
      expect(generateUnitSpy.mock.calls[1][2]).toBe(2);
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
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error generating exercises:', expect.any(Error));
    });

    it('builds exercise prompt with lesson details and constraints', async () => {
      const { service, genModelMock } = await importGeminiWithEnv();
      genModelMock.generateContent.mockResolvedValueOnce({
        response: Promise.resolve({ text: () => '{"exercises":[]}' })
      });

      await service.generateExercises('Greetings', 'vocabulary', 'Spanish');

      expect(genModelMock.generateContent).toHaveBeenCalledTimes(1);
      const prompt = genModelMock.generateContent.mock.calls[0][0];
      expect(prompt).toContain('multiple choice questions (MCQ)');
      expect(prompt).toContain('lesson titled "Greetings" in Spanish');
      expect(prompt).toContain('ALL exercises MUST be "multiple_choice" type only');
      expect(prompt).toContain('Make sure to generate exactly 5 exercises.');
    });
  });

  describe('generateUnit', () => {
    it('builds unit prompt with default expertise, topics list, and config', async () => {
      const { service, genModelMock } = await importGeminiWithEnv();

      genModelMock.generateContent.mockResolvedValueOnce({
        response: Promise.resolve({ text: () => '{"id":2,"lessons":[]}' })
      });

      const outline = {
        title: 'Unit Title',
        description: 'desc',
        difficulty: 'Beginner',
        estimatedTime: '10 min',
        topics: ['a', 'b'],
        lessonCount: 2,
      };

      await service.generateUnit('French', outline, 2);

      expect(genModelMock.generateContent).toHaveBeenCalledTimes(1);
      const callArg = genModelMock.generateContent.mock.calls[0][0];
      expect(callArg.contents).toHaveLength(1);
      expect(callArg.contents[0].role).toBe('user');
      const prompt = callArg.contents[0].parts[0].text;
      expect(prompt).toContain('Generate detailed lessons for Unit 2 of a French course.');
      expect(prompt).toContain("User's Current Level: Beginner");
      expect(prompt).toContain('Topics: a, b');
      expect(callArg.generationConfig).toEqual({ maxOutputTokens: 8192, temperature: 0.7 });
    });
  });

  it('createCoursePrompt includes language and duration', async () => {
    const { service } = await importGeminiWithEnv();
    const prompt = service.createCoursePrompt('Spanish', '6 months');
    expect(prompt).toContain('Spanish');
  });
});

afterAll(() => {
  consoleLogSpy.mockRestore();
  consoleWarnSpy.mockRestore();
  consoleErrorSpy.mockRestore();
});