// @ts-nocheck
// Simple in-memory rate limiter for chat requests
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
export class RateLimiter {
  constructor() {
    if (stryMutAct_9fa48("1995")) {
      {}
    } else {
      stryCov_9fa48("1995");
      this.requests = new Map(); // userId -> { count, resetTime }
      this.windowMs = stryMutAct_9fa48("1996") ? 60 / 1000 : (stryCov_9fa48("1996"), 60 * 1000); // 1 minute window
      this.maxRequests = 10; // 10 requests per minute per user

      // Clean up old entries every 5 minutes
      setInterval(stryMutAct_9fa48("1997") ? () => undefined : (stryCov_9fa48("1997"), () => this.cleanup()), stryMutAct_9fa48("1998") ? 5 * 60 / 1000 : (stryCov_9fa48("1998"), (stryMutAct_9fa48("1999") ? 5 / 60 : (stryCov_9fa48("1999"), 5 * 60)) * 1000));
    }
  }
  isAllowed(userId) {
    if (stryMutAct_9fa48("2000")) {
      {}
    } else {
      stryCov_9fa48("2000");
      const now = Date.now();
      const userKey = userId.toString();
      if (stryMutAct_9fa48("2003") ? false : stryMutAct_9fa48("2002") ? true : stryMutAct_9fa48("2001") ? this.requests.has(userKey) : (stryCov_9fa48("2001", "2002", "2003"), !this.requests.has(userKey))) {
        if (stryMutAct_9fa48("2004")) {
          {}
        } else {
          stryCov_9fa48("2004");
          this.requests.set(userKey, stryMutAct_9fa48("2005") ? {} : (stryCov_9fa48("2005"), {
            count: 1,
            resetTime: stryMutAct_9fa48("2006") ? now - this.windowMs : (stryCov_9fa48("2006"), now + this.windowMs)
          }));
          return stryMutAct_9fa48("2007") ? {} : (stryCov_9fa48("2007"), {
            allowed: stryMutAct_9fa48("2008") ? false : (stryCov_9fa48("2008"), true),
            remaining: stryMutAct_9fa48("2009") ? this.maxRequests + 1 : (stryCov_9fa48("2009"), this.maxRequests - 1)
          });
        }
      }
      const userRequests = this.requests.get(userKey);

      // Reset if window has expired
      if (stryMutAct_9fa48("2013") ? now < userRequests.resetTime : stryMutAct_9fa48("2012") ? now > userRequests.resetTime : stryMutAct_9fa48("2011") ? false : stryMutAct_9fa48("2010") ? true : (stryCov_9fa48("2010", "2011", "2012", "2013"), now >= userRequests.resetTime)) {
        if (stryMutAct_9fa48("2014")) {
          {}
        } else {
          stryCov_9fa48("2014");
          userRequests.count = 1;
          userRequests.resetTime = stryMutAct_9fa48("2015") ? now - this.windowMs : (stryCov_9fa48("2015"), now + this.windowMs);
          return stryMutAct_9fa48("2016") ? {} : (stryCov_9fa48("2016"), {
            allowed: stryMutAct_9fa48("2017") ? false : (stryCov_9fa48("2017"), true),
            remaining: stryMutAct_9fa48("2018") ? this.maxRequests + 1 : (stryCov_9fa48("2018"), this.maxRequests - 1)
          });
        }
      }

      // Check if limit exceeded
      if (stryMutAct_9fa48("2022") ? userRequests.count < this.maxRequests : stryMutAct_9fa48("2021") ? userRequests.count > this.maxRequests : stryMutAct_9fa48("2020") ? false : stryMutAct_9fa48("2019") ? true : (stryCov_9fa48("2019", "2020", "2021", "2022"), userRequests.count >= this.maxRequests)) {
        if (stryMutAct_9fa48("2023")) {
          {}
        } else {
          stryCov_9fa48("2023");
          return stryMutAct_9fa48("2024") ? {} : (stryCov_9fa48("2024"), {
            allowed: stryMutAct_9fa48("2025") ? true : (stryCov_9fa48("2025"), false),
            remaining: 0,
            resetTime: userRequests.resetTime
          });
        }
      }

      // Increment count
      stryMutAct_9fa48("2026") ? userRequests.count-- : (stryCov_9fa48("2026"), userRequests.count++);
      return stryMutAct_9fa48("2027") ? {} : (stryCov_9fa48("2027"), {
        allowed: stryMutAct_9fa48("2028") ? false : (stryCov_9fa48("2028"), true),
        remaining: stryMutAct_9fa48("2029") ? this.maxRequests + userRequests.count : (stryCov_9fa48("2029"), this.maxRequests - userRequests.count)
      });
    }
  }
  cleanup() {
    if (stryMutAct_9fa48("2030")) {
      {}
    } else {
      stryCov_9fa48("2030");
      const now = Date.now();
      for (const [userId, data] of this.requests.entries()) {
        if (stryMutAct_9fa48("2031")) {
          {}
        } else {
          stryCov_9fa48("2031");
          if (stryMutAct_9fa48("2035") ? now < data.resetTime : stryMutAct_9fa48("2034") ? now > data.resetTime : stryMutAct_9fa48("2033") ? false : stryMutAct_9fa48("2032") ? true : (stryCov_9fa48("2032", "2033", "2034", "2035"), now >= data.resetTime)) {
            if (stryMutAct_9fa48("2036")) {
              {}
            } else {
              stryCov_9fa48("2036");
              this.requests.delete(userId);
            }
          }
        }
      }
    }
  }
}
const rateLimiter = new RateLimiter();
export const chatRateLimit = (req, res, next) => {
  if (stryMutAct_9fa48("2037")) {
    {}
  } else {
    stryCov_9fa48("2037");
    if (stryMutAct_9fa48("2040") ? !req.user && !req.user.id : stryMutAct_9fa48("2039") ? false : stryMutAct_9fa48("2038") ? true : (stryCov_9fa48("2038", "2039", "2040"), (stryMutAct_9fa48("2041") ? req.user : (stryCov_9fa48("2041"), !req.user)) || (stryMutAct_9fa48("2042") ? req.user.id : (stryCov_9fa48("2042"), !req.user.id)))) {
      if (stryMutAct_9fa48("2043")) {
        {}
      } else {
        stryCov_9fa48("2043");
        return res.status(401).json(stryMutAct_9fa48("2044") ? {} : (stryCov_9fa48("2044"), {
          success: stryMutAct_9fa48("2045") ? true : (stryCov_9fa48("2045"), false),
          error: stryMutAct_9fa48("2046") ? "" : (stryCov_9fa48("2046"), 'unauthorized'),
          message: stryMutAct_9fa48("2047") ? "" : (stryCov_9fa48("2047"), 'Authentication required')
        }));
      }
    }
    const result = rateLimiter.isAllowed(req.user.id);

    // Add rate limit headers
    res.set(stryMutAct_9fa48("2048") ? {} : (stryCov_9fa48("2048"), {
      'X-RateLimit-Limit': rateLimiter.maxRequests,
      'X-RateLimit-Remaining': result.remaining,
      'X-RateLimit-Window': rateLimiter.windowMs
    }));
    if (stryMutAct_9fa48("2051") ? false : stryMutAct_9fa48("2050") ? true : stryMutAct_9fa48("2049") ? result.allowed : (stryCov_9fa48("2049", "2050", "2051"), !result.allowed)) {
      if (stryMutAct_9fa48("2052")) {
        {}
      } else {
        stryCov_9fa48("2052");
        const retryAfter = Math.ceil(stryMutAct_9fa48("2053") ? (result.resetTime - Date.now()) * 1000 : (stryCov_9fa48("2053"), (stryMutAct_9fa48("2054") ? result.resetTime + Date.now() : (stryCov_9fa48("2054"), result.resetTime - Date.now())) / 1000));
        res.set(stryMutAct_9fa48("2055") ? "" : (stryCov_9fa48("2055"), 'Retry-After'), retryAfter);
        return res.status(429).json(stryMutAct_9fa48("2056") ? {} : (stryCov_9fa48("2056"), {
          success: stryMutAct_9fa48("2057") ? true : (stryCov_9fa48("2057"), false),
          error: stryMutAct_9fa48("2058") ? "" : (stryCov_9fa48("2058"), 'rate_limit'),
          message: stryMutAct_9fa48("2059") ? "" : (stryCov_9fa48("2059"), 'You\'re chatting too quickly. Please wait a few seconds.'),
          retryAfter
        }));
      }
    }
    next();
  }
};