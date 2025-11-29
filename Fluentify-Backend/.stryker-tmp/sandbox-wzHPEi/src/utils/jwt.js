// @ts-nocheck
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
import jwt from 'jsonwebtoken';
import { ERRORS } from './error.js';
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = stryMutAct_9fa48("3990") ? process.env.JWT_EXPIRES_IN && '2h' : stryMutAct_9fa48("3989") ? false : stryMutAct_9fa48("3988") ? true : (stryCov_9fa48("3988", "3989", "3990"), process.env.JWT_EXPIRES_IN || (stryMutAct_9fa48("3991") ? "" : (stryCov_9fa48("3991"), '2h')));
const JWT_REFRESH_EXPIRES_IN = stryMutAct_9fa48("3994") ? process.env.JWT_REFRESH_EXPIRES_IN && '7d' : stryMutAct_9fa48("3993") ? false : stryMutAct_9fa48("3992") ? true : (stryCov_9fa48("3992", "3993", "3994"), process.env.JWT_REFRESH_EXPIRES_IN || (stryMutAct_9fa48("3995") ? "" : (stryCov_9fa48("3995"), '7d')));

/**
 * Create authentication token
 * @param {Object} user - User data to encode in token
 * @param {number} user.id - User ID
 * @param {string} user.email - User email
 * @param {string} user.role - User role (learner/admin)
 * @param {boolean} [user.hasPreferences] - Whether user has set preferences
 * @returns {string} JWT token
 */
function createAuthToken(user) {
  if (stryMutAct_9fa48("3996")) {
    {}
  } else {
    stryCov_9fa48("3996");
    if (stryMutAct_9fa48("3999") ? false : stryMutAct_9fa48("3998") ? true : stryMutAct_9fa48("3997") ? JWT_SECRET : (stryCov_9fa48("3997", "3998", "3999"), !JWT_SECRET)) {
      if (stryMutAct_9fa48("4000")) {
        {}
      } else {
        stryCov_9fa48("4000");
        throw new Error(stryMutAct_9fa48("4001") ? "" : (stryCov_9fa48("4001"), 'JWT_SECRET is not set'));
      }
    }
    const payload = stryMutAct_9fa48("4002") ? {} : (stryCov_9fa48("4002"), {
      id: user.id,
      email: user.email,
      role: user.role,
      hasPreferences: stryMutAct_9fa48("4005") ? user.hasPreferences && false : stryMutAct_9fa48("4004") ? false : stryMutAct_9fa48("4003") ? true : (stryCov_9fa48("4003", "4004", "4005"), user.hasPreferences || (stryMutAct_9fa48("4006") ? true : (stryCov_9fa48("4006"), false)))
    });
    const token = jwt.sign(payload, JWT_SECRET, stryMutAct_9fa48("4007") ? {} : (stryCov_9fa48("4007"), {
      expiresIn: JWT_EXPIRES_IN
    }));
    return token;
  }
}

/**
 * Create refresh token
 * @param {Object} user - User data to encode in token
 * @returns {string} JWT refresh token
 */
function createRefreshToken(user) {
  if (stryMutAct_9fa48("4008")) {
    {}
  } else {
    stryCov_9fa48("4008");
    if (stryMutAct_9fa48("4011") ? false : stryMutAct_9fa48("4010") ? true : stryMutAct_9fa48("4009") ? JWT_SECRET : (stryCov_9fa48("4009", "4010", "4011"), !JWT_SECRET)) {
      if (stryMutAct_9fa48("4012")) {
        {}
      } else {
        stryCov_9fa48("4012");
        throw new Error(stryMutAct_9fa48("4013") ? "" : (stryCov_9fa48("4013"), 'JWT_SECRET is not set'));
      }
    }
    const payload = stryMutAct_9fa48("4014") ? {} : (stryCov_9fa48("4014"), {
      id: user.id,
      email: user.email,
      role: user.role
    });
    const token = jwt.sign(payload, JWT_SECRET, stryMutAct_9fa48("4015") ? {} : (stryCov_9fa48("4015"), {
      expiresIn: JWT_REFRESH_EXPIRES_IN
    }));
    return token;
  }
}

/**
 * Decode and verify authentication token
 * @param {string} token - JWT token to decode
 * @returns {Object} Decoded token data
 */
