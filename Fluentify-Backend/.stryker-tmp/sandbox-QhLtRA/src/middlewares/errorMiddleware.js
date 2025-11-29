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
  if (stryMutAct_9fa48("31")) {
    {}
  } else {
    stryCov_9fa48("31");
    // Log error with structured logging
    console.error(stryMutAct_9fa48("32") ? `` : (stryCov_9fa48("32"), `Error occurred: ${error.message}`), stryMutAct_9fa48("33") ? {} : (stryCov_9fa48("33"), {
      stack: error.stack,
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
      timestamp: new Date().toISOString()
    }));

    // Handle RequestError (our custom errors)
    if (stryMutAct_9fa48("35") ? false : stryMutAct_9fa48("34") ? true : (stryCov_9fa48("34", "35"), error instanceof RequestError)) {
      if (stryMutAct_9fa48("36")) {
        {}
      } else {
        stryCov_9fa48("36");
        return res.status(error.statusCode).json(errorResponse(error.message, error.code));
      }
    }

    // Handle JWT specific errors
    if (stryMutAct_9fa48("39") ? error.name !== 'JsonWebTokenError' : stryMutAct_9fa48("38") ? false : stryMutAct_9fa48("37") ? true : (stryCov_9fa48("37", "38", "39"), error.name === (stryMutAct_9fa48("40") ? "" : (stryCov_9fa48("40"), 'JsonWebTokenError')))) {
      if (stryMutAct_9fa48("41")) {
        {}
      } else {
        stryCov_9fa48("41");
        return res.status(401).json(errorResponse(stryMutAct_9fa48("42") ? "" : (stryCov_9fa48("42"), 'Invalid authentication token'), 20002));
      }
    }
    if (stryMutAct_9fa48("45") ? error.name !== 'TokenExpiredError' : stryMutAct_9fa48("44") ? false : stryMutAct_9fa48("43") ? true : (stryCov_9fa48("43", "44", "45"), error.name === (stryMutAct_9fa48("46") ? "" : (stryCov_9fa48("46"), 'TokenExpiredError')))) {
      if (stryMutAct_9fa48("47")) {
        {}
      } else {
        stryCov_9fa48("47");
        return res.status(401).json(errorResponse(stryMutAct_9fa48("48") ? "" : (stryCov_9fa48("48"), 'Authentication token has expired'), 20003));
      }
    }

    // Handle PostgreSQL/Database errors
    if (stryMutAct_9fa48("51") ? error.code !== '23505' : stryMutAct_9fa48("50") ? false : stryMutAct_9fa48("49") ? true : (stryCov_9fa48("49", "50", "51"), error.code === (stryMutAct_9fa48("52") ? "" : (stryCov_9fa48("52"), '23505')))) {
      if (stryMutAct_9fa48("53")) {
        {}
      } else {
        stryCov_9fa48("53");
        // Unique violation
        return res.status(409).json(errorResponse(stryMutAct_9fa48("54") ? "" : (stryCov_9fa48("54"), 'Duplicate entry detected'), 10009));
      }
    }
    if (stryMutAct_9fa48("57") ? error.code !== '23503' : stryMutAct_9fa48("56") ? false : stryMutAct_9fa48("55") ? true : (stryCov_9fa48("55", "56", "57"), error.code === (stryMutAct_9fa48("58") ? "" : (stryCov_9fa48("58"), '23503')))) {
      if (stryMutAct_9fa48("59")) {
        {}
      } else {
        stryCov_9fa48("59");
        // Foreign key violation
        return res.status(400).json(errorResponse(stryMutAct_9fa48("60") ? "" : (stryCov_9fa48("60"), 'Referenced record not found'), 10001));
      }
    }
    if (stryMutAct_9fa48("63") ? error.code !== '23502' : stryMutAct_9fa48("62") ? false : stryMutAct_9fa48("61") ? true : (stryCov_9fa48("61", "62", "63"), error.code === (stryMutAct_9fa48("64") ? "" : (stryCov_9fa48("64"), '23502')))) {
      if (stryMutAct_9fa48("65")) {
        {}
      } else {
        stryCov_9fa48("65");
        // Not null violation
        return res.status(400).json(errorResponse(stryMutAct_9fa48("66") ? "" : (stryCov_9fa48("66"), 'Required field is missing'), 10011));
      }
    }
    if (stryMutAct_9fa48("69") ? error.code !== '22P02' : stryMutAct_9fa48("68") ? false : stryMutAct_9fa48("67") ? true : (stryCov_9fa48("67", "68", "69"), error.code === (stryMutAct_9fa48("70") ? "" : (stryCov_9fa48("70"), '22P02')))) {
      if (stryMutAct_9fa48("71")) {
        {}
      } else {
        stryCov_9fa48("71");
        // Invalid text representation
        return res.status(400).json(errorResponse(stryMutAct_9fa48("72") ? "" : (stryCov_9fa48("72"), 'Invalid data format'), 10002));
      }
    }

    // Handle validation errors (if using express-validator)
    if (stryMutAct_9fa48("75") ? error.name !== 'ValidationError' : stryMutAct_9fa48("74") ? false : stryMutAct_9fa48("73") ? true : (stryCov_9fa48("73", "74", "75"), error.name === (stryMutAct_9fa48("76") ? "" : (stryCov_9fa48("76"), 'ValidationError')))) {
      if (stryMutAct_9fa48("77")) {
        {}
      } else {
        stryCov_9fa48("77");
        return res.status(422).json(errorResponse(error.message, 10008));
      }
    }

    // Handle syntax errors in JSON
    if (stryMutAct_9fa48("80") ? error instanceof SyntaxError && error.status === 400 || 'body' in error : stryMutAct_9fa48("79") ? false : stryMutAct_9fa48("78") ? true : (stryCov_9fa48("78", "79", "80"), (stryMutAct_9fa48("82") ? error instanceof SyntaxError || error.status === 400 : stryMutAct_9fa48("81") ? true : (stryCov_9fa48("81", "82"), error instanceof SyntaxError && (stryMutAct_9fa48("84") ? error.status !== 400 : stryMutAct_9fa48("83") ? true : (stryCov_9fa48("83", "84"), error.status === 400)))) && (stryMutAct_9fa48("85") ? "" : (stryCov_9fa48("85"), 'body')) in error)) {
      if (stryMutAct_9fa48("86")) {
        {}
      } else {
        stryCov_9fa48("86");
        return res.status(400).json(errorResponse(stryMutAct_9fa48("87") ? "" : (stryCov_9fa48("87"), 'Invalid JSON in request body'), 10012));
      }
    }

    // Handle any other unexpected errors
    const isDevelopment = stryMutAct_9fa48("90") ? process.env.NODE_ENV === 'production' : stryMutAct_9fa48("89") ? false : stryMutAct_9fa48("88") ? true : (stryCov_9fa48("88", "89", "90"), process.env.NODE_ENV !== (stryMutAct_9fa48("91") ? "" : (stryCov_9fa48("91"), 'production')));
    return res.status(500).json(errorResponse(isDevelopment ? error.message : stryMutAct_9fa48("92") ? "" : (stryCov_9fa48("92"), 'Internal server error'), 10005));
  }
};

// 404 Not Found handler
const notFoundHandler = (req, res) => {
  if (stryMutAct_9fa48("93")) {
    {}
  } else {
    stryCov_9fa48("93");
    res.status(404).json(errorResponse(stryMutAct_9fa48("94") ? `` : (stryCov_9fa48("94"), `Route ${req.method} ${req.path} not found`), 10006));
  }
};
export { errorHandler, notFoundHandler };