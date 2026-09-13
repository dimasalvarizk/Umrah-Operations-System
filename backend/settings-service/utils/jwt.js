const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_umrah_operations_2026_secure';

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  verifyToken,
};