function decodeAuthToken(token) {
  if (stryMutAct_9fa48("4016")) {
    {}
  } else {
    stryCov_9fa48("4016");
    if (stryMutAct_9fa48("4019") ? false : stryMutAct_9fa48("4018") ? true : stryMutAct_9fa48("4017") ? JWT_SECRET : (stryCov_9fa48("4017", "4018", "4019"), !JWT_SECRET)) {
      if (stryMutAct_9fa48("4020")) {
        {}
      } else {
        stryCov_9fa48("4020");
        throw new Error(stryMutAct_9fa48("4021") ? "" : (stryCov_9fa48("4021"), 'JWT_SECRET is not set'));
      }
    }
    try {
      if (stryMutAct_9fa48("4022")) {
        {}
      } else {
        stryCov_9fa48("4022");
        const decoded = jwt.verify(token, JWT_SECRET);
        if (stryMutAct_9fa48("4025") ? typeof decoded !== 'string' : stryMutAct_9fa48("4024") ? false : stryMutAct_9fa48("4023") ? true : (stryCov_9fa48("4023", "4024", "4025"), typeof decoded === (stryMutAct_9fa48("4026") ? "" : (stryCov_9fa48("4026"), 'string')))) {
          if (stryMutAct_9fa48("4027")) {
            {}
          } else {
            stryCov_9fa48("4027");
            throw new Error(stryMutAct_9fa48("4028") ? "" : (stryCov_9fa48("4028"), 'Invalid token'));
          }
        }
        return decoded;
      }
    } catch (error) {
      if (stryMutAct_9fa48("4029")) {
        {}
      } else {
        stryCov_9fa48("4029");
        if (stryMutAct_9fa48("4032") ? error.name !== 'TokenExpiredError' : stryMutAct_9fa48("4031") ? false : stryMutAct_9fa48("4030") ? true : (stryCov_9fa48("4030", "4031", "4032"), error.name === (stryMutAct_9fa48("4033") ? "" : (stryCov_9fa48("4033"), 'TokenExpiredError')))) {
          if (stryMutAct_9fa48("4034")) {
            {}
          } else {
            stryCov_9fa48("4034");
            throw new Error(stryMutAct_9fa48("4035") ? "" : (stryCov_9fa48("4035"), 'Token expired'));
          }
        }
        if (stryMutAct_9fa48("4038") ? error.name !== 'JsonWebTokenError' : stryMutAct_9fa48("4037") ? false : stryMutAct_9fa48("4036") ? true : (stryCov_9fa48("4036", "4037", "4038"), error.name === (stryMutAct_9fa48("4039") ? "" : (stryCov_9fa48("4039"), 'JsonWebTokenError')))) {
          if (stryMutAct_9fa48("4040")) {
            {}
          } else {
            stryCov_9fa48("4040");
            throw new Error(stryMutAct_9fa48("4041") ? "" : (stryCov_9fa48("4041"), 'Invalid token'));
          }
        }
        throw error;
      }
    }
  }
}

/**
 * Decode and verify refresh token
 * @param {string} token - JWT refresh token to decode
 * @returns {Object} Decoded token data
 */
function decodeRefreshToken(token) {
  if (stryMutAct_9fa48("4042")) {
    {}
  } else {
    stryCov_9fa48("4042");
    if (stryMutAct_9fa48("4045") ? false : stryMutAct_9fa48("4044") ? true : stryMutAct_9fa48("4043") ? JWT_SECRET : (stryCov_9fa48("4043", "4044", "4045"), !JWT_SECRET)) {
      if (stryMutAct_9fa48("4046")) {
        {}
      } else {
        stryCov_9fa48("4046");
        throw new Error(stryMutAct_9fa48("4047") ? "" : (stryCov_9fa48("4047"), 'JWT_SECRET is not set'));
      }
    }
    try {
      if (stryMutAct_9fa48("4048")) {
        {}
      } else {
        stryCov_9fa48("4048");
        const decoded = jwt.verify(token, JWT_SECRET);
        if (stryMutAct_9fa48("4051") ? typeof decoded !== 'string' : stryMutAct_9fa48("4050") ? false : stryMutAct_9fa48("4049") ? true : (stryCov_9fa48("4049", "4050", "4051"), typeof decoded === (stryMutAct_9fa48("4052") ? "" : (stryCov_9fa48("4052"), 'string')))) {
          if (stryMutAct_9fa48("4053")) {
            {}
          } else {
            stryCov_9fa48("4053");
            throw new Error(stryMutAct_9fa48("4054") ? "" : (stryCov_9fa48("4054"), 'Invalid token'));
          }
        }
        return decoded;
      }
    } catch (error) {
      if (stryMutAct_9fa48("4055")) {
        {}
      } else {
        stryCov_9fa48("4055");
        if (stryMutAct_9fa48("4058") ? error.name !== 'TokenExpiredError' : stryMutAct_9fa48("4057") ? false : stryMutAct_9fa48("4056") ? true : (stryCov_9fa48("4056", "4057", "4058"), error.name === (stryMutAct_9fa48("4059") ? "" : (stryCov_9fa48("4059"), 'TokenExpiredError')))) {
          if (stryMutAct_9fa48("4060")) {
            {}
          } else {
            stryCov_9fa48("4060");
            throw new Error(stryMutAct_9fa48("4061") ? "" : (stryCov_9fa48("4061"), 'Token expired'));
          }
        }
        throw new Error(stryMutAct_9fa48("4062") ? "" : (stryCov_9fa48("4062"), 'Invalid token'));
      }
    }
  }
}
export { createAuthToken, createRefreshToken, decodeAuthToken, decodeRefreshToken };