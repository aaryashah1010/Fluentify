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
import adminUserRepository from '../repositories/adminUserRepository.js';
import courseRepository from '../repositories/courseRepository.js';
import { listResponse, successResponse } from '../utils/response.js';
import { validateEmail, validateName } from '../utils/validation.js';
import { ERRORS } from '../utils/error.js';
import emailService from '../utils/emailService.js';
class AdminUserController {
  async listLearners(req, res, next) {
    if (stryMutAct_9fa48("0")) {
      {}
    } else {
      stryCov_9fa48("0");
      try {
        if (stryMutAct_9fa48("1")) {
          {}
        } else {
          stryCov_9fa48("1");
          const page = stryMutAct_9fa48("2") ? Math.min(parseInt(req.query.page || '1', 10), 1) : (stryCov_9fa48("2"), Math.max(parseInt(stryMutAct_9fa48("5") ? req.query.page && '1' : stryMutAct_9fa48("4") ? false : stryMutAct_9fa48("3") ? true : (stryCov_9fa48("3", "4", "5"), req.query.page || (stryMutAct_9fa48("6") ? "" : (stryCov_9fa48("6"), '1'))), 10), 1));
          const limit = stryMutAct_9fa48("7") ? Math.max(Math.max(parseInt(req.query.limit || '20', 10), 1), 100) : (stryCov_9fa48("7"), Math.min(stryMutAct_9fa48("8") ? Math.min(parseInt(req.query.limit || '20', 10), 1) : (stryCov_9fa48("8"), Math.max(parseInt(stryMutAct_9fa48("11") ? req.query.limit && '20' : stryMutAct_9fa48("10") ? false : stryMutAct_9fa48("9") ? true : (stryCov_9fa48("9", "10", "11"), req.query.limit || (stryMutAct_9fa48("12") ? "" : (stryCov_9fa48("12"), '20'))), 10), 1)), 100));
          const offset = stryMutAct_9fa48("13") ? (page - 1) / limit : (stryCov_9fa48("13"), (stryMutAct_9fa48("14") ? page + 1 : (stryCov_9fa48("14"), page - 1)) * limit);
          const search = stryMutAct_9fa48("15") ? req.query.search || '' : (stryCov_9fa48("15"), (stryMutAct_9fa48("18") ? req.query.search && '' : stryMutAct_9fa48("17") ? false : stryMutAct_9fa48("16") ? true : (stryCov_9fa48("16", "17", "18"), req.query.search || (stryMutAct_9fa48("19") ? "Stryker was here!" : (stryCov_9fa48("19"), '')))).trim());
          const [items, total] = await Promise.all(stryMutAct_9fa48("20") ? [] : (stryCov_9fa48("20"), [adminUserRepository.findLearners(stryMutAct_9fa48("21") ? {} : (stryCov_9fa48("21"), {
            search,
            limit,
            offset
          })), adminUserRepository.countLearners(stryMutAct_9fa48("22") ? {} : (stryCov_9fa48("22"), {
            search
          }))]));
          res.json(listResponse(items, total, page, limit));
        }
      } catch (error) {
        if (stryMutAct_9fa48("23")) {
          {}
        } else {
          stryCov_9fa48("23");
          next(error);
        }
      }
    }
  }
  async getLearnerDetails(req, res, next) {
    if (stryMutAct_9fa48("24")) {
      {}
    } else {
      stryCov_9fa48("24");
      try {
        if (stryMutAct_9fa48("25")) {
          {}
        } else {
          stryCov_9fa48("25");
          const {
            id
          } = req.params;
          const basic = await adminUserRepository.getLearnerBasicById(id);
          if (stryMutAct_9fa48("28") ? false : stryMutAct_9fa48("27") ? true : stryMutAct_9fa48("26") ? basic : (stryCov_9fa48("26", "27", "28"), !basic)) {
            if (stryMutAct_9fa48("29")) {
              {}
            } else {
              stryCov_9fa48("29");
              throw ERRORS.USER_NOT_FOUND;
            }
          }
          const [summary, courses] = await Promise.all(stryMutAct_9fa48("30") ? [] : (stryCov_9fa48("30"), [adminUserRepository.getLearnerProgressSummary(id), courseRepository.findLearnerCoursesWithStats(id)]));
          res.json(successResponse(stryMutAct_9fa48("31") ? {} : (stryCov_9fa48("31"), {
            user: basic,
            summary,
            courses
          }), stryMutAct_9fa48("32") ? "" : (stryCov_9fa48("32"), 'Learner details retrieved')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("33")) {
          {}
        } else {
          stryCov_9fa48("33");
          next(error);
        }
      }
    }
  }
  async updateLearner(req, res, next) {
    if (stryMutAct_9fa48("34")) {
      {}
    } else {
      stryCov_9fa48("34");
      try {
        if (stryMutAct_9fa48("35")) {
          {}
        } else {
          stryCov_9fa48("35");
          const {
            id
          } = req.params;
          const {
            name,
            email
          } = stryMutAct_9fa48("38") ? req.body && {} : stryMutAct_9fa48("37") ? false : stryMutAct_9fa48("36") ? true : (stryCov_9fa48("36", "37", "38"), req.body || {});
          if (stryMutAct_9fa48("41") ? !name || !email : stryMutAct_9fa48("40") ? false : stryMutAct_9fa48("39") ? true : (stryCov_9fa48("39", "40", "41"), (stryMutAct_9fa48("42") ? name : (stryCov_9fa48("42"), !name)) && (stryMutAct_9fa48("43") ? email : (stryCov_9fa48("43"), !email)))) {
            if (stryMutAct_9fa48("44")) {
              {}
            } else {
              stryCov_9fa48("44");
              return res.status(400).json(stryMutAct_9fa48("45") ? {} : (stryCov_9fa48("45"), {
                success: stryMutAct_9fa48("46") ? true : (stryCov_9fa48("46"), false),
                message: stryMutAct_9fa48("47") ? "" : (stryCov_9fa48("47"), 'Nothing to update')
              }));
            }
          }
          if (stryMutAct_9fa48("49") ? false : stryMutAct_9fa48("48") ? true : (stryCov_9fa48("48", "49"), name)) {
            if (stryMutAct_9fa48("50")) {
              {}
            } else {
              stryCov_9fa48("50");
              const nv = validateName(name);
              if (stryMutAct_9fa48("53") ? false : stryMutAct_9fa48("52") ? true : stryMutAct_9fa48("51") ? nv.isValid : (stryCov_9fa48("51", "52", "53"), !nv.isValid)) {
                if (stryMutAct_9fa48("54")) {
                  {}
                } else {
                  stryCov_9fa48("54");
                  return res.status(400).json(stryMutAct_9fa48("55") ? {} : (stryCov_9fa48("55"), {
                    success: stryMutAct_9fa48("56") ? true : (stryCov_9fa48("56"), false),
                    message: nv.errors.join(stryMutAct_9fa48("57") ? "" : (stryCov_9fa48("57"), ', '))
                  }));
                }
              }
            }
          }
          if (stryMutAct_9fa48("59") ? false : stryMutAct_9fa48("58") ? true : (stryCov_9fa48("58", "59"), email)) {
            if (stryMutAct_9fa48("60")) {
              {}
            } else {
              stryCov_9fa48("60");
              const ev = validateEmail(email);
              if (stryMutAct_9fa48("63") ? false : stryMutAct_9fa48("62") ? true : stryMutAct_9fa48("61") ? ev.isValid : (stryCov_9fa48("61", "62", "63"), !ev.isValid)) {
                if (stryMutAct_9fa48("64")) {
                  {}
                } else {
                  stryCov_9fa48("64");
                  return res.status(400).json(stryMutAct_9fa48("65") ? {} : (stryCov_9fa48("65"), {
                    success: stryMutAct_9fa48("66") ? true : (stryCov_9fa48("66"), false),
                    message: ev.errors.join(stryMutAct_9fa48("67") ? "" : (stryCov_9fa48("67"), ', '))
                  }));
                }
              }
            }
          }
          const before = await adminUserRepository.getLearnerBasicById(id);
          if (stryMutAct_9fa48("70") ? false : stryMutAct_9fa48("69") ? true : stryMutAct_9fa48("68") ? before : (stryCov_9fa48("68", "69", "70"), !before)) {
            if (stryMutAct_9fa48("71")) {
              {}
            } else {
              stryCov_9fa48("71");
              throw ERRORS.USER_NOT_FOUND;
            }
          }
          const updated = await adminUserRepository.updateLearnerProfile(id, stryMutAct_9fa48("72") ? {} : (stryCov_9fa48("72"), {
            name,
            email
          }));
          if (stryMutAct_9fa48("75") ? false : stryMutAct_9fa48("74") ? true : stryMutAct_9fa48("73") ? updated : (stryCov_9fa48("73", "74", "75"), !updated)) {
            if (stryMutAct_9fa48("76")) {
              {}
            } else {
              stryCov_9fa48("76");
              throw ERRORS.USER_NOT_FOUND;
            }
          }

          // Email notify learner (non-blocking)
          try {
            if (stryMutAct_9fa48("77")) {
              {}
            } else {
              stryCov_9fa48("77");
              const changes = stryMutAct_9fa48("78") ? ["Stryker was here"] : (stryCov_9fa48("78"), []);
              if (stryMutAct_9fa48("81") ? name || name !== before.name : stryMutAct_9fa48("80") ? false : stryMutAct_9fa48("79") ? true : (stryCov_9fa48("79", "80", "81"), name && (stryMutAct_9fa48("83") ? name === before.name : stryMutAct_9fa48("82") ? true : (stryCov_9fa48("82", "83"), name !== before.name)))) {
                if (stryMutAct_9fa48("84")) {
                  {}
                } else {
                  stryCov_9fa48("84");
                  changes.push(stryMutAct_9fa48("85") ? {} : (stryCov_9fa48("85"), {
                    field: stryMutAct_9fa48("86") ? "" : (stryCov_9fa48("86"), 'Name'),
                    from: before.name,
                    to: updated.name
                  }));
                }
              }
              if (stryMutAct_9fa48("89") ? email || email.toLowerCase() !== before.email.toLowerCase() : stryMutAct_9fa48("88") ? false : stryMutAct_9fa48("87") ? true : (stryCov_9fa48("87", "88", "89"), email && (stryMutAct_9fa48("91") ? email.toLowerCase() === before.email.toLowerCase() : stryMutAct_9fa48("90") ? true : (stryCov_9fa48("90", "91"), (stryMutAct_9fa48("92") ? email.toUpperCase() : (stryCov_9fa48("92"), email.toLowerCase())) !== (stryMutAct_9fa48("93") ? before.email.toUpperCase() : (stryCov_9fa48("93"), before.email.toLowerCase())))))) {
                if (stryMutAct_9fa48("94")) {
                  {}
                } else {
                  stryCov_9fa48("94");
                  changes.push(stryMutAct_9fa48("95") ? {} : (stryCov_9fa48("95"), {
                    field: stryMutAct_9fa48("96") ? "" : (stryCov_9fa48("96"), 'Email'),
                    from: before.email,
                    to: updated.email
                  }));
                }
              }
              emailService.sendAdminProfileChangeNotification(updated.email, stryMutAct_9fa48("99") ? updated.name && before.name : stryMutAct_9fa48("98") ? false : stryMutAct_9fa48("97") ? true : (stryCov_9fa48("97", "98", "99"), updated.name || before.name), changes).catch(() => {});
            }
          } catch {}
          res.json(successResponse(stryMutAct_9fa48("100") ? {} : (stryCov_9fa48("100"), {
            user: updated
          }), stryMutAct_9fa48("101") ? "" : (stryCov_9fa48("101"), 'Learner updated successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("102")) {
          {}
        } else {
          stryCov_9fa48("102");
          next(error);
        }
      }
    }
  }
}
export default new AdminUserController();