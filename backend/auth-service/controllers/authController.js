const AuthService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/response');
const { extractClientIp } = require('../utils/geoIpHelper');

class AuthController {
  /**
   * Handle user registration
   * POST /api/auth/register
   */
  static async register(req, res) {
    try {
      const { name, email, password, role, phone } = req.body;

      // Validation
      if (!name || !email || !password) {
        return errorResponse(res, 'Name, email, and password are required', 400);
      }

      if (password.length < 6) {
        return errorResponse(res, 'Password must be at least 6 characters long', 400);
      }

      const result = await AuthService.register({ name, email, password, role, phone });
      return successResponse(res, 'Registration successful', result, 201);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  /**
   * Handle user login
   * POST /api/auth/login
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const ip = extractClientIp(req);
      const userAgent = req.headers['user-agent'] || '';

      // Validation
      if (!email || !password) {
        return errorResponse(res, 'Email and password are required', 400);
      }

      const result = await AuthService.login({ email, password, ip, userAgent, req });
      return successResponse(res, 'Login successful', result, 200);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  /**
   * Get current authenticated user details
   * GET /api/auth/me
   */
  static async getMe(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return errorResponse(res, 'Unauthorized access', 401);
      }

      const user = await AuthService.getProfile(userId);
      return successResponse(res, 'User profile fetched successfully', { user }, 200);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  /**
   * Update current authenticated user profile
   * PUT /api/auth/profile
   */
  static async updateProfile(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return errorResponse(res, 'Unauthorized access', 401);
      }

      const { name, phone, avatar, employeeId, branch, department, jobTitle } = req.body;
      const user = await AuthService.updateProfile(userId, {
        name,
        phone,
        avatar,
        employeeId,
        branch,
        department,
        jobTitle,
      });

      return successResponse(res, 'Profile updated successfully', { user }, 200);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  /**
   * Change current user password
   * PUT /api/auth/change-password
   */
  static async changePassword(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return errorResponse(res, 'Unauthorized access', 401);
      }

      const { currentPassword, newPassword } = req.body;
      const result = await AuthService.changePassword(userId, { currentPassword, newPassword });
      return successResponse(res, result.message, null, 200);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  /**
   * Get active sessions for current user
   * GET /api/auth/sessions
   */
  static async getSessions(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return errorResponse(res, 'Unauthorized access', 401);
      }

      const ip = extractClientIp(req);
      const userAgent = req.headers['user-agent'] || '';

      const sessions = await AuthService.getActiveSessions(userId, ip, userAgent);
      return successResponse(res, 'Active sessions fetched', { sessions }, 200);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  /**
   * Revoke an active session
   * DELETE /api/auth/sessions/:id
   */
  static async revokeSession(req, res) {
    try {
      const userId = req.user?.id;
      const sessionId = req.params.id;
      if (!userId || !sessionId) {
        return errorResponse(res, 'Invalid request', 400);
      }

      const result = await AuthService.revokeSession(sessionId, userId);
      return successResponse(res, result.message, null, 200);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  /**
   * Get login activity audit logs
   * GET /api/auth/login-logs
   */
  static async getLoginLogs(req, res) {
    try {
      const userId = req.user?.id;
      const email = req.user?.email || '';
      if (!userId) {
        return errorResponse(res, 'Unauthorized access', 401);
      }

      const clientIp = extractClientIp(req);
      const logs = await AuthService.getLoginLogs(userId, email, clientIp);
      return successResponse(res, 'Login activity logs fetched', { logs }, 200);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  /**
   * Request password reset OTP
   * POST /api/auth/forgot-password
   */
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return errorResponse(res, 'Email is required', 400);
      }

      const result = await AuthService.requestPasswordReset(email);
      return successResponse(res, result.message, { email: result.email }, 200);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  /**
   * Verify password reset OTP code
   * POST /api/auth/verify-reset-code
   */
  static async verifyResetCode(req, res) {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        return errorResponse(res, 'Email and verification code are required', 400);
      }

      const result = await AuthService.verifyResetCode({ email, code });
      return successResponse(res, result.message, result, 200);
    } catch (error) {
      const statusCode = error.statusCode || 400;
      return errorResponse(res, error.message, statusCode);
    }
  }

  /**
   * Reset password with verified code
   * POST /api/auth/reset-password
   */
  static async resetPassword(req, res) {
    try {
      const { email, code, newPassword } = req.body;
      if (!email || !code || !newPassword) {
        return errorResponse(res, 'Email, code, and new password are required', 400);
      }

      if (newPassword.length < 6) {
        return errorResponse(res, 'Password must be at least 6 characters long', 400);
      }

      const result = await AuthService.resetPasswordWithCode({ email, code, newPassword });
      return successResponse(res, result.message, result, 200);
    } catch (error) {
      const statusCode = error.statusCode || 400;
      return errorResponse(res, error.message, statusCode);
    }
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  static async logout(req, res) {
    return successResponse(res, 'Logged out successfully', null, 200);
  }
}

module.exports = AuthController;

