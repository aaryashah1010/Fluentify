import { jest } from '@jest/globals';

const mockHandleResponse = jest.fn(async (response) => ({ ok: true, response }));

await jest.unstable_mockModule('../../api/apiHelpers.js', () => ({
  API_BASE_URL: 'http://test-base',
  handleResponse: mockHandleResponse,
}));

const tutorApi = await import('../../api/tutor.js');

const makeStreamReader = (chunks) => {
  let index = 0;
  return {
    read: jest.fn(async () => {
      if (index >= chunks.length) {
        return { done: true, value: undefined };
      }
      const value = chunks[index++];
      return { done: false, value };
    }),
  };
};

describe('tutor API client', () => {
  let consoleErrorSpy;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMessageStream', () => {
    it('streams chunks, extracts SESSION_ID, and calls callbacks', async () => {
      const textEncoder = new TextEncoder();
      const chunks = [
        textEncoder.encode('SESSION_ID:abc123\nHello '),
        textEncoder.encode('world!'),
      ];

      const reader = makeStreamReader(chunks);
      const mockResponse = {
        ok: true,
        status: 200,
        body: { getReader: () => reader },
      };

      globalThis.fetch = jest.fn().mockResolvedValue(mockResponse);

      const onChunk = jest.fn();
      const onComplete = jest.fn();
      const onError = jest.fn();

      const result = await tutorApi.sendMessageStream(
        'Hi',
        null,
        'jwt-token',
        onChunk,
        onComplete,
        onError
      );

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/tutor/message',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer jwt-token',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: 'Hi', sessionId: null }),
        }
      );

      // Both chunks should have been surfaced
      expect(onChunk).toHaveBeenCalledTimes(2);
      // The implementation strips the SESSION_ID line before invoking onChunk
      expect(onChunk).toHaveBeenNthCalledWith(1, 'Hello ');
      expect(onChunk).toHaveBeenNthCalledWith(2, 'world!');
      expect(onComplete).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
      expect(result).toEqual({ sessionId: 'abc123' });
    });

    it('throws when response is not ok and surfaces error message', async () => {
      const errorPayload = { message: 'validation_error:bad input' };
      const mockResponse = {
        ok: false,
        status: 400,
        json: jest.fn(async () => errorPayload),
      };
      globalThis.fetch = jest.fn().mockResolvedValue(mockResponse);

      const onError = jest.fn();

      await expect(
        tutorApi.sendMessageStream('Hi', null, 'jwt', jest.fn(), jest.fn(), onError)
      ).rejects.toThrow('validation_error:bad input');

      // Outer catch should map validation_error directly
      expect(onError).toHaveBeenCalledWith('validation_error:bad input');
    });

    it('uses fallback message when error payload has no message', async () => {
      const errorPayload = { foo: 'bar' };
      const mockResponse = {
        ok: false,
        status: 500,
        json: jest.fn(async () => errorPayload),
      };
      globalThis.fetch = jest.fn().mockResolvedValue(mockResponse);

      const onError = jest.fn();

      await expect(
        tutorApi.sendMessageStream('Hi', null, 'jwt', jest.fn(), jest.fn(), onError)
      ).rejects.toThrow('Failed to send message');

      // Falls through to generic error mapping
      expect(onError).toHaveBeenCalledWith('Check your connection and try again.');
    });

    it('maps rate limit errors to friendly message', async () => {
      globalThis.fetch = jest.fn().mockRejectedValue(new Error('rate_limit_exceeded'));

      const onError = jest.fn();

      await expect(
        tutorApi.sendMessageStream('Hi', null, 'jwt', jest.fn(), jest.fn(), onError)
      ).rejects.toThrow('rate_limit_exceeded');

      expect(onError).toHaveBeenCalledWith(
        "You're chatting too quickly. Please wait a few seconds."
      );
    });

    it('maps "too quickly" errors via alternate branch', async () => {
      globalThis.fetch = jest.fn().mockRejectedValue(new Error('You are chatting too quickly')); // no rate_limit substring

      const onError = jest.fn();

      await expect(
        tutorApi.sendMessageStream('Hi', null, 'jwt', jest.fn(), jest.fn(), onError)
      ).rejects.toThrow('You are chatting too quickly');

      expect(onError).toHaveBeenCalledWith(
        "You're chatting too quickly. Please wait a few seconds."
      );
    });

    it('maps AI failure errors to friendly message', async () => {
      globalThis.fetch = jest.fn().mockRejectedValue(new Error('ai_failure:timeout'));

      const onError = jest.fn();

      await expect(
        tutorApi.sendMessageStream('Hi', null, 'jwt', jest.fn(), jest.fn(), onError)
      ).rejects.toThrow('ai_failure:timeout');

      expect(onError).toHaveBeenCalledWith('Our AI tutor is temporarily unavailable.');
    });

    it('maps "unavailable" errors via alternate branch', async () => {
      globalThis.fetch = jest.fn().mockRejectedValue(new Error('service unavailable'));

      const onError = jest.fn();

      await expect(
        tutorApi.sendMessageStream('Hi', null, 'jwt', jest.fn(), jest.fn(), onError)
      ).rejects.toThrow('service unavailable');

      expect(onError).toHaveBeenCalledWith('Our AI tutor is temporarily unavailable.');
    });

    it('maps generic errors to connection message', async () => {
      globalThis.fetch = jest.fn().mockRejectedValue(new Error('some_other_error'));

      const onError = jest.fn();

      await expect(
        tutorApi.sendMessageStream('Hi', null, 'jwt', jest.fn(), jest.fn(), onError)
      ).rejects.toThrow('some_other_error');

      expect(onError).toHaveBeenCalledWith('Check your connection and try again.');
    });

    it('handles outer catch when onError is not provided', async () => {
      globalThis.fetch = jest.fn().mockRejectedValue(new Error('some_other_error'));

      // onError is undefined here
      await expect(
        tutorApi.sendMessageStream('Hi', null, 'jwt', jest.fn(), jest.fn(), undefined)
      ).rejects.toThrow('some_other_error');
    });

    it('invokes onError for stream read errors inside inner try/catch', async () => {
      const reader = {
        read: jest.fn(async () => {
          throw new Error('stream failure');
        }),
      };

      const mockResponse = {
        ok: true,
        status: 200,
        body: { getReader: () => reader },
      };

      globalThis.fetch = jest.fn().mockResolvedValue(mockResponse);

      const onChunk = jest.fn();
      const onComplete = jest.fn();
      const onError = jest.fn();

      await expect(
        tutorApi.sendMessageStream('Hi', null, 'jwt-token', onChunk, onComplete, onError)
      ).rejects.toThrow('stream failure');

      expect(onError).toHaveBeenCalledWith('Connection interrupted. Please try again.');
      expect(onComplete).not.toHaveBeenCalled();
    });

    it('handles inner stream error when onError is not provided', async () => {
      const reader = {
        read: jest.fn(async () => {
          throw new Error('stream failure');
        }),
      };

      const mockResponse = {
        ok: true,
        status: 200,
        body: { getReader: () => reader },
      };

      globalThis.fetch = jest.fn().mockResolvedValue(mockResponse);

      const onChunk = jest.fn();
      const onComplete = jest.fn();

      await expect(
        tutorApi.sendMessageStream('Hi', null, 'jwt-token', onChunk, onComplete, undefined)
      ).rejects.toThrow('stream failure');
    });

    it('handles outer catch error when onError is not provided', async () => {
      globalThis.fetch = jest.fn().mockRejectedValue(new Error('some_other_error'));

      const onChunk = jest.fn();
      const onComplete = jest.fn();

      await expect(
        tutorApi.sendMessageStream('Hi', null, 'jwt-token', onChunk, onComplete, undefined)
      ).rejects.toThrow('some_other_error');
    });

    it('handles stream without SESSION_ID and preserves existing sessionId', async () => {
      const textEncoder = new TextEncoder();
      const chunks = [
        textEncoder.encode('Hello '),
        textEncoder.encode('world!'),
      ];

      const reader = makeStreamReader(chunks);
      const mockResponse = {
        ok: true,
        status: 200,
        body: { getReader: () => reader },
      };

      globalThis.fetch = jest.fn().mockResolvedValue(mockResponse);

      const onChunk = jest.fn();
      const onComplete = jest.fn();
      const onError = jest.fn();

      const result = await tutorApi.sendMessageStream(
        'Hi',
        'existing-session',
        'jwt-token',
        onChunk,
        onComplete,
        onError
      );

      expect(onChunk).toHaveBeenCalledTimes(2);
      expect(onChunk).toHaveBeenNthCalledWith(1, 'Hello ');
      expect(onChunk).toHaveBeenNthCalledWith(2, 'world!');
      expect(onComplete).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
      // Since no SESSION_ID is present, original sessionId should be preserved
      expect(result).toEqual({ sessionId: 'existing-session' });
    });

    it('handles stream when onChunk is not provided (no callback)', async () => {
      const textEncoder = new TextEncoder();
      const chunks = [
        textEncoder.encode('Hello '),
        textEncoder.encode('world!'),
      ];

      const reader = makeStreamReader(chunks);
      const mockResponse = {
        ok: true,
        status: 200,
        body: { getReader: () => reader },
      };

      globalThis.fetch = jest.fn().mockResolvedValue(mockResponse);

      const onComplete = jest.fn();
      const onError = jest.fn();

      const result = await tutorApi.sendMessageStream(
        'Hi',
        null,
        'jwt-token',
        undefined,
        onComplete,
        onError
      );

      expect(onComplete).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
      // sessionId remains null since none was provided or found
      expect(result).toEqual({ sessionId: null });
    });

    it('handles malformed SESSION_ID header without crashing', async () => {
      const textEncoder = new TextEncoder();
      // SESSION_ID with no value before newline -> regex match will be null
      const chunks = [
        textEncoder.encode('SESSION_ID:\nHello '),
        textEncoder.encode('world!'),
      ];

      const reader = makeStreamReader(chunks);
      const mockResponse = {
        ok: true,
        status: 200,
        body: { getReader: () => reader },
      };

      globalThis.fetch = jest.fn().mockResolvedValue(mockResponse);

      const onChunk = jest.fn();
      const onComplete = jest.fn();
      const onError = jest.fn();

      const result = await tutorApi.sendMessageStream(
        'Hi',
        null,
        'jwt-token',
        onChunk,
        onComplete,
        onError
      );

      // Chunks should still be delivered even if SESSION_ID parsing fails
      expect(onChunk).toHaveBeenCalledTimes(2);
      expect(onComplete).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
      // No valid SESSION_ID extracted, so sessionId remains null
      expect(result).toEqual({ sessionId: null });
    });

    it('handles success when onComplete is not provided', async () => {
      const textEncoder = new TextEncoder();
      const chunks = [
        textEncoder.encode('Hello tutor'),
      ];

      const reader = makeStreamReader(chunks);
      const mockResponse = {
        ok: true,
        status: 200,
        body: { getReader: () => reader },
      };

      globalThis.fetch = jest.fn().mockResolvedValue(mockResponse);

      const onChunk = jest.fn();
      const onError = jest.fn();

      const result = await tutorApi.sendMessageStream(
        'Hi',
        null,
        'jwt-token',
        onChunk,
        undefined,
        onError
      );

      expect(onChunk).toHaveBeenCalledWith('Hello tutor');
      expect(onError).not.toHaveBeenCalled();
      // No sessionId from server, remains null
      expect(result).toEqual({ sessionId: null });
    });
  });

  describe('non-stream tutor endpoints', () => {
    it('getChatHistory includes token and optional limit', async () => {
      const mockResponse = { ok: true, status: 200 };
      globalThis.fetch = jest.fn().mockResolvedValue(mockResponse);

      await tutorApi.getChatHistory('jwt-token', 25);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/tutor/history?limit=25',
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer jwt-token',
            'Content-Type': 'application/json',
          },
        }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });

    it('getChatHistory uses default limit when not provided', async () => {
      const mockResponse = { ok: true, status: 200 };
      globalThis.fetch = jest.fn().mockResolvedValue(mockResponse);

      await tutorApi.getChatHistory('jwt-token');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/tutor/history?limit=10',
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer jwt-token',
            'Content-Type': 'application/json',
          },
        }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });

    it('createChatSession posts with bearer token header', async () => {
      const mockResponse = { ok: true, status: 200 };
      globalThis.fetch = jest.fn().mockResolvedValue(mockResponse);

      await tutorApi.createChatSession('jwt-token');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/tutor/session',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer jwt-token',
            'Content-Type': 'application/json',
          },
        }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });

    it('checkTutorHealth hits health endpoint with JSON header', async () => {
      const mockResponse = { ok: true, status: 200 };
      globalThis.fetch = jest.fn().mockResolvedValue(mockResponse);

      await tutorApi.checkTutorHealth();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/tutor/health',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });
  });
});
