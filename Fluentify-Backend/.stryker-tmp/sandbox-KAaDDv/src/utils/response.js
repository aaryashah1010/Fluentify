// @ts-nocheck
// Standard success response format
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
function successResponse(data, message) {
  if (stryMutAct_9fa48("4046")) {
    {}
  } else {
    stryCov_9fa48("4046");
    return stryMutAct_9fa48("4047") ? {} : (stryCov_9fa48("4047"), {
      success: stryMutAct_9fa48("4048") ? false : (stryCov_9fa48("4048"), true),
      message: stryMutAct_9fa48("4051") ? message && "Operation successful" : stryMutAct_9fa48("4050") ? false : stryMutAct_9fa48("4049") ? true : (stryCov_9fa48("4049", "4050", "4051"), message || (stryMutAct_9fa48("4052") ? "" : (stryCov_9fa48("4052"), "Operation successful"))),
      data,
      timestamp: new Date().toISOString()
    });
  }
}

// Standard error response format
function errorResponse(message, code = 10000) {
  if (stryMutAct_9fa48("4053")) {
    {}
  } else {
    stryCov_9fa48("4053");
    return stryMutAct_9fa48("4054") ? {} : (stryCov_9fa48("4054"), {
      success: stryMutAct_9fa48("4055") ? true : (stryCov_9fa48("4055"), false),
      error: stryMutAct_9fa48("4056") ? {} : (stryCov_9fa48("4056"), {
        code,
        message
      }),
      timestamp: new Date().toISOString()
    });
  }
}

// Response for list operations without pagination
function listResponse(data, message, meta) {
  if (stryMutAct_9fa48("4057")) {
    {}
  } else {
    stryCov_9fa48("4057");
    return stryMutAct_9fa48("4058") ? {} : (stryCov_9fa48("4058"), {
      success: stryMutAct_9fa48("4059") ? false : (stryCov_9fa48("4059"), true),
      message: stryMutAct_9fa48("4062") ? message && "Data retrieved successfully" : stryMutAct_9fa48("4061") ? false : stryMutAct_9fa48("4060") ? true : (stryCov_9fa48("4060", "4061", "4062"), message || (stryMutAct_9fa48("4063") ? "" : (stryCov_9fa48("4063"), "Data retrieved successfully"))),
      data,
      meta: stryMutAct_9fa48("4066") ? meta && {
        count: data.length
      } : stryMutAct_9fa48("4065") ? false : stryMutAct_9fa48("4064") ? true : (stryCov_9fa48("4064", "4065", "4066"), meta || (stryMutAct_9fa48("4067") ? {} : (stryCov_9fa48("4067"), {
        count: data.length
      }))),
      timestamp: new Date().toISOString()
    });
  }
}

// Response for creation operations
function createdResponse(data, message) {
  if (stryMutAct_9fa48("4068")) {
    {}
  } else {
    stryCov_9fa48("4068");
    return stryMutAct_9fa48("4069") ? {} : (stryCov_9fa48("4069"), {
      success: stryMutAct_9fa48("4070") ? false : (stryCov_9fa48("4070"), true),
      message: stryMutAct_9fa48("4073") ? message && "Resource created successfully" : stryMutAct_9fa48("4072") ? false : stryMutAct_9fa48("4071") ? true : (stryCov_9fa48("4071", "4072", "4073"), message || (stryMutAct_9fa48("4074") ? "" : (stryCov_9fa48("4074"), "Resource created successfully"))),
      data,
      timestamp: new Date().toISOString()
    });
  }
}

// Response for update operations
function updatedResponse(data, message) {
  if (stryMutAct_9fa48("4075")) {
    {}
  } else {
    stryCov_9fa48("4075");
    return stryMutAct_9fa48("4076") ? {} : (stryCov_9fa48("4076"), {
      success: stryMutAct_9fa48("4077") ? false : (stryCov_9fa48("4077"), true),
      message: stryMutAct_9fa48("4080") ? message && "Resource updated successfully" : stryMutAct_9fa48("4079") ? false : stryMutAct_9fa48("4078") ? true : (stryCov_9fa48("4078", "4079", "4080"), message || (stryMutAct_9fa48("4081") ? "" : (stryCov_9fa48("4081"), "Resource updated successfully"))),
      data,
      timestamp: new Date().toISOString()
    });
  }
}

// Response for delete operations
function deletedResponse(message) {
  if (stryMutAct_9fa48("4082")) {
    {}
  } else {
    stryCov_9fa48("4082");
    return stryMutAct_9fa48("4083") ? {} : (stryCov_9fa48("4083"), {
      success: stryMutAct_9fa48("4084") ? false : (stryCov_9fa48("4084"), true),
      message: stryMutAct_9fa48("4087") ? message && "Resource deleted successfully" : stryMutAct_9fa48("4086") ? false : stryMutAct_9fa48("4085") ? true : (stryCov_9fa48("4085", "4086", "4087"), message || (stryMutAct_9fa48("4088") ? "" : (stryCov_9fa48("4088"), "Resource deleted successfully"))),
      timestamp: new Date().toISOString()
    });
  }
}

// Response for authentication operations
function authResponse(data, message) {
  if (stryMutAct_9fa48("4089")) {
    {}
  } else {
    stryCov_9fa48("4089");
    return stryMutAct_9fa48("4090") ? {} : (stryCov_9fa48("4090"), {
      success: stryMutAct_9fa48("4091") ? false : (stryCov_9fa48("4091"), true),
      message: stryMutAct_9fa48("4094") ? message && "Authentication successful" : stryMutAct_9fa48("4093") ? false : stryMutAct_9fa48("4092") ? true : (stryCov_9fa48("4092", "4093", "4094"), message || (stryMutAct_9fa48("4095") ? "" : (stryCov_9fa48("4095"), "Authentication successful"))),
      data: stryMutAct_9fa48("4096") ? {} : (stryCov_9fa48("4096"), {
        user: data.user,
        token: data.token
      }),
      timestamp: new Date().toISOString()
    });
  }
}
export { successResponse, errorResponse, listResponse, createdResponse, updatedResponse, deletedResponse, authResponse };