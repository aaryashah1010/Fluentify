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
import { RequestError } from '../utils/error.js';
import { errorResponse } from '../utils/response.js';

// Global error handler
const errorHandler = (error, req, res, next) => {
  if (stryMutAct_9fa48("1931")) {
    {}
  } else {
    stryCov_9fa48("1931");
    // Log error with structured logging
    console.error(stryMutAct_9fa48("1932") ? `` : (stryCov_9fa48("1932"), `Error occurred: ${error.message}`), stryMutAct_9fa48("1933") ? {} : (stryCov_9fa48("1933"), {
      stack: error.stack,
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
      timestamp: new Date().toISOString()
    }));

    // Handle RequestError (our custom errors)
    if (stryMutAct_9fa48("1935") ? false : stryMutAct_9fa48("1934") ? true : (stryCov_9fa48("1934", "1935"), error instanceof RequestError)) {
      if (stryMutAct_9fa48("1936")) {
        {}
      } else {
        stryCov_9fa48("1936");
        return res.status(error.statusCode).json(errorResponse(error.message, error.code));
      }
    }

    // Handle JWT specific errors
    if (stryMutAct_9fa48("1939") ? error.name !== 'JsonWebTokenError' : stryMutAct_9fa48("1938") ? false : stryMutAct_9fa48("1937") ? true : (stryCov_9fa48("1937", "1938", "1939"), error.name === (stryMutAct_9fa48("1940") ? "" : (stryCov_9fa48("1940"), 'JsonWebTokenError')))) {
      if (stryMutAct_9fa48("1941")) {
        {}
      } else {
        stryCov_9fa48("1941");
        return res.status(401).json(errorResponse(stryMutAct_9fa48("1942") ? "" : (stryCov_9fa48("1942"), 'Invalid authentication token'), 20002));
      }
    }
    if (stryMutAct_9fa48("1945") ? error.name !== 'TokenExpiredError' : stryMutAct_9fa48("1944") ? false : stryMutAct_9fa48("1943") ? true : (stryCov_9fa48("1943", "1944", "1945"), error.name === (stryMutAct_9fa48("1946") ? "" : (stryCov_9fa48("1946"), 'TokenExpiredError')))) {
      if (stryMutAct_9fa48("1947")) {
        {}
      } else {
        stryCov_9fa48("1947");
        return res.status(401).json(errorResponse(stryMutAct_9fa48("1948") ? "" : (stryCov_9fa48("1948"), 'Authentication token has expired'), 20003));
      }
    }

    // Handle PostgreSQL/Database errors
    if (stryMutAct_9fa48("1951") ? error.code !== '23505' : stryMutAct_9fa48("1950") ? false : stryMutAct_9fa48("1949") ? true : (stryCov_9fa48("1949", "1950", "1951"), error.code === (stryMutAct_9fa48("1952") ? "" : (stryCov_9fa48("1952"), '23505')))) {
      if (stryMutAct_9fa48("1953")) {
        {}
      } else {
        stryCov_9fa48("1953");
        // Unique violation
        return res.status(409).json(errorResponse(stryMutAct_9fa48("1954") ? "" : (stryCov_9fa48("1954"), 'Duplicate entry detected'), 10009));
      }
    }
    if (stryMutAct_9fa48("1957") ? error.code !== '23503' : stryMutAct_9fa48("1956") ? false : stryMutAct_9fa48("1955") ? true : (stryCov_9fa48("1955", "1956", "1957"), error.code === (stryMutAct_9fa48("1958") ? "" : (stryCov_9fa48("1958"), '23503')))) {
      if (stryMutAct_9fa48("1959")) {
        {}
      } else {
        stryCov_9fa48("1959");
        // Foreign key violation
        return res.status(400).json(errorResponse(stryMutAct_9fa48("1960") ? "" : (stryCov_9fa48("1960"), 'Referenced record not found'), 10001));
      }
    }
    if (stryMutAct_9fa48("1963") ? error.code !== '23502' : stryMutAct_9fa48("1962") ? false : stryMutAct_9fa48("1961") ? true : (stryCov_9fa48("1961", "1962", "1963"), error.code === (stryMutAct_9fa48("1964") ? "" : (stryCov_9fa48("1964"), '23502')))) {
      if (stryMutAct_9fa48("1965")) {
        {}
      } else {
        stryCov_9fa48("1965");
        // Not null violation
        return res.status(400).json(errorResponse(stryMutAct_9fa48("1966") ? "" : (stryCov_9fa48("1966"), 'Required field is missing'), 10011));
      }
    }
    if (stryMutAct_9fa48("1969") ? error.code !== '22P02' : stryMutAct_9fa48("1968") ? false : stryMutAct_9fa48("1967") ? true : (stryCov_9fa48("1967", "1968", "1969"), error.code === (stryMutAct_9fa48("1970") ? "" : (stryCov_9fa48("1970"), '22P02')))) {
      if (stryMutAct_9fa48("1971")) {
        {}
      } else {
        stryCov_9fa48("1971");
        // Invalid text representation
        return res.status(400).json(errorResponse(stryMutAct_9fa48("1972") ? "" : (stryCov_9fa48("1972"), 'Invalid data format'), 10002));
      }
    }

    // Handle validation errors (if using express-validator)
    if (stryMutAct_9fa48("1975") ? error.name !== 'ValidationError' : stryMutAct_9fa48("1974") ? false : stryMutAct_9fa48("1973") ? true : (stryCov_9fa48("1973", "1974", "1975"), error.name === (stryMutAct_9fa48("1976") ? "" : (stryCov_9fa48("1976"), 'ValidationError')))) {
      if (stryMutAct_9fa48("1977")) {
        {}
      } else {
        stryCov_9fa48("1977");
        return res.status(422).json(errorResponse(error.message, 10008));
      }
    }

    // Handle syntax errors in JSON
    if (stryMutAct_9fa48("1980") ? error instanceof SyntaxError && error.status === 400 || 'body' in error : stryMutAct_9fa48("1979") ? false : stryMutAct_9fa48("1978") ? true : (stryCov_9fa48("1978", "1979", "1980"), (stryMutAct_9fa48("1982") ? error instanceof SyntaxError || error.status === 400 : stryMutAct_9fa48("1981") ? true : (stryCov_9fa48("1981", "1982"), error instanceof SyntaxError && (stryMutAct_9fa48("1984") ? error.status !== 400 : stryMutAct_9fa48("1983") ? true : (stryCov_9fa48("1983", "1984"), error.status === 400)))) && (stryMutAct_9fa48("1985") ? "" : (stryCov_9fa48("1985"), 'body')) in error)) {
      if (stryMutAct_9fa48("1986")) {
        {}
      } else {
        stryCov_9fa48("1986");
        return res.status(400).json(errorResponse(stryMutAct_9fa48("1987") ? "" : (stryCov_9fa48("1987"), 'Invalid JSON in request body'), 10012));
      }
    }

    // Handle any other unexpected errors
    const isDevelopment = stryMutAct_9fa48("1990") ? process.env.NODE_ENV === 'production' : stryMutAct_9fa48("1989") ? false : stryMutAct_9fa48("1988") ? true : (stryCov_9fa48("1988", "1989", "1990"), process.env.NODE_ENV !== (stryMutAct_9fa48("1991") ? "" : (stryCov_9fa48("1991"), 'production')));
    return res.status(500).json(errorResponse(isDevelopment ? error.message : stryMutAct_9fa48("1992") ? "" : (stryCov_9fa48("1992"), 'Internal server error'), 10005));
  }
};

// 404 Not Found handler
const notFoundHandler = (req, res) => {
  if (stryMutAct_9fa48("1993")) {
    {}
  } else {
    stryCov_9fa48("1993");
    res.status(404).json(errorResponse(stryMutAct_9fa48("1994") ? `` : (stryCov_9fa48("1994"), `Route ${req.method} ${req.path} not found`), 10006));
  }
};
export { errorHandler, notFoundHandler };