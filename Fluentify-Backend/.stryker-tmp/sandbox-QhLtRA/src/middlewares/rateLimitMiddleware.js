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
    if (stryMutAct_9fa48("95")) {
      {}
    } else {
      stryCov_9fa48("95");
      this.requests = new Map(); // userId -> { count, resetTime }
      this.windowMs = stryMutAct_9fa48("96") ? 60 / 1000 : (stryCov_9fa48("96"), 60 * 1000); // 1 minute window
      this.maxRequests = 10; // 10 requests per minute per user

      // Clean up old entries every 5 minutes
      setInterval(stryMutAct_9fa48("97") ? () => undefined : (stryCov_9fa48("97"), () => this.cleanup()), stryMutAct_9fa48("98") ? 5 * 60 / 1000 : (stryCov_9fa48("98"), (stryMutAct_9fa48("99") ? 5 / 60 : (stryCov_9fa48("99"), 5 * 60)) * 1000));
    }
  }
  isAllowed(userId) {
    if (stryMutAct_9fa48("100")) {
      {}
    } else {
      stryCov_9fa48("100");
      const now = Date.now();
      const userKey = userId.toString();
      if (stryMutAct_9fa48("103") ? false : stryMutAct_9fa48("102") ? true : stryMutAct_9fa48("101") ? this.requests.has(userKey) : (stryCov_9fa48("101", "102", "103"), !this.requests.has(userKey))) {
        if (stryMutAct_9fa48("104")) {
          {}
        } else {
          stryCov_9fa48("104");
          this.requests.set(userKey, stryMutAct_9fa48("105") ? {} : (stryCov_9fa48("105"), {
            count: 1,
            resetTime: stryMutAct_9fa48("106") ? now - this.windowMs : (stryCov_9fa48("106"), now + this.windowMs)
          }));
          return stryMutAct_9fa48("107") ? {} : (stryCov_9fa48("107"), {
            allowed: stryMutAct_9fa48("108") ? false : (stryCov_9fa48("108"), true),
            remaining: stryMutAct_9fa48("109") ? this.maxRequests + 1 : (stryCov_9fa48("109"), this.maxRequests - 1)
          });
        }
      }
      const userRequests = this.requests.get(userKey);

      // Reset if window has expired
      if (stryMutAct_9fa48("113") ? now < userRequests.resetTime : stryMutAct_9fa48("112") ? now > userRequests.resetTime : stryMutAct_9fa48("111") ? false : stryMutAct_9fa48("110") ? true : (stryCov_9fa48("110", "111", "112", "113"), now >= userRequests.resetTime)) {
        if (stryMutAct_9fa48("114")) {
          {}
        } else {
          stryCov_9fa48("114");
          userRequests.count = 1;
          userRequests.resetTime = stryMutAct_9fa48("115") ? now - this.windowMs : (stryCov_9fa48("115"), now + this.windowMs);
          return stryMutAct_9fa48("116") ? {} : (stryCov_9fa48("116"), {
            allowed: stryMutAct_9fa48("117") ? false : (stryCov_9fa48("117"), true),
            remaining: stryMutAct_9fa48("118") ? this.maxRequests + 1 : (stryCov_9fa48("118"), this.maxRequests - 1)
          });
        }
      }

      // Check if limit exceeded
      if (stryMutAct_9fa48("122") ? userRequests.count < this.maxRequests : stryMutAct_9fa48("121") ? userRequests.count > this.maxRequests : stryMutAct_9fa48("120") ? false : stryMutAct_9fa48("119") ? true : (stryCov_9fa48("119", "120", "121", "122"), userRequests.count >= this.maxRequests)) {
        if (stryMutAct_9fa48("123")) {
          {}
        } else {
          stryCov_9fa48("123");
          return stryMutAct_9fa48("124") ? {} : (stryCov_9fa48("124"), {
            allowed: stryMutAct_9fa48("125") ? true : (stryCov_9fa48("125"), false),
            remaining: 0,
            resetTime: userRequests.resetTime
          });
        }
      }

      // Increment count
      stryMutAct_9fa48("126") ? userRequests.count-- : (stryCov_9fa48("126"), userRequests.count++);
      return stryMutAct_9fa48("127") ? {} : (stryCov_9fa48("127"), {
        allowed: stryMutAct_9fa48("128") ? false : (stryCov_9fa48("128"), true),
        remaining: stryMutAct_9fa48("129") ? this.maxRequests + userRequests.count : (stryCov_9fa48("129"), this.maxRequests - userRequests.count)
      });
    }
  }
  cleanup() {
    if (stryMutAct_9fa48("130")) {
      {}
    } else {
      stryCov_9fa48("130");
      const now = Date.now();
      for (const [userId, data] of this.requests.entries()) {
        if (stryMutAct_9fa48("131")) {
          {}
        } else {
          stryCov_9fa48("131");
          if (stryMutAct_9fa48("135") ? now < data.resetTime : stryMutAct_9fa48("134") ? now > data.resetTime : stryMutAct_9fa48("133") ? false : stryMutAct_9fa48("132") ? true : (stryCov_9fa48("132", "133", "134", "135"), now >= data.resetTime)) {
            if (stryMutAct_9fa48("136")) {
              {}
            } else {
              stryCov_9fa48("136");
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
  if (stryMutAct_9fa48("137")) {
    {}
  } else {
    stryCov_9fa48("137");
    if (stryMutAct_9fa48("140") ? !req.user && !req.user.id : stryMutAct_9fa48("139") ? false : stryMutAct_9fa48("138") ? true : (stryCov_9fa48("138", "139", "140"), (stryMutAct_9fa48("141") ? req.user : (stryCov_9fa48("141"), !req.user)) || (stryMutAct_9fa48("142") ? req.user.id : (stryCov_9fa48("142"), !req.user.id)))) {
      if (stryMutAct_9fa48("143")) {
        {}
      } else {
        stryCov_9fa48("143");
        return res.status(401).json(stryMutAct_9fa48("144") ? {} : (stryCov_9fa48("144"), {
          success: stryMutAct_9fa48("145") ? true : (stryCov_9fa48("145"), false),
          error: stryMutAct_9fa48("146") ? "" : (stryCov_9fa48("146"), 'unauthorized'),
          message: stryMutAct_9fa48("147") ? "" : (stryCov_9fa48("147"), 'Authentication required')
        }));
      }
    }
    const result = rateLimiter.isAllowed(req.user.id);

    // Add rate limit headers
    res.set(stryMutAct_9fa48("148") ? {} : (stryCov_9fa48("148"), {
      'X-RateLimit-Limit': rateLimiter.maxRequests,
      'X-RateLimit-Remaining': result.remaining,
      'X-RateLimit-Window': rateLimiter.windowMs
    }));
    if (stryMutAct_9fa48("151") ? false : stryMutAct_9fa48("150") ? true : stryMutAct_9fa48("149") ? result.allowed : (stryCov_9fa48("149", "150", "151"), !result.allowed)) {
      if (stryMutAct_9fa48("152")) {
        {}
      } else {
        stryCov_9fa48("152");
        const retryAfter = Math.ceil(stryMutAct_9fa48("153") ? (result.resetTime - Date.now()) * 1000 : (stryCov_9fa48("153"), (stryMutAct_9fa48("154") ? result.resetTime + Date.now() : (stryCov_9fa48("154"), result.resetTime - Date.now())) / 1000));
        res.set(stryMutAct_9fa48("155") ? "" : (stryCov_9fa48("155"), 'Retry-After'), retryAfter);
        return res.status(429).json(stryMutAct_9fa48("156") ? {} : (stryCov_9fa48("156"), {
          success: stryMutAct_9fa48("157") ? true : (stryCov_9fa48("157"), false),
          error: stryMutAct_9fa48("158") ? "" : (stryCov_9fa48("158"), 'rate_limit'),
          message: stryMutAct_9fa48("159") ? "" : (stryCov_9fa48("159"), 'You\'re chatting too quickly. Please wait a few seconds.'),
          retryAfter
        }));
      }
    }
    next();
  }
};