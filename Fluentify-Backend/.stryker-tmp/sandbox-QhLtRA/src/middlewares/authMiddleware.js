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
  if (stryMutAct_9fa48("0")) {
    {}
  } else {
    stryCov_9fa48("0");
    const authHeader = req.headers[stryMutAct_9fa48("1") ? "" : (stryCov_9fa48("1"), 'authorization')];
    const token = stryMutAct_9fa48("4") ? authHeader || authHeader.split(' ')[1] : stryMutAct_9fa48("3") ? false : stryMutAct_9fa48("2") ? true : (stryCov_9fa48("2", "3", "4"), authHeader && authHeader.split(stryMutAct_9fa48("5") ? "" : (stryCov_9fa48("5"), ' '))[1]);
    if (stryMutAct_9fa48("8") ? false : stryMutAct_9fa48("7") ? true : stryMutAct_9fa48("6") ? token : (stryCov_9fa48("6", "7", "8"), !token)) {
      if (stryMutAct_9fa48("9")) {
        {}
      } else {
        stryCov_9fa48("9");
        return next(ERRORS.NO_TOKEN_PROVIDED);
      }
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (stryMutAct_9fa48("10")) {
        {}
      } else {
        stryCov_9fa48("10");
        if (stryMutAct_9fa48("12") ? false : stryMutAct_9fa48("11") ? true : (stryCov_9fa48("11", "12"), err)) {
          if (stryMutAct_9fa48("13")) {
            {}
          } else {
            stryCov_9fa48("13");
            if (stryMutAct_9fa48("16") ? err.name !== 'TokenExpiredError' : stryMutAct_9fa48("15") ? false : stryMutAct_9fa48("14") ? true : (stryCov_9fa48("14", "15", "16"), err.name === (stryMutAct_9fa48("17") ? "" : (stryCov_9fa48("17"), 'TokenExpiredError')))) {
              if (stryMutAct_9fa48("18")) {
                {}
              } else {
                stryCov_9fa48("18");
                return next(ERRORS.TOKEN_EXPIRED);
              }
            }
            return next(ERRORS.INVALID_AUTH_TOKEN);
          }
        }
        req.user = user;
        console.log(stryMutAct_9fa48("19") ? `` : (stryCov_9fa48("19"), `🔐 Auth: User ${user.id} (${user.email}) authenticated - Role: ${user.role}`));
        next();
      }
    });
  }
}

// Middleware to check for admin role
export const adminOnly = (req, res, next) => {
  if (stryMutAct_9fa48("20")) {
    {}
  } else {
    stryCov_9fa48("20");
    // Check if user exists and has admin role
    if (stryMutAct_9fa48("23") ? req.user || req.user.role === 'admin' : stryMutAct_9fa48("22") ? false : stryMutAct_9fa48("21") ? true : (stryCov_9fa48("21", "22", "23"), req.user && (stryMutAct_9fa48("25") ? req.user.role !== 'admin' : stryMutAct_9fa48("24") ? true : (stryCov_9fa48("24", "25"), req.user.role === (stryMutAct_9fa48("26") ? "" : (stryCov_9fa48("26"), 'admin')))))) {
      if (stryMutAct_9fa48("27")) {
        {}
      } else {
        stryCov_9fa48("27");
        return next();
      }
    }
    return res.status(403).json(stryMutAct_9fa48("28") ? {} : (stryCov_9fa48("28"), {
      success: stryMutAct_9fa48("29") ? true : (stryCov_9fa48("29"), false),
      message: stryMutAct_9fa48("30") ? "" : (stryCov_9fa48("30"), 'Forbidden: Admin access required')
    }));
  }
};
export default authMiddleware;