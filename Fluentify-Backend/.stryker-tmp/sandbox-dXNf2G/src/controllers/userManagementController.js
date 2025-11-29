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
import userManagementService from '../services/userManagementService.js';
import emailService from '../utils/emailService.js';
import { validationResult } from 'express-validator';
class UserManagementController {
  /**
   * Get all users with pagination
   * GET /api/admin/users
   * Query params: page (default: 1), limit (default: 20)
   */
  async getAllUsers(req, res, next) {
    if (stryMutAct_9fa48("1816")) {
      {}
    } else {
      stryCov_9fa48("1816");
      try {
        if (stryMutAct_9fa48("1817")) {
          {}
        } else {
          stryCov_9fa48("1817");
          const page = stryMutAct_9fa48("1820") ? parseInt(req.query.page) && 1 : stryMutAct_9fa48("1819") ? false : stryMutAct_9fa48("1818") ? true : (stryCov_9fa48("1818", "1819", "1820"), parseInt(req.query.page) || 1);
          const limit = stryMutAct_9fa48("1823") ? parseInt(req.query.limit) && 20 : stryMutAct_9fa48("1822") ? false : stryMutAct_9fa48("1821") ? true : (stryCov_9fa48("1821", "1822", "1823"), parseInt(req.query.limit) || 20);
          const users = await userManagementService.getUsersList(page, limit);
          res.status(200).json(users);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1824")) {
          {}
        } else {
          stryCov_9fa48("1824");
          next(error);
        }
      }
    }
  }

  /**
   * Search users by name or email
   * GET /api/admin/users/search?q=searchTerm
   */
  async searchUsers(req, res, next) {
    if (stryMutAct_9fa48("1825")) {
      {}
    } else {
      stryCov_9fa48("1825");
      try {
        if (stryMutAct_9fa48("1826")) {
          {}
        } else {
          stryCov_9fa48("1826");
          const {
            q
          } = req.query;
          if (stryMutAct_9fa48("1829") ? false : stryMutAct_9fa48("1828") ? true : stryMutAct_9fa48("1827") ? q : (stryCov_9fa48("1827", "1828", "1829"), !q)) {
            if (stryMutAct_9fa48("1830")) {
              {}
            } else {
              stryCov_9fa48("1830");
              return res.status(400).json(stryMutAct_9fa48("1831") ? {} : (stryCov_9fa48("1831"), {
                message: stryMutAct_9fa48("1832") ? "" : (stryCov_9fa48("1832"), 'Search query is required')
              }));
            }
          }
          const users = await userManagementService.findUsers(q);
          res.status(200).json(users);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1833")) {
          {}
        } else {
          stryCov_9fa48("1833");
          next(error);
        }
      }
    }
  }

  /**
   * Get user details and progress
   * GET /api/admin/users/:userId
   */
  async getUserDetails(req, res, next) {
    if (stryMutAct_9fa48("1834")) {
      {}
    } else {
      stryCov_9fa48("1834");
      try {
        if (stryMutAct_9fa48("1835")) {
          {}
        } else {
          stryCov_9fa48("1835");
          const user = await userManagementService.getUserWithProgress(req.params.userId);
          if (stryMutAct_9fa48("1838") ? false : stryMutAct_9fa48("1837") ? true : stryMutAct_9fa48("1836") ? user : (stryCov_9fa48("1836", "1837", "1838"), !user)) {
            if (stryMutAct_9fa48("1839")) {
              {}
            } else {
              stryCov_9fa48("1839");
              return res.status(404).json(stryMutAct_9fa48("1840") ? {} : (stryCov_9fa48("1840"), {
                message: stryMutAct_9fa48("1841") ? "" : (stryCov_9fa48("1841"), 'User not found')
              }));
            }
          }
          res.status(200).json(user);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1842")) {
          {}
        } else {
          stryCov_9fa48("1842");
          next(error);
        }
      }
    }
  }

