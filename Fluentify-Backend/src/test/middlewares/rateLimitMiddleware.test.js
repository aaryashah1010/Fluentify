import { jest } from '@jest/globals';

const rateModule = await import('../../middlewares/rateLimitMiddleware.js');
const { chatRateLimit, RateLimiter } = rateModule;

function createRes() {
  const res = {};
  res.statusCode = 200;
  res.headers = {};
  res.status = jest.fn().mockImplementation((code) => { res.statusCode = code; return res; });
  res.json = jest.fn().mockImplementation((body) => { res.body = body; return res; });
  res.set = jest.fn().mockImplementation((arg1, arg2) => {
    if (typeof arg1 === 'string') {
      res.headers[arg1] = arg2;
    } else {
      Object.assign(res.headers, arg1);
    }
    return res;
  });
  return res;
}

function createNext() { return jest.fn(); }

describe('chatRateLimit', () => {
  it('returns 401 when req.user missing', () => {
    const req = { user: null };
    const res = createRes();
    const next = createNext();
    chatRateLimit(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'unauthorized',
      message: 'Authentication required',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('allows requests within limit and sets headers', () => {
    const req = { user: { id: 1 } };
    const res = createRes();
    const next = createNext();

    chatRateLimit(req, res, next);
    expect(res.headers['X-RateLimit-Limit']).toBeDefined();
    expect(res.headers['X-RateLimit-Remaining']).toBeDefined();
    expect(next).toHaveBeenCalled();
  });

  it('blocks when over the limit and sets Retry-After with correct payload', () => {
    const req = { user: { id: 999 } };
    const next = createNext();
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1000);

    // Hit the limiter many times quickly to exceed maxRequests
    for (let i = 0; i < 15; i++) {
      const interimRes = createRes();
      chatRateLimit(req, interimRes, jest.fn());
    }

    // Final call should be rate limited
    const res2 = createRes();
    chatRateLimit(req, res2, next);

    expect(res2.status).toHaveBeenCalledWith(429);
    expect(res2.headers['Retry-After']).toBeDefined();
    expect(res2.body).toMatchObject({
      success: false,
      error: 'rate_limit',
      message: 'You\'re chatting too quickly. Please wait a few seconds.',
      retryAfter: expect.any(Number),
    });
    expect(res2.body.retryAfter).toBe(res2.headers['Retry-After']);
    expect(res2.body.retryAfter).toBe(60);
    expect(next).not.toHaveBeenCalled();

    nowSpy.mockRestore();
  });

  it('resets window after expiry for same user', () => {
    const req = { user: { id: 777 } };
    const res1 = createRes();
    const next1 = createNext();

    const nowSpy = jest.spyOn(Date, 'now');
    nowSpy.mockReturnValue(0);
    chatRateLimit(req, res1, next1); // first hit, creates entry

    // advance beyond windowMs (60s)
    nowSpy.mockReturnValue(61_000);
    const res2 = createRes();
    const next2 = createNext();
    chatRateLimit(req, res2, next2);

    expect(res2.headers['X-RateLimit-Remaining']).toBeDefined();
    nowSpy.mockRestore();
  });

  it('keeps non-expired entries in requests map', () => {
    const limiter = new RateLimiter();
    const nowSpy = jest.spyOn(Date, 'now');

    // At time 0, create an entry
    nowSpy.mockReturnValue(0);
    limiter.isAllowed(1);
    expect(limiter.requests.size).toBe(1);

    // Move time forward, but not past resetTime (windowMs)
    nowSpy.mockReturnValue(limiter.windowMs - 1);
    limiter.cleanup();

    // Entry should still be present
    expect(limiter.requests.size).toBe(1);

    nowSpy.mockRestore();
  });
});

describe('RateLimiter constructor interval callback', () => {
  it('registers cleanup interval and allows callback to run', () => {
    const cleanupSpy = jest.spyOn(RateLimiter.prototype, 'cleanup');
    const intervalSpy = jest.spyOn(global, 'setInterval').mockImplementation((cb, delay) => {
      // Immediately invoke the scheduled callback once for coverage
      cb();
      return 0;
    });

    const limiter = new RateLimiter();
    expect(intervalSpy).toHaveBeenCalledWith(expect.any(Function), 5 * 60 * 1000);
    expect(cleanupSpy).toHaveBeenCalled();

    intervalSpy.mockRestore();
    cleanupSpy.mockRestore();
  });
});

describe('RateLimiter.isAllowed', () => {
  it('returns allowed true and correct remaining on first request', () => {
    const limiter = new RateLimiter();
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(0);

    const result = limiter.isAllowed(1);

    expect(result).toEqual({
      allowed: true,
      remaining: limiter.maxRequests - 1,
    });

    const stored = limiter.requests.get('1');
    expect(stored).toBeDefined();
    expect(stored.count).toBe(1);
    expect(stored.resetTime).toBe(limiter.windowMs);

    nowSpy.mockRestore();
  });

  it('resets window and count when window has expired (now equals resetTime)', () => {
    const limiter = new RateLimiter();
    const nowSpy = jest.spyOn(Date, 'now');

    nowSpy.mockReturnValue(0);
    const first = limiter.isAllowed(1);
    expect(first).toEqual({
      allowed: true,
      remaining: limiter.maxRequests - 1,
    });

    // Move time exactly to resetTime boundary
    nowSpy.mockReturnValue(limiter.windowMs);
    const second = limiter.isAllowed(1);

    expect(second).toEqual({
      allowed: true,
      remaining: limiter.maxRequests - 1,
    });

    const stored = limiter.requests.get('1');
    expect(stored.count).toBe(1);
    expect(stored.resetTime).toBe(limiter.windowMs * 2);

    nowSpy.mockRestore();
  });

  it('returns not allowed with remaining 0 when maxRequests exceeded', () => {
    const limiter = new RateLimiter();
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(0);

    // First maxRequests calls should be allowed
    for (let i = 0; i < limiter.maxRequests; i++) {
      const res = limiter.isAllowed(1);
      expect(res.allowed).toBe(true);
    }

    // Next call should be blocked
    const blocked = limiter.isAllowed(1);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetTime).toBeDefined();

    nowSpy.mockRestore();
  });
});

describe('RateLimiter.cleanup', () => {
  it('removes expired entries from requests map', () => {
    const limiter = new RateLimiter();
    const nowSpy = jest.spyOn(Date, 'now');

    nowSpy.mockReturnValue(0);
    limiter.isAllowed(1); // creates entry
    expect(limiter.requests.size).toBe(1);

    nowSpy.mockReturnValue(limiter.windowMs + 1);
    limiter.cleanup();
    expect(limiter.requests.size).toBe(0);

    nowSpy.mockRestore();
  });

  it('removes entries when now equals resetTime boundary', () => {
    const limiter = new RateLimiter();
    const nowSpy = jest.spyOn(Date, 'now');

    nowSpy.mockReturnValue(0);
    limiter.isAllowed(1); // creates entry with resetTime = windowMs
    expect(limiter.requests.size).toBe(1);

    nowSpy.mockReturnValue(limiter.windowMs);
    limiter.cleanup();
    expect(limiter.requests.size).toBe(0);

    nowSpy.mockRestore();
  });
});
