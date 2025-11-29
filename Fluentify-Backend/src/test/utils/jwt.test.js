import { jest } from '@jest/globals';

// Mock jsonwebtoken
const signMock = jest.fn();
const verifyMock = jest.fn();
await jest.unstable_mockModule('jsonwebtoken', () => ({ default: { sign: signMock, verify: verifyMock } }));

// Helper to (re)import module with env
async function importJwtWithEnv(secret = 'secret', overrides = {}) {
  jest.resetModules();
  if (secret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = secret;
  }
  process.env.JWT_EXPIRES_IN = overrides.JWT_EXPIRES_IN || '2h';
  process.env.JWT_REFRESH_EXPIRES_IN = overrides.JWT_REFRESH_EXPIRES_IN || '7d';
  return await import('../../utils/jwt.js');
}

describe('utils/jwt', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('decodeAuthToken throws when decoded is a string', async () => {
    const { decodeAuthToken } = await importJwtWithEnv('abc');
    verifyMock.mockReturnValueOnce('string-decoded');
    expect(() => decodeAuthToken('x')).toThrow('Invalid token');
  });

  it('decodeAuthToken rethrows unknown errors', async () => {
    const { decodeAuthToken } = await importJwtWithEnv('abc');
    verifyMock.mockImplementationOnce(() => { throw new Error('other'); });
    expect(() => decodeAuthToken('x')).toThrow('other');
  });

  it('createAuthToken signs payload with expiry', async () => {
    const { createAuthToken } = await importJwtWithEnv('abc');
    signMock.mockReturnValueOnce('token');
    const t = createAuthToken({ id: 1, email: 'e@mail.com', role: 'learner', hasPreferences: true });
    expect(signMock).toHaveBeenCalled();
    expect(t).toBe('token');
  });

  it('createAuthToken defaults hasPreferences to false and uses default expiresIn', async () => {
    const { createAuthToken } = await importJwtWithEnv('abc');
    signMock.mockReturnValueOnce('token-default');
    const t = createAuthToken({ id: 2, email: 'b@mail.com', role: 'admin' });
    expect(t).toBe('token-default');
    const [payload, , options] = signMock.mock.calls[0];
    expect(payload.hasPreferences).toBe(false);
    expect(options).toEqual({ expiresIn: '2h' });
  });

  it('createAuthToken sets hasPreferences to true when flag provided', async () => {
    const { createAuthToken } = await importJwtWithEnv('abc');
    signMock.mockReturnValueOnce('token-has-pref');

    createAuthToken({ id: 5, email: 'hp@mail.com', role: 'learner', hasPreferences: true });

    const [payload, , options] = signMock.mock.calls[0];
    expect(payload.hasPreferences).toBe(true);
    expect(options).toEqual({ expiresIn: '2h' });
  });

  it('createRefreshToken signs payload with refresh expiry', async () => {
    const { createRefreshToken } = await importJwtWithEnv('abc', { JWT_REFRESH_EXPIRES_IN: '10d' });
    signMock.mockReturnValueOnce('refresh');
    const t = createRefreshToken({ id: 1, email: 'e@mail.com', role: 'admin' });
    expect(signMock).toHaveBeenCalled();
    expect(t).toBe('refresh');
  });

  it('createRefreshToken uses default refresh expiresIn when not overridden', async () => {
    const { createRefreshToken } = await importJwtWithEnv('abc');
    signMock.mockReturnValueOnce('refresh-default');
    const t = createRefreshToken({ id: 3, email: 'c@mail.com', role: 'learner' });
    expect(t).toBe('refresh-default');
    const [payload, , options] = signMock.mock.calls[0];
    expect(payload).toEqual({ id: 3, email: 'c@mail.com', role: 'learner' });
    expect(options).toEqual({ expiresIn: '7d' });
  });

  it('createAuthToken falls back to default JWT_EXPIRES_IN when env not set', async () => {
    jest.resetModules();
    process.env.JWT_SECRET = 'abc';
    delete process.env.JWT_EXPIRES_IN;
    // keep refresh expiry defined so only access token path uses fallback
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';

    const { createAuthToken } = await import('../../utils/jwt.js');
    signMock.mockReturnValueOnce('token-fallback');

    const t = createAuthToken({ id: 10, email: 'e@mail.com', role: 'learner' });
    expect(t).toBe('token-fallback');

    const [payload, , options] = signMock.mock.calls[0];
    expect(payload).toEqual({ id: 10, email: 'e@mail.com', role: 'learner', hasPreferences: false });
    expect(options).toEqual({ expiresIn: '2h' });
  });

  it('createRefreshToken falls back to default JWT_REFRESH_EXPIRES_IN when env not set', async () => {
    jest.resetModules();
    process.env.JWT_SECRET = 'abc';
    process.env.JWT_EXPIRES_IN = '2h';
    delete process.env.JWT_REFRESH_EXPIRES_IN;

    const { createRefreshToken } = await import('../../utils/jwt.js');
    signMock.mockReturnValueOnce('refresh-fallback');

    const t = createRefreshToken({ id: 11, email: 'd@mail.com', role: 'admin' });
    expect(t).toBe('refresh-fallback');

    const [payload, , options] = signMock.mock.calls[0];
    expect(payload).toEqual({ id: 11, email: 'd@mail.com', role: 'admin' });
    expect(options).toEqual({ expiresIn: '7d' });
  });

  it('decodeAuthToken returns decoded object', async () => {
    const { decodeAuthToken } = await importJwtWithEnv('abc');
    verifyMock.mockReturnValueOnce({ id: 1 });
    expect(decodeAuthToken('x')).toEqual({ id: 1 });
  });

  it('decodeAuthToken throws on TokenExpiredError', async () => {
    const { decodeAuthToken } = await importJwtWithEnv('abc');
    verifyMock.mockImplementationOnce(() => { const e = new Error('expired'); e.name = 'TokenExpiredError'; throw e; });
    expect(() => decodeAuthToken('x')).toThrow('Token expired');
  });

  it('decodeAuthToken throws on JsonWebTokenError as Invalid token', async () => {
    const { decodeAuthToken } = await importJwtWithEnv('abc');
    verifyMock.mockImplementationOnce(() => { const e = new Error('bad'); e.name = 'JsonWebTokenError'; throw e; });
    expect(() => decodeAuthToken('x')).toThrow('Invalid token');
  });

  it('decodeRefreshToken maps non-expired errors to Invalid token', async () => {
    const { decodeRefreshToken } = await importJwtWithEnv('abc');
    verifyMock.mockImplementationOnce(() => { const e = new Error('oops'); e.name = 'JsonWebTokenError'; throw e; });
    expect(() => decodeRefreshToken('x')).toThrow('Invalid token');
  });

  it('decodeRefreshToken returns decoded object', async () => {
    const { decodeRefreshToken } = await importJwtWithEnv('abc');
    verifyMock.mockReturnValueOnce({ id: 2 });
    expect(decodeRefreshToken('y')).toEqual({ id: 2 });
  });

  it('decodeRefreshToken throws Invalid token when decoded is string', async () => {
    const { decodeRefreshToken } = await importJwtWithEnv('abc');
    verifyMock.mockReturnValueOnce('raw-string');
    expect(() => decodeRefreshToken('x')).toThrow('Invalid token');
  });

  it('decodeRefreshToken throws Token expired on TokenExpiredError', async () => {
    const { decodeRefreshToken } = await importJwtWithEnv('abc');
    verifyMock.mockImplementationOnce(() => {
      const e = new Error('expired');
      e.name = 'TokenExpiredError';
      throw e;
    });
    expect(() => decodeRefreshToken('x')).toThrow('Token expired');
  });

  it('throws when JWT_SECRET not set', async () => {
    const { createAuthToken, createRefreshToken, decodeAuthToken, decodeRefreshToken } = await importJwtWithEnv('');
    expect(() => createAuthToken({ id: 1, email: 'e', role: 'r' })).toThrow('JWT_SECRET is not set');
    expect(() => createRefreshToken({ id: 1, email: 'e', role: 'r' })).toThrow('JWT_SECRET is not set');
    expect(() => decodeAuthToken('x')).toThrow('JWT_SECRET is not set');
    expect(() => decodeRefreshToken('x')).toThrow('JWT_SECRET is not set');
  });
});
