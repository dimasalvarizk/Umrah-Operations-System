const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const UserModel = require('../models/userModel');
const { pool } = require('../config/db');
const { generateToken } = require('../utils/jwt');
const EmailService = require('./emailService');

class AuthService {
  /**
   * Helper to parse user agent into human friendly name
   */
  static parseUserAgent(ua = '') {
    if (!ua) return 'Web Browser';
    if (ua.includes('iPhone')) return 'Safari on iPhone';
    if (ua.includes('iPad')) return 'Safari on iPad';
    if (ua.includes('Android')) return 'Chrome on Android';
    if (ua.includes('Edg/')) return 'Edge on Windows';
    if (ua.includes('Chrome/')) return 'Chrome on Windows';
    if (ua.includes('Firefox/')) return 'Firefox on Windows';
    if (ua.includes('Macintosh')) return 'Safari on macOS';
    return 'Desktop Browser';
  }

  /**
   * Register a new user
   */
  static async register({ name, email, password, role = 'admin', phone = null }) {
    // 1. Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      const error = new Error('Email is already registered');
      error.statusCode = 400;
      throw error;
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Save to database
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
    });

    // 4. Generate JWT Token
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        status: newUser.status,
      },
      token,
    };
  }

  /**
   * Login user with email and password
   */
  static async login({ email, password, ip = '127.0.0.1', userAgent = '' }) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const friendlyAgent = this.parseUserAgent(userAgent);

    // 1. Find user by email
    const user = await UserModel.findByEmail(cleanEmail);
    if (!user) {
      // Record failed attempt
      try {
        await pool.execute(
          'INSERT INTO login_logs (email, ip, agent, status) VALUES (?, ?, ?, ?)',
          [cleanEmail, ip, friendlyAgent, 'Failed']
        );
      } catch {}

      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // 2. Check if user is active
    if (user.status !== 'active') {
      try {
        await pool.execute(
          'INSERT INTO login_logs (user_id, email, ip, agent, status) VALUES (?, ?, ?, ?, ?)',
          [user.id, cleanEmail, ip, friendlyAgent, 'Failed']
        );
      } catch {}

      const error = new Error('Account is inactive or suspended');
      error.statusCode = 403;
      throw error;
    }

    // 3. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      try {
        await pool.execute(
          'INSERT INTO login_logs (user_id, email, ip, agent, status) VALUES (?, ?, ?, ?, ?)',
          [user.id, cleanEmail, ip, friendlyAgent, 'Failed']
        );
      } catch {}

      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // 4. Update last login
    await UserModel.updateLastLogin(user.id);

    // 5. Record successful login log
    try {
      await pool.execute(
        'INSERT INTO login_logs (user_id, email, ip, agent, status) VALUES (?, ?, ?, ?, ?)',
        [user.id, cleanEmail, ip, friendlyAgent, 'Success']
      );

      // Create / update current session
      const isMobile = userAgent.includes('Mobile') || userAgent.includes('iPhone') || userAgent.includes('Android');
      const sessionId = `sess-${Date.now()}`;
      await pool.execute(
        'INSERT INTO user_sessions (id, user_id, device, ip, location, type, is_current, last_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          sessionId,
          user.id,
          friendlyAgent,
          ip,
          'Makkah, Saudi Arabia',
          isMobile ? 'mobile' : 'desktop',
          1,
          'Current session (Active)',
        ]
      );
    } catch (logErr) {
      console.warn('Failed to log login event:', logErr.message);
    }

    // 6. Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        status: user.status,
      },
      token,
    };
  }

  /**
   * Get current authenticated user profile
   */
  static async getProfile(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId, { name, phone, avatar, employeeId, branch, department, jobTitle }) {
    const user = await UserModel.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const updatedUser = await UserModel.updateProfile(userId, {
      name: name !== undefined ? name : user.name,
      phone: phone !== undefined ? phone : user.phone,
      avatar: avatar !== undefined ? avatar : user.avatar,
      employeeId: employeeId !== undefined ? employeeId : user.employee_id,
      branch: branch !== undefined ? branch : user.branch,
      department: department !== undefined ? department : user.department,
      jobTitle: jobTitle !== undefined ? jobTitle : user.job_title,
    });

    return updatedUser;
  }

  /**
   * Change user password
   */
  static async changePassword(userId, { currentPassword, newPassword }) {
    if (!currentPassword || !newPassword) {
      const error = new Error('Current password and new password are required');
      error.statusCode = 400;
      throw error;
    }

    if (newPassword.length < 6) {
      const error = new Error('New password must be at least 6 characters long');
      error.statusCode = 400;
      throw error;
    }

    const currentHash = await UserModel.findPasswordById(userId);
    if (!currentHash) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const isMatch = await bcrypt.compare(currentPassword, currentHash);
    if (!isMatch) {
      const error = new Error('Current password does not match');
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const newHashed = await bcrypt.hash(newPassword, salt);
    await UserModel.updatePassword(userId, newHashed);

    return { message: 'Password changed successfully' };
  }

  /**
   * Get Active Sessions for User
   */
  static async getActiveSessions(userId, reqIp = '127.0.0.1', reqAgent = '') {
    const [rows] = await pool.execute(
      'SELECT id, device, ip, location, type, is_current, last_active, created_at FROM user_sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
      [userId]
    );

    if (rows.length > 0) {
      return rows.map((r, i) => ({
        id: r.id,
        device: r.device,
        ip: r.ip,
        location: r.location || 'Makkah, Saudi Arabia',
        active: i === 0 ? 'Current session (Active)' : (r.last_active || 'Recent'),
        isCurrent: i === 0,
        type: r.type || 'desktop',
      }));
    }

    // If none in DB, create initial active session
    const friendlyAgent = this.parseUserAgent(reqAgent);
    const isMobile = reqAgent.includes('Mobile') || reqAgent.includes('iPhone') || reqAgent.includes('Android');
    const defaultSess = {
      id: 'sess-current',
      device: friendlyAgent,
      ip: reqIp,
      location: 'Makkah, Saudi Arabia',
      active: 'Current session (Active)',
      isCurrent: true,
      type: isMobile ? 'mobile' : 'desktop',
    };

    try {
      await pool.execute(
        'INSERT INTO user_sessions (id, user_id, device, ip, location, type, is_current, last_active) VALUES (?, ?, ?, ?, ?, ?, 1, ?)',
        [defaultSess.id, userId, defaultSess.device, defaultSess.ip, defaultSess.location, defaultSess.type, defaultSess.active]
      );
    } catch {}

    return [defaultSess];
  }

  /**
   * Revoke Session
   */
  static async revokeSession(sessionId, userId) {
    await pool.execute(
      'DELETE FROM user_sessions WHERE id = ? AND user_id = ?',
      [sessionId, userId]
    );
    return { message: 'Session revoked successfully' };
  }

  /**
   * Get Login Activity Logs for User
   */
  static async getLoginLogs(userId, email = '') {
    const [rows] = await pool.execute(
      'SELECT id, created_at, ip, agent, status FROM login_logs WHERE user_id = ? OR email = ? ORDER BY created_at DESC LIMIT 20',
      [userId, email]
    );

    return rows.map((r) => ({
      id: String(r.id),
      timestamp: new Date(r.created_at).toISOString().replace('T', ' ').substring(0, 19),
      ip: r.ip || '127.0.0.1',
      agent: r.agent || 'Chrome / Windows',
      status: r.status || 'Success',
    }));
  }

  /**
   * Request Password Reset OTP
   */
  static async requestPasswordReset(email) {
    if (!email) {
      const err = new Error('Email is required');
      err.statusCode = 400;
      throw err;
    }

    const user = await UserModel.findByEmail(email.trim().toLowerCase());
    if (!user) {
      const err = new Error('No account found with this email address');
      err.statusCode = 404;
      throw err;
    }

    // Generate 6-digit numeric OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // Invalidate prior unused tokens for this email
    await pool.execute('UPDATE password_resets SET used = 1 WHERE email = ?', [user.email]);

    // Store new OTP in database
    await pool.execute(
      'INSERT INTO password_resets (email, otp_code, token, expires_at, used) VALUES (?, ?, ?, ?, 0)',
      [user.email, otpCode, token, expiresAt]
    );

    // Send email via Titan Email
    await EmailService.sendPasswordResetOtp({
      to: user.email,
      name: user.name,
      otpCode,
      expiresMinutes: 15,
    });

    return {
      success: true,
      message: `A 6-digit verification code has been sent to ${user.email}`,
      email: user.email,
      token,
    };
  }

  /**
   * Verify Reset OTP Code
   */
  static async verifyResetCode({ email, code }) {
    if (!email || !code) {
      const err = new Error('Email and verification code are required');
      err.statusCode = 400;
      throw err;
    }

    const [rows] = await pool.execute(
      'SELECT id, email, otp_code, expires_at FROM password_resets WHERE email = ? AND otp_code = ? AND used = 0 AND expires_at > NOW() ORDER BY id DESC LIMIT 1',
      [email.trim().toLowerCase(), String(code).trim()]
    );

    if (!rows || rows.length === 0) {
      const err = new Error('Invalid or expired verification code');
      err.statusCode = 400;
      throw err;
    }

    return { success: true, message: 'Verification code is valid' };
  }

  /**
   * Reset Password with Verified Code
   */
  static async resetPasswordWithCode({ email, code, newPassword }) {
    if (!email || !code || !newPassword) {
      const err = new Error('Email, code, and new password are required');
      err.statusCode = 400;
      throw err;
    }

    if (newPassword.length < 6) {
      const err = new Error('Password must be at least 6 characters long');
      err.statusCode = 400;
      throw err;
    }

    const [resets] = await pool.execute(
      'SELECT id, email FROM password_resets WHERE email = ? AND otp_code = ? AND used = 0 AND expires_at > NOW() ORDER BY id DESC LIMIT 1',
      [email.trim().toLowerCase(), String(code).trim()]
    );

    if (!resets || resets.length === 0) {
      const err = new Error('Invalid or expired verification code');
      err.statusCode = 400;
      throw err;
    }

    const user = await UserModel.findByEmail(email.trim().toLowerCase());
    if (!user) {
      const err = new Error('User account not found');
      err.statusCode = 404;
      throw err;
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update in users table
    await UserModel.updatePassword(user.id, hashedPassword);

    // Mark reset code as used
    await pool.execute('UPDATE password_resets SET used = 1 WHERE id = ?', [resets[0].id]);

    // Send confirmation email
    try {
      await EmailService.sendPasswordResetSuccess({
        to: user.email,
        name: user.name,
      });
    } catch (e) {
      console.warn('Confirmation email sending notice:', e.message);
    }

    return {
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.',
    };
  }
}

module.exports = AuthService;

