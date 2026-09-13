const { pool } = require('../config/db');

/**
 * Universal Operational Notification & Email Dispatcher
 */
async function notifyAndEmail({
  titleEn,
  titleAr,
  descEn,
  descAr,
  type = 'system',
  referenceId = null,
  referenceLink = null,
  recipientEmail = null,
}) {
  try {
    // 1. Ensure notification table exists & insert notification record
    await pool.execute(
      `INSERT INTO notifications (title_en, title_ar, desc_en, desc_ar, type, reference_id, reference_link, is_read, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, NOW())`,
      [
        titleEn,
        titleAr || titleEn,
        descEn || '',
        descAr || descEn || '',
        type,
        referenceId ? String(referenceId) : null,
        referenceLink || null,
      ]
    );

    // 2. Dispatch Email alert via Settings Service (Titan Email Gateway to all Manage Team members)
    const settingsServiceUrl = process.env.SETTINGS_SERVICE_URL || 'http://localhost:5002';
    const targetEmail = recipientEmail || 'all';

    try {
      const fetchFn = typeof fetch !== 'undefined' ? fetch : null;
      if (fetchFn) {
        await fetchFn(`${settingsServiceUrl}/api/settings/notifications/send-email-alert`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: targetEmail,
            titleEn,
            titleAr,
            descEn,
            descAr,
            type,
            referenceLink,
          }),
        });
      }
    } catch (emailErr) {
      console.warn('⚠️ Could not dispatch operational email alert:', emailErr.message);
    }
  } catch (err) {
    console.error('❌ notifyAndEmail error:', err.message);
  }
}

module.exports = { notifyAndEmail };
