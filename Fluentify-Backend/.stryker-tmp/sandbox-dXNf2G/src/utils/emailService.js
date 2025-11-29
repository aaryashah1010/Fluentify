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
    if (stryMutAct_9fa48("3762")) {
      {}
    } else {
      stryCov_9fa48("3762");
      // Verify email credentials are configured
      if (stryMutAct_9fa48("3765") ? !process.env.EMAIL_USER && !process.env.EMAIL_PASS : stryMutAct_9fa48("3764") ? false : stryMutAct_9fa48("3763") ? true : (stryCov_9fa48("3763", "3764", "3765"), (stryMutAct_9fa48("3766") ? process.env.EMAIL_USER : (stryCov_9fa48("3766"), !process.env.EMAIL_USER)) || (stryMutAct_9fa48("3767") ? process.env.EMAIL_PASS : (stryCov_9fa48("3767"), !process.env.EMAIL_PASS)))) {
        if (stryMutAct_9fa48("3768")) {
          {}
        } else {
          stryCov_9fa48("3768");
          console.error(stryMutAct_9fa48("3769") ? "" : (stryCov_9fa48("3769"), '❌ EMAIL CONFIGURATION ERROR:'));
          console.error(stryMutAct_9fa48("3770") ? "" : (stryCov_9fa48("3770"), '   EMAIL_USER:'), process.env.EMAIL_USER ? stryMutAct_9fa48("3771") ? "" : (stryCov_9fa48("3771"), '✓ Set') : stryMutAct_9fa48("3772") ? "" : (stryCov_9fa48("3772"), '✗ Missing'));
          console.error(stryMutAct_9fa48("3773") ? "" : (stryCov_9fa48("3773"), '   EMAIL_PASS:'), process.env.EMAIL_PASS ? stryMutAct_9fa48("3774") ? "" : (stryCov_9fa48("3774"), '✓ Set') : stryMutAct_9fa48("3775") ? "" : (stryCov_9fa48("3775"), '✗ Missing'));
          console.error(stryMutAct_9fa48("3776") ? "" : (stryCov_9fa48("3776"), '   Please add EMAIL_USER and EMAIL_PASS to your .env file'));
        }
      }

      // Create transporter with Gmail or other SMTP service
      this.transporter = nodemailer.createTransport(stryMutAct_9fa48("3777") ? {} : (stryCov_9fa48("3777"), {
        service: stryMutAct_9fa48("3778") ? "" : (stryCov_9fa48("3778"), 'gmail'),
        auth: stryMutAct_9fa48("3779") ? {} : (stryCov_9fa48("3779"), {
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
    if (stryMutAct_9fa48("3780")) {
      {}
    } else {
      stryCov_9fa48("3780");
      try {
        if (stryMutAct_9fa48("3781")) {
          {}
        } else {
          stryCov_9fa48("3781");
          await this.transporter.verify();
          console.log(stryMutAct_9fa48("3782") ? "" : (stryCov_9fa48("3782"), '✅ Email service connected successfully'));
          console.log(stryMutAct_9fa48("3783") ? "" : (stryCov_9fa48("3783"), '   Using email:'), process.env.EMAIL_USER);
        }
      } catch (error) {
        if (stryMutAct_9fa48("3784")) {
          {}
        } else {
          stryCov_9fa48("3784");
          console.error(stryMutAct_9fa48("3785") ? "" : (stryCov_9fa48("3785"), '❌ Email service connection failed:'));
          console.error(stryMutAct_9fa48("3786") ? "" : (stryCov_9fa48("3786"), '   Error:'), error.message);
          console.error(stryMutAct_9fa48("3787") ? "" : (stryCov_9fa48("3787"), '   Check your EMAIL_USER and EMAIL_PASS in .env file'));
          console.error(stryMutAct_9fa48("3788") ? "" : (stryCov_9fa48("3788"), '   For Gmail, you need an App Password (not your regular password)'));
        }
      }
    }
  }

  /**
   * Generate a 6-digit OTP
   */
  generateOTP() {
    if (stryMutAct_9fa48("3789")) {
      {}
    } else {
      stryCov_9fa48("3789");
      return Math.floor(stryMutAct_9fa48("3790") ? 100000 - Math.random() * 900000 : (stryCov_9fa48("3790"), 100000 + (stryMutAct_9fa48("3791") ? Math.random() / 900000 : (stryCov_9fa48("3791"), Math.random() * 900000)))).toString();
    }
  }

  /**
   * Send OTP for email verification during signup
   */
  async sendSignupOTP(email, name, otp) {
    if (stryMutAct_9fa48("3792")) {
      {}
    } else {
      stryCov_9fa48("3792");
      const mailOptions = stryMutAct_9fa48("3793") ? {} : (stryCov_9fa48("3793"), {
        from: stryMutAct_9fa48("3794") ? `` : (stryCov_9fa48("3794"), `Fluentify <${process.env.EMAIL_USER}>`),
        to: email,
        subject: stryMutAct_9fa48("3795") ? "" : (stryCov_9fa48("3795"), 'Verify Your Email - Fluentify'),
        html: stryMutAct_9fa48("3796") ? `` : (stryCov_9fa48("3796"), `
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
        if (stryMutAct_9fa48("3797")) {
          {}
        } else {
          stryCov_9fa48("3797");
          console.log(stryMutAct_9fa48("3798") ? `` : (stryCov_9fa48("3798"), `📧 Sending signup OTP to: ${email}`));
          const info = await this.transporter.sendMail(mailOptions);
          console.log(stryMutAct_9fa48("3799") ? `` : (stryCov_9fa48("3799"), `✅ Signup OTP sent successfully to ${email}`));
          console.log(stryMutAct_9fa48("3800") ? `` : (stryCov_9fa48("3800"), `   Message ID: ${info.messageId}`));
          return stryMutAct_9fa48("3801") ? {} : (stryCov_9fa48("3801"), {
            success: stryMutAct_9fa48("3802") ? false : (stryCov_9fa48("3802"), true),
            messageId: info.messageId
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("3803")) {
          {}
        } else {
          stryCov_9fa48("3803");
          console.error(stryMutAct_9fa48("3804") ? `` : (stryCov_9fa48("3804"), `❌ Failed to send signup OTP to ${email}:`));
          console.error(stryMutAct_9fa48("3805") ? `` : (stryCov_9fa48("3805"), `   Error: ${error.message}`));
          if (stryMutAct_9fa48("3807") ? false : stryMutAct_9fa48("3806") ? true : (stryCov_9fa48("3806", "3807"), error.code)) console.error(stryMutAct_9fa48("3808") ? `` : (stryCov_9fa48("3808"), `   Code: ${error.code}`));
          if (stryMutAct_9fa48("3810") ? false : stryMutAct_9fa48("3809") ? true : (stryCov_9fa48("3809", "3810"), error.response)) console.error(stryMutAct_9fa48("3811") ? `` : (stryCov_9fa48("3811"), `   Response: ${error.response}`));
          throw new Error(stryMutAct_9fa48("3812") ? `` : (stryCov_9fa48("3812"), `Failed to send verification email: ${error.message}`));
        }
      }
    }
  }

  /**
   * Send OTP for password reset
   */
  async sendPasswordResetOTP(email, name, otp) {
    if (stryMutAct_9fa48("3813")) {
      {}
    } else {
      stryCov_9fa48("3813");
      const mailOptions = stryMutAct_9fa48("3814") ? {} : (stryCov_9fa48("3814"), {
        from: stryMutAct_9fa48("3815") ? `` : (stryCov_9fa48("3815"), `Fluentify <${process.env.EMAIL_USER}>`),
        to: email,
        subject: stryMutAct_9fa48("3816") ? "" : (stryCov_9fa48("3816"), 'Reset Your Password - Fluentify'),
        html: stryMutAct_9fa48("3817") ? `` : (stryCov_9fa48("3817"), `
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
        if (stryMutAct_9fa48("3818")) {
          {}
        } else {
          stryCov_9fa48("3818");
          console.log(stryMutAct_9fa48("3819") ? `` : (stryCov_9fa48("3819"), `📧 Sending password reset OTP to: ${email}`));
          const info = await this.transporter.sendMail(mailOptions);
          console.log(stryMutAct_9fa48("3820") ? `` : (stryCov_9fa48("3820"), `✅ Password reset OTP sent successfully to ${email}`));
          console.log(stryMutAct_9fa48("3821") ? `` : (stryCov_9fa48("3821"), `   Message ID: ${info.messageId}`));
          return stryMutAct_9fa48("3822") ? {} : (stryCov_9fa48("3822"), {
            success: stryMutAct_9fa48("3823") ? false : (stryCov_9fa48("3823"), true),
            messageId: info.messageId
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("3824")) {
          {}
        } else {
          stryCov_9fa48("3824");
          console.error(stryMutAct_9fa48("3825") ? `` : (stryCov_9fa48("3825"), `❌ Failed to send password reset OTP to ${email}:`));
          console.error(stryMutAct_9fa48("3826") ? `` : (stryCov_9fa48("3826"), `   Error: ${error.message}`));
          if (stryMutAct_9fa48("3828") ? false : stryMutAct_9fa48("3827") ? true : (stryCov_9fa48("3827", "3828"), error.code)) console.error(stryMutAct_9fa48("3829") ? `` : (stryCov_9fa48("3829"), `   Code: ${error.code}`));
          if (stryMutAct_9fa48("3831") ? false : stryMutAct_9fa48("3830") ? true : (stryCov_9fa48("3830", "3831"), error.response)) console.error(stryMutAct_9fa48("3832") ? `` : (stryCov_9fa48("3832"), `   Response: ${error.response}`));
          throw new Error(stryMutAct_9fa48("3833") ? `` : (stryCov_9fa48("3833"), `Failed to send password reset email: ${error.message}`));
        }
      }
    }
  }

  /**
   * Send welcome email after successful verification
   */
  async sendWelcomeEmail(email, name) {
    if (stryMutAct_9fa48("3834")) {
      {}
    } else {
      stryCov_9fa48("3834");
      const mailOptions = stryMutAct_9fa48("3835") ? {} : (stryCov_9fa48("3835"), {
        from: stryMutAct_9fa48("3836") ? `` : (stryCov_9fa48("3836"), `Fluentify <${process.env.EMAIL_USER}>`),
        to: email,
        subject: stryMutAct_9fa48("3837") ? "" : (stryCov_9fa48("3837"), 'Welcome to Fluentify!'),
        html: stryMutAct_9fa48("3838") ? `` : (stryCov_9fa48("3838"), `
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
        if (stryMutAct_9fa48("3839")) {
          {}
        } else {
          stryCov_9fa48("3839");
          await this.transporter.sendMail(mailOptions);
          return stryMutAct_9fa48("3840") ? {} : (stryCov_9fa48("3840"), {
            success: stryMutAct_9fa48("3841") ? false : (stryCov_9fa48("3841"), true)
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("3842")) {
          {}
        } else {
          stryCov_9fa48("3842");
          console.error(stryMutAct_9fa48("3843") ? "" : (stryCov_9fa48("3843"), 'Error sending welcome email:'), error);
          // Don't throw error for welcome email as it's not critical
          return stryMutAct_9fa48("3844") ? {} : (stryCov_9fa48("3844"), {
            success: stryMutAct_9fa48("3845") ? true : (stryCov_9fa48("3845"), false)
          });
        }
      }
    }
  }

  /**
   * Send profile update confirmation
   */
  async sendProfileUpdateConfirmation(email, name) {
    if (stryMutAct_9fa48("3846")) {
      {}
    } else {
      stryCov_9fa48("3846");
      const mailOptions = stryMutAct_9fa48("3847") ? {} : (stryCov_9fa48("3847"), {
        from: stryMutAct_9fa48("3848") ? `` : (stryCov_9fa48("3848"), `Fluentify <${process.env.EMAIL_USER}>`),
        to: email,
        subject: stryMutAct_9fa48("3849") ? "" : (stryCov_9fa48("3849"), 'Your Profile Was Updated - Fluentify'),
        html: stryMutAct_9fa48("3850") ? `` : (stryCov_9fa48("3850"), `
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
        if (stryMutAct_9fa48("3851")) {
          {}
        } else {
          stryCov_9fa48("3851");
          await this.transporter.sendMail(mailOptions);
          return stryMutAct_9fa48("3852") ? {} : (stryCov_9fa48("3852"), {
            success: stryMutAct_9fa48("3853") ? false : (stryCov_9fa48("3853"), true)
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("3854")) {
          {}
        } else {
          stryCov_9fa48("3854");
          console.error(stryMutAct_9fa48("3855") ? "" : (stryCov_9fa48("3855"), 'Error sending profile update confirmation:'), error);
          return stryMutAct_9fa48("3856") ? {} : (stryCov_9fa48("3856"), {
            success: stryMutAct_9fa48("3857") ? true : (stryCov_9fa48("3857"), false)
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
    if (stryMutAct_9fa48("3858")) {
      {}
    } else {
      stryCov_9fa48("3858");
      // Format field name for display
      const formatFieldName = field => {
        if (stryMutAct_9fa48("3859")) {
          {}
        } else {
          stryCov_9fa48("3859");
          const fieldNames = stryMutAct_9fa48("3860") ? {} : (stryCov_9fa48("3860"), {
            name: stryMutAct_9fa48("3861") ? "" : (stryCov_9fa48("3861"), 'Name'),
            email: stryMutAct_9fa48("3862") ? "" : (stryCov_9fa48("3862"), 'Email Address'),
            phone: stryMutAct_9fa48("3863") ? "" : (stryCov_9fa48("3863"), 'Phone Number')
          });
          return stryMutAct_9fa48("3866") ? fieldNames[field] && field.charAt(0).toUpperCase() + field.slice(1) : stryMutAct_9fa48("3865") ? false : stryMutAct_9fa48("3864") ? true : (stryCov_9fa48("3864", "3865", "3866"), fieldNames[field] || (stryMutAct_9fa48("3867") ? field.charAt(0).toUpperCase() - field.slice(1) : (stryCov_9fa48("3867"), (stryMutAct_9fa48("3869") ? field.toUpperCase() : stryMutAct_9fa48("3868") ? field.charAt(0).toLowerCase() : (stryCov_9fa48("3868", "3869"), field.charAt(0).toUpperCase())) + (stryMutAct_9fa48("3870") ? field : (stryCov_9fa48("3870"), field.slice(1))))));
        }
      };

      // Build change items HTML
      const changeItems = Object.entries(changes).map(([field, {
        old,
        new: newValue
      }]) => {
        if (stryMutAct_9fa48("3871")) {
          {}
        } else {
          stryCov_9fa48("3871");
          return stryMutAct_9fa48("3872") ? `` : (stryCov_9fa48("3872"), `
          <div class="change-item">
            <span class="field-name">${formatFieldName(field)}:</span><br/>
            Changed from "<em>${old}</em>" to "<strong>${newValue}</strong>"
          </div>
        `);
        }
      }).join(stryMutAct_9fa48("3873") ? "Stryker was here!" : (stryCov_9fa48("3873"), ''));
      const mailOptions = stryMutAct_9fa48("3874") ? {} : (stryCov_9fa48("3874"), {
        from: stryMutAct_9fa48("3875") ? `` : (stryCov_9fa48("3875"), `Fluentify <${process.env.EMAIL_USER}>`),
        to: email,
        subject: stryMutAct_9fa48("3876") ? "" : (stryCov_9fa48("3876"), 'Your Fluentify Profile Has Been Updated'),
        text: stryMutAct_9fa48("3877") ? `` : (stryCov_9fa48("3877"), `
Hello ${name},

Your Fluentify profile has been updated by an administrator.

Changes made:
${Object.entries(changes).map(stryMutAct_9fa48("3878") ? () => undefined : (stryCov_9fa48("3878"), ([field, {
          old,
          new: newValue
        }]) => stryMutAct_9fa48("3879") ? `` : (stryCov_9fa48("3879"), `• ${formatFieldName(field)}: Changed from "${old}" to "${newValue}"`))).join(stryMutAct_9fa48("3880") ? "" : (stryCov_9fa48("3880"), '\n'))}

If you did not request these changes or have any concerns, please contact our support team immediately.

Best regards,
The Fluentify Team
      `),
        html: stryMutAct_9fa48("3881") ? `` : (stryCov_9fa48("3881"), `
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
        if (stryMutAct_9fa48("3882")) {
          {}
        } else {
          stryCov_9fa48("3882");
          console.log(stryMutAct_9fa48("3883") ? `` : (stryCov_9fa48("3883"), `📧 Sending profile update notification to: ${email}`));
          const info = await this.transporter.sendMail(mailOptions);
          console.log(stryMutAct_9fa48("3884") ? `` : (stryCov_9fa48("3884"), `✅ Profile update notification sent successfully to ${email}`));
          console.log(stryMutAct_9fa48("3885") ? `` : (stryCov_9fa48("3885"), `   Message ID: ${info.messageId}`));
          return stryMutAct_9fa48("3886") ? {} : (stryCov_9fa48("3886"), {
            success: stryMutAct_9fa48("3887") ? false : (stryCov_9fa48("3887"), true),
            messageId: info.messageId
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("3888")) {
          {}
        } else {
          stryCov_9fa48("3888");
          console.error(stryMutAct_9fa48("3889") ? `` : (stryCov_9fa48("3889"), `❌ Failed to send profile update notification to ${email}:`));
          console.error(stryMutAct_9fa48("3890") ? `` : (stryCov_9fa48("3890"), `   Error: ${error.message}`));
          // Don't throw error - we don't want to fail the update if email fails
          return stryMutAct_9fa48("3891") ? {} : (stryCov_9fa48("3891"), {
            success: stryMutAct_9fa48("3892") ? true : (stryCov_9fa48("3892"), false),
            error: error.message
          });
        }
      }
    }
  }
}
export default new EmailService();