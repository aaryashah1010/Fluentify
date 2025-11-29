// @ts-nocheck
// Simple in-memory rate limiter for chat requests
export class RateLimiter {
  constructor() {
    this.requests = new Map(); // userId -> { count, resetTime }
    this.windowMs = 60 * 1000; // 1 minute window
    this.maxRequests = 10; // 10 requests per minute per user
    
    // Clean up old entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  isAllowed(userId) {
    const now = Date.now();
    const userKey = userId.toString();
    
    if (!this.requests.has(userKey)) {
      this.requests.set(userKey, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return { allowed: true, remaining: this.maxRequests - 1 };
    }

    const userRequests = this.requests.get(userKey);
    
    // Reset if window has expired
    if (now >= userRequests.resetTime) {
      userRequests.count = 1;
      userRequests.resetTime = now + this.windowMs;
      return { allowed: true, remaining: this.maxRequests - 1 };
    }

    // Check if limit exceeded
    if (userRequests.count >= this.maxRequests) {
      return { 
        allowed: false, 
        remaining: 0,
        resetTime: userRequests.resetTime 
      };
    }

    // Increment count
    userRequests.count++;
    return { 
      allowed: true, 
      remaining: this.maxRequests - userRequests.count 
    };
  }

  cleanup() {
    const now = Date.now();
    for (const [userId, data] of this.requests.entries()) {
      if (now >= data.resetTime) {
        this.requests.delete(userId);
      }
    }
  }
}

const rateLimiter = new RateLimiter();

export const chatRateLimit = (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      success: false,
      error: 'unauthorized',
      message: 'Authentication required'
    });
  }

  const result = rateLimiter.isAllowed(req.user.id);
  
  // Add rate limit headers
  res.set({
    'X-RateLimit-Limit': rateLimiter.maxRequests,
    'X-RateLimit-Remaining': result.remaining,
    'X-RateLimit-Window': rateLimiter.windowMs
  });

  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
    res.set('Retry-After', retryAfter);
    
    return res.status(429).json({
      success: false,
      error: 'rate_limit',
      message: 'You\'re chatting too quickly. Please wait a few seconds.',
      retryAfter
    });
  }

  next();
};
