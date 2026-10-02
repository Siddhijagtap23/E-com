/**
 * Admin Middleware: Ensures authenticated user has administrative privileges
 */
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied: Administrative privileges required'
  });
};

module.exports = adminMiddleware;
