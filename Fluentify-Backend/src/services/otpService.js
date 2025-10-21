/**
 * OTP Service
 * Handles OTP generation, storage, validation, and email sending
 */

import crypto from 'crypto';
import nodemailer from 'nodemailer';

/**
 * Generates a 6-digit OTP
 * @returns {string} 6-digit OTP
 */
export function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Generates OTP expiry time (2 minutes from now)
 * @returns {Date} Expiry timestamp
 */
export function generateOTPExpiry() {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 2); // OTP valid for 2 minutes
  return expiry;
}

/**
 * Validates if OTP is still valid (not expired)
 * @param {Date} expiryTime - OTP expiry timestamp
 * @returns {boolean} True if OTP is still valid
 */
export function isOTPValid(expiryTime) {
  return new Date() < new Date(expiryTime);
}

/**
 * Sends OTP email using Nodemailer
 * 
 * @param {string} email - Recipient email
 * @param {string} otp - OTP code
 * @param {string} name - User's name
 * @returns {Promise<boolean>} Success status
 */
export async function sendOTPEmail(email, otp, name = 'User') {
  try {
    // Always log to console for debugging
    console.log('\n========================================');
    console.log('📧 SENDING EMAIL VERIFICATION OTP');
    console.log('========================================');
    console.log(`To: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`Valid for: 2 minutes`);
    console.log('========================================\n');
    
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('⚠️  Email credentials not configured. OTP only logged to console.');
      console.warn('⚠️  Add EMAIL_USER and EMAIL_PASSWORD to .env file to send actual emails.');
      return true; // Return true so signup doesn't fail
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Email HTML template
    const mailOptions = {
      from: {
        name: 'Fluentify',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Verify Your Email - Fluentify',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Fluentify</h1>
                      <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Language Learning Platform</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Welcome, ${name}! 👋</h2>
                      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Thank you for signing up with Fluentify! To complete your registration and start your language learning journey, please verify your email address.
                      </p>
                      
                      <!-- OTP Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td align="center" style="background-color: #f8f9fa; border-radius: 10px; padding: 30px;">
                            <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                            <h1 style="color: #667eea; margin: 0; font-size: 48px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</h1>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                        <strong>⏰ This code will expire in 2 minutes.</strong><br>
                        Please enter it on the verification page to activate your account.
                      </p>
                      
                      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <p style="color: #856404; font-size: 13px; margin: 0; line-height: 1.5;">
                          <strong>🔒 Security Tip:</strong> Never share this code with anyone. Fluentify will never ask for your verification code via phone or email.
                        </p>
                      </div>
                      
                      <p style="color: #999999; font-size: 13px; line-height: 1.6; margin: 30px 0 0 0;">
                        If you didn't create an account with Fluentify, please ignore this email or contact our support team if you have concerns.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                      <p style="color: #999999; font-size: 12px; margin: 0; line-height: 1.5;">
                        © ${new Date().getFullYear()} Fluentify. All rights reserved.<br>
                        This is an automated email. Please do not reply to this message.
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${email}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    console.error('Error details:', error.message);
    
    // Don't fail the request if email fails - user can still see OTP in console
    return true;
  }
}

/**
 * Sends welcome email after successful verification
 * @param {string} email - Recipient email
 * @param {string} name - User's name
 * @returns {Promise<boolean>} Success status
 */
export async function sendWelcomeEmail(email, name) {
  try {
    console.log('\n========================================');
    console.log('📧 WELCOME EMAIL');
    console.log('========================================');
    console.log(`To: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`Message: Welcome to Fluentify! Your email has been verified.`);
    console.log('========================================\n');
    
    // TODO: Replace with actual email service in production
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}

export default {
  generateOTP,
  generateOTPExpiry,
  isOTPValid,
  sendOTPEmail,
  sendWelcomeEmail
};
