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
   * Get all active team members from Manage Team (team_members) and users table
   */
  static async getAdminRecipients() {
    try {
      const { pool } = require('../config/db');
      
      // 1. Fetch active team members from Manage Team
      const [teamRows] = await pool.query(
        "SELECT email FROM team_members WHERE LOWER(status) = 'active' OR status = 'نشط'"
      );
      
      // 2. Fetch active users
      const [userRows] = await pool.query(
        "SELECT email FROM users WHERE LOWER(status) = 'active'"
      );

      const allEmails = [
        ...teamRows.map((r) => r.email?.trim().toLowerCase()),
        ...userRows.map((r) => r.email?.trim().toLowerCase()),
        'info@odst.id',
      ].filter(Boolean);

      const uniqueEmails = [...new Set(allEmails)];
      if (uniqueEmails.length > 0) {
        return uniqueEmails;
      }
    } catch (e) {
      console.warn('Could not query Manage Team emails:', e.message);
    }
    return ['alvarizkidimas@gmail.com', 'ali@odst.id', 'info@odst.id'];
  }


  /**
   * Generic send email method
   */
  static async sendMail({ to, subject, html, text }) {
    const fromName = process.env.SMTP_FROM_NAME || 'ODST Umrah Operations System';
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'info@odst.id';

    const recipient = Array.isArray(to) ? to.join(', ') : to;

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: recipient,
      subject,
      text: text || '',
      html: html || text,
    };

    return transporter.sendMail(mailOptions);
  }


  /**
   * Send Operational Notification Alert
   */
  static async sendNotificationAlert({ to, titleEn, titleAr, descEn, descAr, type = 'system', referenceLink }) {
    const displayTitle = titleEn || titleAr || 'Operational Notification';
    const subject = `🔔 ${displayTitle} - ODST Umrah System`;
    const actionUrl = referenceLink ? (referenceLink.startsWith('http') ? referenceLink : `http://localhost:5173${referenceLink}`) : 'http://localhost:5173/dashboard';

    const html = `
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${displayTitle}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: #0f172a; padding: 24px; text-align: center; }
    .logo-text { color: #00dc82; font-size: 18px; font-weight: 800; letter-spacing: 0.5px; }
    .sub-logo { color: #94a3b8; font-size: 11px; margin-top: 4px; text-transform: uppercase; }
    .content { padding: 32px 28px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; background: #fef3c7; color: #b45309; margin-bottom: 16px; }
    .title { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px; line-height: 1.4; }
    .title-ar { font-size: 16px; font-weight: 700; color: #334155; margin-bottom: 16px; direction: rtl; }
    .desc-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; font-size: 14px; line-height: 1.6; color: #475569; margin: 20px 0; }
    .btn-container { text-align: center; margin: 28px 0; }
    .btn { display: inline-block; background: #00dc82; color: #0f172a !important; font-weight: 700; font-size: 13px; text-decoration: none; padding: 12px 28px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .footer { background: #f8fafc; padding: 20px 28px; text-align: center; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">ODST UMRAH OPERATIONS SYSTEM</div>
      <div class="sub-logo">Real-Time Notification Feed</div>
    </div>
    <div class="content">
      <span class="badge">${type} Alert</span>
      <div class="title">${titleEn || ''}</div>
      ${titleAr ? `<div class="title-ar">${titleAr}</div>` : ''}
      
      <div class="desc-box">
        ${descEn ? `<p style="margin:0 0 10px 0;">${descEn}</p>` : ''}
        ${descAr ? `<p style="margin:0; direction: rtl; text-align: right; color: #1e293b;">${descAr}</p>` : ''}
      </div>

      <div class="btn-container">
        <a href="${actionUrl}" class="btn">View in Umrah Dashboard &rarr;</a>
      </div>
    </div>
    <div class="footer">
      This is an automated notification from ODST Umrah Operations System.<br>
      To adjust email notification preferences, visit Settings &gt; Notifications.
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({
      to,
      subject,
      text: `${titleEn || ''}\n${descEn || ''}\n\nView at: ${actionUrl}`,
      html,
    });
  }
}

module.exports = EmailService;
