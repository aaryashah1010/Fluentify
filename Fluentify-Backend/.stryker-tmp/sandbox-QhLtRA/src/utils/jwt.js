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
const JWT_EXPIRES_IN = stryMutAct_9fa48("1417") ? process.env.JWT_EXPIRES_IN && '2h' : stryMutAct_9fa48("1416") ? false : stryMutAct_9fa48("1415") ? true : (stryCov_9fa48("1415", "1416", "1417"), process.env.JWT_EXPIRES_IN || (stryMutAct_9fa48("1418") ? "" : (stryCov_9fa48("1418"), '2h')));
const JWT_REFRESH_EXPIRES_IN = stryMutAct_9fa48("1421") ? process.env.JWT_REFRESH_EXPIRES_IN && '7d' : stryMutAct_9fa48("1420") ? false : stryMutAct_9fa48("1419") ? true : (stryCov_9fa48("1419", "1420", "1421"), process.env.JWT_REFRESH_EXPIRES_IN || (stryMutAct_9fa48("1422") ? "" : (stryCov_9fa48("1422"), '7d')));

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
  if (stryMutAct_9fa48("1423")) {
    {}
  } else {
    stryCov_9fa48("1423");
    if (stryMutAct_9fa48("1426") ? false : stryMutAct_9fa48("1425") ? true : stryMutAct_9fa48("1424") ? JWT_SECRET : (stryCov_9fa48("1424", "1425", "1426"), !JWT_SECRET)) {
      if (stryMutAct_9fa48("1427")) {
        {}
      } else {
        stryCov_9fa48("1427");
        throw new Error(stryMutAct_9fa48("1428") ? "" : (stryCov_9fa48("1428"), 'JWT_SECRET is not set'));
      }
    }
    const payload = stryMutAct_9fa48("1429") ? {} : (stryCov_9fa48("1429"), {
      id: user.id,
      email: user.email,
      role: user.role,
      hasPreferences: stryMutAct_9fa48("1432") ? user.hasPreferences && false : stryMutAct_9fa48("1431") ? false : stryMutAct_9fa48("1430") ? true : (stryCov_9fa48("1430", "1431", "1432"), user.hasPreferences || (stryMutAct_9fa48("1433") ? true : (stryCov_9fa48("1433"), false)))
    });
    const token = jwt.sign(payload, JWT_SECRET, stryMutAct_9fa48("1434") ? {} : (stryCov_9fa48("1434"), {
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
  if (stryMutAct_9fa48("1435")) {
    {}
  } else {
    stryCov_9fa48("1435");
    if (stryMutAct_9fa48("1438") ? false : stryMutAct_9fa48("1437") ? true : stryMutAct_9fa48("1436") ? JWT_SECRET : (stryCov_9fa48("1436", "1437", "1438"), !JWT_SECRET)) {
      if (stryMutAct_9fa48("1439")) {
        {}
      } else {
        stryCov_9fa48("1439");
        throw new Error(stryMutAct_9fa48("1440") ? "" : (stryCov_9fa48("1440"), 'JWT_SECRET is not set'));
      }
    }
    const payload = stryMutAct_9fa48("1441") ? {} : (stryCov_9fa48("1441"), {
      id: user.id,
      email: user.email,
      role: user.role
    });
    const token = jwt.sign(payload, JWT_SECRET, stryMutAct_9fa48("1442") ? {} : (stryCov_9fa48("1442"), {
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
  if (stryMutAct_9fa48("1443")) {
    {}
  } else {
    stryCov_9fa48("1443");
    if (stryMutAct_9fa48("1446") ? false : stryMutAct_9fa48("1445") ? true : stryMutAct_9fa48("1444") ? JWT_SECRET : (stryCov_9fa48("1444", "1445", "1446"), !JWT_SECRET)) {
      if (stryMutAct_9fa48("1447")) {
        {}
      } else {
        stryCov_9fa48("1447");
        throw new Error(stryMutAct_9fa48("1448") ? "" : (stryCov_9fa48("1448"), 'JWT_SECRET is not set'));
      }
    }
    try {
      if (stryMutAct_9fa48("1449")) {
        {}
      } else {
        stryCov_9fa48("1449");
        const decoded = jwt.verify(token, JWT_SECRET);
        if (stryMutAct_9fa48("1452") ? typeof decoded !== 'string' : stryMutAct_9fa48("1451") ? false : stryMutAct_9fa48("1450") ? true : (stryCov_9fa48("1450", "1451", "1452"), typeof decoded === (stryMutAct_9fa48("1453") ? "" : (stryCov_9fa48("1453"), 'string')))) {
          if (stryMutAct_9fa48("1454")) {
            {}
          } else {
            stryCov_9fa48("1454");
            throw new Error(stryMutAct_9fa48("1455") ? "" : (stryCov_9fa48("1455"), 'Invalid token'));
          }
        }
        return decoded;
      }
    } catch (error) {
      if (stryMutAct_9fa48("1456")) {
        {}
      } else {
        stryCov_9fa48("1456");
        if (stryMutAct_9fa48("1459") ? error.name !== 'TokenExpiredError' : stryMutAct_9fa48("1458") ? false : stryMutAct_9fa48("1457") ? true : (stryCov_9fa48("1457", "1458", "1459"), error.name === (stryMutAct_9fa48("1460") ? "" : (stryCov_9fa48("1460"), 'TokenExpiredError')))) {
          if (stryMutAct_9fa48("1461")) {
            {}
          } else {
            stryCov_9fa48("1461");
            throw new Error(stryMutAct_9fa48("1462") ? "" : (stryCov_9fa48("1462"), 'Token expired'));
          }
        }
        if (stryMutAct_9fa48("1465") ? error.name !== 'JsonWebTokenError' : stryMutAct_9fa48("1464") ? false : stryMutAct_9fa48("1463") ? true : (stryCov_9fa48("1463", "1464", "1465"), error.name === (stryMutAct_9fa48("1466") ? "" : (stryCov_9fa48("1466"), 'JsonWebTokenError')))) {
          if (stryMutAct_9fa48("1467")) {
            {}
          } else {
            stryCov_9fa48("1467");
            throw new Error(stryMutAct_9fa48("1468") ? "" : (stryCov_9fa48("1468"), 'Invalid token'));
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
  if (stryMutAct_9fa48("1469")) {
    {}
  } else {
    stryCov_9fa48("1469");
    if (stryMutAct_9fa48("1472") ? false : stryMutAct_9fa48("1471") ? true : stryMutAct_9fa48("1470") ? JWT_SECRET : (stryCov_9fa48("1470", "1471", "1472"), !JWT_SECRET)) {
      if (stryMutAct_9fa48("1473")) {
        {}
      } else {
        stryCov_9fa48("1473");
        throw new Error(stryMutAct_9fa48("1474") ? "" : (stryCov_9fa48("1474"), 'JWT_SECRET is not set'));
      }
    }
    try {
      if (stryMutAct_9fa48("1475")) {
        {}
      } else {
        stryCov_9fa48("1475");
        const decoded = jwt.verify(token, JWT_SECRET);
        if (stryMutAct_9fa48("1478") ? typeof decoded !== 'string' : stryMutAct_9fa48("1477") ? false : stryMutAct_9fa48("1476") ? true : (stryCov_9fa48("1476", "1477", "1478"), typeof decoded === (stryMutAct_9fa48("1479") ? "" : (stryCov_9fa48("1479"), 'string')))) {
          if (stryMutAct_9fa48("1480")) {
            {}
          } else {
            stryCov_9fa48("1480");
            throw new Error(stryMutAct_9fa48("1481") ? "" : (stryCov_9fa48("1481"), 'Invalid token'));
          }
        }
        return decoded;
      }
    } catch (error) {
      if (stryMutAct_9fa48("1482")) {
        {}
      } else {
        stryCov_9fa48("1482");
        if (stryMutAct_9fa48("1485") ? error.name !== 'TokenExpiredError' : stryMutAct_9fa48("1484") ? false : stryMutAct_9fa48("1483") ? true : (stryCov_9fa48("1483", "1484", "1485"), error.name === (stryMutAct_9fa48("1486") ? "" : (stryCov_9fa48("1486"), 'TokenExpiredError')))) {
          if (stryMutAct_9fa48("1487")) {
            {}
          } else {
            stryCov_9fa48("1487");
            throw new Error(stryMutAct_9fa48("1488") ? "" : (stryCov_9fa48("1488"), 'Token expired'));
          }
        }
        throw new Error(stryMutAct_9fa48("1489") ? "" : (stryCov_9fa48("1489"), 'Invalid token'));
      }
    }
  }
}
export { createAuthToken, createRefreshToken, decodeAuthToken, decodeRefreshToken };