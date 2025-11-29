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
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Email service for sending OTP and other emails
 */
class EmailService {
  constructor() {
    if (stryMutAct_9fa48("1206")) {
      {}
    } else {
      stryCov_9fa48("1206");
      // Verify email credentials are configured
      if (stryMutAct_9fa48("1209") ? !process.env.EMAIL_USER && !process.env.EMAIL_PASS : stryMutAct_9fa48("1208") ? false : stryMutAct_9fa48("1207") ? true : (stryCov_9fa48("1207", "1208", "1209"), (stryMutAct_9fa48("1210") ? process.env.EMAIL_USER : (stryCov_9fa48("1210"), !process.env.EMAIL_USER)) || (stryMutAct_9fa48("1211") ? process.env.EMAIL_PASS : (stryCov_9fa48("1211"), !process.env.EMAIL_PASS)))) {
        if (stryMutAct_9fa48("1212")) {
          {}
        } else {
          stryCov_9fa48("1212");
          console.error(stryMutAct_9fa48("1213") ? "" : (stryCov_9fa48("1213"), '❌ EMAIL CONFIGURATION ERROR:'));
          console.error(stryMutAct_9fa48("1214") ? "" : (stryCov_9fa48("1214"), '   EMAIL_USER:'), process.env.EMAIL_USER ? stryMutAct_9fa48("1215") ? "" : (stryCov_9fa48("1215"), '✓ Set') : stryMutAct_9fa48("1216") ? "" : (stryCov_9fa48("1216"), '✗ Missing'));
          console.error(stryMutAct_9fa48("1217") ? "" : (stryCov_9fa48("1217"), '   EMAIL_PASS:'), process.env.EMAIL_PASS ? stryMutAct_9fa48("1218") ? "" : (stryCov_9fa48("1218"), '✓ Set') : stryMutAct_9fa48("1219") ? "" : (stryCov_9fa48("1219"), '✗ Missing'));
          console.error(stryMutAct_9fa48("1220") ? "" : (stryCov_9fa48("1220"), '   Please add EMAIL_USER and EMAIL_PASS to your .env file'));
        }
      }

      // Create transporter with Gmail or other SMTP service
      this.transporter = nodemailer.createTransport(stryMutAct_9fa48("1221") ? {} : (stryCov_9fa48("1221"), {
        service: stryMutAct_9fa48("1222") ? "" : (stryCov_9fa48("1222"), 'gmail'),
        auth: stryMutAct_9fa48("1223") ? {} : (stryCov_9fa48("1223"), {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS // Use App Password for Gmail
        })
      }));

      // Verify connection on startup
      this.verifyConnection();
    }
  }

  /**
   * Verify email service connection
   */
  async verifyConnection() {
    if (stryMutAct_9fa48("1224")) {
      {}
    } else {
      stryCov_9fa48("1224");
      try {
        if (stryMutAct_9fa48("1225")) {
          {}
        } else {
          stryCov_9fa48("1225");
          await this.transporter.verify();
          console.log(stryMutAct_9fa48("1226") ? "" : (stryCov_9fa48("1226"), '✅ Email service connected successfully'));
          console.log(stryMutAct_9fa48("1227") ? "" : (stryCov_9fa48("1227"), '   Using email:'), process.env.EMAIL_USER);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1228")) {
          {}
        } else {
          stryCov_9fa48("1228");
          console.error(stryMutAct_9fa48("1229") ? "" : (stryCov_9fa48("1229"), '❌ Email service connection failed:'));
          console.error(stryMutAct_9fa48("1230") ? "" : (stryCov_9fa48("1230"), '   Error:'), error.message);
          console.error(stryMutAct_9fa48("1231") ? "" : (stryCov_9fa48("1231"), '   Check your EMAIL_USER and EMAIL_PASS in .env file'));
          console.error(stryMutAct_9fa48("1232") ? "" : (stryCov_9fa48("1232"), '   For Gmail, you need an App Password (not your regular password)'));
        }
      }
    }
  }

