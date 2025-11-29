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
import bcrypt from 'bcrypt';
import authRepository from '../repositories/authRepository.js';
import { createAuthToken } from '../utils/jwt.js';
import { authResponse, successResponse } from '../utils/response.js';
import { ERRORS } from '../utils/error.js';
import emailService from '../utils/emailService.js';
import { validateName, validateEmail, validatePassword, validateOTP, generatePasswordSuggestions } from '../utils/validation.js';
import db from '../config/db.js';
class AuthController {
  /**
   * Initiate signup for learners - Send OTP
   */
  async signupLearner(req, res, next) {
    if (stryMutAct_9fa48("137")) {
      {}
    } else {
      stryCov_9fa48("137");
      try {
        if (stryMutAct_9fa48("138")) {
          {}
        } else {
          stryCov_9fa48("138");
          const {
            name,
            email,
            password
          } = req.body;
          if (stryMutAct_9fa48("141") ? (!name || !email) && !password : stryMutAct_9fa48("140") ? false : stryMutAct_9fa48("139") ? true : (stryCov_9fa48("139", "140", "141"), (stryMutAct_9fa48("143") ? !name && !email : stryMutAct_9fa48("142") ? false : (stryCov_9fa48("142", "143"), (stryMutAct_9fa48("144") ? name : (stryCov_9fa48("144"), !name)) || (stryMutAct_9fa48("145") ? email : (stryCov_9fa48("145"), !email)))) || (stryMutAct_9fa48("146") ? password : (stryCov_9fa48("146"), !password)))) {
            if (stryMutAct_9fa48("147")) {
              {}
            } else {
              stryCov_9fa48("147");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }

          // Validate name
          const nameValidation = validateName(name);
          if (stryMutAct_9fa48("150") ? false : stryMutAct_9fa48("149") ? true : stryMutAct_9fa48("148") ? nameValidation.isValid : (stryCov_9fa48("148", "149", "150"), !nameValidation.isValid)) {
            if (stryMutAct_9fa48("151")) {
              {}
            } else {
              stryCov_9fa48("151");
              return res.status(400).json(stryMutAct_9fa48("152") ? {} : (stryCov_9fa48("152"), {
                success: stryMutAct_9fa48("153") ? true : (stryCov_9fa48("153"), false),
                message: nameValidation.errors.join(stryMutAct_9fa48("154") ? "" : (stryCov_9fa48("154"), ', '))
              }));
            }
          }

          // Validate email
          const emailValidation = validateEmail(email);
          if (stryMutAct_9fa48("157") ? false : stryMutAct_9fa48("156") ? true : stryMutAct_9fa48("155") ? emailValidation.isValid : (stryCov_9fa48("155", "156", "157"), !emailValidation.isValid)) {
            if (stryMutAct_9fa48("158")) {
              {}
            } else {
              stryCov_9fa48("158");
              return res.status(400).json(stryMutAct_9fa48("159") ? {} : (stryCov_9fa48("159"), {
                success: stryMutAct_9fa48("160") ? true : (stryCov_9fa48("160"), false),
                message: emailValidation.errors.join(stryMutAct_9fa48("161") ? "" : (stryCov_9fa48("161"), ', '))
              }));
            }
          }

          // Validate password
          const passwordValidation = validatePassword(password, email, name);
          if (stryMutAct_9fa48("164") ? false : stryMutAct_9fa48("163") ? true : stryMutAct_9fa48("162") ? passwordValidation.isValid : (stryCov_9fa48("162", "163", "164"), !passwordValidation.isValid)) {
            if (stryMutAct_9fa48("165")) {
              {}
            } else {
              stryCov_9fa48("165");
              return res.status(400).json(stryMutAct_9fa48("166") ? {} : (stryCov_9fa48("166"), {
                success: stryMutAct_9fa48("167") ? true : (stryCov_9fa48("167"), false),
                message: passwordValidation.errors.join(stryMutAct_9fa48("168") ? "" : (stryCov_9fa48("168"), ', ')),
                suggestions: generatePasswordSuggestions(3)
              }));
            }
          }

          // Check if email already exists
          const existingUser = await authRepository.findLearnerByEmail(email);
          if (stryMutAct_9fa48("170") ? false : stryMutAct_9fa48("169") ? true : (stryCov_9fa48("169", "170"), existingUser)) {
            if (stryMutAct_9fa48("171")) {
              {}
            } else {
              stryCov_9fa48("171");
              throw ERRORS.EMAIL_ALREADY_EXISTS;
            }
          }

          // Generate and store OTP
          const otp = emailService.generateOTP();
          await authRepository.storeOTP(email, otp, stryMutAct_9fa48("172") ? "" : (stryCov_9fa48("172"), 'signup'), stryMutAct_9fa48("173") ? "" : (stryCov_9fa48("173"), 'learner'));

          // Send OTP email
          await emailService.sendSignupOTP(email, name, otp);
          res.json(successResponse(stryMutAct_9fa48("174") ? {} : (stryCov_9fa48("174"), {
            email,
            message: stryMutAct_9fa48("175") ? "" : (stryCov_9fa48("175"), 'OTP sent to your email')
          }), stryMutAct_9fa48("176") ? "" : (stryCov_9fa48("176"), 'Please verify your email with the OTP sent')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("177")) {
          {}
        } else {
          stryCov_9fa48("177");
          console.error(stryMutAct_9fa48("178") ? "" : (stryCov_9fa48("178"), 'Error in learner signup:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Verify OTP and complete signup for learners
   */
  async verifySignupLearner(req, res, next) {
    if (stryMutAct_9fa48("179")) {
      {}
    } else {
      stryCov_9fa48("179");
      try {
        if (stryMutAct_9fa48("180")) {
          {}
        } else {
          stryCov_9fa48("180");
          const {
            name,
            email,
            password,
            otp
          } = req.body;
          if (stryMutAct_9fa48("183") ? (!name || !email || !password) && !otp : stryMutAct_9fa48("182") ? false : stryMutAct_9fa48("181") ? true : (stryCov_9fa48("181", "182", "183"), (stryMutAct_9fa48("185") ? (!name || !email) && !password : stryMutAct_9fa48("184") ? false : (stryCov_9fa48("184", "185"), (stryMutAct_9fa48("187") ? !name && !email : stryMutAct_9fa48("186") ? false : (stryCov_9fa48("186", "187"), (stryMutAct_9fa48("188") ? name : (stryCov_9fa48("188"), !name)) || (stryMutAct_9fa48("189") ? email : (stryCov_9fa48("189"), !email)))) || (stryMutAct_9fa48("190") ? password : (stryCov_9fa48("190"), !password)))) || (stryMutAct_9fa48("191") ? otp : (stryCov_9fa48("191"), !otp)))) {
            if (stryMutAct_9fa48("192")) {
              {}
            } else {
              stryCov_9fa48("192");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }

          // Validate OTP format
          const otpValidation = validateOTP(otp);
          if (stryMutAct_9fa48("195") ? false : stryMutAct_9fa48("194") ? true : stryMutAct_9fa48("193") ? otpValidation.isValid : (stryCov_9fa48("193", "194", "195"), !otpValidation.isValid)) {
            if (stryMutAct_9fa48("196")) {
              {}
            } else {
              stryCov_9fa48("196");
              return res.status(400).json(stryMutAct_9fa48("197") ? {} : (stryCov_9fa48("197"), {
                success: stryMutAct_9fa48("198") ? true : (stryCov_9fa48("198"), false),
                message: otpValidation.errors.join(stryMutAct_9fa48("199") ? "" : (stryCov_9fa48("199"), ', '))
              }));
            }
          }

          // Verify OTP
          const otpRecord = await authRepository.verifyOTP(email, otp, stryMutAct_9fa48("200") ? "" : (stryCov_9fa48("200"), 'signup'), stryMutAct_9fa48("201") ? "" : (stryCov_9fa48("201"), 'learner'));
          if (stryMutAct_9fa48("204") ? false : stryMutAct_9fa48("203") ? true : stryMutAct_9fa48("202") ? otpRecord : (stryCov_9fa48("202", "203", "204"), !otpRecord)) {
            if (stryMutAct_9fa48("205")) {
              {}
            } else {
              stryCov_9fa48("205");
              return res.status(400).json(stryMutAct_9fa48("206") ? {} : (stryCov_9fa48("206"), {
                success: stryMutAct_9fa48("207") ? true : (stryCov_9fa48("207"), false),
                message: stryMutAct_9fa48("208") ? "" : (stryCov_9fa48("208"), 'Invalid or expired OTP')
              }));
            }
          }

          // Check if email already exists
          const existingUser = await authRepository.findLearnerByEmail(email);
          if (stryMutAct_9fa48("210") ? false : stryMutAct_9fa48("209") ? true : (stryCov_9fa48("209", "210"), existingUser)) {
            if (stryMutAct_9fa48("211")) {
              {}
            } else {
              stryCov_9fa48("211");
              throw ERRORS.EMAIL_ALREADY_EXISTS;
            }
          }

          // Hash password
          const passwordHash = await bcrypt.hash(password, 10);

          // Start transaction
          await authRepository.beginTransaction();
          try {
            if (stryMutAct_9fa48("212")) {
              {}
            } else {
              stryCov_9fa48("212");
              // Create learner
              const learner = await authRepository.createLearner(name, email, passwordHash);

              // Mark email as verified
              await authRepository.markLearnerEmailVerified(email);

              // Mark OTP as used
              await authRepository.markOTPAsUsed(otpRecord.id);

              // Set has_preferences to false for new users
              const user = stryMutAct_9fa48("213") ? {} : (stryCov_9fa48("213"), {
                ...learner,
                has_preferences: stryMutAct_9fa48("214") ? true : (stryCov_9fa48("214"), false),
                is_email_verified: stryMutAct_9fa48("215") ? false : (stryCov_9fa48("215"), true)
              });
              const token = createAuthToken(stryMutAct_9fa48("216") ? {} : (stryCov_9fa48("216"), {
                id: user.id,
                email: user.email,
                role: stryMutAct_9fa48("217") ? "" : (stryCov_9fa48("217"), 'learner'),
                hasPreferences: stryMutAct_9fa48("218") ? true : (stryCov_9fa48("218"), false)
              }));
              await authRepository.commitTransaction();

              // Send welcome email (non-blocking)
              emailService.sendWelcomeEmail(email, name).catch(stryMutAct_9fa48("219") ? () => undefined : (stryCov_9fa48("219"), err => console.error(stryMutAct_9fa48("220") ? "" : (stryCov_9fa48("220"), 'Failed to send welcome email:'), err)));
              res.json(authResponse(stryMutAct_9fa48("221") ? {} : (stryCov_9fa48("221"), {
                user: stryMutAct_9fa48("222") ? {} : (stryCov_9fa48("222"), {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  hasPreferences: stryMutAct_9fa48("223") ? true : (stryCov_9fa48("223"), false),
                  isEmailVerified: stryMutAct_9fa48("224") ? false : (stryCov_9fa48("224"), true)
                }),
                token
              }), stryMutAct_9fa48("225") ? "" : (stryCov_9fa48("225"), 'Signup successful')));
            }
          } catch (err) {
            if (stryMutAct_9fa48("226")) {
              {}
            } else {
              stryCov_9fa48("226");
              await authRepository.rollbackTransaction();
              throw err;
            }
          }
        }
      } catch (error) {
        if (stryMutAct_9fa48("227")) {
          {}
        } else {
          stryCov_9fa48("227");
          console.error(stryMutAct_9fa48("228") ? "" : (stryCov_9fa48("228"), 'Error in learner signup verification:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Initiate signup for admins - Send OTP
   */
  async signupAdmin(req, res, next) {
    if (stryMutAct_9fa48("229")) {
      {}
    } else {
      stryCov_9fa48("229");
      try {
        if (stryMutAct_9fa48("230")) {
          {}
        } else {
          stryCov_9fa48("230");
          const {
            name,
            email,
            password
          } = req.body;
          if (stryMutAct_9fa48("233") ? (!name || !email) && !password : stryMutAct_9fa48("232") ? false : stryMutAct_9fa48("231") ? true : (stryCov_9fa48("231", "232", "233"), (stryMutAct_9fa48("235") ? !name && !email : stryMutAct_9fa48("234") ? false : (stryCov_9fa48("234", "235"), (stryMutAct_9fa48("236") ? name : (stryCov_9fa48("236"), !name)) || (stryMutAct_9fa48("237") ? email : (stryCov_9fa48("237"), !email)))) || (stryMutAct_9fa48("238") ? password : (stryCov_9fa48("238"), !password)))) {
            if (stryMutAct_9fa48("239")) {
              {}
            } else {
              stryCov_9fa48("239");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }

          // Validate name
          const nameValidation = validateName(name);
          if (stryMutAct_9fa48("242") ? false : stryMutAct_9fa48("241") ? true : stryMutAct_9fa48("240") ? nameValidation.isValid : (stryCov_9fa48("240", "241", "242"), !nameValidation.isValid)) {
            if (stryMutAct_9fa48("243")) {
              {}
            } else {
              stryCov_9fa48("243");
              return res.status(400).json(stryMutAct_9fa48("244") ? {} : (stryCov_9fa48("244"), {
                success: stryMutAct_9fa48("245") ? true : (stryCov_9fa48("245"), false),
                message: nameValidation.errors.join(stryMutAct_9fa48("246") ? "" : (stryCov_9fa48("246"), ', '))
              }));
            }
          }

          // Validate email
          const emailValidation = validateEmail(email);
          if (stryMutAct_9fa48("249") ? false : stryMutAct_9fa48("248") ? true : stryMutAct_9fa48("247") ? emailValidation.isValid : (stryCov_9fa48("247", "248", "249"), !emailValidation.isValid)) {
            if (stryMutAct_9fa48("250")) {
              {}
            } else {
              stryCov_9fa48("250");
              return res.status(400).json(stryMutAct_9fa48("251") ? {} : (stryCov_9fa48("251"), {
                success: stryMutAct_9fa48("252") ? true : (stryCov_9fa48("252"), false),
                message: emailValidation.errors.join(stryMutAct_9fa48("253") ? "" : (stryCov_9fa48("253"), ', '))
              }));
            }
          }

          // Validate password
          const passwordValidation = validatePassword(password, email, name);
          if (stryMutAct_9fa48("256") ? false : stryMutAct_9fa48("255") ? true : stryMutAct_9fa48("254") ? passwordValidation.isValid : (stryCov_9fa48("254", "255", "256"), !passwordValidation.isValid)) {
            if (stryMutAct_9fa48("257")) {
              {}
            } else {
              stryCov_9fa48("257");
              return res.status(400).json(stryMutAct_9fa48("258") ? {} : (stryCov_9fa48("258"), {
                success: stryMutAct_9fa48("259") ? true : (stryCov_9fa48("259"), false),
                message: passwordValidation.errors.join(stryMutAct_9fa48("260") ? "" : (stryCov_9fa48("260"), ', ')),
                suggestions: generatePasswordSuggestions(3)
              }));
            }
          }

          // Check if email already exists
          const existingAdmin = await authRepository.findAdminByEmail(email);
          if (stryMutAct_9fa48("262") ? false : stryMutAct_9fa48("261") ? true : (stryCov_9fa48("261", "262"), existingAdmin)) {
            if (stryMutAct_9fa48("263")) {
              {}
            } else {
              stryCov_9fa48("263");
              throw ERRORS.EMAIL_ALREADY_EXISTS;
            }
          }

          // Generate and store OTP
          const otp = emailService.generateOTP();
          await authRepository.storeOTP(email, otp, stryMutAct_9fa48("264") ? "" : (stryCov_9fa48("264"), 'signup'), stryMutAct_9fa48("265") ? "" : (stryCov_9fa48("265"), 'admin'));

          // Send OTP email
          await emailService.sendSignupOTP(email, name, otp);
          res.json(successResponse(stryMutAct_9fa48("266") ? {} : (stryCov_9fa48("266"), {
            email,
            message: stryMutAct_9fa48("267") ? "" : (stryCov_9fa48("267"), 'OTP sent to your email')
          }), stryMutAct_9fa48("268") ? "" : (stryCov_9fa48("268"), 'Please verify your email with the OTP sent')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("269")) {
          {}
        } else {
          stryCov_9fa48("269");
          console.error(stryMutAct_9fa48("270") ? "" : (stryCov_9fa48("270"), 'Error in admin signup:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Verify OTP and complete signup for admins
   */
  async verifySignupAdmin(req, res, next) {
    if (stryMutAct_9fa48("271")) {
      {}
    } else {
      stryCov_9fa48("271");
      try {
        if (stryMutAct_9fa48("272")) {
          {}
        } else {
          stryCov_9fa48("272");
          const {
            name,
            email,
            password,
            otp
          } = req.body;
          if (stryMutAct_9fa48("275") ? (!name || !email || !password) && !otp : stryMutAct_9fa48("274") ? false : stryMutAct_9fa48("273") ? true : (stryCov_9fa48("273", "274", "275"), (stryMutAct_9fa48("277") ? (!name || !email) && !password : stryMutAct_9fa48("276") ? false : (stryCov_9fa48("276", "277"), (stryMutAct_9fa48("279") ? !name && !email : stryMutAct_9fa48("278") ? false : (stryCov_9fa48("278", "279"), (stryMutAct_9fa48("280") ? name : (stryCov_9fa48("280"), !name)) || (stryMutAct_9fa48("281") ? email : (stryCov_9fa48("281"), !email)))) || (stryMutAct_9fa48("282") ? password : (stryCov_9fa48("282"), !password)))) || (stryMutAct_9fa48("283") ? otp : (stryCov_9fa48("283"), !otp)))) {
            if (stryMutAct_9fa48("284")) {
              {}
            } else {
              stryCov_9fa48("284");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }

          // Validate OTP format
          const otpValidation = validateOTP(otp);
          if (stryMutAct_9fa48("287") ? false : stryMutAct_9fa48("286") ? true : stryMutAct_9fa48("285") ? otpValidation.isValid : (stryCov_9fa48("285", "286", "287"), !otpValidation.isValid)) {
            if (stryMutAct_9fa48("288")) {
              {}
            } else {
              stryCov_9fa48("288");
              return res.status(400).json(stryMutAct_9fa48("289") ? {} : (stryCov_9fa48("289"), {
                success: stryMutAct_9fa48("290") ? true : (stryCov_9fa48("290"), false),
                message: otpValidation.errors.join(stryMutAct_9fa48("291") ? "" : (stryCov_9fa48("291"), ', '))
              }));
            }
          }

          // Verify OTP
          const otpRecord = await authRepository.verifyOTP(email, otp, stryMutAct_9fa48("292") ? "" : (stryCov_9fa48("292"), 'signup'), stryMutAct_9fa48("293") ? "" : (stryCov_9fa48("293"), 'admin'));
          if (stryMutAct_9fa48("296") ? false : stryMutAct_9fa48("295") ? true : stryMutAct_9fa48("294") ? otpRecord : (stryCov_9fa48("294", "295", "296"), !otpRecord)) {
            if (stryMutAct_9fa48("297")) {
              {}
            } else {
              stryCov_9fa48("297");
              return res.status(400).json(stryMutAct_9fa48("298") ? {} : (stryCov_9fa48("298"), {
                success: stryMutAct_9fa48("299") ? true : (stryCov_9fa48("299"), false),
                message: stryMutAct_9fa48("300") ? "" : (stryCov_9fa48("300"), 'Invalid or expired OTP')
              }));
            }
          }

          // Check if email already exists
          const existingAdmin = await authRepository.findAdminByEmail(email);
          if (stryMutAct_9fa48("302") ? false : stryMutAct_9fa48("301") ? true : (stryCov_9fa48("301", "302"), existingAdmin)) {
            if (stryMutAct_9fa48("303")) {
              {}
            } else {
              stryCov_9fa48("303");
              throw ERRORS.EMAIL_ALREADY_EXISTS;
            }
          }

          // Hash password
          const passwordHash = await bcrypt.hash(password, 10);

          // Create admin
          const admin = await authRepository.createAdmin(name, email, passwordHash);

          // Mark email as verified
          await authRepository.markAdminEmailVerified(email);

          // Mark OTP as used
          await authRepository.markOTPAsUsed(otpRecord.id);
          const token = createAuthToken(stryMutAct_9fa48("304") ? {} : (stryCov_9fa48("304"), {
            id: admin.id,
            email: admin.email,
            role: stryMutAct_9fa48("305") ? "" : (stryCov_9fa48("305"), 'admin')
          }));

          // Send welcome email (non-blocking)
          emailService.sendWelcomeEmail(email, name).catch(stryMutAct_9fa48("306") ? () => undefined : (stryCov_9fa48("306"), err => console.error(stryMutAct_9fa48("307") ? "" : (stryCov_9fa48("307"), 'Failed to send welcome email:'), err)));
          res.json(authResponse(stryMutAct_9fa48("308") ? {} : (stryCov_9fa48("308"), {
            user: stryMutAct_9fa48("309") ? {} : (stryCov_9fa48("309"), {
              id: admin.id,
              name: admin.name,
              email: admin.email,
              isEmailVerified: stryMutAct_9fa48("310") ? false : (stryCov_9fa48("310"), true)
            }),
            token
          }), stryMutAct_9fa48("311") ? "" : (stryCov_9fa48("311"), 'Admin signup successful')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("312")) {
          {}
        } else {
          stryCov_9fa48("312");
          console.error(stryMutAct_9fa48("313") ? "" : (stryCov_9fa48("313"), 'Error in admin signup verification:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Login for learners
   * FIX: Provides specific error messages for better UX
   */
  async loginLearner(req, res, next) {
    if (stryMutAct_9fa48("314")) {
      {}
    } else {
      stryCov_9fa48("314");
      try {
        if (stryMutAct_9fa48("315")) {
          {}
        } else {
          stryCov_9fa48("315");
          const {
            email,
            password
          } = req.body;
          if (stryMutAct_9fa48("318") ? !email && !password : stryMutAct_9fa48("317") ? false : stryMutAct_9fa48("316") ? true : (stryCov_9fa48("316", "317", "318"), (stryMutAct_9fa48("319") ? email : (stryCov_9fa48("319"), !email)) || (stryMutAct_9fa48("320") ? password : (stryCov_9fa48("320"), !password)))) {
            if (stryMutAct_9fa48("321")) {
              {}
            } else {
              stryCov_9fa48("321");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }

          // Find user
          const user = await authRepository.findLearnerByEmail(email);

          // FIX: Specific error when email not registered
          if (stryMutAct_9fa48("324") ? false : stryMutAct_9fa48("323") ? true : stryMutAct_9fa48("322") ? user : (stryCov_9fa48("322", "323", "324"), !user)) {
            if (stryMutAct_9fa48("325")) {
              {}
            } else {
              stryCov_9fa48("325");
              throw ERRORS.EMAIL_NOT_REGISTERED_LEARNER;
            }
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(password, user.password_hash);

          // FIX: Specific error for incorrect password
          if (stryMutAct_9fa48("328") ? false : stryMutAct_9fa48("327") ? true : stryMutAct_9fa48("326") ? isPasswordValid : (stryCov_9fa48("326", "327", "328"), !isPasswordValid)) {
            if (stryMutAct_9fa48("329")) {
              {}
            } else {
              stryCov_9fa48("329");
              throw ERRORS.INCORRECT_PASSWORD;
            }
          }

          // Update global login streak (per learner, across all courses)
          try {
            if (stryMutAct_9fa48("330")) {
              {}
            } else {
              stryCov_9fa48("330");
              const today = new Date().toISOString().split(stryMutAct_9fa48("331") ? "" : (stryCov_9fa48("331"), 'T'))[0];
              const streakResult = await db.query(stryMutAct_9fa48("332") ? `` : (stryCov_9fa48("332"), `SELECT 
             MAX(last_activity_date)::date as last_activity_date,
             MAX(current_streak)::int as current_streak,
             MAX(longest_streak)::int as longest_streak
           FROM user_stats
           WHERE learner_id = $1`), stryMutAct_9fa48("333") ? [] : (stryCov_9fa48("333"), [user.id]));
              const existing = stryMutAct_9fa48("336") ? streakResult.rows[0] && null : stryMutAct_9fa48("335") ? false : stryMutAct_9fa48("334") ? true : (stryCov_9fa48("334", "335", "336"), streakResult.rows[0] || null);
              let currentStreak = 1;
              let longestStreak = 1;
              const lastDate = (stryMutAct_9fa48("339") ? existing || existing.last_activity_date : stryMutAct_9fa48("338") ? false : stryMutAct_9fa48("337") ? true : (stryCov_9fa48("337", "338", "339"), existing && existing.last_activity_date)) ? new Date(existing.last_activity_date).toISOString().split(stryMutAct_9fa48("340") ? "" : (stryCov_9fa48("340"), 'T'))[0] : null;
              const yesterday = new Date();
              stryMutAct_9fa48("341") ? yesterday.setTime(yesterday.getDate() - 1) : (stryCov_9fa48("341"), yesterday.setDate(stryMutAct_9fa48("342") ? yesterday.getDate() + 1 : (stryCov_9fa48("342"), yesterday.getDate() - 1)));
              const yesterdayStr = yesterday.toISOString().split(stryMutAct_9fa48("343") ? "" : (stryCov_9fa48("343"), 'T'))[0];
              if (stryMutAct_9fa48("346") ? lastDate !== today : stryMutAct_9fa48("345") ? false : stryMutAct_9fa48("344") ? true : (stryCov_9fa48("344", "345", "346"), lastDate === today)) {
                if (stryMutAct_9fa48("347")) {
                  {}
                } else {
                  stryCov_9fa48("347");
                  currentStreak = stryMutAct_9fa48("350") ? existing.current_streak && 1 : stryMutAct_9fa48("349") ? false : stryMutAct_9fa48("348") ? true : (stryCov_9fa48("348", "349", "350"), existing.current_streak || 1);
                }
              } else if (stryMutAct_9fa48("353") ? lastDate !== yesterdayStr : stryMutAct_9fa48("352") ? false : stryMutAct_9fa48("351") ? true : (stryCov_9fa48("351", "352", "353"), lastDate === yesterdayStr)) {
                if (stryMutAct_9fa48("354")) {
                  {}
                } else {
                  stryCov_9fa48("354");
                  currentStreak = stryMutAct_9fa48("355") ? (existing.current_streak || 0) - 1 : (stryCov_9fa48("355"), (stryMutAct_9fa48("358") ? existing.current_streak && 0 : stryMutAct_9fa48("357") ? false : stryMutAct_9fa48("356") ? true : (stryCov_9fa48("356", "357", "358"), existing.current_streak || 0)) + 1);
                }
              } else {
                if (stryMutAct_9fa48("359")) {
                  {}
                } else {
                  stryCov_9fa48("359");
                  currentStreak = 1;
                }
              }
              longestStreak = stryMutAct_9fa48("360") ? Math.min(existing && existing.longest_streak || 0, currentStreak) : (stryCov_9fa48("360"), Math.max(stryMutAct_9fa48("363") ? existing && existing.longest_streak && 0 : stryMutAct_9fa48("362") ? false : stryMutAct_9fa48("361") ? true : (stryCov_9fa48("361", "362", "363"), (stryMutAct_9fa48("365") ? existing || existing.longest_streak : stryMutAct_9fa48("364") ? false : (stryCov_9fa48("364", "365"), existing && existing.longest_streak)) || 0), currentStreak));
              await db.query(stryMutAct_9fa48("366") ? `` : (stryCov_9fa48("366"), `UPDATE user_stats
           SET current_streak = $1,
               longest_streak = GREATEST(longest_streak, $1),
               last_activity_date = $2::date,
               updated_at = NOW()
           WHERE learner_id = $3`), stryMutAct_9fa48("367") ? [] : (stryCov_9fa48("367"), [currentStreak, today, user.id]));
            }
          } catch (streakError) {
            if (stryMutAct_9fa48("368")) {
              {}
            } else {
              stryCov_9fa48("368");
              console.error(stryMutAct_9fa48("369") ? "" : (stryCov_9fa48("369"), 'Error updating login streak:'), streakError);
            }
          }

          // Generate token
          const token = createAuthToken(stryMutAct_9fa48("370") ? {} : (stryCov_9fa48("370"), {
            id: user.id,
            email: user.email,
            role: stryMutAct_9fa48("371") ? "" : (stryCov_9fa48("371"), 'learner'),
            hasPreferences: user.has_preferences
          }));
          res.json(authResponse(stryMutAct_9fa48("372") ? {} : (stryCov_9fa48("372"), {
            user: stryMutAct_9fa48("373") ? {} : (stryCov_9fa48("373"), {
              id: user.id,
              name: user.name,
              email: user.email,
              hasPreferences: user.has_preferences
            }),
            token
          }), stryMutAct_9fa48("374") ? "" : (stryCov_9fa48("374"), 'Login successful')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("375")) {
          {}
        } else {
          stryCov_9fa48("375");
          console.error(stryMutAct_9fa48("376") ? "" : (stryCov_9fa48("376"), 'Error in learner login:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Login for admins
   * FIX: Provides specific error messages for better UX
   */
  async loginAdmin(req, res, next) {
    if (stryMutAct_9fa48("377")) {
      {}
    } else {
      stryCov_9fa48("377");
      try {
        if (stryMutAct_9fa48("378")) {
          {}
        } else {
          stryCov_9fa48("378");
          const {
            email,
            password
          } = req.body;
          if (stryMutAct_9fa48("381") ? !email && !password : stryMutAct_9fa48("380") ? false : stryMutAct_9fa48("379") ? true : (stryCov_9fa48("379", "380", "381"), (stryMutAct_9fa48("382") ? email : (stryCov_9fa48("382"), !email)) || (stryMutAct_9fa48("383") ? password : (stryCov_9fa48("383"), !password)))) {
            if (stryMutAct_9fa48("384")) {
              {}
            } else {
              stryCov_9fa48("384");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }

          // Find admin
          const admin = await authRepository.findAdminByEmail(email);

          // FIX: Specific error when email not registered as admin
          if (stryMutAct_9fa48("387") ? false : stryMutAct_9fa48("386") ? true : stryMutAct_9fa48("385") ? admin : (stryCov_9fa48("385", "386", "387"), !admin)) {
            if (stryMutAct_9fa48("388")) {
              {}
            } else {
              stryCov_9fa48("388");
              throw ERRORS.EMAIL_NOT_REGISTERED_ADMIN;
            }
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

          // FIX: Specific error for incorrect password
          if (stryMutAct_9fa48("391") ? false : stryMutAct_9fa48("390") ? true : stryMutAct_9fa48("389") ? isPasswordValid : (stryCov_9fa48("389", "390", "391"), !isPasswordValid)) {
            if (stryMutAct_9fa48("392")) {
              {}
            } else {
              stryCov_9fa48("392");
              throw ERRORS.INCORRECT_PASSWORD;
            }
          }

          // Generate token
          const token = createAuthToken(stryMutAct_9fa48("393") ? {} : (stryCov_9fa48("393"), {
            id: admin.id,
            email: admin.email,
            role: stryMutAct_9fa48("394") ? "" : (stryCov_9fa48("394"), 'admin')
          }));
          res.json(authResponse(stryMutAct_9fa48("395") ? {} : (stryCov_9fa48("395"), {
            user: stryMutAct_9fa48("396") ? {} : (stryCov_9fa48("396"), {
              id: admin.id,
              name: admin.name,
              email: admin.email
            }),
            token
          }), stryMutAct_9fa48("397") ? "" : (stryCov_9fa48("397"), 'Admin login successful')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("398")) {
          {}
        } else {
          stryCov_9fa48("398");
          console.error(stryMutAct_9fa48("399") ? "" : (stryCov_9fa48("399"), 'Error in admin login:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Get user profile
   */
  async getProfile(req, res, next) {
    if (stryMutAct_9fa48("400")) {
      {}
    } else {
      stryCov_9fa48("400");
      try {
        if (stryMutAct_9fa48("401")) {
          {}
        } else {
          stryCov_9fa48("401");
          const {
            id,
            role
          } = req.user;

          // Get full profile based on role
          let profile;
          if (stryMutAct_9fa48("404") ? role !== 'learner' : stryMutAct_9fa48("403") ? false : stryMutAct_9fa48("402") ? true : (stryCov_9fa48("402", "403", "404"), role === (stryMutAct_9fa48("405") ? "" : (stryCov_9fa48("405"), 'learner')))) {
            if (stryMutAct_9fa48("406")) {
              {}
            } else {
              stryCov_9fa48("406");
              profile = await authRepository.getFullLearnerProfile(id);
            }
          } else if (stryMutAct_9fa48("409") ? role !== 'admin' : stryMutAct_9fa48("408") ? false : stryMutAct_9fa48("407") ? true : (stryCov_9fa48("407", "408", "409"), role === (stryMutAct_9fa48("410") ? "" : (stryCov_9fa48("410"), 'admin')))) {
            if (stryMutAct_9fa48("411")) {
              {}
            } else {
              stryCov_9fa48("411");
              profile = await authRepository.getFullAdminProfile(id);
            }
          } else {
            if (stryMutAct_9fa48("412")) {
              {}
            } else {
              stryCov_9fa48("412");
              throw ERRORS.INVALID_AUTH_TOKEN;
            }
          }
          if (stryMutAct_9fa48("415") ? false : stryMutAct_9fa48("414") ? true : stryMutAct_9fa48("413") ? profile : (stryCov_9fa48("413", "414", "415"), !profile)) {
            if (stryMutAct_9fa48("416")) {
              {}
            } else {
              stryCov_9fa48("416");
              throw ERRORS.USER_NOT_FOUND;
            }
          }
          res.json(successResponse(stryMutAct_9fa48("417") ? {} : (stryCov_9fa48("417"), {
            user: profile
          }), stryMutAct_9fa48("418") ? "" : (stryCov_9fa48("418"), 'Profile retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("419")) {
          {}
        } else {
          stryCov_9fa48("419");
          console.error(stryMutAct_9fa48("420") ? "" : (stryCov_9fa48("420"), 'Error getting profile:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(req, res, next) {
    if (stryMutAct_9fa48("421")) {
      {}
    } else {
      stryCov_9fa48("421");
      try {
        if (stryMutAct_9fa48("422")) {
          {}
        } else {
          stryCov_9fa48("422");
          const {
            id,
            role
          } = req.user;
          const {
            name,
            contest_name
          } = req.body;

          // At least one field must be provided
          if (stryMutAct_9fa48("425") ? !name || contest_name === undefined : stryMutAct_9fa48("424") ? false : stryMutAct_9fa48("423") ? true : (stryCov_9fa48("423", "424", "425"), (stryMutAct_9fa48("426") ? name : (stryCov_9fa48("426"), !name)) && (stryMutAct_9fa48("428") ? contest_name !== undefined : stryMutAct_9fa48("427") ? true : (stryCov_9fa48("427", "428"), contest_name === undefined)))) {
            if (stryMutAct_9fa48("429")) {
              {}
            } else {
              stryCov_9fa48("429");
              return res.status(400).json(stryMutAct_9fa48("430") ? {} : (stryCov_9fa48("430"), {
                success: stryMutAct_9fa48("431") ? true : (stryCov_9fa48("431"), false),
                message: stryMutAct_9fa48("432") ? "" : (stryCov_9fa48("432"), 'At least one field (name or contest_name) is required')
              }));
            }
          }

          // Validate name if provided
          if (stryMutAct_9fa48("435") ? name === undefined : stryMutAct_9fa48("434") ? false : stryMutAct_9fa48("433") ? true : (stryCov_9fa48("433", "434", "435"), name !== undefined)) {
            if (stryMutAct_9fa48("436")) {
              {}
            } else {
              stryCov_9fa48("436");
              if (stryMutAct_9fa48("439") ? !name && !name.trim() : stryMutAct_9fa48("438") ? false : stryMutAct_9fa48("437") ? true : (stryCov_9fa48("437", "438", "439"), (stryMutAct_9fa48("440") ? name : (stryCov_9fa48("440"), !name)) || (stryMutAct_9fa48("441") ? name.trim() : (stryCov_9fa48("441"), !(stryMutAct_9fa48("442") ? name : (stryCov_9fa48("442"), name.trim())))))) {
                if (stryMutAct_9fa48("443")) {
                  {}
                } else {
                  stryCov_9fa48("443");
                  return res.status(400).json(stryMutAct_9fa48("444") ? {} : (stryCov_9fa48("444"), {
                    success: stryMutAct_9fa48("445") ? true : (stryCov_9fa48("445"), false),
                    message: stryMutAct_9fa48("446") ? "" : (stryCov_9fa48("446"), 'Name cannot be empty')
                  }));
                }
              }
              const nameValidation = validateName(name);
              if (stryMutAct_9fa48("449") ? false : stryMutAct_9fa48("448") ? true : stryMutAct_9fa48("447") ? nameValidation.isValid : (stryCov_9fa48("447", "448", "449"), !nameValidation.isValid)) {
                if (stryMutAct_9fa48("450")) {
                  {}
                } else {
                  stryCov_9fa48("450");
                  return res.status(400).json(stryMutAct_9fa48("451") ? {} : (stryCov_9fa48("451"), {
                    success: stryMutAct_9fa48("452") ? true : (stryCov_9fa48("452"), false),
                    message: nameValidation.errors.join(stryMutAct_9fa48("453") ? "" : (stryCov_9fa48("453"), ', '))
                  }));
                }
              }
            }
          }

          // Validate contest_name if provided
          if (stryMutAct_9fa48("456") ? contest_name !== undefined && contest_name !== null || contest_name.trim() : stryMutAct_9fa48("455") ? false : stryMutAct_9fa48("454") ? true : (stryCov_9fa48("454", "455", "456"), (stryMutAct_9fa48("458") ? contest_name !== undefined || contest_name !== null : stryMutAct_9fa48("457") ? true : (stryCov_9fa48("457", "458"), (stryMutAct_9fa48("460") ? contest_name === undefined : stryMutAct_9fa48("459") ? true : (stryCov_9fa48("459", "460"), contest_name !== undefined)) && (stryMutAct_9fa48("462") ? contest_name === null : stryMutAct_9fa48("461") ? true : (stryCov_9fa48("461", "462"), contest_name !== null)))) && (stryMutAct_9fa48("463") ? contest_name : (stryCov_9fa48("463"), contest_name.trim())))) {
            if (stryMutAct_9fa48("464")) {
              {}
            } else {
              stryCov_9fa48("464");
              if (stryMutAct_9fa48("468") ? contest_name.trim().length <= 50 : stryMutAct_9fa48("467") ? contest_name.trim().length >= 50 : stryMutAct_9fa48("466") ? false : stryMutAct_9fa48("465") ? true : (stryCov_9fa48("465", "466", "467", "468"), (stryMutAct_9fa48("469") ? contest_name.length : (stryCov_9fa48("469"), contest_name.trim().length)) > 50)) {
                if (stryMutAct_9fa48("470")) {
                  {}
                } else {
                  stryCov_9fa48("470");
                  return res.status(400).json(stryMutAct_9fa48("471") ? {} : (stryCov_9fa48("471"), {
                    success: stryMutAct_9fa48("472") ? true : (stryCov_9fa48("472"), false),
                    message: stryMutAct_9fa48("473") ? "" : (stryCov_9fa48("473"), 'Contest name must be 50 characters or less')
                  }));
                }
              }
            }
          }

          // Update profile based on role
          let updatedProfile;
          if (stryMutAct_9fa48("476") ? role !== 'learner' : stryMutAct_9fa48("475") ? false : stryMutAct_9fa48("474") ? true : (stryCov_9fa48("474", "475", "476"), role === (stryMutAct_9fa48("477") ? "" : (stryCov_9fa48("477"), 'learner')))) {
            if (stryMutAct_9fa48("478")) {
              {}
            } else {
              stryCov_9fa48("478");
              const updates = {};
              if (stryMutAct_9fa48("481") ? name === undefined : stryMutAct_9fa48("480") ? false : stryMutAct_9fa48("479") ? true : (stryCov_9fa48("479", "480", "481"), name !== undefined)) updates.name = stryMutAct_9fa48("482") ? name : (stryCov_9fa48("482"), name.trim());
              if (stryMutAct_9fa48("485") ? contest_name === undefined : stryMutAct_9fa48("484") ? false : stryMutAct_9fa48("483") ? true : (stryCov_9fa48("483", "484", "485"), contest_name !== undefined)) updates.contest_name = contest_name ? stryMutAct_9fa48("486") ? contest_name : (stryCov_9fa48("486"), contest_name.trim()) : null;
              updatedProfile = await authRepository.updateLearnerProfile(id, updates);
            }
          } else if (stryMutAct_9fa48("489") ? role !== 'admin' : stryMutAct_9fa48("488") ? false : stryMutAct_9fa48("487") ? true : (stryCov_9fa48("487", "488", "489"), role === (stryMutAct_9fa48("490") ? "" : (stryCov_9fa48("490"), 'admin')))) {
            if (stryMutAct_9fa48("491")) {
              {}
            } else {
              stryCov_9fa48("491");
              if (stryMutAct_9fa48("494") ? contest_name === undefined : stryMutAct_9fa48("493") ? false : stryMutAct_9fa48("492") ? true : (stryCov_9fa48("492", "493", "494"), contest_name !== undefined)) {
                if (stryMutAct_9fa48("495")) {
                  {}
                } else {
                  stryCov_9fa48("495");
                  return res.status(400).json(stryMutAct_9fa48("496") ? {} : (stryCov_9fa48("496"), {
                    success: stryMutAct_9fa48("497") ? true : (stryCov_9fa48("497"), false),
                    message: stryMutAct_9fa48("498") ? "" : (stryCov_9fa48("498"), 'Contest name is only available for learners')
                  }));
                }
              }
              updatedProfile = await authRepository.updateAdminProfile(id, stryMutAct_9fa48("499") ? name : (stryCov_9fa48("499"), name.trim()));
            }
          } else {
            if (stryMutAct_9fa48("500")) {
              {}
            } else {
              stryCov_9fa48("500");
              throw ERRORS.INVALID_AUTH_TOKEN;
            }
          }
          if (stryMutAct_9fa48("503") ? false : stryMutAct_9fa48("502") ? true : stryMutAct_9fa48("501") ? updatedProfile : (stryCov_9fa48("501", "502", "503"), !updatedProfile)) {
            if (stryMutAct_9fa48("504")) {
              {}
            } else {
              stryCov_9fa48("504");
              throw ERRORS.USER_NOT_FOUND;
            }
          }

          // Send confirmation email (non-blocking)
          emailService.sendProfileUpdateConfirmation(updatedProfile.email, updatedProfile.name).catch(stryMutAct_9fa48("505") ? () => undefined : (stryCov_9fa48("505"), err => console.error(stryMutAct_9fa48("506") ? "" : (stryCov_9fa48("506"), 'Failed to send profile update confirmation:'), err)));
          res.json(successResponse(stryMutAct_9fa48("507") ? {} : (stryCov_9fa48("507"), {
            user: updatedProfile
          }), stryMutAct_9fa48("508") ? "" : (stryCov_9fa48("508"), 'Profile updated successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("509")) {
          {}
        } else {
          stryCov_9fa48("509");
          console.error(stryMutAct_9fa48("510") ? "" : (stryCov_9fa48("510"), 'Error updating profile:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Initiate forgot password - Send OTP
   */
  async forgotPassword(req, res, next) {
    if (stryMutAct_9fa48("511")) {
      {}
    } else {
      stryCov_9fa48("511");
      try {
        if (stryMutAct_9fa48("512")) {
          {}
        } else {
          stryCov_9fa48("512");
          const {
            email,
            role
          } = req.body;
          if (stryMutAct_9fa48("515") ? !email && !role : stryMutAct_9fa48("514") ? false : stryMutAct_9fa48("513") ? true : (stryCov_9fa48("513", "514", "515"), (stryMutAct_9fa48("516") ? email : (stryCov_9fa48("516"), !email)) || (stryMutAct_9fa48("517") ? role : (stryCov_9fa48("517"), !role)))) {
            if (stryMutAct_9fa48("518")) {
              {}
            } else {
              stryCov_9fa48("518");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }

          // Validate email
          const emailValidation = validateEmail(email);
          if (stryMutAct_9fa48("521") ? false : stryMutAct_9fa48("520") ? true : stryMutAct_9fa48("519") ? emailValidation.isValid : (stryCov_9fa48("519", "520", "521"), !emailValidation.isValid)) {
            if (stryMutAct_9fa48("522")) {
              {}
            } else {
              stryCov_9fa48("522");
              return res.status(400).json(stryMutAct_9fa48("523") ? {} : (stryCov_9fa48("523"), {
                success: stryMutAct_9fa48("524") ? true : (stryCov_9fa48("524"), false),
                message: emailValidation.errors.join(stryMutAct_9fa48("525") ? "" : (stryCov_9fa48("525"), ', '))
              }));
            }
          }

          // Check if user exists
          let user;
          if (stryMutAct_9fa48("528") ? role !== 'learner' : stryMutAct_9fa48("527") ? false : stryMutAct_9fa48("526") ? true : (stryCov_9fa48("526", "527", "528"), role === (stryMutAct_9fa48("529") ? "" : (stryCov_9fa48("529"), 'learner')))) {
            if (stryMutAct_9fa48("530")) {
              {}
            } else {
              stryCov_9fa48("530");
              user = await authRepository.findLearnerByEmail(email);
            }
          } else if (stryMutAct_9fa48("533") ? role !== 'admin' : stryMutAct_9fa48("532") ? false : stryMutAct_9fa48("531") ? true : (stryCov_9fa48("531", "532", "533"), role === (stryMutAct_9fa48("534") ? "" : (stryCov_9fa48("534"), 'admin')))) {
            if (stryMutAct_9fa48("535")) {
              {}
            } else {
              stryCov_9fa48("535");
              user = await authRepository.findAdminByEmail(email);
            }
          } else {
            if (stryMutAct_9fa48("536")) {
              {}
            } else {
              stryCov_9fa48("536");
              return res.status(400).json(stryMutAct_9fa48("537") ? {} : (stryCov_9fa48("537"), {
                success: stryMutAct_9fa48("538") ? true : (stryCov_9fa48("538"), false),
                message: stryMutAct_9fa48("539") ? "" : (stryCov_9fa48("539"), 'Invalid role specified')
              }));
            }
          }
          if (stryMutAct_9fa48("542") ? false : stryMutAct_9fa48("541") ? true : stryMutAct_9fa48("540") ? user : (stryCov_9fa48("540", "541", "542"), !user)) {
            if (stryMutAct_9fa48("543")) {
              {}
            } else {
              stryCov_9fa48("543");
              // User doesn't exist - return error message
              return res.status(404).json(stryMutAct_9fa48("544") ? {} : (stryCov_9fa48("544"), {
                success: stryMutAct_9fa48("545") ? true : (stryCov_9fa48("545"), false),
                message: stryMutAct_9fa48("546") ? `` : (stryCov_9fa48("546"), `No ${role} account found with this email. Please sign up first.`)
              }));
            }
          }

          // Check if user's email is verified
          if (stryMutAct_9fa48("549") ? false : stryMutAct_9fa48("548") ? true : stryMutAct_9fa48("547") ? user.is_email_verified : (stryCov_9fa48("547", "548", "549"), !user.is_email_verified)) {
            if (stryMutAct_9fa48("550")) {
              {}
            } else {
              stryCov_9fa48("550");
              return res.status(400).json(stryMutAct_9fa48("551") ? {} : (stryCov_9fa48("551"), {
                success: stryMutAct_9fa48("552") ? true : (stryCov_9fa48("552"), false),
                message: stryMutAct_9fa48("553") ? "" : (stryCov_9fa48("553"), 'Email not verified. Please complete signup verification first.')
              }));
            }
          }

          // Generate and store OTP
          const otp = emailService.generateOTP();
          await authRepository.storeOTP(email, otp, stryMutAct_9fa48("554") ? "" : (stryCov_9fa48("554"), 'password_reset'), role);

          // Send OTP email
          console.log(stryMutAct_9fa48("555") ? `` : (stryCov_9fa48("555"), `🔐 Sending password reset OTP for ${role}: ${email}`));
          await emailService.sendPasswordResetOTP(email, user.name, otp);
          res.json(successResponse(stryMutAct_9fa48("556") ? {} : (stryCov_9fa48("556"), {
            email,
            message: stryMutAct_9fa48("557") ? "" : (stryCov_9fa48("557"), 'OTP sent to your email')
          }), stryMutAct_9fa48("558") ? "" : (stryCov_9fa48("558"), 'Password reset OTP sent successfully. Check your email.')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("559")) {
          {}
        } else {
          stryCov_9fa48("559");
          console.error(stryMutAct_9fa48("560") ? "" : (stryCov_9fa48("560"), 'Error in forgot password:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Verify OTP for password reset
   */
  async verifyResetOTP(req, res, next) {
    if (stryMutAct_9fa48("561")) {
      {}
    } else {
      stryCov_9fa48("561");
      try {
        if (stryMutAct_9fa48("562")) {
          {}
        } else {
          stryCov_9fa48("562");
          const {
            email,
            otp,
            role
          } = req.body;
          if (stryMutAct_9fa48("565") ? (!email || !otp) && !role : stryMutAct_9fa48("564") ? false : stryMutAct_9fa48("563") ? true : (stryCov_9fa48("563", "564", "565"), (stryMutAct_9fa48("567") ? !email && !otp : stryMutAct_9fa48("566") ? false : (stryCov_9fa48("566", "567"), (stryMutAct_9fa48("568") ? email : (stryCov_9fa48("568"), !email)) || (stryMutAct_9fa48("569") ? otp : (stryCov_9fa48("569"), !otp)))) || (stryMutAct_9fa48("570") ? role : (stryCov_9fa48("570"), !role)))) {
            if (stryMutAct_9fa48("571")) {
              {}
            } else {
              stryCov_9fa48("571");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }

          // Validate OTP format
          const otpValidation = validateOTP(otp);
          if (stryMutAct_9fa48("574") ? false : stryMutAct_9fa48("573") ? true : stryMutAct_9fa48("572") ? otpValidation.isValid : (stryCov_9fa48("572", "573", "574"), !otpValidation.isValid)) {
            if (stryMutAct_9fa48("575")) {
              {}
            } else {
              stryCov_9fa48("575");
              return res.status(400).json(stryMutAct_9fa48("576") ? {} : (stryCov_9fa48("576"), {
                success: stryMutAct_9fa48("577") ? true : (stryCov_9fa48("577"), false),
                message: otpValidation.errors.join(stryMutAct_9fa48("578") ? "" : (stryCov_9fa48("578"), ', '))
              }));
            }
          }

          // Verify OTP
          const otpRecord = await authRepository.verifyOTP(email, otp, stryMutAct_9fa48("579") ? "" : (stryCov_9fa48("579"), 'password_reset'), role);
          if (stryMutAct_9fa48("582") ? false : stryMutAct_9fa48("581") ? true : stryMutAct_9fa48("580") ? otpRecord : (stryCov_9fa48("580", "581", "582"), !otpRecord)) {
            if (stryMutAct_9fa48("583")) {
              {}
            } else {
              stryCov_9fa48("583");
              return res.status(400).json(stryMutAct_9fa48("584") ? {} : (stryCov_9fa48("584"), {
                success: stryMutAct_9fa48("585") ? true : (stryCov_9fa48("585"), false),
                message: stryMutAct_9fa48("586") ? "" : (stryCov_9fa48("586"), 'Invalid or expired OTP')
              }));
            }
          }
          res.json(successResponse(stryMutAct_9fa48("587") ? {} : (stryCov_9fa48("587"), {
            email,
            verified: stryMutAct_9fa48("588") ? false : (stryCov_9fa48("588"), true)
          }), stryMutAct_9fa48("589") ? "" : (stryCov_9fa48("589"), 'OTP verified successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("590")) {
          {}
        } else {
          stryCov_9fa48("590");
          console.error(stryMutAct_9fa48("591") ? "" : (stryCov_9fa48("591"), 'Error in verify reset OTP:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Reset password after OTP verification
   */
  async resetPassword(req, res, next) {
    if (stryMutAct_9fa48("592")) {
      {}
    } else {
      stryCov_9fa48("592");
      try {
        if (stryMutAct_9fa48("593")) {
          {}
        } else {
          stryCov_9fa48("593");
          const {
            email,
            otp,
            newPassword,
            confirmPassword,
            role
          } = req.body;
          if (stryMutAct_9fa48("596") ? (!email || !otp || !newPassword || !confirmPassword) && !role : stryMutAct_9fa48("595") ? false : stryMutAct_9fa48("594") ? true : (stryCov_9fa48("594", "595", "596"), (stryMutAct_9fa48("598") ? (!email || !otp || !newPassword) && !confirmPassword : stryMutAct_9fa48("597") ? false : (stryCov_9fa48("597", "598"), (stryMutAct_9fa48("600") ? (!email || !otp) && !newPassword : stryMutAct_9fa48("599") ? false : (stryCov_9fa48("599", "600"), (stryMutAct_9fa48("602") ? !email && !otp : stryMutAct_9fa48("601") ? false : (stryCov_9fa48("601", "602"), (stryMutAct_9fa48("603") ? email : (stryCov_9fa48("603"), !email)) || (stryMutAct_9fa48("604") ? otp : (stryCov_9fa48("604"), !otp)))) || (stryMutAct_9fa48("605") ? newPassword : (stryCov_9fa48("605"), !newPassword)))) || (stryMutAct_9fa48("606") ? confirmPassword : (stryCov_9fa48("606"), !confirmPassword)))) || (stryMutAct_9fa48("607") ? role : (stryCov_9fa48("607"), !role)))) {
            if (stryMutAct_9fa48("608")) {
              {}
            } else {
              stryCov_9fa48("608");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }

          // Check if passwords match
          if (stryMutAct_9fa48("611") ? newPassword === confirmPassword : stryMutAct_9fa48("610") ? false : stryMutAct_9fa48("609") ? true : (stryCov_9fa48("609", "610", "611"), newPassword !== confirmPassword)) {
            if (stryMutAct_9fa48("612")) {
              {}
            } else {
              stryCov_9fa48("612");
              return res.status(400).json(stryMutAct_9fa48("613") ? {} : (stryCov_9fa48("613"), {
                success: stryMutAct_9fa48("614") ? true : (stryCov_9fa48("614"), false),
                message: stryMutAct_9fa48("615") ? "" : (stryCov_9fa48("615"), 'Passwords do not match')
              }));
            }
          }

          // Get user to validate password against name
          let user;
          if (stryMutAct_9fa48("618") ? role !== 'learner' : stryMutAct_9fa48("617") ? false : stryMutAct_9fa48("616") ? true : (stryCov_9fa48("616", "617", "618"), role === (stryMutAct_9fa48("619") ? "" : (stryCov_9fa48("619"), 'learner')))) {
            if (stryMutAct_9fa48("620")) {
              {}
            } else {
              stryCov_9fa48("620");
              user = await authRepository.findLearnerByEmail(email);
            }
          } else if (stryMutAct_9fa48("623") ? role !== 'admin' : stryMutAct_9fa48("622") ? false : stryMutAct_9fa48("621") ? true : (stryCov_9fa48("621", "622", "623"), role === (stryMutAct_9fa48("624") ? "" : (stryCov_9fa48("624"), 'admin')))) {
            if (stryMutAct_9fa48("625")) {
              {}
            } else {
              stryCov_9fa48("625");
              user = await authRepository.findAdminByEmail(email);
            }
          }
          if (stryMutAct_9fa48("628") ? false : stryMutAct_9fa48("627") ? true : stryMutAct_9fa48("626") ? user : (stryCov_9fa48("626", "627", "628"), !user)) {
            if (stryMutAct_9fa48("629")) {
              {}
            } else {
              stryCov_9fa48("629");
              return res.status(404).json(stryMutAct_9fa48("630") ? {} : (stryCov_9fa48("630"), {
                success: stryMutAct_9fa48("631") ? true : (stryCov_9fa48("631"), false),
                message: stryMutAct_9fa48("632") ? "" : (stryCov_9fa48("632"), 'User not found')
              }));
            }
          }

          // Validate new password
          const passwordValidation = validatePassword(newPassword, email, user.name);
          if (stryMutAct_9fa48("635") ? false : stryMutAct_9fa48("634") ? true : stryMutAct_9fa48("633") ? passwordValidation.isValid : (stryCov_9fa48("633", "634", "635"), !passwordValidation.isValid)) {
            if (stryMutAct_9fa48("636")) {
              {}
            } else {
              stryCov_9fa48("636");
              return res.status(400).json(stryMutAct_9fa48("637") ? {} : (stryCov_9fa48("637"), {
                success: stryMutAct_9fa48("638") ? true : (stryCov_9fa48("638"), false),
                message: passwordValidation.errors.join(stryMutAct_9fa48("639") ? "" : (stryCov_9fa48("639"), ', ')),
                suggestions: generatePasswordSuggestions(3)
              }));
            }
          }

          // Verify OTP one more time
          const otpRecord = await authRepository.verifyOTP(email, otp, stryMutAct_9fa48("640") ? "" : (stryCov_9fa48("640"), 'password_reset'), role);
          if (stryMutAct_9fa48("643") ? false : stryMutAct_9fa48("642") ? true : stryMutAct_9fa48("641") ? otpRecord : (stryCov_9fa48("641", "642", "643"), !otpRecord)) {
            if (stryMutAct_9fa48("644")) {
              {}
            } else {
              stryCov_9fa48("644");
              return res.status(400).json(stryMutAct_9fa48("645") ? {} : (stryCov_9fa48("645"), {
                success: stryMutAct_9fa48("646") ? true : (stryCov_9fa48("646"), false),
                message: stryMutAct_9fa48("647") ? "" : (stryCov_9fa48("647"), 'Invalid or expired OTP')
              }));
            }
          }

          // Hash new password
          const passwordHash = await bcrypt.hash(newPassword, 10);

          // Update password
          if (stryMutAct_9fa48("650") ? role !== 'learner' : stryMutAct_9fa48("649") ? false : stryMutAct_9fa48("648") ? true : (stryCov_9fa48("648", "649", "650"), role === (stryMutAct_9fa48("651") ? "" : (stryCov_9fa48("651"), 'learner')))) {
            if (stryMutAct_9fa48("652")) {
              {}
            } else {
              stryCov_9fa48("652");
              await authRepository.updateLearnerPassword(email, passwordHash);
            }
          } else {
            if (stryMutAct_9fa48("653")) {
              {}
            } else {
              stryCov_9fa48("653");
              await authRepository.updateAdminPassword(email, passwordHash);
            }
          }

          // Mark OTP as used
          await authRepository.markOTPAsUsed(otpRecord.id);

          // Clean up all password reset OTPs for this email
          await authRepository.deleteOTPsByEmail(email, stryMutAct_9fa48("654") ? "" : (stryCov_9fa48("654"), 'password_reset'), role);
          res.json(successResponse(stryMutAct_9fa48("655") ? {} : (stryCov_9fa48("655"), {
            message: stryMutAct_9fa48("656") ? "" : (stryCov_9fa48("656"), 'Password reset successful')
          }), stryMutAct_9fa48("657") ? "" : (stryCov_9fa48("657"), 'Your password has been reset successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("658")) {
          {}
        } else {
          stryCov_9fa48("658");
          console.error(stryMutAct_9fa48("659") ? "" : (stryCov_9fa48("659"), 'Error in reset password:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Resend OTP
   */
  async resendOTP(req, res, next) {
    if (stryMutAct_9fa48("660")) {
      {}
    } else {
      stryCov_9fa48("660");
      try {
        if (stryMutAct_9fa48("661")) {
          {}
        } else {
          stryCov_9fa48("661");
          const {
            email,
            otpType,
            role,
            name
          } = req.body;
          if (stryMutAct_9fa48("664") ? (!email || !otpType) && !role : stryMutAct_9fa48("663") ? false : stryMutAct_9fa48("662") ? true : (stryCov_9fa48("662", "663", "664"), (stryMutAct_9fa48("666") ? !email && !otpType : stryMutAct_9fa48("665") ? false : (stryCov_9fa48("665", "666"), (stryMutAct_9fa48("667") ? email : (stryCov_9fa48("667"), !email)) || (stryMutAct_9fa48("668") ? otpType : (stryCov_9fa48("668"), !otpType)))) || (stryMutAct_9fa48("669") ? role : (stryCov_9fa48("669"), !role)))) {
            if (stryMutAct_9fa48("670")) {
              {}
            } else {
              stryCov_9fa48("670");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }

          // Validate email
          const emailValidation = validateEmail(email);
          if (stryMutAct_9fa48("673") ? false : stryMutAct_9fa48("672") ? true : stryMutAct_9fa48("671") ? emailValidation.isValid : (stryCov_9fa48("671", "672", "673"), !emailValidation.isValid)) {
            if (stryMutAct_9fa48("674")) {
              {}
            } else {
              stryCov_9fa48("674");
              return res.status(400).json(stryMutAct_9fa48("675") ? {} : (stryCov_9fa48("675"), {
                success: stryMutAct_9fa48("676") ? true : (stryCov_9fa48("676"), false),
                message: emailValidation.errors.join(stryMutAct_9fa48("677") ? "" : (stryCov_9fa48("677"), ', '))
              }));
            }
          }

          // For password reset, verify user exists and is verified
          if (stryMutAct_9fa48("680") ? otpType !== 'password_reset' : stryMutAct_9fa48("679") ? false : stryMutAct_9fa48("678") ? true : (stryCov_9fa48("678", "679", "680"), otpType === (stryMutAct_9fa48("681") ? "" : (stryCov_9fa48("681"), 'password_reset')))) {
            if (stryMutAct_9fa48("682")) {
              {}
            } else {
              stryCov_9fa48("682");
              let user;
              if (stryMutAct_9fa48("685") ? role !== 'learner' : stryMutAct_9fa48("684") ? false : stryMutAct_9fa48("683") ? true : (stryCov_9fa48("683", "684", "685"), role === (stryMutAct_9fa48("686") ? "" : (stryCov_9fa48("686"), 'learner')))) {
                if (stryMutAct_9fa48("687")) {
                  {}
                } else {
                  stryCov_9fa48("687");
                  user = await authRepository.findLearnerByEmail(email);
                }
              } else if (stryMutAct_9fa48("690") ? role !== 'admin' : stryMutAct_9fa48("689") ? false : stryMutAct_9fa48("688") ? true : (stryCov_9fa48("688", "689", "690"), role === (stryMutAct_9fa48("691") ? "" : (stryCov_9fa48("691"), 'admin')))) {
                if (stryMutAct_9fa48("692")) {
                  {}
                } else {
                  stryCov_9fa48("692");
                  user = await authRepository.findAdminByEmail(email);
                }
              }
              if (stryMutAct_9fa48("695") ? false : stryMutAct_9fa48("694") ? true : stryMutAct_9fa48("693") ? user : (stryCov_9fa48("693", "694", "695"), !user)) {
                if (stryMutAct_9fa48("696")) {
                  {}
                } else {
                  stryCov_9fa48("696");
                  return res.status(404).json(stryMutAct_9fa48("697") ? {} : (stryCov_9fa48("697"), {
                    success: stryMutAct_9fa48("698") ? true : (stryCov_9fa48("698"), false),
                    message: stryMutAct_9fa48("699") ? `` : (stryCov_9fa48("699"), `No ${role} account found with this email.`)
                  }));
                }
              }
              if (stryMutAct_9fa48("702") ? false : stryMutAct_9fa48("701") ? true : stryMutAct_9fa48("700") ? user.is_email_verified : (stryCov_9fa48("700", "701", "702"), !user.is_email_verified)) {
                if (stryMutAct_9fa48("703")) {
                  {}
                } else {
                  stryCov_9fa48("703");
                  return res.status(400).json(stryMutAct_9fa48("704") ? {} : (stryCov_9fa48("704"), {
                    success: stryMutAct_9fa48("705") ? true : (stryCov_9fa48("705"), false),
                    message: stryMutAct_9fa48("706") ? "" : (stryCov_9fa48("706"), 'Email not verified. Please complete signup verification first.')
                  }));
                }
              }
            }
          }

          // Enforce 60-second resend cooldown
          const latest = await authRepository.getLatestOTP(email, otpType, role);
          if (stryMutAct_9fa48("708") ? false : stryMutAct_9fa48("707") ? true : (stryCov_9fa48("707", "708"), latest)) {
            if (stryMutAct_9fa48("709")) {
              {}
            } else {
              stryCov_9fa48("709");
              const createdAt = new Date(latest.created_at).getTime();
              const elapsedMs = stryMutAct_9fa48("710") ? Date.now() + createdAt : (stryCov_9fa48("710"), Date.now() - createdAt);
              const cooldownMs = stryMutAct_9fa48("711") ? 60 / 1000 : (stryCov_9fa48("711"), 60 * 1000);
              if (stryMutAct_9fa48("715") ? elapsedMs >= cooldownMs : stryMutAct_9fa48("714") ? elapsedMs <= cooldownMs : stryMutAct_9fa48("713") ? false : stryMutAct_9fa48("712") ? true : (stryCov_9fa48("712", "713", "714", "715"), elapsedMs < cooldownMs)) {
                if (stryMutAct_9fa48("716")) {
                  {}
                } else {
                  stryCov_9fa48("716");
                  const remaining = Math.ceil(stryMutAct_9fa48("717") ? (cooldownMs - elapsedMs) * 1000 : (stryCov_9fa48("717"), (stryMutAct_9fa48("718") ? cooldownMs + elapsedMs : (stryCov_9fa48("718"), cooldownMs - elapsedMs)) / 1000));
                  return res.status(429).json(stryMutAct_9fa48("719") ? {} : (stryCov_9fa48("719"), {
                    success: stryMutAct_9fa48("720") ? true : (stryCov_9fa48("720"), false),
                    message: stryMutAct_9fa48("721") ? `` : (stryCov_9fa48("721"), `Please wait ${remaining}s before requesting a new OTP.`)
                  }));
                }
              }
            }
          }

          // Generate new OTP
          const otp = emailService.generateOTP();
          await authRepository.storeOTP(email, otp, otpType, role);

          // Send OTP based on type
          console.log(stryMutAct_9fa48("722") ? `` : (stryCov_9fa48("722"), `🔄 Resending ${otpType} OTP to: ${email}`));
          if (stryMutAct_9fa48("725") ? otpType !== 'signup' : stryMutAct_9fa48("724") ? false : stryMutAct_9fa48("723") ? true : (stryCov_9fa48("723", "724", "725"), otpType === (stryMutAct_9fa48("726") ? "" : (stryCov_9fa48("726"), 'signup')))) {
            if (stryMutAct_9fa48("727")) {
              {}
            } else {
              stryCov_9fa48("727");
              await emailService.sendSignupOTP(email, stryMutAct_9fa48("730") ? name && 'User' : stryMutAct_9fa48("729") ? false : stryMutAct_9fa48("728") ? true : (stryCov_9fa48("728", "729", "730"), name || (stryMutAct_9fa48("731") ? "" : (stryCov_9fa48("731"), 'User'))), otp);
            }
          } else if (stryMutAct_9fa48("734") ? otpType !== 'password_reset' : stryMutAct_9fa48("733") ? false : stryMutAct_9fa48("732") ? true : (stryCov_9fa48("732", "733", "734"), otpType === (stryMutAct_9fa48("735") ? "" : (stryCov_9fa48("735"), 'password_reset')))) {
            if (stryMutAct_9fa48("736")) {
              {}
            } else {
              stryCov_9fa48("736");
              // Get user name
              let user;
              if (stryMutAct_9fa48("739") ? role !== 'learner' : stryMutAct_9fa48("738") ? false : stryMutAct_9fa48("737") ? true : (stryCov_9fa48("737", "738", "739"), role === (stryMutAct_9fa48("740") ? "" : (stryCov_9fa48("740"), 'learner')))) {
                if (stryMutAct_9fa48("741")) {
                  {}
                } else {
                  stryCov_9fa48("741");
                  user = await authRepository.findLearnerByEmail(email);
                }
              } else {
                if (stryMutAct_9fa48("742")) {
                  {}
                } else {
                  stryCov_9fa48("742");
                  user = await authRepository.findAdminByEmail(email);
                }
              }
              await emailService.sendPasswordResetOTP(email, stryMutAct_9fa48("745") ? user?.name && 'User' : stryMutAct_9fa48("744") ? false : stryMutAct_9fa48("743") ? true : (stryCov_9fa48("743", "744", "745"), (stryMutAct_9fa48("746") ? user.name : (stryCov_9fa48("746"), user?.name)) || (stryMutAct_9fa48("747") ? "" : (stryCov_9fa48("747"), 'User'))), otp);
            }
          }
          console.log(stryMutAct_9fa48("748") ? `` : (stryCov_9fa48("748"), `✅ OTP resent successfully to: ${email}`));
          res.json(successResponse(stryMutAct_9fa48("749") ? {} : (stryCov_9fa48("749"), {
            message: stryMutAct_9fa48("750") ? "" : (stryCov_9fa48("750"), 'OTP resent successfully')
          }), stryMutAct_9fa48("751") ? "" : (stryCov_9fa48("751"), 'A new OTP has been sent to your email')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("752")) {
          {}
        } else {
          stryCov_9fa48("752");
          console.error(stryMutAct_9fa48("753") ? "" : (stryCov_9fa48("753"), '❌ Error in resend OTP:'), error);
          console.error(stryMutAct_9fa48("754") ? "" : (stryCov_9fa48("754"), '   Details:'), error.message);
          return res.status(500).json(stryMutAct_9fa48("755") ? {} : (stryCov_9fa48("755"), {
            success: stryMutAct_9fa48("756") ? true : (stryCov_9fa48("756"), false),
            message: stryMutAct_9fa48("757") ? "" : (stryCov_9fa48("757"), 'Failed to resend OTP. Please try again.')
          }));
        }
      }
    }
  }

  /**
   * Get password suggestions
   */
  async getPasswordSuggestions(req, res, next) {
    if (stryMutAct_9fa48("758")) {
      {}
    } else {
      stryCov_9fa48("758");
      try {
        if (stryMutAct_9fa48("759")) {
          {}
        } else {
          stryCov_9fa48("759");
          const suggestions = generatePasswordSuggestions(5);
          res.json(successResponse(stryMutAct_9fa48("760") ? {} : (stryCov_9fa48("760"), {
            suggestions
          }), stryMutAct_9fa48("761") ? "" : (stryCov_9fa48("761"), 'Password suggestions generated')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("762")) {
          {}
        } else {
          stryCov_9fa48("762");
          console.error(stryMutAct_9fa48("763") ? "" : (stryCov_9fa48("763"), 'Error generating password suggestions:'), error);
          next(error);
        }
      }
    }
  }
}
export default new AuthController();