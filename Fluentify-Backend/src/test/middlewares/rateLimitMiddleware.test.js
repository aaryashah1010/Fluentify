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
    expect(res.json).toHaveBeenCalled();
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

  it('blocks when over the limit and sets Retry-After', () => {
    const req = { user: { id: 999 } };
    const res = createRes();
    const next = createNext();

    // Hit the limiter many times quickly to exceed maxRequests
    for (let i = 0; i < 15; i++) {
      chatRateLimit(req, res, jest.fn());
    }

    // Last call should be rate limited
    const res2 = createRes();
    const next2 = createNext();
    chatRateLimit(req, res2, next2);
    expect(res2.status).toHaveBeenCalledWith(429);
    expect(res2.headers['Retry-After']).toBeDefined();
    expect(next2).not.toHaveBeenCalled();
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
    const intervalSpy = jest.spyOn(global, 'setInterval').mockImplementation((cb) => {
      // Immediately invoke the scheduled callback once for coverage
      cb();
      return 0;
    });

    const limiter = new RateLimiter();
    expect(intervalSpy).toHaveBeenCalled();

    intervalSpy.mockRestore();
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
});
