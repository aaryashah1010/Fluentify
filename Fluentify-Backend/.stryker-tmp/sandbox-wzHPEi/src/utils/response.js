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
  if (stryMutAct_9fa48("4063")) {
    {}
  } else {
    stryCov_9fa48("4063");
    return stryMutAct_9fa48("4064") ? {} : (stryCov_9fa48("4064"), {
      success: stryMutAct_9fa48("4065") ? false : (stryCov_9fa48("4065"), true),
      message: stryMutAct_9fa48("4068") ? message && "Operation successful" : stryMutAct_9fa48("4067") ? false : stryMutAct_9fa48("4066") ? true : (stryCov_9fa48("4066", "4067", "4068"), message || (stryMutAct_9fa48("4069") ? "" : (stryCov_9fa48("4069"), "Operation successful"))),
      data,
      timestamp: new Date().toISOString()
    });
  }
}

// Standard error response format
function errorResponse(message, code = 10000) {
  if (stryMutAct_9fa48("4070")) {
    {}
  } else {
    stryCov_9fa48("4070");
    return stryMutAct_9fa48("4071") ? {} : (stryCov_9fa48("4071"), {
      success: stryMutAct_9fa48("4072") ? true : (stryCov_9fa48("4072"), false),
      error: stryMutAct_9fa48("4073") ? {} : (stryCov_9fa48("4073"), {
        code,
        message
      }),
      timestamp: new Date().toISOString()
    });
  }
}

// Response for list operations without pagination
function listResponse(data, message, meta) {
  if (stryMutAct_9fa48("4074")) {
    {}
  } else {
    stryCov_9fa48("4074");
    return stryMutAct_9fa48("4075") ? {} : (stryCov_9fa48("4075"), {
      success: stryMutAct_9fa48("4076") ? false : (stryCov_9fa48("4076"), true),
      message: stryMutAct_9fa48("4079") ? message && "Data retrieved successfully" : stryMutAct_9fa48("4078") ? false : stryMutAct_9fa48("4077") ? true : (stryCov_9fa48("4077", "4078", "4079"), message || (stryMutAct_9fa48("4080") ? "" : (stryCov_9fa48("4080"), "Data retrieved successfully"))),
      data,
      meta: stryMutAct_9fa48("4083") ? meta && {
        count: data.length
      } : stryMutAct_9fa48("4082") ? false : stryMutAct_9fa48("4081") ? true : (stryCov_9fa48("4081", "4082", "4083"), meta || (stryMutAct_9fa48("4084") ? {} : (stryCov_9fa48("4084"), {
        count: data.length
      }))),
      timestamp: new Date().toISOString()
    });
  }
}

// Response for creation operations
function createdResponse(data, message) {
  if (stryMutAct_9fa48("4085")) {
    {}
  } else {
    stryCov_9fa48("4085");
    return stryMutAct_9fa48("4086") ? {} : (stryCov_9fa48("4086"), {
      success: stryMutAct_9fa48("4087") ? false : (stryCov_9fa48("4087"), true),
      message: stryMutAct_9fa48("4090") ? message && "Resource created successfully" : stryMutAct_9fa48("4089") ? false : stryMutAct_9fa48("4088") ? true : (stryCov_9fa48("4088", "4089", "4090"), message || (stryMutAct_9fa48("4091") ? "" : (stryCov_9fa48("4091"), "Resource created successfully"))),
      data,
      timestamp: new Date().toISOString()
    });
  }
}

// Response for update operations
function updatedResponse(data, message) {
  if (stryMutAct_9fa48("4092")) {
    {}
  } else {
    stryCov_9fa48("4092");
    return stryMutAct_9fa48("4093") ? {} : (stryCov_9fa48("4093"), {
      success: stryMutAct_9fa48("4094") ? false : (stryCov_9fa48("4094"), true),
      message: stryMutAct_9fa48("4097") ? message && "Resource updated successfully" : stryMutAct_9fa48("4096") ? false : stryMutAct_9fa48("4095") ? true : (stryCov_9fa48("4095", "4096", "4097"), message || (stryMutAct_9fa48("4098") ? "" : (stryCov_9fa48("4098"), "Resource updated successfully"))),
      data,
      timestamp: new Date().toISOString()
    });
  }
}

// Response for delete operations
function deletedResponse(message) {
  if (stryMutAct_9fa48("4099")) {
    {}
  } else {
    stryCov_9fa48("4099");
    return stryMutAct_9fa48("4100") ? {} : (stryCov_9fa48("4100"), {
      success: stryMutAct_9fa48("4101") ? false : (stryCov_9fa48("4101"), true),
      message: stryMutAct_9fa48("4104") ? message && "Resource deleted successfully" : stryMutAct_9fa48("4103") ? false : stryMutAct_9fa48("4102") ? true : (stryCov_9fa48("4102", "4103", "4104"), message || (stryMutAct_9fa48("4105") ? "" : (stryCov_9fa48("4105"), "Resource deleted successfully"))),
      timestamp: new Date().toISOString()
    });
  }
}

// Response for authentication operations
function authResponse(data, message) {
  if (stryMutAct_9fa48("4106")) {
    {}
  } else {
    stryCov_9fa48("4106");
    return stryMutAct_9fa48("4107") ? {} : (stryCov_9fa48("4107"), {
      success: stryMutAct_9fa48("4108") ? false : (stryCov_9fa48("4108"), true),
      message: stryMutAct_9fa48("4111") ? message && "Authentication successful" : stryMutAct_9fa48("4110") ? false : stryMutAct_9fa48("4109") ? true : (stryCov_9fa48("4109", "4110", "4111"), message || (stryMutAct_9fa48("4112") ? "" : (stryCov_9fa48("4112"), "Authentication successful"))),
      data: stryMutAct_9fa48("4113") ? {} : (stryCov_9fa48("4113"), {
        user: data.user,
        token: data.token
      }),
      timestamp: new Date().toISOString()
    });
  }
}
export { successResponse, errorResponse, listResponse, createdResponse, updatedResponse, deletedResponse, authResponse };