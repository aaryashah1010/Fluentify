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
const JWT_EXPIRES_IN = stryMutAct_9fa48("3973") ? process.env.JWT_EXPIRES_IN && '2h' : stryMutAct_9fa48("3972") ? false : stryMutAct_9fa48("3971") ? true : (stryCov_9fa48("3971", "3972", "3973"), process.env.JWT_EXPIRES_IN || (stryMutAct_9fa48("3974") ? "" : (stryCov_9fa48("3974"), '2h')));
const JWT_REFRESH_EXPIRES_IN = stryMutAct_9fa48("3977") ? process.env.JWT_REFRESH_EXPIRES_IN && '7d' : stryMutAct_9fa48("3976") ? false : stryMutAct_9fa48("3975") ? true : (stryCov_9fa48("3975", "3976", "3977"), process.env.JWT_REFRESH_EXPIRES_IN || (stryMutAct_9fa48("3978") ? "" : (stryCov_9fa48("3978"), '7d')));

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
  if (stryMutAct_9fa48("3979")) {
    {}
  } else {
    stryCov_9fa48("3979");
    if (stryMutAct_9fa48("3982") ? false : stryMutAct_9fa48("3981") ? true : stryMutAct_9fa48("3980") ? JWT_SECRET : (stryCov_9fa48("3980", "3981", "3982"), !JWT_SECRET)) {
      if (stryMutAct_9fa48("3983")) {
        {}
      } else {
        stryCov_9fa48("3983");
        throw new Error(stryMutAct_9fa48("3984") ? "" : (stryCov_9fa48("3984"), 'JWT_SECRET is not set'));
      }
    }
    const payload = stryMutAct_9fa48("3985") ? {} : (stryCov_9fa48("3985"), {
      id: user.id,
      email: user.email,
      role: user.role,
      hasPreferences: stryMutAct_9fa48("3988") ? user.hasPreferences && false : stryMutAct_9fa48("3987") ? false : stryMutAct_9fa48("3986") ? true : (stryCov_9fa48("3986", "3987", "3988"), user.hasPreferences || (stryMutAct_9fa48("3989") ? true : (stryCov_9fa48("3989"), false)))
    });
    const token = jwt.sign(payload, JWT_SECRET, stryMutAct_9fa48("3990") ? {} : (stryCov_9fa48("3990"), {
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
  if (stryMutAct_9fa48("3991")) {
    {}
  } else {
    stryCov_9fa48("3991");
    if (stryMutAct_9fa48("3994") ? false : stryMutAct_9fa48("3993") ? true : stryMutAct_9fa48("3992") ? JWT_SECRET : (stryCov_9fa48("3992", "3993", "3994"), !JWT_SECRET)) {
      if (stryMutAct_9fa48("3995")) {
        {}
      } else {
        stryCov_9fa48("3995");
        throw new Error(stryMutAct_9fa48("3996") ? "" : (stryCov_9fa48("3996"), 'JWT_SECRET is not set'));
      }
    }
    const payload = stryMutAct_9fa48("3997") ? {} : (stryCov_9fa48("3997"), {
      id: user.id,
      email: user.email,
      role: user.role
    });
    const token = jwt.sign(payload, JWT_SECRET, stryMutAct_9fa48("3998") ? {} : (stryCov_9fa48("3998"), {
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
  if (stryMutAct_9fa48("3999")) {
    {}
  } else {
    stryCov_9fa48("3999");
    if (stryMutAct_9fa48("4002") ? false : stryMutAct_9fa48("4001") ? true : stryMutAct_9fa48("4000") ? JWT_SECRET : (stryCov_9fa48("4000", "4001", "4002"), !JWT_SECRET)) {
      if (stryMutAct_9fa48("4003")) {
        {}
      } else {
        stryCov_9fa48("4003");
        throw new Error(stryMutAct_9fa48("4004") ? "" : (stryCov_9fa48("4004"), 'JWT_SECRET is not set'));
      }
    }
    try {
      if (stryMutAct_9fa48("4005")) {
        {}
      } else {
        stryCov_9fa48("4005");
        const decoded = jwt.verify(token, JWT_SECRET);
        if (stryMutAct_9fa48("4008") ? typeof decoded !== 'string' : stryMutAct_9fa48("4007") ? false : stryMutAct_9fa48("4006") ? true : (stryCov_9fa48("4006", "4007", "4008"), typeof decoded === (stryMutAct_9fa48("4009") ? "" : (stryCov_9fa48("4009"), 'string')))) {
          if (stryMutAct_9fa48("4010")) {
            {}
          } else {
            stryCov_9fa48("4010");
            throw new Error(stryMutAct_9fa48("4011") ? "" : (stryCov_9fa48("4011"), 'Invalid token'));
          }
        }
        return decoded;
      }
    } catch (error) {
      if (stryMutAct_9fa48("4012")) {
        {}
      } else {
        stryCov_9fa48("4012");
        if (stryMutAct_9fa48("4015") ? error.name !== 'TokenExpiredError' : stryMutAct_9fa48("4014") ? false : stryMutAct_9fa48("4013") ? true : (stryCov_9fa48("4013", "4014", "4015"), error.name === (stryMutAct_9fa48("4016") ? "" : (stryCov_9fa48("4016"), 'TokenExpiredError')))) {
          if (stryMutAct_9fa48("4017")) {
            {}
          } else {
            stryCov_9fa48("4017");
            throw new Error(stryMutAct_9fa48("4018") ? "" : (stryCov_9fa48("4018"), 'Token expired'));
          }
        }
        if (stryMutAct_9fa48("4021") ? error.name !== 'JsonWebTokenError' : stryMutAct_9fa48("4020") ? false : stryMutAct_9fa48("4019") ? true : (stryCov_9fa48("4019", "4020", "4021"), error.name === (stryMutAct_9fa48("4022") ? "" : (stryCov_9fa48("4022"), 'JsonWebTokenError')))) {
          if (stryMutAct_9fa48("4023")) {
            {}
          } else {
            stryCov_9fa48("4023");
            throw new Error(stryMutAct_9fa48("4024") ? "" : (stryCov_9fa48("4024"), 'Invalid token'));
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
  if (stryMutAct_9fa48("4025")) {
    {}
  } else {
    stryCov_9fa48("4025");
    if (stryMutAct_9fa48("4028") ? false : stryMutAct_9fa48("4027") ? true : stryMutAct_9fa48("4026") ? JWT_SECRET : (stryCov_9fa48("4026", "4027", "4028"), !JWT_SECRET)) {
      if (stryMutAct_9fa48("4029")) {
        {}
      } else {
        stryCov_9fa48("4029");
        throw new Error(stryMutAct_9fa48("4030") ? "" : (stryCov_9fa48("4030"), 'JWT_SECRET is not set'));
      }
    }
    try {
      if (stryMutAct_9fa48("4031")) {
        {}
      } else {
        stryCov_9fa48("4031");
        const decoded = jwt.verify(token, JWT_SECRET);
        if (stryMutAct_9fa48("4034") ? typeof decoded !== 'string' : stryMutAct_9fa48("4033") ? false : stryMutAct_9fa48("4032") ? true : (stryCov_9fa48("4032", "4033", "4034"), typeof decoded === (stryMutAct_9fa48("4035") ? "" : (stryCov_9fa48("4035"), 'string')))) {
          if (stryMutAct_9fa48("4036")) {
            {}
          } else {
            stryCov_9fa48("4036");
            throw new Error(stryMutAct_9fa48("4037") ? "" : (stryCov_9fa48("4037"), 'Invalid token'));
          }
        }
        return decoded;
      }
    } catch (error) {
      if (stryMutAct_9fa48("4038")) {
        {}
      } else {
        stryCov_9fa48("4038");
        if (stryMutAct_9fa48("4041") ? error.name !== 'TokenExpiredError' : stryMutAct_9fa48("4040") ? false : stryMutAct_9fa48("4039") ? true : (stryCov_9fa48("4039", "4040", "4041"), error.name === (stryMutAct_9fa48("4042") ? "" : (stryCov_9fa48("4042"), 'TokenExpiredError')))) {
          if (stryMutAct_9fa48("4043")) {
            {}
          } else {
            stryCov_9fa48("4043");
            throw new Error(stryMutAct_9fa48("4044") ? "" : (stryCov_9fa48("4044"), 'Token expired'));
          }
        }
        throw new Error(stryMutAct_9fa48("4045") ? "" : (stryCov_9fa48("4045"), 'Invalid token'));
      }
    }
  }
}
export { createAuthToken, createRefreshToken, decodeAuthToken, decodeRefreshToken };