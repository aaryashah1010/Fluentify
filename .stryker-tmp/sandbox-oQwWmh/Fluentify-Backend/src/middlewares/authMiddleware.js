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
import { ERRORS } from '../utils/error.js';
const JWT_SECRET = process.env.JWT_SECRET;
function authMiddleware(req, res, next) {
  if (stryMutAct_9fa48("1900")) {
    {}
  } else {
    stryCov_9fa48("1900");
    const authHeader = req.headers[stryMutAct_9fa48("1901") ? "" : (stryCov_9fa48("1901"), 'authorization')];
    const token = stryMutAct_9fa48("1904") ? authHeader || authHeader.split(' ')[1] : stryMutAct_9fa48("1903") ? false : stryMutAct_9fa48("1902") ? true : (stryCov_9fa48("1902", "1903", "1904"), authHeader && authHeader.split(stryMutAct_9fa48("1905") ? "" : (stryCov_9fa48("1905"), ' '))[1]);
    if (stryMutAct_9fa48("1908") ? false : stryMutAct_9fa48("1907") ? true : stryMutAct_9fa48("1906") ? token : (stryCov_9fa48("1906", "1907", "1908"), !token)) {
      if (stryMutAct_9fa48("1909")) {
        {}
      } else {
        stryCov_9fa48("1909");
        return next(ERRORS.NO_TOKEN_PROVIDED);
      }
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (stryMutAct_9fa48("1910")) {
        {}
      } else {
        stryCov_9fa48("1910");
        if (stryMutAct_9fa48("1912") ? false : stryMutAct_9fa48("1911") ? true : (stryCov_9fa48("1911", "1912"), err)) {
          if (stryMutAct_9fa48("1913")) {
            {}
          } else {
            stryCov_9fa48("1913");
            if (stryMutAct_9fa48("1916") ? err.name !== 'TokenExpiredError' : stryMutAct_9fa48("1915") ? false : stryMutAct_9fa48("1914") ? true : (stryCov_9fa48("1914", "1915", "1916"), err.name === (stryMutAct_9fa48("1917") ? "" : (stryCov_9fa48("1917"), 'TokenExpiredError')))) {
              if (stryMutAct_9fa48("1918")) {
                {}
              } else {
                stryCov_9fa48("1918");
                return next(ERRORS.TOKEN_EXPIRED);
              }
            }
            return next(ERRORS.INVALID_AUTH_TOKEN);
          }
        }
        req.user = user;
        console.log(stryMutAct_9fa48("1919") ? `` : (stryCov_9fa48("1919"), `🔐 Auth: User ${user.id} (${user.email}) authenticated - Role: ${user.role}`));
        next();
      }
    });
  }
}

// Middleware to check for admin role
export const adminOnly = (req, res, next) => {
  if (stryMutAct_9fa48("1920")) {
    {}
  } else {
    stryCov_9fa48("1920");
    // Check if user exists and has admin role
    if (stryMutAct_9fa48("1923") ? req.user || req.user.role === 'admin' : stryMutAct_9fa48("1922") ? false : stryMutAct_9fa48("1921") ? true : (stryCov_9fa48("1921", "1922", "1923"), req.user && (stryMutAct_9fa48("1925") ? req.user.role !== 'admin' : stryMutAct_9fa48("1924") ? true : (stryCov_9fa48("1924", "1925"), req.user.role === (stryMutAct_9fa48("1926") ? "" : (stryCov_9fa48("1926"), 'admin')))))) {
      if (stryMutAct_9fa48("1927")) {
        {}
      } else {
        stryCov_9fa48("1927");
        return next();
      }
    }
    return res.status(403).json(stryMutAct_9fa48("1928") ? {} : (stryCov_9fa48("1928"), {
      success: stryMutAct_9fa48("1929") ? true : (stryCov_9fa48("1929"), false),
      message: stryMutAct_9fa48("1930") ? "" : (stryCov_9fa48("1930"), 'Forbidden: Admin access required')
    }));
  }
};
export default authMiddleware;