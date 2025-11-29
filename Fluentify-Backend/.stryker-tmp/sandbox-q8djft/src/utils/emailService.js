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
    if (stryMutAct_9fa48("3779")) {
      {}
    } else {
      stryCov_9fa48("3779");
      // Verify email credentials are configured
      if (stryMutAct_9fa48("3782") ? !process.env.EMAIL_USER && !process.env.EMAIL_PASS : stryMutAct_9fa48("3781") ? false : stryMutAct_9fa48("3780") ? true : (stryCov_9fa48("3780", "3781", "3782"), (stryMutAct_9fa48("3783") ? process.env.EMAIL_USER : (stryCov_9fa48("3783"), !process.env.EMAIL_USER)) || (stryMutAct_9fa48("3784") ? process.env.EMAIL_PASS : (stryCov_9fa48("3784"), !process.env.EMAIL_PASS)))) {
        if (stryMutAct_9fa48("3785")) {
          {}
        } else {
          stryCov_9fa48("3785");
          console.error(stryMutAct_9fa48("3786") ? "" : (stryCov_9fa48("3786"), '❌ EMAIL CONFIGURATION ERROR:'));
          console.error(stryMutAct_9fa48("3787") ? "" : (stryCov_9fa48("3787"), '   EMAIL_USER:'), process.env.EMAIL_USER ? stryMutAct_9fa48("3788") ? "" : (stryCov_9fa48("3788"), '✓ Set') : stryMutAct_9fa48("3789") ? "" : (stryCov_9fa48("3789"), '✗ Missing'));
          console.error(stryMutAct_9fa48("3790") ? "" : (stryCov_9fa48("3790"), '   EMAIL_PASS:'), process.env.EMAIL_PASS ? stryMutAct_9fa48("3791") ? "" : (stryCov_9fa48("3791"), '✓ Set') : stryMutAct_9fa48("3792") ? "" : (stryCov_9fa48("3792"), '✗ Missing'));
          console.error(stryMutAct_9fa48("3793") ? "" : (stryCov_9fa48("3793"), '   Please add EMAIL_USER and EMAIL_PASS to your .env file'));
        }
      }

      // Create transporter with Gmail or other SMTP service
      this.transporter = nodemailer.createTransport(stryMutAct_9fa48("3794") ? {} : (stryCov_9fa48("3794"), {
        service: stryMutAct_9fa48("3795") ? "" : (stryCov_9fa48("3795"), 'gmail'),
        auth: stryMutAct_9fa48("3796") ? {} : (stryCov_9fa48("3796"), {
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
    if (stryMutAct_9fa48("3797")) {
      {}
    } else {
      stryCov_9fa48("3797");
      try {
        if (stryMutAct_9fa48("3798")) {
          {}
        } else {
          stryCov_9fa48("3798");
          await this.transporter.verify();
          console.log(stryMutAct_9fa48("3799") ? "" : (stryCov_9fa48("3799"), '✅ Email service connected successfully'));
          console.log(stryMutAct_9fa48("3800") ? "" : (stryCov_9fa48("3800"), '   Using email:'), process.env.EMAIL_USER);
        }
      } catch (error) {
        if (stryMutAct_9fa48("3801")) {
          {}
        } else {
          stryCov_9fa48("3801");
          console.error(stryMutAct_9fa48("3802") ? "" : (stryCov_9fa48("3802"), '❌ Email service connection failed:'));
          console.error(stryMutAct_9fa48("3803") ? "" : (stryCov_9fa48("3803"), '   Error:'), error.message);
          console.error(stryMutAct_9fa48("3804") ? "" : (stryCov_9fa48("3804"), '   Check your EMAIL_USER and EMAIL_PASS in .env file'));
          console.error(stryMutAct_9fa48("3805") ? "" : (stryCov_9fa48("3805"), '   For Gmail, you need an App Password (not your regular password)'));
        }
      }
    }
  }

  /**
   * Generate a 6-digit OTP
   */
  generateOTP() {
    if (stryMutAct_9fa48("3806")) {
      {}
    } else {
      stryCov_9fa48("3806");
      return Math.floor(stryMutAct_9fa48("3807") ? 100000 - Math.random() * 900000 : (stryCov_9fa48("3807"), 100000 + (stryMutAct_9fa48("3808") ? Math.random() / 900000 : (stryCov_9fa48("3808"), Math.random() * 900000)))).toString();
    }
  }

  /**
   * Send OTP for email verification during signup
   */
  async sendSignupOTP(email, name, otp) {
    if (stryMutAct_9fa48("3809")) {
      {}
    } else {
      stryCov_9fa48("3809");
      const mailOptions = stryMutAct_9fa48("3810") ? {} : (stryCov_9fa48("3810"), {
        from: stryMutAct_9fa48("3811") ? `` : (stryCov_9fa48("3811"), `Fluentify <${process.env.EMAIL_USER}>`),
        to: email,
        subject: stryMutAct_9fa48("3812") ? "" : (stryCov_9fa48("3812"), 'Verify Your Email - Fluentify'),
        html: stryMutAct_9fa48("3813") ? `` : (stryCov_9fa48("3813"), `
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
        if (stryMutAct_9fa48("3814")) {
          {}
        } else {
          stryCov_9fa48("3814");
          console.log(stryMutAct_9fa48("3815") ? `` : (stryCov_9fa48("3815"), `📧 Sending signup OTP to: ${email}`));
          const info = await this.transporter.sendMail(mailOptions);
          console.log(stryMutAct_9fa48("3816") ? `` : (stryCov_9fa48("3816"), `✅ Signup OTP sent successfully to ${email}`));
          console.log(stryMutAct_9fa48("3817") ? `` : (stryCov_9fa48("3817"), `   Message ID: ${info.messageId}`));
          return stryMutAct_9fa48("3818") ? {} : (stryCov_9fa48("3818"), {
            success: stryMutAct_9fa48("3819") ? false : (stryCov_9fa48("3819"), true),
            messageId: info.messageId
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("3820")) {
          {}
        } else {
          stryCov_9fa48("3820");
          console.error(stryMutAct_9fa48("3821") ? `` : (stryCov_9fa48("3821"), `❌ Failed to send signup OTP to ${email}:`));
          console.error(stryMutAct_9fa48("3822") ? `` : (stryCov_9fa48("3822"), `   Error: ${error.message}`));
          if (stryMutAct_9fa48("3824") ? false : stryMutAct_9fa48("3823") ? true : (stryCov_9fa48("3823", "3824"), error.code)) console.error(stryMutAct_9fa48("3825") ? `` : (stryCov_9fa48("3825"), `   Code: ${error.code}`));
          if (stryMutAct_9fa48("3827") ? false : stryMutAct_9fa48("3826") ? true : (stryCov_9fa48("3826", "3827"), error.response)) console.error(stryMutAct_9fa48("3828") ? `` : (stryCov_9fa48("3828"), `   Response: ${error.response}`));
          throw new Error(stryMutAct_9fa48("3829") ? `` : (stryCov_9fa48("3829"), `Failed to send verification email: ${error.message}`));
        }
      }
    }
  }

  /**
   * Send OTP for password reset
   */
  async sendPasswordResetOTP(email, name, otp) {
    if (stryMutAct_9fa48("3830")) {
      {}
    } else {
      stryCov_9fa48("3830");
      const mailOptions = stryMutAct_9fa48("3831") ? {} : (stryCov_9fa48("3831"), {
        from: stryMutAct_9fa48("3832") ? `` : (stryCov_9fa48("3832"), `Fluentify <${process.env.EMAIL_USER}>`),
        to: email,
        subject: stryMutAct_9fa48("3833") ? "" : (stryCov_9fa48("3833"), 'Reset Your Password - Fluentify'),
        html: stryMutAct_9fa48("3834") ? `` : (stryCov_9fa48("3834"), `
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
        if (stryMutAct_9fa48("3835")) {
          {}
        } else {
          stryCov_9fa48("3835");
          console.log(stryMutAct_9fa48("3836") ? `` : (stryCov_9fa48("3836"), `📧 Sending password reset OTP to: ${email}`));
          const info = await this.transporter.sendMail(mailOptions);
          console.log(stryMutAct_9fa48("3837") ? `` : (stryCov_9fa48("3837"), `✅ Password reset OTP sent successfully to ${email}`));
          console.log(stryMutAct_9fa48("3838") ? `` : (stryCov_9fa48("3838"), `   Message ID: ${info.messageId}`));
          return stryMutAct_9fa48("3839") ? {} : (stryCov_9fa48("3839"), {
            success: stryMutAct_9fa48("3840") ? false : (stryCov_9fa48("3840"), true),
            messageId: info.messageId
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("3841")) {
          {}
        } else {
          stryCov_9fa48("3841");
          console.error(stryMutAct_9fa48("3842") ? `` : (stryCov_9fa48("3842"), `❌ Failed to send password reset OTP to ${email}:`));
          console.error(stryMutAct_9fa48("3843") ? `` : (stryCov_9fa48("3843"), `   Error: ${error.message}`));
          if (stryMutAct_9fa48("3845") ? false : stryMutAct_9fa48("3844") ? true : (stryCov_9fa48("3844", "3845"), error.code)) console.error(stryMutAct_9fa48("3846") ? `` : (stryCov_9fa48("3846"), `   Code: ${error.code}`));
          if (stryMutAct_9fa48("3848") ? false : stryMutAct_9fa48("3847") ? true : (stryCov_9fa48("3847", "3848"), error.response)) console.error(stryMutAct_9fa48("3849") ? `` : (stryCov_9fa48("3849"), `   Response: ${error.response}`));
          throw new Error(stryMutAct_9fa48("3850") ? `` : (stryCov_9fa48("3850"), `Failed to send password reset email: ${error.message}`));
        }
      }
    }
  }

  /**
   * Send welcome email after successful verification
   */
  async sendWelcomeEmail(email, name) {
    if (stryMutAct_9fa48("3851")) {
      {}
    } else {
      stryCov_9fa48("3851");
      const mailOptions = stryMutAct_9fa48("3852") ? {} : (stryCov_9fa48("3852"), {
        from: stryMutAct_9fa48("3853") ? `` : (stryCov_9fa48("3853"), `Fluentify <${process.env.EMAIL_USER}>`),
        to: email,
        subject: stryMutAct_9fa48("3854") ? "" : (stryCov_9fa48("3854"), 'Welcome to Fluentify!'),
        html: stryMutAct_9fa48("3855") ? `` : (stryCov_9fa48("3855"), `
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
        if (stryMutAct_9fa48("3856")) {
          {}
        } else {
          stryCov_9fa48("3856");
          await this.transporter.sendMail(mailOptions);
          return stryMutAct_9fa48("3857") ? {} : (stryCov_9fa48("3857"), {
            success: stryMutAct_9fa48("3858") ? false : (stryCov_9fa48("3858"), true)
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("3859")) {
          {}
        } else {
          stryCov_9fa48("3859");
          console.error(stryMutAct_9fa48("3860") ? "" : (stryCov_9fa48("3860"), 'Error sending welcome email:'), error);
          // Don't throw error for welcome email as it's not critical
          return stryMutAct_9fa48("3861") ? {} : (stryCov_9fa48("3861"), {
            success: stryMutAct_9fa48("3862") ? true : (stryCov_9fa48("3862"), false)
          });
        }
      }
    }
  }

  /**
   * Send profile update confirmation
   */
  async sendProfileUpdateConfirmation(email, name) {
    if (stryMutAct_9fa48("3863")) {
      {}
    } else {
      stryCov_9fa48("3863");
      const mailOptions = stryMutAct_9fa48("3864") ? {} : (stryCov_9fa48("3864"), {
        from: stryMutAct_9fa48("3865") ? `` : (stryCov_9fa48("3865"), `Fluentify <${process.env.EMAIL_USER}>`),
        to: email,
        subject: stryMutAct_9fa48("3866") ? "" : (stryCov_9fa48("3866"), 'Your Profile Was Updated - Fluentify'),
        html: stryMutAct_9fa48("3867") ? `` : (stryCov_9fa48("3867"), `
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
        if (stryMutAct_9fa48("3868")) {
          {}
        } else {
          stryCov_9fa48("3868");
          await this.transporter.sendMail(mailOptions);
          return stryMutAct_9fa48("3869") ? {} : (stryCov_9fa48("3869"), {
            success: stryMutAct_9fa48("3870") ? false : (stryCov_9fa48("3870"), true)
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("3871")) {
          {}
        } else {
          stryCov_9fa48("3871");
          console.error(stryMutAct_9fa48("3872") ? "" : (stryCov_9fa48("3872"), 'Error sending profile update confirmation:'), error);
          return stryMutAct_9fa48("3873") ? {} : (stryCov_9fa48("3873"), {
            success: stryMutAct_9fa48("3874") ? true : (stryCov_9fa48("3874"), false)
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
    if (stryMutAct_9fa48("3875")) {
      {}
    } else {
      stryCov_9fa48("3875");
      // Format field name for display
      const formatFieldName = field => {
        if (stryMutAct_9fa48("3876")) {
          {}
        } else {
          stryCov_9fa48("3876");
          const fieldNames = stryMutAct_9fa48("3877") ? {} : (stryCov_9fa48("3877"), {
            name: stryMutAct_9fa48("3878") ? "" : (stryCov_9fa48("3878"), 'Name'),
            email: stryMutAct_9fa48("3879") ? "" : (stryCov_9fa48("3879"), 'Email Address'),
            phone: stryMutAct_9fa48("3880") ? "" : (stryCov_9fa48("3880"), 'Phone Number')
          });
          return stryMutAct_9fa48("3883") ? fieldNames[field] && field.charAt(0).toUpperCase() + field.slice(1) : stryMutAct_9fa48("3882") ? false : stryMutAct_9fa48("3881") ? true : (stryCov_9fa48("3881", "3882", "3883"), fieldNames[field] || (stryMutAct_9fa48("3884") ? field.charAt(0).toUpperCase() - field.slice(1) : (stryCov_9fa48("3884"), (stryMutAct_9fa48("3886") ? field.toUpperCase() : stryMutAct_9fa48("3885") ? field.charAt(0).toLowerCase() : (stryCov_9fa48("3885", "3886"), field.charAt(0).toUpperCase())) + (stryMutAct_9fa48("3887") ? field : (stryCov_9fa48("3887"), field.slice(1))))));
        }
      };

      // Build change items HTML
      const changeItems = Object.entries(changes).map(([field, {
        old,
        new: newValue
      }]) => {
        if (stryMutAct_9fa48("3888")) {
          {}
        } else {
          stryCov_9fa48("3888");
          return stryMutAct_9fa48("3889") ? `` : (stryCov_9fa48("3889"), `
          <div class="change-item">
            <span class="field-name">${formatFieldName(field)}:</span><br/>
            Changed from "<em>${old}</em>" to "<strong>${newValue}</strong>"
          </div>
        `);
        }
      }).join(stryMutAct_9fa48("3890") ? "Stryker was here!" : (stryCov_9fa48("3890"), ''));
      const mailOptions = stryMutAct_9fa48("3891") ? {} : (stryCov_9fa48("3891"), {
        from: stryMutAct_9fa48("3892") ? `` : (stryCov_9fa48("3892"), `Fluentify <${process.env.EMAIL_USER}>`),
        to: email,
        subject: stryMutAct_9fa48("3893") ? "" : (stryCov_9fa48("3893"), 'Your Fluentify Profile Has Been Updated'),
        text: stryMutAct_9fa48("3894") ? `` : (stryCov_9fa48("3894"), `
Hello ${name},

Your Fluentify profile has been updated by an administrator.

Changes made:
${Object.entries(changes).map(stryMutAct_9fa48("3895") ? () => undefined : (stryCov_9fa48("3895"), ([field, {
          old,
          new: newValue
        }]) => stryMutAct_9fa48("3896") ? `` : (stryCov_9fa48("3896"), `• ${formatFieldName(field)}: Changed from "${old}" to "${newValue}"`))).join(stryMutAct_9fa48("3897") ? "" : (stryCov_9fa48("3897"), '\n'))}

If you did not request these changes or have any concerns, please contact our support team immediately.

Best regards,
The Fluentify Team
      `),
        html: stryMutAct_9fa48("3898") ? `` : (stryCov_9fa48("3898"), `
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
        if (stryMutAct_9fa48("3899")) {
          {}
        } else {
          stryCov_9fa48("3899");
          console.log(stryMutAct_9fa48("3900") ? `` : (stryCov_9fa48("3900"), `📧 Sending profile update notification to: ${email}`));
          const info = await this.transporter.sendMail(mailOptions);
          console.log(stryMutAct_9fa48("3901") ? `` : (stryCov_9fa48("3901"), `✅ Profile update notification sent successfully to ${email}`));
          console.log(stryMutAct_9fa48("3902") ? `` : (stryCov_9fa48("3902"), `   Message ID: ${info.messageId}`));
          return stryMutAct_9fa48("3903") ? {} : (stryCov_9fa48("3903"), {
            success: stryMutAct_9fa48("3904") ? false : (stryCov_9fa48("3904"), true),
            messageId: info.messageId
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("3905")) {
          {}
        } else {
          stryCov_9fa48("3905");
          console.error(stryMutAct_9fa48("3906") ? `` : (stryCov_9fa48("3906"), `❌ Failed to send profile update notification to ${email}:`));
          console.error(stryMutAct_9fa48("3907") ? `` : (stryCov_9fa48("3907"), `   Error: ${error.message}`));
          // Don't throw error - we don't want to fail the update if email fails
          return stryMutAct_9fa48("3908") ? {} : (stryCov_9fa48("3908"), {
            success: stryMutAct_9fa48("3909") ? true : (stryCov_9fa48("3909"), false),
            error: error.message
          });
        }
      }
    }
  }
}
export default new EmailService();