import { jest } from '@jest/globals';

import { API_BASE_URL, handleResponse, getAuthHeader, getAuthUrl } from '../../api/apiHelpers.js';

const makeResponse = ({ status = 200, ok = true, contentType = 'application/json', jsonData = {}, jsonThrows = false } = {}) => {
  const headers = {
    get: jest.fn(() => contentType),
  };
  const json = jest.fn(async () => {
    if (jsonThrows) {
      throw new Error('invalid json');
    }
    return jsonData;
  });
  return { status, ok, headers, json };
};

describe('apiHelpers', () => {
  let originalLocalStorage;
  let removeItemMock;
  let getItemMock;
  let consoleWarnSpy;

  beforeAll(() => {
    originalLocalStorage = globalThis.localStorage;
  });

  beforeEach(() => {
    removeItemMock = jest.fn();
    getItemMock = jest.fn();
    const mockLocalStorage = {
      getItem: getItemMock,
      removeItem: removeItemMock,
    };
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true
    });
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  afterAll(() => {
    globalThis.localStorage = originalLocalStorage;
  });

  describe('API_BASE_URL', () => {
    it('falls back to localhost when VITE_API_URL is not set', () => {
      expect(API_BASE_URL).toBe('http://localhost:5000');
    });
  });

  describe('handleResponse', () => {
    it('returns empty object for 204 responses', async () => {
      const res = makeResponse({ status: 204, ok: true, contentType: null });

      const data = await handleResponse(res);

      expect(res.headers.get).toHaveBeenCalled();
      expect(data).toEqual({});
    });

    it('returns empty object when content-type is not JSON', async () => {
      const res = makeResponse({ status: 200, ok: true, contentType: 'text/plain' });

      const data = await handleResponse(res);

      expect(res.headers.get).toHaveBeenCalled();
      expect(data).toEqual({});
    });

    it('returns parsed JSON when response is ok and JSON is valid', async () => {
      const payload = { success: true };
      const res = makeResponse({ status: 200, ok: true, jsonData: payload });

      const data = await handleResponse(res);

      expect(res.json).toHaveBeenCalled();
      expect(data).toEqual(payload);
    });

    it('returns empty object when JSON parsing fails but response is ok', async () => {
      const res = makeResponse({ status: 200, ok: true, jsonThrows: true });

      const data = await handleResponse(res);

      expect(res.json).toHaveBeenCalled();
      expect(data).toEqual({});
    });

    it('throws structured error for non-auth failure with message from payload', async () => {
      const payload = { message: 'Bad Request' };
      const res = makeResponse({ status: 400, ok: false, jsonData: payload });

      await expect(handleResponse(res)).rejects.toEqual({
        status: 400,
        message: 'Bad Request',
        data: payload,
      });
      expect(removeItemMock).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('on 401 clears jwt from localStorage and throws error object', async () => {
      const payload = { message: 'Unauthorized' };
      const res = makeResponse({ status: 401, ok: false, jsonData: payload });

      await expect(handleResponse(res)).rejects.toEqual({
        status: 401,
        message: 'Unauthorized',
        data: payload,
      });
      expect(removeItemMock).toHaveBeenCalledWith('jwt');
      expect(consoleWarnSpy).toHaveBeenCalledWith('Authentication failed: Token expired or invalid');
    });

    it('on 403 warns but does not clear jwt and throws error object', async () => {
      const payload = { message: 'Forbidden' };
      const res = makeResponse({ status: 403, ok: false, jsonData: payload });

      await expect(handleResponse(res)).rejects.toEqual({
        status: 403,
        message: 'Forbidden',
        data: payload,
      });
      expect(removeItemMock).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith('Access forbidden: Insufficient permissions');
    });

    it('falls back to generic message when payload has no message fields', async () => {
      const payload = { foo: 'bar' };
      const res = makeResponse({ status: 500, ok: false, jsonData: payload });

      await expect(handleResponse(res)).rejects.toEqual({
        status: 500,
        message: 'Request failed',
        data: payload,
      });
    });
  });

  describe('getAuthHeader', () => {
    it('returns Authorization header with token from localStorage', () => {
      getItemMock.mockReturnValue('test-token');

      const headers = getAuthHeader();

      expect(getItemMock).toHaveBeenCalledWith('jwt');
      expect(headers).toEqual({
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/json',
      });
    });
  });

  describe('getAuthUrl', () => {
    it('appends token with ? when URL has no query params', () => {
      getItemMock.mockReturnValue('abc123');

      const url = getAuthUrl('http://example.com/stream');

      expect(getItemMock).toHaveBeenCalledWith('jwt');
      expect(url).toBe('http://example.com/stream?token=abc123');
    });

    it('appends token with & when URL already has query params', () => {
      getItemMock.mockReturnValue('xyz');

      const url = getAuthUrl('http://example.com/stream?foo=bar');

      expect(getItemMock).toHaveBeenCalledWith('jwt');
      expect(url).toBe('http://example.com/stream?foo=bar&token=xyz');
    });
  });
});
