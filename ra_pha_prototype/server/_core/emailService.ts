/**
 * Email Service for sending verification and password reset emails
 * This is a mock implementation - in production, integrate with a real email service
 * like SendGrid, AWS SES, or Mailgun
 */

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email (mock implementation)
 * In production, replace with actual email service
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    console.log(`[Email] Sending email to ${options.to}`);
    console.log(`[Email] Subject: ${options.subject}`);
    console.log(`[Email] HTML: ${options.html.substring(0, 100)}...`);

    // TODO: Integrate with real email service
    // Example with SendGrid:
    // const msg = {
    //   to: options.to,
    //   from: process.env.SENDGRID_FROM_EMAIL,
    //   subject: options.subject,
    //   html: options.html,
    //   text: options.text,
    // };
    // await sgMail.send(msg);

    return true;
  } catch (error) {
    console.error("[Email] Failed to send email:", error);
    return false;
  }
}

/**
 * Send email verification email
 */
export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationToken: string,
  verificationUrl: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4f46e5; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9fafb; padding: 20px; border-radius: 0 0 5px 5px; }
          .button { background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 10px; }
          .warning { background-color: #fef3c7; padding: 10px; border-radius: 5px; margin: 10px 0; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to RAPHA! 🏥</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for creating an account with RAPHA. To complete your registration and start tracking your health, please verify your email address.</p>
            
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
            
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; background-color: #e5e7eb; padding: 10px; border-radius: 5px;">
              ${verificationUrl}
            </p>
            
            <div class="warning">
              <strong>⏱️ This link expires in 24 hours.</strong>
            </div>
            
            <p>If you didn't create this account, please ignore this email.</p>
            
            <div class="footer">
              <p>RAPHA - Your Personal Health Assistant</p>
              <p>© 2026 RAPHA. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Welcome to RAPHA!

Hi ${name},

Thank you for creating an account with RAPHA. To complete your registration and start tracking your health, please verify your email address.

Verification Link: ${verificationUrl}

This link expires in 24 hours.

If you didn't create this account, please ignore this email.

RAPHA - Your Personal Health Assistant
© 2026 RAPHA. All rights reserved.
  `;

  return sendEmail({
    to: email,
    subject: "Verify Your RAPHA Email Address",
    html,
    text,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetToken: string,
  resetUrl: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc2626; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9fafb; padding: 20px; border-radius: 0 0 5px 5px; }
          .button { background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 10px; }
          .warning { background-color: #fee2e2; padding: 10px; border-radius: 5px; margin: 10px 0; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request 🔐</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>We received a request to reset the password for your RAPHA account. Click the button below to reset your password.</p>
            
            <a href="${resetUrl}" class="button">Reset Password</a>
            
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; background-color: #e5e7eb; padding: 10px; border-radius: 5px;">
              ${resetUrl}
            </p>
            
            <div class="warning">
              <strong>⏱️ This link expires in 1 hour.</strong>
            </div>
            
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            
            <div class="footer">
              <p>RAPHA - Your Personal Health Assistant</p>
              <p>© 2026 RAPHA. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Password Reset Request

Hi ${name},

We received a request to reset the password for your RAPHA account. Click the link below to reset your password.

Reset Link: ${resetUrl}

This link expires in 1 hour.

If you didn't request a password reset, please ignore this email.

RAPHA - Your Personal Health Assistant
© 2026 RAPHA. All rights reserved.
  `;

  return sendEmail({
    to: email,
    subject: "Reset Your RAPHA Password",
    html,
    text,
  });
}

/**
 * Send email verification reminder
 */
export async function sendVerificationReminder(
  email: string,
  name: string,
  verificationUrl: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f59e0b; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9fafb; padding: 20px; border-radius: 0 0 5px 5px; }
          .button { background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Complete Your RAPHA Registration ⏰</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>We noticed you haven't verified your email yet. Complete your registration to start using all RAPHA features.</p>
            
            <a href="${verificationUrl}" class="button">Verify Email Now</a>
            
            <p>If you have any questions, feel free to contact our support team.</p>
            
            <div class="footer">
              <p>RAPHA - Your Personal Health Assistant</p>
              <p>© 2026 RAPHA. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "Complete Your RAPHA Email Verification",
    html,
  });
}
