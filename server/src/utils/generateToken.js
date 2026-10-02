const jwt = require('jsonwebtoken');

/**
 * Generates a signed JSON Web Token for authenticated users
 * @param {string} id - User's MongoDB ObjectId
 * @param {string} role - User role ('customer' | 'admin')
 * @returns {string} Signed JWT token
 */
const generateToken = (id, role = 'customer') => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'supersecret_ecom_jwt_key_2026',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

module.exports = generateToken;