  /**
   * Generate a 6-digit OTP
   */
  generateOTP() {
    if (stryMutAct_9fa48("1233")) {
      {}
    } else {
      stryCov_9fa48("1233");
      return Math.floor(stryMutAct_9fa48("1234") ? 100000 - Math.random() * 900000 : (stryCov_9fa48("1234"), 100000 + (stryMutAct_9fa48("1235") ? Math.random() / 900000 : (stryCov_9fa48("1235"), Math.random() * 900000)))).toString();
    }
  }

  /**
   * Send OTP for email verification during signup
   */
  async sendSignupOTP(email, name, otp) {
    if (stryMutAct_9fa48("1236")) {
      {}
    } else {
      stryCov_9fa48("1236");
      const mailOptions = stryMutAct_9fa48("1237") ? {} : (stryCov_9fa48("1237"), {
        from: stryMutAct_9fa48("1238") ? `` : (stryCov_9fa48("1238"), `Fluentify <${process.env.EMAIL_USER}>`),
        to: email,
        subject: stryMutAct_9fa48("1239") ? "" : (stryCov_9fa48("1239"), 'Verify Your Email - Fluentify'),
        html: stryMutAct_9fa48("1240") ? `` : (stryCov_9fa48("1240"), `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border-radius: 8px; color: #667eea; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Fluentify!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thank you for signing up with Fluentify! To complete your registration, please verify your email address using the OTP below:</p>
              
              <div class="otp-box">${otp}</div>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> This OTP will expire in 2 minutes. Never share this code with anyone.
              </div>
              
              <p>If you didn't create an account with Fluentify, please ignore this email.</p>
              
              <p>Best regards,<br>The Fluentify Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `)
      });
      try {
        if (stryMutAct_9fa48("1241")) {
          {}
        } else {
          stryCov_9fa48("1241");
          console.log(stryMutAct_9fa48("1242") ? `` : (stryCov_9fa48("1242"), `📧 Sending signup OTP to: ${email}`));
          const info = await this.transporter.sendMail(mailOptions);
          console.log(stryMutAct_9fa48("1243") ? `` : (stryCov_9fa48("1243"), `✅ Signup OTP sent successfully to ${email}`));
          console.log(stryMutAct_9fa48("1244") ? `` : (stryCov_9fa48("1244"), `   Message ID: ${info.messageId}`));
          return stryMutAct_9fa48("1245") ? {} : (stryCov_9fa48("1245"), {
            success: stryMutAct_9fa48("1246") ? false : (stryCov_9fa48("1246"), true),
            messageId: info.messageId
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("1247")) {
          {}
        } else {
          stryCov_9fa48("1247");
          console.error(stryMutAct_9fa48("1248") ? `` : (stryCov_9fa48("1248"), `❌ Failed to send signup OTP to ${email}:`));
          console.error(stryMutAct_9fa48("1249") ? `` : (stryCov_9fa48("1249"), `   Error: ${error.message}`));
          if (stryMutAct_9fa48("1251") ? false : stryMutAct_9fa48("1250") ? true : (stryCov_9fa48("1250", "1251"), error.code)) console.error(stryMutAct_9fa48("1252") ? `` : (stryCov_9fa48("1252"), `   Code: ${error.code}`));
          if (stryMutAct_9fa48("1254") ? false : stryMutAct_9fa48("1253") ? true : (stryCov_9fa48("1253", "1254"), error.response)) console.error(stryMutAct_9fa48("1255") ? `` : (stryCov_9fa48("1255"), `   Response: ${error.response}`));
          throw new Error(stryMutAct_9fa48("1256") ? `` : (stryCov_9fa48("1256"), `Failed to send verification email: ${error.message}`));
        }
      }
    }
  }

  /**
   * Send OTP for password reset
   */
  async sendPasswordResetOTP(email, name, otp) {
    if (stryMutAct_9fa48("1257")) {
      {}
    } else {
      stryCov_9fa48("1257");
      const mailOptions = stryMutAct_9fa48("1258") ? {} : (stryCov_9fa48("1258"), {
        from: stryMutAct_9fa48("1259") ? `` : (stryCov_9fa48("1259"), `Fluentify <${process.env.EMAIL_USER}>`),
        to: email,
        subject: stryMutAct_9fa48("1260") ? "" : (stryCov_9fa48("1260"), 'Reset Your Password - Fluentify'),
        html: stryMutAct_9fa48("1261") ? `` : (stryCov_9fa48("1261"), `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #f5576c; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border-radius: 8px; color: #f5576c; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>We received a request to reset your password. Use the OTP below to proceed with resetting your password:</p>
              
              <div class="otp-box">${otp}</div>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> This OTP will expire in 2 minutes. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
              </div>
              
              <p>Best regards,<br>The Fluentify Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `)
      });
      try {
        if (stryMutAct_9fa48("1262")) {
          {}
        } else {
          stryCov_9fa48("1262");
          console.log(stryMutAct_9fa48("1263") ? `` : (stryCov_9fa48("1263"), `📧 Sending password reset OTP to: ${email}`));
          const info = await this.transporter.sendMail(mailOptions);
          console.log(stryMutAct_9fa48("1264") ? `` : (stryCov_9fa48("1264"), `✅ Password reset OTP sent successfully to ${email}`));
          console.log(stryMutAct_9fa48("1265") ? `` : (stryCov_9fa48("1265"), `   Message ID: ${info.messageId}`));
          return stryMutAct_9fa48("1266") ? {} : (stryCov_9fa48("1266"), {
            success: stryMutAct_9fa48("1267") ? false : (stryCov_9fa48("1267"), true),
            messageId: info.messageId
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("1268")) {
          {}
        } else {
          stryCov_9fa48("1268");
          console.error(stryMutAct_9fa48("1269") ? `` : (stryCov_9fa48("1269"), `❌ Failed to send password reset OTP to ${email}:`));
          console.error(stryMutAct_9fa48("1270") ? `` : (stryCov_9fa48("1270"), `   Error: ${error.message}`));
          if (stryMutAct_9fa48("1272") ? false : stryMutAct_9fa48("1271") ? true : (stryCov_9fa48("1271", "1272"), error.code)) console.error(stryMutAct_9fa48("1273") ? `` : (stryCov_9fa48("1273"), `   Code: ${error.code}`));
          if (stryMutAct_9fa48("1275") ? false : stryMutAct_9fa48("1274") ? true : (stryCov_9fa48("1274", "1275"), error.response)) console.error(stryMutAct_9fa48("1276") ? `` : (stryCov_9fa48("1276"), `   Response: ${error.response}`));
          throw new Error(stryMutAct_9fa48("1277") ? `` : (stryCov_9fa48("1277"), `Failed to send password reset email: ${error.message}`));
        }
      }
    }
  }

  /**
   * Send welcome email after successful verification
   */
  async sendWelcomeEmail(email, name) {
    if (stryMutAct_9fa48("1278")) {
      {}
    } else {
      stryCov_9fa48("1278");
      const mailOptions = stryMutAct_9fa48("1279") ? {} : (stryCov_9fa48("1279"), {
        from: stryMutAct_9fa48("1280") ? `` : (stryCov_9fa48("1280"), `Fluentify <${process.env.EMAIL_USER}>`),
        to: email,
        subject: stryMutAct_9fa48("1281") ? "" : (stryCov_9fa48("1281"), 'Welcome to Fluentify!'),
        html: stryMutAct_9fa48("1282") ? `` : (stryCov_9fa48("1282"), `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Fluentify!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Your email has been successfully verified! You're all set to start your language learning journey with Fluentify.</p>
              <p>Here's what you can do next:</p>
              <ul>
                <li>Set your learning preferences</li>
                <li>Choose your target language</li>
                <li>Start your first lesson</li>
              </ul>
              <p>We're excited to have you on board!</p>
              <p>Best regards,<br>The Fluentify Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `)
      });
      try {
        if (stryMutAct_9fa48("1283")) {
          {}
        } else {
          stryCov_9fa48("1283");
          await this.transporter.sendMail(mailOptions);
          return stryMutAct_9fa48("1284") ? {} : (stryCov_9fa48("1284"), {
            success: stryMutAct_9fa48("1285") ? false : (stryCov_9fa48("1285"), true)
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("1286")) {
          {}
        } else {
          stryCov_9fa48("1286");
          console.error(stryMutAct_9fa48("1287") ? "" : (stryCov_9fa48("1287"), 'Error sending welcome email:'), error);
          // Don't throw error for welcome email as it's not critical
          return stryMutAct_9fa48("1288") ? {} : (stryCov_9fa48("1288"), {
            success: stryMutAct_9fa48("1289") ? true : (stryCov_9fa48("1289"), false)
          });
        }
      }
    }
  }

  /**
   * Send profile update confirmation
   */
  async sendProfileUpdateConfirmation(email, name) {
    if (stryMutAct_9fa48("1290")) {
      {}
    } else {
      stryCov_9fa48("1290");
      const mailOptions = stryMutAct_9fa48("1291") ? {} : (stryCov_9fa48("1291"), {
        from: stryMutAct_9fa48("1292") ? `` : (stryCov_9fa48("1292"), `Fluentify <${process.env.EMAIL_USER}>`),
        to: email,
        subject: stryMutAct_9fa48("1293") ? "" : (stryCov_9fa48("1293"), 'Your Profile Was Updated - Fluentify'),
        html: stryMutAct_9fa48("1294") ? `` : (stryCov_9fa48("1294"), `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #eef2ff; color: #1f2937; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Profile Updated</h2>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>This is a confirmation that your profile details were updated successfully.</p>
              <p>If you did not make this change, please contact support immediately.</p>
              <p>Best regards,<br/>The Fluentify Team</p>
            </div>
            <div class="footer">This is an automated email. Please do not reply.</div>
          </div>
        </body>
        </html>
      `)
      });
      try {
        if (stryMutAct_9fa48("1295")) {
          {}
        } else {
          stryCov_9fa48("1295");
          await this.transporter.sendMail(mailOptions);
          return stryMutAct_9fa48("1296") ? {} : (stryCov_9fa48("1296"), {
            success: stryMutAct_9fa48("1297") ? false : (stryCov_9fa48("1297"), true)
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("1298")) {
          {}
        } else {
          stryCov_9fa48("1298");
          console.error(stryMutAct_9fa48("1299") ? "" : (stryCov_9fa48("1299"), 'Error sending profile update confirmation:'), error);
          return stryMutAct_9fa48("1300") ? {} : (stryCov_9fa48("1300"), {
            success: stryMutAct_9fa48("1301") ? true : (stryCov_9fa48("1301"), false)
          });
        }
      }
    }
  }

  /**
   * Notify learner that an admin updated their profile
   * @param {string} email - Learner's email
   * @param {string} name - Learner's name
   * @param {Object} changes - Object with field changes { fieldName: { old: 'value', new: 'value' } }
   */
  async sendAdminProfileChangeNotification(email, name, changes = {}) {
    if (stryMutAct_9fa48("1302")) {
      {}
    } else {
      stryCov_9fa48("1302");
      // Format field name for display
      const formatFieldName = field => {
        if (stryMutAct_9fa48("1303")) {
          {}
        } else {
          stryCov_9fa48("1303");
          const fieldNames = stryMutAct_9fa48("1304") ? {} : (stryCov_9fa48("1304"), {
            name: stryMutAct_9fa48("1305") ? "" : (stryCov_9fa48("1305"), 'Name'),
            email: stryMutAct_9fa48("1306") ? "" : (stryCov_9fa48("1306"), 'Email Address'),
            phone: stryMutAct_9fa48("1307") ? "" : (stryCov_9fa48("1307"), 'Phone Number')
          });
          return stryMutAct_9fa48("1310") ? fieldNames[field] && field.charAt(0).toUpperCase() + field.slice(1) : stryMutAct_9fa48("1309") ? false : stryMutAct_9fa48("1308") ? true : (stryCov_9fa48("1308", "1309", "1310"), fieldNames[field] || (stryMutAct_9fa48("1311") ? field.charAt(0).toUpperCase() - field.slice(1) : (stryCov_9fa48("1311"), (stryMutAct_9fa48("1313") ? field.toUpperCase() : stryMutAct_9fa48("1312") ? field.charAt(0).toLowerCase() : (stryCov_9fa48("1312", "1313"), field.charAt(0).toUpperCase())) + (stryMutAct_9fa48("1314") ? field : (stryCov_9fa48("1314"), field.slice(1))))));
        }
      };

      // Build change items HTML
      const changeItems = Object.entries(changes).map(([field, {
        old,
        new: newValue
      }]) => {
        if (stryMutAct_9fa48("1315")) {
          {}
        } else {
          stryCov_9fa48("1315");
          return stryMutAct_9fa48("1316") ? `` : (stryCov_9fa48("1316"), `
          <div class="change-item">
            <span class="field-name">${formatFieldName(field)}:</span><br/>
            Changed from "<em>${old}</em>" to "<strong>${newValue}</strong>"
          </div>
        `);
        }
      }).join(stryMutAct_9fa48("1317") ? "Stryker was here!" : (stryCov_9fa48("1317"), ''));
      const mailOptions = stryMutAct_9fa48("1318") ? {} : (stryCov_9fa48("1318"), {
        from: stryMutAct_9fa48("1319") ? `` : (stryCov_9fa48("1319"), `Fluentify <${process.env.EMAIL_USER}>`),
        to: email,
        subject: stryMutAct_9fa48("1320") ? "" : (stryCov_9fa48("1320"), 'Your Fluentify Profile Has Been Updated'),
        text: stryMutAct_9fa48("1321") ? `` : (stryCov_9fa48("1321"), `
Hello ${name},

Your Fluentify profile has been updated by an administrator.

Changes made:
${Object.entries(changes).map(stryMutAct_9fa48("1322") ? () => undefined : (stryCov_9fa48("1322"), ([field, {
          old,
          new: newValue
        }]) => stryMutAct_9fa48("1323") ? `` : (stryCov_9fa48("1323"), `• ${formatFieldName(field)}: Changed from "${old}" to "${newValue}"`))).join(stryMutAct_9fa48("1324") ? "" : (stryCov_9fa48("1324"), '\n'))}

If you did not request these changes or have any concerns, please contact our support team immediately.

Best regards,
The Fluentify Team
      `),
        html: stryMutAct_9fa48("1325") ? `` : (stryCov_9fa48("1325"), `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .changes { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .change-item { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .change-item:last-child { border-bottom: none; }
            .field-name { font-weight: bold; color: #4F46E5; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Profile Update Notification</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${name}</strong>,</p>
              <p>Your Fluentify profile has been updated by an administrator.</p>
              
              <div class="changes">
                <h3>Changes Made:</h3>
                ${changeItems}
              </div>

              <div class="warning">
                <strong>⚠️ Important:</strong> If you did not request these changes or have any concerns, please contact our support team immediately.
              </div>

              <p>Best regards,<br/>The Fluentify Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message from Fluentify. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `)
      });
      try {
        if (stryMutAct_9fa48("1326")) {
          {}
        } else {
          stryCov_9fa48("1326");
          console.log(stryMutAct_9fa48("1327") ? `` : (stryCov_9fa48("1327"), `📧 Sending profile update notification to: ${email}`));
          const info = await this.transporter.sendMail(mailOptions);
          console.log(stryMutAct_9fa48("1328") ? `` : (stryCov_9fa48("1328"), `✅ Profile update notification sent successfully to ${email}`));
          console.log(stryMutAct_9fa48("1329") ? `` : (stryCov_9fa48("1329"), `   Message ID: ${info.messageId}`));
          return stryMutAct_9fa48("1330") ? {} : (stryCov_9fa48("1330"), {
            success: stryMutAct_9fa48("1331") ? false : (stryCov_9fa48("1331"), true),
            messageId: info.messageId
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("1332")) {
          {}
        } else {
          stryCov_9fa48("1332");
          console.error(stryMutAct_9fa48("1333") ? `` : (stryCov_9fa48("1333"), `❌ Failed to send profile update notification to ${email}:`));
          console.error(stryMutAct_9fa48("1334") ? `` : (stryCov_9fa48("1334"), `   Error: ${error.message}`));
          // Don't throw error - we don't want to fail the update if email fails
          return stryMutAct_9fa48("1335") ? {} : (stryCov_9fa48("1335"), {
            success: stryMutAct_9fa48("1336") ? true : (stryCov_9fa48("1336"), false),
            error: error.message
          });
        }
      }
    }
  }
}
export default new EmailService();