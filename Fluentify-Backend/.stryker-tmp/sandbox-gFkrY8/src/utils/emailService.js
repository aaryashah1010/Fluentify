// @ts-nocheck
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Email service for sending OTP and other emails
 */
class EmailService {
  constructor() {
    // Verify email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ EMAIL CONFIGURATION ERROR:');
      console.error('   EMAIL_USER:', process.env.EMAIL_USER ? '✓ Set' : '✗ Missing');
      console.error('   EMAIL_PASS:', process.env.EMAIL_PASS ? '✓ Set' : '✗ Missing');
      console.error('   Please add EMAIL_USER and EMAIL_PASS to your .env file');
    }

    // Create transporter with Gmail or other SMTP service
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Use App Password for Gmail
      }
    });

    // Verify connection on startup
    this.verifyConnection();
  }

  /**
   * Verify email service connection
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service connected successfully');
      console.log('   Using email:', process.env.EMAIL_USER);
    } catch (error) {
      console.error('❌ Email service connection failed:');
      console.error('   Error:', error.message);
      console.error('   Check your EMAIL_USER and EMAIL_PASS in .env file');
      console.error('   For Gmail, you need an App Password (not your regular password)');
    }
  }

  /**
   * Generate a 6-digit OTP
   */
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send OTP for email verification during signup
   */
  async sendSignupOTP(email, name, otp) {
    const mailOptions = {
      from: `Fluentify <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - Fluentify',
      html: `
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
      `
    };

    try {
      console.log(`📧 Sending signup OTP to: ${email}`);
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Signup OTP sent successfully to ${email}`);
      console.log(`   Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`❌ Failed to send signup OTP to ${email}:`);
      console.error(`   Error: ${error.message}`);
      if (error.code) console.error(`   Code: ${error.code}`);
      if (error.response) console.error(`   Response: ${error.response}`);
      throw new Error(`Failed to send verification email: ${error.message}`);
    }
  }

  /**
   * Send OTP for password reset
   */
  async sendPasswordResetOTP(email, name, otp) {
    const mailOptions = {
      from: `Fluentify <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password - Fluentify',
      html: `
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
      `
    };

    try {
      console.log(`📧 Sending password reset OTP to: ${email}`);
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Password reset OTP sent successfully to ${email}`);
      console.log(`   Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`❌ Failed to send password reset OTP to ${email}:`);
      console.error(`   Error: ${error.message}`);
      if (error.code) console.error(`   Code: ${error.code}`);
      if (error.response) console.error(`   Response: ${error.response}`);
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }

  /**
   * Send welcome email after successful verification
   */
  async sendWelcomeEmail(email, name) {
    const mailOptions = {
      from: `Fluentify <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Fluentify!',
      html: `
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
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't throw error for welcome email as it's not critical
      return { success: false };
    }
  }

  /**
   * Send profile update confirmation
   */
  async sendProfileUpdateConfirmation(email, name) {
    const mailOptions = {
      from: `Fluentify <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Profile Was Updated - Fluentify',
      html: `
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
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Error sending profile update confirmation:', error);
      return { success: false };
    }
  }

  /**
   * Notify learner that an admin updated their profile
   * @param {string} email - Learner's email
   * @param {string} name - Learner's name
   * @param {Object} changes - Object with field changes { fieldName: { old: 'value', new: 'value' } }
   */
  async sendAdminProfileChangeNotification(email, name, changes = {}) {
    // Format field name for display
    const formatFieldName = (field) => {
      const fieldNames = {
        name: 'Name',
        email: 'Email Address',
        phone: 'Phone Number',
      };
      return fieldNames[field] || field.charAt(0).toUpperCase() + field.slice(1);
    };

    // Build change items HTML
    const changeItems = Object.entries(changes)
      .map(([field, { old, new: newValue }]) => {
        return `
          <div class="change-item">
            <span class="field-name">${formatFieldName(field)}:</span><br/>
            Changed from "<em>${old}</em>" to "<strong>${newValue}</strong>"
          </div>
        `;
      })
      .join('');

    const mailOptions = {
      from: `Fluentify <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Fluentify Profile Has Been Updated',
      text: `
Hello ${name},

Your Fluentify profile has been updated by an administrator.

Changes made:
${Object.entries(changes)
  .map(([field, { old, new: newValue }]) => `• ${formatFieldName(field)}: Changed from "${old}" to "${newValue}"`)
  .join('\n')}

If you did not request these changes or have any concerns, please contact our support team immediately.

Best regards,
The Fluentify Team
      `,
      html: `
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
      `
    };

    try {
      console.log(`📧 Sending profile update notification to: ${email}`);
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Profile update notification sent successfully to ${email}`);
      console.log(`   Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`❌ Failed to send profile update notification to ${email}:`);
      console.error(`   Error: ${error.message}`);
      // Don't throw error - we don't want to fail the update if email fails
      return { success: false, error: error.message };
    }
  }
}

export default new EmailService();