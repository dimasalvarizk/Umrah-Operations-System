const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');
const { pool } = require('../config/db');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Access denied. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

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
        console.warn('Session verification notice in settings authMiddleware:', dbErr.message);
      }
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token has expired. Please log in again.', 401);
    }
    return errorResponse(res, 'Invalid token.', 401);
  }
}

module.exports = {
  authenticate,
};