  /**
   * Update user profile
   * PUT /api/admin/users/:userId
   */
  async updateUser(req, res, next) {
    if (stryMutAct_9fa48("1843")) {
      {}
    } else {
      stryCov_9fa48("1843");
      try {
        if (stryMutAct_9fa48("1844")) {
          {}
        } else {
          stryCov_9fa48("1844");
          const errors = validationResult(req);
          if (stryMutAct_9fa48("1847") ? false : stryMutAct_9fa48("1846") ? true : stryMutAct_9fa48("1845") ? errors.isEmpty() : (stryCov_9fa48("1845", "1846", "1847"), !errors.isEmpty())) {
            if (stryMutAct_9fa48("1848")) {
              {}
            } else {
              stryCov_9fa48("1848");
              return res.status(400).json(stryMutAct_9fa48("1849") ? {} : (stryCov_9fa48("1849"), {
                errors: errors.array()
              }));
            }
          }

          // Get current user data before update
          const currentUser = await userManagementService.getUserWithProgress(req.params.userId);
          if (stryMutAct_9fa48("1852") ? !currentUser && !currentUser.user : stryMutAct_9fa48("1851") ? false : stryMutAct_9fa48("1850") ? true : (stryCov_9fa48("1850", "1851", "1852"), (stryMutAct_9fa48("1853") ? currentUser : (stryCov_9fa48("1853"), !currentUser)) || (stryMutAct_9fa48("1854") ? currentUser.user : (stryCov_9fa48("1854"), !currentUser.user)))) {
            if (stryMutAct_9fa48("1855")) {
              {}
            } else {
              stryCov_9fa48("1855");
              return res.status(404).json(stryMutAct_9fa48("1856") ? {} : (stryCov_9fa48("1856"), {
                message: stryMutAct_9fa48("1857") ? "" : (stryCov_9fa48("1857"), 'User not found')
              }));
            }
          }

          // Update user
          const updatedUser = await userManagementService.updateUserData(req.params.userId, req.body);

          // Track changes for email notification
          const changes = {};
          if (stryMutAct_9fa48("1860") ? req.body.name || req.body.name !== currentUser.user.name : stryMutAct_9fa48("1859") ? false : stryMutAct_9fa48("1858") ? true : (stryCov_9fa48("1858", "1859", "1860"), req.body.name && (stryMutAct_9fa48("1862") ? req.body.name === currentUser.user.name : stryMutAct_9fa48("1861") ? true : (stryCov_9fa48("1861", "1862"), req.body.name !== currentUser.user.name)))) {
            if (stryMutAct_9fa48("1863")) {
              {}
            } else {
              stryCov_9fa48("1863");
              changes.name = stryMutAct_9fa48("1864") ? {} : (stryCov_9fa48("1864"), {
                old: currentUser.user.name,
                new: req.body.name
              });
            }
          }
          if (stryMutAct_9fa48("1867") ? req.body.email || req.body.email !== currentUser.user.email : stryMutAct_9fa48("1866") ? false : stryMutAct_9fa48("1865") ? true : (stryCov_9fa48("1865", "1866", "1867"), req.body.email && (stryMutAct_9fa48("1869") ? req.body.email === currentUser.user.email : stryMutAct_9fa48("1868") ? true : (stryCov_9fa48("1868", "1869"), req.body.email !== currentUser.user.email)))) {
            if (stryMutAct_9fa48("1870")) {
              {}
            } else {
              stryCov_9fa48("1870");
              changes.email = stryMutAct_9fa48("1871") ? {} : (stryCov_9fa48("1871"), {
                old: currentUser.user.email,
                new: req.body.email
              });
            }
          }

          // Send email notification if there are changes
          if (stryMutAct_9fa48("1875") ? Object.keys(changes).length <= 0 : stryMutAct_9fa48("1874") ? Object.keys(changes).length >= 0 : stryMutAct_9fa48("1873") ? false : stryMutAct_9fa48("1872") ? true : (stryCov_9fa48("1872", "1873", "1874", "1875"), Object.keys(changes).length > 0)) {
            if (stryMutAct_9fa48("1876")) {
              {}
            } else {
              stryCov_9fa48("1876");
              const emailToSend = stryMutAct_9fa48("1879") ? req.body.email && currentUser.user.email : stryMutAct_9fa48("1878") ? false : stryMutAct_9fa48("1877") ? true : (stryCov_9fa48("1877", "1878", "1879"), req.body.email || currentUser.user.email);
              const nameToUse = stryMutAct_9fa48("1882") ? req.body.name && currentUser.user.name : stryMutAct_9fa48("1881") ? false : stryMutAct_9fa48("1880") ? true : (stryCov_9fa48("1880", "1881", "1882"), req.body.name || currentUser.user.name);

              // Send email asynchronously (don't wait for it)
              emailService.sendAdminProfileChangeNotification(emailToSend, nameToUse, changes).then(result => {
                if (stryMutAct_9fa48("1883")) {
                  {}
                } else {
                  stryCov_9fa48("1883");
                  if (stryMutAct_9fa48("1885") ? false : stryMutAct_9fa48("1884") ? true : (stryCov_9fa48("1884", "1885"), result.success)) {
                    if (stryMutAct_9fa48("1886")) {
                      {}
                    } else {
                      stryCov_9fa48("1886");
                      console.log(stryMutAct_9fa48("1887") ? "" : (stryCov_9fa48("1887"), '✅ Profile update notification sent to:'), emailToSend);
                    }
                  } else {
                    if (stryMutAct_9fa48("1888")) {
                      {}
                    } else {
                      stryCov_9fa48("1888");
                      console.log(stryMutAct_9fa48("1889") ? "" : (stryCov_9fa48("1889"), '⚠️ Failed to send notification email:'), result.error);
                    }
                  }
                }
              }).catch(err => {
                if (stryMutAct_9fa48("1890")) {
                  {}
                } else {
                  stryCov_9fa48("1890");
                  console.error(stryMutAct_9fa48("1891") ? "" : (stryCov_9fa48("1891"), '❌ Email notification error:'), err);
                }
              });
            }
          }
          res.status(200).json(updatedUser);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1892")) {
          {}
        } else {
          stryCov_9fa48("1892");
          next(error);
        }
      }
    }
  }

  /**
   * Delete a user
   * DELETE /api/admin/users/:userId
   */
  async deleteUser(req, res, next) {
    if (stryMutAct_9fa48("1893")) {
      {}
    } else {
      stryCov_9fa48("1893");
      try {
        if (stryMutAct_9fa48("1894")) {
          {}
        } else {
          stryCov_9fa48("1894");
          await userManagementService.deleteUser(req.params.userId);
          res.status(200).json(stryMutAct_9fa48("1895") ? {} : (stryCov_9fa48("1895"), {
            message: stryMutAct_9fa48("1896") ? "" : (stryCov_9fa48("1896"), 'User deleted successfully')
          }));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1897")) {
          {}
        } else {
          stryCov_9fa48("1897");
          next(error);
        }
      }
    }
  }
}
export default new UserManagementController();