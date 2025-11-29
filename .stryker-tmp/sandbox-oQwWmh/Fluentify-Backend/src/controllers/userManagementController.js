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
    if (stryMutAct_9fa48("1818")) {
      {}
    } else {
      stryCov_9fa48("1818");
      try {
        if (stryMutAct_9fa48("1819")) {
          {}
        } else {
          stryCov_9fa48("1819");
          const page = stryMutAct_9fa48("1822") ? parseInt(req.query.page) && 1 : stryMutAct_9fa48("1821") ? false : stryMutAct_9fa48("1820") ? true : (stryCov_9fa48("1820", "1821", "1822"), parseInt(req.query.page) || 1);
          const limit = stryMutAct_9fa48("1825") ? parseInt(req.query.limit) && 20 : stryMutAct_9fa48("1824") ? false : stryMutAct_9fa48("1823") ? true : (stryCov_9fa48("1823", "1824", "1825"), parseInt(req.query.limit) || 20);
          const users = await userManagementService.getUsersList(page, limit);
          res.status(200).json(users);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1826")) {
          {}
        } else {
          stryCov_9fa48("1826");
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
    if (stryMutAct_9fa48("1827")) {
      {}
    } else {
      stryCov_9fa48("1827");
      try {
        if (stryMutAct_9fa48("1828")) {
          {}
        } else {
          stryCov_9fa48("1828");
          const {
            q
          } = req.query;
          if (stryMutAct_9fa48("1831") ? false : stryMutAct_9fa48("1830") ? true : stryMutAct_9fa48("1829") ? q : (stryCov_9fa48("1829", "1830", "1831"), !q)) {
            if (stryMutAct_9fa48("1832")) {
              {}
            } else {
              stryCov_9fa48("1832");
              return res.status(400).json(stryMutAct_9fa48("1833") ? {} : (stryCov_9fa48("1833"), {
                message: stryMutAct_9fa48("1834") ? "" : (stryCov_9fa48("1834"), 'Search query is required')
              }));
            }
          }
          const users = await userManagementService.findUsers(q);
          res.status(200).json(users);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1835")) {
          {}
        } else {
          stryCov_9fa48("1835");
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
    if (stryMutAct_9fa48("1836")) {
      {}
    } else {
      stryCov_9fa48("1836");
      try {
        if (stryMutAct_9fa48("1837")) {
          {}
        } else {
          stryCov_9fa48("1837");
          const user = await userManagementService.getUserWithProgress(req.params.userId);
          if (stryMutAct_9fa48("1840") ? false : stryMutAct_9fa48("1839") ? true : stryMutAct_9fa48("1838") ? user : (stryCov_9fa48("1838", "1839", "1840"), !user)) {
            if (stryMutAct_9fa48("1841")) {
              {}
            } else {
              stryCov_9fa48("1841");
              return res.status(404).json(stryMutAct_9fa48("1842") ? {} : (stryCov_9fa48("1842"), {
                message: stryMutAct_9fa48("1843") ? "" : (stryCov_9fa48("1843"), 'User not found')
              }));
            }
          }
          res.status(200).json(user);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1844")) {
          {}
        } else {
          stryCov_9fa48("1844");
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
    if (stryMutAct_9fa48("1845")) {
      {}
    } else {
      stryCov_9fa48("1845");
      try {
        if (stryMutAct_9fa48("1846")) {
          {}
        } else {
          stryCov_9fa48("1846");
          const errors = validationResult(req);
          if (stryMutAct_9fa48("1849") ? false : stryMutAct_9fa48("1848") ? true : stryMutAct_9fa48("1847") ? errors.isEmpty() : (stryCov_9fa48("1847", "1848", "1849"), !errors.isEmpty())) {
            if (stryMutAct_9fa48("1850")) {
              {}
            } else {
              stryCov_9fa48("1850");
              return res.status(400).json(stryMutAct_9fa48("1851") ? {} : (stryCov_9fa48("1851"), {
                errors: errors.array()
              }));
            }
          }

          // Get current user data before update
          const currentUser = await userManagementService.getUserWithProgress(req.params.userId);
          if (stryMutAct_9fa48("1854") ? !currentUser && !currentUser.user : stryMutAct_9fa48("1853") ? false : stryMutAct_9fa48("1852") ? true : (stryCov_9fa48("1852", "1853", "1854"), (stryMutAct_9fa48("1855") ? currentUser : (stryCov_9fa48("1855"), !currentUser)) || (stryMutAct_9fa48("1856") ? currentUser.user : (stryCov_9fa48("1856"), !currentUser.user)))) {
            if (stryMutAct_9fa48("1857")) {
              {}
            } else {
              stryCov_9fa48("1857");
              return res.status(404).json(stryMutAct_9fa48("1858") ? {} : (stryCov_9fa48("1858"), {
                message: stryMutAct_9fa48("1859") ? "" : (stryCov_9fa48("1859"), 'User not found')
              }));
            }
          }

          // Update user
          const updatedUser = await userManagementService.updateUserData(req.params.userId, req.body);

          // Track changes for email notification
          const changes = {};
          if (stryMutAct_9fa48("1862") ? req.body.name || req.body.name !== currentUser.user.name : stryMutAct_9fa48("1861") ? false : stryMutAct_9fa48("1860") ? true : (stryCov_9fa48("1860", "1861", "1862"), req.body.name && (stryMutAct_9fa48("1864") ? req.body.name === currentUser.user.name : stryMutAct_9fa48("1863") ? true : (stryCov_9fa48("1863", "1864"), req.body.name !== currentUser.user.name)))) {
            if (stryMutAct_9fa48("1865")) {
              {}
            } else {
              stryCov_9fa48("1865");
              changes.name = stryMutAct_9fa48("1866") ? {} : (stryCov_9fa48("1866"), {
                old: currentUser.user.name,
                new: req.body.name
              });
            }
          }
          if (stryMutAct_9fa48("1869") ? req.body.email || req.body.email !== currentUser.user.email : stryMutAct_9fa48("1868") ? false : stryMutAct_9fa48("1867") ? true : (stryCov_9fa48("1867", "1868", "1869"), req.body.email && (stryMutAct_9fa48("1871") ? req.body.email === currentUser.user.email : stryMutAct_9fa48("1870") ? true : (stryCov_9fa48("1870", "1871"), req.body.email !== currentUser.user.email)))) {
            if (stryMutAct_9fa48("1872")) {
              {}
            } else {
              stryCov_9fa48("1872");
              changes.email = stryMutAct_9fa48("1873") ? {} : (stryCov_9fa48("1873"), {
                old: currentUser.user.email,
                new: req.body.email
              });
            }
          }

          // Send email notification if there are changes
          if (stryMutAct_9fa48("1877") ? Object.keys(changes).length <= 0 : stryMutAct_9fa48("1876") ? Object.keys(changes).length >= 0 : stryMutAct_9fa48("1875") ? false : stryMutAct_9fa48("1874") ? true : (stryCov_9fa48("1874", "1875", "1876", "1877"), Object.keys(changes).length > 0)) {
            if (stryMutAct_9fa48("1878")) {
              {}
            } else {
              stryCov_9fa48("1878");
              const emailToSend = stryMutAct_9fa48("1881") ? req.body.email && currentUser.user.email : stryMutAct_9fa48("1880") ? false : stryMutAct_9fa48("1879") ? true : (stryCov_9fa48("1879", "1880", "1881"), req.body.email || currentUser.user.email);
              const nameToUse = stryMutAct_9fa48("1884") ? req.body.name && currentUser.user.name : stryMutAct_9fa48("1883") ? false : stryMutAct_9fa48("1882") ? true : (stryCov_9fa48("1882", "1883", "1884"), req.body.name || currentUser.user.name);

              // Send email asynchronously (don't wait for it)
              emailService.sendAdminProfileChangeNotification(emailToSend, nameToUse, changes).then(result => {
                if (stryMutAct_9fa48("1885")) {
                  {}
                } else {
                  stryCov_9fa48("1885");
                  if (stryMutAct_9fa48("1887") ? false : stryMutAct_9fa48("1886") ? true : (stryCov_9fa48("1886", "1887"), result.success)) {
                    if (stryMutAct_9fa48("1888")) {
                      {}
                    } else {
                      stryCov_9fa48("1888");
                      console.log(stryMutAct_9fa48("1889") ? "" : (stryCov_9fa48("1889"), '✅ Profile update notification sent to:'), emailToSend);
                    }
                  } else {
                    if (stryMutAct_9fa48("1890")) {
                      {}
                    } else {
                      stryCov_9fa48("1890");
                      console.log(stryMutAct_9fa48("1891") ? "" : (stryCov_9fa48("1891"), '⚠️ Failed to send notification email:'), result.error);
                    }
                  }
                }
              }).catch(err => {
                if (stryMutAct_9fa48("1892")) {
                  {}
                } else {
                  stryCov_9fa48("1892");
                  console.error(stryMutAct_9fa48("1893") ? "" : (stryCov_9fa48("1893"), '❌ Email notification error:'), err);
                }
              });
            }
          }
          res.status(200).json(updatedUser);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1894")) {
          {}
        } else {
          stryCov_9fa48("1894");
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
    if (stryMutAct_9fa48("1895")) {
      {}
    } else {
      stryCov_9fa48("1895");
      try {
        if (stryMutAct_9fa48("1896")) {
          {}
        } else {
          stryCov_9fa48("1896");
          await userManagementService.deleteUser(req.params.userId);
          res.status(200).json(stryMutAct_9fa48("1897") ? {} : (stryCov_9fa48("1897"), {
            message: stryMutAct_9fa48("1898") ? "" : (stryCov_9fa48("1898"), 'User deleted successfully')
          }));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1899")) {
          {}
        } else {
          stryCov_9fa48("1899");
          next(error);
        }
      }
    }
  }
}
export default new UserManagementController();