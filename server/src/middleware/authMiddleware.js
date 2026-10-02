const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware: Verifies Bearer JWT and attaches decoded user to req.user
 */
const authMiddleware = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'supersecret_ecom_jwt_key_2026'
      );

      // Attach user payload (id, role) to request
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        role: decoded.role
      };

      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed or expired'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided in Authorization header'
    });
  }
};

module.exports = authMiddleware;
