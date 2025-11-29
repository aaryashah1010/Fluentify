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
  if (stryMutAct_9fa48("4469")) {
    {}
  } else {
    stryCov_9fa48("4469");
    return stryMutAct_9fa48("4470") ? {} : (stryCov_9fa48("4470"), {
      success: stryMutAct_9fa48("4471") ? false : (stryCov_9fa48("4471"), true),
      message: stryMutAct_9fa48("4474") ? message && "Operation successful" : stryMutAct_9fa48("4473") ? false : stryMutAct_9fa48("4472") ? true : (stryCov_9fa48("4472", "4473", "4474"), message || (stryMutAct_9fa48("4475") ? "" : (stryCov_9fa48("4475"), "Operation successful"))),
      data,
      timestamp: new Date().toISOString()
    });
  }
}

// Standard error response format
function errorResponse(message, code = 10000) {
  if (stryMutAct_9fa48("4476")) {
    {}
  } else {
    stryCov_9fa48("4476");
    return stryMutAct_9fa48("4477") ? {} : (stryCov_9fa48("4477"), {
      success: stryMutAct_9fa48("4478") ? true : (stryCov_9fa48("4478"), false),
      error: stryMutAct_9fa48("4479") ? {} : (stryCov_9fa48("4479"), {
        code,
        message
      }),
      timestamp: new Date().toISOString()
    });
  }
}

// Response for list operations without pagination
function listResponse(data, message, meta) {
  if (stryMutAct_9fa48("4480")) {
    {}
  } else {
    stryCov_9fa48("4480");
    return stryMutAct_9fa48("4481") ? {} : (stryCov_9fa48("4481"), {
      success: stryMutAct_9fa48("4482") ? false : (stryCov_9fa48("4482"), true),
      message: stryMutAct_9fa48("4485") ? message && "Data retrieved successfully" : stryMutAct_9fa48("4484") ? false : stryMutAct_9fa48("4483") ? true : (stryCov_9fa48("4483", "4484", "4485"), message || (stryMutAct_9fa48("4486") ? "" : (stryCov_9fa48("4486"), "Data retrieved successfully"))),
      data,
      meta: stryMutAct_9fa48("4489") ? meta && {
        count: data.length
      } : stryMutAct_9fa48("4488") ? false : stryMutAct_9fa48("4487") ? true : (stryCov_9fa48("4487", "4488", "4489"), meta || (stryMutAct_9fa48("4490") ? {} : (stryCov_9fa48("4490"), {
        count: data.length
      }))),
      timestamp: new Date().toISOString()
    });
  }
}

// Response for creation operations
function createdResponse(data, message) {
  if (stryMutAct_9fa48("4491")) {
    {}
  } else {
    stryCov_9fa48("4491");
    return stryMutAct_9fa48("4492") ? {} : (stryCov_9fa48("4492"), {
      success: stryMutAct_9fa48("4493") ? false : (stryCov_9fa48("4493"), true),
      message: stryMutAct_9fa48("4496") ? message && "Resource created successfully" : stryMutAct_9fa48("4495") ? false : stryMutAct_9fa48("4494") ? true : (stryCov_9fa48("4494", "4495", "4496"), message || (stryMutAct_9fa48("4497") ? "" : (stryCov_9fa48("4497"), "Resource created successfully"))),
      data,
      timestamp: new Date().toISOString()
    });
  }
}

// Response for update operations
function updatedResponse(data, message) {
  if (stryMutAct_9fa48("4498")) {
    {}
  } else {
    stryCov_9fa48("4498");
    return stryMutAct_9fa48("4499") ? {} : (stryCov_9fa48("4499"), {
      success: stryMutAct_9fa48("4500") ? false : (stryCov_9fa48("4500"), true),
      message: stryMutAct_9fa48("4503") ? message && "Resource updated successfully" : stryMutAct_9fa48("4502") ? false : stryMutAct_9fa48("4501") ? true : (stryCov_9fa48("4501", "4502", "4503"), message || (stryMutAct_9fa48("4504") ? "" : (stryCov_9fa48("4504"), "Resource updated successfully"))),
      data,
      timestamp: new Date().toISOString()
    });
  }
}

// Response for delete operations
function deletedResponse(message) {
  if (stryMutAct_9fa48("4505")) {
    {}
  } else {
    stryCov_9fa48("4505");
    return stryMutAct_9fa48("4506") ? {} : (stryCov_9fa48("4506"), {
      success: stryMutAct_9fa48("4507") ? false : (stryCov_9fa48("4507"), true),
      message: stryMutAct_9fa48("4510") ? message && "Resource deleted successfully" : stryMutAct_9fa48("4509") ? false : stryMutAct_9fa48("4508") ? true : (stryCov_9fa48("4508", "4509", "4510"), message || (stryMutAct_9fa48("4511") ? "" : (stryCov_9fa48("4511"), "Resource deleted successfully"))),
      timestamp: new Date().toISOString()
    });
  }
}

// Response for authentication operations
function authResponse(data, message) {
  if (stryMutAct_9fa48("4512")) {
    {}
  } else {
    stryCov_9fa48("4512");
    return stryMutAct_9fa48("4513") ? {} : (stryCov_9fa48("4513"), {
      success: stryMutAct_9fa48("4514") ? false : (stryCov_9fa48("4514"), true),
      message: stryMutAct_9fa48("4517") ? message && "Authentication successful" : stryMutAct_9fa48("4516") ? false : stryMutAct_9fa48("4515") ? true : (stryCov_9fa48("4515", "4516", "4517"), message || (stryMutAct_9fa48("4518") ? "" : (stryCov_9fa48("4518"), "Authentication successful"))),
      data: stryMutAct_9fa48("4519") ? {} : (stryCov_9fa48("4519"), {
        user: data.user,
        token: data.token
      }),
      timestamp: new Date().toISOString()
    });
  }
}
export { successResponse, errorResponse, listResponse, createdResponse, updatedResponse, deletedResponse, authResponse };