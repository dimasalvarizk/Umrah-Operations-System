const nodemailer = require('nodemailer');

// Initialize Titan Email SMTP Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.titan.email',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: process.env.SMTP_SECURE === 'true' || true,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

class EmailService {
  /**
   * Generic send email method
   */
  static async sendMail({ to, subject, html, text }) {
    const fromName = process.env.SMTP_FROM_NAME || 'ODST Umrah Operations System';
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'info@odst.id';

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      text: text || '',
      html: html || text,
    };

    return transporter.sendMail(mailOptions);
  }

  /**
   * Send Password Reset OTP Email
   */
  static async sendPasswordResetOtp({ to, name, otpCode, expiresMinutes = 15 }) {
    const subject = `🔐 Password Reset Code: ${otpCode} - ODST Umrah System`;
    const html = `
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Request</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: #0f172a; padding: 28px 24px; text-align: center; }
    .logo-text { color: #00dc82; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; margin: 0; }
    .sub-logo { color: #94a3b8; font-size: 11px; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }
    .content { padding: 32px 28px; }
    .greeting { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
    .text { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
    .otp-box { background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .otp-label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0f172a; font-family: 'Courier New', monospace; }
    .warning { background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 12px 16px; font-size: 12px; color: #b45309; margin-top: 20px; }
    .footer { background: #f8fafc; padding: 20px 28px; text-align: center; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">ODST UMRAH OPERATIONS SYSTEM</div>
      <div class="sub-logo">Saudi Arabia • Global Operations</div>
    </div>
    <div class="content">
      <div class="greeting">Hello ${name || 'User'},</div>
      <p class="text">We received a request to reset the password for your ODST Umrah Operations operator account (<strong>${to}</strong>).</p>
      
      <div class="otp-box">
        <div class="otp-label">Your Verification Code</div>
        <div class="otp-code">${otpCode}</div>
      </div>
      
      <p class="text">This verification code is valid for <strong>${expiresMinutes} minutes</strong>. Please enter this code on the password reset screen to complete the process.</p>
      
      <div class="warning">
        ⚠️ If you did not request this password reset, please ignore this email or contact the system administrator immediately.
      </div>
    </div>
    <div class="footer">
      &copy; 2026 ODST Group • Umrah Operations System • All rights reserved.
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({
      to,
      subject,
      text: `Your password reset code is: ${otpCode}. It will expire in ${expiresMinutes} minutes.`,
      html,
    });
  }

  /**
   * Send Password Reset Success Notification
   */
  static async sendPasswordResetSuccess({ to, name }) {
    const subject = `✅ Password Successfully Reset - ODST Umrah System`;
    const html = `
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: #0f172a; padding: 28px 24px; text-align: center; }
    .logo-text { color: #00dc82; font-size: 20px; font-weight: 800; }
    .content { padding: 32px 28px; }
    .success-box { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 16px; text-align: center; color: #065f46; font-weight: 700; margin-bottom: 20px; font-size: 15px; }
    .text { font-size: 14px; line-height: 1.6; color: #475569; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">ODST UMRAH OPERATIONS</div>
    </div>
    <div class="content">
      <div class="success-box">✅ Password Successfully Changed</div>
      <p class="text">Hello <strong>${name || 'User'}</strong>,</p>
      <p class="text">The password for your account (<strong>${to}</strong>) has been successfully updated on ${new Date().toUTCString()}.</p>
      <p class="text">You can now sign in to the ODST Umrah Operations System using your new credentials.</p>
    </div>
    <div class="footer">
      &copy; 2026 ODST Group • Umrah Operations System
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({
      to,
      subject,
      text: `Hello ${name || 'User'}, your password has been successfully updated.`,
      html,
    });
  }
}

module.exports = EmailService;
