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
  if (stryMutAct_9fa48("1490")) {
    {}
  } else {
    stryCov_9fa48("1490");
    return stryMutAct_9fa48("1491") ? {} : (stryCov_9fa48("1491"), {
      success: stryMutAct_9fa48("1492") ? false : (stryCov_9fa48("1492"), true),
      message: stryMutAct_9fa48("1495") ? message && "Operation successful" : stryMutAct_9fa48("1494") ? false : stryMutAct_9fa48("1493") ? true : (stryCov_9fa48("1493", "1494", "1495"), message || (stryMutAct_9fa48("1496") ? "" : (stryCov_9fa48("1496"), "Operation successful"))),
      data,
      timestamp: new Date().toISOString()
    });
  }
}

// Standard error response format
function errorResponse(message, code = 10000) {
  if (stryMutAct_9fa48("1497")) {
    {}
  } else {
    stryCov_9fa48("1497");
    return stryMutAct_9fa48("1498") ? {} : (stryCov_9fa48("1498"), {
      success: stryMutAct_9fa48("1499") ? true : (stryCov_9fa48("1499"), false),
      error: stryMutAct_9fa48("1500") ? {} : (stryCov_9fa48("1500"), {
        code,
        message
      }),
      timestamp: new Date().toISOString()
    });
  }
}

// Response for list operations without pagination
function listResponse(data, message, meta) {
  if (stryMutAct_9fa48("1501")) {
    {}
  } else {
    stryCov_9fa48("1501");
    return stryMutAct_9fa48("1502") ? {} : (stryCov_9fa48("1502"), {
      success: stryMutAct_9fa48("1503") ? false : (stryCov_9fa48("1503"), true),
      message: stryMutAct_9fa48("1506") ? message && "Data retrieved successfully" : stryMutAct_9fa48("1505") ? false : stryMutAct_9fa48("1504") ? true : (stryCov_9fa48("1504", "1505", "1506"), message || (stryMutAct_9fa48("1507") ? "" : (stryCov_9fa48("1507"), "Data retrieved successfully"))),
      data,
      meta: stryMutAct_9fa48("1510") ? meta && {
        count: data.length
      } : stryMutAct_9fa48("1509") ? false : stryMutAct_9fa48("1508") ? true : (stryCov_9fa48("1508", "1509", "1510"), meta || (stryMutAct_9fa48("1511") ? {} : (stryCov_9fa48("1511"), {
        count: data.length
      }))),
      timestamp: new Date().toISOString()
    });
  }
}

// Response for creation operations
function createdResponse(data, message) {
  if (stryMutAct_9fa48("1512")) {
    {}
  } else {
    stryCov_9fa48("1512");
    return stryMutAct_9fa48("1513") ? {} : (stryCov_9fa48("1513"), {
      success: stryMutAct_9fa48("1514") ? false : (stryCov_9fa48("1514"), true),
      message: stryMutAct_9fa48("1517") ? message && "Resource created successfully" : stryMutAct_9fa48("1516") ? false : stryMutAct_9fa48("1515") ? true : (stryCov_9fa48("1515", "1516", "1517"), message || (stryMutAct_9fa48("1518") ? "" : (stryCov_9fa48("1518"), "Resource created successfully"))),
      data,
      timestamp: new Date().toISOString()
    });
  }
}

// Response for update operations
function updatedResponse(data, message) {
  if (stryMutAct_9fa48("1519")) {
    {}
  } else {
    stryCov_9fa48("1519");
    return stryMutAct_9fa48("1520") ? {} : (stryCov_9fa48("1520"), {
      success: stryMutAct_9fa48("1521") ? false : (stryCov_9fa48("1521"), true),
      message: stryMutAct_9fa48("1524") ? message && "Resource updated successfully" : stryMutAct_9fa48("1523") ? false : stryMutAct_9fa48("1522") ? true : (stryCov_9fa48("1522", "1523", "1524"), message || (stryMutAct_9fa48("1525") ? "" : (stryCov_9fa48("1525"), "Resource updated successfully"))),
      data,
      timestamp: new Date().toISOString()
    });
  }
}

// Response for delete operations
function deletedResponse(message) {
  if (stryMutAct_9fa48("1526")) {
    {}
  } else {
    stryCov_9fa48("1526");
    return stryMutAct_9fa48("1527") ? {} : (stryCov_9fa48("1527"), {
      success: stryMutAct_9fa48("1528") ? false : (stryCov_9fa48("1528"), true),
      message: stryMutAct_9fa48("1531") ? message && "Resource deleted successfully" : stryMutAct_9fa48("1530") ? false : stryMutAct_9fa48("1529") ? true : (stryCov_9fa48("1529", "1530", "1531"), message || (stryMutAct_9fa48("1532") ? "" : (stryCov_9fa48("1532"), "Resource deleted successfully"))),
      timestamp: new Date().toISOString()
    });
  }
}

// Response for authentication operations
function authResponse(data, message) {
  if (stryMutAct_9fa48("1533")) {
    {}
  } else {
    stryCov_9fa48("1533");
    return stryMutAct_9fa48("1534") ? {} : (stryCov_9fa48("1534"), {
      success: stryMutAct_9fa48("1535") ? false : (stryCov_9fa48("1535"), true),
      message: stryMutAct_9fa48("1538") ? message && "Authentication successful" : stryMutAct_9fa48("1537") ? false : stryMutAct_9fa48("1536") ? true : (stryCov_9fa48("1536", "1537", "1538"), message || (stryMutAct_9fa48("1539") ? "" : (stryCov_9fa48("1539"), "Authentication successful"))),
      data: stryMutAct_9fa48("1540") ? {} : (stryCov_9fa48("1540"), {
        user: data.user,
        token: data.token
      }),
      timestamp: new Date().toISOString()
    });
  }
}
export { successResponse, errorResponse, listResponse, createdResponse, updatedResponse, deletedResponse, authResponse };