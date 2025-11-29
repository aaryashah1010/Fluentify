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
const JWT_EXPIRES_IN = stryMutAct_9fa48("4396") ? process.env.JWT_EXPIRES_IN && '2h' : stryMutAct_9fa48("4395") ? false : stryMutAct_9fa48("4394") ? true : (stryCov_9fa48("4394", "4395", "4396"), process.env.JWT_EXPIRES_IN || (stryMutAct_9fa48("4397") ? "" : (stryCov_9fa48("4397"), '2h')));
const JWT_REFRESH_EXPIRES_IN = stryMutAct_9fa48("4400") ? process.env.JWT_REFRESH_EXPIRES_IN && '7d' : stryMutAct_9fa48("4399") ? false : stryMutAct_9fa48("4398") ? true : (stryCov_9fa48("4398", "4399", "4400"), process.env.JWT_REFRESH_EXPIRES_IN || (stryMutAct_9fa48("4401") ? "" : (stryCov_9fa48("4401"), '7d')));

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
  if (stryMutAct_9fa48("4402")) {
    {}
  } else {
    stryCov_9fa48("4402");
    if (stryMutAct_9fa48("4405") ? false : stryMutAct_9fa48("4404") ? true : stryMutAct_9fa48("4403") ? JWT_SECRET : (stryCov_9fa48("4403", "4404", "4405"), !JWT_SECRET)) {
      if (stryMutAct_9fa48("4406")) {
        {}
      } else {
        stryCov_9fa48("4406");
        throw new Error(stryMutAct_9fa48("4407") ? "" : (stryCov_9fa48("4407"), 'JWT_SECRET is not set'));
      }
    }
    const payload = stryMutAct_9fa48("4408") ? {} : (stryCov_9fa48("4408"), {
      id: user.id,
      email: user.email,
      role: user.role,
      hasPreferences: stryMutAct_9fa48("4411") ? user.hasPreferences && false : stryMutAct_9fa48("4410") ? false : stryMutAct_9fa48("4409") ? true : (stryCov_9fa48("4409", "4410", "4411"), user.hasPreferences || (stryMutAct_9fa48("4412") ? true : (stryCov_9fa48("4412"), false)))
    });
    const token = jwt.sign(payload, JWT_SECRET, stryMutAct_9fa48("4413") ? {} : (stryCov_9fa48("4413"), {
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
  if (stryMutAct_9fa48("4414")) {
    {}
  } else {
    stryCov_9fa48("4414");
    if (stryMutAct_9fa48("4417") ? false : stryMutAct_9fa48("4416") ? true : stryMutAct_9fa48("4415") ? JWT_SECRET : (stryCov_9fa48("4415", "4416", "4417"), !JWT_SECRET)) {
      if (stryMutAct_9fa48("4418")) {
        {}
      } else {
        stryCov_9fa48("4418");
        throw new Error(stryMutAct_9fa48("4419") ? "" : (stryCov_9fa48("4419"), 'JWT_SECRET is not set'));
      }
    }
    const payload = stryMutAct_9fa48("4420") ? {} : (stryCov_9fa48("4420"), {
      id: user.id,
      email: user.email,
      role: user.role
    });
    const token = jwt.sign(payload, JWT_SECRET, stryMutAct_9fa48("4421") ? {} : (stryCov_9fa48("4421"), {
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
  if (stryMutAct_9fa48("4422")) {
    {}
  } else {
    stryCov_9fa48("4422");
    if (stryMutAct_9fa48("4425") ? false : stryMutAct_9fa48("4424") ? true : stryMutAct_9fa48("4423") ? JWT_SECRET : (stryCov_9fa48("4423", "4424", "4425"), !JWT_SECRET)) {
      if (stryMutAct_9fa48("4426")) {
        {}
      } else {
        stryCov_9fa48("4426");
        throw new Error(stryMutAct_9fa48("4427") ? "" : (stryCov_9fa48("4427"), 'JWT_SECRET is not set'));
      }
    }
    try {
      if (stryMutAct_9fa48("4428")) {
        {}
      } else {
        stryCov_9fa48("4428");
        const decoded = jwt.verify(token, JWT_SECRET);
        if (stryMutAct_9fa48("4431") ? typeof decoded !== 'string' : stryMutAct_9fa48("4430") ? false : stryMutAct_9fa48("4429") ? true : (stryCov_9fa48("4429", "4430", "4431"), typeof decoded === (stryMutAct_9fa48("4432") ? "" : (stryCov_9fa48("4432"), 'string')))) {
          if (stryMutAct_9fa48("4433")) {
            {}
          } else {
            stryCov_9fa48("4433");
            throw new Error(stryMutAct_9fa48("4434") ? "" : (stryCov_9fa48("4434"), 'Invalid token'));
          }
        }
        return decoded;
      }
    } catch (error) {
      if (stryMutAct_9fa48("4435")) {
        {}
      } else {
        stryCov_9fa48("4435");
        if (stryMutAct_9fa48("4438") ? error.name !== 'TokenExpiredError' : stryMutAct_9fa48("4437") ? false : stryMutAct_9fa48("4436") ? true : (stryCov_9fa48("4436", "4437", "4438"), error.name === (stryMutAct_9fa48("4439") ? "" : (stryCov_9fa48("4439"), 'TokenExpiredError')))) {
          if (stryMutAct_9fa48("4440")) {
            {}
          } else {
            stryCov_9fa48("4440");
            throw new Error(stryMutAct_9fa48("4441") ? "" : (stryCov_9fa48("4441"), 'Token expired'));
          }
        }
        if (stryMutAct_9fa48("4444") ? error.name !== 'JsonWebTokenError' : stryMutAct_9fa48("4443") ? false : stryMutAct_9fa48("4442") ? true : (stryCov_9fa48("4442", "4443", "4444"), error.name === (stryMutAct_9fa48("4445") ? "" : (stryCov_9fa48("4445"), 'JsonWebTokenError')))) {
          if (stryMutAct_9fa48("4446")) {
            {}
          } else {
            stryCov_9fa48("4446");
            throw new Error(stryMutAct_9fa48("4447") ? "" : (stryCov_9fa48("4447"), 'Invalid token'));
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
  if (stryMutAct_9fa48("4448")) {
    {}
  } else {
    stryCov_9fa48("4448");
    if (stryMutAct_9fa48("4451") ? false : stryMutAct_9fa48("4450") ? true : stryMutAct_9fa48("4449") ? JWT_SECRET : (stryCov_9fa48("4449", "4450", "4451"), !JWT_SECRET)) {
      if (stryMutAct_9fa48("4452")) {
        {}
      } else {
        stryCov_9fa48("4452");
        throw new Error(stryMutAct_9fa48("4453") ? "" : (stryCov_9fa48("4453"), 'JWT_SECRET is not set'));
      }
    }
    try {
      if (stryMutAct_9fa48("4454")) {
        {}
      } else {
        stryCov_9fa48("4454");
        const decoded = jwt.verify(token, JWT_SECRET);
        if (stryMutAct_9fa48("4457") ? typeof decoded !== 'string' : stryMutAct_9fa48("4456") ? false : stryMutAct_9fa48("4455") ? true : (stryCov_9fa48("4455", "4456", "4457"), typeof decoded === (stryMutAct_9fa48("4458") ? "" : (stryCov_9fa48("4458"), 'string')))) {
          if (stryMutAct_9fa48("4459")) {
            {}
          } else {
            stryCov_9fa48("4459");
            throw new Error(stryMutAct_9fa48("4460") ? "" : (stryCov_9fa48("4460"), 'Invalid token'));
          }
        }
        return decoded;
      }
    } catch (error) {
      if (stryMutAct_9fa48("4461")) {
        {}
      } else {
        stryCov_9fa48("4461");
        if (stryMutAct_9fa48("4464") ? error.name !== 'TokenExpiredError' : stryMutAct_9fa48("4463") ? false : stryMutAct_9fa48("4462") ? true : (stryCov_9fa48("4462", "4463", "4464"), error.name === (stryMutAct_9fa48("4465") ? "" : (stryCov_9fa48("4465"), 'TokenExpiredError')))) {
          if (stryMutAct_9fa48("4466")) {
            {}
          } else {
            stryCov_9fa48("4466");
            throw new Error(stryMutAct_9fa48("4467") ? "" : (stryCov_9fa48("4467"), 'Token expired'));
          }
        }
        throw new Error(stryMutAct_9fa48("4468") ? "" : (stryCov_9fa48("4468"), 'Invalid token'));
      }
    }
  }
}
export { createAuthToken, createRefreshToken, decodeAuthToken, decodeRefreshToken };