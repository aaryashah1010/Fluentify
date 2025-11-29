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

          // Generate token
          const token = createAuthToken(stryMutAct_9fa48("330") ? {} : (stryCov_9fa48("330"), {
            id: user.id,
            email: user.email,
            role: stryMutAct_9fa48("331") ? "" : (stryCov_9fa48("331"), 'learner'),
            hasPreferences: user.has_preferences
          }));
          res.json(authResponse(stryMutAct_9fa48("332") ? {} : (stryCov_9fa48("332"), {
            user: stryMutAct_9fa48("333") ? {} : (stryCov_9fa48("333"), {
              id: user.id,
              name: user.name,
              email: user.email,
              hasPreferences: user.has_preferences
            }),
            token
          }), stryMutAct_9fa48("334") ? "" : (stryCov_9fa48("334"), 'Login successful')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("335")) {
          {}
        } else {
          stryCov_9fa48("335");
          console.error(stryMutAct_9fa48("336") ? "" : (stryCov_9fa48("336"), 'Error in learner login:'), error);
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
    if (stryMutAct_9fa48("337")) {
      {}
    } else {
      stryCov_9fa48("337");
      try {
        if (stryMutAct_9fa48("338")) {
          {}
        } else {
          stryCov_9fa48("338");
          const {
            email,
            password
          } = req.body;
          if (stryMutAct_9fa48("341") ? !email && !password : stryMutAct_9fa48("340") ? false : stryMutAct_9fa48("339") ? true : (stryCov_9fa48("339", "340", "341"), (stryMutAct_9fa48("342") ? email : (stryCov_9fa48("342"), !email)) || (stryMutAct_9fa48("343") ? password : (stryCov_9fa48("343"), !password)))) {
            if (stryMutAct_9fa48("344")) {
              {}
            } else {
              stryCov_9fa48("344");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }

          // Find admin
          const admin = await authRepository.findAdminByEmail(email);

          // FIX: Specific error when email not registered as admin
          if (stryMutAct_9fa48("347") ? false : stryMutAct_9fa48("346") ? true : stryMutAct_9fa48("345") ? admin : (stryCov_9fa48("345", "346", "347"), !admin)) {
            if (stryMutAct_9fa48("348")) {
              {}
            } else {
              stryCov_9fa48("348");
              throw ERRORS.EMAIL_NOT_REGISTERED_ADMIN;
            }
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

          // FIX: Specific error for incorrect password
          if (stryMutAct_9fa48("351") ? false : stryMutAct_9fa48("350") ? true : stryMutAct_9fa48("349") ? isPasswordValid : (stryCov_9fa48("349", "350", "351"), !isPasswordValid)) {
            if (stryMutAct_9fa48("352")) {
              {}
            } else {
              stryCov_9fa48("352");
              throw ERRORS.INCORRECT_PASSWORD;
            }
          }

          // Generate token
          const token = createAuthToken(stryMutAct_9fa48("353") ? {} : (stryCov_9fa48("353"), {
            id: admin.id,
            email: admin.email,
            role: stryMutAct_9fa48("354") ? "" : (stryCov_9fa48("354"), 'admin')
          }));
          res.json(authResponse(stryMutAct_9fa48("355") ? {} : (stryCov_9fa48("355"), {
            user: stryMutAct_9fa48("356") ? {} : (stryCov_9fa48("356"), {
              id: admin.id,
              name: admin.name,
              email: admin.email
            }),
            token
          }), stryMutAct_9fa48("357") ? "" : (stryCov_9fa48("357"), 'Admin login successful')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("358")) {
          {}
        } else {
          stryCov_9fa48("358");
          console.error(stryMutAct_9fa48("359") ? "" : (stryCov_9fa48("359"), 'Error in admin login:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Get user profile
   */
  async getProfile(req, res, next) {
    if (stryMutAct_9fa48("360")) {
      {}
    } else {
      stryCov_9fa48("360");
      try {
        if (stryMutAct_9fa48("361")) {
          {}
        } else {
          stryCov_9fa48("361");
          const {
            id,
            role
          } = req.user;

          // Get full profile based on role
          let profile;
          if (stryMutAct_9fa48("364") ? role !== 'learner' : stryMutAct_9fa48("363") ? false : stryMutAct_9fa48("362") ? true : (stryCov_9fa48("362", "363", "364"), role === (stryMutAct_9fa48("365") ? "" : (stryCov_9fa48("365"), 'learner')))) {
            if (stryMutAct_9fa48("366")) {
              {}
            } else {
              stryCov_9fa48("366");
              profile = await authRepository.getFullLearnerProfile(id);
            }
          } else if (stryMutAct_9fa48("369") ? role !== 'admin' : stryMutAct_9fa48("368") ? false : stryMutAct_9fa48("367") ? true : (stryCov_9fa48("367", "368", "369"), role === (stryMutAct_9fa48("370") ? "" : (stryCov_9fa48("370"), 'admin')))) {
            if (stryMutAct_9fa48("371")) {
              {}
            } else {
              stryCov_9fa48("371");
              profile = await authRepository.getFullAdminProfile(id);
            }
          } else {
            if (stryMutAct_9fa48("372")) {
              {}
            } else {
              stryCov_9fa48("372");
              throw ERRORS.INVALID_AUTH_TOKEN;
            }
          }
          if (stryMutAct_9fa48("375") ? false : stryMutAct_9fa48("374") ? true : stryMutAct_9fa48("373") ? profile : (stryCov_9fa48("373", "374", "375"), !profile)) {
            if (stryMutAct_9fa48("376")) {
              {}
            } else {
              stryCov_9fa48("376");
              throw ERRORS.USER_NOT_FOUND;
            }
          }
          res.json(successResponse(stryMutAct_9fa48("377") ? {} : (stryCov_9fa48("377"), {
            user: profile
          }), stryMutAct_9fa48("378") ? "" : (stryCov_9fa48("378"), 'Profile retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("379")) {
          {}
        } else {
          stryCov_9fa48("379");
          console.error(stryMutAct_9fa48("380") ? "" : (stryCov_9fa48("380"), 'Error getting profile:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(req, res, next) {
    if (stryMutAct_9fa48("381")) {
      {}
    } else {
      stryCov_9fa48("381");
      try {
        if (stryMutAct_9fa48("382")) {
          {}
        } else {
          stryCov_9fa48("382");
          const {
            id,
            role
          } = req.user;
          const {
            name,
            contest_name
          } = req.body;

          // At least one field must be provided
          if (stryMutAct_9fa48("385") ? !name || contest_name === undefined : stryMutAct_9fa48("384") ? false : stryMutAct_9fa48("383") ? true : (stryCov_9fa48("383", "384", "385"), (stryMutAct_9fa48("386") ? name : (stryCov_9fa48("386"), !name)) && (stryMutAct_9fa48("388") ? contest_name !== undefined : stryMutAct_9fa48("387") ? true : (stryCov_9fa48("387", "388"), contest_name === undefined)))) {
            if (stryMutAct_9fa48("389")) {
              {}
            } else {
              stryCov_9fa48("389");
              return res.status(400).json(stryMutAct_9fa48("390") ? {} : (stryCov_9fa48("390"), {
                success: stryMutAct_9fa48("391") ? true : (stryCov_9fa48("391"), false),
                message: stryMutAct_9fa48("392") ? "" : (stryCov_9fa48("392"), 'At least one field (name or contest_name) is required')
              }));
            }
          }

          // Validate name if provided
          if (stryMutAct_9fa48("395") ? name === undefined : stryMutAct_9fa48("394") ? false : stryMutAct_9fa48("393") ? true : (stryCov_9fa48("393", "394", "395"), name !== undefined)) {
            if (stryMutAct_9fa48("396")) {
              {}
            } else {
              stryCov_9fa48("396");
              if (stryMutAct_9fa48("399") ? !name && !name.trim() : stryMutAct_9fa48("398") ? false : stryMutAct_9fa48("397") ? true : (stryCov_9fa48("397", "398", "399"), (stryMutAct_9fa48("400") ? name : (stryCov_9fa48("400"), !name)) || (stryMutAct_9fa48("401") ? name.trim() : (stryCov_9fa48("401"), !(stryMutAct_9fa48("402") ? name : (stryCov_9fa48("402"), name.trim())))))) {
                if (stryMutAct_9fa48("403")) {
                  {}
                } else {
                  stryCov_9fa48("403");
                  return res.status(400).json(stryMutAct_9fa48("404") ? {} : (stryCov_9fa48("404"), {
                    success: stryMutAct_9fa48("405") ? true : (stryCov_9fa48("405"), false),
                    message: stryMutAct_9fa48("406") ? "" : (stryCov_9fa48("406"), 'Name cannot be empty')
                  }));
                }
              }
              const nameValidation = validateName(name);
              if (stryMutAct_9fa48("409") ? false : stryMutAct_9fa48("408") ? true : stryMutAct_9fa48("407") ? nameValidation.isValid : (stryCov_9fa48("407", "408", "409"), !nameValidation.isValid)) {
                if (stryMutAct_9fa48("410")) {
                  {}
                } else {
                  stryCov_9fa48("410");
                  return res.status(400).json(stryMutAct_9fa48("411") ? {} : (stryCov_9fa48("411"), {
                    success: stryMutAct_9fa48("412") ? true : (stryCov_9fa48("412"), false),
                    message: nameValidation.errors.join(stryMutAct_9fa48("413") ? "" : (stryCov_9fa48("413"), ', '))
                  }));
                }
              }
            }
          }

          // Validate contest_name if provided
          if (stryMutAct_9fa48("416") ? contest_name !== undefined && contest_name !== null || contest_name.trim() : stryMutAct_9fa48("415") ? false : stryMutAct_9fa48("414") ? true : (stryCov_9fa48("414", "415", "416"), (stryMutAct_9fa48("418") ? contest_name !== undefined || contest_name !== null : stryMutAct_9fa48("417") ? true : (stryCov_9fa48("417", "418"), (stryMutAct_9fa48("420") ? contest_name === undefined : stryMutAct_9fa48("419") ? true : (stryCov_9fa48("419", "420"), contest_name !== undefined)) && (stryMutAct_9fa48("422") ? contest_name === null : stryMutAct_9fa48("421") ? true : (stryCov_9fa48("421", "422"), contest_name !== null)))) && (stryMutAct_9fa48("423") ? contest_name : (stryCov_9fa48("423"), contest_name.trim())))) {
            if (stryMutAct_9fa48("424")) {
              {}
            } else {
              stryCov_9fa48("424");
              if (stryMutAct_9fa48("428") ? contest_name.trim().length <= 50 : stryMutAct_9fa48("427") ? contest_name.trim().length >= 50 : stryMutAct_9fa48("426") ? false : stryMutAct_9fa48("425") ? true : (stryCov_9fa48("425", "426", "427", "428"), (stryMutAct_9fa48("429") ? contest_name.length : (stryCov_9fa48("429"), contest_name.trim().length)) > 50)) {
                if (stryMutAct_9fa48("430")) {
                  {}
                } else {
                  stryCov_9fa48("430");
                  return res.status(400).json(stryMutAct_9fa48("431") ? {} : (stryCov_9fa48("431"), {
                    success: stryMutAct_9fa48("432") ? true : (stryCov_9fa48("432"), false),
                    message: stryMutAct_9fa48("433") ? "" : (stryCov_9fa48("433"), 'Contest name must be 50 characters or less')
                  }));
                }
              }
            }
          }

          // Update profile based on role
          let updatedProfile;
          if (stryMutAct_9fa48("436") ? role !== 'learner' : stryMutAct_9fa48("435") ? false : stryMutAct_9fa48("434") ? true : (stryCov_9fa48("434", "435", "436"), role === (stryMutAct_9fa48("437") ? "" : (stryCov_9fa48("437"), 'learner')))) {
            if (stryMutAct_9fa48("438")) {
              {}
            } else {
              stryCov_9fa48("438");
              const updates = {};
              if (stryMutAct_9fa48("441") ? name === undefined : stryMutAct_9fa48("440") ? false : stryMutAct_9fa48("439") ? true : (stryCov_9fa48("439", "440", "441"), name !== undefined)) updates.name = stryMutAct_9fa48("442") ? name : (stryCov_9fa48("442"), name.trim());
              if (stryMutAct_9fa48("445") ? contest_name === undefined : stryMutAct_9fa48("444") ? false : stryMutAct_9fa48("443") ? true : (stryCov_9fa48("443", "444", "445"), contest_name !== undefined)) updates.contest_name = contest_name ? stryMutAct_9fa48("446") ? contest_name : (stryCov_9fa48("446"), contest_name.trim()) : null;
              updatedProfile = await authRepository.updateLearnerProfile(id, updates);
            }
          } else if (stryMutAct_9fa48("449") ? role !== 'admin' : stryMutAct_9fa48("448") ? false : stryMutAct_9fa48("447") ? true : (stryCov_9fa48("447", "448", "449"), role === (stryMutAct_9fa48("450") ? "" : (stryCov_9fa48("450"), 'admin')))) {
            if (stryMutAct_9fa48("451")) {
              {}
            } else {
              stryCov_9fa48("451");
              if (stryMutAct_9fa48("454") ? contest_name === undefined : stryMutAct_9fa48("453") ? false : stryMutAct_9fa48("452") ? true : (stryCov_9fa48("452", "453", "454"), contest_name !== undefined)) {
                if (stryMutAct_9fa48("455")) {
                  {}
                } else {
                  stryCov_9fa48("455");
                  return res.status(400).json(stryMutAct_9fa48("456") ? {} : (stryCov_9fa48("456"), {
                    success: stryMutAct_9fa48("457") ? true : (stryCov_9fa48("457"), false),
                    message: stryMutAct_9fa48("458") ? "" : (stryCov_9fa48("458"), 'Contest name is only available for learners')
                  }));
                }
              }
              updatedProfile = await authRepository.updateAdminProfile(id, stryMutAct_9fa48("459") ? name : (stryCov_9fa48("459"), name.trim()));
            }
          } else {
            if (stryMutAct_9fa48("460")) {
              {}
            } else {
              stryCov_9fa48("460");
              throw ERRORS.INVALID_AUTH_TOKEN;
            }
          }
          if (stryMutAct_9fa48("463") ? false : stryMutAct_9fa48("462") ? true : stryMutAct_9fa48("461") ? updatedProfile : (stryCov_9fa48("461", "462", "463"), !updatedProfile)) {
            if (stryMutAct_9fa48("464")) {
              {}
            } else {
              stryCov_9fa48("464");
              throw ERRORS.USER_NOT_FOUND;
            }
          }

          // Send confirmation email (non-blocking)
          emailService.sendProfileUpdateConfirmation(updatedProfile.email, updatedProfile.name).catch(stryMutAct_9fa48("465") ? () => undefined : (stryCov_9fa48("465"), err => console.error(stryMutAct_9fa48("466") ? "" : (stryCov_9fa48("466"), 'Failed to send profile update confirmation:'), err)));
          res.json(successResponse(stryMutAct_9fa48("467") ? {} : (stryCov_9fa48("467"), {
            user: updatedProfile
          }), stryMutAct_9fa48("468") ? "" : (stryCov_9fa48("468"), 'Profile updated successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("469")) {
          {}
        } else {
          stryCov_9fa48("469");
          console.error(stryMutAct_9fa48("470") ? "" : (stryCov_9fa48("470"), 'Error updating profile:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Initiate forgot password - Send OTP
   */
  async forgotPassword(req, res, next) {
    if (stryMutAct_9fa48("471")) {
      {}
    } else {
      stryCov_9fa48("471");
      try {
        if (stryMutAct_9fa48("472")) {
          {}
        } else {
          stryCov_9fa48("472");
          const {
            email,
            role
          } = req.body;
          if (stryMutAct_9fa48("475") ? !email && !role : stryMutAct_9fa48("474") ? false : stryMutAct_9fa48("473") ? true : (stryCov_9fa48("473", "474", "475"), (stryMutAct_9fa48("476") ? email : (stryCov_9fa48("476"), !email)) || (stryMutAct_9fa48("477") ? role : (stryCov_9fa48("477"), !role)))) {
            if (stryMutAct_9fa48("478")) {
              {}
            } else {
              stryCov_9fa48("478");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }

          // Validate email
          const emailValidation = validateEmail(email);
          if (stryMutAct_9fa48("481") ? false : stryMutAct_9fa48("480") ? true : stryMutAct_9fa48("479") ? emailValidation.isValid : (stryCov_9fa48("479", "480", "481"), !emailValidation.isValid)) {
            if (stryMutAct_9fa48("482")) {
              {}
            } else {
              stryCov_9fa48("482");
              return res.status(400).json(stryMutAct_9fa48("483") ? {} : (stryCov_9fa48("483"), {
                success: stryMutAct_9fa48("484") ? true : (stryCov_9fa48("484"), false),
                message: emailValidation.errors.join(stryMutAct_9fa48("485") ? "" : (stryCov_9fa48("485"), ', '))
              }));
            }
          }

          // Check if user exists
          let user;
          if (stryMutAct_9fa48("488") ? role !== 'learner' : stryMutAct_9fa48("487") ? false : stryMutAct_9fa48("486") ? true : (stryCov_9fa48("486", "487", "488"), role === (stryMutAct_9fa48("489") ? "" : (stryCov_9fa48("489"), 'learner')))) {
            if (stryMutAct_9fa48("490")) {
              {}
            } else {
              stryCov_9fa48("490");
              user = await authRepository.findLearnerByEmail(email);
            }
          } else if (stryMutAct_9fa48("493") ? role !== 'admin' : stryMutAct_9fa48("492") ? false : stryMutAct_9fa48("491") ? true : (stryCov_9fa48("491", "492", "493"), role === (stryMutAct_9fa48("494") ? "" : (stryCov_9fa48("494"), 'admin')))) {
            if (stryMutAct_9fa48("495")) {
              {}
            } else {
              stryCov_9fa48("495");
              user = await authRepository.findAdminByEmail(email);
            }
          } else {
            if (stryMutAct_9fa48("496")) {
              {}
            } else {
              stryCov_9fa48("496");
              return res.status(400).json(stryMutAct_9fa48("497") ? {} : (stryCov_9fa48("497"), {
                success: stryMutAct_9fa48("498") ? true : (stryCov_9fa48("498"), false),
                message: stryMutAct_9fa48("499") ? "" : (stryCov_9fa48("499"), 'Invalid role specified')
              }));
            }
          }
          if (stryMutAct_9fa48("502") ? false : stryMutAct_9fa48("501") ? true : stryMutAct_9fa48("500") ? user : (stryCov_9fa48("500", "501", "502"), !user)) {
            if (stryMutAct_9fa48("503")) {
              {}
            } else {
              stryCov_9fa48("503");
              // User doesn't exist - return error message
              return res.status(404).json(stryMutAct_9fa48("504") ? {} : (stryCov_9fa48("504"), {
                success: stryMutAct_9fa48("505") ? true : (stryCov_9fa48("505"), false),
                message: stryMutAct_9fa48("506") ? `` : (stryCov_9fa48("506"), `No ${role} account found with this email. Please sign up first.`)
              }));
            }
          }

          // Check if user's email is verified
          if (stryMutAct_9fa48("509") ? false : stryMutAct_9fa48("508") ? true : stryMutAct_9fa48("507") ? user.is_email_verified : (stryCov_9fa48("507", "508", "509"), !user.is_email_verified)) {
            if (stryMutAct_9fa48("510")) {
              {}
            } else {
              stryCov_9fa48("510");
              return res.status(400).json(stryMutAct_9fa48("511") ? {} : (stryCov_9fa48("511"), {
                success: stryMutAct_9fa48("512") ? true : (stryCov_9fa48("512"), false),
                message: stryMutAct_9fa48("513") ? "" : (stryCov_9fa48("513"), 'Email not verified. Please complete signup verification first.')
              }));
            }
          }

          // Generate and store OTP
          const otp = emailService.generateOTP();
          await authRepository.storeOTP(email, otp, stryMutAct_9fa48("514") ? "" : (stryCov_9fa48("514"), 'password_reset'), role);

          // Send OTP email
          console.log(stryMutAct_9fa48("515") ? `` : (stryCov_9fa48("515"), `🔐 Sending password reset OTP for ${role}: ${email}`));
          await emailService.sendPasswordResetOTP(email, user.name, otp);
          res.json(successResponse(stryMutAct_9fa48("516") ? {} : (stryCov_9fa48("516"), {
            email,
            message: stryMutAct_9fa48("517") ? "" : (stryCov_9fa48("517"), 'OTP sent to your email')
          }), stryMutAct_9fa48("518") ? "" : (stryCov_9fa48("518"), 'Password reset OTP sent successfully. Check your email.')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("519")) {
          {}
        } else {
          stryCov_9fa48("519");
          console.error(stryMutAct_9fa48("520") ? "" : (stryCov_9fa48("520"), 'Error in forgot password:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Verify OTP for password reset
   */
  async verifyResetOTP(req, res, next) {
    if (stryMutAct_9fa48("521")) {
      {}
    } else {
      stryCov_9fa48("521");
      try {
        if (stryMutAct_9fa48("522")) {
          {}
        } else {
          stryCov_9fa48("522");
          const {
            email,
            otp,
            role
          } = req.body;
          if (stryMutAct_9fa48("525") ? (!email || !otp) && !role : stryMutAct_9fa48("524") ? false : stryMutAct_9fa48("523") ? true : (stryCov_9fa48("523", "524", "525"), (stryMutAct_9fa48("527") ? !email && !otp : stryMutAct_9fa48("526") ? false : (stryCov_9fa48("526", "527"), (stryMutAct_9fa48("528") ? email : (stryCov_9fa48("528"), !email)) || (stryMutAct_9fa48("529") ? otp : (stryCov_9fa48("529"), !otp)))) || (stryMutAct_9fa48("530") ? role : (stryCov_9fa48("530"), !role)))) {
            if (stryMutAct_9fa48("531")) {
              {}
            } else {
              stryCov_9fa48("531");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }

          // Validate OTP format
          const otpValidation = validateOTP(otp);
          if (stryMutAct_9fa48("534") ? false : stryMutAct_9fa48("533") ? true : stryMutAct_9fa48("532") ? otpValidation.isValid : (stryCov_9fa48("532", "533", "534"), !otpValidation.isValid)) {
            if (stryMutAct_9fa48("535")) {
              {}
            } else {
              stryCov_9fa48("535");
              return res.status(400).json(stryMutAct_9fa48("536") ? {} : (stryCov_9fa48("536"), {
                success: stryMutAct_9fa48("537") ? true : (stryCov_9fa48("537"), false),
                message: otpValidation.errors.join(stryMutAct_9fa48("538") ? "" : (stryCov_9fa48("538"), ', '))
              }));
            }
          }

          // Verify OTP
          const otpRecord = await authRepository.verifyOTP(email, otp, stryMutAct_9fa48("539") ? "" : (stryCov_9fa48("539"), 'password_reset'), role);
          if (stryMutAct_9fa48("542") ? false : stryMutAct_9fa48("541") ? true : stryMutAct_9fa48("540") ? otpRecord : (stryCov_9fa48("540", "541", "542"), !otpRecord)) {
            if (stryMutAct_9fa48("543")) {
              {}
            } else {
              stryCov_9fa48("543");
              return res.status(400).json(stryMutAct_9fa48("544") ? {} : (stryCov_9fa48("544"), {
                success: stryMutAct_9fa48("545") ? true : (stryCov_9fa48("545"), false),
                message: stryMutAct_9fa48("546") ? "" : (stryCov_9fa48("546"), 'Invalid or expired OTP')
              }));
            }
          }
          res.json(successResponse(stryMutAct_9fa48("547") ? {} : (stryCov_9fa48("547"), {
            email,
            verified: stryMutAct_9fa48("548") ? false : (stryCov_9fa48("548"), true)
          }), stryMutAct_9fa48("549") ? "" : (stryCov_9fa48("549"), 'OTP verified successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("550")) {
          {}
        } else {
          stryCov_9fa48("550");
          console.error(stryMutAct_9fa48("551") ? "" : (stryCov_9fa48("551"), 'Error in verify reset OTP:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Reset password after OTP verification
   */
  async resetPassword(req, res, next) {
    if (stryMutAct_9fa48("552")) {
      {}
    } else {
      stryCov_9fa48("552");
      try {
        if (stryMutAct_9fa48("553")) {
          {}
        } else {
          stryCov_9fa48("553");
          const {
            email,
            otp,
            newPassword,
            confirmPassword,
            role
          } = req.body;
          if (stryMutAct_9fa48("556") ? (!email || !otp || !newPassword || !confirmPassword) && !role : stryMutAct_9fa48("555") ? false : stryMutAct_9fa48("554") ? true : (stryCov_9fa48("554", "555", "556"), (stryMutAct_9fa48("558") ? (!email || !otp || !newPassword) && !confirmPassword : stryMutAct_9fa48("557") ? false : (stryCov_9fa48("557", "558"), (stryMutAct_9fa48("560") ? (!email || !otp) && !newPassword : stryMutAct_9fa48("559") ? false : (stryCov_9fa48("559", "560"), (stryMutAct_9fa48("562") ? !email && !otp : stryMutAct_9fa48("561") ? false : (stryCov_9fa48("561", "562"), (stryMutAct_9fa48("563") ? email : (stryCov_9fa48("563"), !email)) || (stryMutAct_9fa48("564") ? otp : (stryCov_9fa48("564"), !otp)))) || (stryMutAct_9fa48("565") ? newPassword : (stryCov_9fa48("565"), !newPassword)))) || (stryMutAct_9fa48("566") ? confirmPassword : (stryCov_9fa48("566"), !confirmPassword)))) || (stryMutAct_9fa48("567") ? role : (stryCov_9fa48("567"), !role)))) {
            if (stryMutAct_9fa48("568")) {
              {}
            } else {
              stryCov_9fa48("568");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }

          // Check if passwords match
          if (stryMutAct_9fa48("571") ? newPassword === confirmPassword : stryMutAct_9fa48("570") ? false : stryMutAct_9fa48("569") ? true : (stryCov_9fa48("569", "570", "571"), newPassword !== confirmPassword)) {
            if (stryMutAct_9fa48("572")) {
              {}
            } else {
              stryCov_9fa48("572");
              return res.status(400).json(stryMutAct_9fa48("573") ? {} : (stryCov_9fa48("573"), {
                success: stryMutAct_9fa48("574") ? true : (stryCov_9fa48("574"), false),
                message: stryMutAct_9fa48("575") ? "" : (stryCov_9fa48("575"), 'Passwords do not match')
              }));
            }
          }

          // Get user to validate password against name
          let user;
          if (stryMutAct_9fa48("578") ? role !== 'learner' : stryMutAct_9fa48("577") ? false : stryMutAct_9fa48("576") ? true : (stryCov_9fa48("576", "577", "578"), role === (stryMutAct_9fa48("579") ? "" : (stryCov_9fa48("579"), 'learner')))) {
            if (stryMutAct_9fa48("580")) {
              {}
            } else {
              stryCov_9fa48("580");
              user = await authRepository.findLearnerByEmail(email);
            }
          } else if (stryMutAct_9fa48("583") ? role !== 'admin' : stryMutAct_9fa48("582") ? false : stryMutAct_9fa48("581") ? true : (stryCov_9fa48("581", "582", "583"), role === (stryMutAct_9fa48("584") ? "" : (stryCov_9fa48("584"), 'admin')))) {
            if (stryMutAct_9fa48("585")) {
              {}
            } else {
              stryCov_9fa48("585");
              user = await authRepository.findAdminByEmail(email);
            }
          }
          if (stryMutAct_9fa48("588") ? false : stryMutAct_9fa48("587") ? true : stryMutAct_9fa48("586") ? user : (stryCov_9fa48("586", "587", "588"), !user)) {
            if (stryMutAct_9fa48("589")) {
              {}
            } else {
              stryCov_9fa48("589");
              return res.status(404).json(stryMutAct_9fa48("590") ? {} : (stryCov_9fa48("590"), {
                success: stryMutAct_9fa48("591") ? true : (stryCov_9fa48("591"), false),
                message: stryMutAct_9fa48("592") ? "" : (stryCov_9fa48("592"), 'User not found')
              }));
            }
          }

          // Validate new password
          const passwordValidation = validatePassword(newPassword, email, user.name);
          if (stryMutAct_9fa48("595") ? false : stryMutAct_9fa48("594") ? true : stryMutAct_9fa48("593") ? passwordValidation.isValid : (stryCov_9fa48("593", "594", "595"), !passwordValidation.isValid)) {
            if (stryMutAct_9fa48("596")) {
              {}
            } else {
              stryCov_9fa48("596");
              return res.status(400).json(stryMutAct_9fa48("597") ? {} : (stryCov_9fa48("597"), {
                success: stryMutAct_9fa48("598") ? true : (stryCov_9fa48("598"), false),
                message: passwordValidation.errors.join(stryMutAct_9fa48("599") ? "" : (stryCov_9fa48("599"), ', ')),
                suggestions: generatePasswordSuggestions(3)
              }));
            }
          }

          // Verify OTP one more time
          const otpRecord = await authRepository.verifyOTP(email, otp, stryMutAct_9fa48("600") ? "" : (stryCov_9fa48("600"), 'password_reset'), role);
          if (stryMutAct_9fa48("603") ? false : stryMutAct_9fa48("602") ? true : stryMutAct_9fa48("601") ? otpRecord : (stryCov_9fa48("601", "602", "603"), !otpRecord)) {
            if (stryMutAct_9fa48("604")) {
              {}
            } else {
              stryCov_9fa48("604");
              return res.status(400).json(stryMutAct_9fa48("605") ? {} : (stryCov_9fa48("605"), {
                success: stryMutAct_9fa48("606") ? true : (stryCov_9fa48("606"), false),
                message: stryMutAct_9fa48("607") ? "" : (stryCov_9fa48("607"), 'Invalid or expired OTP')
              }));
            }
          }

          // Hash new password
          const passwordHash = await bcrypt.hash(newPassword, 10);

          // Update password
          if (stryMutAct_9fa48("610") ? role !== 'learner' : stryMutAct_9fa48("609") ? false : stryMutAct_9fa48("608") ? true : (stryCov_9fa48("608", "609", "610"), role === (stryMutAct_9fa48("611") ? "" : (stryCov_9fa48("611"), 'learner')))) {
            if (stryMutAct_9fa48("612")) {
              {}
            } else {
              stryCov_9fa48("612");
              await authRepository.updateLearnerPassword(email, passwordHash);
            }
          } else {
            if (stryMutAct_9fa48("613")) {
              {}
            } else {
              stryCov_9fa48("613");
              await authRepository.updateAdminPassword(email, passwordHash);
            }
          }

          // Mark OTP as used
          await authRepository.markOTPAsUsed(otpRecord.id);

          // Clean up all password reset OTPs for this email
          await authRepository.deleteOTPsByEmail(email, stryMutAct_9fa48("614") ? "" : (stryCov_9fa48("614"), 'password_reset'), role);
          res.json(successResponse(stryMutAct_9fa48("615") ? {} : (stryCov_9fa48("615"), {
            message: stryMutAct_9fa48("616") ? "" : (stryCov_9fa48("616"), 'Password reset successful')
          }), stryMutAct_9fa48("617") ? "" : (stryCov_9fa48("617"), 'Your password has been reset successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("618")) {
          {}
        } else {
          stryCov_9fa48("618");
          console.error(stryMutAct_9fa48("619") ? "" : (stryCov_9fa48("619"), 'Error in reset password:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Resend OTP
   */
  async resendOTP(req, res, next) {
    if (stryMutAct_9fa48("620")) {
      {}
    } else {
      stryCov_9fa48("620");
      try {
        if (stryMutAct_9fa48("621")) {
          {}
        } else {
          stryCov_9fa48("621");
          const {
            email,
            otpType,
            role,
            name
          } = req.body;
          if (stryMutAct_9fa48("624") ? (!email || !otpType) && !role : stryMutAct_9fa48("623") ? false : stryMutAct_9fa48("622") ? true : (stryCov_9fa48("622", "623", "624"), (stryMutAct_9fa48("626") ? !email && !otpType : stryMutAct_9fa48("625") ? false : (stryCov_9fa48("625", "626"), (stryMutAct_9fa48("627") ? email : (stryCov_9fa48("627"), !email)) || (stryMutAct_9fa48("628") ? otpType : (stryCov_9fa48("628"), !otpType)))) || (stryMutAct_9fa48("629") ? role : (stryCov_9fa48("629"), !role)))) {
            if (stryMutAct_9fa48("630")) {
              {}
            } else {
              stryCov_9fa48("630");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }

          // Validate email
          const emailValidation = validateEmail(email);
          if (stryMutAct_9fa48("633") ? false : stryMutAct_9fa48("632") ? true : stryMutAct_9fa48("631") ? emailValidation.isValid : (stryCov_9fa48("631", "632", "633"), !emailValidation.isValid)) {
            if (stryMutAct_9fa48("634")) {
              {}
            } else {
              stryCov_9fa48("634");
              return res.status(400).json(stryMutAct_9fa48("635") ? {} : (stryCov_9fa48("635"), {
                success: stryMutAct_9fa48("636") ? true : (stryCov_9fa48("636"), false),
                message: emailValidation.errors.join(stryMutAct_9fa48("637") ? "" : (stryCov_9fa48("637"), ', '))
              }));
            }
          }

          // For password reset, verify user exists and is verified
          if (stryMutAct_9fa48("640") ? otpType !== 'password_reset' : stryMutAct_9fa48("639") ? false : stryMutAct_9fa48("638") ? true : (stryCov_9fa48("638", "639", "640"), otpType === (stryMutAct_9fa48("641") ? "" : (stryCov_9fa48("641"), 'password_reset')))) {
            if (stryMutAct_9fa48("642")) {
              {}
            } else {
              stryCov_9fa48("642");
              let user;
              if (stryMutAct_9fa48("645") ? role !== 'learner' : stryMutAct_9fa48("644") ? false : stryMutAct_9fa48("643") ? true : (stryCov_9fa48("643", "644", "645"), role === (stryMutAct_9fa48("646") ? "" : (stryCov_9fa48("646"), 'learner')))) {
                if (stryMutAct_9fa48("647")) {
                  {}
                } else {
                  stryCov_9fa48("647");
                  user = await authRepository.findLearnerByEmail(email);
                }
              } else if (stryMutAct_9fa48("650") ? role !== 'admin' : stryMutAct_9fa48("649") ? false : stryMutAct_9fa48("648") ? true : (stryCov_9fa48("648", "649", "650"), role === (stryMutAct_9fa48("651") ? "" : (stryCov_9fa48("651"), 'admin')))) {
                if (stryMutAct_9fa48("652")) {
                  {}
                } else {
                  stryCov_9fa48("652");
                  user = await authRepository.findAdminByEmail(email);
                }
              }
              if (stryMutAct_9fa48("655") ? false : stryMutAct_9fa48("654") ? true : stryMutAct_9fa48("653") ? user : (stryCov_9fa48("653", "654", "655"), !user)) {
                if (stryMutAct_9fa48("656")) {
                  {}
                } else {
                  stryCov_9fa48("656");
                  return res.status(404).json(stryMutAct_9fa48("657") ? {} : (stryCov_9fa48("657"), {
                    success: stryMutAct_9fa48("658") ? true : (stryCov_9fa48("658"), false),
                    message: stryMutAct_9fa48("659") ? `` : (stryCov_9fa48("659"), `No ${role} account found with this email.`)
                  }));
                }
              }
              if (stryMutAct_9fa48("662") ? false : stryMutAct_9fa48("661") ? true : stryMutAct_9fa48("660") ? user.is_email_verified : (stryCov_9fa48("660", "661", "662"), !user.is_email_verified)) {
                if (stryMutAct_9fa48("663")) {
                  {}
                } else {
                  stryCov_9fa48("663");
                  return res.status(400).json(stryMutAct_9fa48("664") ? {} : (stryCov_9fa48("664"), {
                    success: stryMutAct_9fa48("665") ? true : (stryCov_9fa48("665"), false),
                    message: stryMutAct_9fa48("666") ? "" : (stryCov_9fa48("666"), 'Email not verified. Please complete signup verification first.')
                  }));
                }
              }
            }
          }

          // Enforce 60-second resend cooldown
          const latest = await authRepository.getLatestOTP(email, otpType, role);
          if (stryMutAct_9fa48("668") ? false : stryMutAct_9fa48("667") ? true : (stryCov_9fa48("667", "668"), latest)) {
            if (stryMutAct_9fa48("669")) {
              {}
            } else {
              stryCov_9fa48("669");
              const createdAt = new Date(latest.created_at).getTime();
              const elapsedMs = stryMutAct_9fa48("670") ? Date.now() + createdAt : (stryCov_9fa48("670"), Date.now() - createdAt);
              const cooldownMs = stryMutAct_9fa48("671") ? 60 / 1000 : (stryCov_9fa48("671"), 60 * 1000);
              if (stryMutAct_9fa48("675") ? elapsedMs >= cooldownMs : stryMutAct_9fa48("674") ? elapsedMs <= cooldownMs : stryMutAct_9fa48("673") ? false : stryMutAct_9fa48("672") ? true : (stryCov_9fa48("672", "673", "674", "675"), elapsedMs < cooldownMs)) {
                if (stryMutAct_9fa48("676")) {
                  {}
                } else {
                  stryCov_9fa48("676");
                  const remaining = Math.ceil(stryMutAct_9fa48("677") ? (cooldownMs - elapsedMs) * 1000 : (stryCov_9fa48("677"), (stryMutAct_9fa48("678") ? cooldownMs + elapsedMs : (stryCov_9fa48("678"), cooldownMs - elapsedMs)) / 1000));
                  return res.status(429).json(stryMutAct_9fa48("679") ? {} : (stryCov_9fa48("679"), {
                    success: stryMutAct_9fa48("680") ? true : (stryCov_9fa48("680"), false),
                    message: stryMutAct_9fa48("681") ? `` : (stryCov_9fa48("681"), `Please wait ${remaining}s before requesting a new OTP.`)
                  }));
                }
              }
            }
          }

          // Generate new OTP
          const otp = emailService.generateOTP();
          await authRepository.storeOTP(email, otp, otpType, role);

          // Send OTP based on type
          console.log(stryMutAct_9fa48("682") ? `` : (stryCov_9fa48("682"), `🔄 Resending ${otpType} OTP to: ${email}`));
          if (stryMutAct_9fa48("685") ? otpType !== 'signup' : stryMutAct_9fa48("684") ? false : stryMutAct_9fa48("683") ? true : (stryCov_9fa48("683", "684", "685"), otpType === (stryMutAct_9fa48("686") ? "" : (stryCov_9fa48("686"), 'signup')))) {
            if (stryMutAct_9fa48("687")) {
              {}
            } else {
              stryCov_9fa48("687");
              await emailService.sendSignupOTP(email, stryMutAct_9fa48("690") ? name && 'User' : stryMutAct_9fa48("689") ? false : stryMutAct_9fa48("688") ? true : (stryCov_9fa48("688", "689", "690"), name || (stryMutAct_9fa48("691") ? "" : (stryCov_9fa48("691"), 'User'))), otp);
            }
          } else if (stryMutAct_9fa48("694") ? otpType !== 'password_reset' : stryMutAct_9fa48("693") ? false : stryMutAct_9fa48("692") ? true : (stryCov_9fa48("692", "693", "694"), otpType === (stryMutAct_9fa48("695") ? "" : (stryCov_9fa48("695"), 'password_reset')))) {
            if (stryMutAct_9fa48("696")) {
              {}
            } else {
              stryCov_9fa48("696");
              // Get user name
              let user;
              if (stryMutAct_9fa48("699") ? role !== 'learner' : stryMutAct_9fa48("698") ? false : stryMutAct_9fa48("697") ? true : (stryCov_9fa48("697", "698", "699"), role === (stryMutAct_9fa48("700") ? "" : (stryCov_9fa48("700"), 'learner')))) {
                if (stryMutAct_9fa48("701")) {
                  {}
                } else {
                  stryCov_9fa48("701");
                  user = await authRepository.findLearnerByEmail(email);
                }
              } else {
                if (stryMutAct_9fa48("702")) {
                  {}
                } else {
                  stryCov_9fa48("702");
                  user = await authRepository.findAdminByEmail(email);
                }
              }
              await emailService.sendPasswordResetOTP(email, stryMutAct_9fa48("705") ? user?.name && 'User' : stryMutAct_9fa48("704") ? false : stryMutAct_9fa48("703") ? true : (stryCov_9fa48("703", "704", "705"), (stryMutAct_9fa48("706") ? user.name : (stryCov_9fa48("706"), user?.name)) || (stryMutAct_9fa48("707") ? "" : (stryCov_9fa48("707"), 'User'))), otp);
            }
          }
          console.log(stryMutAct_9fa48("708") ? `` : (stryCov_9fa48("708"), `✅ OTP resent successfully to: ${email}`));
          res.json(successResponse(stryMutAct_9fa48("709") ? {} : (stryCov_9fa48("709"), {
            message: stryMutAct_9fa48("710") ? "" : (stryCov_9fa48("710"), 'OTP resent successfully')
          }), stryMutAct_9fa48("711") ? "" : (stryCov_9fa48("711"), 'A new OTP has been sent to your email')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("712")) {
          {}
        } else {
          stryCov_9fa48("712");
          console.error(stryMutAct_9fa48("713") ? "" : (stryCov_9fa48("713"), '❌ Error in resend OTP:'), error);
          console.error(stryMutAct_9fa48("714") ? "" : (stryCov_9fa48("714"), '   Details:'), error.message);
          return res.status(500).json(stryMutAct_9fa48("715") ? {} : (stryCov_9fa48("715"), {
            success: stryMutAct_9fa48("716") ? true : (stryCov_9fa48("716"), false),
            message: stryMutAct_9fa48("717") ? "" : (stryCov_9fa48("717"), 'Failed to resend OTP. Please try again.')
          }));
        }
      }
    }
  }

  /**
   * Get password suggestions
   */
  async getPasswordSuggestions(req, res, next) {
    if (stryMutAct_9fa48("718")) {
      {}
    } else {
      stryCov_9fa48("718");
      try {
        if (stryMutAct_9fa48("719")) {
          {}
        } else {
          stryCov_9fa48("719");
          const suggestions = generatePasswordSuggestions(5);
          res.json(successResponse(stryMutAct_9fa48("720") ? {} : (stryCov_9fa48("720"), {
            suggestions
          }), stryMutAct_9fa48("721") ? "" : (stryCov_9fa48("721"), 'Password suggestions generated')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("722")) {
          {}
        } else {
          stryCov_9fa48("722");
          console.error(stryMutAct_9fa48("723") ? "" : (stryCov_9fa48("723"), 'Error generating password suggestions:'), error);
          next(error);
        }
      }
    }
  }
}
export default new AuthController();