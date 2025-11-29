/**
 * Retell AI Controller
 * Handles creating Retell AI call sessions for pronunciation practice
 */
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
import axios from 'axios';
import { successResponse, createdResponse } from '../utils/response.js';
import { ERRORS } from '../utils/error.js';

/**
 * Create a Retell AI call and return access token
 * @route POST /api/retell/create-call
 */
export const createRetellCall = async (req, res, next) => {
  if (stryMutAct_9fa48("1681")) {
    {}
  } else {
    stryCov_9fa48("1681");
    try {
      if (stryMutAct_9fa48("1682")) {
        {}
      } else {
        stryCov_9fa48("1682");
        const {
          agentId
        } = req.body;
        const userId = req.user.id;
        console.log(stryMutAct_9fa48("1683") ? "" : (stryCov_9fa48("1683"), '📞 Creating Retell AI call...'));

        // Validate agent ID
        if (stryMutAct_9fa48("1686") ? false : stryMutAct_9fa48("1685") ? true : stryMutAct_9fa48("1684") ? agentId : (stryCov_9fa48("1684", "1685", "1686"), !agentId)) {
          if (stryMutAct_9fa48("1687")) {
            {}
          } else {
            stryCov_9fa48("1687");
            throw ERRORS.RETELL_AGENT_ID_REQUIRED;
          }
        }

        // Check if Retell API key is configured
        if (stryMutAct_9fa48("1690") ? false : stryMutAct_9fa48("1689") ? true : stryMutAct_9fa48("1688") ? process.env.RETELL_API_KEY : (stryCov_9fa48("1688", "1689", "1690"), !process.env.RETELL_API_KEY)) {
          if (stryMutAct_9fa48("1691")) {
            {}
          } else {
            stryCov_9fa48("1691");
            console.error(stryMutAct_9fa48("1692") ? "" : (stryCov_9fa48("1692"), '❌ RETELL_API_KEY not configured in environment variables'));
            throw ERRORS.RETELL_API_NOT_CONFIGURED;
          }
        }

        // Call Retell API to create a web call
        const response = await axios.post(stryMutAct_9fa48("1693") ? "" : (stryCov_9fa48("1693"), 'https://api.retellai.com/v2/create-web-call'), stryMutAct_9fa48("1694") ? {} : (stryCov_9fa48("1694"), {
          agent_id: agentId,
          metadata: stryMutAct_9fa48("1695") ? {} : (stryCov_9fa48("1695"), {
            user_id: userId,
            created_at: new Date().toISOString()
          })
        }), stryMutAct_9fa48("1696") ? {} : (stryCov_9fa48("1696"), {
          headers: stryMutAct_9fa48("1697") ? {} : (stryCov_9fa48("1697"), {
            'Authorization': stryMutAct_9fa48("1698") ? `` : (stryCov_9fa48("1698"), `Bearer ${process.env.RETELL_API_KEY}`),
            'Content-Type': stryMutAct_9fa48("1699") ? "" : (stryCov_9fa48("1699"), 'application/json')
          })
        }));
        console.log(stryMutAct_9fa48("1700") ? "" : (stryCov_9fa48("1700"), '✅ Retell call created successfully'));

        // Return the access token to frontend
        res.json(createdResponse(stryMutAct_9fa48("1701") ? {} : (stryCov_9fa48("1701"), {
          accessToken: response.data.access_token,
          callId: response.data.call_id,
          agentId: response.data.agent_id
        }), stryMutAct_9fa48("1702") ? "" : (stryCov_9fa48("1702"), 'Call session created successfully! You can now start your pronunciation practice.')));
      }
    } catch (error) {
      if (stryMutAct_9fa48("1703")) {
        {}
      } else {
        stryCov_9fa48("1703");
        console.error(stryMutAct_9fa48("1704") ? "" : (stryCov_9fa48("1704"), '❌ Error creating Retell call:'), stryMutAct_9fa48("1707") ? error.response?.data && error.message : stryMutAct_9fa48("1706") ? false : stryMutAct_9fa48("1705") ? true : (stryCov_9fa48("1705", "1706", "1707"), (stryMutAct_9fa48("1708") ? error.response.data : (stryCov_9fa48("1708"), error.response?.data)) || error.message));

        // Handle Retell API specific errors
        if (stryMutAct_9fa48("1710") ? false : stryMutAct_9fa48("1709") ? true : (stryCov_9fa48("1709", "1710"), error.response)) {
          if (stryMutAct_9fa48("1711")) {
            {}
          } else {
            stryCov_9fa48("1711");
            const status = error.response.status;
            const errorData = error.response.data;

            // Map Retell API errors to our error codes
            if (stryMutAct_9fa48("1714") ? status === 401 && status === 403 : stryMutAct_9fa48("1713") ? false : stryMutAct_9fa48("1712") ? true : (stryCov_9fa48("1712", "1713", "1714"), (stryMutAct_9fa48("1716") ? status !== 401 : stryMutAct_9fa48("1715") ? false : (stryCov_9fa48("1715", "1716"), status === 401)) || (stryMutAct_9fa48("1718") ? status !== 403 : stryMutAct_9fa48("1717") ? false : (stryCov_9fa48("1717", "1718"), status === 403)))) {
              if (stryMutAct_9fa48("1719")) {
                {}
              } else {
                stryCov_9fa48("1719");
                return next(ERRORS.RETELL_AUTHENTICATION_FAILED);
              }
            } else if (stryMutAct_9fa48("1722") ? status !== 429 : stryMutAct_9fa48("1721") ? false : stryMutAct_9fa48("1720") ? true : (stryCov_9fa48("1720", "1721", "1722"), status === 429)) {
              if (stryMutAct_9fa48("1723")) {
                {}
              } else {
                stryCov_9fa48("1723");
                return next(ERRORS.RETELL_RATE_LIMIT);
              }
            } else if (stryMutAct_9fa48("1726") ? status === 400 || errorData?.message?.includes('agent') : stryMutAct_9fa48("1725") ? false : stryMutAct_9fa48("1724") ? true : (stryCov_9fa48("1724", "1725", "1726"), (stryMutAct_9fa48("1728") ? status !== 400 : stryMutAct_9fa48("1727") ? true : (stryCov_9fa48("1727", "1728"), status === 400)) && (stryMutAct_9fa48("1730") ? errorData.message?.includes('agent') : stryMutAct_9fa48("1729") ? errorData?.message.includes('agent') : (stryCov_9fa48("1729", "1730"), errorData?.message?.includes(stryMutAct_9fa48("1731") ? "" : (stryCov_9fa48("1731"), 'agent')))))) {
              if (stryMutAct_9fa48("1732")) {
                {}
              } else {
                stryCov_9fa48("1732");
                return next(ERRORS.RETELL_INVALID_AGENT);
              }
            } else {
              if (stryMutAct_9fa48("1733")) {
                {}
              } else {
                stryCov_9fa48("1733");
                // Generic Retell API error
                const retellError = new Error(stryMutAct_9fa48("1736") ? errorData?.message && ERRORS.RETELL_CALL_CREATION_FAILED.message : stryMutAct_9fa48("1735") ? false : stryMutAct_9fa48("1734") ? true : (stryCov_9fa48("1734", "1735", "1736"), (stryMutAct_9fa48("1737") ? errorData.message : (stryCov_9fa48("1737"), errorData?.message)) || ERRORS.RETELL_CALL_CREATION_FAILED.message));
                retellError.code = ERRORS.RETELL_API_ERROR.code;
                retellError.statusCode = status;
                return next(retellError);
              }
            }
          }
        }

        // Pass other errors (network, etc.) to global error handler
        next(error);
      }
    }
  }
};