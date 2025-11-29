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
    if (stryMutAct_9fa48("4185")) {
      {}
    } else {
      stryCov_9fa48("4185");
      // Verify email credentials are configured
      if (stryMutAct_9fa48("4188") ? !process.env.EMAIL_USER && !process.env.EMAIL_PASS : stryMutAct_9fa48("4187") ? false : stryMutAct_9fa48("4186") ? true : (stryCov_9fa48("4186", "4187", "4188"), (stryMutAct_9fa48("4189") ? process.env.EMAIL_USER : (stryCov_9fa48("4189"), !process.env.EMAIL_USER)) || (stryMutAct_9fa48("4190") ? process.env.EMAIL_PASS : (stryCov_9fa48("4190"), !process.env.EMAIL_PASS)))) {
        if (stryMutAct_9fa48("4191")) {
          {}
        } else {
          stryCov_9fa48("4191");
          console.error(stryMutAct_9fa48("4192") ? "" : (stryCov_9fa48("4192"), '❌ EMAIL CONFIGURATION ERROR:'));
          console.error(stryMutAct_9fa48("4193") ? "" : (stryCov_9fa48("4193"), '   EMAIL_USER:'), process.env.EMAIL_USER ? stryMutAct_9fa48("4194") ? "" : (stryCov_9fa48("4194"), '✓ Set') : stryMutAct_9fa48("4195") ? "" : (stryCov_9fa48("4195"), '✗ Missing'));
          console.error(stryMutAct_9fa48("4196") ? "" : (stryCov_9fa48("4196"), '   EMAIL_PASS:'), process.env.EMAIL_PASS ? stryMutAct_9fa48("4197") ? "" : (stryCov_9fa48("4197"), '✓ Set') : stryMutAct_9fa48("4198") ? "" : (stryCov_9fa48("4198"), '✗ Missing'));
          console.error(stryMutAct_9fa48("4199") ? "" : (stryCov_9fa48("4199"), '   Please add EMAIL_USER and EMAIL_PASS to your .env file'));
        }
      }

      // Create transporter with Gmail or other SMTP service
      this.transporter = nodemailer.createTransport(stryMutAct_9fa48("4200") ? {} : (stryCov_9fa48("4200"), {
        service: stryMutAct_9fa48("4201") ? "" : (stryCov_9fa48("4201"), 'gmail'),
        auth: stryMutAct_9fa48("4202") ? {} : (stryCov_9fa48("4202"), {
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
    if (stryMutAct_9fa48("4203")) {
      {}
    } else {
      stryCov_9fa48("4203");
      try {
        if (stryMutAct_9fa48("4204")) {
          {}
        } else {
          stryCov_9fa48("4204");
          await this.transporter.verify();
          console.log(stryMutAct_9fa48("4205") ? "" : (stryCov_9fa48("4205"), '✅ Email service connected successfully'));
          console.log(stryMutAct_9fa48("4206") ? "" : (stryCov_9fa48("4206"), '   Using email:'), process.env.EMAIL_USER);
        }
      } catch (error) {
        if (stryMutAct_9fa48("4207")) {
          {}
        } else {
          stryCov_9fa48("4207");
          console.error(stryMutAct_9fa48("4208") ? "" : (stryCov_9fa48("4208"), '❌ Email service connection failed:'));
          console.error(stryMutAct_9fa48("4209") ? "" : (stryCov_9fa48("4209"), '   Error:'), error.message);
          console.error(stryMutAct_9fa48("4210") ? "" : (stryCov_9fa48("4210"), '   Check your EMAIL_USER and EMAIL_PASS in .env file'));
          console.error(stryMutAct_9fa48("4211") ? "" : (stryCov_9fa48("4211"), '   For Gmail, you need an App Password (not your regular password)'));
        }
      }
    }
  }

  /**
   * Generate a 6-digit OTP
   */
  generateOTP() {
    if (stryMutAct_9fa48("4212")) {
      {}
    } else {
      stryCov_9fa48("4212");
      return Math.floor(stryMutAct_9fa48("4213") ? 100000 - Math.random() * 900000 : (stryCov_9fa48("4213"), 100000 + (stryMutAct_9fa48("4214") ? Math.random() / 900000 : (stryCov_9fa48("4214"), Math.random() * 900000)))).toString();
    }
  }

  /**
   * Send OTP for email verification during signup
   */
  async sendSignupOTP(email, name, otp) {
    if (stryMutAct_9fa48("4215")) {
      {}
    } else {
      stryCov_9fa48("4215");
      const mailOptions = stryMutAct_9fa48("4216") ? {} : (stryCov_9fa48("4216"), {
        from: stryMutAct_9fa48("4217") ? `` : (stryCov_9fa48("4217"), `Fluentify <${process.env.EMAIL_USER}>`),
        to: email,
        subject: stryMutAct_9fa48("4218") ? "" : (stryCov_9fa48("4218"), 'Verify Your Email - Fluentify'),
        html: stryMutAct_9fa48("4219") ? `` : (stryCov_9fa48("4219"), `
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
        if (stryMutAct_9fa48("4220")) {
          {}
        } else {
          stryCov_9fa48("4220");
          console.log(stryMutAct_9fa48("4221") ? `` : (stryCov_9fa48("4221"), `📧 Sending signup OTP to: ${email}`));
          const info = await this.transporter.sendMail(mailOptions);
          console.log(stryMutAct_9fa48("4222") ? `` : (stryCov_9fa48("4222"), `✅ Signup OTP sent successfully to ${email}`));
          console.log(stryMutAct_9fa48("4223") ? `` : (stryCov_9fa48("4223"), `   Message ID: ${info.messageId}`));
          return stryMutAct_9fa48("4224") ? {} : (stryCov_9fa48("4224"), {
            success: stryMutAct_9fa48("4225") ? false : (stryCov_9fa48("4225"), true),
            messageId: info.messageId
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("4226")) {
          {}
        } else {
          stryCov_9fa48("4226");
          console.error(stryMutAct_9fa48("4227") ? `` : (stryCov_9fa48("4227"), `❌ Failed to send signup OTP to ${email}:`));
          console.error(stryMutAct_9fa48("4228") ? `` : (stryCov_9fa48("4228"), `   Error: ${error.message}`));
          if (stryMutAct_9fa48("4230") ? false : stryMutAct_9fa48("4229") ? true : (stryCov_9fa48("4229", "4230"), error.code)) console.error(stryMutAct_9fa48("4231") ? `` : (stryCov_9fa48("4231"), `   Code: ${error.code}`));
          if (stryMutAct_9fa48("4233") ? false : stryMutAct_9fa48("4232") ? true : (stryCov_9fa48("4232", "4233"), error.response)) console.error(stryMutAct_9fa48("4234") ? `` : (stryCov_9fa48("4234"), `   Response: ${error.response}`));
          throw new Error(stryMutAct_9fa48("4235") ? `` : (stryCov_9fa48("4235"), `Failed to send verification email: ${error.message}`));
        }
      }
    }
  }

  /**
   * Send OTP for password reset
   */
  async sendPasswordResetOTP(email, name, otp) {
    if (stryMutAct_9fa48("4236")) {
      {}
    } else {
      stryCov_9fa48("4236");
      const mailOptions = stryMutAct_9fa48("4237") ? {} : (stryCov_9fa48("4237"), {
        from: stryMutAct_9fa48("4238") ? `` : (stryCov_9fa48("4238"), `Fluentify <${process.env.EMAIL_USER}>`),
        to: email,
        subject: stryMutAct_9fa48("4239") ? "" : (stryCov_9fa48("4239"), 'Reset Your Password - Fluentify'),
        html: stryMutAct_9fa48("4240") ? `` : (stryCov_9fa48("4240"), `
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
        if (stryMutAct_9fa48("4241")) {
          {}
        } else {
          stryCov_9fa48("4241");
          console.log(stryMutAct_9fa48("4242") ? `` : (stryCov_9fa48("4242"), `📧 Sending password reset OTP to: ${email}`));
          const info = await this.transporter.sendMail(mailOptions);
          console.log(stryMutAct_9fa48("4243") ? `` : (stryCov_9fa48("4243"), `✅ Password reset OTP sent successfully to ${email}`));
          console.log(stryMutAct_9fa48("4244") ? `` : (stryCov_9fa48("4244"), `   Message ID: ${info.messageId}`));
          return stryMutAct_9fa48("4245") ? {} : (stryCov_9fa48("4245"), {
            success: stryMutAct_9fa48("4246") ? false : (stryCov_9fa48("4246"), true),
            messageId: info.messageId
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("4247")) {
          {}
        } else {
          stryCov_9fa48("4247");
          console.error(stryMutAct_9fa48("4248") ? `` : (stryCov_9fa48("4248"), `❌ Failed to send password reset OTP to ${email}:`));
          console.error(stryMutAct_9fa48("4249") ? `` : (stryCov_9fa48("4249"), `   Error: ${error.message}`));
          if (stryMutAct_9fa48("4251") ? false : stryMutAct_9fa48("4250") ? true : (stryCov_9fa48("4250", "4251"), error.code)) console.error(stryMutAct_9fa48("4252") ? `` : (stryCov_9fa48("4252"), `   Code: ${error.code}`));
          if (stryMutAct_9fa48("4254") ? false : stryMutAct_9fa48("4253") ? true : (stryCov_9fa48("4253", "4254"), error.response)) console.error(stryMutAct_9fa48("4255") ? `` : (stryCov_9fa48("4255"), `   Response: ${error.response}`));
          throw new Error(stryMutAct_9fa48("4256") ? `` : (stryCov_9fa48("4256"), `Failed to send password reset email: ${error.message}`));
        }
      }
    }
  }

  /**
   * Send welcome email after successful verification
   */
  async sendWelcomeEmail(email, name) {
    if (stryMutAct_9fa48("4257")) {
      {}
    } else {
      stryCov_9fa48("4257");
      const mailOptions = stryMutAct_9fa48("4258") ? {} : (stryCov_9fa48("4258"), {
        from: stryMutAct_9fa48("4259") ? `` : (stryCov_9fa48("4259"), `Fluentify <${process.env.EMAIL_USER}>`),
        to: email,
        subject: stryMutAct_9fa48("4260") ? "" : (stryCov_9fa48("4260"), 'Welcome to Fluentify!'),
        html: stryMutAct_9fa48("4261") ? `` : (stryCov_9fa48("4261"), `
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
        if (stryMutAct_9fa48("4262")) {
          {}
        } else {
          stryCov_9fa48("4262");
          await this.transporter.sendMail(mailOptions);
          return stryMutAct_9fa48("4263") ? {} : (stryCov_9fa48("4263"), {
            success: stryMutAct_9fa48("4264") ? false : (stryCov_9fa48("4264"), true)
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("4265")) {
          {}
        } else {
          stryCov_9fa48("4265");
          console.error(stryMutAct_9fa48("4266") ? "" : (stryCov_9fa48("4266"), 'Error sending welcome email:'), error);
          // Don't throw error for welcome email as it's not critical
          return stryMutAct_9fa48("4267") ? {} : (stryCov_9fa48("4267"), {
            success: stryMutAct_9fa48("4268") ? true : (stryCov_9fa48("4268"), false)
          });
        }
      }
    }
  }

  /**
   * Send profile update confirmation
   */
  async sendProfileUpdateConfirmation(email, name) {
    if (stryMutAct_9fa48("4269")) {
      {}
    } else {
      stryCov_9fa48("4269");
      const mailOptions = stryMutAct_9fa48("4270") ? {} : (stryCov_9fa48("4270"), {
        from: stryMutAct_9fa48("4271") ? `` : (stryCov_9fa48("4271"), `Fluentify <${process.env.EMAIL_USER}>`),
        to: email,
        subject: stryMutAct_9fa48("4272") ? "" : (stryCov_9fa48("4272"), 'Your Profile Was Updated - Fluentify'),
        html: stryMutAct_9fa48("4273") ? `` : (stryCov_9fa48("4273"), `
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
        if (stryMutAct_9fa48("4274")) {
          {}
        } else {
          stryCov_9fa48("4274");
          await this.transporter.sendMail(mailOptions);
          return stryMutAct_9fa48("4275") ? {} : (stryCov_9fa48("4275"), {
            success: stryMutAct_9fa48("4276") ? false : (stryCov_9fa48("4276"), true)
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("4277")) {
          {}
        } else {
          stryCov_9fa48("4277");
          console.error(stryMutAct_9fa48("4278") ? "" : (stryCov_9fa48("4278"), 'Error sending profile update confirmation:'), error);
          return stryMutAct_9fa48("4279") ? {} : (stryCov_9fa48("4279"), {
            success: stryMutAct_9fa48("4280") ? true : (stryCov_9fa48("4280"), false)
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
    if (stryMutAct_9fa48("4281")) {
      {}
    } else {
      stryCov_9fa48("4281");
      // Format field name for display
      const formatFieldName = field => {
        if (stryMutAct_9fa48("4282")) {
          {}
        } else {
          stryCov_9fa48("4282");
          const fieldNames = stryMutAct_9fa48("4283") ? {} : (stryCov_9fa48("4283"), {
            name: stryMutAct_9fa48("4284") ? "" : (stryCov_9fa48("4284"), 'Name'),
            email: stryMutAct_9fa48("4285") ? "" : (stryCov_9fa48("4285"), 'Email Address'),
            phone: stryMutAct_9fa48("4286") ? "" : (stryCov_9fa48("4286"), 'Phone Number')
          });
          return stryMutAct_9fa48("4289") ? fieldNames[field] && field.charAt(0).toUpperCase() + field.slice(1) : stryMutAct_9fa48("4288") ? false : stryMutAct_9fa48("4287") ? true : (stryCov_9fa48("4287", "4288", "4289"), fieldNames[field] || (stryMutAct_9fa48("4290") ? field.charAt(0).toUpperCase() - field.slice(1) : (stryCov_9fa48("4290"), (stryMutAct_9fa48("4292") ? field.toUpperCase() : stryMutAct_9fa48("4291") ? field.charAt(0).toLowerCase() : (stryCov_9fa48("4291", "4292"), field.charAt(0).toUpperCase())) + (stryMutAct_9fa48("4293") ? field : (stryCov_9fa48("4293"), field.slice(1))))));
        }
      };

      // Build change items HTML
      const changeItems = Object.entries(changes).map(([field, {
        old,
        new: newValue
      }]) => {
        if (stryMutAct_9fa48("4294")) {
          {}
        } else {
          stryCov_9fa48("4294");
          return stryMutAct_9fa48("4295") ? `` : (stryCov_9fa48("4295"), `
          <div class="change-item">
            <span class="field-name">${formatFieldName(field)}:</span><br/>
            Changed from "<em>${old}</em>" to "<strong>${newValue}</strong>"
          </div>
        `);
        }
      }).join(stryMutAct_9fa48("4296") ? "Stryker was here!" : (stryCov_9fa48("4296"), ''));
      const mailOptions = stryMutAct_9fa48("4297") ? {} : (stryCov_9fa48("4297"), {
        from: stryMutAct_9fa48("4298") ? `` : (stryCov_9fa48("4298"), `Fluentify <${process.env.EMAIL_USER}>`),
        to: email,
        subject: stryMutAct_9fa48("4299") ? "" : (stryCov_9fa48("4299"), 'Your Fluentify Profile Has Been Updated'),
        text: stryMutAct_9fa48("4300") ? `` : (stryCov_9fa48("4300"), `
Hello ${name},

Your Fluentify profile has been updated by an administrator.

Changes made:
${Object.entries(changes).map(stryMutAct_9fa48("4301") ? () => undefined : (stryCov_9fa48("4301"), ([field, {
          old,
          new: newValue
        }]) => stryMutAct_9fa48("4302") ? `` : (stryCov_9fa48("4302"), `• ${formatFieldName(field)}: Changed from "${old}" to "${newValue}"`))).join(stryMutAct_9fa48("4303") ? "" : (stryCov_9fa48("4303"), '\n'))}

If you did not request these changes or have any concerns, please contact our support team immediately.

Best regards,
The Fluentify Team
      `),
        html: stryMutAct_9fa48("4304") ? `` : (stryCov_9fa48("4304"), `
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
        if (stryMutAct_9fa48("4305")) {
          {}
        } else {
          stryCov_9fa48("4305");
          console.log(stryMutAct_9fa48("4306") ? `` : (stryCov_9fa48("4306"), `📧 Sending profile update notification to: ${email}`));
          const info = await this.transporter.sendMail(mailOptions);
          console.log(stryMutAct_9fa48("4307") ? `` : (stryCov_9fa48("4307"), `✅ Profile update notification sent successfully to ${email}`));
          console.log(stryMutAct_9fa48("4308") ? `` : (stryCov_9fa48("4308"), `   Message ID: ${info.messageId}`));
          return stryMutAct_9fa48("4309") ? {} : (stryCov_9fa48("4309"), {
            success: stryMutAct_9fa48("4310") ? false : (stryCov_9fa48("4310"), true),
            messageId: info.messageId
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("4311")) {
          {}
        } else {
          stryCov_9fa48("4311");
          console.error(stryMutAct_9fa48("4312") ? `` : (stryCov_9fa48("4312"), `❌ Failed to send profile update notification to ${email}:`));
          console.error(stryMutAct_9fa48("4313") ? `` : (stryCov_9fa48("4313"), `   Error: ${error.message}`));
          // Don't throw error - we don't want to fail the update if email fails
          return stryMutAct_9fa48("4314") ? {} : (stryCov_9fa48("4314"), {
            success: stryMutAct_9fa48("4315") ? true : (stryCov_9fa48("4315"), false),
            error: error.message
          });
        }
      }
    }
  }
}
export default new EmailService();