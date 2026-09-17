const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');
const { pool } = require('../config/db');

/**
 * Middleware to authenticate requests using JWT Bearer Token
 * Validates token signature AND verifies that the device session has not been revoked
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Access denied. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return errorResponse(res, 'Invalid token format.', 401);
    }

    const decoded = verifyToken(token);

    // If token has a sessionId, verify that the session is still active in database
    if (decoded && decoded.sessionId) {
      try {
        const [sess] = await pool.execute(
          'SELECT id FROM user_sessions WHERE id = ? AND user_id = ? LIMIT 1',
          [decoded.sessionId, decoded.id]
        );
        if (!sess || sess.length === 0) {
          return errorResponse(res, 'Session has been revoked. Please log in again.', 401);
        }
      } catch (dbErr) {
        console.warn('Session verification notice in authMiddleware:', dbErr.message);
      }
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token has expired. Please log in again.', 401);
    }
    return errorResponse(res, 'Invalid or corrupted token.', 401);
  }
}

/**
 * Middleware for role-based authorization
 * @param {string[]} roles
 */
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(res, 'Forbidden: You do not have permission to perform this action', 403);
    }
    next();
  };
}

module.exports = {
  authenticate,
  authorizeRoles,
};
